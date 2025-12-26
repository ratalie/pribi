/**
 * Types específicos para la vista de Historial de Sociedades
 * Tipos UI que no están en el dominio hexagonal
 */

import type { Estado } from "~/core/presentation/shared/types/estado.types";

export interface HistorialTableAction {
  id: string;
  label: string;
  icon: string;
  handler: (sociedadId: string) => void | Promise<void>;
  destructive?: boolean;
}

export interface EstadoSociedad extends Estado {
  // Extiende Estado de shared, específico para sociedades
}

