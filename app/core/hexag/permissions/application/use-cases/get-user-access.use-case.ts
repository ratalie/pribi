import type { PermissionsRepository } from '../../domain/ports/permissions.repository';
import type { AccessArea } from '../../domain/entities/access-area.entity';

/**
 * Caso de uso: Obtener accesos efectivos de un usuario
 * 
 * Obtiene el árbol de permisos de un usuario (solo permisos habilitados).
 * Útil para verificar permisos en tiempo de ejecución.
 */
export class GetUserAccessUseCase {
  constructor(private readonly repository: PermissionsRepository) {}

  /**
   * Ejecuta el caso de uso
   * 
   * @param userId ID del usuario
   * @returns Árbol de permisos (áreas → rutas → módulos → acciones)
   */
  async execute(userId: string): Promise<AccessArea[]> {
    return this.repository.getUserAccess(userId);
  }
}




