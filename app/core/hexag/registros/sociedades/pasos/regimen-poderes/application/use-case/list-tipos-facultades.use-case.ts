import type { RegimenFacultadesRepository, TipoFacultad } from "../../domain";

export class ListTiposFacultadesUseCase {
  constructor(private readonly repository: RegimenFacultadesRepository) {}

  execute(profileId: string): Promise<TipoFacultad[]> {
    return this.repository.listTipoFacultades(profileId);
  }
}
