/**
 * DTO: Crear Selección de Agenda
 *
 * Formato que el backend espera para crear/actualizar la selección.
 */

export interface CreateSeleccionAgendaDTO {
  puntosSeleccionados: string[]; // IDs de puntos seleccionados
}

