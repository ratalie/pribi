import type { DirectorioConfig, DirectorioRepository } from "../../../domain";

export class GetDirectorioUseCase {
  constructor(private readonly repository: DirectorioRepository) {}

  execute(societyProfileId: string): Promise<DirectorioConfig | null> {
    return this.repository.get(societyProfileId);
  }
}
