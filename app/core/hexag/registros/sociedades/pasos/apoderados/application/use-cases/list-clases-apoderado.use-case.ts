import type { ApoderadosRepository, ClaseApoderado } from "../../domain";

export class ListClasesApoderadoUseCase {
  constructor(private readonly repository: ApoderadosRepository) {}

  execute(profileId: string): Promise<ClaseApoderado[]> {
    return this.repository.listClases(profileId);
  }
}


