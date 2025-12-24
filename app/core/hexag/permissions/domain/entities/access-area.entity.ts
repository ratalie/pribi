import type { AccessRoute } from './access-route.entity';
import type { AccessAreaEnum } from '../enums/access-area.enum';

/**
 * Entidad AccessArea - Representa un área de acceso del sistema
 * 
 * Representa una sección principal de la aplicación (REGISTROS, OPERACIONES, etc.)
 * que contiene múltiples rutas.
 * 
 * Ejemplos de áreas: REGISTROS, OPERACIONES, REPOSITORIO_AI, SUNAT, ARCHIVES
 */
export interface AccessArea {
  /** Código del área (REGISTROS, OPERACIONES, REPOSITORIO_AI, etc.) */
  area: AccessAreaEnum;
  
  /** Nombre legible del área */
  displayName: string;
  
  /** Descripción del área */
  description?: string;
  
  /** Rutas disponibles en esta área */
  routes: AccessRoute[];
  
  /** Estado del permiso (solo presente en /access/full) */
  status?: boolean;
}




