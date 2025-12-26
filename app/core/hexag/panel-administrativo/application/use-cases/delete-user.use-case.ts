import type { UserRepository } from '../../domain/ports/user.repository';

/**
 * Caso de uso: Eliminar (desactivar) un usuario
 */
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('El ID del usuario es requerido');
    }

    await this.userRepository.deleteUser(userId);
  }
}



