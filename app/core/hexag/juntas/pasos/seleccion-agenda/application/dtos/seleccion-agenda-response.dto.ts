/**
 * DTO: Respuesta de Selección de Agenda
 * 
 * Formato exacto que el backend devuelve (snake_case, fechas como string).
 */

export interface SeleccionAgendaResponseDTO {
  id: string;
  junta_id: string; // Snake case del backend
  puntos_seleccionados: string[];
  created_at: string; // ISO string
  updated_at: string; // ISO string
}


