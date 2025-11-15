import type { ApoderadosRepository, Apoderado } from "../../domain";

export class ListApoderadosUseCase {
  constructor(private readonly repository: ApoderadosRepository) {}

  execute(profileId: string): Promise<Apoderado[]> {
    return this.repository.listApoderados(profileId);
  }
}


