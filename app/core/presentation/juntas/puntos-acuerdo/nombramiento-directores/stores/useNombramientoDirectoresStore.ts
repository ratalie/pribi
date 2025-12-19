import { defineStore } from "pinia";
import type {
  CreateDesignationDirectorDTO,
  DesignationDirectorResponseDTO,
  PersonJuridicDTO,
  PersonNaturalDTO,
  UpdateDesignationDirectorDTO,
} from "~/core/hexag/juntas/application/dtos/designation-director.dto";
import { CreateDesignationDirectorUseCase } from "~/core/hexag/juntas/application/use-cases/designation-director/create-designation-director.use-case";
import { GetDesignationDirectorUseCase } from "~/core/hexag/juntas/application/use-cases/designation-director/get-designation-director.use-case";
import { UpdateDesignationDirectorUseCase } from "~/core/hexag/juntas/application/use-cases/designation-director/update-designation-director.use-case";
import { DesignationDirectorHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/designation-director.http.repository";
import { useRemocionDirectoresStore } from "~/core/presentation/juntas/puntos-acuerdo/remocion-directores/stores/useRemocionDirectoresStore";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

/**
 * Store para Nombramiento de Directores
 *
 * Responsabilidades:
 * - Gestionar múltiples directores designados
 * - Cargar directores designados desde backend
 * - Crear nuevos directores (POST /designation-director)
 * - Actualizar estado de directores (PUT /designation-director)
 *
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 */
export const useNombramientoDirectoresStore = defineStore("nombramientoDirectores", {
  // ✅ PERSISTENCIA: Guardar en localStorage
  persist: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    key: "probo-nombramiento-directores",
  },

  state: () => ({
    /** Array de directores designados */
    directoresDesignados: [] as DesignationDirectorResponseDTO[],

    /** Estado de carga */
    status: "idle" as "idle" | "loading" | "error",
    errorMessage: null as string | null,
  }),

  getters: {
    /**
     * Verificar si hay directores designados
     */
    hasDirectoresDesignados(): boolean {
      return this.directoresDesignados.length > 0;
    },

    /**
     * ✅ Obtener directores disponibles desde snapshot (filtrando removidos aprobados)
     * ⚠️ IMPORTANTE: Solo filtrar directores con estado "ELEGIDO" en remoción
     * Estos directores son solo visuales (read-only) y vienen del snapshot
     */
    directoresDisponiblesDelSnapshot(): DesignationDirectorResponseDTO[] {
      const snapshotStore = useSnapshotStore();
      const remocionStore = useRemocionDirectoresStore();

      const todosDirectores = snapshotStore.snapshot?.directors || [];

      // Obtener IDs de directores removidos y aprobados
      // Un director está removido si tiene candidateStatus === "ELECTED" (aprobado en votación de remoción)
      const removidosAprobados = remocionStore.candidatos
        .filter((c) => {
          // Verificar si fue removido aprobado (candidateStatus === "ELECTED")
          return c.candidateStatus === "ELECTED";
        })
        .map((c) => c.id); // El id del registro de remoción ES el directorId

      // Filtrar directores removidos y mapear a DesignationDirectorResponseDTO
      const directoresFiltrados = todosDirectores
        .filter((director) => !removidosAprobados.includes(director.id))
        .map((director) => {
          // Mapear del formato del snapshot al formato DesignationDirectorResponseDTO
          return {
            id: director.id, // ID del director (se usará como directorId)
            directorId: director.id,
            person: {
              id: director.persona.id,
              nombre: director.persona.nombre,
              apellidoPaterno: director.persona.apellidoPaterno,
              apellidoMaterno: director.persona.apellidoMaterno || "",
              tipoDocumento: director.persona.tipoDocumento,
              numeroDocumento: director.persona.numeroDocumento,
            },
            directorRole: director.rolDirector as "TITULAR" | "SUPLENTE" | "ALTERNO",
            isCandidate: false, // Los del snapshot no son candidatos por defecto
            isDesignationCandidate: false,
            isDesignated: true, // Ya están designados
            designationStatus: null, // No tienen estado de designación (vienen del snapshot)
            replacesId: director.reemplazaId || null,
          } as DesignationDirectorResponseDTO;
        });

      return directoresFiltrados;
    },

    /**
     * ✅ Obtener todos los directores (snapshot + designados)
     * Combina directores del snapshot (filtrados) + directores ya designados en este flujo
     */
    todosLosDirectores(): DesignationDirectorResponseDTO[] {
      const delSnapshot = this.directoresDisponiblesDelSnapshot;
      const designados = this.directoresDesignados;

      // Combinar y deduplicar por directorId
      const todos = [...delSnapshot, ...designados];
      const mapa = new Map<string, DesignationDirectorResponseDTO>();
      todos.forEach((director) => {
        // Usar directorId como clave única
        if (!mapa.has(director.directorId)) {
          mapa.set(director.directorId, director);
        }
      });

      return Array.from(mapa.values());
    },

    /**
     * Obtener directores titulares (snapshot + designados)
     */
    directoresTitulares(): DesignationDirectorResponseDTO[] {
      return this.todosLosDirectores.filter((director) => director.directorRole === "TITULAR");
    },

    /**
     * Obtener directores suplentes (snapshot + designados)
     */
    directoresSuplentes(): DesignationDirectorResponseDTO[] {
      return this.todosLosDirectores.filter(
        (director) => director.directorRole === "SUPLENTE"
      );
    },

    /**
     * Obtener directores alternos (snapshot + designados)
     */
    directoresAlternos(): DesignationDirectorResponseDTO[] {
      return this.todosLosDirectores.filter((director) => director.directorRole === "ALTERNO");
    },

    /**
     * Obtener directores que son candidatos (isCandidate: true)
     * Solo los nuevos designados pueden ser candidatos
     */
    directoresCandidatos(): DesignationDirectorResponseDTO[] {
      return this.directoresDesignados.filter((director) => director.isCandidate === true);
    },

    /**
     * Obtener directores titulares que son candidatos (TITULAR + isCandidate: true)
     * Estos son los que pasan a votación acumulativa
     */
    directoresTitularesCandidatos(): DesignationDirectorResponseDTO[] {
      return this.directoresDesignados.filter(
        (director) => director.directorRole === "TITULAR" && director.isCandidate === true
      );
    },
  },

  actions: {
    /**
     * Cargar directores designados desde backend
     * GET /designation-director
     *
     * También carga candidatos de remoción para poder filtrar los removidos aprobados
     */
    async loadDirectoresDesignados(societyId: number, flowId: number): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        // 1. Cargar directores designados en este flujo
        const repository = new DesignationDirectorHttpRepository();
        const useCase = new GetDesignationDirectorUseCase(repository);
        const directores = await useCase.execute(societyId, flowId);

        this.directoresDesignados = directores;

        console.log("[Store][NombramientoDirectores] Directores designados cargados:", {
          count: this.directoresDesignados.length,
          directores: this.directoresDesignados,
        });

        // 2. Cargar candidatos de remoción (si existe remoción)
        // Esto es necesario para filtrar los directores removidos aprobados del snapshot
        try {
          const remocionStore = useRemocionDirectoresStore();
          await remocionStore.loadDirectores(societyId, flowId);
          console.log(
            "[Store][NombramientoDirectores] Candidatos de remoción cargados para filtrar"
          );
        } catch (remocionError) {
          // Si no hay remoción o falla, no es crítico, simplemente no filtraremos
          console.warn(
            "[Store][NombramientoDirectores] No se pudieron cargar candidatos de remoción:",
            remocionError
          );
        }

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][NombramientoDirectores] Error al cargar directores:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar directores";
        // No lanzar error, simplemente dejar array vacío
        this.directoresDesignados = [];
        this.status = "idle";
      }
    },

    /**
     * Crear nuevo director
     * POST /designation-director
     */
    async createDirector(
      societyId: number,
      flowId: number,
      directorRole: "TITULAR" | "SUPLENTE" | "ALTERNO",
      person: PersonNaturalDTO | PersonJuridicDTO,
      replacesId?: string | null
    ): Promise<DesignationDirectorResponseDTO> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new DesignationDirectorHttpRepository();
        const useCase = new CreateDesignationDirectorUseCase(repository);

        const dto: CreateDesignationDirectorDTO = {
          director: {
            person,
            directorRole,
            ...(replacesId ? { replacesId } : {}),
          },
          candidateStatus: "CANDIDATO", // Todos los nuevos directores son candidatos
        };

        console.log("[Store][NombramientoDirectores] Creando director con:", {
          directorRole,
          hasPerson: !!person,
          replacesId,
        });

        await useCase.execute(societyId, flowId, dto);

        console.log("[Store][NombramientoDirectores] ✅ Director creado exitosamente");

        // Recargar datos para obtener el director creado
        await this.loadDirectoresDesignados(societyId, flowId);

        // Obtener el director recién creado (buscando por rol y datos de persona)
        const directorCreado = this.directoresDesignados.find((d) => {
          if (d.directorRole !== directorRole) return false;

          // Comparar por número de documento
          const docNumPerson =
            "documentNumber" in person ? person.documentNumber : person.documentNumber;
          return d.person.numeroDocumento === docNumPerson;
        });

        if (!directorCreado) {
          // Si no se encuentra exacto, devolver el último creado con ese rol
          const ultimosConRol = this.directoresDesignados
            .filter((d) => d.directorRole === directorRole)
            .slice(-1);
          if (ultimosConRol.length > 0) {
            this.status = "idle";
            return ultimosConRol[0];
          }
          throw new Error("No se pudo obtener el director recién creado");
        }

        this.status = "idle";
        return directorCreado;
      } catch (error: any) {
        console.error("[Store][NombramientoDirectores] Error al crear director:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al crear director";
        throw error;
      }
    },

    /**
     * Actualizar estado de director designado
     * PUT /designation-director
     *
     * @param designationId - ID del registro de designación (DesignationDirectorResponseDTO.id)
     * @param candidatoEstado - "ELEGIDO" o "NO_ELEGIDO"
     */
    async updateEstadoDirector(
      societyId: number,
      flowId: number,
      designationId: string,
      candidatoEstado: "ELEGIDO" | "NO_ELEGIDO"
    ): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new DesignationDirectorHttpRepository();
        const useCase = new UpdateDesignationDirectorUseCase(repository);

        const dto: UpdateDesignationDirectorDTO = {
          directorId: designationId,
          candidatoEstado,
        };

        console.log(
          `[Store][NombramientoDirectores] Actualizando estado para director ${designationId}: ${candidatoEstado}`
        );

        await useCase.execute(societyId, flowId, dto);

        console.log(
          `[Store][NombramientoDirectores] ✅ Estado actualizado para director ${designationId}: ${candidatoEstado}`
        );

        // Recargar directores para obtener datos actualizados
        await this.loadDirectoresDesignados(societyId, flowId);

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][NombramientoDirectores] Error al actualizar estado:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al actualizar estado";
        throw error;
      }
    },
  },
});

