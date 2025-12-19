import type { DesignationDirectorRepository } from "~/core/hexag/juntas/domain/ports/designation-director.repository";
import type { DesignationDirectorResponseDTO } from "../../dtos/designation-director.dto";

/**
 * Use Case para obtener la lista de directores designados
 */
export class GetDesignationDirectorUseCase {
  constructor(private readonly repository: DesignationDirectorRepository) {}

  async execute(societyId: number, flowId: number): Promise<DesignationDirectorResponseDTO[]> {
    return await this.repository.list(societyId, flowId);
  }
}



