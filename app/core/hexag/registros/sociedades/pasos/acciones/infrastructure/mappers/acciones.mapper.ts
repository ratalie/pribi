import type { AccionResponseDTO } from "../../application/dtos/accion-response.dto";
import type { AccionDTO } from "../../application/dtos/accion.dto";
import type { Accion } from "../../domain/entities/accion.entity";

/**
 * Mapper para transformar entre DTO y Entidad de acciones.
 */
export class AccionesMapper {
  /**
   * Convierte DTO de respuesta GET a Entidad de dominio.
   * @param dto DTO de respuesta del backend
   * @returns Entidad de dominio
   */
  static deRespuestaADominio(_dto: any): Accion {
    // TODO: Implementar mapeo de DTO a Entidad
    return {} as Accion;
  }

  /**
   * Convierte lista de DTOs de respuesta GET a lista de Entidades de dominio.
   * @param dtos Lista de DTOs de respuesta del backend
   * @returns Lista de entidades de dominio
   */
  static deListaRespuestaADominio(_dtos: AccionResponseDTO[]): Accion[] {
    // TODO: Implementar mapeo de lista de DTOs a lista de Entidades
    return [];
  }

  /**
   * Convierte DTO a payload para backend (POST/PUT).
   * @param dto DTO de la acción
   * @returns Payload para enviar al backend
   */
  static aPayloadParaBackend(dto: AccionDTO): AccionDTO {
    // TODO: Implementar mapeo de DTO a payload del backend
    return dto;
  }
}
