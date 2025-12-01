import type { UserRepository } from '../../domain/ports/user.repository';
import type { User } from '../../domain/entities/user.entity';

/**
 * Caso de uso: Obtener todos los usuarios
 */
export class GetUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}

