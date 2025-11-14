import type { QuorumDTO } from "../dtos/quorum.dto";
import type { QuorumConfig, QuorumRepository } from "../../domain";

export class CreateQuorumUseCase {
  constructor(private readonly repository: QuorumRepository) {}

  execute(societyProfileId: string, payload: QuorumDTO): Promise<QuorumConfig> {
    return this.repository.create(societyProfileId, payload);
  }
}

