/**
 * Enum de Códigos de Flujo
 * 
 * Representa los flujos disponibles en el sistema.
 * Cada flujo corresponde a un proceso de negocio específico.
 */
export enum FlowCodeEnum {
  /** Datos Generales (Registro de Sociedades) */
  SOCIETY_PROFILE = 'SOCIETY_PROFILE',
  
  /** Aporte Dinerario */
  AUMENTO_DINERARIO = 'AUMENTO_DINERARIO',
  
  /** Capitalización de Créditos */
  CAPITALIZACION_CREDITOS = 'CAPITALIZACION_CREDITOS',
  
  /** Designar Directores */
  DESIGNAR_DIRECTORES = 'DESIGNAR_DIRECTORES',
  
  /** Designar Gerente y/o Apoderados */
  DESIGNAR_GERENTE = 'DESIGNAR_GERENTE',
  
  /** Estados Financieros y Reparto de Dividendos */
  ESTADOS_FINANCIEROS = 'ESTADOS_FINANCIEROS',
  
  /** SUNAT */
  SUNAT = 'SUNAT',
  
  /** Archivos */
  ARCHIVES = 'ARCHIVES',
  
  /** Flujos Compartidos */
  SHARED_FLOW = 'SHARED_FLOW',
}

/**
 * Nombres legibles de los flujos
 */
export const FlowCodeDisplayNames: Record<FlowCodeEnum, string> = {
  [FlowCodeEnum.SOCIETY_PROFILE]: 'Datos Generales',
  [FlowCodeEnum.AUMENTO_DINERARIO]: 'Aporte Dinerario',
  [FlowCodeEnum.CAPITALIZACION_CREDITOS]: 'Capitalización de Créditos',
  [FlowCodeEnum.DESIGNAR_DIRECTORES]: 'Designar Directores',
  [FlowCodeEnum.DESIGNAR_GERENTE]: 'Designar Gerente y/o Apoderados',
  [FlowCodeEnum.ESTADOS_FINANCIEROS]: 'Estados Financieros y Reparto de Dividendos',
  [FlowCodeEnum.SUNAT]: 'SUNAT',
  [FlowCodeEnum.ARCHIVES]: 'Archivos',
  [FlowCodeEnum.SHARED_FLOW]: 'Flujos Compartidos',
};








