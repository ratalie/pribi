import type { DirectorDTO } from "../../application/dtos/director.dto";
import type { DirectorConfig } from "../entities/director.entity";

export interface DirectorRepository {
  get(societyProfileId: string): Promise<DirectorConfig[]>;
  create(societyProfileId: string, payload: DirectorDTO): Promise<DirectorConfig>;
  update(
    societyProfileId: string,
    directorId: string,
    payload: DirectorDTO
  ): Promise<DirectorConfig>;
}
