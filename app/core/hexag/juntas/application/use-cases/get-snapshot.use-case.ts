import type { JuntaRepository } from "../../domain/ports";
import type { SnapshotCompleteDTO } from "../dtos/snapshot-complete.dto";

export class GetSnapshotUseCase {
  constructor(private readonly repository: JuntaRepository) {}

  async execute(societyId: number, flowId: number): Promise<SnapshotCompleteDTO> {
    console.log("🟡 [UseCase][GetSnapshot] execute() INICIADO", {
      societyId,
      flowId,
    });
    try {
      const result = await this.repository.getSnapshot(societyId, flowId);
      console.log("✅ [UseCase][GetSnapshot] execute() COMPLETADO exitosamente");
      return result;
    } catch (error) {
      console.error("❌ [UseCase][GetSnapshot] execute() ERROR", error);
      throw error;
    }
  }
}
