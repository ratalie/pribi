import { defineStore } from "pinia";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";

export interface Aporte {
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
  comprobantePagoArchivoId?: string;
}

export interface Aportante {
  id: string;
  personId?: string;
  typeShareholder: "ACCIONISTA" | "NUEVO_APORTANTE";
  isContributor: boolean;
  person: {
    id: string;
    tipo: string;
    nombre?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
    razonSocial?: string;
    tipoDocumento: string;
    numeroDocumento: string;
  };
  aportes: Aporte[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: Aporte[];
}

export const useAportesManagerStore = defineStore("aportesManager", {
  state: () => ({
    aportes: [] as Aporte[],
    status: "idle" as "idle" | "loading" | "error",
    errorMessage: null as string | null,
  }),

  getters: {
    /**
     * Agrupa los aportes por aportante para la tabla
     */
    tablaAportes: (state) => (aportantes: Aportante[]): Aportante[] => {
      // Crear un mapa de aportes por accionistaId
      const aportesPorAportante = new Map<string, Aporte[]>();
      state.aportes.forEach((aporte) => {
        if (!aportesPorAportante.has(aporte.accionistaId)) {
          aportesPorAportante.set(aporte.accionistaId, []);
        }
        aportesPorAportante.get(aporte.accionistaId)!.push(aporte);
      });

      // Agregar aportes a cada aportante
      return aportantes.map((aportante) => ({
        ...aportante,
        aportes: aportesPorAportante.get(aportante.id) || [],
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
     * Carga los aportes desde el backend
     */
    async loadAportes(societyId: string, flowId: string) {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const baseUrl = this.resolveBaseUrl();
        const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/contributions`;

        console.debug("[AportesManagerStore] GET aportes", { url });

        const response = await $fetch<ApiResponse>(url, {
          ...withAuthHeaders(),
          method: "GET",
        });

        this.aportes = response.data || [];
        this.status = "idle";
      } catch (error: any) {
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar aportes";
        console.error("[AportesManagerStore] Error al cargar aportes:", error);
        throw error;
      }
    },

    /**
     * Crea un nuevo aporte
     */
    async createAporte(
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
        comprobantePagoArchivoId?: string;
      }
    ) {
      try {
        const baseUrl = this.resolveBaseUrl();
        const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/contributions`;

        console.debug("[AportesManagerStore] POST aporte", { url, payload });

        await $fetch(url, {
          ...withAuthHeaders(),
          method: "POST",
          body: payload,
        });

        // Recargar aportes
        await this.loadAportes(societyId, flowId);
      } catch (error: any) {
        console.error("[AportesManagerStore] Error al crear aporte:", error);
        throw error;
      }
    },

    /**
     * Actualiza un aporte existente
     */
    async updateAporte(
      societyId: string,
      flowId: string,
      aporteId: string,
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
        comprobantePagoArchivoId?: string;
      }
    ) {
      try {
        const baseUrl = this.resolveBaseUrl();
        const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/contributions`;

        console.debug("[AportesManagerStore] PUT aporte", { url, payload });

        await $fetch(url, {
          ...withAuthHeaders(),
          method: "PUT",
          body: payload,
        });

        // Recargar aportes
        await this.loadAportes(societyId, flowId);
      } catch (error: any) {
        console.error("[AportesManagerStore] Error al actualizar aporte:", error);
        throw error;
      }
    },

    /**
     * Elimina uno o más aportes
     */
    async deleteAportes(societyId: string, flowId: string, aporteIds: string[]) {
      try {
        const baseUrl = this.resolveBaseUrl();
        const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/contributions`;

        console.debug("[AportesManagerStore] DELETE aportes", { url, aporteIds });

        await $fetch(url, {
          ...withAuthHeaders(),
          method: "DELETE",
          body: aporteIds,
        });

        // Recargar aportes
        await this.loadAportes(societyId, flowId);
      } catch (error: any) {
        console.error("[AportesManagerStore] Error al eliminar aportes:", error);
        throw error;
      }
    },
  },
});

