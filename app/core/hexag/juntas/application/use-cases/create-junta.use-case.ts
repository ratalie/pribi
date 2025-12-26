import type { JuntaRepository } from "../../domain/ports";

export class CreateJuntaUseCase {
  constructor(private readonly repository: JuntaRepository) {}

  async execute(societyId: number): Promise<string> {
    return this.repository.create(societyId);
  }
}

