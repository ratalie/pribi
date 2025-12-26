import type { UserRepository } from '../../domain/ports/user.repository';
import type { SocietyInfo } from '../../domain/entities/society-assignment.entity';

/**
 * Caso de uso: Obtener todas las sociedades disponibles
 */
export class GetAllSocietiesUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<SocietyInfo[]> {
    return await this.userRepository.getAllSocieties();
  }
}

