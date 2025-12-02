import type { ClaseApoderadoDTO, ClaseApoderadoResponseDTO } from "../../application";
import type { ClaseApoderado, ClaseApoderadoPayload } from "../../domain";

export class ClasesApoderadosMapper {
  /**
   * Mapea un solo item de respuesta a entidad de dominio
   */
  static deRespuestaADominio(response: ClaseApoderadoResponseDTO): ClaseApoderado {
    return {
      id: response.id,
      nombre: response.nombre,
      // apoderados se obtiene con listApoderados(), no forma parte de ClaseApoderado
    };
  }

  /**
   * Mapea un array de respuestas a entidades de dominio
   */
  static deListaRespuestaADominio(response: ClaseApoderadoResponseDTO[]): ClaseApoderado[] {
    return response.map((item) => this.deRespuestaADominio(item));
  }

  static deEntityAPayload(entity: ClaseApoderado): ClaseApoderadoPayload {
    return {
      id: entity.id,
      nombre: entity.nombre,
    };
  }

  static dePayloadABackend(payload: ClaseApoderadoPayload): ClaseApoderadoDTO {
    return {
      id: payload.id,
      nombre: payload.nombre,
    };
  }
}
