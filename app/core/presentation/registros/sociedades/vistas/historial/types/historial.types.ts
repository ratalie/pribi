/**
 * Types específicos para la vista de Historial de Sociedades
 * Tipos UI que no están en el dominio hexagonal
 */

export interface HistorialTableAction {
  id: string;
  label: string;
  icon: string;
  handler: (sociedadId: string) => void | Promise<void>;
  destructive?: boolean;
}

export interface EstadoSociedad {
  label: string;
  isComplete: boolean;
}

