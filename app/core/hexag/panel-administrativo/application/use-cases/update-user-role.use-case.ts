import type { UserRepository } from '../../domain/ports/user.repository';
import type { User } from '../../domain/entities/user.entity';

/**
 * Caso de uso: Actualizar rol de un usuario
 */
export class UpdateUserRoleUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    userId: string,
    role: 'lector' | 'editor' | 'admin' | 'user'
  ): Promise<User> {
    return await this.userRepository.updateUserRole(userId, role);
  }
}

