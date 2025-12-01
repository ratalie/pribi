/**
 * Repositorio MSW para Directores
 * 
 * Implementa DirectorRepository usando directamente las funciones del state mock.
 * Este repositorio permite:
 * - Tests unitarios sin HTTP
 * - Validación de que ambos repositorios (HTTP y MSW) funcionan igual
 * 
 * @pattern Repository Pattern - MSW Implementation
 */
import type { DirectorDTO } from "~/core/hexag/registros/sociedades/pasos/directorio/application/dtos/director.dto";
import type { DirectorConfig, DirectorRepository } from "~/core/hexag/registros/sociedades/pasos/directorio/domain";
import {
  listDirectoresMock,
  createDirectorMock,
  updateDirectorMock,
  deleteDirectoresMock,
} from "../mocks/data/directores.state";

export class DirectorMswRepository implements DirectorRepository {
  async get(societyProfileId: string): Promise<DirectorConfig[]> {
    return await listDirectoresMock(societyProfileId);
  }

  async create(societyProfileId: string, payload: DirectorDTO): Promise<DirectorConfig> {
    return await createDirectorMock(societyProfileId, payload);
  }

  async update(
    societyProfileId: string,
    directorId: string,
    payload: DirectorDTO
  ): Promise<DirectorConfig> {
    return await updateDirectorMock(societyProfileId, directorId, payload);
  }

  async delete(societyProfileId: string, directorId: string): Promise<void> {
    const deleted = await deleteDirectoresMock(societyProfileId, [directorId]);
    if (!deleted) {
      throw new Error(`Director con id ${directorId} no encontrado`);
    }
  }
}

