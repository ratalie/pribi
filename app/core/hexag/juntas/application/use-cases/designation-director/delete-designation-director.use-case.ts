import type { DesignationDirectorRepository } from "~/core/hexag/juntas/domain/ports/designation-director.repository";

/**
 * Use Case para eliminar un director designado
 */
export class DeleteDesignationDirectorUseCase {
  constructor(private readonly repository: DesignationDirectorRepository) {}

  async execute(societyId: number, flowId: number, designationId: string): Promise<void> {
    await this.repository.delete(societyId, flowId, designationId);
  }
}
