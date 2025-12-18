import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

// ========================================
// TIPOS
// ========================================

export type ContributorType = "ACCIONISTA" | "NUEVO_APORTANTE";

export interface Person {
  id: string;
  tipo: "NATURAL" | "JURIDICA" | "SUCURSAL" | "FONDO_INVERSION" | "FIDEICOMISO" | "SUCESION_INDIVISA";
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  tipoDocumento: string;
  numeroDocumento: string;
  paisEmision?: string;
  razonSocial?: string;
  nombreComercial?: string;
  direccion?: string;
  [key: string]: any;
}

export interface Aportante {
  id: string;
  personId?: string;
  typeShareholder: ContributorType;
  isContributor: boolean;
  status?: boolean;
  person: Person;
  allocationShare?: Array<{
    id: string;
    action: {
      id: string;
      name: string;
      type: string;
    };
    subscribedSharesQuantity: number;
    percentagePaidPerShare: number;
  }>;
}

/**
 * Composable para la página de Aportantes
 * Centraliza toda la lógica de negocio, carga de datos y manejo de modales
 */
export function useAportantesPage() {
  const route = useRoute();

  const societyId = computed(() => route.params.societyId as string);
  const flowId = computed(() => route.params.flowId as string);

  const aportantes = ref<Aportante[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Modal para agregar/editar
  const isModalOpen = ref(false);
  const isSaving = ref(false);

  interface ApiResponse {
    success: boolean;
    message: string;
    code: number;
    data: Aportante[];
  }

  // ========================================
  // API HELPERS
  // ========================================

  const API_BASE = computed(
    () => `/api/v2/society-profile/${societyId.value}/register-assembly/${flowId.value}`
  );

  function resolveBaseUrl(): string {
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
  }

  // ========================================
  // FUNCIONES DE CARGA
  // ========================================

  async function fetchAportantes() {
    isLoading.value = true;
    error.value = null;

    try {
      const baseUrl = resolveBaseUrl();
      const url = `${baseUrl}${API_BASE.value}/participants`;

      console.debug("[Aportantes] GET request", { url });

      const response = await $fetch<ApiResponse>(url, {
        ...withAuthHeaders(),
        method: "GET",
      });

      console.debug("[Aportantes] GET response", { count: response.data.length });

      // El backend ya devuelve solo los participantes (que asistieron)
      aportantes.value = response.data.map((a: Aportante) => {
        // NUEVO_APORTANTE siempre debe tener isContributor: true
        if (a.typeShareholder === "NUEVO_APORTANTE") {
          return { ...a, isContributor: true };
        }
        return a;
      });
    } catch (err: any) {
      console.error("[Aportantes] Error al cargar:", err);
      error.value = err.message || err.data?.message || "Error al cargar aportantes";
    } finally {
      isLoading.value = false;
    }
  }

  // ========================================
  // FUNCIONES DE ACCIÓN
  // ========================================

  async function toggleAportante(aportante: Aportante) {
    // NUEVO_APORTANTE siempre es contribuidor y no se puede cambiar
    if (aportante.typeShareholder === "NUEVO_APORTANTE") {
      console.debug("[Aportantes] NUEVO_APORTANTE no se puede desmarcar");
      return;
    }

    try {
      const baseUrl = resolveBaseUrl();
      const url = `${baseUrl}${API_BASE.value}/participants`;

      // Body es array de UUIDs (hace toggle automático)
      const body = [aportante.id];

      console.debug("[Aportantes] Toggle", { id: aportante.id, url, body });

      await $fetch(url, {
        ...withAuthHeaders(),
        method: "PATCH",
        body,
      });

      // Recargar datos del backend después del PATCH
      await fetchAportantes();
    } catch (err: any) {
      console.error("[Aportantes] Error al toggle:", err);
      error.value = err.message || "Error al actualizar aportante";
    }
  }

  async function agregarNuevoAportante(payload: { contributor: any }) {
    try {
      const baseUrl = resolveBaseUrl();
      const url = `${baseUrl}${API_BASE.value}/participants`;

      // El backend espera: { id: string, persona: {...} }
      const generateUuid = () => {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
          return crypto.randomUUID();
        }
        return Math.random().toString(36).slice(2) + Date.now().toString(36);
      };

      const requestPayload = {
        id: generateUuid(),
        persona: payload.contributor, // El backend espera "persona", no "contributor"
      };

      console.debug("[Aportantes] POST nuevo", { requestPayload });

      await $fetch(url, {
        ...withAuthHeaders(),
        method: "POST",
        body: requestPayload,
      });

      // Cerrar modal y recargar
      isModalOpen.value = false;
      await fetchAportantes();
    } catch (err: any) {
      console.error("[Aportantes] Error al agregar:", err);
      error.value = err.message || "Error al agregar aportante";
    }
  }

  async function eliminarAportante(id: string) {
    if (!confirm("¿Estás seguro de eliminar este aportante?")) return;

    try {
      const baseUrl = resolveBaseUrl();
      const url = `${baseUrl}${API_BASE.value}/participants`;

      // Body es array de UUIDs
      const body = [id];

      console.debug("[Aportantes] DELETE participante", { id, url, body });

      await $fetch(url, {
        ...withAuthHeaders(),
        method: "DELETE",
        body,
      });

      // Recargar lista
      await fetchAportantes();
    } catch (err: any) {
      console.error("[Aportantes] Error al eliminar:", err);
      error.value = err.message || err.data?.message || "Error al eliminar aportante";
    }
  }

  // ========================================
  // COMPUTED - FORMATEO DE DATOS
  // ========================================

  function getTotalAcciones(aportante: Aportante): number {
    if (!aportante.allocationShare || aportante.allocationShare.length === 0) {
      return 0;
    }

    return aportante.allocationShare.reduce(
      (total, allocation) => total + (allocation.subscribedSharesQuantity || 0),
      0
    );
  }

  const totalSeleccionados = computed(() => {
    return aportantes.value.filter((a) => a.isContributor).length;
  });

  const totalAcciones = computed(() => {
    return aportantes.value.reduce((sum, a) => sum + getTotalAcciones(a), 0);
  });

  // ========================================
  // NAVEGACIÓN
  // ========================================

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    console.log("🎯 [Aportantes] Handler de Siguiente ejecutado");

    // Validar que haya al menos un aportante seleccionado
    const aportantesSeleccionados = aportantes.value.filter((a) => a.isContributor);

    if (aportantesSeleccionados.length === 0) {
      const error = new Error("Debe seleccionar al menos un aportante para continuar");
      console.error("❌ [Aportantes] Error de validación:", error.message);
      throw error;
    }

    console.log("✅ [Aportantes] Validación exitosa:", aportantesSeleccionados.length, "aportantes seleccionados");
  });

  // ========================================
  // LIFECYCLE
  // ========================================

  onMounted(async () => {
    await fetchAportantes();
  });

  return {
    // Estado
    aportantes,
    isLoading,
    error,
    totalSeleccionados,
    totalAcciones,
    // Modal
    isModalOpen,
    isSaving,
    // Funciones
    toggleAportante,
    agregarNuevoAportante,
    eliminarAportante,
    fetchAportantes,
  };
}

