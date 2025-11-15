import type { ApoderadosRepository, ClaseApoderado } from "../../domain";
import type { ClaseApoderadoDTO } from "../dtos";

export class UpdateClaseApoderadoUseCase {
  constructor(private readonly repository: ApoderadosRepository) {}

  execute(profileId: string, payload: ClaseApoderadoDTO): Promise<ClaseApoderado> {
    return this.repository.updateClase(profileId, payload);
  }
}


