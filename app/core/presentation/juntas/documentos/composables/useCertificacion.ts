import { computed } from "vue";
import { useDocumentosStore } from "../stores/documentos.store";

/**
 * Composable para generar variables del template de Certificación
 * 
 * Documento común a todos los tipos de junta
 * 
 * Uso:
 * ```typescript
 * const { variablesTemplate } = useCertificacion();
 * const vars = variablesTemplate.value;
 * ```
 */
export function useCertificacion() {
  const store = useDocumentosStore();

  const datosSociedad = computed(() => store.datosSociedad);
  const datosJunta = computed(() => store.datosJunta);

  /**
   * Variables del template para Certificación
   */
  const variablesTemplate = computed(() => {
    if (!datosSociedad.value || !datosJunta.value) {
      return null;
    }

    const esUniversal = datosJunta.value.esUniversal;

    return {
      // ============================================
      // DATOS DE LA SOCIEDAD
      // ============================================
      nombre_empresa: datosSociedad.value.razonSocial,
      ruc: datosSociedad.value.ruc,
      direccion: datosSociedad.value.direccion,

      // ============================================
      // DATOS DE LA JUNTA
      // ============================================
      tipo_junta: datosJunta.value.tipoJunta,
      fecha_junta: datosJunta.value.fecha,
      hora_junta: datosJunta.value.hora,
      lugar_junta: datosJunta.value.lugar,

      // ============================================
      // GERENTE GENERAL (si aplica)
      // ============================================
      has_gerente_junta_universal: esUniversal && datosJunta.value.presidente !== "",
      has_gerente_convocatoria: !esUniversal && datosJunta.value.presidente !== "",
      nombre_gerente_general: datosJunta.value.presidente || "No especificado",
      tipo_documento: "DNI", // TODO: Obtener desde snapshot si es posible
      numero_documento: "", // TODO: Obtener desde snapshot si es posible
      date_universal: datosJunta.value.fecha,
      date_junta: datosJunta.value.fecha,

      // ============================================
      // CERTIFICACIÓN POR ACCIONISTAS (si no hay gerente)
      // ============================================
      has_not_gerente_convocatoria: !datosJunta.value.presidente,
      // TODO: Agregar lista de accionistas certificadores cuando sea necesario
    };
  });

  return {
    variablesTemplate,
    datosSociedad,
    datosJunta,
  };
}


