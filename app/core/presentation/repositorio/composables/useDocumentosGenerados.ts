import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDocumentosGeneradosStore } from '../stores/documentos-generados.store';
import { useRepositorioDashboardStore } from '../stores/repositorio-dashboard.store';

/**
 * Composable para Documentos Generados
 * Gestiona el ciclo de vida y expone la lógica del store
 */
export function useDocumentosGenerados() {
  const store = useDocumentosGeneradosStore();
  const dashboardStore = useRepositorioDashboardStore();
  
  // Hacer el store reactivo usando storeToRefs
  const { sociedadSeleccionada } = storeToRefs(dashboardStore);

  // Obtener structureId del dashboard store
  const structureId = computed(() => sociedadSeleccionada.value?.id || null);

  // Cargar documentos cuando cambie la sociedad
  // Observar directamente la ref reactiva del store
  watch(
    () => sociedadSeleccionada.value?.id,
    async (newId, oldId) => {
      console.log("🟢 [useDocumentosGenerados] Watch detectó cambio de sociedad:", {
        oldId,
        newId,
        sociedadCompleta: sociedadSeleccionada.value,
      });
      
      if (newId) {
        console.log("🟢 [useDocumentosGenerados] Cargando documentos para sociedad:", newId);
        try {
          await store.cargarDocumentosGenerados(newId);
          console.log("🟢 [useDocumentosGenerados] Documentos cargados exitosamente");
        } catch (error) {
          console.error("🔴 [useDocumentosGenerados] Error al cargar documentos:", error);
        }
      } else {
        console.log("🟢 [useDocumentosGenerados] No hay sociedad seleccionada, limpiando store");
        store.limpiar();
      }
    },
    { immediate: true }
  );

  // Computed para facilitar el acceso
  // Mantener compatibilidad con la vista actual
  const documentosGenerados = computed(() => {
    if (!store.estructuraJuntas) return null;
    
    // Retornar estructura compatible con la vista actual
    return {
      operaciones: {
        nombre: 'Operaciones',
        carpetas: {
          juntas: {
            nombre: 'Juntas',
            juntas: store.estructuraJuntas.operaciones.juntas.map((carpeta) => ({
              id: carpeta.id,
              nombre: carpeta.name,
              fecha: carpeta.createdAt,
              nodeId: carpeta.id, // Guardar ID real del nodo (string)
            })),
          },
        },
      },
    };
  });

  // Estados
  const isLoading = computed(() => store.isLoading);
  const hasError = computed(() => store.hasError);
  const errorMessage = computed(() => store.errorMessage);
  const hasData = computed(() => store.hasData);

  // Métodos
  const cargarDocumentosGenerados = async () => {
    if (structureId.value) {
      await store.cargarDocumentosGenerados(structureId.value);
    }
  };

  const cargarDocumentosDeCarpeta = async (carpetaId: string) => {
    await store.cargarDocumentosDeCarpeta(carpetaId);
  };

  const obtenerDocumento = async (documentoId: string) => {
    return await store.obtenerDocumento(documentoId);
  };

  const limpiar = () => {
    store.limpiar();
  };

  return {
    // Estado
    documentosGenerados,
    documentosCarpeta: computed(() => store.documentosCarpeta),
    carpetaActual: computed(() => store.carpetaActual),
    isLoading,
    hasError,
    errorMessage,
    hasData,

    // Métodos
    cargarDocumentosGenerados,
    cargarDocumentosDeCarpeta,
    obtenerDocumento,
    limpiar,
  };
}

