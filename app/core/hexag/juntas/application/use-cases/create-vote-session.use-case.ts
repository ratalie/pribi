import type { VoteRepository } from "../../domain/ports/vote.repository.port";
import type { VoteSession } from "../../domain/entities/vote-session.entity";

/**
 * Use Case: Crear Sesión de Votación
 */
export class CreateVoteSessionUseCase {
  constructor(private repository: VoteRepository) {}

  async execute(
    societyId: number,
    flowId: number,
    session: VoteSession
  ): Promise<void> {
    return await this.repository.createVoteSession(societyId, flowId, session);
  }
}


