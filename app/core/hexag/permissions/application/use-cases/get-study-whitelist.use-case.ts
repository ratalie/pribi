import type { PermissionsRepository } from '../../domain/ports/permissions.repository';

/**
 * Caso de uso: Obtener whitelist de módulos del estudio
 * 
 * Solo disponible para SuperAdmin.
 * La whitelist define qué módulos están habilitados para un estudio.
 */
export class GetStudyWhitelistUseCase {
  constructor(private readonly repository: PermissionsRepository) {}

  /**
   * Ejecuta el caso de uso
   * 
   * @param studyId ID del estudio
   * @returns Lista de módulos habilitados
   */
  async execute(studyId: string): Promise<string[]> {
    return this.repository.getStudyWhitelist(studyId);
  }
}








