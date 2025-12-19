import type { DesignationDirectorRepository } from "~/core/hexag/juntas/domain/ports/designation-director.repository";
import type { CreateDesignationDirectorDTO } from "../../dtos/designation-director.dto";

/**
 * Use Case para crear un nuevo director designado
 */
export class CreateDesignationDirectorUseCase {
  constructor(private readonly repository: DesignationDirectorRepository) {}

  async execute(
    societyId: number,
    flowId: number,
    dto: CreateDesignationDirectorDTO
  ): Promise<void> {
    await this.repository.create(societyId, flowId, dto);
  }
}




