import type { UserRepository } from '../../domain/ports/user.repository';
import type { User } from '../../domain/entities/user.entity';

/**
 * Caso de uso: Crear un nuevo usuario
 */
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    email: string,
    password: string,
    roleId: string
  ): Promise<User> {
    // Validaciones básicas
    if (!email || !email.includes('@')) {
      throw new Error('El email es requerido y debe ser válido');
    }

    if (!password || password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    if (!roleId) {
      throw new Error('El rol es requerido');
    }

    return await this.userRepository.createUser(email, password, roleId);
  }
}

