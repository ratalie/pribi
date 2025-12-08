import type { UserRepository } from '../../domain/ports/user.repository';

/**
 * Caso de uso: Actualizar permisos de rutas de un usuario
 */
export class UpdateUserRoutePermissionsUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    userId: string,
    routePermissions: string[]
  ): Promise<string[]> {
    return await this.userRepository.updateUserRoutePermissions(
      userId,
      routePermissions
    );
  }
}

