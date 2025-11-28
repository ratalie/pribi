import type { DirectorConfig } from "../../../domain/entities/director.entity";
import type { DirectorRepository } from "../../../domain/ports/director.repositorio";

export class GetDirectorUseCase {
  constructor(private readonly repository: DirectorRepository) {}

  async execute(societyProfileId: string): Promise<DirectorConfig[]| null> {
    return await this.repository.get(societyProfileId);
  }
}
