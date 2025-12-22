import { storeToRefs } from "pinia";
import { computed, watch } from "vue";
import { useDocumentosGeneradosStore } from "../stores/documentos-generados.store";
import { useRepositorioDashboardStore } from "../stores/repositorio-dashboard.store";

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
        console.log(
          "🟢 [useDocumentosGenerados] No hay sociedad seleccionada, limpiando store"
        );
        store.limpiar();
      }
    },
    { immediate: true }
  );

  // Computed para facilitar el acceso
  // Mantener compatibilidad con la vista actual
  // POR REGLA DE NEGOCIO: Siempre retornar estructura, incluso si no hay datos
  // Las carpetas "Directorio" y "Juntas de Accionistas" siempre deben existir
  const documentosGenerados = computed(() => {
    console.log("🔵 [useDocumentosGenerados] documentosGenerados computed:", {
      estructuraJuntas: store.estructuraJuntas,
      estructuraOperaciones: store.estructuraOperaciones,
      estructuraRegistros: store.estructuraRegistros,
    });

    // Retornar estructura compatible con la vista actual
    // SIEMPRE incluir directorio y juntas, incluso si son null
    return {
      operaciones: {
        nombre: "Operaciones",
        carpetas: {
          // Directorio: puede ser null si no existe en backend, pero siempre se muestra
          directorio: store.estructuraOperaciones?.directorio
            ? {
                id: store.estructuraOperaciones.directorio.id,
                nombre: store.estructuraOperaciones.directorio.name,
                nodeId: store.estructuraOperaciones.directorio.id,
              }
            : null,
          // Juntas: SIEMPRE existe (por regla de negocio), aunque puede estar vacía
          juntas: {
            nombre: "Juntas de Accionistas", // Nombre fijo según regla de negocio
            juntas:
              store.estructuraJuntas?.operaciones?.juntas?.map((carpeta) => {
                // Mostrar nombre legible: "Junta #{flowId}" en lugar del flowId solo
                // El nombre de la carpeta es el flowId (ej: "4", "8", "3")
                const nombreLegible = /^\d+$/.test(carpeta.name)
                  ? `Junta #${carpeta.name}`
                  : carpeta.name;

                return {
                  id: carpeta.id,
                  nombre: nombreLegible,
                  fecha: carpeta.createdAt,
                  nodeId: carpeta.id, // Guardar ID real del nodo (string)
                };
              }) || [],
          },
        },
      },
      registros: {
        nombre: "Registros",
        carpetas: {
          // Sociedades: puede ser null si no existe en backend, pero siempre se muestra
          sociedades: store.estructuraRegistros?.sociedades
            ? {
                id: store.estructuraRegistros.sociedades.id,
                nombre: store.estructuraRegistros.sociedades.name,
                nodeId: store.estructuraRegistros.sociedades.id,
              }
            : null,
          // Sucursales: puede ser null si no existe en backend, pero siempre se muestra
          sucursales: store.estructuraRegistros?.sucursales
            ? {
                id: store.estructuraRegistros.sucursales.id,
                nombre: store.estructuraRegistros.sucursales.name,
                nodeId: store.estructuraRegistros.sucursales.id,
              }
            : null,
        },
      },
    };
  });

  // Exponer estructura de operaciones
  const estructuraOperaciones = computed(() => store.estructuraOperaciones);

  // Exponer estructura de registros
  const estructuraRegistros = computed(() => store.estructuraRegistros);

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
    estructuraOperaciones,
    estructuraRegistros,
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
