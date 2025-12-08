import type { VoteEntry } from "./vote-entry.entity";
import type { VoteAgreementType } from "../enums/vote-agreement-type.enum";

/**
 * Entidad: Item de Votación
 * Representa un punto específico a votar dentro de una sesión
 */
export interface VoteItem {
  /** UUID del item */
  id: string;
  
  /** Orden de aparición (0, 1, 2...) */
  orden: number;
  
  /** Título/etiqueta del item */
  label: string;
  
  /** Descripción opcional */
  descripción?: string;
  
  /** 
   * UUID de persona si el voto es sobre una persona específica
   * (opcional, solo para casos como remoción/nombramiento)
   */
  personaId?: string;
  
  /**
   * Tipo de aprobación para este item específico
   * (APROBADO_POR_TODOS = Unanimidad, SOMETIDO_A_VOTACION = Votación formal)
   * ⚠️ IMPORTANTE: Ahora está a nivel de item, no de sesión
   */
  tipoAprobacion?: VoteAgreementType;
  
  /** Array de votos emitidos para este item */
  votos: VoteEntry[];
}

