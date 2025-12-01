import type { ApoderadosRepository, ClaseApoderadoPayload } from "../../domain";

export class UpdateClaseApoderadoUseCase {
  constructor(private readonly repository: ApoderadosRepository) {}

  execute(profileId: string, payload: ClaseApoderadoPayload): Promise<void> {
    return this.repository.updateClase(profileId, payload);
  }
}
