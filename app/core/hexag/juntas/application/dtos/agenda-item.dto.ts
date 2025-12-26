/**
 * DTO de Puntos de Agenda
 * 
 * Representa la estructura completa de puntos de agenda que el backend espera/devuelve.
 * Todos los campos son booleanos, con false por defecto si no se han actualizado.
 * 
 * Mapea directamente con el DTO del backend: AgendaItemDto
 */
export interface AgendaItemsDTO {
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
  esAnualObligatoria?: boolean;
}

/**
 * Crea un DTO con todos los campos en false (valores por defecto)
 */
export function createDefaultAgendaItemsDTO(): AgendaItemsDTO {
  return {
    aumentoCapital: {
      aportesDinerarios: false,
      aporteNoDinerario: false,
      capitalizacionDeCreditos: false,
    },
    remocion: {
      remocionGerenteGeneral: false,
      remocionApoderados: false,
      remocionDirectores: false,
    },
    nombramiento: {
      nombramientoGerenteGeneral: false,
      nombramientoApoderados: false,
      nombramientoDirectores: false,
      nombramientoNuevoDirectorio: false,
    },
    gestionSocialYResultadosEconomicos: {
      pronunciamientoGestionSocialYResultados: false,
      aplicacionResultados: false,
      designacionAuditoresExternos: false,
    },
  };
}

