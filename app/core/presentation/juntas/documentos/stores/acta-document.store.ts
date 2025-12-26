import { defineStore } from "pinia";
import { useDocumentosStore } from "./documentos.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
import { useDownloadDataStore } from "./download-data.store";
import { CalculadoraAportes } from "~/core/hexag/documentos/domain/services/CalculadoraAportes";
import { AgrupadorAcciones } from "~/core/hexag/documentos/domain/services/AgrupadorAcciones";
import { FormateadorTexto } from "~/core/hexag/documentos/domain/services/FormateadorTexto";
import { ConstructorVariablesActa } from "~/core/hexag/documentos/domain/services/ConstructorVariablesActa";
import { ValidadorVariablesActa } from "~/core/hexag/documentos/domain/services/ValidadorVariablesActa";

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
     *
     * ✅ REFACTORIZADO: Usa ConstructorVariablesActa para construir todas las variables
     */
    load() {
      // Migrar datos antiguos si es necesario (solo una vez)
      if (!this.isLoaded) {
        this.migrate();
      }

      console.log("🔄 [ActaDocumentStore] Cargando todas las variables...");

      try {
        // Obtener datos de stores
        const documentosStore = useDocumentosStore();
        const snapshotStore = useSnapshotStore();
        const downloadDataStore = useDownloadDataStore();
        const meetingDetailsStore = useMeetingDetailsStore();

        const snapshot = snapshotStore.snapshot;
        const downloadData = downloadDataStore.downloadData;

        if (!snapshot || !downloadData) {
          console.warn("⚠️ [ActaDocumentStore] Datos no disponibles");
          return;
        }

        // Obtener datos auxiliares
        const datosSociedad = documentosStore.datosSociedad;
        const datosJunta = documentosStore.datosJunta;
        const asistentes = documentosStore.listaAccionistasAsistentes;
        const todosAccionistas = documentosStore.listaAccionistasConDerechoAVoto;
        const totalAcciones = documentosStore.totalAccionesConDerechoVoto;
        const porcentajeAsistencia = documentosStore.porcentajeAsistencia;
        const puntosActivos = documentosStore.puntosAgendaActivos;
        const directores = snapshotStore.directores;
        const meetingDetails = meetingDetailsStore.meetingDetails;
        const instaladaEnConvocatoria = meetingDetailsStore.instaladaEnConvocatoria;
        const quorums = snapshotStore.quorums;
        const datosAporteDinerario = documentosStore.datosAporteDinerario;

        if (!datosSociedad || !datosJunta) {
          console.warn("⚠️ [ActaDocumentStore] Datos de sociedad o junta no disponibles");
          return;
        }

        // Inicializar servicios
        const formateador = new FormateadorTexto();
        const calculadora = new CalculadoraAportes(formateador);
        const agrupador = new AgrupadorAcciones(formateador);
        const constructor = new ConstructorVariablesActa(calculadora, agrupador, formateador);
        const validador = new ValidadorVariablesActa();

        // Construir todas las variables
        const variablesCompletas = constructor.construirVariablesCompletas(
          snapshot,
          downloadData,
          {
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
          }
        );

        // Validar
        validador.validarVariablesCompletas(variablesCompletas);

        // Asignar a state
        this.variablesBase = variablesCompletas.variablesBase;
        this.variablesJunta = variablesCompletas.variablesJunta;
        this.variablesAsistencia = variablesCompletas.variablesAsistencia;
        this.variablesPresidenciaSecretaria =
          variablesCompletas.variablesPresidenciaSecretaria;
        this.variablesAgenda = variablesCompletas.variablesAgenda;
        this.variablesQuorum = variablesCompletas.variablesQuorum;
        this.variablesAperturaPuntos = variablesCompletas.variablesAperturaPuntos;
        this.aporteDinerario = variablesCompletas.aporteDinerario;

        this.lastUpdated = Date.now();
        this.isLoaded = true;

        console.log("✅ [ActaDocumentStore] Todas las variables cargadas:", {
          acta_label: this.variablesBase.acta_label,
          nombre_empresa: this.variablesBase.nombre_empresa,
          presidente: this.variablesPresidenciaSecretaria.presidente_junta,
          apertura_junta: this.variablesQuorum.apertura_junta,
          tieneAporteDinerario: !!this.aporteDinerario,
        });
      } catch (error: any) {
        console.error("❌ [ActaDocumentStore] Error al cargar variables:", error);
        throw error;
      }
    },

    /**
     * Limpiar todo
     */
    clear() {
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

      // Inicializar servicios de dominio
      const formateador = new FormateadorTexto();
      const calculadora = new CalculadoraAportes(formateador);
      const agrupador = new AgrupadorAcciones(formateador);

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

      // Calcular todos los valores usando servicios de dominio
      const aportantesData = construirAportantes();
      const snapshot = snapshotStore.snapshot;
      const valorNominal = snapshot?.nominalValue || 0;

      // Calcular totales desde aportantes formateados
      const { sumaCapitalSocial, sumaPrimaTotal, sumaReserva, sumaTotalAcciones } =
        calculadora.calcularTotalesDesdeAportantesFormateados(aportantesData);

      // Calcular valores antes usando servicios
      const capitalSocialAntes = calculadora.calcularCapitalSocialAntes(snapshot);
      const accionesAntes = calculadora.calcularAccionesAntes(snapshot);

      // Calcular valores después (sumando los aportes)
      const capitalSocialDespues = capitalSocialAntes + sumaCapitalSocial;
      const accionesDespues = accionesAntes + sumaTotalAcciones;
      const incremento = calculadora.calcularIncrementoCapital(
        capitalSocialAntes,
        capitalSocialDespues
      );
      const numeroDeAccionesIncrementadas = sumaTotalAcciones;
      const montoTotal = sumaCapitalSocial + sumaPrimaTotal + sumaReserva;

      // Calcular distribuciones usando servicios
      const distribucionAntesRaw = agrupador.calcularDistribucionAntes(snapshot);
      const distribucionDespuesRaw = agrupador.calcularDistribucionDespues(
        snapshot,
        datosAporte.aportes || []
      );
      const distribucionAntesAporte = agrupador.formatearDistribucion(
        distribucionAntesRaw,
        valorNominal
      );
      const distribucionDespuesAporte = agrupador.formatearDistribucion(
        distribucionDespuesRaw,
        valorNominal
      );

      // Calcular distribuciones con derecho a voto
      const distribucionDerechoVotoAntesRaw = agrupador.filtrarConDerechoVoto(
        distribucionAntesRaw,
        snapshot?.shareClasses || []
      );
      const distribucionDerechoVotoDespuesRaw = agrupador.filtrarConDerechoVoto(
        distribucionDespuesRaw,
        snapshot?.shareClasses || []
      );
      const distribucionAccionariaDerechoAvotoAntes = agrupador.formatearDistribucion(
        distribucionDerechoVotoAntesRaw,
        valorNominal
      );
      const distribucionAccionariaDerechoAvotoDespues = agrupador.formatearDistribucion(
        distribucionDerechoVotoDespuesRaw,
        valorNominal
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
          capital_actual_palabras: formateador.capitalSocialATexto(capitalSocialAntes),
          total_capital: capitalSocialDespues.toFixed(2),
          total_capital_palabras: formateador.capitalSocialATexto(capitalSocialDespues),
          prima_total: sumaPrimaTotal.toFixed(2),
          prima_total_texto: formateador.montoATexto(sumaPrimaTotal),
          suma_reserva: sumaReserva.toFixed(2),
          suma_reserva_texto: formateador.montoATexto(sumaReserva),
          aportantes: aportantesData,
          accionistas_aumento_capital: [],
          suma_total_acciones: sumaTotalAcciones.toString(),
          suma_capital_social: sumaCapitalSocial.toFixed(2),
          suma_prima_total: sumaPrimaTotal.toFixed(2),
          no_publicar_aviso: datosJunta.esUniversal,
          capitalSocialAntes,
          capitalSocialAntesTexto: formateador.capitalSocialATexto(capitalSocialAntes),
          capitalSocialDespues,
          capitalSocialDespuesTexto: formateador.capitalSocialATexto(capitalSocialDespues),
          accionesAntes,
          accionesAntesTexto: formateador.accionesATexto(accionesAntes),
          accionesDespues,
          accionesDespuesTexto: formateador.accionesATexto(accionesDespues),
          valorNominal,
          valorNominalTexto: formateador.montoATexto(valorNominal),
          incremento,
          incrementoTexto: formateador.montoATexto(incremento),
          numeroDeAccionesIncrementadas,
          numeroDeAccionesIncrementadasTexto: formateador.accionesATexto(
            numeroDeAccionesIncrementadas
          ),
          primaTotal: sumaPrimaTotal,
          primaTotalTexto: formateador.montoATexto(sumaPrimaTotal),
          reservaTotal: sumaReserva,
          reservaTotalTexto: formateador.montoATexto(sumaReserva),
          montoTotal,
          montoTotalTexto: formateador.montoATexto(montoTotal),
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
