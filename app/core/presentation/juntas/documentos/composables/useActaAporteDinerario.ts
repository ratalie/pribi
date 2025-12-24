import { computed } from "vue";
import { useDocumentosStore } from "../stores/documentos.store";
import { numeroALetras } from "~/utils/numero-a-letras";

/**
 * Composable para generar variables del template del Acta de Aporte Dinerario
 * 
 * Responsabilidades:
 * - Usar getters del store para obtener datos
 * - Calcular variables específicas del template
 * - Formatear datos para mustache
 * - Retornar objeto con todas las variables necesarias
 * 
 * Uso:
 * ```typescript
 * const { puntoAcuerdo } = useActaAporteDinerario();
 * const punto = puntoAcuerdo.value; // Objeto con estructura de punto de acuerdo
 * ```
 */
export function useActaAporteDinerario() {
  const store = useDocumentosStore();

  // Obtener datos del store
  const datosSociedad = computed(() => store.datosSociedad);
  const datosJunta = computed(() => store.datosJunta);
  const datosAporte = computed(() => store.datosAporteDinerario);
  const asistentes = computed(() => store.listaAccionistasAsistentes);
  const totalAcciones = computed(() => store.totalAccionesConDerechoVoto);
  const porcentajeAsistencia = computed(() => store.porcentajeAsistencia);

  /**
   * Formatear texto de asistencia para un accionista
   */
  const formatearAsistencia = (accionista: typeof asistentes.value[0]): string => {
    const esPersonaNatural = accionista.tipo === "NATURAL";
    
    if (esPersonaNatural) {
      return `${accionista.nombre}, identificado con ${accionista.tipoDocumento} N° ${accionista.documento}, con ${accionista.acciones} acciones`;
    } else {
      // Persona jurídica
      const representante = accionista.representante;
      if (representante) {
        const nombreRepre = `${representante.nombre} ${representante.apellidoPaterno} ${representante.apellidoMaterno || ""}`.trim();
        return `${accionista.nombre}, representada por ${nombreRepre}, identificado con ${representante.tipoDocumento} N° ${representante.numeroDocumento}, con ${accionista.acciones} acciones`;
      }
      return `${accionista.nombre}, identificada con ${accionista.tipoDocumento} N° ${accionista.documento}, con ${accionista.acciones} acciones`;
    }
  };

  /**
   * Calcular porcentaje de aprobación de la votación
   * Basado en acciones, no solo en número de votos
   */
  const calcularPorcentajeAprobacion = (votacion: NonNullable<typeof datosAporte.value>["votacion"]): number => {
    if (!votacion || votacion.items.length === 0) {
      return 100; // Si no hay votación, se asume aprobado por todos
    }

    // Obtener el primer item de votación (punto de agenda 1)
    const itemVotacion = votacion.items[0];
    if (!itemVotacion) return 100;

    // Calcular acciones a favor (basado en acciones de los accionistas que votaron)
    let accionesAFavor = 0;
    let totalAccionesVotantes = 0;

    itemVotacion.votos.forEach((voto) => {
      // Buscar el accionista en la lista de asistentes para obtener sus acciones
      const accionista = asistentes.value.find((a) => a.id === voto.accionistaId);
      if (accionista) {
        const acciones = accionista.acciones;
        totalAccionesVotantes += acciones;

        // Verificar si votó a favor
        const votoAFavor =
          (typeof voto.valor === "string" && (voto.valor === "A_FAVOR" || voto.valor === "FAVOR")) ||
          (typeof voto.valor === "number" && voto.valor > 0);

        if (votoAFavor) {
          accionesAFavor += acciones;
        }
      }
    });

    // Calcular porcentaje basado en acciones
    if (totalAccionesVotantes === 0) return 100;

    const porcentaje = (accionesAFavor / totalAccionesVotantes) * 100;
    return Math.round(porcentaje * 100) / 100; // 2 decimales
  };

  /**
   * Obtener lista de nombres que votaron a favor
   */
  const obtenerNombresAFavor = (votacion: NonNullable<typeof datosAporte.value>["votacion"]): string[] => {
    if (!votacion || votacion.items.length === 0) {
      return [];
    }

    const itemVotacion = votacion.items[0];
    if (!itemVotacion) return [];

    // Obtener IDs de accionistas que votaron a favor
    const idsAFavor = itemVotacion.votos
      .filter((v) => {
        if (typeof v.valor === "string") {
          return v.valor === "A_FAVOR" || v.valor === "FAVOR";
        }
        return v.valor > 0;
      })
      .map((v) => v.accionistaId);

    // Buscar nombres en la lista de asistentes
    return asistentes.value
      .filter((a) => idsAFavor.includes(a.id))
      .map((a) => a.nombre);
  };

  /**
   * Obtener lista de nombres que votaron en contra
   */
  const obtenerNombresEnContra = (votacion: NonNullable<typeof datosAporte.value>["votacion"]): string[] => {
    if (!votacion || votacion.items.length === 0) {
      return [];
    }

    const itemVotacion = votacion.items[0];
    if (!itemVotacion) return [];

    // Obtener IDs de accionistas que votaron en contra
    const idsEnContra = itemVotacion.votos
      .filter((v) => {
        if (typeof v.valor === "string") {
          return v.valor === "EN_CONTRA" || v.valor === "CONTRA";
        }
        return v.valor < 0;
      })
      .map((v) => v.accionistaId);

    // Buscar nombres en la lista de asistentes
    return asistentes.value
      .filter((a) => idsEnContra.includes(a.id))
      .map((a) => a.nombre);
  };

  /**
   * Construir lista de aportantes con sus aportes
   */
  const construirAportantes = () => {
    if (!datosAporte.value) return [];

    const aportantes = datosAporte.value.aportantes;
    const aportesPorAportante = datosAporte.value.aportesPorAportante;

    return aportantes.map((aportante) => {
      const aportes = aportesPorAportante[aportante.id] || [];
      const person = aportante.person;

      // Determinar si es persona natural o jurídica
      const esPersonaNatural = aportante.typeShareholder === "NATURAL" || 
        (person?.firstName && !person?.legalName);

      const nombre = esPersonaNatural
        ? `${person?.firstName || ""} ${person?.lastNamePaternal || ""} ${person?.lastNameMaternal || ""}`.trim()
        : person?.legalName || "Aportante sin nombre";

      return {
        nombre,
        aportes: aportes.map((aporte) => ({
          aporte_soles: aporte.contributionAmountInBaseCurrencyFormatted,
          cantidad_acciones: aporte.sharesToReceiveFormatted,
          tipo_accion: aporte.shareClass?.className || "",
          capital_social: aporte.socialCapitalFormatted,
          prima: aporte.premiumFormatted,
          reserva: aporte.reserveFormatted,
        })),
      };
    });
  };

  /**
   * Obtener información completa de un accionista para votación
   */
  const obtenerInfoAccionista = (nombre: string) => {
    const accionista = asistentes.value.find((a) => a.nombre === nombre);
    if (!accionista) {
      return {
        nombres: nombre,
        tipoDoc: "DNI",
        numeroDoc: "",
        esJuridico: false,
        tieneRepresentante: false,
      };
    }

    const esJuridico = accionista.tipo === "JURIDICA";
    const tieneRepresentante = !!accionista.representante;

    return {
      nombres: nombre,
      tipoDoc: accionista.tipoDocumento || "DNI",
      numeroDoc: accionista.documento || "",
      esJuridico,
      tieneRepresentante,
      nombreRepre: accionista.representante
        ? `${accionista.representante.nombre} ${accionista.representante.apellidoPaterno} ${accionista.representante.apellidoMaterno || ""}`.trim()
        : "",
      tipoDocRepre: accionista.representante?.tipoDocumento || "",
      numeroDocRepre: accionista.representante?.numeroDocumento || "",
      esEmpresaExtranjera: false, // TODO: Obtener desde snapshot
    };
  };

  /**
   * Punto de acuerdo para Aporte Dinerario
   * Estructura nueva compatible con acta única
   */
  const puntoAcuerdo = computed(() => {
    // Validar que tengamos todos los datos necesarios
    if (!datosSociedad.value || !datosJunta.value || !datosAporte.value) {
      return null;
    }

    const porcentajeAprobacion = calcularPorcentajeAprobacion(datosAporte.value.votacion);
    const nombresAFavor = obtenerNombresAFavor(datosAporte.value.votacion);
    const nombresEnContra = obtenerNombresEnContra(datosAporte.value.votacion);

    /**
     * Helper para parsear números formateados de manera robusta
     */
    const parseFormattedNumber = (str: string): number => {
      if (!str || typeof str !== "string") return 0;
      // Remover símbolos de moneda, espacios, comas, y otros caracteres no numéricos
      const cleaned = str.replace(/[^\d.-]/g, "");
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    };

    /**
     * Helper para parsear enteros formateados
     */
    const parseFormattedInteger = (str: string): number => {
      if (!str || typeof str !== "string") return 0;
      const cleaned = str.replace(/[^\d]/g, "");
      const parsed = parseInt(cleaned, 10);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Calcular totales de aportes
    const aportantesData = construirAportantes();
    const sumaCapitalSocial = aportantesData.reduce(
      (sum, a) =>
        sum +
        a.aportes.reduce(
          (s, ap) => s + parseFormattedNumber(ap.capital_social),
          0
        ),
      0
    );
    const sumaPrimaTotal = aportantesData.reduce(
      (sum, a) =>
        sum +
        a.aportes.reduce(
          (s, ap) => s + parseFormattedNumber(ap.prima),
          0
        ),
      0
    );
    const sumaReserva = aportantesData.reduce(
      (sum, a) =>
        sum +
        a.aportes.reduce(
          (s, ap) => s + parseFormattedNumber(ap.reserva),
          0
        ),
      0
    );
    const sumaTotalAcciones = aportantesData.reduce(
      (sum, a) =>
        sum +
        a.aportes.reduce(
          (s, ap) => s + parseFormattedInteger(ap.cantidad_acciones),
          0
        ),
      0
    );

    // TODO: Obtener capital actual desde snapshot
    const capitalActual = 0;
    const capitalActualNum = parseFloat(datosAporte.value.totalAportes.toString());
    const totalCapital = capitalActual + capitalActualNum;

    return {
      tipo: "aporte_dinerario",
      numero: 1, // Se asignará dinámicamente en ActaGenerator
      titulo: "Aumento de capital mediante nuevos aportes dinerarios",

      votacion: {
        cumple_votos: porcentajeAprobacion >= 50,
        porcentaje: porcentajeAprobacion.toFixed(2),
        lista_nombres: nombresAFavor.join(", "),
        accionistas_afavor: nombresAFavor.map((nombre) => obtenerInfoAccionista(nombre)),
        accionistas_contra: nombresEnContra.map((nombre) => {
          const info = obtenerInfoAccionista(nombre);
          return {
            nombres: info.nombres,
            tipoDoc: info.tipoDoc,
            numeroDoc: info.numeroDoc,
          };
        }),
        accionistas_abstencion: [], // TODO: Implementar cuando tengamos abstenciones
      },

      datos: {
        suma_aumentos_efectuados: datosAporte.value.totalAportes.toFixed(2),
        suma_aumentos_efectuados_palabras: datosAporte.value.totalAportesPalabras,
        capital_actual: capitalActual.toFixed(2),
        capital_actual_palabras: capitalActual === 0 ? "cero" : numeroALetras(capitalActual),
        total_capital: totalCapital.toFixed(2),
        total_capital_palabras: numeroALetras(totalCapital),
        prima_total: sumaPrimaTotal.toFixed(2),
        suma_reserva: sumaReserva.toFixed(2),
        aportantes: aportantesData,
        accionistas_aumento_capital: [], // TODO: Implementar cuando tengamos snapshot actualizado
        suma_total_acciones: sumaTotalAcciones.toString(),
        suma_capital_social: sumaCapitalSocial.toFixed(2),
        suma_prima_total: sumaPrimaTotal.toFixed(2),
        no_publicar_aviso: datosJunta.value.esUniversal, // Si es universal, no publicar aviso
      },
    };
  });

  return {
    // Computed
    puntoAcuerdo, // Nueva estructura para acta única
    datosSociedad,
    datosJunta,
    datosAporte,
    asistentes,

    // Methods (mantener para compatibilidad si se necesitan)
    formatearAsistencia,
    calcularPorcentajeAprobacion,
    obtenerNombresAFavor,
    obtenerNombresEnContra,
    construirAportantes,
  };
}

