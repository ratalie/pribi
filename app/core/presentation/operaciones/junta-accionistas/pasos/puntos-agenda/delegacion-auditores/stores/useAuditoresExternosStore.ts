import { defineStore } from "pinia";
import type { ExternalAuditor } from "~/core/hexag/juntas/domain/entities/external-auditor.entity";

/**
 * Store para Auditores Externos
 *
 * Maneja el estado de la designación de auditores externos:
 * - Responsable de la designación (Junta de Accionistas o Directorio)
 * - Nombre completo del auditor externo (solo si es Junta de Accionistas)
 *
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 */
export const useAuditoresExternosStore = defineStore("auditoresExternos", {
  // ✅ PERSISTENCIA: Guardar en localStorage
  persist: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    key: "probo-auditores-externos",
  },

  state: () => ({
    responsableDesignacion: null as "JUNTA_DE_ACCIONISTAS" | "DIRECTORIO" | null,
    nombreCompletoAuditor: "",
  }),

  getters: {
    /**
     * Verificar si hay datos guardados
     */
    hasData(): boolean {
      return this.responsableDesignacion !== null;
    },

    /**
     * Verificar si se requiere nombre del auditor
     * (solo si el responsable es JUNTA_DE_ACCIONISTAS)
     */
    requiereNombreAuditor(): boolean {
      return this.responsableDesignacion === "JUNTA_DE_ACCIONISTAS";
    },
  },

  actions: {
    /**
     * Cargar datos desde una entidad
     */
    loadFromEntity(entity: ExternalAuditor) {
      this.responsableDesignacion = entity.responsableDesignacion;
      this.nombreCompletoAuditor = entity.auditorExterno?.nombreCompleto || "";
    },

    /**
     * Convertir estado del store a entidad
     */
    toEntity(): ExternalAuditor {
      return {
        responsableDesignacion: this.responsableDesignacion!,
        auditorExterno:
          this.responsableDesignacion === "JUNTA_DE_ACCIONISTAS" && this.nombreCompletoAuditor
            ? {
                nombreCompleto: this.nombreCompletoAuditor,
              }
            : undefined,
      };
    },

    /**
     * Resetear estado
     */
    reset() {
      this.responsableDesignacion = null;
      this.nombreCompletoAuditor = "";
    },
  },
});

