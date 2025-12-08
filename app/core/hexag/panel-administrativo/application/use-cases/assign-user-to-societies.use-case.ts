import type { UserRepository } from '../../domain/ports/user.repository';

/**
 * Caso de uso: Asignar usuario a sociedades
 * 
 * Según ESPECIFICACION-FINAL-SISTEMA-PERMISOS.md:
 * - Usuario LECTOR: solo puede estar asignado a UNA sociedad
 * - Usuario NO-LECTOR: puede estar asignado a MÚLTIPLES sociedades
 */
export class AssignUserToSocietiesUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    userId: string,
    societyIds: string[]
  ): Promise<string[]> {
    // Validación: si el usuario es LECTOR, solo permitir una sociedad
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar si es lector
    const isLector = user.role.name === 'Lector';

    if (isLector && societyIds.length > 1) {
      throw new Error(
        'Los usuarios con rol LECTOR solo pueden estar asignados a una sociedad'
      );
    }

    return await this.userRepository.assignUserToSocieties(userId, societyIds);
  }
}

