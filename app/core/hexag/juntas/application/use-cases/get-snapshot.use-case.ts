import type { SnapshotCompleteDTO } from "../dtos/snapshot-complete.dto";
import type { JuntaRepository } from "../../domain/ports";

export class GetSnapshotUseCase {
  constructor(private readonly repository: JuntaRepository) {}

  async execute(societyId: number, flowId: number): Promise<SnapshotCompleteDTO> {
    return this.repository.getSnapshot(societyId, flowId);
  }
}

