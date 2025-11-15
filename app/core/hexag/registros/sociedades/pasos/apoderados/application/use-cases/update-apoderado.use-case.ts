import type { ApoderadosRepository, Apoderado } from "../../domain";
import type { ApoderadoDTO } from "../dtos";

export class UpdateApoderadoUseCase {
  constructor(private readonly repository: ApoderadosRepository) {}

  execute(profileId: string, payload: ApoderadoDTO): Promise<Apoderado> {
    return this.repository.updateApoderado(profileId, payload);
  }
}


