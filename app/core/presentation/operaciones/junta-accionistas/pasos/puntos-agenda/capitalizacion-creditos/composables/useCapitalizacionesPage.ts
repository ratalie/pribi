import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useCapitalizacionesManagerStore } from "../stores/useCapitalizacionesManagerStore";
import { useCapitalizacionesStore } from "../stores/useCapitalizacionesStore";
import { getIsContributorForModule, useAcreedoresPage } from "./useAcreedoresPage";

/**
 * Composable para la página de Capitalizaciones
 * Centraliza toda la lógica de negocio, carga de datos y manejo de modales
 */
export function useCapitalizacionesPage() {
  const route = useRoute();
  const snapshotStore = useSnapshotStore();
  const capitalizacionesManagerStore = useCapitalizacionesManagerStore();
  const capitalizacionesStore = useCapitalizacionesStore();

  // ✅ Usar useAcreedoresPage para obtener acreedores contribuyentes
  const acreedoresPage = useAcreedoresPage();
  const acreedores = acreedoresPage.acreedores;
  const fetchAcreedores = acreedoresPage.fetchAcreedores;

  const societyId = computed(() => route.params.societyId as string);
  const flowId = computed(() => route.params.flowId as string);

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Modal
  const isModalOpen = ref(false);
  const modalMode = ref<"crear" | "editar">("crear");
  const selectedAccionistaId = ref<string | null>(null);
  const selectedCapitalizacionId = ref<string | null>(null);

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

  async function loadData() {
    try {
      isLoading.value = true;
      error.value = null;

      // Cargar snapshot para obtener valor nominal y shareClasses
      await snapshotStore.loadSnapshot(Number(societyId.value), Number(flowId.value));

      // Cargar acreedores (solo los que son contribuyentes)
      await fetchAcreedores();

      // Cargar capitalizaciones
      await capitalizacionesManagerStore.loadCapitalizaciones(societyId.value, flowId.value);
    } catch (err: any) {
      console.error("[Capitalizaciones] Error al cargar datos:", err);
      error.value = err.message || "Error al cargar datos";
    } finally {
      isLoading.value = false;
    }
  }

  // ========================================
  // FUNCIONES DEL MODAL
  // ========================================

  function openModalForAdd(accionistaId: string) {
    selectedAccionistaId.value = accionistaId;
    selectedCapitalizacionId.value = null;
    modalMode.value = "crear";
    capitalizacionesStore.$reset();
    isModalOpen.value = true;
  }

  function openModalForEdit(accionistaId: string, capitalizacionId: string) {
    selectedAccionistaId.value = accionistaId;
    selectedCapitalizacionId.value = capitalizacionId;
    modalMode.value = "editar";

    // Cargar datos de la capitalización en el store
    const capitalizacion = capitalizacionesManagerStore.capitalizaciones.find(
      (c) => c.id === capitalizacionId
    );
    if (capitalizacion) {
      capitalizacionesStore.tipoMoneda = capitalizacion.tipoMoneda;
      capitalizacionesStore.monto = capitalizacion.monto;
      capitalizacionesStore.fechaContribucion =
        capitalizacion.fechaContribucion?.split("T")[0] || "";
      capitalizacionesStore.tasaCambio = capitalizacion.tasaCambio || 1.0;
      capitalizacionesStore.montoConvertido =
        capitalizacion.montoConvertido || capitalizacion.monto;
      capitalizacionesStore.accionId = capitalizacion.accion.id;
      capitalizacionesStore.accionesPorRecibir = capitalizacion.accionesPorRecibir;
      capitalizacionesStore.precioPorAccion = capitalizacion.precioPorAccion;
      capitalizacionesStore.pagadoCompletamente = capitalizacion.pagadoCompletamente;
      capitalizacionesStore.porcentajePagado = capitalizacion.porcentajePagado || 0;
      capitalizacionesStore.totalPasivo = capitalizacion.totalPasivo || 0;
      capitalizacionesStore.capitalSocial = capitalizacion.capitalSocial;
      capitalizacionesStore.premium = capitalizacion.premium;
      capitalizacionesStore.reserva = capitalizacion.reserva || 0;
      capitalizacionesStore.comprobantePagoArchivoId =
        capitalizacion.comprobantePagoArchivoId || "";
    }

    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
    selectedAccionistaId.value = null;
    selectedCapitalizacionId.value = null;
    capitalizacionesStore.$reset();
  }

  async function handleSaveCapitalizacion() {
    if (!selectedAccionistaId.value) return;

    try {
      const formData = capitalizacionesStore.getFormData();

      // ✅ Comprobante es OPCIONAL (no se valida)

      // Generar UUID para la capitalización
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
          modalMode.value === "editar" && selectedCapitalizacionId.value
            ? selectedCapitalizacionId.value
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

      // ✅ Solo incluir comprobantePagoArchivoId si tiene un valor válido (OPCIONAL)
      if (
        formData.comprobantePagoArchivoId &&
        formData.comprobantePagoArchivoId.trim() !== ""
      ) {
        payload.comprobantePagoArchivoId = formData.comprobantePagoArchivoId;
      }

      if (modalMode.value === "editar" && selectedCapitalizacionId.value) {
        await capitalizacionesManagerStore.updateCapitalizacion(
          societyId.value,
          flowId.value,
          selectedCapitalizacionId.value,
          payload
        );
      } else {
        await capitalizacionesManagerStore.createCapitalizacion(
          societyId.value,
          flowId.value,
          payload
        );
      }

      closeModal();
    } catch (err: any) {
      console.error("[Capitalizaciones] Error al guardar capitalizacion:", err);
      error.value = err.message || "Error al guardar capitalización";
    }
  }

  async function handleDeleteCapitalizacion(capitalizacionId: string) {
    if (!confirm("¿Estás seguro de eliminar esta capitalización?")) return;

    try {
      await capitalizacionesManagerStore.deleteCapitalizaciones(
        societyId.value,
        flowId.value,
        [capitalizacionId]
      );
    } catch (err: any) {
      console.error("[Capitalizaciones] Error al eliminar capitalizacion:", err);
      error.value = err.message || "Error al eliminar capitalización";
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

  // Acreedores con sus capitalizaciones agrupadas (formato compatible con Aportante)
  const acreedoresConCapitalizaciones = computed(() => {
    // Filtrar solo acreedores que son contribuyentes (isContributor: true para CREDIT)
    const acreedoresContribuyentes = acreedores.value.filter((a) => {
      return getIsContributorForModule(a, "CREDIT");
    });

    // El store agrupa las capitalizaciones por acreedor y las mapea como "aportes"
    return capitalizacionesManagerStore.tablaCapitalizaciones(acreedoresContribuyentes);
  });

  // ========================================
  // NAVEGACIÓN
  // ========================================

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    console.log("🎯 [Capitalizaciones] Handler de Siguiente ejecutado");

    // Validar que haya al menos una capitalización registrada
    const totalCapitalizaciones = capitalizacionesManagerStore.capitalizaciones.length;

    if (totalCapitalizaciones === 0) {
      const error = new Error("Debe registrar al menos una capitalización para continuar");
      console.error("❌ [Capitalizaciones] Error de validación:", error.message);
      throw error;
    }

    console.log(
      "✅ [Capitalizaciones] Validación exitosa:",
      totalCapitalizaciones,
      "capitalizaciones registradas"
    );
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
    acreedoresConCapitalizaciones,
    // Modal
    isModalOpen,
    modalMode,
    selectedAccionistaId,
    selectedCapitalizacionId,
    // Funciones
    openModalForAdd,
    openModalForEdit,
    closeModal,
    handleSaveCapitalizacion,
    handleDeleteCapitalizacion,
    societyId,
    flowId,
  };
}

