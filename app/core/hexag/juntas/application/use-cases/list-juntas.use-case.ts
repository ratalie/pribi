import type { JuntaResumenDTO } from "../dtos";
import type { JuntaRepository } from "../../domain/ports";

export class ListJuntasUseCase {
  constructor(private readonly repository: JuntaRepository) {}

  async execute(societyId: number): Promise<JuntaResumenDTO[]> {
    return this.repository.list(societyId);
  }
}

