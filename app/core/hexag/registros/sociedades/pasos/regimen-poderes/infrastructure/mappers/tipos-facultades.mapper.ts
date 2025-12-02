import type { TipoFacultadDTO, TipoFacultadResponseDTO } from "../../application";
import type { TipoFacultad, TipoFacultadPayload } from "../../domain";

export class TiposFacultadesMapper {
  static deListaRespuestaADominio(response: TipoFacultadResponseDTO[]): TipoFacultad[] {
    return response.map((item) => ({
      id: item.id,
      tipoFacultades: item.tipoFacultades,
    }));
  }

  static deEntityAPayload(entity: TipoFacultad): TipoFacultadPayload {
    return {
      id: entity.id,
      tipoFacultades: entity.tipoFacultades,
    };
  }

  static dePayloadABackend(payload: TipoFacultadPayload): TipoFacultadDTO {
    return {
      id: payload.id,
      tipoFacultades: payload.tipoFacultades,
    };
  }
}
