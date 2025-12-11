import type {
  CreateOtorgamientoPoderPayload,
  RegimenFacultadesRepository,
} from "../../domain";

export class CreateOtorgamientoPoderUseCase {
  constructor(private readonly repository: RegimenFacultadesRepository) {}

  execute(profileId: string, payload: CreateOtorgamientoPoderPayload): Promise<void> {
    return this.repository.createOtorgamientoPoder(profileId, payload);
  }
}
