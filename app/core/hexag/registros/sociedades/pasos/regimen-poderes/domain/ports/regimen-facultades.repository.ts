import type { TipoFacultad, TipoFacultadPayload } from "..";

export interface RegimenFacultadesRepository {
  listTipoFacultades(profileId: string): Promise<TipoFacultad[]>;
  createTipoFacultad(profileId: string, payload: TipoFacultadPayload): Promise<void>;
  updateTipoFacultad(profileId: string, payload: TipoFacultadPayload): Promise<void>;
  deleteTipoFacultad(profileId: string, tipoFacultadId: string): Promise<void>;
}
