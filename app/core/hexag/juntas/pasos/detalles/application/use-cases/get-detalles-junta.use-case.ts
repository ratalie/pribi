/**
 * Use Case: Obtener Detalles de Junta
 */

import type { DetallesJuntaRepositoryPort } from "../../domain/ports/detalles-junta.repository.port";
import type { DetallesJuntaEntity } from "../../domain/entities/detalles-junta.entity";

export class GetDetallesJuntaUseCase {
  constructor(private repository: DetallesJuntaRepositoryPort) {}

  async execute(juntaId: string): Promise<DetallesJuntaEntity | null> {
    if (!juntaId || juntaId.trim() === "") {
      throw new Error("El ID de junta es requerido");
    }

    return await this.repository.getByJuntaId(juntaId);
  }
}


