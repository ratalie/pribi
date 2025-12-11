import type { RegimenFacultadesRepository } from "../../domain";

export class DeleteOtorgamientoPoderUseCase {
  constructor(private readonly repository: RegimenFacultadesRepository) {}

  execute(profileId: string, ids: string[]): Promise<void> {
    return this.repository.deleteOtorgamientoPoder(profileId, ids);
  }
}

