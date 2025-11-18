import type { ApoderadosRepository } from "../../domain";

export class DeleteClaseApoderadoUseCase {
  constructor(private readonly repository: ApoderadosRepository) {}

  execute(profileId: string, claseId: string): Promise<void> {
    return this.repository.deleteClase(profileId, claseId);
  }
}


