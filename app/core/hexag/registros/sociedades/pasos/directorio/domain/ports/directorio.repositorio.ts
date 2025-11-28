import type { DirectorioDTO } from "../../application/dtos/directorio.dto";
import type { DirectorioConfig } from "../entities/directorio.entity";

export interface DirectorioRepository {
  get(societyProfileId: string): Promise<DirectorioConfig | null>;
  create(societyProfileId: string, payload: DirectorioDTO): Promise<DirectorioConfig>;
  update(societyProfileId: string, payload: DirectorioDTO): Promise<DirectorioConfig>;
}