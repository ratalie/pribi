/**
 * Servicio de Dominio: ConstructorVariablesActa
 *
 * Responsabilidades:
 * - Construir todas las variables del acta desde datos base
 * - Orquestar todos los servicios de dominio
 * - Validar datos antes de construir
 *
 * Este servicio centraliza toda la lógica de construcción de variables
 * para el template del acta, separándola completamente del store.
 */

import type { DownloadDataDTO } from "../../application/dtos/download-data.dto";
import type { SnapshotCompleteDTO } from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";
import { CalculadoraAportes } from "./CalculadoraAportes";
import { AgrupadorAcciones } from "./AgrupadorAcciones";
import { FormateadorTexto } from "./FormateadorTexto";
import { ConstructorAsistenciaDetallada } from "./ConstructorAsistenciaDetallada";

export interface VariablesBase {
  acta_label: string;
  ciudad: string;
  date: string;
  hours: string;
  nombre_empresa: string;
  direccion: string;
  ruc: string;
}

export interface VariablesJunta {
  nombre_junta: string;
  tiene_nombre_junta: boolean;
  es_anual_obligatoria: boolean;
  tipo_junta: "UNIVERSAL" | "GENERAL";
  es_universal: boolean;
  es_general: boolean;
  convocatoria_activa: string | null;
  convocatoria_realizada: string;
  fecha_convocatoria: string;
  primera_convocatoria: {
    fecha: string;
    hora: string;
    lugar: string;
    modo: string;
  } | null;
  segunda_convocatoria: {
    fecha: string;
    hora: string;
    lugar: string;
    modo: string;
  } | null;
  _convocatoria_realizada_lower: string;
}

export interface VariablesAsistencia {
  asistencia_lista: Array<{ texto_asistencia: string }>;
  accionistas_asistentes: Array<any>;
  accionistas_con_derecho_voto: Array<any>;
  total_acciones: string;
  total_acciones_numero: number;
  porcentaje_acciones: string;
  porcentaje_acciones_numero: number;
  valor_nominal: string;
  // Nuevas variables para total de acciones con derecho a voto
  total_acciones_derecho_voto_presentes: number;
  total_acciones_derecho_voto_total: number;
  porcentaje_acciones_respecto_total_acciones_derecho_voto: number;
  porcentaje_acciones_respecto_total_acciones_derecho_voto_texto: string;
}

export interface VariablesPresidenciaSecretaria {
  presidente_junta: string;
  secretario_junta: string;
  hora_acta: string;
  asistentes_firmas: Array<{ nombre_accionista: string }>;
  is_universal: boolean;
  porcentaje_acciones_asistentes: string;
}

export interface SubpuntoAgenda {
  numero: number;
  titulo: string;
}

export interface VariablesAgenda {
  numero: number;
  titulo: string;
  subpuntos: SubpuntoAgenda[];
}

export interface VariablesQuorum {
  primera_simple: number;
  primera_calificada: number;
  segunda_simple: number;
  segunda_calificada: number;
  convocatoria_realizada: string;
  porcentaje_asistencia: number;
  porcentaje_asistencia_texto: string;
  cumple_quorum_simple: boolean;
  cumple_quorum_calificado: boolean;
  apertura_junta: boolean;
}

export interface VariablesAperturaPuntos {
  punto_id: string;
  punto_titulo: string;
  tipo_junta: string;
  convocatoria_realizada: string;
  tipoPuntoAgenda: "simple" | "calificado";
  porcentajeAsistenciaRequerido: number;
  porcentajeAsistenciaPunto: number;
  aperturado: boolean;
}

export interface AporteDinerarioVariables {
  tipo: string;
  numero: number;
  titulo: string;
  votacion: any;
  datos: any;
}

export interface VariablesCompletas {
  variablesBase: VariablesBase;
  variablesJunta: VariablesJunta;
  variablesAsistencia: VariablesAsistencia;
  variablesPresidenciaSecretaria: VariablesPresidenciaSecretaria;
  variablesAgenda: VariablesAgenda[];
  variablesQuorum: VariablesQuorum;
  variablesAperturaPuntos: VariablesAperturaPuntos[];
  aporteDinerario: AporteDinerarioVariables | null;
}

/**
 * Datos auxiliares necesarios para construir variables
 * Estos vienen de los stores de presentación
 */
export interface DatosAuxiliares {
  datosSociedad: any;
  datosJunta: any;
  asistentes: any[];
  todosAccionistas: any[];
  totalAcciones: number;
  porcentajeAsistencia: number;
  puntosActivos: string[];
  directores: any[];
  meetingDetails: any;
  instaladaEnConvocatoria: string | null;
  quorums: any;
  datosAporteDinerario: any | null; // Datos transformados del store
}

export class ConstructorVariablesActa {
  private readonly constructorAsistencia: ConstructorAsistenciaDetallada;

  constructor(
    private readonly calculadora: CalculadoraAportes,
    private readonly agrupador: AgrupadorAcciones,
    private readonly formateador: FormateadorTexto
  ) {
    this.constructorAsistencia = new ConstructorAsistenciaDetallada();
  }

  /**
   * Construir variables base (encabezado)
   *
   * Lógica de acta_label:
   * - Si es obligatoria anual: "ACTA DE JUNTA OBLIGATORIA ANUAL"
   * - Si es universal: "ACTA DE JUNTA UNIVERSAL DE ACCIONISTAS"
   * - Si es general: "ACTA DE JUNTA GENERAL DE ACCIONISTAS"
   * - Si tiene nombre personalizado, se usa ese nombre (pero acta_label sigue la lógica anterior)
   */
  construirVariablesBase(datosSociedad: any, datosJunta: any): VariablesBase {
    // Determinar acta_label según tipo de junta
    let actaLabel: string;

    if (datosJunta.esAnualObligatoria) {
      // Junta obligatoria anual tiene prioridad
      actaLabel = "ACTA DE JUNTA OBLIGATORIA ANUAL";
    } else if (datosJunta.esUniversal) {
      actaLabel = "ACTA DE JUNTA UNIVERSAL DE ACCIONISTAS";
    } else {
      actaLabel = "ACTA DE JUNTA GENERAL DE ACCIONISTAS";
    }

    return {
      acta_label: actaLabel,
      ciudad:
        datosSociedad.ciudad ||
        datosSociedad.departamento ||
        datosSociedad.provincia ||
        "Lima",
      date:
        datosJunta.fecha ||
        new Date().toLocaleDateString("es-PE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      hours:
        datosJunta.hora ||
        new Date().toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      nombre_empresa: datosSociedad.razonSocial,
      direccion: datosSociedad.direccion || "",
      ruc: datosSociedad.ruc || "",
    };
  }

  /**
   * Construir variables de junta
   */
  construirVariablesJunta(
    datosJunta: any,
    meetingDetails: any,
    instaladaEnConvocatoria: string | null
  ): VariablesJunta {
    const nombreJunta = meetingDetails?.nombreJunta || null;

    let nombreJuntaFinal: string;
    let tieneNombreJunta: boolean;

    if (nombreJunta) {
      nombreJuntaFinal = nombreJunta;
      tieneNombreJunta = true;
    } else {
      if (datosJunta.esAnualObligatoria) {
        nombreJuntaFinal = datosJunta.esUniversal
          ? "Junta Universal Ordinaria"
          : "Junta General Ordinaria";
      } else {
        nombreJuntaFinal = datosJunta.esUniversal
          ? "Junta Universal Extraordinaria"
          : "Junta General Extraordinaria";
      }
      tieneNombreJunta = false;
    }

    const convocatoriaRealizada = datosJunta.esUniversal
      ? "UNIVERSAL"
      : instaladaEnConvocatoria || "PRIMERA";

    return {
      nombre_junta: nombreJuntaFinal,
      tiene_nombre_junta: tieneNombreJunta,
      es_anual_obligatoria: datosJunta.esAnualObligatoria || false,
      tipo_junta: datosJunta.esUniversal ? "UNIVERSAL" : "GENERAL",
      es_universal: datosJunta.esUniversal,
      es_general: !datosJunta.esUniversal,
      convocatoria_activa: datosJunta.esUniversal ? null : convocatoriaRealizada,
      convocatoria_realizada: convocatoriaRealizada,
      fecha_convocatoria: datosJunta.esUniversal
        ? datosJunta.primeraConvocatoria?.dateFormatted || ""
        : convocatoriaRealizada === "PRIMERA"
        ? datosJunta.primeraConvocatoria?.dateFormatted || ""
        : datosJunta.segundaConvocatoria?.dateFormatted || "",
      primera_convocatoria: datosJunta.primeraConvocatoria
        ? {
            fecha: datosJunta.primeraConvocatoria.dateFormatted || "",
            hora: datosJunta.primeraConvocatoria.timeFormatted || "",
            lugar: datosJunta.primeraConvocatoria.place || "",
            modo: datosJunta.primeraConvocatoria.modeFormatted || "",
          }
        : null,
      segunda_convocatoria: datosJunta.segundaConvocatoria
        ? {
            fecha: datosJunta.segundaConvocatoria.dateFormatted || "",
            hora: datosJunta.segundaConvocatoria.timeFormatted || "",
            lugar: datosJunta.segundaConvocatoria.place || "",
            modo: datosJunta.segundaConvocatoria.modeFormatted || "",
          }
        : null,
      _convocatoria_realizada_lower:
        convocatoriaRealizada === "UNIVERSAL"
          ? "universal"
          : convocatoriaRealizada.toLowerCase(),
    };
  }

  /**
   * Construir variables de asistencia
   * Usa ConstructorAsistenciaDetallada para construir textos detallados
   */
  construirVariablesAsistencia(
    asistentes: any[],
    todosAccionistas: any[],
    totalAcciones: number,
    porcentajeAsistencia: number,
    snapshot: SnapshotCompleteDTO | null
  ): VariablesAsistencia {
    // Construir lista de asistencia detallada con desglose de acciones
    const asistenciaLista = this.constructorAsistencia.construirListaAsistenciaDetallada(
      asistentes,
      snapshot
    );

    // Calcular total de acciones con derecho a voto presentes
    const totalAccionesConDerechoVoto =
      this.constructorAsistencia.calcularTotalAccionesConDerechoVoto(asistentes, snapshot);

    // Calcular total de acciones con derecho a voto en toda la sociedad
    const totalAccionesConDerechoVotoTotal = this.calcularTotalAccionesConDerechoVotoTotal(
      snapshot
    );

    // Calcular porcentaje de acciones presentes respecto al total
    const porcentajeRespectoTotal =
      totalAccionesConDerechoVotoTotal > 0
        ? (totalAccionesConDerechoVoto / totalAccionesConDerechoVotoTotal) * 100
        : 0;

    return {
      asistencia_lista: asistenciaLista,
      accionistas_asistentes: asistentes.map((a: any) => ({
        id: a.id,
        nombre: a.nombre,
        tipo: a.tipo,
        acciones: a.acciones,
        porcentaje: a.porcentaje,
        documento: a.documento,
        tipoDocumento: a.tipoDocumento,
        representante: a.representante
          ? {
              nombre: `${a.representante.nombre} ${a.representante.apellidoPaterno} ${
                a.representante.apellidoMaterno || ""
              }`.trim(),
              documento: a.representante.numeroDocumento,
              tipoDocumento: a.representante.tipoDocumento,
            }
          : null,
      })),
      accionistas_con_derecho_voto: todosAccionistas.map((a: any) => ({
        id: a.id,
        nombre: a.nombre,
        tipo: a.tipo,
        acciones: a.acciones,
        porcentaje: a.porcentaje,
        documento: a.documento,
        tipoDocumento: a.tipoDocumento,
        representante: a.representante
          ? {
              nombre: `${a.representante.nombre} ${a.representante.apellidoPaterno} ${
                a.representante.apellidoMaterno || ""
              }`.trim(),
              documento: a.representante.numeroDocumento,
              tipoDocumento: a.representante.tipoDocumento,
            }
          : null,
      })),
      total_acciones: totalAccionesConDerechoVoto.toLocaleString("es-PE"),
      total_acciones_numero: totalAccionesConDerechoVoto,
      porcentaje_acciones: porcentajeAsistencia.toFixed(2) + "%",
      porcentaje_acciones_numero: porcentajeAsistencia,
      valor_nominal: snapshot?.nominalValue?.toFixed(2) || "1.00",
      // Nuevas variables
      total_acciones_derecho_voto_presentes: totalAccionesConDerechoVoto,
      total_acciones_derecho_voto_total: totalAccionesConDerechoVotoTotal,
      porcentaje_acciones_respecto_total_acciones_derecho_voto: porcentajeRespectoTotal,
      porcentaje_acciones_respecto_total_acciones_derecho_voto_texto:
        porcentajeRespectoTotal.toFixed(2) + "%",
    };
  }

  /**
   * Calcular total de acciones con derecho a voto en toda la sociedad
   */
  private calcularTotalAccionesConDerechoVotoTotal(
    snapshot: SnapshotCompleteDTO | null
  ): number {
    if (!snapshot) return 0;

    const shareAllocations = snapshot.shareAllocations || [];
    const shareClasses = snapshot.shareClasses || [];

    let total = 0;

    shareAllocations.forEach((asig: any) => {
      const shareClass = shareClasses.find((sc: any) => sc.id === asig.accionId);
      if (!shareClass) return;

      // Solo contar acciones con derecho a voto
      if (
        shareClass.tipo === "COMUN" ||
        (shareClass.tipo === "CLASE" && shareClass.conDerechoVoto)
      ) {
        total += asig.cantidadSuscrita || 0;
      }
    });

    return total;
  }

  /**
   * Construir variables de presidencia y secretaría
   */
  construirVariablesPresidenciaSecretaria(
    datosJunta: any,
    presidenteId: string | null | undefined,
    secretarioId: string | null | undefined,
    directores: any[],
    snapshot: SnapshotCompleteDTO | null,
    asistentes: any[],
    porcentajeAsistencia: number
  ): VariablesPresidenciaSecretaria {
    const obtenerNombreDesdePersonId = (
      personId: string | null | undefined,
      esSecretario: boolean = false
    ): string => {
      if (!personId) {
        return "No especificado";
      }

      // Buscar en directores
      const director = directores.find((d) => d.persona.id === personId);
      if (director) {
        return `${director.persona.nombre} ${director.persona.apellidoPaterno} ${
          director.persona.apellidoMaterno || ""
        }`.trim();
      }

      // Buscar en apoderados
      const apoderado = snapshot?.attorneys?.find((a) => a.persona.id === personId);
      if (apoderado) {
        if (apoderado.persona.tipo === "NATURAL") {
          return `${apoderado.persona.nombre} ${apoderado.persona.apellidoPaterno} ${
            apoderado.persona.apellidoMaterno || ""
          }`.trim();
        } else {
          return apoderado.persona.razonSocial || "No especificado";
        }
      }

      const nombreFallback = esSecretario ? datosJunta?.secretario : datosJunta?.presidente;
      return nombreFallback || "No especificado";
    };

    return {
      presidente_junta: obtenerNombreDesdePersonId(presidenteId, false),
      secretario_junta: obtenerNombreDesdePersonId(secretarioId, true),
      hora_acta: new Date().toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      asistentes_firmas: datosJunta?.esUniversal
        ? asistentes.map((a: any) => ({
            nombre_accionista: a.nombre,
          }))
        : [],
      is_universal: datosJunta?.esUniversal || false,
      porcentaje_acciones_asistentes: porcentajeAsistencia.toFixed(2),
    };
  }

  /**
   * Construir variables de agenda con subpuntos
   * Agrupa los puntos por categoría principal
   */
  construirVariablesAgenda(puntosActivos: string[]): VariablesAgenda[] {
    const agenda: VariablesAgenda[] = [];
    let numeroPrincipal = 1;

    // 1. Aumento de Capital
    const puntosAumentoCapital = [];
    if (puntosActivos.includes("aporteDinerario")) {
      puntosAumentoCapital.push({
        numero: puntosAumentoCapital.length + 1,
        titulo: "Aumento de capital mediante nuevos aportes dinerarios.",
      });
    }
    if (puntosActivos.includes("capitalizacionCreditos")) {
      puntosAumentoCapital.push({
        numero: puntosAumentoCapital.length + 1,
        titulo: "Aumento de capital mediante capitalización de créditos.",
      });
    }
    if (puntosAumentoCapital.length > 0) {
      puntosAumentoCapital.push({
        numero: puntosAumentoCapital.length + 1,
        titulo: "Modificación parcial del estatuto social de la Sociedad.",
      });
      puntosAumentoCapital.push({
        numero: puntosAumentoCapital.length + 1,
        titulo: "Otorgamiento de facultades para la formalización de acuerdos.",
      });
      agenda.push({
        numero: numeroPrincipal++,
        titulo: "Aumento de Capital",
        subpuntos: puntosAumentoCapital,
      });
    }

    // 2. Remoción de Apoderados
    if (puntosActivos.includes("remocionApoderados")) {
      agenda.push({
        numero: numeroPrincipal++,
        titulo: "Remoción de Apoderados",
        subpuntos: [
          { numero: 1, titulo: "Remoción de Apoderados" },
          { numero: 2, titulo: "Otorgamiento de facultades para la formalización de acuerdos." },
        ],
      });
    }

    // 3. Remoción de Gerente General
    if (puntosActivos.includes("remocionGerente")) {
      agenda.push({
        numero: numeroPrincipal++,
        titulo: "Remoción de Gerente General",
        subpuntos: [
          { numero: 1, titulo: "Remoción de Gerente General" },
          { numero: 2, titulo: "Otorgamiento de facultades para la formalización de acuerdos." },
        ],
      });
    }

    // 4. Nombramiento de Apoderados
    if (puntosActivos.includes("nombramientoApoderados")) {
      agenda.push({
        numero: numeroPrincipal++,
        titulo: "Nombramiento de Apoderados",
        subpuntos: [
          { numero: 1, titulo: "Nombramiento de Apoderados" },
          { numero: 2, titulo: "Nombramiento de Apoderados y otorgamiento de facultades." },
          { numero: 3, titulo: "Otorgamiento de Facultades a Apoderados" },
          { numero: 4, titulo: "Otorgamiento de facultades para la formalización de acuerdos." },
        ],
      });
    }

    // 5. Nombramiento de Gerente General
    if (puntosActivos.includes("nombramientoGerente")) {
      agenda.push({
        numero: numeroPrincipal++,
        titulo: "Nombramiento de Gerente General",
        subpuntos: [
          { numero: 1, titulo: "Nombramiento de Gerente." },
          { numero: 2, titulo: "Nombramiento de Gerente General y otorgamiento de facultades." },
          { numero: 3, titulo: "Otorgamiento de Facultades al Gerente General" },
          { numero: 4, titulo: "Otorgamiento de facultades para la formalización de acuerdos." },
        ],
      });
    }

    // 6. Remoción de Directores
    if (puntosActivos.includes("remocionDirectores")) {
      agenda.push({
        numero: numeroPrincipal++,
        titulo: "Remoción de directores",
        subpuntos: [
          { numero: 1, titulo: "Remoción de directores" },
          { numero: 2, titulo: "Otorgamiento de facultades para la formalización de acuerdos." },
        ],
      });
    }

    // 7. Nombramiento de Directores
    if (puntosActivos.includes("nombramientoDirectores")) {
      agenda.push({
        numero: numeroPrincipal++,
        titulo: "Nombramiento de directores",
        subpuntos: [
          {
            numero: 1,
            titulo:
              "Determinación del número de personas que conformarán el directorio de la sociedad",
          },
          { numero: 2, titulo: "Nombramiento de Directores" },
          { numero: 3, titulo: "Otorgamiento de facultades para la formalización de acuerdos." },
        ],
      });
    }

    // 8. Nombramiento de nuevo Directorio
    if (puntosActivos.includes("nombramientoNuevoDirectorio")) {
      agenda.push({
        numero: numeroPrincipal++,
        titulo: "Nombramiento de nuevo Directorio",
        subpuntos: [
          { numero: 1, titulo: "Nombramiento de Nuevo Directorio" },
          { numero: 2, titulo: "Otorgamiento de facultades para la formalización de acuerdos." },
        ],
      });
    }

    // 9. Delegación al Directorio para el nombramiento de Auditores Externos
    if (puntosActivos.includes("designacionAuditores")) {
      agenda.push({
        numero: numeroPrincipal++,
        titulo: "Delegación al Directorio para el nombramiento de Auditores Externos",
        subpuntos: [
          { numero: 1, titulo: "Nombramiento de Auditores Externos" },
          { numero: 2, titulo: "Otorgamiento de facultades para la formalización de acuerdos" },
        ],
      });
    }

    // 10. Gestión Social y resultado económicos
    if (puntosActivos.includes("gestionSocial")) {
      agenda.push({
        numero: numeroPrincipal++,
        titulo: "Gestión Social y resultado económicos",
        subpuntos: [
          {
            numero: 1,
            titulo:
              "Aprobación de estados financieros, depende si ya está la junta obligatoria anual realizada.",
          },
          {
            numero: 2,
            titulo:
              "Pronunciamiento sobre la gestión social y los resultados económicos del ejercicio anterior expresados en estados financieros.",
          },
          { numero: 3, titulo: "Otorgamiento de facultades para la formalización de acuerdos." },
        ],
      });
    }

    // 11. Aplicación de Utilidades
    if (puntosActivos.includes("aplicacionResultados")) {
      agenda.push({
        numero: numeroPrincipal++,
        titulo: "Aplicación de Utilidades",
        subpuntos: [
          { numero: 1, titulo: "Reparto de Utilidades." },
          { numero: 2, titulo: "Otorgamiento de facultades para la formalización de acuerdos." },
        ],
      });
    }

    // 12. Punto de Agenda Libre (si existe)
    // TODO: Implementar cuando se agregue punto libre

    return agenda;
  }

  /**
   * Construir variables de quórum
   */
  construirVariablesQuorum(
    datosJunta: any,
    quorums: any,
    porcentajeAsistencia: number,
    instaladaEnConvocatoria: string | null,
    puntosActivos: string[]
  ): VariablesQuorum {
    if (!quorums) {
      return {
        primera_simple: 50,
        primera_calificada: 66.66,
        segunda_simple: 25,
        segunda_calificada: 50,
        convocatoria_realizada: datosJunta?.esUniversal ? "UNIVERSAL" : "PRIMERA",
        porcentaje_asistencia: porcentajeAsistencia,
        porcentaje_asistencia_texto: porcentajeAsistencia.toFixed(2) + "%",
        cumple_quorum_simple: false,
        cumple_quorum_calificado: false,
        apertura_junta: false,
      };
    }

    const convocatoriaRealizada = datosJunta?.esUniversal
      ? "UNIVERSAL"
      : instaladaEnConvocatoria || "PRIMERA";

    let cumpleQuorumSimple = false;
    let cumpleQuorumCalificado = false;

    if (datosJunta?.esUniversal) {
      cumpleQuorumSimple = porcentajeAsistencia >= 100;
      cumpleQuorumCalificado = porcentajeAsistencia >= 100;
    } else {
      if (convocatoriaRealizada === "PRIMERA") {
        cumpleQuorumSimple = porcentajeAsistencia >= quorums.primeraConvocatoriaSimple;
        cumpleQuorumCalificado = porcentajeAsistencia >= quorums.primeraConvocatoriaCalificada;
      } else {
        cumpleQuorumSimple = porcentajeAsistencia >= quorums.segundaConvocatoriaSimple;
        cumpleQuorumCalificado = porcentajeAsistencia >= quorums.segundaConvocatoriaCalificada;
      }
    }

    const tipoVotacionPorPunto: Record<string, "simple" | "calificado"> = {
      aporteDinerario: "simple",
      capitalizacionCreditos: "simple",
      nombramientoDirectores: "simple",
      nombramientoGerente: "simple",
      remocionDirectores: "calificado",
      remocionGerente: "calificado",
      gestionSocial: "simple",
      aplicacionResultados: "simple",
      designacionAuditores: "simple",
    };

    let aperturaJunta = false;

    if (puntosActivos.length > 0) {
      aperturaJunta = puntosActivos.some((puntoId) => {
        const tipoVotacion = tipoVotacionPorPunto[puntoId] || "simple";
        let porcentajeRequerido = 0;

        if (datosJunta?.esUniversal) {
          porcentajeRequerido = 0;
        } else {
          if (convocatoriaRealizada === "PRIMERA") {
            porcentajeRequerido =
              tipoVotacion === "simple"
                ? quorums.primeraConvocatoriaSimple
                : quorums.primeraConvocatoriaCalificada;
          } else {
            porcentajeRequerido =
              tipoVotacion === "simple"
                ? quorums.segundaConvocatoriaSimple
                : quorums.segundaConvocatoriaCalificada;
          }
        }

        return porcentajeAsistencia >= porcentajeRequerido;
      });
    }

    return {
      primera_simple: quorums.primeraConvocatoriaSimple,
      primera_calificada: quorums.primeraConvocatoriaCalificada,
      segunda_simple: quorums.segundaConvocatoriaSimple,
      segunda_calificada: quorums.segundaConvocatoriaCalificada,
      convocatoria_realizada: convocatoriaRealizada,
      porcentaje_asistencia: porcentajeAsistencia,
      porcentaje_asistencia_texto: porcentajeAsistencia.toFixed(2) + "%",
      cumple_quorum_simple: cumpleQuorumSimple,
      cumple_quorum_calificado: cumpleQuorumCalificado,
      apertura_junta: aperturaJunta,
    };
  }

  /**
   * Construir variables de apertura de puntos
   */
  construirVariablesAperturaPuntos(
    datosJunta: any,
    quorums: any,
    porcentajeAsistencia: number,
    instaladaEnConvocatoria: string | null,
    puntosActivos: string[]
  ): VariablesAperturaPuntos[] {
    if (!quorums) {
      return [];
    }

    const tipoJunta = datosJunta?.esUniversal ? "universal" : "general";
    const convocatoriaRealizada = datosJunta?.esUniversal
      ? "universal"
      : (instaladaEnConvocatoria || "PRIMERA").toLowerCase();

    const titulosPuntos: Record<string, string> = {
      aporteDinerario: "Aumento de capital mediante nuevos aportes dinerarios",
      capitalizacionCreditos: "Aumento de capital mediante capitalización de créditos",
      nombramientoDirectores: "Nombramiento de Directores",
      nombramientoGerente: "Nombramiento de Gerente General",
      remocionDirectores: "Remoción de Directores",
      remocionGerente: "Remoción de Gerente General",
      gestionSocial: "Pronunciamiento sobre Gestión Social y Resultados Económicos",
      aplicacionResultados: "Aplicación de Resultados",
      designacionAuditores: "Designación de Auditores Externos",
    };

    const tipoVotacionPorPunto: Record<string, "simple" | "calificado"> = {
      aporteDinerario: "simple",
      capitalizacionCreditos: "simple",
      nombramientoDirectores: "simple",
      nombramientoGerente: "simple",
      remocionDirectores: "calificado",
      remocionGerente: "calificado",
      gestionSocial: "simple",
      aplicacionResultados: "simple",
      designacionAuditores: "simple",
    };

    const calcularPorcentajeRequerido = (tipoVotacion: "simple" | "calificado"): number => {
      if (tipoJunta === "universal") {
        return 0;
      }
      if (convocatoriaRealizada === "primera") {
        return tipoVotacion === "simple"
          ? quorums.primeraConvocatoriaSimple
          : quorums.primeraConvocatoriaCalificada;
      }
      if (convocatoriaRealizada === "segunda") {
        return tipoVotacion === "simple"
          ? quorums.segundaConvocatoriaSimple
          : quorums.segundaConvocatoriaCalificada;
      }
      return 0;
    };

    return puntosActivos.map((puntoId) => {
      const tipoVotacion = tipoVotacionPorPunto[puntoId] || "simple";
      const porcentajeRequerido = calcularPorcentajeRequerido(tipoVotacion);
      const aperturado = porcentajeAsistencia >= porcentajeRequerido;

      return {
        punto_id: puntoId,
        punto_titulo: titulosPuntos[puntoId] || puntoId,
        tipo_junta: tipoJunta,
        convocatoria_realizada: convocatoriaRealizada,
        tipoPuntoAgenda: tipoVotacion,
        porcentajeAsistenciaRequerido: porcentajeRequerido,
        porcentajeAsistenciaPunto: porcentajeAsistencia,
        aperturado: aperturado,
      };
    });
  }

  /**
   * Construir variables de aporte dinerario
   * Esta es la función más compleja - usa todos los servicios
   */
  construirVariablesAporteDinerario(
    datosAporte: any,
    snapshot: SnapshotCompleteDTO | null,
    datosSociedad: any,
    datosJunta: any,
    asistentes: any[]
  ): AporteDinerarioVariables | null {
    if (!datosAporte || !datosSociedad || !datosJunta) {
      return null;
    }

    // Construir aportantes
    const construirAportantes = () => {
      const aportantes = datosAporte.aportantes || [];
      const aportesPorAportante = datosAporte.aportesPorAportante || {};

      if (!Array.isArray(aportantes) || aportantes.length === 0) {
        console.warn("⚠️ [ConstructorVariablesActa] No hay aportantes disponibles");
        return [];
      }

      return aportantes.map((aportante: any) => {
        const aportes = aportesPorAportante[aportante.id] || [];
        const person = aportante.person;

        const esPersonaNatural =
          person?.tipo === "NATURAL" || aportante.typeShareholder === "NATURAL";

        let nombre = "";
        if (esPersonaNatural) {
          nombre = `${person?.nombre || ""} ${person?.apellidoPaterno || ""} ${
            person?.apellidoMaterno || ""
          }`.trim();
        } else {
          nombre = person?.razonSocial || person?.legalName || "";
        }

        if (!nombre || nombre.trim() === "") {
          if (person?.firstName) {
            nombre = `${person?.firstName || ""} ${person?.lastNamePaternal || ""} ${
              person?.lastNameMaternal || ""
            }`.trim();
          } else if (person?.legalName) {
            nombre = person.legalName;
          } else {
            nombre = "Aportante sin nombre";
          }
        }

        return {
          nombre,
          aportes: aportes.map((aporte: any) => ({
            aporte_soles: aporte.contributionAmountInBaseCurrencyFormatted,
            cantidad_acciones: aporte.sharesToReceiveFormatted,
            tipo_accion: aporte.shareClass?.className || aporte.shareClass?.type || "",
            capital_social: aporte.socialCapitalFormatted,
            prima: aporte.premiumFormatted,
            reserva: aporte.reserveFormatted,
          })),
        };
      });
    };

    // Funciones de votación
    const calcularPorcentajeAprobacion = (votacion: any): number => {
      if (!votacion || votacion.items.length === 0) return 100;
      const itemVotacion = votacion.items[0];
      if (!itemVotacion) return 100;

      let accionesAFavor = 0;
      let totalAccionesVotantes = 0;

      itemVotacion.votos.forEach((voto: any) => {
        const accionista = asistentes.find((a: any) => a.id === voto.accionistaId);
        if (accionista) {
          const acciones = accionista.acciones;
          totalAccionesVotantes += acciones;
          const votoAFavor =
            (typeof voto.valor === "string" &&
              (voto.valor === "A_FAVOR" || voto.valor === "FAVOR")) ||
            (typeof voto.valor === "number" && voto.valor > 0);
          if (votoAFavor) {
            accionesAFavor += acciones;
          }
        }
      });

      if (totalAccionesVotantes === 0) return 100;
      const porcentaje = (accionesAFavor / totalAccionesVotantes) * 100;
      return Math.round(porcentaje * 100) / 100;
    };

    const obtenerNombresAFavor = (votacion: any): string[] => {
      if (!votacion || votacion.items.length === 0) return [];
      const itemVotacion = votacion.items[0];
      if (!itemVotacion) return [];
      const idsAFavor = itemVotacion.votos
        .filter((v: any) => {
          if (typeof v.valor === "string") {
            return v.valor === "A_FAVOR" || v.valor === "FAVOR";
          }
          return v.valor > 0;
        })
        .map((v: any) => v.accionistaId);
      return asistentes.filter((a: any) => idsAFavor.includes(a.id)).map((a: any) => a.nombre);
    };

    const obtenerNombresEnContra = (votacion: any): string[] => {
      if (!votacion || votacion.items.length === 0) return [];
      const itemVotacion = votacion.items[0];
      if (!itemVotacion) return [];
      const idsEnContra = itemVotacion.votos
        .filter((v: any) => {
          if (typeof v.valor === "string") {
            return v.valor === "EN_CONTRA" || v.valor === "CONTRA";
          }
          return v.valor < 0;
        })
        .map((v: any) => v.accionistaId);
      return asistentes
        .filter((a: any) => idsEnContra.includes(a.id))
        .map((a: any) => a.nombre);
    };

    const obtenerInfoAccionista = (nombre: string) => {
      const accionista = asistentes.find((a: any) => a.nombre === nombre);
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
        esEmpresaExtranjera: false,
      };
    };

    // Calcular valores usando servicios
    const aportantesData = construirAportantes();
    const valorNominal = snapshot?.nominalValue || 0;

    const { sumaCapitalSocial, sumaPrimaTotal, sumaReserva, sumaTotalAcciones } =
      this.calculadora.calcularTotalesDesdeAportantesFormateados(aportantesData);

    const capitalSocialAntes = this.calculadora.calcularCapitalSocialAntes(snapshot);
    const accionesAntes = this.calculadora.calcularAccionesAntes(snapshot);
    const capitalSocialDespues = capitalSocialAntes + sumaCapitalSocial;
    const accionesDespues = accionesAntes + sumaTotalAcciones;
    const incremento = this.calculadora.calcularIncrementoCapital(
      capitalSocialAntes,
      capitalSocialDespues
    );
    const numeroDeAccionesIncrementadas = sumaTotalAcciones;
    const montoTotal = sumaCapitalSocial + sumaPrimaTotal + sumaReserva;

    // Calcular distribuciones
    const distribucionAntesRaw = this.agrupador.calcularDistribucionAntes(snapshot);
    const distribucionDespuesRaw = this.agrupador.calcularDistribucionDespues(
      snapshot,
      datosAporte.aportes || []
    );
    const distribucionAntesAporte = this.agrupador.formatearDistribucion(
      distribucionAntesRaw,
      valorNominal
    );
    const distribucionDespuesAporte = this.agrupador.formatearDistribucion(
      distribucionDespuesRaw,
      valorNominal
    );

    const distribucionDerechoVotoAntesRaw = this.agrupador.filtrarConDerechoVoto(
      distribucionAntesRaw,
      snapshot?.shareClasses || []
    );
    const distribucionDerechoVotoDespuesRaw = this.agrupador.filtrarConDerechoVoto(
      distribucionDespuesRaw,
      snapshot?.shareClasses || []
    );
    const distribucionAccionariaDerechoAvotoAntes = this.agrupador.formatearDistribucion(
      distribucionDerechoVotoAntesRaw,
      valorNominal
    );
    const distribucionAccionariaDerechoAvotoDespues = this.agrupador.formatearDistribucion(
      distribucionDerechoVotoDespuesRaw,
      valorNominal
    );

    const porcentajeAprobacion = calcularPorcentajeAprobacion(datosAporte.votacion);
    const nombresAFavor = obtenerNombresAFavor(datosAporte.votacion);
    const nombresEnContra = obtenerNombresEnContra(datosAporte.votacion);

    return {
      tipo: "aporte_dinerario",
      numero: 1,
      titulo: "Aumento de capital mediante nuevos aportes dinerarios",
      votacion: {
        cumple_votos: porcentajeAprobacion >= 50,
        no_cumple_votos: porcentajeAprobacion < 50,
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
        accionistas_abstencion: [],
      },
      datos: {
        suma_aumentos_efectuados: datosAporte.totalAportes.toFixed(2),
        suma_aumentos_efectuados_palabras: datosAporte.totalAportesPalabras,
        capital_actual: capitalSocialAntes.toFixed(2),
        capital_actual_palabras: this.formateador.capitalSocialATexto(capitalSocialAntes),
        total_capital: capitalSocialDespues.toFixed(2),
        total_capital_palabras: this.formateador.capitalSocialATexto(capitalSocialDespues),
        prima_total: sumaPrimaTotal.toFixed(2),
        prima_total_texto: this.formateador.montoATexto(sumaPrimaTotal),
        suma_reserva: sumaReserva.toFixed(2),
        suma_reserva_texto: this.formateador.montoATexto(sumaReserva),
        aportantes: aportantesData,
        accionistas_aumento_capital: [],
        suma_total_acciones: sumaTotalAcciones.toString(),
        suma_capital_social: sumaCapitalSocial.toFixed(2),
        suma_prima_total: sumaPrimaTotal.toFixed(2),
        no_publicar_aviso: datosJunta.esUniversal,
        capitalSocialAntes,
        capitalSocialAntesTexto: this.formateador.capitalSocialATexto(capitalSocialAntes),
        capitalSocialDespues,
        capitalSocialDespuesTexto: this.formateador.capitalSocialATexto(capitalSocialDespues),
        accionesAntes,
        accionesAntesTexto: this.formateador.accionesATexto(accionesAntes),
        accionesDespues,
        accionesDespuesTexto: this.formateador.accionesATexto(accionesDespues),
        valorNominal,
        valorNominalTexto: this.formateador.montoATexto(valorNominal),
        incremento,
        incrementoTexto: this.formateador.montoATexto(incremento),
        numeroDeAccionesIncrementadas,
        numeroDeAccionesIncrementadasTexto: this.formateador.accionesATexto(
          numeroDeAccionesIncrementadas
        ),
        primaTotal: sumaPrimaTotal,
        primaTotalTexto: this.formateador.montoATexto(sumaPrimaTotal),
        reservaTotal: sumaReserva,
        reservaTotalTexto: this.formateador.montoATexto(sumaReserva),
        montoTotal,
        montoTotalTexto: this.formateador.montoATexto(montoTotal),
        distribucionAntesAporte,
        distribucionDespuesAporte,
        distribucionAccionariaDerechoAvotoAntes,
        distribucionAccionariaDerechoAvotoDespues,
      },
    };
  }

  /**
   * Construir todas las variables completas
   * Método principal que orquesta la construcción de todas las secciones
   */
  construirVariablesCompletas(
    snapshot: SnapshotCompleteDTO | null,
    downloadData: DownloadDataDTO | null,
    datosAuxiliares: DatosAuxiliares
  ): VariablesCompletas {
    const {
      datosSociedad,
      datosJunta,
      asistentes,
      todosAccionistas,
      totalAcciones,
      porcentajeAsistencia,
      puntosActivos,
      directores,
      meetingDetails,
      instaladaEnConvocatoria,
      quorums,
      datosAporteDinerario,
    } = datosAuxiliares;

    if (!datosSociedad || !datosJunta) {
      throw new Error("Datos de sociedad o junta no disponibles");
    }

    const variablesBase = this.construirVariablesBase(datosSociedad, datosJunta);
    const variablesJunta = this.construirVariablesJunta(
      datosJunta,
      meetingDetails,
      instaladaEnConvocatoria
    );
    const variablesAsistencia = this.construirVariablesAsistencia(
      asistentes,
      todosAccionistas,
      totalAcciones,
      porcentajeAsistencia,
      snapshot
    );
    const variablesPresidenciaSecretaria = this.construirVariablesPresidenciaSecretaria(
      datosJunta,
      meetingDetails?.presidenteId,
      meetingDetails?.secretarioId,
      directores,
      snapshot,
      asistentes,
      porcentajeAsistencia
    );
    const variablesAgenda = this.construirVariablesAgenda(puntosActivos);
    const variablesQuorum = this.construirVariablesQuorum(
      datosJunta,
      quorums,
      porcentajeAsistencia,
      instaladaEnConvocatoria,
      puntosActivos
    );
    const variablesAperturaPuntos = this.construirVariablesAperturaPuntos(
      datosJunta,
      quorums,
      porcentajeAsistencia,
      instaladaEnConvocatoria,
      puntosActivos
    );

    // Construir aporte dinerario si existe
    // Usar datosAporteDinerario del store que ya tiene la estructura transformada
    const aporteDinerario = datosAporteDinerario
      ? this.construirVariablesAporteDinerario(
          datosAporteDinerario,
          snapshot,
          datosSociedad,
          datosJunta,
          asistentes
        )
      : null;

    return {
      variablesBase,
      variablesJunta,
      variablesAsistencia,
      variablesPresidenciaSecretaria,
      variablesAgenda,
      variablesQuorum,
      variablesAperturaPuntos,
      aporteDinerario,
    };
  }
}
