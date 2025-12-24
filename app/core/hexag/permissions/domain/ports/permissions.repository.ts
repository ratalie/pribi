import type { AccessArea } from '../entities/access-area.entity';
import type { UserOverride } from '../entities/user-override.entity';

/**
 * Puerto (contrato) para el repositorio de permisos
 * 
 * Define qué necesita el dominio sin especificar cómo se implementa.
 * Permite intercambiar fácilmente entre implementaciones (HTTP, MSW, etc.).
 */
export interface PermissionsRepository {
  /**
   * Obtiene el árbol de permisos efectivos de un usuario
   * Solo muestra permisos habilitados (árbol V2 filtrado)
   * 
   * @param userId ID del usuario
   * @returns Árbol de permisos (áreas → rutas → módulos → acciones)
   */
  getUserAccess(userId: string): Promise<AccessArea[]>;

  /**
   * Obtiene los accesos completos de un usuario (incluye deshabilitados)
   * Incluye status: true/false para cada permiso
   * Útil para el editor de permisos
   * 
   * @param userId ID del usuario
   * @returns Árbol de permisos completo con estados
   */
  getUserAccessFull(userId: string): Promise<AccessArea[]>;

  /**
   * Obtiene mis propios permisos (usuario autenticado)
   * 
   * @returns Árbol de permisos del usuario actual
   */
  getMyAccess(): Promise<AccessArea[]>;

  /**
   * Actualiza los overrides de permisos de un usuario
   * 
   * @param userId ID del usuario
   * @param overrides Overrides a aplicar (puede ser UserOverride[] o formato DTO directo)
   */
  updateUserOverrides(
    userId: string,
    overrides: UserOverride[] | { overrides: any[] },
  ): Promise<void>;

  /**
   * Obtiene la whitelist de módulos del estudio
   * 
   * @param studyId ID del estudio
   * @returns Lista de módulos habilitados
   */
  getStudyWhitelist(studyId: string): Promise<string[]>;

  /**
   * Actualiza la whitelist de módulos del estudio
   * Solo disponible para SuperAdmin
   * 
   * @param studyId ID del estudio
   * @param modules Lista de módulos a habilitar
   */
  updateStudyWhitelist(studyId: string, modules: string[]): Promise<void>;
}




