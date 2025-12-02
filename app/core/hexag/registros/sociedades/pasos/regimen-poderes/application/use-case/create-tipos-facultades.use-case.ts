import type { RegimenFacultadesRepository, TipoFacultadPayload } from "../../domain";

export class CreateTiposFacultadesUseCase {
  constructor(private readonly repository: RegimenFacultadesRepository) {}

  execute(profileId: string, payload: TipoFacultadPayload): Promise<void> {
    return this.repository.createTipoFacultad(profileId, payload);
  }
}
