import type { DirectorRepository } from "../../../domain/ports/director.repositorio";

export class DeleteDirectorUseCase {
  constructor(private readonly repository: DirectorRepository) {}

  async execute(societyProfileId: string, directorId: string): Promise<void> {
    return await this.repository.delete(societyProfileId, directorId);
  }
}
