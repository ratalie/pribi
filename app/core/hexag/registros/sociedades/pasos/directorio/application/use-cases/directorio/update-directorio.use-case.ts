import type { DirectorioDTO } from "~/core/hexag/registros/sociedades/pasos/directorio/application/dtos/directorio.dto";
import type { DirectorioConfig, DirectorioRepository } from "~/core/hexag/registros/sociedades/pasos/directorio/domain";

export class UpdateDirectorioUseCase {
  constructor(private readonly repository: DirectorioRepository) {}

  execute(societyProfileId: string, payload: DirectorioDTO): Promise<DirectorioConfig> {
    return this.repository.update(societyProfileId, payload);
  }
}