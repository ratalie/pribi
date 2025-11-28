import type { ApoderadoPayload, ApoderadosRepository } from "../../domain";

export class UpdateGerenteGeneralUseCase {
  constructor(private readonly repository: ApoderadosRepository) {}

  execute(profileId: string, payload: ApoderadoPayload): Promise<void> {
    return this.repository.updateGerenteGeneral(profileId, payload);
  }
}
