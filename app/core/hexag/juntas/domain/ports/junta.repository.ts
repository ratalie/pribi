import type { JuntaResumenDTO } from "../../application/dtos/junta-resumen.dto";
import type { SnapshotCompleteDTO } from "../../application/dtos/snapshot-complete.dto";

export interface JuntaRepository {
  create(societyId: number): Promise<string>;
  list(societyId: number): Promise<JuntaResumenDTO[]>;
  delete(societyId: number, flowId: number | string): Promise<void>;
  getSnapshot(societyId: number, flowId: number | string): Promise<SnapshotCompleteDTO>;
}

