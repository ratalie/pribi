import type { AccessRouteDto } from './access-route.dto';
import type { AccessAreaEnum } from '../../domain/enums/access-area.enum';

/**
 * DTO de AccessArea - Para comunicación con el backend
 * 
 * Representa un área de acceso en el formato que espera el backend.
 */
export interface AccessAreaDto {
  /** Código del área (REGISTROS, OPERACIONES, REPOSITORIO_AI, etc.) */
  area: AccessAreaEnum | string;
  
  /** Nombre legible del área */
  displayName: string;
  
  /** Descripción del área */
  description?: string;
  
  /** Rutas disponibles en esta área */
  routes: AccessRouteDto[];
}




