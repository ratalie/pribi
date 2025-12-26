import { defineStore } from "pinia";
import { useDownloadDataStore } from "./download-data.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { numeroALetras } from "~/utils/numero-a-letras";

/**
 * Store centralizado para Documentos de Juntas V3.0
 *
 * Responsabilidades:
 * - Proporcionar getters computados para todos los datos necesarios para generar documentos
 * - Simplificar el acceso a datos desde downloadData y snapshot
 * - Una sola fuente de verdad para variables de templates
 *
 * Arquitectura:
 * - Getters básicos: Datos comunes a todos los documentos
 * - Getters por punto de agenda: Datos específicos de cada punto
 * - Getters de documentos comunes: Lógica para determinar qué documentos generar
 */
export const useDocumentosStore = defineStore("documentos", {
  // ✅ PERSISTENCIA: Guardar en localStorage
  persist: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    key: "probo-documentos-store",
  },

  state: () => ({
    // Estado de generación
    isGenerating: false,
    documentosGenerados: [] as any[],
  }),

  getters: {
    // ============================================
    // GETTERS BÁSICOS (comunes a todos los documentos)
    // ============================================

    /**
     * Datos básicos de la sociedad
     * Origen: snapshot.societyData
     */
    datosSociedad() {
      const snapshotStore = useSnapshotStore();
      const snapshot = snapshotStore.snapshot;

      if (!snapshot?.societyData) {
        return {
          razonSocial: "Sociedad sin nombre",
          ruc: "",
          direccion: "",
          ciudad: "",
          tipoSociedad: "",
          nombreComercial: "",
          distrito: "",
          provincia: "",
          departamento: "",
          fechaConstitucion: "",
          oficinaRegistral: "",
          partidaRegistral: "",
        };
      }

      return {
        razonSocial: snapshot.societyData.reasonSocial || "Sociedad sin nombre",
        ruc: snapshot.societyData.ruc || "",
        direccion: snapshot.societyData.address || "",
        ciudad: snapshot.societyData.department || "",
        tipoSociedad: snapshot.societyData.typeSociety || "",
        nombreComercial: snapshot.societyData.commercialName || "",
        distrito: snapshot.societyData.district || "",
        provincia: snapshot.societyData.province || "",
        departamento: snapshot.societyData.department || "",
        fechaConstitucion: snapshot.societyData.registrationDate || "",
        oficinaRegistral: snapshot.societyData.registryOffice || "",
        partidaRegistral: snapshot.societyData.registrationRecord || "",
      };
    },

    /**
     * Datos básicos de la junta
     * Origen: downloadData.meetingDetails
     */
    datosJunta() {
      const downloadDataStore = useDownloadDataStore();
      const meetingDetails = downloadDataStore.meetingDetails;

      if (!meetingDetails) {
        return {
          tipoJunta: "Junta General",
          esUniversal: false,
          fecha: "",
          hora: "",
          fechaHora: "",
          lugar: "",
          modo: "",
          presidente: "",
          secretario: "",
          esAnualObligatoria: false,
          primeraConvocatoria: null,
          segundaConvocatoria: null,
        };
      }

      return {
        tipoJunta:
          meetingDetails.meetingTypeFormatted ||
          (meetingDetails.meetingType === "JUNTA_UNIVERSAL"
            ? "Junta Universal"
            : "Junta General"),
        esUniversal: meetingDetails.meetingType === "JUNTA_UNIVERSAL",
        fecha: meetingDetails.firstCall?.dateFormatted || "",
        hora: meetingDetails.firstCall?.timeFormatted || "",
        fechaHora: meetingDetails.firstCall?.dateTimeFormatted || "",
        lugar: meetingDetails.firstCall?.place || "",
        modo: meetingDetails.firstCall?.modeFormatted || "",
        presidente: meetingDetails.president?.name || "",
        secretario: meetingDetails.secretary?.name || "",
        esAnualObligatoria: meetingDetails.isAnnualMandatory || false,
        primeraConvocatoria: meetingDetails.firstCall,
        segundaConvocatoria: meetingDetails.secondCall,
      };
    },

    /**
     * Lista de TODOS los accionistas con derecho a voto
     * Origen: downloadData.attendance (filtrado por accionesConDerechoVoto > 0)
     */
    listaAccionistasConDerechoAVoto() {
      const downloadDataStore = useDownloadDataStore();
      const snapshotStore = useSnapshotStore();
      const attendance = downloadDataStore.attendance;

      if (!attendance || attendance.length === 0) {
        return [];
      }

      // Obtener snapshot para calcular acciones correctamente
      const snapshot = snapshotStore.snapshot;
      const shareAllocations = snapshot?.shareAllocations || [];
      const shareClasses = snapshot?.shareClasses || [];

      return attendance
        .map((a) => {
          // Calcular acciones con derecho a voto desde snapshot si no vienen en attendance
          let accionesConDerechoVoto = a.accionesConDerechoVoto;

          // Si accionesConDerechoVoto es 0, calcular desde snapshot
          if (accionesConDerechoVoto === 0 && snapshot) {
            const accionistaId = a.accionista?.id;
            if (accionistaId) {
              const asignaciones = shareAllocations.filter(
                (asig) => asig.accionistaId === accionistaId
              );

              accionesConDerechoVoto = asignaciones.reduce((sum, asig) => {
                const shareClass = shareClasses.find((sc) => sc.id === asig.accionId);
                if (shareClass?.conDerechoVoto) {
                  return sum + asig.cantidadSuscrita;
                }
                return sum;
              }, 0);
            }
          }

          // Filtrar solo los que tienen acciones con derecho a voto
          if (accionesConDerechoVoto === 0) {
            return null;
          }

          const accionista = a.accionista;
          // La estructura real es: accionista.person.tipo, accionista.person.nombre, etc.
          const person = accionista?.person || accionista;
          const esPersonaNatural = person?.tipo === "NATURAL";

          // Construir nombre completo
          let nombre = "";
          if (esPersonaNatural) {
            nombre = `${person?.nombre || ""} ${person?.apellidoPaterno || ""} ${
              person?.apellidoMaterno || ""
            }`.trim();
          } else {
            nombre = person?.razonSocial || person?.legalName || "Accionista sin nombre";
          }

          // Obtener documento
          const documento = esPersonaNatural
            ? person?.numeroDocumento || person?.documentNumber || ""
            : person?.ruc || "";

          // Obtener tipo de documento
          const tipoDocumento = esPersonaNatural
            ? person?.tipoDocumento || person?.documentType || "DNI"
            : "RUC";

          return {
            id: accionista?.id || a.id,
            nombre: nombre || "Accionista sin nombre",
            tipo: esPersonaNatural ? "NATURAL" : "JURIDICA",
            acciones: accionesConDerechoVoto, // Usar el valor calculado
            porcentaje: a.porcentajeParticipacion,
            asistio: a.asistio,
            representante: a.representante,
            // Datos adicionales para templates
            documento,
            tipoDocumento,
          };
        })
        .filter((a) => a !== null) as any[];
    },

    /**
     * Lista de accionistas que ASISTIERON a la junta
     * Origen: downloadData.attendance (filtrado por asistio === true)
     */
    listaAccionistasAsistentes() {
      const lista = this.listaAccionistasConDerechoAVoto; // Esto ya es un array, no un getter
      return lista.filter((a: any) => a.asistio);
    },

    /**
     * Total de acciones con derecho a voto presentes
     * Origen: Suma de accionesConDerechoVoto de asistentes (calculado desde snapshot si es 0)
     */
    totalAccionesConDerechoVoto(): number {
      const downloadDataStore = useDownloadDataStore();
      const snapshotStore = useSnapshotStore();
      const attendance = downloadDataStore.attendance;

      if (!attendance || attendance.length === 0) {
        return 0;
      }

      const snapshot = snapshotStore.snapshot;
      const shareAllocations = snapshot?.shareAllocations || [];
      const shareClasses = snapshot?.shareClasses || [];

      // Calcular total desde asistentes
      return attendance
        .filter((a) => a.asistio)
        .reduce((sum, a) => {
          let accionesConDerechoVoto = a.accionesConDerechoVoto;

          // Si accionesConDerechoVoto es 0, calcular desde snapshot
          if (accionesConDerechoVoto === 0 && snapshot) {
            const accionistaId = a.accionista?.id;
            if (accionistaId) {
              const asignaciones = shareAllocations.filter(
                (asig) => asig.accionistaId === accionistaId
              );

              accionesConDerechoVoto = asignaciones.reduce((accSum, asig) => {
                const shareClass = shareClasses.find((sc) => sc.id === asig.accionId);
                if (shareClass?.conDerechoVoto) {
                  return accSum + asig.cantidadSuscrita;
                }
                return accSum;
              }, 0);
            }
          }

          return sum + accionesConDerechoVoto;
        }, 0);
    },

    /**
     * Porcentaje de asistencia
     * Calcula el porcentaje de acciones presentes vs total de acciones con derecho a voto
     */
    porcentajeAsistencia(): number {
      const snapshotStore = useSnapshotStore();
      const totalAccionesAsistentes = this.totalAccionesConDerechoVoto;
      const snapshot = snapshotStore.snapshot;

      if (!snapshot) {
        return 0;
      }

      // Calcular total de acciones con derecho a voto desde snapshot
      const shareAllocations = snapshot.shareAllocations || [];
      const shareClasses = snapshot.shareClasses || [];

      const totalAccionesSociedad = shareAllocations.reduce((sum, asig) => {
        const shareClass = shareClasses.find((sc) => sc.id === asig.accionId);
        if (shareClass?.conDerechoVoto) {
          return sum + asig.cantidadSuscrita;
        }
        return sum;
      }, 0);

      if (totalAccionesSociedad === 0) {
        return 0;
      }

      const porcentaje = (totalAccionesAsistentes / totalAccionesSociedad) * 100;
      return Math.round(porcentaje * 100) / 100;
    },

    /**
     * Si falta quórum
     * Quórum mínimo: 50% + 1 acción para Junta General, 100% para Junta Universal
     */
    faltaQuorum(): boolean {
      const datosJunta = this.datosJunta;
      const porcentaje = this.porcentajeAsistencia;

      if (datosJunta.esUniversal) {
        // Junta Universal requiere 100%
        return porcentaje < 100;
      } else {
        // Junta General requiere 50% + 1
        return porcentaje < 50;
      }
    },

    /**
     * Lista de acciones por accionista
     * TODO: Obtener desde snapshot cuando esté disponible
     * Por ahora retornamos array vacío
     */
    listaAccionesPorAccionista() {
      // TODO: Implementar cuando tengamos acceso a snapshot.shareholders con detalles de acciones
      return [];
    },

    /**
     * Lista de apoderados
     * TODO: Obtener desde snapshot cuando esté disponible
     * Por ahora retornamos array vacío
     */
    listaApoderados() {
      // TODO: Implementar cuando tengamos acceso a snapshot.attorneys
      return [];
    },

    // ============================================
    // GETTERS DE DOCUMENTOS COMUNES
    // ============================================

    /**
     * Si necesita generar Convocatoria
     * Solo se genera si es Junta General (no Universal)
     */
    necesitaConvocatoria(): boolean {
      return !this.datosJunta.esUniversal;
    },

    /**
     * Si necesita generar Proxy para Persona Natural
     * Se genera si hay representantes tipo NATURAL
     */
    necesitaProxyNatural(): boolean {
      const lista = this.listaAccionistasAsistentes;
      return lista.some((a) => a.representante && a.tipo === "NATURAL");
    },

    /**
     * Si necesita generar Proxy para Persona Jurídica
     * Se genera si hay representantes tipo JURIDICA
     */
    necesitaProxyJuridica(): boolean {
      const lista = this.listaAccionistasAsistentes;
      return lista.some((a) => a.representante && a.tipo === "JURIDICA");
    },

    // ============================================
    // GETTERS POR PUNTO DE AGENDA
    // ============================================

    /**
     * Datos de Aporte Dinerario
     * Origen: downloadData.agendaItemsData.aporteDinerario
     */
    datosAporteDinerario() {
      const downloadDataStore = useDownloadDataStore();
      const aporteDinerario = downloadDataStore.aporteDinerario;

      if (!aporteDinerario) {
        return null;
      }

      // Calcular total de aportes
      const totalAportes = aporteDinerario.aportesData.reduce(
        (sum, a) => sum + a.contributionAmountInBaseCurrency,
        0
      );

      return {
        tieneAporteDinerario: true,
        aportantes: aporteDinerario.aportanteData || [],
        aportes: aporteDinerario.aportesData || [],
        votacion: aporteDinerario.votacionData || null,
        totalAportes,
        totalAportesPalabras: numeroALetras(totalAportes),
        // Agrupar aportes por aportante
        aportesPorAportante: this.agruparAportesPorAportante(aporteDinerario),
      };
    },

    /**
     * Datos de Capitalización de Créditos
     * TODO: Implementar cuando el backend lo soporte
     */
    datosCapitalizacionCreditos() {
      // TODO: Implementar cuando el backend agregue capitalizacionCreditos a agendaItemsData
      return null;
    },

    /**
     * Datos de Nombramiento de Directores
     * TODO: Implementar cuando el backend lo soporte
     */
    datosNombramientoDirectores() {
      // TODO: Implementar cuando el backend agregue nombramientoDirectores a agendaItemsData
      return null;
    },

    /**
     * Datos de Nombramiento de Gerente
     * TODO: Implementar cuando el backend lo soporte
     */
    datosNombramientoGerente() {
      // TODO: Implementar cuando el backend agregue nombramientoGerente a agendaItemsData
      return null;
    },

    /**
     * Datos de Remoción de Directores
     * TODO: Implementar cuando el backend lo soporte
     */
    datosRemocionDirectores() {
      // TODO: Implementar cuando el backend agregue remocionDirectores a agendaItemsData
      return null;
    },

    /**
     * Datos de Gestión Social
     * TODO: Implementar cuando el backend lo soporte
     */
    datosGestionSocial() {
      // TODO: Implementar cuando el backend agregue gestionSocial a agendaItemsData
      return null;
    },

    /**
     * Puntos de agenda activos
     * Retorna array de strings con los IDs de los puntos activos
     */
    puntosAgendaActivos(): string[] {
      const downloadDataStore = useDownloadDataStore();
      const agendaItems = downloadDataStore.agendaItems;

      if (!agendaItems) {
        return [];
      }

      const activos: string[] = [];

      // Aumento de Capital
      if (agendaItems.aumentoCapital?.aportesDinerarios) {
        activos.push("aporteDinerario");
      }
      if (agendaItems.aumentoCapital?.capitalizacionDeCreditos) {
        activos.push("capitalizacionCreditos");
      }

      // Remoción
      if (agendaItems.remocion?.remocionGerenteGeneral) {
        activos.push("remocionGerente");
      }
      if (agendaItems.remocion?.remocionDirectores) {
        activos.push("remocionDirectores");
      }

      // Nombramiento
      if (agendaItems.nombramiento?.nombramientoGerenteGeneral) {
        activos.push("nombramientoGerente");
      }
      if (agendaItems.nombramiento?.nombramientoDirectores) {
        activos.push("nombramientoDirectores");
      }

      // Gestión Social
      if (
        agendaItems.gestionSocialYResultadosEconomicos?.pronunciamientoGestionSocialYResultados
      ) {
        activos.push("gestionSocial");
      }
      if (agendaItems.gestionSocialYResultadosEconomicos?.aplicacionResultados) {
        activos.push("aplicacionResultados");
      }
      if (agendaItems.gestionSocialYResultadosEconomicos?.designacionAuditoresExternos) {
        activos.push("designacionAuditores");
      }

      return activos;
    },

    // ============================================
    // GETTERS NUEVOS - ESTRUCTURA POR FASES
    // ============================================

    /**
     * FASE 1: Detalles de la Junta
     * Compilación de datos básicos: nombre, cantidad de puntos, fecha, etc.
     * Origen: datosSociedad + datosJunta
     */
    detallesDeLaJunta() {
      const sociedad = this.datosSociedad;
      const junta = this.datosJunta;
      const puntosActivos = this.puntosAgendaActivos;

      return {
        nombreEmpresa: sociedad.razonSocial,
        ruc: sociedad.ruc,
        tipoJunta: junta.tipoJunta,
        esUniversal: junta.esUniversal,
        fecha: junta.fecha,
        hora: junta.hora,
        lugar: junta.lugar,
        ciudad: sociedad.ciudad || "Lima",
        cantidadPuntosAgenda: puntosActivos.length,
        puntosAgenda: puntosActivos,
        presidente: junta.presidente || "No especificado",
        secretario: junta.secretario || "No especificado",
        // Fecha formateada para el acta
        fechaFormateada: junta.fecha || "",
        horaFormateada: junta.hora || "",
      };
    },

    /**
     * FASE 2: Instalación y Quórum
     * Datos de instalación: acciones, quórum, asistencia
     * Origen: listaAccionistas + cálculos de quórum
     */
    instalacion() {
      const asistentes = this.listaAccionistasAsistentes;
      const totalAcciones = this.totalAccionesConDerechoVoto;
      const porcentajeAsistencia = this.porcentajeAsistencia;
      const faltaQuorum = this.faltaQuorum;
      const datosJunta = this.datosJunta;
      const listaAccionistas = this.listaAccionistasConDerechoAVoto;

      // Calcular acciones totales de la sociedad (TODO: obtener desde snapshot cuando esté disponible)
      // Por ahora usamos el total de acciones con derecho a voto de todos los accionistas
      const accionesTotales = listaAccionistas.reduce(
        (sum: number, a: any) => sum + a.acciones,
        0
      );

      return {
        // Acciones
        accionesConDerechoAVoto: totalAcciones,
        accionesTotales: accionesTotales,
        porcentajeAcciones:
          accionesTotales > 0
            ? Math.round((totalAcciones / accionesTotales) * 100 * 100) / 100
            : 0,

        // Asistencia
        cantidadAsistentes: asistentes.length,
        listaAsistentes: asistentes,

        // Quórum
        porcentajeAsistencia: porcentajeAsistencia,
        faltaQuorum: faltaQuorum,
        quorumRequerido: datosJunta.esUniversal ? 100 : 50,
        cumpleQuorum: !faltaQuorum,

        // Texto formateado para el acta
        totalAccionesTexto: totalAcciones.toLocaleString("es-PE"),
        porcentajeAccionesTexto:
          accionesTotales > 0
            ? Math.round((totalAcciones / accionesTotales) * 100 * 100) / 100 + "%"
            : "0%",
      };
    },

    /**
     * FASE 3: Quórum Status
     * Status del quórum: "ok" | "pending" | "vacio"
     * Por ahora hardcodeado como función que devuelve "ok"
     * TODO: Implementar lógica de negocio más adelante
     */
    quorum() {
      const instalacion = this.instalacion;

      // Por ahora, lógica simple hardcodeada
      if (instalacion.accionesConDerechoAVoto === 0) {
        return {
          status: "vacio" as const,
          mensaje: "No hay acciones con derecho a voto",
        };
      }

      if (instalacion.faltaQuorum) {
        return {
          status: "pending" as const,
          mensaje: `Falta quórum. Se requiere ${instalacion.quorumRequerido}%, actual: ${instalacion.porcentajeAsistencia}%`,
        };
      }

      return {
        status: "ok" as const,
        mensaje: `Quórum cumplido: ${instalacion.porcentajeAsistencia}%`,
      };
    },
  },

  actions: {
    /**
     * Agrupar aportes por aportante
     * Helper para facilitar el acceso a aportes por aportante
     */
    agruparAportesPorAportante(
      aporteDinerario: NonNullable<ReturnType<typeof useDownloadDataStore>["aporteDinerario"]>
    ) {
      const agrupados: Record<string, typeof aporteDinerario.aportesData> = {};

      aporteDinerario.aportesData.forEach((aporte: any) => {
        const aportanteId = aporte.shareholderId;
        if (!agrupados[aportanteId]) {
          agrupados[aportanteId] = [];
        }
        agrupados[aportanteId].push(aporte);
      });

      return agrupados;
    },
  },
});
