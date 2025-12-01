import type { ApoderadosRepository, ClaseApoderadoPayload } from "../../domain";

export class CreateClaseApoderadoUseCase {
  constructor(private readonly repository: ApoderadosRepository) {}

  execute(profileId: string, payload: ClaseApoderadoPayload): Promise<void> {
    return this.repository.createClase(profileId, payload);
  }
}
