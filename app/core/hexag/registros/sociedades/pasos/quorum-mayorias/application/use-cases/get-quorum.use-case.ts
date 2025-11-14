import type { QuorumRepository, QuorumConfig } from "../../domain";

export class GetQuorumUseCase {
  constructor(private readonly repository: QuorumRepository) {}

  execute(societyProfileId: string): Promise<QuorumConfig | null> {
    return this.repository.get(societyProfileId);
  }
}

