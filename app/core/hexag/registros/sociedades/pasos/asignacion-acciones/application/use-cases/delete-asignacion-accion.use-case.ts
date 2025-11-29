import type { AsignacionAccionRepository } from "../../domain/ports/asignacion-accion.repository";

export class DeleteAsignacionAccionUseCase {
  constructor(private readonly repository: AsignacionAccionRepository) {}

  async execute(societyProfileId: string, asignacionAccionId: string): Promise<void> {
    return await this.repository.delete(societyProfileId, asignacionAccionId);
  }
}
