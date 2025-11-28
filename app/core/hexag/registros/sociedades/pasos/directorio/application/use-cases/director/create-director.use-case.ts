import type { DirectorDTO } from "../../dtos/director.dto";
import type { DirectorConfig } from "../../../domain/entities/director.entity";
import type { DirectorRepository } from "../../../domain/ports/director.repositorio";

export class CreateDirectorUseCase {
  constructor(private readonly repository: DirectorRepository) {}

  async execute(
    societyProfileId: string,
    payload: DirectorDTO
  ): Promise<DirectorConfig> {
    return await this.repository.create(societyProfileId, payload);
  }
}