/**
 * Types específicos para la vista de Historial de Juntas
 */

import type { Estado } from "~/core/presentation/shared/types/estado.types";

export interface EstadoJunta extends Estado {
  isEnProceso?: boolean;
}

export interface HistorialTableAction {
  id: string;
  label: string;
  icon: string;
  handler: (juntaId: string, societyId: number) => void | Promise<void>;
  destructive?: boolean;
}




