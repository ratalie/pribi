import type { QuorumDTO } from "../../application";
import type { QuorumConfig } from "../entities/quorum.entity";

export interface QuorumRepository {
  get(societyProfileId: string): Promise<QuorumConfig | null>;
  create(societyProfileId: string, payload: QuorumDTO): Promise<QuorumConfig>;
  update(societyProfileId: string, payload: QuorumDTO): Promise<QuorumConfig>;
}

