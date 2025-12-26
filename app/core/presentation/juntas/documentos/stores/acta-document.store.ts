import { defineStore } from "pinia";
import { useDocumentosStore } from "./documentos.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
import { useDownloadDataStore } from "./download-data.store";
import { numeroALetras, montoALetras } from "~/utils/numero-a-letras";

/**
 * Store para Variables Completas del Acta
 *
 * ✅ SOLO STATE Y ACTIONS - Sin getters
 * ✅ Se carga automáticamente cuando cambian los datos base
 */
export const useActaDocumentStore = defineStore("actaDocument", {
  // ✅ PERSISTENCIA: Guardar en localStorage
  // ⚠️ Cambiado key para limpiar datos antiguos duplicados
  persist: {
    storage: localStorage,
    key: "probo-acta-document-variables-v2",
  },

  state: () => ({
    // ============================================
    // VARIABLES BASE (encabezado)
    // ============================================
    variablesBase: {
      acta_label: "",
      ciudad: "",
      date: "",
      hours: "",
      nombre_empresa: "",
      direccion: "",
      ruc: "",
    },

    // ============================================
    // VARIABLES DE JUNTA
    // ============================================
    variablesJunta: {
      nombre_junta: "",
      tiene_nombre_junta: false,
      es_anual_obligatoria: false,
      tipo_junta: "" as "UNIVERSAL" | "GENERAL",
      es_universal: false,
      es_general: false,
      convocatoria_activa: null as string | null,
      convocatoria_realizada: "",
      fecha_convocatoria: "",
      primera_convocatoria: null as {
        fecha: string;
        hora: string;
        lugar: string;
        modo: string;
      } | null,
      segunda_convocatoria: null as {
        fecha: string;
        hora: string;
        lugar: string;
        modo: string;
      } | null,
      _convocatoria_realizada_lower: "",
    },

    // ============================================
    // VARIABLES DE ASISTENCIA
    // ============================================
    variablesAsistencia: {
      asistencia_lista: [] as Array<{ texto_asistencia: string }>,
      accionistas_asistentes: [] as any[],
      accionistas_con_derecho_voto: [] as any[],
      total_acciones: "",
      total_acciones_numero: 0,
      porcentaje_acciones: "",
      porcentaje_acciones_numero: 0,
      valor_nominal: "",
    },

    // ============================================
    // VARIABLES DE PRESIDENCIA Y SECRETARÍA
    // ============================================
    variablesPresidenciaSecretaria: {
      presidente_junta: "",
      secretario_junta: "",
      hora_acta: "",
      asistentes_firmas: [] as Array<{ nombre_accionista: string }>,
      is_universal: false,
      porcentaje_acciones_asistentes: "",
    },

    // ============================================
    // VARIABLES DE AGENDA
    // ============================================
    variablesAgenda: [] as Array<{ numero: number; titulo: string }>,

    // ============================================
    // VARIABLES DE QUÓRUM
    // ============================================
    variablesQuorum: {
      primera_simple: 0,
      primera_calificada: 0,
      segunda_simple: 0,
      segunda_calificada: 0,
      convocatoria_realizada: "",
      porcentaje_asistencia: 0,
      porcentaje_asistencia_texto: "",
      cumple_quorum_simple: false,
      cumple_quorum_calificado: false,
      apertura_junta: false,
    },

    // ============================================
    // VARIABLES DE APERTURA DE PUNTOS
    // ============================================
    variablesAperturaPuntos: [] as Array<{
      punto_id: string;
      punto_titulo: string;
      tipo_junta: string;
      convocatoria_realizada: string;
      tipoPuntoAgenda: string;
      porcentajeAsistenciaRequerido: number;
      porcentajeAsistenciaPunto: number;
      aperturado: boolean;
    }>,

    // ============================================
    // VARIABLES DE APORTE DINERARIO
    // ============================================
    aporteDinerario: null as {
      tipo: string;
      numero: number;
      titulo: string;
      votacion: any;
      datos: any;
    } | null,

    // ============================================
    // METADATA
    // ============================================
    lastUpdated: null as number | null,
    isLoaded: false,
  }),

  actions: {
    /**
     * MIGRAR DATOS - Limpia datos antiguos del localStorage
     * Se ejecuta automáticamente al cargar si detecta datos antiguos
     */
    migrate() {
      // Limpiar localStorage antiguo si existe
      try {
        const oldKey = "probo-acta-document-variables";
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          console.log("🧹 [ActaDocumentStore] Limpiando datos antiguos...");
          localStorage.removeItem(oldKey);
          console.log("✅ [ActaDocumentStore] Datos antiguos eliminados");
        }
      } catch (error) {
        console.warn("⚠️ [ActaDocumentStore] Error al limpiar datos antiguos:", error);
      }
    },

    /**
     * CARGAR TODO - Calcula y actualiza todas las variables en el state
     * Se debe llamar cuando cambien los datos base (downloadData, snapshot)
     */
    load() {
      // Migrar datos antiguos si es necesario (solo una vez)
      if (!this.isLoaded) {
        this.migrate();
      }

      console.log("🔄 [ActaDocumentStore] Cargando todas las variables...");

      // Actualizar cada sección en orden
      this.loadVariablesBase();
      this.loadVariablesJunta();
      this.loadVariablesAsistencia();
      this.loadVariablesPresidenciaSecretaria();
      this.loadVariablesAgenda();
      this.loadVariablesQuorum();
      this.loadVariablesAperturaPuntos();
      this.loadVariablesAporteDinerario();

      this.lastUpdated = Date.now();
      this.isLoaded = true;

      console.log("✅ [ActaDocumentStore] Todas las variables cargadas:", {
        acta_label: this.variablesBase.acta_label,
        nombre_empresa: this.variablesBase.nombre_empresa,
        presidente: this.variablesPresidenciaSecretaria.presidente_junta,
        apertura_junta: this.variablesQuorum.apertura_junta,
        tieneAporteDinerario: !!this.aporteDinerario,
      });
    },

    /**
     * Cargar variables base (encabezado)
     */
    loadVariablesBase() {
      const documentosStore = useDocumentosStore();
      const datosSociedad = documentosStore.datosSociedad;
      const datosJunta = documentosStore.datosJunta;

      if (!datosSociedad || !datosJunta) return;

      this.variablesBase = {
        acta_label: datosJunta.esUniversal
          ? "ACTA DE JUNTA UNIVERSAL"
          : "ACTA DE JUNTA GENERAL",
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
    },

    /**
     * Cargar variables de junta
     */
    loadVariablesJunta() {
      const documentosStore = useDocumentosStore();
      const meetingDetailsStore = useMeetingDetailsStore();
      const downloadDataStore = useDownloadDataStore();
      const datosJunta = documentosStore.datosJunta;

      if (!datosJunta) return;

      // Nombre de junta
      const nombreJunta =
        meetingDetailsStore.meetingDetails?.nombreJunta ||
        downloadDataStore.meetingDetails?.nombreJunta ||
        null;

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

      // Convocatoria
      const convocatoriaRealizada = datosJunta.esUniversal
        ? "UNIVERSAL"
        : meetingDetailsStore.instaladaEnConvocatoria || "PRIMERA";

      this.variablesJunta = {
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
    },

    /**
     * Cargar variables de asistencia
     */
    loadVariablesAsistencia() {
      const documentosStore = useDocumentosStore();
      const asistentes = documentosStore.listaAccionistasAsistentes;
      const todosAccionistas = documentosStore.listaAccionistasConDerechoAVoto;
      const totalAcciones = documentosStore.totalAccionesConDerechoVoto;
      const porcentajeAsistencia = documentosStore.porcentajeAsistencia;

      const formatearAsistencia = (accionista: any): string => {
        const esPersonaNatural = accionista.tipo === "NATURAL";

        if (esPersonaNatural) {
          return `${accionista.nombre}, identificado con ${accionista.tipoDocumento} N° ${accionista.documento}, con ${accionista.acciones} acciones`;
        } else {
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

      this.variablesAsistencia = {
        asistencia_lista: asistentes.map((a: any) => ({
          texto_asistencia: formatearAsistencia(a),
        })),
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
        total_acciones: totalAcciones.toLocaleString("es-PE"),
        total_acciones_numero: totalAcciones,
        porcentaje_acciones: porcentajeAsistencia.toFixed(2) + "%",
        porcentaje_acciones_numero: porcentajeAsistencia,
        valor_nominal: "1.00", // TODO: Obtener desde snapshot
      };
    },

    /**
     * Cargar variables de presidencia y secretaría
     */
    loadVariablesPresidenciaSecretaria() {
      const documentosStore = useDocumentosStore();
      const meetingDetailsStore = useMeetingDetailsStore();
      const snapshotStore = useSnapshotStore();
      const datosJunta = documentosStore.datosJunta;
      const asistentes = documentosStore.listaAccionistasAsistentes;

      const obtenerNombreDesdePersonId = (
        personId: string | null | undefined,
        esSecretario: boolean = false
      ): string => {
        if (!personId) {
          return "No especificado";
        }

        // Buscar en directores
        const directores = snapshotStore.directores;
        const director = directores.find((d) => d.persona.id === personId);
        if (director) {
          return `${director.persona.nombre} ${director.persona.apellidoPaterno} ${
            director.persona.apellidoMaterno || ""
          }`.trim();
        }

        // Buscar en apoderados
        const snapshot = snapshotStore.snapshot;
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

      const presidenteId = meetingDetailsStore.meetingDetails?.presidenteId;
      const secretarioId = meetingDetailsStore.meetingDetails?.secretarioId;

      this.variablesPresidenciaSecretaria = {
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
        porcentaje_acciones_asistentes: documentosStore.porcentajeAsistencia.toFixed(2),
      };
    },

    /**
     * Cargar variables de agenda
     */
    loadVariablesAgenda() {
      const documentosStore = useDocumentosStore();
      const puntosActivos = documentosStore.puntosAgendaActivos;

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

      const agenda: string[] = [];

      puntosActivos.forEach((puntoId) => {
        const titulo = titulosPuntos[puntoId];
        if (titulo) {
          agenda.push(titulo);
        }
      });

      if (
        puntosActivos.includes("aporteDinerario") ||
        puntosActivos.includes("capitalizacionCreditos")
      ) {
        agenda.push("Modificación parcial del estatuto social de la Sociedad");
      }

      agenda.push("Otorgamiento de facultades para la formalización de acuerdos");

      this.variablesAgenda = agenda.map((titulo, index) => ({
        numero: index + 1,
        titulo,
      }));
    },

    /**
     * Cargar variables de quórum
     */
    loadVariablesQuorum() {
      const documentosStore = useDocumentosStore();
      const snapshotStore = useSnapshotStore();
      const meetingDetailsStore = useMeetingDetailsStore();
      const datosJunta = documentosStore.datosJunta;
      const porcentajeAsistencia = documentosStore.porcentajeAsistencia;

      const quorums = snapshotStore.quorums;
      if (!quorums) {
        this.variablesQuorum = {
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
        return;
      }

      const convocatoriaRealizada = datosJunta?.esUniversal
        ? "UNIVERSAL"
        : meetingDetailsStore.instaladaEnConvocatoria || "PRIMERA";

      let cumpleQuorumSimple = false;
      let cumpleQuorumCalificado = false;

      if (datosJunta?.esUniversal) {
        cumpleQuorumSimple = porcentajeAsistencia >= 100;
        cumpleQuorumCalificado = porcentajeAsistencia >= 100;
      } else {
        if (convocatoriaRealizada === "PRIMERA") {
          cumpleQuorumSimple = porcentajeAsistencia >= quorums.primeraConvocatoriaSimple;
          cumpleQuorumCalificado =
            porcentajeAsistencia >= quorums.primeraConvocatoriaCalificada;
        } else {
          cumpleQuorumSimple = porcentajeAsistencia >= quorums.segundaConvocatoriaSimple;
          cumpleQuorumCalificado =
            porcentajeAsistencia >= quorums.segundaConvocatoriaCalificada;
        }
      }

      const puntosActivos = documentosStore.puntosAgendaActivos;
      let aperturaJunta = false;

      if (puntosActivos.length > 0) {
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

      this.variablesQuorum = {
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
    },

    /**
     * Cargar variables de apertura de puntos
     */
    loadVariablesAperturaPuntos() {
      const documentosStore = useDocumentosStore();
      const snapshotStore = useSnapshotStore();
      const meetingDetailsStore = useMeetingDetailsStore();
      const datosJunta = documentosStore.datosJunta;
      const porcentajeAsistencia = documentosStore.porcentajeAsistencia;
      const puntosActivos = documentosStore.puntosAgendaActivos;

      const quorums = snapshotStore.quorums;
      if (!quorums) {
        this.variablesAperturaPuntos = [];
        return;
      }

      const tipoJunta = datosJunta?.esUniversal ? "universal" : "general";
      const convocatoriaRealizada = datosJunta?.esUniversal
        ? "universal"
        : (meetingDetailsStore.instaladaEnConvocatoria || "PRIMERA").toLowerCase();

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

      this.variablesAperturaPuntos = puntosActivos.map((puntoId) => {
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
    },

    /**
     * Cargar variables de aporte dinerario
     * Esta es la función más compleja - calcula todas las variables de aporte dinerario
     */
    loadVariablesAporteDinerario() {
      const documentosStore = useDocumentosStore();
      const snapshotStore = useSnapshotStore();
      const datosAporte = documentosStore.datosAporteDinerario;
      const datosSociedad = documentosStore.datosSociedad;
      const datosJunta = documentosStore.datosJunta;
      const asistentes = documentosStore.listaAccionistasAsistentes;

      // Si no hay aporte dinerario, limpiar
      if (!datosAporte || !datosSociedad || !datosJunta) {
        this.aporteDinerario = null;
        return;
      }

      // Helper functions (mismo código que antes, pero dentro de la acción)
      const parseFormattedNumber = (str: string): number => {
        if (!str || typeof str !== "string") return 0;
        const cleaned = str.replace(/[^\d.-]/g, "");
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
      };

      const parseFormattedInteger = (str: string): number => {
        if (!str || typeof str !== "string") return 0;
        const cleaned = str.replace(/[^\d]/g, "");
        const parsed = parseInt(cleaned, 10);
        return isNaN(parsed) ? 0 : parsed;
      };

      const calcularCapitalSocialDesdeSnapshot = (): number => {
        const snapshot = snapshotStore.snapshot;
        if (!snapshot) return 0;
        const valorNominal = snapshot.nominalValue || 0;
        const shareAllocations = snapshot.shareAllocations || [];
        return shareAllocations.reduce((sum, asig) => {
          return sum + valorNominal * asig.cantidadSuscrita;
        }, 0);
      };

      const calcularTotalAccionesDesdeSnapshot = (): number => {
        const snapshot = snapshotStore.snapshot;
        if (!snapshot) return 0;
        const shareAllocations = snapshot.shareAllocations || [];
        return shareAllocations.reduce((sum, asig) => sum + asig.cantidadSuscrita, 0);
      };

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
        const valorNominal = snapshotStore.snapshot?.nominalValue || 0;

        shareAllocations.forEach((asig: any) => {
          const shareClass = shareClasses.find((sc: any) => sc.id === asig.accionId);
          if (!shareClass) return;
          const cantidad = asig.cantidadSuscrita;
          const capitalSocial = valorNominal * cantidad;
          const prima = Math.max(0, (asig.precioPorAccion - valorNominal) * cantidad);
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

      const formatearDistribucion = (distribucion: any) => {
        const valorNominal = snapshotStore.snapshot?.nominalValue || 0;
        const formatearTipo = (tipo: any) => {
          if (!tipo) {
            return {
              cantidad: 0,
              cantidadTexto: numeroALetras(0),
              capitalSocial: 0,
              capitalSocialTexto: montoALetras(0, "PEN"),
              prima: 0,
              primaTexto: montoALetras(0, "PEN"),
              reserva: 0,
              reservaTexto: montoALetras(0, "PEN"),
              dividendoPasivo: 0,
              dividendoPasivoTexto: montoALetras(0, "PEN"),
              valorNominal,
              valorNominalTexto: montoALetras(valorNominal, "PEN"),
            };
          }
          return {
            cantidad: tipo.cantidad || 0,
            cantidadTexto: numeroALetras(tipo.cantidad || 0),
            capitalSocial: tipo.capitalSocial || 0,
            capitalSocialTexto: montoALetras(tipo.capitalSocial || 0, "PEN"),
            prima: tipo.prima || 0,
            primaTexto: montoALetras(tipo.prima || 0, "PEN"),
            reserva: tipo.reserva || 0,
            reservaTexto: montoALetras(tipo.reserva || 0, "PEN"),
            dividendoPasivo: tipo.dividendoPasivo || 0,
            dividendoPasivoTexto: montoALetras(tipo.dividendoPasivo || 0, "PEN"),
            valorNominal,
            valorNominalTexto: montoALetras(valorNominal, "PEN"),
          };
        };

        return {
          comunes: formatearTipo(distribucion.comunes),
          preferenteSinDerechoVoto: formatearTipo(distribucion.preferenteSinDerechoVoto),
          clases: (distribucion.clases || []).map((clase: any) => ({
            ...formatearTipo(clase),
            id: clase.id,
            nombre: clase.nombre,
            conDerechoVoto: clase.conDerechoVoto,
          })),
        };
      };

      const calcularDistribucionAntesAporte = () => {
        const snapshot = snapshotStore.snapshot;
        if (!snapshot) {
          return {
            comunes: {
              cantidad: 0,
              capitalSocial: 0,
              prima: 0,
              reserva: 0,
              dividendoPasivo: 0,
            },
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

      const calcularDistribucionDespuesAporte = () => {
        const distribucionAntes = calcularDistribucionAntesAporte();
        const aportes = datosAporte.aportes || [];
        const shareClasses = snapshotStore.snapshot?.shareClasses || [];

        const distribucionDespues = {
          comunes: { ...distribucionAntes.comunes },
          preferenteSinDerechoVoto: { ...distribucionAntes.preferenteSinDerechoVoto },
          clases: distribucionAntes.clases.map((c) => ({ ...c })),
        };

        aportes.forEach((aporte: any) => {
          const shareClass = shareClasses.find((sc: any) => sc.id === aporte.shareClass?.id);
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
            let clase = distribucionDespues.clases.find((c: any) => c.id === shareClass.id);
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

      const calcularDistribucionAccionariaDerechoAvoto = (distribucion: any) => {
        const shareClasses = snapshotStore.snapshot?.shareClasses || [];
        const comunes = {
          cantidad: distribucion.comunes?.cantidad || 0,
          capitalSocial: distribucion.comunes?.capitalSocial || 0,
          prima: distribucion.comunes?.prima || 0,
          reserva: distribucion.comunes?.reserva || 0,
          dividendoPasivo: distribucion.comunes?.dividendoPasivo || 0,
        };
        const clases = (distribucion.clases || []).filter((clase: any) => {
          const shareClass = shareClasses.find((sc: any) => sc.id === clase.id);
          return shareClass?.conDerechoVoto === true;
        });
        return {
          comunes,
          preferenteSinDerechoVoto: {
            cantidad: 0,
            capitalSocial: 0,
            prima: 0,
            reserva: 0,
            dividendoPasivo: 0,
          },
          clases,
        };
      };

      const construirAportantes = () => {
        const aportantes = datosAporte.aportantes;
        const aportesPorAportante = datosAporte.aportesPorAportante;

        console.log("🔍 [ActaDocumentStore] Construyendo aportantes:", {
          aportantesCount: aportantes?.length || 0,
          aportantes: aportantes,
        });

        return aportantes.map((aportante: any) => {
          const aportes = aportesPorAportante[aportante.id] || [];
          const person = aportante.person;

          console.log("🔍 [ActaDocumentStore] Procesando aportante:", {
            aportanteId: aportante.id,
            typeShareholder: aportante.typeShareholder,
            person: person,
            personKeys: person ? Object.keys(person) : [],
          });

          // Determinar si es persona natural o jurídica
          // La estructura real es: person.tipo === "NATURAL" o person.tipo === "JURIDICA"
          const esPersonaNatural =
            person?.tipo === "NATURAL" || aportante.typeShareholder === "NATURAL";

          // Construir nombre completo según estructura real del backend
          let nombre = "";
          if (esPersonaNatural) {
            // Persona natural: person.nombre, person.apellidoPaterno, person.apellidoMaterno
            nombre = `${person?.nombre || ""} ${person?.apellidoPaterno || ""} ${
              person?.apellidoMaterno || ""
            }`.trim();
          } else {
            // Persona jurídica: person.razonSocial o person.legalName
            nombre = person?.razonSocial || person?.legalName || "";
          }

          // Si el nombre está vacío, intentar con estructura alternativa (compatibilidad)
          if (!nombre || nombre.trim() === "") {
            if (person?.firstName) {
              // Estructura alternativa en inglés
              nombre = `${person?.firstName || ""} ${person?.lastNamePaternal || ""} ${
                person?.lastNameMaternal || ""
              }`.trim();
            } else if (person?.legalName) {
              // Otra alternativa
              nombre = person.legalName;
            } else {
              console.warn("⚠️ [ActaDocumentStore] No se pudo obtener nombre del aportante:", {
                aportanteId: aportante.id,
                person: person,
                typeShareholder: aportante.typeShareholder,
              });
              nombre = "Aportante sin nombre";
            }
          }

          console.log("✅ [ActaDocumentStore] Nombre construido:", {
            aportanteId: aportante.id,
            nombre,
            esPersonaNatural,
          });

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
        return asistentes
          .filter((a: any) => idsAFavor.includes(a.id))
          .map((a: any) => a.nombre);
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
            ? `${accionista.representante.nombre} ${
                accionista.representante.apellidoPaterno
              } ${accionista.representante.apellidoMaterno || ""}`.trim()
            : "",
          tipoDocRepre: accionista.representante?.tipoDocumento || "",
          numeroDocRepre: accionista.representante?.numeroDocumento || "",
          esEmpresaExtranjera: false,
        };
      };

      // Calcular todos los valores
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
          sum +
          a.aportes.reduce((s: number, ap: any) => s + parseFormattedNumber(ap.prima), 0),
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

      const capitalSocialAntes = calcularCapitalSocialDesdeSnapshot();
      const accionesAntes = calcularTotalAccionesDesdeSnapshot();
      const valorNominal = snapshotStore.snapshot?.nominalValue || 0;

      const capitalSocialDespues = capitalSocialAntes + sumaCapitalSocial;
      const accionesDespues = accionesAntes + sumaTotalAcciones;
      const incremento = capitalSocialDespues - capitalSocialAntes;
      const numeroDeAccionesIncrementadas = sumaTotalAcciones;
      const montoTotal = sumaCapitalSocial + sumaPrimaTotal + sumaReserva;

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

      const porcentajeAprobacion = calcularPorcentajeAprobacion(datosAporte.votacion);
      const nombresAFavor = obtenerNombresAFavor(datosAporte.votacion);
      const nombresEnContra = obtenerNombresEnContra(datosAporte.votacion);

      // Actualizar el state
      this.aporteDinerario = {
        tipo: "aporte_dinerario",
        numero: 1, // Se asignará dinámicamente en ActaGenerator
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
          capital_actual_palabras:
            capitalSocialAntes === 0 ? "cero soles" : montoALetras(capitalSocialAntes, "PEN"),
          total_capital: capitalSocialDespues.toFixed(2),
          total_capital_palabras: montoALetras(capitalSocialDespues, "PEN"),
          prima_total: sumaPrimaTotal.toFixed(2),
          prima_total_texto: montoALetras(sumaPrimaTotal, "PEN"),
          suma_reserva: sumaReserva.toFixed(2),
          suma_reserva_texto: montoALetras(sumaReserva, "PEN"),
          aportantes: aportantesData,
          accionistas_aumento_capital: [],
          suma_total_acciones: sumaTotalAcciones.toString(),
          suma_capital_social: sumaCapitalSocial.toFixed(2),
          suma_prima_total: sumaPrimaTotal.toFixed(2),
          no_publicar_aviso: datosJunta.esUniversal,
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
          distribucionAntesAporte,
          distribucionDespuesAporte,
          distribucionAccionariaDerechoAvotoAntes,
          distribucionAccionariaDerechoAvotoDespues,
        },
      };
    },

    /**
     * Limpiar todo
     */
    clear() {
      this.variablesBase = {
        acta_label: "",
        ciudad: "",
        date: "",
        hours: "",
        nombre_empresa: "",
        direccion: "",
        ruc: "",
      };
      this.variablesJunta = {
        nombre_junta: "",
        tiene_nombre_junta: false,
        es_anual_obligatoria: false,
        tipo_junta: "GENERAL",
        es_universal: false,
        es_general: false,
        convocatoria_activa: null,
        convocatoria_realizada: "",
        fecha_convocatoria: "",
        primera_convocatoria: null,
        segunda_convocatoria: null,
        _convocatoria_realizada_lower: "",
      };
      this.variablesAsistencia = {
        asistencia_lista: [],
        accionistas_asistentes: [],
        accionistas_con_derecho_voto: [],
        total_acciones: "",
        total_acciones_numero: 0,
        porcentaje_acciones: "",
        porcentaje_acciones_numero: 0,
        valor_nominal: "",
      };
      this.variablesPresidenciaSecretaria = {
        presidente_junta: "",
        secretario_junta: "",
        hora_acta: "",
        asistentes_firmas: [],
        is_universal: false,
        porcentaje_acciones_asistentes: "",
      };
      this.variablesAgenda = [];
      this.variablesQuorum = {
        primera_simple: 0,
        primera_calificada: 0,
        segunda_simple: 0,
        segunda_calificada: 0,
        convocatoria_realizada: "",
        porcentaje_asistencia: 0,
        porcentaje_asistencia_texto: "",
        cumple_quorum_simple: false,
        cumple_quorum_calificado: false,
        apertura_junta: false,
      };
      this.variablesAperturaPuntos = [];
      this.aporteDinerario = null;
      this.lastUpdated = null;
      this.isLoaded = false;
    },
  },
});
