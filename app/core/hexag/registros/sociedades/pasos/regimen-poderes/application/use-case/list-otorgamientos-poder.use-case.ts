import type { RegimenFacultadesRepository } from "../../domain";
import type { OtorgamientoPoderResponseDTO } from "../dtos/otorgamiento-poderes/response.dto";

export class ListOtorgamientosPoderUseCase {
  constructor(private readonly repository: RegimenFacultadesRepository) {}

  execute(profileId: string): Promise<OtorgamientoPoderResponseDTO[]> {
    return this.repository.listOtorgamientosPoder(profileId);
  }
}
