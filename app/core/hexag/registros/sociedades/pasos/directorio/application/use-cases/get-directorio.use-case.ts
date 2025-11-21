import type { DirectorioRepository, DirectorioConfig } from "../../domain";

export class GetDirectorioUseCase {
  constructor(private readonly repository: DirectorioRepository) {}

  execute(societyProfileId: string): Promise<DirectorioConfig | null> {
    return this.repository.get(societyProfileId);
  }
}