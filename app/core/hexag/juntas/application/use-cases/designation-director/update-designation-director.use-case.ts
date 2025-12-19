import type { DesignationDirectorRepository } from "~/core/hexag/juntas/domain/ports/designation-director.repository";
import type { UpdateDesignationDirectorDTO } from "../../dtos/designation-director.dto";

/**
 * Use Case para actualizar el estado de un director designado
 */
export class UpdateDesignationDirectorUseCase {
  constructor(private readonly repository: DesignationDirectorRepository) {}

  async execute(
    societyId: number,
    flowId: number,
    dto: UpdateDesignationDirectorDTO
  ): Promise<void> {
    await this.repository.update(societyId, flowId, dto);
  }
}

