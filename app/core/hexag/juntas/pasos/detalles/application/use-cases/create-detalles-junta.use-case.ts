/**
 * Use Case: Crear Detalles de Junta
 */

import type { DetallesJuntaRepositoryPort } from "../../domain/ports/detalles-junta.repository.port";
import type { DetallesJuntaEntity } from "../../domain/entities/detalles-junta.entity";
import type { CreateDetallesJuntaDTO } from "../dtos/create-detalles-junta.dto";

export class CreateDetallesJuntaUseCase {
  constructor(private repository: DetallesJuntaRepositoryPort) {}

  async execute(juntaId: string, data: CreateDetallesJuntaDTO): Promise<DetallesJuntaEntity> {
    this.validate(data);
    return await this.repository.create(juntaId, data);
  }

  private validate(data: CreateDetallesJuntaDTO): void {
    if (!data.tipoJunta) {
      throw new Error("El tipo de junta es requerido");
    }

    if (!data.modoRealizacion) {
      throw new Error("El modo de realización es requerido");
    }

    if (!data.fechaJunta) {
      throw new Error("La fecha de junta es requerida");
    }

    if (!data.horaJunta) {
      throw new Error("La hora de junta es requerida");
    }

    // Validar modo virtual requiere enlace
    if (data.modoRealizacion === "VIRTUAL" && !data.enlaceVirtual) {
      throw new Error("El modo virtual requiere un enlace de reunión");
    }

    // Validar modo presencial o mixto requiere lugar
    if ((data.modoRealizacion === "PRESENCIAL" || data.modoRealizacion === "MIXTA") && !data.lugarJunta) {
      throw new Error("El modo presencial o mixto requiere un lugar");
    }
  }
}


