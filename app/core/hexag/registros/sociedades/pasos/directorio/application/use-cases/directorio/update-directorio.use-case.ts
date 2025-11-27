import type { DirectorioDTO } from "../dtos/directorio.dto";
import type { DirectorioConfig, DirectorioRepository } from "../../domain";

export class UpdateDirectorioUseCase {
  constructor(private readonly repository: DirectorioRepository) {}

  execute(societyProfileId: string, payload: DirectorioDTO): Promise<DirectorioConfig> {
    return this.repository.update(societyProfileId, payload);
  }
}