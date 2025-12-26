import { computed } from "vue";
import { useDocumentosStore } from "../stores/documentos.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { numeroALetras, montoALetras } from "~/utils/numero-a-letras";

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
  const snapshotStore = useSnapshotStore();

  // Obtener datos del store
  const datosSociedad = computed(() => store.datosSociedad);
  const datosJunta = computed(() => store.datosJunta);
  const datosAporte = computed(() => store.datosAporteDinerario);
  const asistentes = computed(() => store.listaAccionistasAsistentes);

  /**
   * Formatear texto de asistencia para un accionista
   */
  const formatearAsistencia = (accionista: (typeof asistentes.value)[0]): string => {
    const esPersonaNatural = accionista.tipo === "NATURAL";

    if (esPersonaNatural) {
      return `${accionista.nombre}, identificado con ${accionista.tipoDocumento} N° ${accionista.documento}, con ${accionista.acciones} acciones`;
    } else {
      // Persona jurídica
      const representante = accionista.representante;
      if (representante) {
        const nombreRepre = `${representante.nombre} ${representante.apellidoPaterno} ${
          representante.apellidoMaterno || ""
        }`.trim();
        return `${accionista.nombre}, representada por ${nombreRepre}, identificado con ${representante.tipoDocumento} N° ${representante.numeroDocumento}, con ${accionista.acciones} acciones`;
      }
      return `${accionista.nombre}, identificada con ${accionista.tipoDocumento} N° ${accionista.documento}, con ${accionista.acciones} acciones`;
    }
  };

  /**
   * Calcular porcentaje de aprobación de la votación
   * Basado en acciones, no solo en número de votos
   */
  const calcularPorcentajeAprobacion = (
    votacion: NonNullable<typeof datosAporte.value>["votacion"]
  ): number => {
    if (!votacion || votacion.items.length === 0) {
      return 100; // Si no hay votación, se asume aprobado por todos
    }

    // Obtener el primer item de votación (punto de agenda 1)
    const itemVotacion = votacion.items[0];
    if (!itemVotacion) return 100;

    // Calcular acciones a favor (basado en acciones de los accionistas que votaron)
    let accionesAFavor = 0;
    let totalAccionesVotantes = 0;

    itemVotacion.votos.forEach((voto: any) => {
      // Buscar el accionista en la lista de asistentes para obtener sus acciones
      const accionista = asistentes.value.find((a: any) => a.id === voto.accionistaId);
      if (accionista) {
        const acciones = accionista.acciones;
        totalAccionesVotantes += acciones;

        // Verificar si votó a favor
        const votoAFavor =
          (typeof voto.valor === "string" &&
            (voto.valor === "A_FAVOR" || voto.valor === "FAVOR")) ||
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
  const obtenerNombresAFavor = (
    votacion: NonNullable<typeof datosAporte.value>["votacion"]
  ): string[] => {
    if (!votacion || votacion.items.length === 0) {
      return [];
    }

    const itemVotacion = votacion.items[0];
    if (!itemVotacion) return [];

    // Obtener IDs de accionistas que votaron a favor
    const idsAFavor = itemVotacion.votos
      .filter((v: any) => {
        if (typeof v.valor === "string") {
          return v.valor === "A_FAVOR" || v.valor === "FAVOR";
        }
        return v.valor > 0;
      })
      .map((v: any) => v.accionistaId);

    // Buscar nombres en la lista de asistentes
    return asistentes.value
      .filter((a: any) => idsAFavor.includes(a.id))
      .map((a: any) => a.nombre);
  };

  /**
   * Obtener lista de nombres que votaron en contra
   */
  const obtenerNombresEnContra = (
    votacion: NonNullable<typeof datosAporte.value>["votacion"]
  ): string[] => {
    if (!votacion || votacion.items.length === 0) {
      return [];
    }

    const itemVotacion = votacion.items[0];
    if (!itemVotacion) return [];

    // Obtener IDs de accionistas que votaron en contra
    const idsEnContra = itemVotacion.votos
      .filter((v: any) => {
        if (typeof v.valor === "string") {
          return v.valor === "EN_CONTRA" || v.valor === "CONTRA";
        }
        return v.valor < 0;
      })
      .map((v: any) => v.accionistaId);

    // Buscar nombres en la lista de asistentes
    return asistentes.value
      .filter((a: any) => idsEnContra.includes(a.id))
      .map((a: any) => a.nombre);
  };

  /**
   * Construir lista de aportantes con sus aportes
   */
  const construirAportantes = () => {
    if (!datosAporte.value) return [];

    const aportantes = datosAporte.value.aportantes;
    const aportesPorAportante = datosAporte.value.aportesPorAportante;

    return aportantes.map((aportante: any) => {
      const aportes = aportesPorAportante[aportante.id] || [];
      const person = aportante.person;

      // Determinar si es persona natural o jurídica
      const esPersonaNatural =
        aportante.typeShareholder === "NATURAL" || (person?.firstName && !person?.legalName);

      const nombre = esPersonaNatural
        ? `${person?.firstName || ""} ${person?.lastNamePaternal || ""} ${
            person?.lastNameMaternal || ""
          }`.trim()
        : person?.legalName || "Aportante sin nombre";

      return {
        nombre,
        aportes: aportes.map((aporte: any) => ({
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
   * ============================================
   * FUNCIONES HELPER PARA CÁLCULOS DE APORTE DINERARIO
   * ============================================
   */

  /**
   * Calcular capital social desde snapshot
   * Capital social = valor nominal * cantidad suscrita
   */
  const calcularCapitalSocialDesdeSnapshot = (): number => {
    const snapshot = snapshotStore.snapshot;
    if (!snapshot) return 0;

    const valorNominal = snapshot.nominalValue || 0;
    const shareAllocations = snapshot.shareAllocations || [];

    return shareAllocations.reduce((sum, asig) => {
      return sum + valorNominal * asig.cantidadSuscrita;
    }, 0);
  };

  /**
   * Calcular prima desde snapshot
   * Prima = (precioPorAccion - valorNominal) * cantidadSuscrita
   * Solo si precioPorAccion > valorNominal
   */
  const calcularPrimaDesdeSnapshot = (): number => {
    const snapshot = snapshotStore.snapshot;
    if (!snapshot) return 0;

    const valorNominal = snapshot.nominalValue || 0;
    const shareAllocations = snapshot.shareAllocations || [];

    return shareAllocations.reduce((sum, asig) => {
      const diferencia = asig.precioPorAccion - valorNominal;
      if (diferencia > 0) {
        return sum + diferencia * asig.cantidadSuscrita;
      }
      return sum;
    }, 0);
  };

  /**
   * Calcular total de acciones desde snapshot
   */
  const calcularTotalAccionesDesdeSnapshot = (): number => {
    const snapshot = snapshotStore.snapshot;
    if (!snapshot) return 0;

    const shareAllocations = snapshot.shareAllocations || [];
    return shareAllocations.reduce((sum, asig) => sum + asig.cantidadSuscrita, 0);
  };

  /**
   * Calcular dividendo pasivo total desde snapshot
   */
  const _calcularDividendoPasivoDesdeSnapshot = (): number => {
    const snapshot = snapshotStore.snapshot;
    if (!snapshot) return 0;

    const shareAllocations = snapshot.shareAllocations || [];
    return shareAllocations.reduce((sum, asig) => sum + asig.totalDividendosPendientes, 0);
  };

  /**
   * Agrupar asignaciones por tipo de acción
   * Retorna: { comunes, preferenteSinDerechoVoto, clases: [...] }
   */
  const agruparPorTipoAccion = (shareAllocations: any[], shareClasses: any[]) => {
    const comunes = {
      cantidad: 0,
      capitalSocial: 0,
      prima: 0,
      reserva: 0,
      dividendoPasivo: 0,
    };

    const preferenteSinDerechoVoto = {
      cantidad: 0,
      capitalSocial: 0,
      prima: 0,
      reserva: 0,
      dividendoPasivo: 0,
    };

    const clasesMap = new Map<
      string,
      {
        id: string;
        nombre: string;
        cantidad: number;
        capitalSocial: number;
        prima: number;
        reserva: number;
        dividendoPasivo: number;
        conDerechoVoto: boolean;
      }
    >();

    const _valorNominal = snapshotStore.snapshot?.nominalValue || 0;

    shareAllocations.forEach((asig: any) => {
      const shareClass = shareClasses.find((sc: any) => sc.id === asig.accionId);
      if (!shareClass) return;

      const cantidad = asig.cantidadSuscrita;
      const capitalSocial = _valorNominal * cantidad;
      const prima = Math.max(0, (asig.precioPorAccion - _valorNominal) * cantidad);
      const dividendoPasivo = asig.totalDividendosPendientes;

      if (shareClass.tipo === "COMUN") {
        comunes.cantidad += cantidad;
        comunes.capitalSocial += capitalSocial;
        comunes.prima += prima;
        comunes.dividendoPasivo += dividendoPasivo;
      } else if (shareClass.tipo === "PREFERENTE_NO_VOTO") {
        preferenteSinDerechoVoto.cantidad += cantidad;
        preferenteSinDerechoVoto.capitalSocial += capitalSocial;
        preferenteSinDerechoVoto.prima += prima;
        preferenteSinDerechoVoto.dividendoPasivo += dividendoPasivo;
      } else if (shareClass.tipo === "CLASE") {
        const claseId = shareClass.id;
        if (!clasesMap.has(claseId)) {
          clasesMap.set(claseId, {
            id: claseId,
            nombre: shareClass.nombre || "Sin nombre",
            cantidad: 0,
            capitalSocial: 0,
            prima: 0,
            reserva: 0,
            dividendoPasivo: 0,
            conDerechoVoto: shareClass.conDerechoVoto || false,
          });
        }
        const clase = clasesMap.get(claseId)!;
        clase.cantidad += cantidad;
        clase.capitalSocial += capitalSocial;
        clase.prima += prima;
        clase.dividendoPasivo += dividendoPasivo;
      }
    });

    return {
      comunes,
      preferenteSinDerechoVoto,
      clases: Array.from(clasesMap.values()),
    };
  };

  /**
   * Formatear distribución de acciones con valores numéricos y texto
   */
  const formatearDistribucion = (distribucion: any) => {
    const valorNominal = snapshotStore.snapshot?.nominalValue || 0;

    const formatearTipo = (tipo: any) => ({
      cantidad: tipo.cantidad,
      cantidadTexto: numeroALetras(tipo.cantidad),
      capitalSocial: tipo.capitalSocial,
      capitalSocialTexto: montoALetras(tipo.capitalSocial, "PEN"),
      prima: tipo.prima,
      primaTexto: montoALetras(tipo.prima, "PEN"),
      reserva: tipo.reserva || 0,
      reservaTexto: montoALetras(tipo.reserva || 0, "PEN"),
      dividendoPasivo: tipo.dividendoPasivo,
      dividendoPasivoTexto: montoALetras(tipo.dividendoPasivo, "PEN"),
      valorNominal,
      valorNominalTexto: montoALetras(valorNominal, "PEN"),
    });

    return {
      comunes: formatearTipo(distribucion.comunes),
      preferenteSinDerechoVoto: formatearTipo(distribucion.preferenteSinDerechoVoto),
      clases: distribucion.clases.map((clase: any) => ({
        ...formatearTipo(clase),
        id: clase.id,
        nombre: clase.nombre,
        conDerechoVoto: clase.conDerechoVoto,
      })),
    };
  };

  /**
   * Calcular distribución antes del aporte desde snapshot
   */
  const calcularDistribucionAntesAporte = () => {
    const snapshot = snapshotStore.snapshot;
    if (!snapshot) {
      return {
        comunes: { cantidad: 0, capitalSocial: 0, prima: 0, reserva: 0, dividendoPasivo: 0 },
        preferenteSinDerechoVoto: {
          cantidad: 0,
          capitalSocial: 0,
          prima: 0,
          reserva: 0,
          dividendoPasivo: 0,
        },
        clases: [],
      };
    }

    const shareAllocations = snapshot.shareAllocations || [];
    const shareClasses = snapshot.shareClasses || [];

    return agruparPorTipoAccion(shareAllocations, shareClasses);
  };

  /**
   * Calcular distribución después del aporte
   * Suma snapshot + nuevos aportes
   */
  const calcularDistribucionDespuesAporte = () => {
    const distribucionAntes = calcularDistribucionAntesAporte();
    const datosAporteValue = datosAporte.value;
    if (!datosAporteValue) return distribucionAntes;

    const aportes = datosAporteValue.aportes || [];
    const shareClasses = snapshotStore.snapshot?.shareClasses || [];

    // Clonar distribución antes
    const distribucionDespues = {
      comunes: { ...distribucionAntes.comunes },
      preferenteSinDerechoVoto: { ...distribucionAntes.preferenteSinDerechoVoto },
      clases: distribucionAntes.clases.map((c) => ({ ...c })),
    };

    // Agregar nuevos aportes
    aportes.forEach((aporte: any) => {
      const shareClass = shareClasses.find((sc) => sc.id === aporte.shareClass?.id);
      if (!shareClass) return;

      const cantidad = parseFormattedInteger(aporte.sharesToReceiveFormatted || "0");
      const capitalSocial = parseFormattedNumber(aporte.socialCapitalFormatted || "0");
      const prima = parseFormattedNumber(aporte.premiumFormatted || "0");
      const reserva = parseFormattedNumber(aporte.reserveFormatted || "0");
      const dividendoPasivo = parseFormattedNumber(aporte.totalLiabilityFormatted || "0");

      if (shareClass.tipo === "COMUN") {
        distribucionDespues.comunes.cantidad += cantidad;
        distribucionDespues.comunes.capitalSocial += capitalSocial;
        distribucionDespues.comunes.prima += prima;
        distribucionDespues.comunes.reserva += reserva;
        distribucionDespues.comunes.dividendoPasivo += dividendoPasivo;
      } else if (shareClass.tipo === "PREFERENTE_NO_VOTO") {
        distribucionDespues.preferenteSinDerechoVoto.cantidad += cantidad;
        distribucionDespues.preferenteSinDerechoVoto.capitalSocial += capitalSocial;
        distribucionDespues.preferenteSinDerechoVoto.prima += prima;
        distribucionDespues.preferenteSinDerechoVoto.reserva += reserva;
        distribucionDespues.preferenteSinDerechoVoto.dividendoPasivo += dividendoPasivo;
      } else if (shareClass.tipo === "CLASE") {
        let clase = distribucionDespues.clases.find((c) => c.id === shareClass.id);
        if (!clase) {
          clase = {
            id: shareClass.id,
            nombre: shareClass.nombre || "Sin nombre",
            cantidad: 0,
            capitalSocial: 0,
            prima: 0,
            reserva: 0,
            dividendoPasivo: 0,
            conDerechoVoto: shareClass.conDerechoVoto || false,
          };
          distribucionDespues.clases.push(clase);
        }
        clase.cantidad += cantidad;
        clase.capitalSocial += capitalSocial;
        clase.prima += prima;
        clase.reserva += reserva;
        clase.dividendoPasivo += dividendoPasivo;
      }
    });

    return distribucionDespues;
  };

  /**
   * Calcular distribución accionaria con derecho a voto
   * Solo acciones con conDerechoVoto: true
   */
  const calcularDistribucionAccionariaDerechoAvoto = (distribucion: any) => {
    const shareClasses = snapshotStore.snapshot?.shareClasses || [];

    const comunes = {
      cantidad: distribucion.comunes.cantidad,
      capitalSocial: distribucion.comunes.capitalSocial,
      prima: distribucion.comunes.prima,
      reserva: distribucion.comunes.reserva,
      dividendoPasivo: distribucion.comunes.dividendoPasivo,
    };

    const clases = distribucion.clases.filter((clase: any) => {
      const shareClass = shareClasses.find((sc) => sc.id === clase.id);
      return shareClass?.conDerechoVoto === true;
    });

    return {
      comunes,
      clases,
    };
  };

  /**
   * Helper para parsear números formateados (declarado antes de usarse)
   */
  const parseFormattedNumber = (str: string): number => {
    if (!str || typeof str !== "string") return 0;
    const cleaned = str.replace(/[^\d.-]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  /**
   * Helper para parsear enteros formateados (declarado antes de usarse)
   */
  const parseFormattedInteger = (str: string): number => {
    if (!str || typeof str !== "string") return 0;
    const cleaned = str.replace(/[^\d]/g, "");
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  /**
   * Obtener información completa de un accionista para votación
   */
  const obtenerInfoAccionista = (nombre: string) => {
    const accionista = asistentes.value.find((a: any) => a.nombre === nombre);
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
        ? `${accionista.representante.nombre} ${accionista.representante.apellidoPaterno} ${
            accionista.representante.apellidoMaterno || ""
          }`.trim()
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

    // Calcular totales de aportes
    const aportantesData = construirAportantes();
    const sumaCapitalSocial = aportantesData.reduce(
      (sum: number, a: any) =>
        sum +
        a.aportes.reduce(
          (s: number, ap: any) => s + parseFormattedNumber(ap.capital_social),
          0
        ),
      0
    );
    const sumaPrimaTotal = aportantesData.reduce(
      (sum: number, a: any) =>
        sum + a.aportes.reduce((s: number, ap: any) => s + parseFormattedNumber(ap.prima), 0),
      0
    );
    const sumaReserva = aportantesData.reduce(
      (sum: number, a: any) =>
        sum +
        a.aportes.reduce((s: number, ap: any) => s + parseFormattedNumber(ap.reserva), 0),
      0
    );
    const sumaTotalAcciones = aportantesData.reduce(
      (sum: number, a: any) =>
        sum +
        a.aportes.reduce(
          (s: number, ap: any) => s + parseFormattedInteger(ap.cantidad_acciones),
          0
        ),
      0
    );

    // ============================================
    // CALCULAR VALORES DESDE SNAPSHOT
    // ============================================
    const capitalSocialAntes = calcularCapitalSocialDesdeSnapshot();
    const _primaAntes = calcularPrimaDesdeSnapshot();
    const accionesAntes = calcularTotalAccionesDesdeSnapshot();
    const valorNominal = snapshotStore.snapshot?.nominalValue || 0;

    // ============================================
    // CALCULAR VALORES DESPUÉS DEL APORTE
    // ============================================
    const capitalSocialDespues = capitalSocialAntes + sumaCapitalSocial;
    const accionesDespues = accionesAntes + sumaTotalAcciones;
    const incremento = capitalSocialDespues - capitalSocialAntes;
    const numeroDeAccionesIncrementadas = sumaTotalAcciones;
    const montoTotal = sumaCapitalSocial + sumaPrimaTotal + sumaReserva;

    // ============================================
    // CALCULAR DISTRIBUCIONES
    // ============================================
    const distribucionAntesRaw = calcularDistribucionAntesAporte();
    const distribucionDespuesRaw = calcularDistribucionDespuesAporte();
    const distribucionAntesAporte = formatearDistribucion(distribucionAntesRaw);
    const distribucionDespuesAporte = formatearDistribucion(distribucionDespuesRaw);
    const distribucionAccionariaDerechoAvotoAntes = formatearDistribucion(
      calcularDistribucionAccionariaDerechoAvoto(distribucionAntesRaw)
    );
    const distribucionAccionariaDerechoAvotoDespues = formatearDistribucion(
      calcularDistribucionAccionariaDerechoAvoto(distribucionDespuesRaw)
    );

    return {
      tipo: "aporte_dinerario",
      numero: 1, // Se asignará dinámicamente en ActaGenerator
      titulo: "Aumento de capital mediante nuevos aportes dinerarios",

      votacion: {
        cumple_votos: porcentajeAprobacion >= 50,
        no_cumple_votos: porcentajeAprobacion < 50, // Flag explícito para negación
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
        // ============================================
        // VALORES BÁSICOS (mantener compatibilidad)
        // ============================================
        suma_aumentos_efectuados: datosAporte.value.totalAportes.toFixed(2),
        suma_aumentos_efectuados_palabras: datosAporte.value.totalAportesPalabras,
        capital_actual: capitalSocialAntes.toFixed(2),
        capital_actual_palabras:
          capitalSocialAntes === 0 ? "cero soles" : montoALetras(capitalSocialAntes, "PEN"),
        total_capital: capitalSocialDespues.toFixed(2),
        total_capital_palabras: montoALetras(capitalSocialDespues, "PEN"),
        prima_total: sumaPrimaTotal.toFixed(2),
        prima_total_texto: montoALetras(sumaPrimaTotal, "PEN"),
        suma_reserva: sumaReserva.toFixed(2),
        suma_reserva_texto: montoALetras(sumaReserva, "PEN"),
        aportantes: aportantesData,
        accionistas_aumento_capital: [], // TODO: Implementar cuando tengamos snapshot actualizado
        suma_total_acciones: sumaTotalAcciones.toString(),
        suma_capital_social: sumaCapitalSocial.toFixed(2),
        suma_prima_total: sumaPrimaTotal.toFixed(2),
        no_publicar_aviso: datosJunta.value.esUniversal,

        // ============================================
        // VALORES NUMÉRICOS Y TEXTO (Fase 1)
        // ============================================
        capitalSocialAntes,
        capitalSocialAntesTexto: montoALetras(capitalSocialAntes, "PEN"),
        capitalSocialDespues,
        capitalSocialDespuesTexto: montoALetras(capitalSocialDespues, "PEN"),
        accionesAntes,
        accionesAntesTexto: numeroALetras(accionesAntes),
        accionesDespues,
        accionesDespuesTexto: numeroALetras(accionesDespues),
        valorNominal,
        valorNominalTexto: montoALetras(valorNominal, "PEN"),
        incremento,
        incrementoTexto: montoALetras(incremento, "PEN"),
        numeroDeAccionesIncrementadas,
        numeroDeAccionesIncrementadasTexto: numeroALetras(numeroDeAccionesIncrementadas),
        primaTotal: sumaPrimaTotal,
        primaTotalTexto: montoALetras(sumaPrimaTotal, "PEN"),
        reservaTotal: sumaReserva,
        reservaTotalTexto: montoALetras(sumaReserva, "PEN"),
        montoTotal,
        montoTotalTexto: montoALetras(montoTotal, "PEN"),

        // ============================================
        // DISTRIBUCIONES (Fases 2, 3, 4)
        // ============================================
        distribucionAntesAporte,
        distribucionDespuesAporte,
        distribucionAccionariaDerechoAvotoAntes: distribucionAccionariaDerechoAvotoAntes,
        distribucionAccionariaDerechoAvotoDespues: distribucionAccionariaDerechoAvotoDespues,
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
