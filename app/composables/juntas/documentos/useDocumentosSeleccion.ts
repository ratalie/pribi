import { computed, ref, watch } from "vue";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";

/**
 * Composable para manejar la selección de documentos
 *
 * Funcionalidades:
 * - Selección individual de documentos
 * - Selección masiva (seleccionar todo)
 * - Estado reactivo de selección
 */
export function useDocumentosSeleccion(documentos: () => Documento[]) {
  // Estado de selección individual
  const documentosSeleccionados = ref<Set<string>>(new Set());

  // Estado de "seleccionar todo"
  const seleccionarTodo = ref(false);

  // Documentos seleccionados como array
  const documentosSeleccionadosArray = computed(() => {
    return documentos().filter((doc) => documentosSeleccionados.value.has(doc.id));
  });

  // Cantidad de documentos seleccionados
  const cantidadSeleccionados = computed(() => documentosSeleccionados.value.size);

  // Verificar si un documento está seleccionado
  const isDocumentoSelected = (documentoId: string): boolean => {
    return documentosSeleccionados.value.has(documentoId);
  };

  // Toggle selección de un documento individual
  const toggleSeleccion = (documentoId: string) => {
    if (documentosSeleccionados.value.has(documentoId)) {
      documentosSeleccionados.value.delete(documentoId);
    } else {
      documentosSeleccionados.value.add(documentoId);
    }

    // Actualizar estado de "seleccionar todo" basado en selección actual
    actualizarEstadoSeleccionarTodo();

    console.log(
      "📋 [useDocumentosSeleccion] Documentos seleccionados:",
      documentosSeleccionados.value.size
    );
  };

  // Toggle "seleccionar todo"
  const toggleSeleccionarTodo = () => {
    seleccionarTodo.value = !seleccionarTodo.value;

    if (seleccionarTodo.value) {
      // Seleccionar todos los documentos
      documentos().forEach((doc) => {
        documentosSeleccionados.value.add(doc.id);
      });
    } else {
      // Deseleccionar todos
      documentosSeleccionados.value.clear();
    }

    console.log("📋 [useDocumentosSeleccion] Seleccionar todo:", seleccionarTodo.value);
  };

  // Actualizar estado de "seleccionar todo" basado en selección actual
  const actualizarEstadoSeleccionarTodo = () => {
    const totalDocumentos = documentos().length;
    const seleccionados = documentosSeleccionados.value.size;

    // Si todos están seleccionados, marcar checkbox
    seleccionarTodo.value = totalDocumentos > 0 && seleccionados === totalDocumentos;
  };

  // Limpiar selección
  const limpiarSeleccion = () => {
    documentosSeleccionados.value.clear();
    seleccionarTodo.value = false;
  };

  // Watch para sincronizar "seleccionar todo" cuando cambian los documentos
  watch(
    documentos,
    () => {
      actualizarEstadoSeleccionarTodo();
    },
    { deep: true }
  );

  return {
    // Estado
    documentosSeleccionados,
    seleccionarTodo,
    documentosSeleccionadosArray,
    cantidadSeleccionados,

    // Métodos
    isDocumentoSelected,
    toggleSeleccion,
    toggleSeleccionarTodo,
    limpiarSeleccion,
  };
}
