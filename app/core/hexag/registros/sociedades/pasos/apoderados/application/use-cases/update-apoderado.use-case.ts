import type { ApoderadoPayload, ApoderadosRepository } from "../../domain";

export class UpdateApoderadoUseCase {
  constructor(private readonly repository: ApoderadosRepository) {}

  execute(profileId: string, payload: ApoderadoPayload): Promise<void> {
    return this.repository.updateApoderado(profileId, payload);
  }
}
