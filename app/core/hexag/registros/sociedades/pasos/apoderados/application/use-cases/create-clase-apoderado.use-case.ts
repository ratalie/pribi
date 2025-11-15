import type { ApoderadosRepository, ClaseApoderado } from "../../domain";
import type { ClaseApoderadoDTO } from "../dtos";

export class CreateClaseApoderadoUseCase {
  constructor(private readonly repository: ApoderadosRepository) {}

  execute(profileId: string, payload: ClaseApoderadoDTO): Promise<ClaseApoderado> {
    return this.repository.createClase(profileId, payload);
  }
}


