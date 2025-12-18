import { defineStore } from "pinia";
import type {
  DesignationAttorneyResponseDTO,
  PersonJuridicDTO,
  PersonNaturalDTO,
} from "~/core/hexag/juntas/application/dtos/designation-attorney.dto";
import { CreateDesignationAttorneyUseCase } from "~/core/hexag/juntas/application/use-cases/designation-attorney/create-designation-attorney.use-case";
import { GetDesignationAttorneyUseCase } from "~/core/hexag/juntas/application/use-cases/designation-attorney/get-designation-attorney.use-case";
import { UpdateDesignationAttorneyUseCase } from "~/core/hexag/juntas/application/use-cases/designation-attorney/update-designation-attorney.use-case";
import { DesignationAttorneyHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/designation-attorney.http.repository";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

/**
 * Store para Nombramiento de Gerente General
 *
 * Responsabilidades:
 * - Gestionar datos del gerente general a nombrar
 * - Cargar datos existentes (GET - retorna null/vacío al inicio)
 * - Crear nuevo gerente general (POST)
 * - Obtener attorneyClassId de clase "Gerente General" desde snapshot
 *
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 */
export const useNombramientoGerenteStore = defineStore("nombramientoGerente", {
  // ✅ PERSISTENCIA: Guardar en localStorage
  persist: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    key: "probo-nombramiento-gerente",
  },

  state: () => ({
    /** Gerente general designado (null al inicio - es un nuevo nombramiento) */
    gerenteDesignado: null as DesignationAttorneyResponseDTO | null,

    /** Estado de carga */
    status: "idle" as "idle" | "loading" | "error",
    errorMessage: null as string | null,
  }),

  getters: {
    /**
     * Verificar si hay gerente designado
     */
    hasGerenteDesignado(): boolean {
      return this.gerenteDesignado !== null;
    },

    /**
     * ✅ COMPATIBILIDAD: Verificar si hay un gerente nombrado
     * Alias para mantener compatibilidad con código existente
     */
    tieneGerenteNombrado(): boolean {
      return this.gerenteDesignado !== null;
    },

    /**
     * ✅ COMPATIBILIDAD: Obtener nombre completo del gerente nombrado
     * Convierte gerenteDesignado (DTO) al formato esperado por resumen.vue y controller
     */
    nombreCompletoGerente(): string {
      if (!this.gerenteDesignado || !this.gerenteDesignado.person) return "";

      const person = this.gerenteDesignado.person;
      if (person.type === "NATURAL" && person.natural) {
        return `${person.natural.firstName} ${person.natural.lastNamePaternal} ${
          person.natural.lastNameMaternal || ""
        }`.trim();
      } else if (person.type === "JURIDIC" && person.juridic) {
        return person.juridic.businessName;
      }

      return "";
    },

    /**
     * ✅ COMPATIBILIDAD: Obtener gerente nombrado en formato legacy
     * Convierte gerenteDesignado (DTO) al formato esperado por resumen.vue
     */
    gerenteNombrado(): {
      nombreCompleto: string;
      tipoPersona: "natural" | "juridica";
      personaNatural: {
        tipoDocumento: string;
        numeroDocumento: string;
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string;
        paisPasaporte?: string;
      } | null;
      personaJuridica: {
        seConstituyoEnPeru: boolean;
        tipoDocumento: string;
        numeroDocumento: string;
        razonSocial: string;
        nombreComercial?: string;
        direccion: string;
        distrito?: string;
        provincia?: string;
        departamento?: string;
        paisOrigen?: string;
        tieneRepresentante: boolean;
      } | null;
      representante?: {
        tipoDocumento: string;
        numeroDocumento: string;
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string;
        paisPasaporte?: string;
      } | null;
    } | null {
      if (!this.gerenteDesignado || !this.gerenteDesignado.person) return null;

      const person = this.gerenteDesignado.person;
      const nombreCompleto = this.nombreCompletoGerente;

      if (person.type === "NATURAL" && person.natural) {
        return {
          nombreCompleto,
          tipoPersona: "natural" as const,
          personaNatural: {
            tipoDocumento: person.natural.typeDocument,
            numeroDocumento: person.natural.documentNumber,
            nombre: person.natural.firstName,
            apellidoPaterno: person.natural.lastNamePaternal,
            apellidoMaterno: person.natural.lastNameMaternal || "",
            paisPasaporte: person.natural.issuingCountry || undefined,
          },
          personaJuridica: null,
          representante: null, // TODO: Si el backend incluye representante en el DTO, mapearlo aquí
        };
      } else if (person.type === "JURIDIC" && person.juridic) {
        // ⚠️ NOTA: El DTO no incluye todos los campos de persona jurídica (dirección, distrito, etc.)
        // Por ahora, mapeamos solo los campos disponibles
        return {
          nombreCompleto,
          tipoPersona: "juridica" as const,
          personaNatural: null,
          personaJuridica: {
            seConstituyoEnPeru: true, // ⚠️ Asumimos que está constituido en Perú si tiene RUC
            tipoDocumento: person.juridic.typeDocument,
            numeroDocumento: person.juridic.documentNumber,
            razonSocial: person.juridic.businessName,
            nombreComercial: undefined, // No está en el DTO
            direccion: "", // No está en el DTO
            distrito: undefined,
            provincia: undefined,
            departamento: undefined,
            paisOrigen: person.juridic.issuingCountry || undefined,
            tieneRepresentante: false, // ⚠️ No está en el DTO, asumimos false por defecto
          },
          representante: null, // TODO: Si el backend incluye representante en el DTO, mapearlo aquí
        };
      }

      return null;
    },

    /**
     * Obtener attorneyClassId de clase "Gerente General" desde snapshot
     */
    getGerenteGeneralClassId(): string | null {
      const snapshotStore = useSnapshotStore();
      const snapshot = snapshotStore.snapshot;

      if (!snapshot) {
        console.warn(
          "[Store][NombramientoGerente] No hay snapshot disponible para obtener clase Gerente General"
        );
        return null;
      }

      // Buscar la clase "Gerente General" en attorneyClasses del snapshot
      const attorneyClasses = snapshot.attorneyClasses || [];
      const claseGerenteGeneral = attorneyClasses.find(
        (clase) => clase.name === "Gerente General"
      );

      if (claseGerenteGeneral) {
        return claseGerenteGeneral.id;
      }

      // Fallback: buscar en gerenteGeneral del snapshot
      const gerenteGeneral = snapshot.gerenteGeneral;
      if (gerenteGeneral && gerenteGeneral.claseApoderadoId) {
        return gerenteGeneral.claseApoderadoId;
      }

      console.warn(
        "[Store][NombramientoGerente] No se encontró clase Gerente General en snapshot"
      );
      return null;
    },
  },

  actions: {
    /**
     * Obtener attorneyId del gerente general del snapshot
     * ⚠️ IMPORTANTE: Este es el ID del apoderado (attorney), no el ID de la persona
     */
    getGerenteGeneralSnapshotAttorneyId(): string | null {
      const snapshotStore = useSnapshotStore();
      const snapshot = snapshotStore.snapshot;

      if (!snapshot || !snapshot.gerenteGeneral) {
        return null;
      }

      const gerente = snapshot.gerenteGeneral;
      // El ID del apoderado (attorneyId) está en gerente.id
      return gerente.id || null;
    },

    /**
     * Obtener person.id del gerente general del snapshot
     */
    getGerenteGeneralSnapshotPersonId(): string | null {
      const snapshotStore = useSnapshotStore();
      const snapshot = snapshotStore.snapshot;

      if (!snapshot || !snapshot.gerenteGeneral) {
        return null;
      }

      const gerente = snapshot.gerenteGeneral;
      // PersonaNatural y PersonaJuridica tienen id
      return gerente.persona.id || null;
    },

    /**
     * Verificar si un apoderado es el nuevo gerente de la junta (diferente al del snapshot)
     */
    esNuevoGerenteDeJunta(apoderado: DesignationAttorneyResponseDTO): boolean {
      const snapshotPersonId = this.getGerenteGeneralSnapshotPersonId();

      if (!snapshotPersonId) {
        // Si no hay gerente en snapshot, cualquier apoderado es nuevo
        return true;
      }

      // Si el person.id es diferente al del snapshot, es el nuevo gerente
      return apoderado.person.id !== snapshotPersonId;
    },

    /**
     * Cargar datos del gerente general designado
     * GET /designation-attorney
     *
     * Flujo:
     * 1. Hace GET para obtener apoderados designados
     * 2. Filtra por clase "Gerente General"
     * 3. Verifica si existe un nuevo gerente (person.id diferente al del snapshot)
     * 4. Si existe → lo carga
     * 5. Si NO existe → retorna null (se creará con POST)
     */
    async loadGerente(societyId: number, flowId: number): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const repository = new DesignationAttorneyHttpRepository();
        const useCase = new GetDesignationAttorneyUseCase(repository);
        const apoderados = await useCase.execute(societyId, flowId);

        // Filtrar por clase "Gerente General"
        const gerenteGeneralClassId = this.getGerenteGeneralClassId;
        if (!gerenteGeneralClassId) {
          console.warn(
            "[Store][NombramientoGerente] No se pudo obtener attorneyClassId de Gerente General"
          );
          this.gerenteDesignado = null;
          this.status = "idle";
          return;
        }

        // Filtrar apoderados de clase "Gerente General"
        const gerentes = apoderados.filter(
          (apoderado) => apoderado.attorneyClassId === gerenteGeneralClassId
        );

        // Buscar el nuevo gerente de la junta (diferente al del snapshot)
        const nuevoGerente = gerentes.find((gerente) => this.esNuevoGerenteDeJunta(gerente));

        this.gerenteDesignado = nuevoGerente || null;

        console.log("[Store][NombramientoGerente] Gerente cargado:", {
          hasGerente: this.gerenteDesignado !== null,
          gerente: this.gerenteDesignado,
          snapshotPersonId: this.getGerenteGeneralSnapshotPersonId(),
          totalGerentes: gerentes.length,
        });

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][NombramientoGerente] Error al cargar gerente:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar gerente";
        // No lanzar error, simplemente dejar null (es un nuevo nombramiento)
        this.gerenteDesignado = null;
        this.status = "idle";
      }
    },

    /**
     * Crear nuevo gerente general con datos vacíos/mínimos
     * POST /designation-attorney
     * Se ejecuta automáticamente al montar si no existe un nuevo gerente
     */
    async createGerenteVacio(societyId: number, flowId: number): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const gerenteGeneralClassId = this.getGerenteGeneralClassId;
        if (!gerenteGeneralClassId) {
          throw new Error(
            "No se pudo obtener la clase de apoderado 'Gerente General'. Por favor, verifique que el snapshot esté cargado."
          );
        }

        const repository = new DesignationAttorneyHttpRepository();
        const useCase = new CreateDesignationAttorneyUseCase(repository);

        // Crear con datos mínimos/vacíos (strings vacíos, no null)
        // ⚠️ NO incluir campos de cónyuge (no aplica para apoderados/gerentes/directores)
        const person: PersonNaturalDTO = {
          typeDocument: "DNI",
          documentNumber: "",
          issuingCountry: null,
          firstName: "",
          lastNamePaternal: "",
          lastNameMaternal: "",
        };

        const dto = {
          attorneyClassId: gerenteGeneralClassId,
          person,
        };

        await useCase.execute(societyId, flowId, dto);

        console.log("[Store][NombramientoGerente] ✅ Gerente vacío creado exitosamente");

        // Recargar datos para obtener el gerente creado
        await this.loadGerente(societyId, flowId);

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][NombramientoGerente] Error al crear gerente vacío:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al crear gerente vacío";
        throw error;
      }
    },

    /**
     * Crear nuevo gerente general con datos del formulario
     * POST /designation-attorney
     * Se ejecuta cuando el usuario hace clic en "Siguiente" y NO hay gerente designado
     */
    async createGerente(
      societyId: number,
      flowId: number,
      person: PersonNaturalDTO | PersonJuridicDTO
    ): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const gerenteGeneralClassId = this.getGerenteGeneralClassId;
        if (!gerenteGeneralClassId) {
          throw new Error(
            "No se pudo obtener la clase de apoderado 'Gerente General'. Por favor, verifique que el snapshot esté cargado."
          );
        }

        const repository = new DesignationAttorneyHttpRepository();
        const useCase = new CreateDesignationAttorneyUseCase(repository);

        const dto = {
          attorneyClassId: gerenteGeneralClassId,
          person,
        };

        console.log("[Store][NombramientoGerente] Creando gerente con:", {
          attorneyClassId: gerenteGeneralClassId,
          hasPerson: !!person,
        });

        await useCase.execute(societyId, flowId, dto);

        console.log("[Store][NombramientoGerente] ✅ Gerente creado exitosamente");

        // Recargar datos para obtener el gerente creado
        await this.loadGerente(societyId, flowId);

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][NombramientoGerente] Error al crear gerente:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al crear gerente";
        throw error;
      }
    },

    /**
     * Actualizar gerente general (PUT)
     * PUT /designation-attorney
     * Se ejecuta cuando el usuario hace clic en "Siguiente" y YA existe un nuevo gerente
     *
     * Actualiza:
     * - Estado del candidato a "CANDIDATO"
     * - Datos de la persona (si el backend lo acepta)
     *
     * ⚠️ IMPORTANTE: El attorneyId debe ser el ID del NUEVO gerente (el que se creó), no el del snapshot
     */
    async updateGerente(
      societyId: number,
      flowId: number,
      person: PersonNaturalDTO | PersonJuridicDTO
    ): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        // Verificar que existe un gerente designado (el nuevo gerente creado)
        if (!this.gerenteDesignado) {
          throw new Error(
            "No hay un gerente general designado. Por favor, complete el formulario primero."
          );
        }

        const repository = new DesignationAttorneyHttpRepository();
        const updateUseCase = new UpdateDesignationAttorneyUseCase(repository);

        // PUT actualiza estado y datos de la persona
        // ⚠️ El attorneyId debe ser el del NUEVO gerente (el que se creó con POST)
        // ⚠️ El mapper necesita attorneyClassId, lo obtenemos del gerente designado
        const dto = {
          attorneyId: this.gerenteDesignado.id, // ⚠️ ID del NUEVO gerente (el que se creó)
          attorneyClassId: this.gerenteDesignado.attorneyClassId, // Necesario para el mapper
          candidatoEstado: "CANDIDATO" as const,
          person, // Incluir datos de la persona para actualizar (sin campos de cónyuge)
        };

        console.log("[Store][NombramientoGerente] Actualizando gerente con:", {
          attorneyId: this.gerenteDesignado.id,
          attorneyClassId: this.gerenteDesignado.attorneyClassId,
          hasPerson: !!person,
          nuevoGerenteId: this.gerenteDesignado.id,
        });

        await updateUseCase.execute(societyId, flowId, dto);

        console.log("[Store][NombramientoGerente] ✅ Gerente actualizado exitosamente");

        // Recargar datos para obtener el gerente actualizado
        await this.loadGerente(societyId, flowId);

        this.status = "idle";
      } catch (error: any) {
        console.error("[Store][NombramientoGerente] Error al actualizar gerente:", error);
        this.status = "error";
        this.errorMessage = error.message || "Error al actualizar gerente";
        throw error;
      }
    },

    /**
     * Resetear estado
     */
    reset() {
      this.gerenteDesignado = null;
      this.status = "idle";
      this.errorMessage = null;
    },
  },
});
