import type { JuntaRepository } from "../../domain/ports";

export class DeleteJuntaUseCase {
  constructor(private readonly repository: JuntaRepository) {}

  async execute(societyId: number, flowId: number): Promise<void> {
    await this.repository.delete(societyId, flowId);
  }
}

