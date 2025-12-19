import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";

// ========================================
// TIPOS
// ========================================

export type ContributorType = "ACCIONISTA" | "NUEVO_APORTANTE";

export interface Person {
  id: string;
  tipo:
    | "NATURAL"
    | "JURIDICA"
    | "SUCURSAL"
    | "FONDO_INVERSION"
    | "FIDEICOMISO"
    | "SUCESION_INDIVISA";
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

export interface Acreedor {
  id: string;
  personId?: string;
  typeShareholder: ContributorType;
  isContributor: boolean;
  status?: boolean;
  contributionModule?: "CASH" | "CREDIT" | "BOTH";
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
 * Composable para la página de Acreedores
 * Centraliza toda la lógica de negocio, carga de datos y manejo de modales
 */
export function useAcreedoresPage() {
  const route = useRoute();
  const asistenciaStore = useAsistenciaStore();

  const societyId = computed(() => route.params.societyId as string);
  const flowId = computed(() => route.params.flowId as string);

  const acreedores = ref<Acreedor[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Modal para agregar/editar
  const isModalOpen = ref(false);
  const isSaving = ref(false);

  interface ApiResponse {
    success: boolean;
    message: string;
    code: number;
    data: Acreedor[];
  }

  // ========================================
  // API HELPERS
  // ========================================

  const API_BASE = computed(
    () =>
      `/api/v2/society-profile/${societyId.value}/register-assembly/${flowId.value}/credit-capitalization`
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

  async function fetchAcreedores() {
    isLoading.value = true;
    error.value = null;

    try {
      // ✅ 1. Cargar asistencias si no están cargadas
      if (asistenciaStore.asistencias.length === 0) {
        await asistenciaStore.loadAsistencias(Number(societyId.value), Number(flowId.value));
      }

      const baseUrl = resolveBaseUrl();
      const url = `${baseUrl}${API_BASE.value}/participants`;

      console.debug("[Acreedores] GET request", { url });

      const response = await $fetch<ApiResponse>(url, {
        ...withAuthHeaders(),
        method: "GET",
      });

      console.debug("[Acreedores] GET response", { count: response.data.length });

      // ✅ 2. Filtrar por contributionModule (solo CREDIT o BOTH)
      const participantesCapitalizacion = response.data.filter(
        (a: Acreedor) => a.contributionModule === "CREDIT" || a.contributionModule === "BOTH"
      );

      console.debug(
        "[Acreedores] Filtrados por módulo (CREDIT/BOTH):",
        participantesCapitalizacion.length
      );

      // ✅ 3. Filtrar por asistencia
      // Para ACCIONISTA: verificar en asistencias por personId
      // Para NUEVO_APORTANTE: siempre incluir (no está en snapshot, es nuevo)
      const participantesFiltrados = participantesCapitalizacion.filter(
        (participante: Acreedor) => {
          // Si es NUEVO_APORTANTE, siempre incluirlo (no tiene asistencia registrada)
          if (participante.typeShareholder === "NUEVO_APORTANTE") {
            return true;
          }

          // Si es ACCIONISTA, verificar si asistió
          if (participante.personId) {
            const asistencia = asistenciaStore.asistencias.find(
              (a) => a.accionista.id === participante.personId
            );
            return asistencia?.asistio === true;
          }

          // Si no tiene personId, excluirlo por seguridad
          return false;
        }
      );

      console.debug("[Acreedores] Filtrados por asistencia:", participantesFiltrados.length);

      // ✅ 4. Mapear y asegurar que NUEVO_APORTANTE siempre tenga isContributor: true
      acreedores.value = participantesFiltrados.map((a: Acreedor) => {
        if (a.typeShareholder === "NUEVO_APORTANTE") {
          return { ...a, isContributor: true };
        }
        return a;
      });
    } catch (err: any) {
      console.error("[Acreedores] Error al cargar:", err);
      error.value = err.message || err.data?.message || "Error al cargar acreedores";
    } finally {
      isLoading.value = false;
    }
  }

  // ========================================
  // FUNCIONES DE ACCIÓN
  // ========================================

  async function toggleAcreedor(acreedor: Acreedor) {
    // NUEVO_APORTANTE siempre es contribuidor y no se puede cambiar
    if (acreedor.typeShareholder === "NUEVO_APORTANTE") {
      console.debug("[Acreedores] NUEVO_APORTANTE no se puede desmarcar");
      return;
    }

    try {
      const baseUrl = resolveBaseUrl();
      const url = `${baseUrl}${API_BASE.value}/participants`;

      // Body es array de UUIDs (hace toggle automático)
      const body = [acreedor.id];

      console.debug("[Acreedores] Toggle", { id: acreedor.id, url, body });

      await $fetch(url, {
        ...withAuthHeaders(),
        method: "PATCH",
        body,
      });

      // Recargar datos del backend después del PATCH
      await fetchAcreedores();
    } catch (err: any) {
      console.error("[Acreedores] Error al toggle:", err);
      error.value = err.message || "Error al actualizar acreedor";
    }
  }

  async function agregarNuevoAcreedor(payload: { contributor: any }) {
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

      console.debug("[Acreedores] POST nuevo", { requestPayload });

      await $fetch(url, {
        ...withAuthHeaders(),
        method: "POST",
        body: requestPayload,
      });

      // Cerrar modal y recargar
      isModalOpen.value = false;
      await fetchAcreedores();
    } catch (err: any) {
      console.error("[Acreedores] Error al agregar:", err);
      error.value = err.message || "Error al agregar acreedor";
    }
  }

  async function eliminarAcreedor(id: string) {
    if (!confirm("¿Estás seguro de eliminar este acreedor?")) return;

    try {
      const baseUrl = resolveBaseUrl();
      const url = `${baseUrl}${API_BASE.value}/participants`;

      // Body es array de UUIDs
      const body = [id];

      console.debug("[Acreedores] DELETE participante", { id, url, body });

      await $fetch(url, {
        ...withAuthHeaders(),
        method: "DELETE",
        body,
      });

      // Recargar lista
      await fetchAcreedores();
    } catch (err: any) {
      console.error("[Acreedores] Error al eliminar:", err);
      error.value = err.message || err.data?.message || "Error al eliminar acreedor";
    }
  }

  // ========================================
  // COMPUTED - FORMATEO DE DATOS
  // ========================================

  function getTotalAcciones(acreedor: Acreedor): number {
    if (!acreedor.allocationShare || acreedor.allocationShare.length === 0) {
      return 0;
    }

    return acreedor.allocationShare.reduce(
      (total, allocation) => total + (allocation.subscribedSharesQuantity || 0),
      0
    );
  }

  const totalSeleccionados = computed(() => {
    return acreedores.value.filter((a) => a.isContributor).length;
  });

  const totalAcciones = computed(() => {
    return acreedores.value.reduce((sum, a) => sum + getTotalAcciones(a), 0);
  });

  // ========================================
  // NAVEGACIÓN
  // ========================================

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    console.log("🎯 [Acreedores] Handler de Siguiente ejecutado");

    // Validar que haya al menos un acreedor seleccionado
    const acreedoresSeleccionados = acreedores.value.filter((a) => a.isContributor);

    if (acreedoresSeleccionados.length === 0) {
      const error = new Error("Debe seleccionar al menos un acreedor para continuar");
      console.error("❌ [Acreedores] Error de validación:", error.message);
      throw error;
    }

    console.log(
      "✅ [Acreedores] Validación exitosa:",
      acreedoresSeleccionados.length,
      "acreedores seleccionados"
    );
  });

  // ========================================
  // LIFECYCLE
  // ========================================

  onMounted(async () => {
    // ✅ Cargar asistencias primero
    try {
      await asistenciaStore.loadAsistencias(Number(societyId.value), Number(flowId.value));
    } catch (err) {
      console.error("[Acreedores] Error al cargar asistencias:", err);
    }

    // Luego cargar participantes (que ya filtrará por asistencia)
    await fetchAcreedores();
  });

  return {
    // Estado
    acreedores,
    isLoading,
    error,
    totalSeleccionados,
    totalAcciones,
    // Modal
    isModalOpen,
    isSaving,
    // Funciones
    toggleAcreedor,
    agregarNuevoAcreedor,
    eliminarAcreedor,
    fetchAcreedores,
  };
}
