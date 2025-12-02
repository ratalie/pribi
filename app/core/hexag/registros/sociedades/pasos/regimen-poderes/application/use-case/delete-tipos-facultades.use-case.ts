import type { RegimenFacultadesRepository } from "../../domain";

export class DeleteTiposFacultadesUseCase {
  constructor(private readonly repository: RegimenFacultadesRepository) {}

  execute(profileId: string, tipoFacultadId: string): Promise<void> {
    return this.repository.deleteTipoFacultad(profileId, tipoFacultadId);
  }
}
