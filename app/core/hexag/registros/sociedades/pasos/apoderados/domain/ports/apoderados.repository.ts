import type { Apoderado, ClaseApoderado, ClaseApoderadoPayload } from "..";
import type { ApoderadoDTO } from "../../application/dtos";

export interface ApoderadosRepository {
  listClases(profileId: string): Promise<ClaseApoderado[]>;
  createClase(profileId: string, payload: ClaseApoderadoPayload): Promise<void>;
  updateClase(profileId: string, payload: ClaseApoderadoPayload): Promise<void>;
  deleteClase(profileId: string, claseId: string): Promise<void>;

  listApoderados(profileId: string): Promise<Apoderado[]>;
  createApoderado(profileId: string, payload: ApoderadoDTO): Promise<Apoderado>;
  updateApoderado(profileId: string, payload: ApoderadoDTO): Promise<Apoderado>;
  deleteApoderado(profileId: string, claseId: string, apoderadoId: string): Promise<void>;
}
