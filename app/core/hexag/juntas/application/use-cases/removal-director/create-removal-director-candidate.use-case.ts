import type { RemovalDirectorRepository } from "../../../domain/ports/removal-director.repository";
import type { CreateRemovalDirectorDTO } from "../../dtos/removal-director.dto";

/**
 * Caso de uso: Crear Candidato a Remoción de Director
 *
 * Implementa la lógica de negocio para crear
 * un candidato a remoción de director
 */
export class CreateRemovalDirectorCandidateUseCase {
  constructor(private readonly repository: RemovalDirectorRepository) {}

  /**
   * Ejecutar: Crear/Actualizar candidato a remoción
   * ✅ PUT hace TODO: crear, actualizar, desmarcar
   */
  async execute(
    societyId: number,
    flowId: number,
    directorId: string,
    estado: "CANDIDATO" | "ELEGIDO" | "NO_ELEGIDO" | "DESMARCAR"
  ): Promise<void> {
    const dto: CreateRemovalDirectorDTO = {
      directorId,
      candidatoEstado: estado,
    };

    return await this.repository.createCandidate(societyId, flowId, dto);
  }
}
