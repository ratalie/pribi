import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDownloadDataStore } from "~/core/presentation/juntas/documentos/stores/download-data.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

/**
 * Composable para Download Data de Juntas
 * 
 * Gestiona el ciclo de vida y expone la lógica del store.
 * Hace el GET automáticamente cuando se monta el componente.
 */
export function useDownloadData() {
  const route = useRoute();
  const store = useDownloadDataStore();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // Obtener razonSocial y ruc del snapshot
  const razonSocial = computed(() => {
    return snapshotStore.snapshot?.societyData?.reasonSocial || "Sociedad sin nombre";
  });

  const ruc = computed(() => {
    return snapshotStore.snapshot?.societyData?.ruc || "";
  });

  // Cargar datos al montar
  onMounted(async () => {
    if (societyId.value && flowId.value && !store.hasData) {
      console.log("🚀 [useDownloadData] Cargando datos de descarga...", {
        societyId: societyId.value,
        flowId: flowId.value,
      });

      // Cargar snapshot si no está cargado (para obtener razonSocial y ruc)
      if (!snapshotStore.snapshot) {
        console.log("📦 [useDownloadData] Cargando snapshot para obtener datos de sociedad...");
        await snapshotStore.loadSnapshot(societyId.value, flowId.value);
      }

      await store.loadDownloadData(societyId.value, flowId.value);
      console.log("✅ [useDownloadData] Datos cargados:", store.downloadData);
    }
  });

  // Computed para facilitar el acceso
  const downloadData = computed(() => store.downloadData);
  const agendaItems = computed(() => store.agendaItems);
  const meetingDetails = computed(() => store.meetingDetails);
  const attendance = computed(() => store.attendance);
  const aporteDinerario = computed(() => store.aporteDinerario);
  const hasAporteDinerario = computed(() => store.hasAporteDinerario);

  // Estados
  const isLoading = computed(() => store.status === "loading");
  const hasError = computed(() => store.status === "error");
  const errorMessage = computed(() => store.errorMessage);

  // Métodos
  const reload = async () => {
    if (societyId.value && flowId.value) {
      await store.loadDownloadData(societyId.value, flowId.value);
    }
  };

  return {
    // Datos
    downloadData,
    agendaItems,
    meetingDetails,
    attendance,
    aporteDinerario,
    hasAporteDinerario,
    // Datos de sociedad
    razonSocial,
    ruc,
    // Estados
    isLoading,
    hasError,
    errorMessage,
    // IDs
    societyId,
    flowId,
    // Métodos
    reload,
    // Stores (para acceso directo si es necesario)
    store,
    snapshotStore,
  };
}

