import type { UserRepository } from '../../domain/ports/user.repository';
import type { User } from '../../domain/entities/user.entity';

/**
 * Caso de uso: Actualizar estado (activo/inactivo) de un usuario
 */
export class UpdateUserStatusUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    userId: string,
    status: boolean
  ): Promise<User> {
    if (!userId) {
      throw new Error('El ID del usuario es requerido');
    }

    return await this.userRepository.updateUserStatus(userId, status);
  }
}



