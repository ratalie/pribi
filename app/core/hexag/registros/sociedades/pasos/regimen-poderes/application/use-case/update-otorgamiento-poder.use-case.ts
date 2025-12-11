import type {
  RegimenFacultadesRepository,
  UpdateOtorgamientoPoderPayload,
} from "../../domain";

export class UpdateOtorgamientoPoderUseCase {
  constructor(private readonly repository: RegimenFacultadesRepository) {}

  execute(profileId: string, payload: UpdateOtorgamientoPoderPayload): Promise<void> {
    return this.repository.updateOtorgamientoPoder(profileId, payload);
  }
}
