import type { VoteSession } from "../entities/vote-session.entity";
import { VoteContext } from "../enums/vote-context.enum";

/**
 * Puerto (contrato) para el repositorio de Votaciones
 * 
 * ⚠️ IMPORTANTE: tipoAprobacion ahora está en cada item, no como parámetro separado
 */
export interface VoteRepository {
  /**
   * Obtener sesión de votación por contexto
   */
  getVoteSession(
    societyId: number,
    flowId: number,
    contexto: VoteContext
  ): Promise<VoteSession | null>;

  /**
   * Crear nueva sesión de votación
   */
  createVoteSession(
    societyId: number,
    flowId: number,
    session: VoteSession
  ): Promise<void>;

  /**
   * Actualizar sesión de votación
   * ⚠️ IMPORTANTE: tipoAprobacion ahora está en cada item con accion: 'update'
   */
  updateVoteSession(
    societyId: number,
    flowId: number,
    contexto: VoteContext,
    items: any[] // Array de operaciones (add, update, remove, updateVote)
    // ✅ tipoAprobacion ya no es parámetro separado, está en cada item
  ): Promise<void>;
}

