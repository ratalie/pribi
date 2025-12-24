/**
 * Enum de Áreas de Acceso del Sistema
 * 
 * Representa las secciones principales de la aplicación.
 * Cada área contiene múltiples rutas.
 */
export enum AccessAreaEnum {
  /** Registros de Sociedades */
  REGISTROS = 'REGISTROS',
  
  /** Operaciones (Juntas de Accionistas) */
  OPERACIONES = 'OPERACIONES',
  
  /** Repositorio AI */
  REPOSITORIO_AI = 'REPOSITORIO_AI',
  
  /** SUNAT */
  SUNAT = 'SUNAT',
  
  /** Archivos */
  ARCHIVES = 'ARCHIVES',
}

/**
 * Nombres legibles de las áreas
 */
export const AccessAreaDisplayNames: Record<AccessAreaEnum, string> = {
  [AccessAreaEnum.REGISTROS]: 'Registros',
  [AccessAreaEnum.OPERACIONES]: 'Operaciones',
  [AccessAreaEnum.REPOSITORIO_AI]: 'Repositorio AI',
  [AccessAreaEnum.SUNAT]: 'SUNAT',
  [AccessAreaEnum.ARCHIVES]: 'Archivos',
};

/**
 * Descripciones de las áreas
 */
export const AccessAreaDescriptions: Record<AccessAreaEnum, string> = {
  [AccessAreaEnum.REGISTROS]: 'Gestión de registros de sociedades',
  [AccessAreaEnum.OPERACIONES]: 'Gestión de juntas de accionistas',
  [AccessAreaEnum.REPOSITORIO_AI]: 'Repositorio de documentos con IA',
  [AccessAreaEnum.SUNAT]: 'Integración con SUNAT',
  [AccessAreaEnum.ARCHIVES]: 'Archivos y documentos',
};






