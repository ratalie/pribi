import type { AgendaItemsDTO } from "../../application/dtos/agenda-item.dto";
import { createDefaultAgendaItemsDTO } from "../../application/dtos/agenda-item.dto";

/**
 * Mapper para transformar entre IDs del frontend y estructura del backend
 * 
 * El frontend usa IDs como "aporte-dinerarios" (kebab-case)
 * El backend usa estructura anidada como aumentoCapital.aportesDinerarios (camelCase)
 */
export class AgendaItemsMapper {
  /**
   * Convierte IDs del frontend a estructura del backend
   * @param frontendIds Array de IDs seleccionados en el frontend (ej: ["aporte-dinerarios", "remocion-gerente"])
   * @param esAnualObligatoria Indica si es Junta Obligatoria Anual
   * @returns DTO con la estructura que el backend espera
   */
  static frontendIdsToDTO(frontendIds: string[], esAnualObligatoria?: boolean): AgendaItemsDTO {
    const dto = createDefaultAgendaItemsDTO();

    // Mapeo de IDs del frontend a campos del backend
    const mapping: Record<string, (dto: AgendaItemsDTO) => void> = {
      // Aumento de Capital
      "aporte-dinerarios": (dto) => {
        dto.aumentoCapital.aportesDinerarios = true;
      },
      "aporte-no-dinerario": (dto) => {
        dto.aumentoCapital.aporteNoDinerario = true;
      },
      "capitalizacion-creditos": (dto) => {
        dto.aumentoCapital.capitalizacionDeCreditos = true;
      },
      // Remoción
      "remocion-gerente": (dto) => {
        dto.remocion.remocionGerenteGeneral = true;
      },
      "remocion-apoderados": (dto) => {
        dto.remocion.remocionApoderados = true;
      },
      "remocion-directores": (dto) => {
        dto.remocion.remocionDirectores = true;
      },
      // Nombramiento
      "nombramiento-gerente": (dto) => {
        dto.nombramiento.nombramientoGerenteGeneral = true;
      },
      "nombramiento-apoderados": (dto) => {
        dto.nombramiento.nombramientoApoderados = true;
      },
      "nombramiento-directores": (dto) => {
        dto.nombramiento.nombramientoDirectores = true;
      },
      "nombramiento-nuevo-directorio": (dto) => {
        dto.nombramiento.nombramientoNuevoDirectorio = true;
      },
      // Gestión Social y Resultados Económicos
      "pronunciamiento-gestion": (dto) => {
        dto.gestionSocialYResultadosEconomicos.pronunciamientoGestionSocialYResultados = true;
      },
      "aplicacion-resultados": (dto) => {
        dto.gestionSocialYResultadosEconomicos.aplicacionResultados = true;
      },
      "delegacion-auditores": (dto) => {
        dto.gestionSocialYResultadosEconomicos.designacionAuditoresExternos = true;
      },
    };

    // Aplicar el mapeo para cada ID seleccionado
    frontendIds.forEach((id) => {
      const mapper = mapping[id];
      if (mapper) {
        mapper(dto);
      } else {
        console.warn(`[AgendaItemsMapper] ID desconocido del frontend: ${id}`);
      }
    });

    // Agregar esAnualObligatoria si viene
    if (esAnualObligatoria !== undefined) {
      dto.esAnualObligatoria = esAnualObligatoria;
    }

    return dto;
  }

  /**
   * Convierte estructura del backend a IDs del frontend
   * @param dto DTO con la estructura del backend
   * @returns Array de IDs del frontend que están en true
   */
  static dtoToFrontendIds(dto: AgendaItemsDTO): string[] {
    const frontendIds: string[] = [];

    // Mapeo de campos del backend a IDs del frontend
    if (dto.aumentoCapital.aportesDinerarios) {
      frontendIds.push("aporte-dinerarios");
    }
    if (dto.aumentoCapital.aporteNoDinerario) {
      frontendIds.push("aporte-no-dinerario");
    }
    if (dto.aumentoCapital.capitalizacionDeCreditos) {
      frontendIds.push("capitalizacion-creditos");
    }

    if (dto.remocion.remocionGerenteGeneral) {
      frontendIds.push("remocion-gerente");
    }
    if (dto.remocion.remocionApoderados) {
      frontendIds.push("remocion-apoderados");
    }
    if (dto.remocion.remocionDirectores) {
      frontendIds.push("remocion-directores");
    }

    if (dto.nombramiento.nombramientoGerenteGeneral) {
      frontendIds.push("nombramiento-gerente");
    }
    if (dto.nombramiento.nombramientoApoderados) {
      frontendIds.push("nombramiento-apoderados");
    }
    if (dto.nombramiento.nombramientoDirectores) {
      frontendIds.push("nombramiento-directores");
    }
    if (dto.nombramiento.nombramientoNuevoDirectorio) {
      frontendIds.push("nombramiento-nuevo-directorio");
    }

    if (dto.gestionSocialYResultadosEconomicos.pronunciamientoGestionSocialYResultados) {
      frontendIds.push("pronunciamiento-gestion");
    }
    if (dto.gestionSocialYResultadosEconomicos.aplicacionResultados) {
      frontendIds.push("aplicacion-resultados");
    }
    if (dto.gestionSocialYResultadosEconomicos.designacionAuditoresExternos) {
      frontendIds.push("delegacion-auditores");
    }

    return frontendIds;
  }

  /**
   * Convierte la respuesta del backend directamente a DTO
   * (El backend ya devuelve la estructura correcta)
   */
  static backendResponseToDTO(response: any): AgendaItemsDTO {
    // El backend devuelve la estructura exacta que esperamos
    // Solo validamos que tenga la estructura correcta
    if (!response || typeof response !== "object") {
      return createDefaultAgendaItemsDTO();
    }

    return {
      aumentoCapital: {
        aportesDinerarios: Boolean(response.aumentoCapital?.aportesDinerarios ?? false),
        aporteNoDinerario: Boolean(response.aumentoCapital?.aporteNoDinerario ?? false),
        capitalizacionDeCreditos: Boolean(response.aumentoCapital?.capitalizacionDeCreditos ?? false),
      },
      remocion: {
        remocionGerenteGeneral: Boolean(response.remocion?.remocionGerenteGeneral ?? false),
        remocionApoderados: Boolean(response.remocion?.remocionApoderados ?? false),
        remocionDirectores: Boolean(response.remocion?.remocionDirectores ?? false),
      },
      nombramiento: {
        nombramientoGerenteGeneral: Boolean(response.nombramiento?.nombramientoGerenteGeneral ?? false),
        nombramientoApoderados: Boolean(response.nombramiento?.nombramientoApoderados ?? false),
        nombramientoDirectores: Boolean(response.nombramiento?.nombramientoDirectores ?? false),
        nombramientoNuevoDirectorio: Boolean(response.nombramiento?.nombramientoNuevoDirectorio ?? false),
      },
      gestionSocialYResultadosEconomicos: {
        pronunciamientoGestionSocialYResultados: Boolean(
          response.gestionSocialYResultadosEconomicos?.pronunciamientoGestionSocialYResultados ?? false
        ),
        aplicacionResultados: Boolean(
          response.gestionSocialYResultadosEconomicos?.aplicacionResultados ?? false
        ),
        designacionAuditoresExternos: Boolean(
          response.gestionSocialYResultadosEconomicos?.designacionAuditoresExternos ?? false
        ),
      },
      esAnualObligatoria: response.esAnualObligatoria ?? false,
    };
  }
}

