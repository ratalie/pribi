import type { UserRepository } from '../../domain/ports/user.repository';

/**
 * Caso de uso: Obtener permisos de rutas de un usuario
 */
export class GetUserRoutePermissionsUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<string[]> {
    return await this.userRepository.getUserRoutePermissions(userId);
  }
}

