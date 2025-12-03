import type { RegimenFacultadesRepository, TipoFacultadPayload } from "../../domain";

export class UpdateTiposFacultadesUseCase {
  constructor(private readonly repository: RegimenFacultadesRepository) {}

  execute(profileId: string, payload: TipoFacultadPayload): Promise<void> {
    return this.repository.updateTipoFacultad(profileId, payload);
  }
}
