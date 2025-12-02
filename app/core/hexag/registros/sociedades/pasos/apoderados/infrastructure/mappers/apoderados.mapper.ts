import type { ApoderadoDTO } from "../../application";
import type { ApoderadoResponseDTO } from "../../application/dtos/apoderado-response.dto";
import type { Apoderado, ApoderadoPayload } from "../../domain";

export class ApoderadosMapper {
  /**
   * Mapea un solo item de respuesta a entidad de dominio
   */
  static deRespuestaADominio(response: ApoderadoResponseDTO): Apoderado {
    return {
      id: response.id,
      claseApoderadoId: response.claseApoderadoId,
      persona: response.persona,
    };
  }

  /**
   * Mapea un array de respuestas a entidades de dominio
   */
  static deListaRespuestaADominio(response: ApoderadoResponseDTO[]): Apoderado[] {
    return response.map((item) => this.deRespuestaADominio(item));
  }

  static deEntityAPayload(entity: Apoderado): ApoderadoPayload {
    return {
      id: entity.id,
      claseApoderadoId: entity.claseApoderadoId,
      persona: entity.persona,
    };
  }

  static dePayloadABackend(payload: ApoderadoPayload): ApoderadoDTO {
    return {
      id: payload.id,
      claseApoderadoId: payload.claseApoderadoId,
      persona: payload.persona,
    };
  }
}
