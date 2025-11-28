import type { JuntaResumenDTO } from "../../application/dtos/junta-resumen.dto";

export interface JuntaRepository {
  create(societyId: number): Promise<string>;
  list(societyId: number): Promise<JuntaResumenDTO[]>;
  delete(societyId: number, flowId: number): Promise<void>;
}

