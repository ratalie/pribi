import type { Apoderado } from "../entities/apoderado.entity";
import type { ClaseApoderado } from "../entities/clase-apoderado.entity";
import type { ApoderadoDTO, ClaseApoderadoDTO } from "../../application/dtos";

export interface ApoderadosRepository {
  listClases(profileId: string): Promise<ClaseApoderado[]>;
  createClase(profileId: string, payload: ClaseApoderadoDTO): Promise<ClaseApoderado>;
  updateClase(profileId: string, payload: ClaseApoderadoDTO): Promise<ClaseApoderado>;
  deleteClase(profileId: string, claseId: string): Promise<void>;

  listApoderados(profileId: string): Promise<Apoderado[]>;
  createApoderado(profileId: string, payload: ApoderadoDTO): Promise<Apoderado>;
  updateApoderado(profileId: string, payload: ApoderadoDTO): Promise<Apoderado>;
  deleteApoderado(profileId: string, claseId: string, apoderadoId: string): Promise<void>;
}


