import type { ApoderadoPayload, ApoderadosRepository } from "../../domain";

export class CreateApoderadoUseCase {
  constructor(private readonly repository: ApoderadosRepository) {}

  execute(profileId: string, payload: ApoderadoPayload): Promise<void> {
    return this.repository.createApoderado(profileId, payload);
  }
}
