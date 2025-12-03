import type { AsignacionAccion } from "../../domain/entities/asignacion-accion.entity";
import type { AsignacionAccionRepository } from "../../domain/ports/asignacion-accion.repository";

export class GetAsignacionAccionUseCase {
  constructor(private readonly repository: AsignacionAccionRepository) {}

  async execute(societyProfileId: string): Promise<AsignacionAccion[] | null> {
    return await this.repository.get(societyProfileId);
  }
}
