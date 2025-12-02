import type { ApoderadoPayload, ApoderadosRepository } from "../../domain";

export class CreateGerenteGeneralUseCase {
  constructor(private readonly repository: ApoderadosRepository) {}

  execute(profileId: string, payload: ApoderadoPayload): Promise<void> {
    return this.repository.createGerenteGeneral(profileId, payload);
  }
}
