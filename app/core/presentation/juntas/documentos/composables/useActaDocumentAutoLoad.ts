import { watch, onMounted } from "vue";
import { useActaDocumentStore } from "../stores/acta-document.store";
import { useDocumentosStore } from "../stores/documentos.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

/**
 * Composable para cargar automáticamente las variables del acta
 * cuando se monta la vista o cuando cambian los datos base
 */
export function useActaDocumentAutoLoad() {
  const actaDocumentStore = useActaDocumentStore();
  const documentosStore = useDocumentosStore();
  const snapshotStore = useSnapshotStore();

  /**
   * Cargar variables si hay datos disponibles
   */
  const loadIfReady = () => {
    const tieneDatosSociedad = !!documentosStore.datosSociedad;
    const tieneDatosJunta = !!documentosStore.datosJunta;
    const tieneSnapshot = !!snapshotStore.snapshot;

    if (tieneDatosSociedad && tieneDatosJunta && tieneSnapshot) {
      console.log("🔄 [useActaDocumentAutoLoad] Cargando variables del acta...");
      actaDocumentStore.load();
    } else {
      console.log("⏳ [useActaDocumentAutoLoad] Esperando datos...", {
        tieneDatosSociedad,
        tieneDatosJunta,
        tieneSnapshot,
      });
    }
  };

  // Cargar al montar
  onMounted(() => {
    loadIfReady();
  });

  // Watch para recargar cuando cambien los datos base
  watch(
    () => [
      documentosStore.datosSociedad,
      documentosStore.datosJunta,
      snapshotStore.snapshot,
      documentosStore.datosAporteDinerario,
    ],
    () => {
      loadIfReady();
    },
    { deep: true }
  );

  return {
    load: loadIfReady,
  };
}





