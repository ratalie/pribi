/**
 * DTOs para Votaciones
 * Formato exacto que el backend espera y devuelve
 */

/**
 * DTO de Voto Individual (Response del GET)
 *
 * ⚠️ IMPORTANTE: El backend ahora devuelve `accionistaId` (ID del accionista ShareholderV2.id)
 * NO es el ID de la persona (PersonV2.id)
 */
export interface VoteEntryDTO {
  id: string;
  accionistaId: string; // ✅ ID del accionista (ShareholderV2.id) - cambiado de personaId a accionistaId
  valor: string | number; // "A_FAVOR" | "EN_CONTRA" | "ABSTENCION" | number
}

/**
 * DTO de Item de Votación (Request/Response)
 *
 * ⚠️ IMPORTANTE: `tipoAprobacion` ahora está a nivel de item, no de sesión
 */
export interface VoteItemDTO {
  id: string;
  orden: number;
  label: string;
  descripción?: string;
  descripcion?: string; // ⚠️ Backend puede devolver sin tilde
  personaId?: string; // Opcional, solo para votos sobre personas
  tipoAprobacion?: "APROBADO_POR_TODOS" | "SOMETIDO_A_VOTACION"; // ✅ AQUÍ, en el item
  votos: VoteEntryDTO[];
}

/**
 * DTO de Sesión de Votación (Response)
 *
 * ⚠️ IMPORTANTE: `tipoAprobacion` ahora está en cada item, no en la sesión
 */
export interface VoteSessionResponseDTO {
  id: string;
  modo: "SIMPLE" | "CUMULATIVO";
  items: VoteItemDTO[]; // ✅ tipoAprobacion está en cada item
}

/**
 * DTO para Crear Sesión de Votación (Request)
 *
 * ⚠️ IMPORTANTE: `tipoAprobacion` ahora está en cada item, no en el body principal
 */
export interface CreateVoteSessionRequestDTO {
  id: string;
  contexto: string; // "APORTES_DINERARIOS"
  modo: "SIMPLE" | "CUMULATIVO"; // ✅ Aporte dinerario siempre SIMPLE
  items: Array<{
    id: string;
    orden: number;
    label: string;
    descripción?: string;
    personaId?: string; // Opcional, solo para votos sobre personas
    tipoAprobacion?: "APROBADO_POR_TODOS" | "SOMETIDO_A_VOTACION"; // ✅ AQUÍ, en el item
    votos: Array<{
      id: string;
      accionistaId: string; // ✅ ID del accionista (ShareholderV2.id) - cambiado de personaId a accionistaId
      valor: string | number;
    }>;
  }>;
}

/**
 * DTO para Actualizar Sesión de Votación (Request)
 *
 * ⚠️ IMPORTANTE: `tipoAprobacion` ahora está en cada item con `accion: 'update'`
 */
export interface UpdateVoteSessionRequestDTO {
  contexto: string; // "APORTES_DINERARIOS"
  items: Array<{
    accion?: "add" | "update" | "remove" | "updateVote";
    id?: string;
    itemId?: string;
    orden?: number;
    label?: string;
    descripción?: string;
    personaId?: string;
    tipoAprobacion?: "APROBADO_POR_TODOS" | "SOMETIDO_A_VOTACION"; // ✅ AQUÍ, en el item con accion: 'update'
    votos?: Array<{
      accion?: "addVote" | "updateVote" | "removeVote";
      id?: string;
      itemId?: string;
      accionistaId?: string; // ✅ Para addVote: ID del accionista (ShareholderV2.id) - cambiado de voterPersonId a accionistaId
      value?: string | number; // ✅ Para addVote/updateVote: valor del voto
    }>;
  }>;
}
