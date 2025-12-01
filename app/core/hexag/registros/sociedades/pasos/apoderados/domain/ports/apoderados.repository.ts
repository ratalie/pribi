import type { Apoderado, ApoderadoPayload, ClaseApoderado, ClaseApoderadoPayload } from "..";

export interface ApoderadosRepository {
  listClases(profileId: string): Promise<ClaseApoderado[]>;
  createClase(profileId: string, payload: ClaseApoderadoPayload): Promise<void>;
  updateClase(profileId: string, payload: ClaseApoderadoPayload): Promise<void>;
  deleteClase(profileId: string, claseId: string): Promise<void>;

  listApoderados(profileId: string): Promise<Apoderado[]>;
  createApoderado(profileId: string, payload: ApoderadoPayload): Promise<void>;
  updateApoderado(profileId: string, payload: ApoderadoPayload): Promise<void>;
  deleteApoderado(profileId: string, apoderadoId: string): Promise<void>;

  createGerenteGeneral(profileId: string, payload: ApoderadoPayload): Promise<void>;
  updateGerenteGeneral(profileId: string, payload: ApoderadoPayload): Promise<void>;
}
