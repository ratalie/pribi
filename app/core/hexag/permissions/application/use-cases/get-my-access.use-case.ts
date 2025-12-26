import type { PermissionsRepository } from '../../domain/ports/permissions.repository';
import type { AccessArea } from '../../domain/entities/access-area.entity';

/**
 * Caso de uso: Obtener mis propios accesos efectivos
 * 
 * Obtiene el árbol de permisos del usuario autenticado actual.
 * Útil para verificar permisos en tiempo de ejecución.
 */
export class GetMyAccessUseCase {
  constructor(private readonly repository: PermissionsRepository) {}

  /**
   * Ejecuta el caso de uso
   * 
   * @returns Árbol de permisos del usuario actual (áreas → rutas → módulos → acciones)
   */
  async execute(): Promise<AccessArea[]> {
    return this.repository.getMyAccess();
  }
}




