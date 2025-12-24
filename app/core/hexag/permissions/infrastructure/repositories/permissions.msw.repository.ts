import type { PermissionsRepository } from '../../domain/ports/permissions.repository';
import type { AccessArea } from '../../domain/entities/access-area.entity';
import type { UserOverride } from '../../domain/entities/user-override.entity';
import {
  getUserAccessMock,
  getUserAccessFullMock,
  getMyAccessMock,
  updateUserOverridesMock,
  getStudyWhitelistMock,
  updateStudyWhitelistMock,
} from '../mocks/data/permissions.state';

/**
 * Implementación MSW del repositorio de permisos
 * 
 * Usa mocks en memoria para desarrollo sin backend.
 */
export class PermissionsMswRepository implements PermissionsRepository {
  /**
   * Obtiene los accesos efectivos de un usuario (árbol V2 filtrado)
   */
  async getUserAccess(userId: string): Promise<AccessArea[]> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getUserAccessMock(userId);
  }

  /**
   * Obtiene los accesos completos de un usuario (incluye deshabilitados)
   */
  async getUserAccessFull(userId: string): Promise<AccessArea[]> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getUserAccessFullMock(userId);
  }

  /**
   * Obtiene mis propios accesos efectivos
   */
  async getMyAccess(): Promise<AccessArea[]> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getMyAccessMock();
  }

  /**
   * Actualiza los overrides de permisos de un usuario
   */
  async updateUserOverrides(userId: string, overrides: UserOverride[]): Promise<void> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateUserOverridesMock(userId, overrides);
  }

  /**
   * Obtiene la whitelist de módulos del estudio
   */
  async getStudyWhitelist(studyId: string): Promise<string[]> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 200));
    return getStudyWhitelistMock(studyId);
  }

  /**
   * Actualiza la whitelist de módulos del estudio
   */
  async updateStudyWhitelist(studyId: string, modules: string[]): Promise<void> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateStudyWhitelistMock(studyId, modules);
  }
}






