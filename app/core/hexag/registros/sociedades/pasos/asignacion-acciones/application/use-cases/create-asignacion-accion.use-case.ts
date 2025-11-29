import type { AsignacionAccion } from "../../domain/entities/asignacion-accion.entity";
import type { AsignacionAccionRepository } from "../../domain/ports/asignacion-accion.repository";
import type { AsignacionAccionDTO } from "../dtos/asignacion-accion.dto";

export class CreateAsignacionAccionUseCase {
  constructor(private readonly repository: AsignacionAccionRepository) {}

  async execute(
    societyProfileId: string,
    payload: AsignacionAccionDTO
  ): Promise<AsignacionAccion> {
    return await this.repository.create(societyProfileId, payload);
  }
}
