import type { DirectorDTO } from "../../dtos/director.dto";
import type { DirectorConfig } from "../../../domain/entities/director.entity";
import type { DirectorRepository } from "../../../domain/ports/director.repositorio";

export class UpdateDirectorUseCase {
  constructor(private readonly repository: DirectorRepository) {}

  async execute(
    societyProfileId: string,
    directorId: string,
    payload: DirectorDTO
  ): Promise<DirectorConfig> {
    return await this.repository.update(societyProfileId, directorId, payload);
  }
}