import { defineStore } from "pinia";
import type {
  DesignationAttorneyResponseDTO,
  PersonJuridicDTO,
  PersonNaturalDTO,
  UpdateDesignationAttorneyDTO,
} from "~/core/hexag/juntas/application/dtos/designation-attorney.dto";
import { CreateDesignationAttorneyUseCase } from "~/core/hexag/juntas/application/use-cases/designation-attorney/create-designation-attorney.use-case";
import { DeleteDesignationAttorneyUseCase } from "~/core/hexag/juntas/application/use-cases/designation-attorney/delete-designation-attorney.use-case";
import { GetDesignationAttorneyUseCase } from "~/core/hexag/juntas/application/use-cases/designation-attorney/get-designation-attorney.use-case";
import { UpdateDesignationAttorneyUseCase } from "~/core/hexag/juntas/application/use-cases/designation-attorney/update-designation-attorney.use-case";
import { DesignationAttorneyHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/designation-attorney.http.repository";
import { useRemocionApoderadosStore } from "~/core/presentation/juntas/puntos-acuerdo/remocion-apoderados/stores/useRemocionApoderadosStore";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

/**
 * Store para Nombramiento de Apoderados
 *
 * Responsabilidades:
 * - Gestionar múltiples apoderados designados
 * - Cargar apoderados disponibles desde snapshot (filtrando removidos aprobados)
 * - Crear nuevos apoderados (POST /designation-attorney)
 * - Obtener clases de apoderados disponibles desde snapshot
 *
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 */
export const useNombramientoApoderadosStore = defineStore("nombramientoApoderados", {
  // ✅ PERSISTENCIA: Guardar en localStorage
  persist: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    key: "probo-nombramiento-apoderados",
  },

  state: () => ({
    /** Array de apoderados designados */
    apoderadosDesignados: [] as DesignationAttorneyResponseDTO[],

    /** Estado de carga */
    status: "idle" as "idle" | "loading" | "error",
    errorMessage: null as string | null,
  }),

  getters: {
    /**
     * Verificar si hay apoderados designados
     */
    hasApoderadosDesignados(): boolean {
      return this.apoderadosDesignados.length > 0;
    },

    /**
     * Obtener apoderados disponibles desde snapshot (filtrando removidos aprobados)
     * ⚠️ IMPORTANTE: Solo filtrar apoderados con estado "ELEGIDO" en remoción
     */
    apoderadosDisponibles(): DesignationAttorneyResponseDTO[] {
      const snapshotStore = useSnapshotStore();
      const remocionStore = useRemocionApoderadosStore();

      const todosApoderados = snapshotStore.snapshot?.attorneys || [];

      // Obtener IDs de apoderados removidos y aprobados
      const removidosAprobados = remocionStore.candidatos
        .filter((c) => c.estado === "ELEGIDO") // Solo los aprobados
        .map((c) => c.id); // El id del registro de remoción ES el attorneyId

      // Filtrar apoderados removidos
      return todosApoderados.filter((apoderado) => !removidosAprobados.includes(apoderado.id));
    },

    /**
     * Obtener apoderados para extender poderes
     * Incluye apoderados del snapshot (filtrados) + apoderados ya designados
     */
    apoderadosParaExtenderPoderes(): DesignationAttorneyResponseDTO[] {
      const delSnapshot = this.apoderadosDisponibles;
      const designados = this.apoderadosDesignados;

      // Combinar y deduplicar por ID
      const todos = [...delSnapshot, ...designados];
      const mapa = new Map<string, DesignationAttorneyResponseDTO>();
      todos.forEach((apoderado) => {
        if (!mapa.has(apoderado.id)) {
          mapa.set(apoderado.id, apoderado);
        }
      });

      return Array.from(mapa.values());
    },

    /**
     * Obtener apoderados designados que son candidatos (isCandidate: true)
     * Para otorgamiento de poderes
     */
    apoderadosCandidatos(): DesignationAttorneyResponseDTO[] {
      return this.apoderadosDesignados.filter((apoderado) => apoderado.isCandidate === true);
    },

    /**
     * Obtener clases de apoderados disponibles desde snapshot
     * Excluye "Gerente General" y "Otros Apoderados" (se manejan por separado)
     */
    clasesApoderadosDisponibles() {
      const snapshotStore = useSnapshotStore();
      const snapshot = snapshotStore.snapshot;

      if (!snapshot) {
        console.warn(
          "[Store][NombramientoApoderados] No hay snapshot disponible para obtener clases de apoderados"
        );
        return [];
      }

      const attorneyClasses = snapshot.attorneyClasses || [];

      // Filtrar clases especiales (se manejan por separado)
      return attorneyClasses.filter(
        (clase) => clase.name !== "Gerente General" && clase.name !== "Otros Apoderados"
      );
    },
  },

  actions: {
    /**
     * Cargar apoderados designados desde backend
     * GET /designation-attorney
     */
    async loadApoderadosDesignados(societyId: number, flowId: number): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new DesignationAttorneyHttpRepository();
        const useCase = new GetDesignationAttorneyUseCase(repository);
        const apoderados = await useCase.execute(societyId, flowId);

        // Excluir "Gerente General" (se maneja en su propio store)
        const gerenteGeneralClassId = this.getGerenteGeneralClassId();
        const apoderadosSinGerente = gerenteGeneralClassId
          ? apoderados.filter(
              (apoderado) => apoderado.attorneyClassId !== gerenteGeneralClassId
            )
          : apoderados;

        this.apoderadosDesignados = apoderadosSinGerente;

        console.log("[Store][NombramientoApoderados] Apoderados designados cargados:", {
          count: this.apoderadosDesignados.length,
          apoderados: this.apoderadosDesignados,
        });

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][NombramientoApoderados] Error al cargar apoderados:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar apoderados";
        // No lanzar error, simplemente dejar array vacío
        this.apoderadosDesignados = [];
        this.status = "idle";
      }
    },

    /**
     * Crear nuevo apoderado
     * POST /designation-attorney
     */
    async createApoderado(
      societyId: number,
      flowId: number,
      attorneyClassId: string,
      person: PersonNaturalDTO | PersonJuridicDTO
    ): Promise<DesignationAttorneyResponseDTO> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new DesignationAttorneyHttpRepository();
        const useCase = new CreateDesignationAttorneyUseCase(repository);

        const dto = {
          attorneyClassId,
          person,
        };

        console.log("[Store][NombramientoApoderados] Creando apoderado con:", {
          attorneyClassId,
          hasPerson: !!person,
        });

        await useCase.execute(societyId, flowId, dto);

        console.log("[Store][NombramientoApoderados] ✅ Apoderado creado exitosamente");

        // Recargar datos para obtener el apoderado creado
        await this.loadApoderadosDesignados(societyId, flowId);

        // Obtener el apoderado recién creado
        const apoderadoCreado = this.apoderadosDesignados.find(
          (a) => a.attorneyClassId === attorneyClassId
        );

        if (!apoderadoCreado) {
          throw new Error("No se pudo obtener el apoderado recién creado");
        }

        this.status = "idle";
        return apoderadoCreado;
      } catch (error: any) {
        console.error("[Store][NombramientoApoderados] Error al crear apoderado:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al crear apoderado";
        throw error;
      }
    },

    /**
     * Crear "Otros Apoderados" (usa apoderadoEspecialId en lugar de attorneyClassId)
     * POST /designation-attorney
     * ⚠️ NOTA: Verificar si el backend acepta apoderadoEspecialId en el DTO
     */
    async createOtrosApoderados(
      societyId: number,
      flowId: number,
      apoderadoEspecialId: string,
      person: PersonNaturalDTO | PersonJuridicDTO
    ): Promise<DesignationAttorneyResponseDTO> {
      // Por ahora, reutilizar createApoderado pero necesitamos obtener el ID de "Otros Apoderados"
      // TODO: Verificar si el backend acepta apoderadoEspecialId directamente
      const otrosApoderadosClassId = this.getOtrosApoderadosClassId();
      if (!otrosApoderadosClassId) {
        throw new Error(
          "No se pudo obtener la clase de apoderado 'Otros Apoderados'. Por favor, verifique que el snapshot esté cargado."
        );
      }

      return this.createApoderado(societyId, flowId, otrosApoderadosClassId, person);
    },

    /**
     * Actualizar estado de apoderado designado (marcar/desmarcar)
     * PUT /designation-attorney
     *
     * @param designationId - ID del registro de designación (DesignationAttorneyResponseDTO.id)
     * @param candidatoEstado - "CANDIDATO" (marcar), "DESMARCAR" (desmarcar), "ELEGIDO", "NO_ELEGIDO"
     */
    async actualizarEstado(
      societyId: number,
      flowId: number,
      designationId: string,
      candidatoEstado: "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR"
    ): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new DesignationAttorneyHttpRepository();
        const useCase = new UpdateDesignationAttorneyUseCase(repository);

        // Obtener el apoderado para obtener attorneyClassId
        const apoderado = this.apoderadosDesignados.find((a) => a.id === designationId);
        if (!apoderado) {
          throw new Error(`No se encontró el apoderado con ID ${designationId}`);
        }

        const dto: UpdateDesignationAttorneyDTO = {
          attorneyId: designationId, // ⚠️ ID del registro de designación
          attorneyClassId: apoderado.attorneyClassId,
          candidatoEstado,
        };

        console.log(
          `[Store][NombramientoApoderados] Actualizando estado para apoderado ${designationId}: ${candidatoEstado}`
        );

        await useCase.execute(societyId, flowId, dto);

        console.log(
          `[Store][NombramientoApoderados] ✅ Estado actualizado para apoderado ${designationId}: ${candidatoEstado}`
        );

        // Recargar apoderados para obtener datos actualizados
        await this.loadApoderadosDesignados(societyId, flowId);

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][NombramientoApoderados] Error al actualizar estado:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al actualizar estado";
        throw error;
      }
    },

    /**
     * Obtener attorneyClassId de clase "Gerente General" desde snapshot
     */
    getGerenteGeneralClassId(): string | null {
      const snapshotStore = useSnapshotStore();
      const snapshot = snapshotStore.snapshot;

      if (!snapshot) {
        return null;
      }

      const attorneyClasses = snapshot.attorneyClasses || [];
      const claseGerenteGeneral = attorneyClasses.find(
        (clase) => clase.name === "Gerente General"
      );

      if (claseGerenteGeneral) {
        return claseGerenteGeneral.id;
      }

      return null;
    },

    /**
     * Obtener attorneyClassId de clase "Otros Apoderados" desde snapshot
     */
    getOtrosApoderadosClassId(): string | null {
      const snapshotStore = useSnapshotStore();
      const snapshot = snapshotStore.snapshot;

      if (!snapshot) {
        return null;
      }

      const attorneyClasses = snapshot.attorneyClasses || [];
      const claseOtrosApoderados = attorneyClasses.find(
        (clase) => clase.name === "Otros Apoderados"
      );

      if (claseOtrosApoderados) {
        return claseOtrosApoderados.id;
      }

      return null;
    },

    /**
     * Eliminar apoderado designado
     * DELETE /designation-attorney/:designationId
     */
    async deleteApoderado(
      societyId: number,
      flowId: number,
      designationId: string
    ): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new DesignationAttorneyHttpRepository();
        const useCase = new DeleteDesignationAttorneyUseCase(repository);

        console.log(
          `[Store][NombramientoApoderados] Eliminando apoderado designado ${designationId}`
        );

        await useCase.execute(societyId, flowId, designationId);

        console.log(
          `[Store][NombramientoApoderados] ✅ Apoderado designado ${designationId} eliminado exitosamente`
        );

        // Recargar apoderados para actualizar la lista
        await this.loadApoderadosDesignados(societyId, flowId);

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][NombramientoApoderados] Error al eliminar apoderado:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al eliminar apoderado";
        throw error;
      }
    },
  },
});
