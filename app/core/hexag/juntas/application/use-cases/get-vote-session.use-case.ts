import type { VoteRepository } from "../../domain/ports/vote.repository.port";
import type { VoteSession } from "../../domain/entities/vote-session.entity";
import { VoteContext } from "../../domain/enums/vote-context.enum";

/**
 * Use Case: Obtener Sesión de Votación
 */
export class GetVoteSessionUseCase {
  constructor(private repository: VoteRepository) {}

  async execute(
    societyId: number,
    flowId: number,
    contexto: VoteContext
  ): Promise<VoteSession | null> {
    return await this.repository.getVoteSession(societyId, flowId, contexto);
  }
}


