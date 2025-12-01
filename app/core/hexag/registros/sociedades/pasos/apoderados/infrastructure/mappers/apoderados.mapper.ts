import type { ApoderadoDTO } from "../../application";
import type { ApoderadoResponseDTO } from "../../application/dtos/apoderado-response.dto";
import type { Apoderado, ApoderadoPayload } from "../../domain";

export class ApoderadosMapper {
  static deListaRespuestaADominio(response: ApoderadoResponseDTO[]): Apoderado[] {
    return response.map((item) => ({
      id: item.id,
      claseApoderadoId: item.claseApoderadoId,
      persona: item.persona,
    }));
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
