/**
 * DTO de respuesta del endpoint download-data
 * Contiene TODA la información de la junta para generar documentos
 */
export interface DownloadDataDTO {
  // Paso 0: Puntos de agenda
  agendaItems: {
    aumentoCapital: {
      aportesDinerarios: boolean;
      aporteNoDinerario: boolean;
      capitalizacionDeCreditos: boolean;
    };
    remocion: {
      remocionGerenteGeneral: boolean;
      remocionApoderados: boolean;
      remocionDirectores: boolean;
    };
    nombramiento: {
      nombramientoGerenteGeneral: boolean;
      nombramientoApoderados: boolean;
      nombramientoDirectores: boolean;
      nombramientoNuevoDirectorio: boolean;
    };
    gestionSocialYResultadosEconomicos: {
      pronunciamientoGestionSocialYResultados: boolean;
      aplicacionResultados: boolean;
      designacionAuditoresExternos: boolean;
    };
  };

  // Paso 1: Detalles de la junta
  meetingDetails: {
    id: string;
    meetingType: "JUNTA_UNIVERSAL" | "JUNTA_GENERAL";
    meetingTypeFormatted: string; // "Junta Universal" | "Junta General"
    isAnnualMandatory: boolean;
    firstCall: {
      date: string | null; // ISO
      dateFormatted: string | null; // "15 de diciembre de 2025"
      time: string | null; // ISO
      timeFormatted: string | null; // "10:00"
      dateTimeFormatted: string | null; // "15 de diciembre de 2025 a las 10:00"
      place: string | null;
      mode: "PRESENCIAL" | "VIRTUAL" | null;
      modeFormatted: string | null; // "Presencial" | "Virtual"
    } | null;
    secondCall: {
      date: string | null;
      dateFormatted: string | null;
      time: string | null;
      timeFormatted: string | null;
      dateTimeFormatted: string | null;
      place: string | null;
      mode: "PRESENCIAL" | "VIRTUAL" | null;
      modeFormatted: string | null;
    } | null;
    president: {
      personId: string;
      name: string;
    } | null;
    secretary: {
      personId: string;
      name: string;
    } | null;
  };

  // Paso 2: Asistencia
  attendance: Array<{
    id: string;
    configJuntaId: string;
    accionista: any; // ShareholderReadDto (estructura compleja)
    accionesConDerechoVoto: number;
    porcentajeParticipacion: number;
    asistio: boolean;
    representante: {
      nombre: string;
      apellidoPaterno: string;
      apellidoMaterno: string | null;
      tipoDocumento: string;
      numeroDocumento: string;
      paisEmision: string | null;
    } | null;
  }>;

  // Paso 3: Datos de puntos de agenda
  agendaItemsData: {
    aporteDinerario: {
      aportanteData: Array<{
        id: string;
        person: any; // PersonMapper (estructura compleja)
        typeShareholder: string;
        isContributor: boolean;
      }>;
      aportesData: Array<{
        id: string;
        shareholderId: string;
        shareClass: {
          id: string;
          type: string;
          className: string;
        } | null;
        currency: string;
        contributionAmount: number;
        contributionAmountFormatted: string; // "S/ 1000.00"
        contributionDate: string;
        contributionDateFormatted: string | null; // "1 de diciembre de 2025"
        exchangeRate: number | null;
        exchangeRateFormatted: string | null; // "3.7500"
        contributionAmountInBaseCurrency: number;
        contributionAmountInBaseCurrencyFormatted: string; // "S/ 1000.00"
        sharesToReceive: number;
        sharesToReceiveFormatted: string; // "1,000"
        pricePerShare: number;
        pricePerShareFormatted: string; // "S/ 1.00"
        isFullyPaid: boolean;
        socialCapital: number;
        socialCapitalFormatted: string; // "S/ 800.00"
        premium: number;
        premiumFormatted: string; // "S/ 150.00"
        reserve: number;
        reserveFormatted: string; // "S/ 50.00"
        paidPercent: number;
        paidPercentFormatted: string; // "100.00%"
        totalLiability: number;
        totalLiabilityFormatted: string; // "S/ 1000.00"
        accountingEntryFileId: string | null;
      }>;
      votacionData: {
        id: string;
        modo: "SIMPLE" | "CUMULATIVO";
        items: Array<{
          id: string;
          orden: number;
          label: string;
          descripción: string | null;
          personaId: string | null;
          tipoAprobacion: "APROBADO_POR_TODOS" | "SOMETIDO_A_VOTACION" | null;
          votos: Array<{
            id: string;
            accionistaId: string;
            valor: string | number; // "A_FAVOR" | "EN_CONTRA" | "ABSTENCION" | number
          }>;
        }>;
      } | null;
    } | null;
    // Aquí se pueden agregar más puntos de agenda en el futuro
  };
}

