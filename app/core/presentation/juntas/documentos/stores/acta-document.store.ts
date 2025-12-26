import { defineStore } from "pinia";
import { useDocumentosStore } from "./documentos.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
import { useDownloadDataStore } from "./download-data.store";

/**
 * Store para Variables Completas del Acta
 *
 * Calcula reactivamente todas las variables necesarias para el template Mustache del acta.
 * Se actualiza automáticamente cuando cambian los datos de downloadData o snapshot.
 */
export const useActaDocumentStore = defineStore("actaDocument", {
  // ✅ PERSISTENCIA: Guardar en localStorage para debug
  persist: {
    storage: localStorage,
    key: "probo-acta-document-variables",
  },

  state: () => ({
    // Cache de variables completas calculadas
    // Se actualiza automáticamente cuando cambian los datos
    variablesCompletasCache: null as any,
    lastUpdated: null as number | null,
  }),

  getters: {
    /**
     * Variables completas para el template del acta
     * Se calcula reactivamente cuando cambian los datos
     * También actualiza el cache en el state para persistencia
     */
    variablesCompletas() {
      // Construir todas las secciones directamente desde los getters
      // Los getters internos ya manejan los casos donde faltan datos (valores por defecto)
      const variablesBase = this.variablesBase;
      const variablesJunta = this.variablesJunta;
      const variablesAsistencia = this.variablesAsistencia;
      const variablesPresidencia = this.variablesPresidenciaSecretaria;
      const variablesAperturaPuntos = this.variablesAperturaPuntos;
      const variablesAgenda = this.variablesAgenda;

      // Obtener quorum (acceder directamente al getter)
      const variablesQuorum = this.variablesQuorum as ReturnType<typeof this.variablesQuorum>;

      // Combinar todo
      const variablesCompletas = {
        ...variablesBase,
        ...variablesJunta,
        ...variablesAsistencia,
        ...variablesPresidencia, // presidente_junta, secretario_junta, hora_acta, asistentes_firmas
        agenda: variablesAgenda, // Lista de agenda numerada
        quorum: variablesQuorum,
        puntos_agenda_apertura: variablesAperturaPuntos,
      };

      // ✅ ACTUALIZAR CACHE EN STATE para persistencia
      this.variablesCompletasCache = variablesCompletas;
      this.lastUpdated = Date.now();

      // Log de éxito
      console.log(
        "✅ [ActaDocumentStore] Variables completas calculadas y cache actualizado:",
        {
          acta_label: (variablesCompletas as any).acta_label,
          nombre_empresa: (variablesCompletas as any).nombre_empresa,
          presidente: (variablesCompletas as any).presidente_junta,
          secretario: (variablesCompletas as any).secretario_junta,
          apertura_junta: variablesCompletas.quorum.apertura_junta,
          puntosApertura: variablesCompletas.puntos_agenda_apertura.length,
        }
      );

      return variablesCompletas;
    },

    /**
     * Variables base (encabezado)
     */
    variablesBase() {
      const documentosStore = useDocumentosStore();
      const datosSociedad = documentosStore.datosSociedad!;
      const datosJunta = documentosStore.datosJunta!;

      return {
        // ============================================
        // ENCABEZADO
        // ============================================
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
     * Variables de junta (nombre, tipo, convocatoria)
     */
    variablesJunta() {
      const documentosStore = useDocumentosStore();
      const meetingDetailsStore = useMeetingDetailsStore();
      const downloadDataStore = useDownloadDataStore();
      const datosJunta = documentosStore.datosJunta!;

      // Obtener nombre de junta
      const nombreJunta =
        meetingDetailsStore.meetingDetails?.nombreJunta ||
        downloadDataStore.meetingDetails?.nombreJunta ||
        null;

      // Construir nombre si no existe
      let nombreJuntaFinal: string | undefined = undefined;
      if (nombreJunta) {
        nombreJuntaFinal = nombreJunta;
      } else {
        // Construir desde isAnnualMandatory
        if (datosJunta.esAnualObligatoria) {
          nombreJuntaFinal = datosJunta.esUniversal
            ? "Junta Universal Ordinaria"
            : "Junta General Ordinaria";
        } else {
          nombreJuntaFinal = datosJunta.esUniversal
            ? "Junta Universal Extraordinaria"
            : "Junta General Extraordinaria";
        }
      }

      // Obtener convocatoria realizada
      const convocatoriaRealizada = datosJunta.esUniversal
        ? "UNIVERSAL"
        : meetingDetailsStore.instaladaEnConvocatoria || "PRIMERA";

      // Formatear convocatoria para puntos (lowercase)
      const convocatoriaRealizadaLower =
        convocatoriaRealizada === "UNIVERSAL"
          ? "universal"
          : convocatoriaRealizada.toLowerCase();

      // Fecha de convocatoria
      const fechaConvocatoria = datosJunta.esUniversal
        ? datosJunta.primeraConvocatoria?.dateFormatted || ""
        : convocatoriaRealizada === "PRIMERA"
        ? datosJunta.primeraConvocatoria?.dateFormatted || ""
        : datosJunta.segundaConvocatoria?.dateFormatted || "";

      return {
        // Nombre de junta
        nombre_junta: nombreJuntaFinal,
        tiene_nombre_junta: !!nombreJuntaFinal,
        es_anual_obligatoria: datosJunta.esAnualObligatoria || false,

        // Tipo de junta
        tipo_junta: datosJunta.esUniversal ? "UNIVERSAL" : "GENERAL",
        es_universal: datosJunta.esUniversal,
        es_general: !datosJunta.esUniversal,

        // Convocatoria
        convocatoria_activa: datosJunta.esUniversal ? null : convocatoriaRealizada,
        convocatoria_realizada: convocatoriaRealizada,
        fecha_convocatoria: fechaConvocatoria,

        // Datos de convocatorias
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

        // Helper para puntos (lowercase)
        _convocatoria_realizada_lower: convocatoriaRealizadaLower,
      };
    },

    /**
     * Variables de asistencia
     */
    variablesAsistencia() {
      const documentosStore = useDocumentosStore();
      const asistentes = documentosStore.listaAccionistasAsistentes;
      const todosAccionistas = documentosStore.listaAccionistasConDerechoAVoto;
      const totalAcciones = documentosStore.totalAccionesConDerechoVoto;
      const porcentajeAsistencia = documentosStore.porcentajeAsistencia;

      // Helper para formatear asistencia
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

      return {
        // Lista formateada para Mustache
        asistencia_lista: asistentes.map((a: any) => ({
          texto_asistencia: formatearAsistencia(a),
        })),

        // Arrays completos
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

        // Totales
        total_acciones: totalAcciones.toLocaleString("es-PE"),
        total_acciones_numero: totalAcciones,
        porcentaje_acciones: porcentajeAsistencia.toFixed(2) + "%",
        porcentaje_acciones_numero: porcentajeAsistencia,
        valor_nominal: "1.00", // TODO: Obtener desde snapshot cuando esté disponible
      };
    },

    /**
     * Variables de presidencia y secretaría
     */
    variablesPresidenciaSecretaria() {
      const documentosStore = useDocumentosStore();
      const meetingDetailsStore = useMeetingDetailsStore();
      const snapshotStore = useSnapshotStore();
      const datosJunta = documentosStore.datosJunta!;
      const asistentes = documentosStore.listaAccionistasAsistentes;

      // Obtener nombres de presidente y secretario desde IDs
      const obtenerNombreDesdePersonId = (
        personId: string | null | undefined,
        esSecretario: boolean = false
      ): string => {
        if (!personId) {
          console.warn(
            `⚠️ [ActaDocumentStore] No hay ${esSecretario ? "secretario" : "presidente"}Id`
          );
          return "No especificado";
        }

        // Buscar en directores del snapshot
        const directores = snapshotStore.directores;
        const director = directores.find((d) => d.persona.id === personId);
        if (director) {
          const nombre = `${director.persona.nombre} ${director.persona.apellidoPaterno} ${
            director.persona.apellidoMaterno || ""
          }`.trim();
          console.log(
            `✅ [ActaDocumentStore] ${
              esSecretario ? "Secretario" : "Presidente"
            } encontrado en directores:`,
            nombre
          );
          return nombre;
        }

        // Buscar en apoderados (attorneys) del snapshot
        const snapshot = snapshotStore.snapshot;
        const apoderado = snapshot?.attorneys?.find((a) => a.persona.id === personId);
        if (apoderado) {
          let nombre = "";
          if (apoderado.persona.tipo === "NATURAL") {
            nombre = `${apoderado.persona.nombre} ${apoderado.persona.apellidoPaterno} ${
              apoderado.persona.apellidoMaterno || ""
            }`.trim();
          } else {
            nombre = apoderado.persona.razonSocial || "No especificado";
          }
          console.log(
            `✅ [ActaDocumentStore] ${
              esSecretario ? "Secretario" : "Presidente"
            } encontrado en apoderados:`,
            nombre
          );
          return nombre;
        }

        // Si no se encuentra, usar el nombre del downloadData (puede estar vacío)
        const nombreFallback = esSecretario ? datosJunta.secretario : datosJunta.presidente;
        console.warn(
          `⚠️ [ActaDocumentStore] ${
            esSecretario ? "Secretario" : "Presidente"
          } no encontrado en snapshot, usando fallback:`,
          nombreFallback
        );
        return nombreFallback || "No especificado";
      };

      const presidenteId = meetingDetailsStore.meetingDetails?.presidenteId;
      const secretarioId = meetingDetailsStore.meetingDetails?.secretarioId;

      const nombrePresidente = obtenerNombreDesdePersonId(presidenteId, false);
      const nombreSecretario = obtenerNombreDesdePersonId(secretarioId, true);

      return {
        // Mesa directiva
        presidente_junta: nombrePresidente,
        secretario_junta: nombreSecretario,

        // Cierre
        hora_acta: new Date().toLocaleTimeString("es-PE", {
          hour: "2-digit",
          minute: "2-digit",
        }),

        // Firmas (solo para Junta Universal)
        asistentes_firmas: datosJunta.esUniversal
          ? asistentes.map((a: any) => ({
              nombre_accionista: a.nombre,
            }))
          : [],

        // Quórum (para compatibilidad con template antiguo)
        is_universal: datosJunta.esUniversal,
        porcentaje_acciones_asistentes: documentosStore.porcentajeAsistencia.toFixed(2),
      };
    },

    /**
     * Variables de agenda (lista de puntos numerados)
     */
    variablesAgenda() {
      const documentosStore = useDocumentosStore();
      const puntosActivos = documentosStore.puntosAgendaActivos;

      // Mapeo de puntos a títulos
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

      // Construir lista de agenda
      const agenda: string[] = [];

      puntosActivos.forEach((puntoId) => {
        const titulo = titulosPuntos[puntoId];
        if (titulo) {
          agenda.push(titulo);
        }
      });

      // Si hay aumento de capital (aportes o capitalización), agregar modificación de estatuto
      if (
        puntosActivos.includes("aporteDinerario") ||
        puntosActivos.includes("capitalizacionCreditos")
      ) {
        agenda.push("Modificación parcial del estatuto social de la Sociedad");
      }

      // Siempre agregar otorgamiento de facultades al final
      agenda.push("Otorgamiento de facultades para la formalización de acuerdos");

      return agenda.map((titulo, index) => ({
        numero: index + 1,
        titulo,
      }));
    },

    /**
     * Variables de quórum
     */
    variablesQuorum() {
      const documentosStore = useDocumentosStore();
      const snapshotStore = useSnapshotStore();
      const meetingDetailsStore = useMeetingDetailsStore();
      const datosJunta = documentosStore.datosJunta!;
      const porcentajeAsistencia = documentosStore.porcentajeAsistencia;

      // Obtener quórums del snapshot
      const quorums = snapshotStore.quorums;
      if (!quorums) {
        console.warn("⚠️ [ActaDocumentStore] No hay quórums en el snapshot");
        return {
          primera_simple: 50,
          primera_calificada: 66.66,
          segunda_simple: 25,
          segunda_calificada: 50,
          convocatoria_realizada: datosJunta.esUniversal ? "UNIVERSAL" : "PRIMERA",
          porcentaje_asistencia: porcentajeAsistencia,
          porcentaje_asistencia_texto: porcentajeAsistencia.toFixed(2) + "%",
          cumple_quorum_simple: false,
          cumple_quorum_calificado: false,
          apertura_junta: false, // Por defecto false si no hay quórums
        };
      }

      // Determinar convocatoria realizada
      const convocatoriaRealizada = datosJunta.esUniversal
        ? "UNIVERSAL"
        : meetingDetailsStore.instaladaEnConvocatoria || "PRIMERA";

      // Calcular si cumple quórum simple y calificado
      let cumpleQuorumSimple = false;
      let cumpleQuorumCalificado = false;

      if (datosJunta.esUniversal) {
        // Universal: siempre cumple (100% requerido)
        cumpleQuorumSimple = porcentajeAsistencia >= 100;
        cumpleQuorumCalificado = porcentajeAsistencia >= 100;
      } else {
        // General: según convocatoria
        if (convocatoriaRealizada === "PRIMERA") {
          cumpleQuorumSimple = porcentajeAsistencia >= quorums.primeraConvocatoriaSimple;
          cumpleQuorumCalificado =
            porcentajeAsistencia >= quorums.primeraConvocatoriaCalificada;
        } else {
          // SEGUNDA
          cumpleQuorumSimple = porcentajeAsistencia >= quorums.segundaConvocatoriaSimple;
          cumpleQuorumCalificado =
            porcentajeAsistencia >= quorums.segundaConvocatoriaCalificada;
        }
      }

      // Calcular apertura de junta basado en puntos de agenda
      // Nota: Calculamos aquí directamente para evitar dependencia circular
      const puntosActivos = documentosStore.puntosAgendaActivos;
      let aperturaJunta = false;

      if (puntosActivos.length > 0) {
        // Reglas de tipo de votación por punto
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

        // Verificar si al menos 1 punto cumple el quórum
        aperturaJunta = puntosActivos.some((puntoId) => {
          const tipoVotacion = tipoVotacionPorPunto[puntoId] || "simple";
          let porcentajeRequerido = 0;

          if (datosJunta.esUniversal) {
            porcentajeRequerido = 0; // Universal siempre se abre
          } else {
            if (convocatoriaRealizada === "PRIMERA") {
              porcentajeRequerido =
                tipoVotacion === "simple"
                  ? quorums.primeraConvocatoriaSimple
                  : quorums.primeraConvocatoriaCalificada;
            } else {
              // SEGUNDA
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
        // Quórums requeridos (del snapshot)
        primera_simple: quorums.primeraConvocatoriaSimple,
        primera_calificada: quorums.primeraConvocatoriaCalificada,
        segunda_simple: quorums.segundaConvocatoriaSimple,
        segunda_calificada: quorums.segundaConvocatoriaCalificada,

        // Estado actual
        convocatoria_realizada: convocatoriaRealizada,
        porcentaje_asistencia: porcentajeAsistencia,
        porcentaje_asistencia_texto: porcentajeAsistencia.toFixed(2) + "%",

        // Validaciones
        cumple_quorum_simple: cumpleQuorumSimple,
        cumple_quorum_calificado: cumpleQuorumCalificado,

        // Apertura de junta (calculado desde puntos de agenda)
        apertura_junta: aperturaJunta,
      };
    },

    /**
     * Variables de apertura de puntos de agenda
     */
    variablesAperturaPuntos() {
      const documentosStore = useDocumentosStore();
      const snapshotStore = useSnapshotStore();
      const meetingDetailsStore = useMeetingDetailsStore();
      const datosJunta = documentosStore.datosJunta!;
      const porcentajeAsistencia = documentosStore.porcentajeAsistencia;
      const puntosActivos = documentosStore.puntosAgendaActivos;

      // Obtener quórums
      const quorums = snapshotStore.quorums;
      if (!quorums) {
        console.warn("⚠️ [ActaDocumentStore] No hay quórums para calcular apertura de puntos");
        return [];
      }

      // Determinar tipo de junta y convocatoria
      const tipoJunta = datosJunta.esUniversal ? "universal" : "general";
      const convocatoriaRealizada = datosJunta.esUniversal
        ? "universal"
        : (meetingDetailsStore.instaladaEnConvocatoria || "PRIMERA").toLowerCase();

      // Mapeo de puntos a títulos
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

      // Reglas de tipo de votación por punto
      const tipoVotacionPorPunto: Record<string, "simple" | "calificado"> = {
        aporteDinerario: "simple", // Siempre simple
        capitalizacionCreditos: "simple", // Por ahora simple
        nombramientoDirectores: "simple", // Por ahora simple
        nombramientoGerente: "simple", // Por ahora simple
        remocionDirectores: "calificado", // Probablemente calificado
        remocionGerente: "calificado", // Probablemente calificado
        gestionSocial: "simple", // Por ahora simple
        aplicacionResultados: "simple", // Por ahora simple
        designacionAuditores: "simple", // Por ahora simple
      };

      // Función para calcular porcentaje requerido
      const calcularPorcentajeRequerido = (tipoVotacion: "simple" | "calificado"): number => {
        // Universal: siempre 0%
        if (tipoJunta === "universal") {
          return 0;
        }

        // General: según convocatoria y tipo de votación
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

        return 0; // Fallback
      };

      // Construir array de puntos
      const puntosApertura = puntosActivos.map((puntoId) => {
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

      return puntosApertura;
    },
  },

  actions: {
    /**
     * Actualiza el cache de variables completas
     * Se puede llamar manualmente o automáticamente cuando cambien los datos
     */
    actualizarCache() {
      // Simplemente acceder al getter para que se ejecute y actualice el cache
      const _ = this.variablesCompletas;
    },

    /**
     * Limpia el cache
     */
    limpiarCache() {
      this.variablesCompletasCache = null;
      this.lastUpdated = null;
    },
  },
});
