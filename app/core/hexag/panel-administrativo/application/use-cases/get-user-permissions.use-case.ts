import type { UserRepository } from '../../domain/ports/user.repository';
import type { UserFlowAccess } from '../../domain/entities/permission.entity';

/**
 * Caso de uso: Obtener permisos de un usuario
 */
export class GetUserPermissionsUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<UserFlowAccess[]> {
    return await this.userRepository.getUserPermissions(userId);
  }
}

