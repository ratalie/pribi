/**
 * Entidad SocietyAssignment - Representa la asignación de un usuario a sociedades
 * 
 * Según ESPECIFICACION-FINAL-SISTEMA-PERMISOS.md:
 * - Usuario LECTOR: solo puede estar asignado a UNA sociedad (selector)
 * - Usuario NO-LECTOR: puede estar asignado a MÚLTIPLES sociedades (checkboxes)
 */
export interface SocietyAssignment {
  userId: string;
  societyIds: string[]; // Múltiples sociedades para NO-LECTOR, una sola para LECTOR
}

/**
 * Información de sociedad para mostrar en UI
 */
export interface SocietyInfo {
  id: string;
  name: string;
  ruc?: string;
  status: boolean;
}

