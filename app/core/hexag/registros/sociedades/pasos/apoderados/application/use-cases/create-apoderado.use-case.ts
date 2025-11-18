import type { ApoderadosRepository, Apoderado } from "../../domain";
import type { ApoderadoDTO } from "../dtos";

export class CreateApoderadoUseCase {
  constructor(private readonly repository: ApoderadosRepository) {}

  execute(profileId: string, payload: ApoderadoDTO): Promise<Apoderado> {
    return this.repository.createApoderado(profileId, payload);
  }
}


