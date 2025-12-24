import type { PermissionsRepository } from '../../domain/ports/permissions.repository';
import type { UserOverride } from '../../domain/entities/user-override.entity';

/**
 * Caso de uso: Actualizar overrides de permisos de un usuario
 * 
 * Permite agregar o quitar permisos específicos a un usuario.
 * Los overrides se aplican sobre los permisos base del rol.
 */
export class UpdateUserOverridesUseCase {
  constructor(private readonly repository: PermissionsRepository) {}

  /**
   * Ejecuta el caso de uso
   * 
   * @param userId ID del usuario
   * @param overrides Overrides a aplicar
   */
  async execute(userId: string, overrides: UserOverride[]): Promise<void> {
    return this.repository.updateUserOverrides(userId, overrides);
  }
}




