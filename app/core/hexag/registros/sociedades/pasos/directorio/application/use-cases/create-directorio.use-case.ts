import type { DirectorioDTO } from "../dtos/directorio.dto";
import type { DirectorioConfig, DirectorioRepository } from "../../domain";

export class CreateDirectorioUseCase {
  constructor(private readonly repository: DirectorioRepository) {}

  execute(societyProfileId: string, payload: DirectorioDTO): Promise<DirectorioConfig> {
    return this.repository.create(societyProfileId, payload);
  }
}