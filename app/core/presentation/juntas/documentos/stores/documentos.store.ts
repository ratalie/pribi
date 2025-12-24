import { defineStore } from "pinia";
import type { DownloadDataDTO } from "~/core/hexag/documentos/application/dtos/download-data.dto";
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
        tipoJunta: meetingDetails.meetingTypeFormatted || 
          (meetingDetails.meetingType === "JUNTA_UNIVERSAL" ? "Junta Universal" : "Junta General"),
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
      const attendance = downloadDataStore.attendance;

      if (!attendance || attendance.length === 0) {
        return [];
      }

      return attendance
        .filter((a) => a.accionesConDerechoVoto > 0)
        .map((a) => {
          const accionista = a.accionista;
          const esPersonaNatural = accionista?.type === "NATURAL" || 
            (accionista?.firstName && !accionista?.legalName);

          return {
            id: accionista?.id || a.id,
            nombre: esPersonaNatural
              ? `${accionista?.firstName || ""} ${accionista?.lastNamePaternal || ""} ${accionista?.lastNameMaternal || ""}`.trim()
              : accionista?.legalName || "Accionista sin nombre",
            tipo: esPersonaNatural ? "NATURAL" : "JURIDICA",
            acciones: a.accionesConDerechoVoto,
            porcentaje: a.porcentajeParticipacion,
            asistio: a.asistio,
            representante: a.representante,
            // Datos adicionales para templates
            documento: esPersonaNatural
              ? accionista?.documentNumber || ""
              : accionista?.ruc || "",
            tipoDocumento: esPersonaNatural
              ? accionista?.documentType || "DNI"
              : "RUC",
          };
        });
    },

    /**
     * Lista de accionistas que ASISTIERON a la junta
     * Origen: downloadData.attendance (filtrado por asistio === true)
     */
    listaAccionistasAsistentes() {
      const lista = this.listaAccionistasConDerechoAVoto;
      return lista.filter((a) => a.asistio);
    },

    /**
     * Total de acciones con derecho a voto presentes
     * Origen: Suma de accionesConDerechoVoto de asistentes
     */
    totalAccionesConDerechoVoto(): number {
      const downloadDataStore = useDownloadDataStore();
      const attendance = downloadDataStore.attendance;

      if (!attendance || attendance.length === 0) {
        return 0;
      }

      return attendance
        .filter((a) => a.asistio && a.accionesConDerechoVoto > 0)
        .reduce((sum, a) => sum + a.accionesConDerechoVoto, 0);
    },

    /**
     * Porcentaje de asistencia
     * TODO: Necesitamos obtener el total de acciones de la sociedad desde snapshot
     * Por ahora, calculamos basado en el porcentaje de participación
     */
    porcentajeAsistencia(): number {
      const downloadDataStore = useDownloadDataStore();
      const attendance = downloadDataStore.attendance;

      if (!attendance || attendance.length === 0) {
        return 0;
      }

      // Sumar porcentajes de asistentes con derecho a voto
      const porcentajeAsistentes = attendance
        .filter((a) => a.asistio && a.accionesConDerechoVoto > 0)
        .reduce((sum, a) => sum + a.porcentajeParticipacion, 0);

      return Math.round(porcentajeAsistentes * 100) / 100;
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
      if (agendaItems.gestionSocialYResultadosEconomicos?.pronunciamientoGestionSocialYResultados) {
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
  },

  actions: {
    /**
     * Agrupar aportes por aportante
     * Helper para facilitar el acceso a aportes por aportante
     */
    agruparAportesPorAportante(aporteDinerario: NonNullable<ReturnType<typeof useDownloadDataStore>["aporteDinerario"]>) {
      const agrupados: Record<string, typeof aporteDinerario.aportesData> = {};

      aporteDinerario.aportesData.forEach((aporte) => {
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

