import { defineStore } from "pinia";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { Acreedor } from "../composables/useAcreedoresPage";

export interface Capitalizacion {
  id: string;
  accionistaId: string;
  accion: {
    id: string;
    tipo: string;
    nombre?: string;
  };
  tipoMoneda: "PEN" | "USD";
  monto: number;
  fechaContribucion: string;
  tasaCambio?: number;
  montoConvertido?: number;
  accionesPorRecibir: number;
  precioPorAccion: number;
  pagadoCompletamente: boolean;
  porcentajePagado?: number;
  totalPasivo?: number;
  capitalSocial: number;
  premium: number;
  reserva: number;
  comprobantePagoArchivoId?: string; // ✅ OPCIONAL
}

// ✅ Tipo compatible con Aportante para reutilizar AportesTable
export interface AcreedorConCapitalizaciones {
  id: string;
  person: {
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    razonSocial?: string;
    tipo: string;
  };
  typeShareholder:
    | "ACCIONISTA"
    | "NUEVO_APORTANTE"
    | "NUEVO_APORTANTE_CASH"
    | "NUEVO_APORTANTE_CREDIT";
  aportes: Capitalizacion[]; // ✅ Mapeado como "aportes" para compatibilidad con AportesTable
}

interface ApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: Capitalizacion[];
}

export const useCapitalizacionesManagerStore = defineStore("capitalizacionesManager", {
  state: () => ({
    capitalizaciones: [] as Capitalizacion[],
    status: "idle" as "idle" | "loading" | "error",
    errorMessage: null as string | null,
  }),

  getters: {
    /**
     * Agrupa las capitalizaciones por acreedor para la tabla
     * ✅ Devuelve formato compatible con Aportante para reutilizar AportesTable
     */
    tablaCapitalizaciones:
      (state) =>
      (acreedores: Acreedor[]): AcreedorConCapitalizaciones[] => {
        // Crear un mapa de capitalizaciones por accionistaId
        const capitalizacionesPorAcreedor = new Map<string, Capitalizacion[]>();
        state.capitalizaciones.forEach((capitalizacion) => {
          if (!capitalizacionesPorAcreedor.has(capitalizacion.accionistaId)) {
            capitalizacionesPorAcreedor.set(capitalizacion.accionistaId, []);
          }
          capitalizacionesPorAcreedor.get(capitalizacion.accionistaId)!.push(capitalizacion);
        });

        // Agregar capitalizaciones a cada acreedor (mapeadas como "aportes" para compatibilidad)
        return acreedores.map((acreedor) => ({
          id: acreedor.id,
          person: {
            nombre: acreedor.person.nombre,
            apellidoPaterno: acreedor.person.apellidoPaterno,
            apellidoMaterno: acreedor.person.apellidoMaterno,
            razonSocial: acreedor.person.razonSocial,
            tipo: acreedor.person.tipo,
          },
          typeShareholder: acreedor.typeShareholder,
          aportes: capitalizacionesPorAcreedor.get(acreedor.id) || [], // ✅ Mapeado como "aportes"
        }));
      },
  },

  actions: {
    /**
     * Resuelve la URL base (solo el origin, sin /api/v2)
     */
    resolveBaseUrl(): string {
      const config = useRuntimeConfig();
      const apiBase = (config.public?.apiBase as string | undefined) || "";
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const candidates = [apiBase, origin, "http://localhost:3000"];

      for (const base of candidates) {
        if (!base) continue;
        try {
          return new URL(base, origin || "http://localhost:3000").origin;
        } catch {
          continue;
        }
      }
      return "";
    },

    /**
     * Carga las capitalizaciones desde el backend
     */
    async loadCapitalizaciones(societyId: string, flowId: string) {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const baseUrl = this.resolveBaseUrl();
        const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/credit-capitalization/contributions`;

        console.debug("[CapitalizacionesManagerStore] GET capitalizaciones", { url });

        const response = await $fetch<ApiResponse>(url, {
          ...withAuthHeaders(),
          method: "GET",
        });

        this.capitalizaciones = response.data || [];
        this.status = "idle";
      } catch (error: any) {
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar capitalizaciones";
        console.error(
          "[CapitalizacionesManagerStore] Error al cargar capitalizaciones:",
          error
        );
        throw error;
      }
    },

    /**
     * Crea una nueva capitalización
     */
    async createCapitalizacion(
      societyId: string,
      flowId: string,
      payload: {
        id: string;
        accionistaId: string;
        accionId: string;
        tipoMoneda: "PEN" | "USD";
        monto: number;
        fechaContribucion: string;
        tasaCambio?: number;
        montoConvertido?: number;
        accionesPorRecibir: number;
        precioPorAccion: number;
        pagadoCompletamente: boolean;
        porcentajePagado?: number;
        totalPasivo?: number;
        capitalSocial: number;
        premium: number;
        reserva: number;
        comprobantePagoArchivoId?: string; // ✅ OPCIONAL
      }
    ) {
      try {
        const baseUrl = this.resolveBaseUrl();
        const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/credit-capitalization/contributions`;

        console.debug("[CapitalizacionesManagerStore] POST capitalizacion", { url, payload });

        await $fetch(url, {
          ...withAuthHeaders(),
          method: "POST",
          body: payload,
        });

        // Recargar capitalizaciones
        await this.loadCapitalizaciones(societyId, flowId);
      } catch (error: any) {
        console.error("[CapitalizacionesManagerStore] Error al crear capitalizacion:", error);
        throw error;
      }
    },

    /**
     * Actualiza una capitalización existente
     */
    async updateCapitalizacion(
      societyId: string,
      flowId: string,
      capitalizacionId: string,
      payload: {
        id: string;
        accionistaId: string;
        accionId: string;
        tipoMoneda: "PEN" | "USD";
        monto: number;
        fechaContribucion: string;
        tasaCambio?: number;
        montoConvertido?: number;
        accionesPorRecibir: number;
        precioPorAccion: number;
        pagadoCompletamente: boolean;
        porcentajePagado?: number;
        totalPasivo?: number;
        capitalSocial: number;
        premium: number;
        reserva: number;
        comprobantePagoArchivoId?: string; // ✅ OPCIONAL
      }
    ) {
      try {
        const baseUrl = this.resolveBaseUrl();
        const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/credit-capitalization/contributions`;

        console.debug("[CapitalizacionesManagerStore] PUT capitalizacion", { url, payload });

        await $fetch(url, {
          ...withAuthHeaders(),
          method: "PUT",
          body: payload,
        });

        // Recargar capitalizaciones
        await this.loadCapitalizaciones(societyId, flowId);
      } catch (error: any) {
        console.error(
          "[CapitalizacionesManagerStore] Error al actualizar capitalizacion:",
          error
        );
        throw error;
      }
    },

    /**
     * Elimina una o más capitalizaciones
     */
    async deleteCapitalizaciones(
      societyId: string,
      flowId: string,
      capitalizacionIds: string[]
    ) {
      try {
        const baseUrl = this.resolveBaseUrl();
        const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/credit-capitalization/contributions`;

        console.debug("[CapitalizacionesManagerStore] DELETE capitalizaciones", {
          url,
          capitalizacionIds,
        });

        await $fetch(url, {
          ...withAuthHeaders(),
          method: "DELETE",
          body: capitalizacionIds,
        });

        // Recargar capitalizaciones
        await this.loadCapitalizaciones(societyId, flowId);
      } catch (error: any) {
        console.error(
          "[CapitalizacionesManagerStore] Error al eliminar capitalizaciones:",
          error
        );
        throw error;
      }
    },
  },
});

