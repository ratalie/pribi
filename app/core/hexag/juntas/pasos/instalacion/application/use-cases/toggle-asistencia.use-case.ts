/**
 * Use Case: Toggle Asistencia
 */

import type { AsistenciaRepositoryPort } from "../../domain/ports/asistencia.repository.port";
import type { AsistenciaEntity } from "../../domain/entities/asistencia.entity";

export class ToggleAsistenciaUseCase {
  constructor(private repository: AsistenciaRepositoryPort) {}

  async execute(asistenciaId: string): Promise<AsistenciaEntity> {
    if (!asistenciaId || asistenciaId.trim() === "") {
      throw new Error("El ID de asistencia es requerido");
    }

    return await this.repository.toggleAsistencia(asistenciaId);
  }
}


