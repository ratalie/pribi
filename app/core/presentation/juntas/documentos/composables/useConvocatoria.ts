import { computed } from "vue";
import { useDocumentosStore } from "../stores/documentos.store";

/**
 * Composable para generar variables del template de Convocatoria
 * 
 * Documento común a todos los tipos de junta (solo si es Junta General)
 * 
 * Uso:
 * ```typescript
 * const { variablesTemplate, necesitaConvocatoria } = useConvocatoria();
 * if (necesitaConvocatoria.value) {
 *   const vars = variablesTemplate.value;
 * }
 * ```
 */
export function useConvocatoria() {
  const store = useDocumentosStore();

  const datosSociedad = computed(() => store.datosSociedad);
  const datosJunta = computed(() => store.datosJunta);
  const necesitaConvocatoria = computed(() => store.necesitaConvocatoria);

  /**
   * Variables del template para Convocatoria
   */
  const variablesTemplate = computed(() => {
    if (!necesitaConvocatoria.value) {
      return null; // No se genera convocatoria para Junta Universal
    }

    if (!datosSociedad.value || !datosJunta.value) {
      return null;
    }

    return {
      // ============================================
      // DATOS DE LA SOCIEDAD
      // ============================================
      registered_name: datosSociedad.value.razonSocial,
      ruc: datosSociedad.value.ruc,
      direccion: datosSociedad.value.direccion,
      ciudad: datosSociedad.value.ciudad,

      // ============================================
      // PRIMERA CONVOCATORIA
      // ============================================
      date_convocatoria: datosJunta.value.fecha,
      horaJunta: datosJunta.value.hora,
      lugar_convocatoria: datosJunta.value.lugar,
      modo_convocatoria: datosJunta.value.modo,

      // ============================================
      // SEGUNDA CONVOCATORIA
      // ============================================
      newDate: datosJunta.value.segundaConvocatoria?.dateFormatted || "",
      hora_segunda: datosJunta.value.segundaConvocatoria?.timeFormatted || "",
      lugar_segunda: datosJunta.value.segundaConvocatoria?.place || "",
      modo_segunda: datosJunta.value.segundaConvocatoria?.modeFormatted || "",

      // ============================================
      // FIRMANTE
      // ============================================
      selected_apoderado: datosJunta.value.presidente || "Gerente General",
      puesto_apoderado: "Gerente General", // TODO: Obtener desde snapshot si es posible

      // ============================================
      // FECHA DE EMISIÓN
      // ============================================
      date_now: new Date().toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  });

  return {
    variablesTemplate,
    necesitaConvocatoria,
    datosSociedad,
    datosJunta,
  };
}


