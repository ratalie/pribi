/**
 * Tipos de acciones disponibles en el sistema
 */
export type ActionType = 'read' | 'write' | 'update' | 'delete' | 'file';

/**
 * Códigos de flujos del sistema
 */
export type FlowCode =
  | 'SOCIETY_PROFILE'
  | 'AUMENTO_DINERARIO'
  | 'CAPITALIZACION_CREDITOS'
  | 'DESIGNAR_DIRECTORES'
  | 'DESIGNAR_GERENTE'
  | 'ESTADOS_FINANCIEROS'
  | 'SUNAT'
  | 'ARCHIVES'
  | 'SHARED_FLOW';

/**
 * Permisos de usuario por flujo y módulo
 */
export interface UserFlowAccess {
  code: FlowCode;
  flowName: string;
  modules: {
    name: string;
    displayName: string;
    actions: ActionType[];
  }[];
}

