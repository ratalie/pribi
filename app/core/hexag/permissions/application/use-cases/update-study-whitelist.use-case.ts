import type { PermissionsRepository } from '../../domain/ports/permissions.repository';

/**
 * Caso de uso: Actualizar whitelist de módulos del estudio
 * 
 * Solo disponible para SuperAdmin.
 * Permite habilitar o deshabilitar módulos para un estudio.
 * Si un módulo no está en la whitelist, ningún usuario puede acceder,
 * incluso si su rol lo permite.
 */
export class UpdateStudyWhitelistUseCase {
  constructor(private readonly repository: PermissionsRepository) {}

  /**
   * Ejecuta el caso de uso
   * 
   * @param studyId ID del estudio
   * @param modules Lista de módulos a habilitar
   */
  async execute(studyId: string, modules: string[]): Promise<void> {
    return this.repository.updateStudyWhitelist(studyId, modules);
  }
}






