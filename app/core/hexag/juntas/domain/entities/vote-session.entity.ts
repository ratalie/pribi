import type { VoteItem } from "./vote-item.entity";
import { VoteContext } from "../enums/vote-context.enum";
import { VoteMode } from "../enums/vote-mode.enum";

/**
 * Entidad: Sesión de Votación
 * Representa una sesión completa de votación para un punto de agenda
 * 
 * ⚠️ IMPORTANTE: `tipoAprobacion` ahora está en cada `VoteItem`, no en la sesión
 */
export interface VoteSession {
  /** UUID de la sesión de votación */
  id: string;
  
  /** Contexto de la votación (qué punto de agenda) */
  contexto: VoteContext;
  
  /** Modo de votación (SIMPLE o CUMULATIVO) */
  modo: VoteMode;
  
  /** Array de items a votar */
  items: VoteItem[];
}

