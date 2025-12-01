import type { ClaseApoderadoDTO, ClaseApoderadoResponseDTO } from "../../application";
import type { ClaseApoderado, ClaseApoderadoPayload } from "../../domain";

export class ClasesApoderadosMapper {
  static deListaRespuestaADominio(response: ClaseApoderadoResponseDTO[]): ClaseApoderado[] {
    return response.map((item) => ({
      id: item.id,
      nombre: item.nombre,
    }));
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
