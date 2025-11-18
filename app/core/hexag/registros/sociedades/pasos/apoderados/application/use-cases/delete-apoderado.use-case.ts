import type { ApoderadosRepository } from "../../domain";

export class DeleteApoderadoUseCase {
  constructor(private readonly repository: ApoderadosRepository) {}

  execute(profileId: string, claseId: string, apoderadoId: string): Promise<void> {
    return this.repository.deleteApoderado(profileId, claseId, apoderadoId);
  }
}


