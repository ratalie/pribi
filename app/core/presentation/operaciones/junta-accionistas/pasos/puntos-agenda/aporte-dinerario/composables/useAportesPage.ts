import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import {
  useAportesManagerStore,
  type Aportante as AportanteFromStore,
} from "../stores/useAportesManagerStore";
import { useAportesStore } from "../stores/useAportesStore";

/**
 * Composable para la página de Aportes
 * Centraliza toda la lógica de negocio, carga de datos y manejo de modales
 */
export function useAportesPage() {
  const route = useRoute();
  const snapshotStore = useSnapshotStore();
  const aportesManagerStore = useAportesManagerStore();
  const aportesStore = useAportesStore();

  const societyId = computed(() => route.params.societyId as string);
  const flowId = computed(() => route.params.flowId as string);

  const aportantes = ref<AportanteFromStore[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Modal
  const isModalOpen = ref(false);
  const modalMode = ref<"crear" | "editar">("crear");
  const selectedAccionistaId = ref<string | null>(null);
  const selectedAporteId = ref<string | null>(null);

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
      // ✅ CORREGIDO: Usar endpoint correcto con filtro isActive=true para obtener solo contribuyentes
      const url = `${baseUrl}${API_BASE.value}/cash-contribution/participants?isActive=true`;

      interface ApiResponse {
        success: boolean;
        message: string;
        code: number;
        data: AportanteFromStore[];
      }

      const response = await $fetch<ApiResponse>(url, {
        ...withAuthHeaders(),
        method: "GET",
      });

      // ✅ Ya no necesitamos filtrar en frontend porque el backend retorna solo contribuyentes con isActive=true
      // Solo mapeamos para asegurar que NUEVO_APORTANTE tenga isContributor: true
      aportantes.value = response.data.map((a: AportanteFromStore) => {
        if (a.typeShareholder === "NUEVO_APORTANTE") {
          return { ...a, isContributor: true };
        }
        return a;
      });
    } catch (err: any) {
      console.error("[Aportes] Error al cargar aportantes:", err);
      error.value = err.message || err.data?.message || "Error al cargar aportantes";
    } finally {
      isLoading.value = false;
    }
  }

  async function loadData() {
    try {
      // Cargar snapshot para obtener valor nominal y shareClasses
      await snapshotStore.loadSnapshot(Number(societyId.value), Number(flowId.value));

      // Cargar aportantes
      await fetchAportantes();

      // Cargar aportes
      await aportesManagerStore.loadAportes(societyId.value, flowId.value);
    } catch (err: any) {
      console.error("[Aportes] Error al cargar datos:", err);
      error.value = err.message || "Error al cargar datos";
    }
  }

  // ========================================
  // FUNCIONES DEL MODAL
  // ========================================

  function openModalForAdd(accionistaId: string) {
    selectedAccionistaId.value = accionistaId;
    selectedAporteId.value = null;
    modalMode.value = "crear";
    aportesStore.$reset();
    isModalOpen.value = true;
  }

  function openModalForEdit(accionistaId: string, aporteId: string) {
    selectedAccionistaId.value = accionistaId;
    selectedAporteId.value = aporteId;
    modalMode.value = "editar";

    // Cargar datos del aporte en el store
    const aporte = aportesManagerStore.aportes.find((a) => a.id === aporteId);
    if (aporte) {
      aportesStore.tipoMoneda = aporte.tipoMoneda;
      aportesStore.monto = aporte.monto;
      aportesStore.fechaContribucion = aporte.fechaContribucion?.split("T")[0] || "";
      aportesStore.tasaCambio = aporte.tasaCambio || 1.0;
      aportesStore.montoConvertido = aporte.montoConvertido || aporte.monto;
      aportesStore.accionId = aporte.accion.id;
      aportesStore.accionesPorRecibir = aporte.accionesPorRecibir;
      aportesStore.precioPorAccion = aporte.precioPorAccion;
      aportesStore.pagadoCompletamente = aporte.pagadoCompletamente;
      aportesStore.porcentajePagado = aporte.porcentajePagado || 0;
      aportesStore.totalPasivo = aporte.totalPasivo || 0;
      aportesStore.capitalSocial = aporte.capitalSocial;
      aportesStore.premium = aporte.premium;
      aportesStore.reserva = aporte.reserva || 0;
      aportesStore.comprobantePagoArchivoId = aporte.comprobantePagoArchivoId || "";
    }

    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
    selectedAccionistaId.value = null;
    selectedAporteId.value = null;
    aportesStore.$reset();
  }

  async function handleSaveAporte() {
    if (!selectedAccionistaId.value) return;

    try {
      const formData = aportesStore.getFormData();

      // Generar UUID para el aporte
      const generateUuid = () => {
        if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
          return crypto.randomUUID();
        }
        return Math.random().toString(36).slice(2) + Date.now().toString(36);
      };

      // Formatear fecha a YYYY-MM-DD si viene en otro formato
      let fechaFormateada = formData.fechaContribucion;
      if (fechaFormateada.includes("/")) {
        const [day, month, year] = fechaFormateada.split("/");
        fechaFormateada = `${year}-${month}-${day}`;
      }

      // Construir payload base
      const payload: any = {
        id:
          modalMode.value === "editar" && selectedAporteId.value
            ? selectedAporteId.value
            : generateUuid(),
        accionistaId: selectedAccionistaId.value,
        accionId: formData.accionId,
        tipoMoneda: formData.tipoMoneda,
        monto: formData.monto,
        fechaContribucion: fechaFormateada,
        tasaCambio: formData.tipoMoneda === "USD" ? formData.tasaCambio : 1.0,
        montoConvertido: formData.montoConvertido || formData.monto,
        accionesPorRecibir: formData.accionesPorRecibir,
        precioPorAccion: formData.precioPorAccion,
        pagadoCompletamente: formData.pagadoCompletamente,
        porcentajePagado: formData.pagadoCompletamente ? 100 : formData.porcentajePagado || 0,
        totalPasivo: formData.pagadoCompletamente ? 0 : formData.totalPasivo || 0,
        capitalSocial: formData.capitalSocial,
        premium: formData.premium,
        reserva: formData.reserva || 0,
      };

      // Solo incluir comprobantePagoArchivoId si tiene un valor válido
      if (
        formData.comprobantePagoArchivoId &&
        formData.comprobantePagoArchivoId.trim() !== ""
      ) {
        payload.comprobantePagoArchivoId = formData.comprobantePagoArchivoId;
      }

      if (modalMode.value === "editar" && selectedAporteId.value) {
        await aportesManagerStore.updateAporte(
          societyId.value,
          flowId.value,
          selectedAporteId.value,
          payload
        );
      } else {
        await aportesManagerStore.createAporte(societyId.value, flowId.value, payload);
      }

      closeModal();
    } catch (err: any) {
      console.error("[Aportes] Error al guardar aporte:", err);
      error.value = err.message || "Error al guardar aporte";
    }
  }

  async function handleDeleteAporte(aporteId: string) {
    if (!confirm("¿Estás seguro de eliminar este aporte?")) return;

    try {
      await aportesManagerStore.deleteAportes(societyId.value, flowId.value, [aporteId]);
    } catch (err: any) {
      console.error("[Aportes] Error al eliminar aporte:", err);
      error.value = err.message || "Error al eliminar aporte";
    }
  }

  // ========================================
  // COMPUTED
  // ========================================

  // Valor nominal desde el snapshot
  const valorNominal = computed(() => {
    return snapshotStore.snapshot?.nominalValue || 0;
  });

  // Total de acciones desde el snapshot
  const totalAcciones = computed(() => {
    if (!snapshotStore.snapshot?.shareAllocations) return 0;
    return snapshotStore.snapshot.shareAllocations.reduce(
      (total, allocation) => total + allocation.cantidadSuscrita,
      0
    );
  });

  // Aportantes con sus aportes agrupados
  const aportantesConAportes = computed(() => {
    // Convertir aportantes locales a formato del store (con aportes vacíos si no existen)
    const aportantesParaStore: AportanteFromStore[] = aportantes.value.map((a) => ({
      id: a.id,
      personId: a.personId,
      typeShareholder: a.typeShareholder,
      isContributor: a.isContributor,
      person: {
        id: a.person.id,
        tipo: a.person.tipo,
        nombre: a.person.nombre,
        apellidoPaterno: a.person.apellidoPaterno,
        apellidoMaterno: a.person.apellidoMaterno,
        razonSocial: a.person.razonSocial,
        tipoDocumento: a.person.tipoDocumento,
        numeroDocumento: a.person.numeroDocumento,
      },
      aportes: [], // Se llenará desde el store
    }));

    // El store agrupa los aportes por aportante
    return aportesManagerStore.tablaAportes(aportantesParaStore);
  });

  // ========================================
  // NAVEGACIÓN
  // ========================================

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    console.log("🎯 [Aportes] Handler de Siguiente ejecutado");

    // Validar que haya al menos un aporte registrado
    const totalAportes = aportesManagerStore.aportes.length;

    if (totalAportes === 0) {
      const error = new Error("Debe registrar al menos un aporte para continuar");
      console.error("❌ [Aportes] Error de validación:", error.message);
      throw error;
    }

    console.log("✅ [Aportes] Validación exitosa:", totalAportes, "aportes registrados");
  });

  // ========================================
  // LIFECYCLE
  // ========================================

  onMounted(() => {
    loadData();
  });

  return {
    // Estado
    isLoading,
    error,
    valorNominal,
    totalAcciones,
    aportantesConAportes,
    // Modal
    isModalOpen,
    modalMode,
    selectedAccionistaId,
    selectedAporteId,
    // Funciones
    openModalForAdd,
    openModalForEdit,
    closeModal,
    handleSaveAporte,
    handleDeleteAporte,
    societyId,
    flowId,
  };
}
