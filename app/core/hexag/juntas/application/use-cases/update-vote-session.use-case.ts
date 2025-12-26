import type { VoteRepository } from "../../domain/ports/vote.repository.port";
import { VoteContext } from "../../domain/enums/vote-context.enum";

/**
 * Use Case: Actualizar Sesión de Votación
 * 
 * ⚠️ IMPORTANTE: tipoAprobacion ahora está en cada item, no como parámetro separado
 */
export class UpdateVoteSessionUseCase {
  constructor(private repository: VoteRepository) {}

  async execute(
    societyId: number,
    flowId: number,
    contexto: VoteContext,
    items: any[] // Array de operaciones (add, update, remove, updateVote)
    // ✅ tipoAprobacion ya no es parámetro separado, está en cada item
  ): Promise<void> {
    return await this.repository.updateVoteSession(
      societyId,
      flowId,
      contexto,
      items
    );
  }
}

