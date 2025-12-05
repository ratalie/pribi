import type { AsignacionAccionDTO } from "../../application/dtos/asignacion-accion.dto";
import type { AsignacionAccion } from "../entities/asignacion-accion.entity";

export interface AsignacionAccionRepository {
  get(societyProfileId: string): Promise<AsignacionAccion[]>;
  create(societyProfileId: string, payload: AsignacionAccionDTO): Promise<AsignacionAccion>;
  update(
    societyProfileId: string,
    asignacionAccionId: string,
    payload: AsignacionAccionDTO
  ): Promise<AsignacionAccion>;
  delete(societyProfileId: string, asignacionAccionId: string): Promise<void>;
}
