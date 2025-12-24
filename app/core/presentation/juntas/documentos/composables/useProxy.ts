import { computed } from "vue";
import { useDocumentosStore } from "../stores/documentos.store";

/**
 * Composable para generar variables del template de Poderes Especiales (Proxy)
 * 
 * Genera documentos separados para Persona Natural y Persona Jurídica
 * 
 * Uso:
 * ```typescript
 * const { variablesTemplateNatural, variablesTemplateJuridica, necesitaProxyNatural, necesitaProxyJuridica } = useProxy();
 * ```
 */
export function useProxy() {
  const store = useDocumentosStore();

  const datosSociedad = computed(() => store.datosSociedad);
  const datosJunta = computed(() => store.datosJunta);
  const asistentes = computed(() => store.listaAccionistasAsistentes);
  const necesitaProxyNatural = computed(() => store.necesitaProxyNatural);
  const necesitaProxyJuridica = computed(() => store.necesitaProxyJuridica);

  /**
   * Filtrar asistentes con representante tipo Natural
   */
  const asistentesConProxyNatural = computed(() => {
    return asistentes.value.filter(
      (a) => a.representante && a.tipo === "NATURAL"
    );
  });

  /**
   * Filtrar asistentes con representante tipo Jurídica
   */
  const asistentesConProxyJuridica = computed(() => {
    return asistentes.value.filter(
      (a) => a.representante && a.tipo === "JURIDICA"
    );
  });

  /**
   * Variables del template para Proxy Persona Natural
   */
  const variablesTemplateNatural = computed(() => {
    if (!necesitaProxyNatural.value || asistentesConProxyNatural.value.length === 0) {
      return null;
    }

    if (!datosSociedad.value || !datosJunta.value) {
      return null;
    }

    // Generar un proxy por cada accionista con representante natural
    return asistentesConProxyNatural.value.map((accionista) => {
      const representante = accionista.representante!;

      return {
        // ============================================
        // DATOS DEL ACCIONISTA (PODERDANTE)
        // ============================================
        nombre_accionista: accionista.nombre,
        tipo_documento: accionista.tipoDocumento,
        numero_documento: accionista.documento,

        // ============================================
        // DATOS DEL APODERADO (REPRESENTANTE)
        // ============================================
        nombre_apoderado: `${representante.nombre} ${representante.apellidoPaterno} ${representante.apellidoMaterno || ""}`.trim(),
        tipo_documento_apoderado: representante.tipoDocumento,
        numero_documento_apoderado: representante.numeroDocumento,

        // ============================================
        // DATOS DE LA SOCIEDAD
        // ============================================
        nombre_empresa: datosSociedad.value.razonSocial,
        ruc: datosSociedad.value.ruc,
        numero_partida_registral: datosSociedad.value.partidaRegistral,
        oficina_registral: datosSociedad.value.oficinaRegistral,

        // ============================================
        // DATOS DE LA JUNTA
        // ============================================
        fecha_convocatoria: datosJunta.value.fecha,
        horas: datosJunta.value.hora,
        ciudad: datosSociedad.value.ciudad,
        pais: "Perú",
        date_now: new Date().toLocaleDateString("es-PE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };
    });
  });

  /**
   * Variables del template para Proxy Persona Jurídica
   */
  const variablesTemplateJuridica = computed(() => {
    if (!necesitaProxyJuridica.value || asistentesConProxyJuridica.value.length === 0) {
      return null;
    }

    if (!datosSociedad.value || !datosJunta.value) {
      return null;
    }

    // Generar un proxy por cada accionista jurídico con representante
    return asistentesConProxyJuridica.value.map((accionista) => {
      const representante = accionista.representante!;

      return {
        // ============================================
        // DATOS DEL ACCIONISTA (PODERDANTE - JURÍDICA)
        // ============================================
        nombre_accionista: accionista.nombre,
        pais_constitucion: "Perú", // TODO: Obtener desde snapshot si es posible
        tipo_registro_tributario: "RUC",
        numero_registro_tributario: accionista.documento,
        nombre_representante: `${representante.nombre} ${representante.apellidoPaterno} ${representante.apellidoMaterno || ""}`.trim(),

        // ============================================
        // DATOS DEL APODERADO
        // ============================================
        nombre_apoderado: `${representante.nombre} ${representante.apellidoPaterno} ${representante.apellidoMaterno || ""}`.trim(),
        tipo_documento_apoderado: representante.tipoDocumento,
        numero_documento_apoderado: representante.numeroDocumento,

        // ============================================
        // DATOS DE LA SOCIEDAD
        // ============================================
        nombre_empresa: datosSociedad.value.razonSocial,
        ruc: datosSociedad.value.ruc,
        numero_partida_registral: datosSociedad.value.partidaRegistral,
        oficina_registral: datosSociedad.value.oficinaRegistral,

        // ============================================
        // DATOS DE LA JUNTA
        // ============================================
        fecha_convocatoria: datosJunta.value.fecha,
        horas: datosJunta.value.hora,
        ciudad: datosSociedad.value.ciudad,
        pais: "Perú",
        date_now: new Date().toLocaleDateString("es-PE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };
    });
  });

  return {
    variablesTemplateNatural,
    variablesTemplateJuridica,
    necesitaProxyNatural,
    necesitaProxyJuridica,
    asistentesConProxyNatural,
    asistentesConProxyJuridica,
  };
}


