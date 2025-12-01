import type { ApoderadosRepository } from "../../domain";

export class DeleteApoderadoUseCase {
  constructor(private readonly repository: ApoderadosRepository) {}

  execute(profileId: string, apoderadoId: string): Promise<void> {
    return this.repository.deleteApoderado(profileId, apoderadoId);
  }
}
