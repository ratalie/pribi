import type { PermissionsRepository } from '../../domain/ports/permissions.repository';
import type { AccessArea } from '../../domain/entities/access-area.entity';

/**
 * Caso de uso: Obtener accesos completos de un usuario (incluye deshabilitados)
 * 
 * Obtiene el árbol de permisos completo de un usuario, incluyendo permisos
 * deshabilitados. Útil para el editor de permisos donde se necesita mostrar
 * todos los permisos disponibles, no solo los habilitados.
 */
export class GetUserAccessFullUseCase {
  constructor(private readonly repository: PermissionsRepository) {}

  /**
   * Ejecuta el caso de uso
   * 
   * @param userId ID del usuario
   * @returns Árbol de permisos completo con estados (áreas → rutas → módulos → acciones)
   */
  async execute(userId: string): Promise<AccessArea[]> {
    return this.repository.getUserAccessFull(userId);
  }
}




