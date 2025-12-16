import type { RemovalAttorneyRepository } from "../../../domain/ports/removal-attorney.repository";
import type { CreateRemovalAttorneyDTO } from "../../dtos/removal-attorney.dto";

/**
 * Caso de uso: Crear Candidato a Remoción de Apoderado
 *
 * Implementa la lógica de negocio para crear
 * un candidato a remoción de apoderado
 */
export class CreateRemovalAttorneyCandidateUseCase {
  constructor(private readonly repository: RemovalAttorneyRepository) {}

  /**
   * Ejecutar: Crear/Actualizar candidato a remoción
   * ✅ PUT hace TODO: crear, actualizar, desmarcar
   */
  async execute(
    societyId: number,
    flowId: number,
    attorneyId: string,
    estado: "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR"
  ): Promise<void> {
    const dto: CreateRemovalAttorneyDTO = {
      attorneyId,
      candidatoEstado: estado,
    };

    return await this.repository.createCandidate(societyId, flowId, dto);
  }
}

