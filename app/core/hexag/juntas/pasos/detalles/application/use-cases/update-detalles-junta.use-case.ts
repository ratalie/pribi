/**
 * Use Case: Actualizar Detalles de Junta
 */

import type { DetallesJuntaRepositoryPort } from "../../domain/ports/detalles-junta.repository.port";
import type { DetallesJuntaEntity } from "../../domain/entities/detalles-junta.entity";
import type { CreateDetallesJuntaDTO } from "../dtos/create-detalles-junta.dto";

export class UpdateDetallesJuntaUseCase {
  constructor(private repository: DetallesJuntaRepositoryPort) {}

  async execute(id: string, data: Partial<CreateDetallesJuntaDTO>): Promise<DetallesJuntaEntity> {
    if (!id || id.trim() === "") {
      throw new Error("El ID es requerido");
    }

    return await this.repository.update(id, data);
  }
}


