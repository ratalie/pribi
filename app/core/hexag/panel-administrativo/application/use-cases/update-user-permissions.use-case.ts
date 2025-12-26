import type { UserRepository } from '../../domain/ports/user.repository';
import type { UserFlowAccess } from '../../domain/entities/permission.entity';

/**
 * Caso de uso: Actualizar permisos de un usuario
 */
export class UpdateUserPermissionsUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    userId: string,
    permissions: UserFlowAccess[]
  ): Promise<UserFlowAccess[]> {
    return await this.userRepository.updateUserPermissions(userId, permissions);
  }
}

