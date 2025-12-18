import type { DesignationAttorneyRepository } from "~/core/hexag/juntas/domain/ports/designation-attorney.repository";

/**
 * Use Case para eliminar un apoderado designado
 */
export class DeleteDesignationAttorneyUseCase {
  constructor(private readonly repository: DesignationAttorneyRepository) {}

  async execute(societyId: number, flowId: number, designationId: string): Promise<void> {
    await this.repository.delete(societyId, flowId, designationId);
  }
}
