/**
 * Repositorio MSW para Apoderados
 * 
 * Implementa ApoderadosRepository usando directamente las funciones del state mock.
 * Este repositorio permite:
 * - Tests unitarios sin HTTP
 * - Validación de que ambos repositorios (HTTP y MSW) funcionan igual
 * 
 * @pattern Repository Pattern - MSW Implementation
 */
import type { ApoderadosRepository, Apoderado, ClaseApoderado } from "~/core/hexag/registros/sociedades/pasos/apoderados/domain";
import type { ApoderadoDTO, ClaseApoderadoDTO } from "../../application";
import {
  listClasesMock,
  createClaseMock,
  updateClaseMock,
  deleteClaseMock,
  listApoderadosMock,
  createApoderadoMock,
  updateApoderadoMock,
  deleteApoderadoMock,
} from "../mocks/data/apoderados.state";

export class ApoderadosMswRepository implements ApoderadosRepository {
  async listClases(profileId: string): Promise<ClaseApoderado[]> {
    return await listClasesMock(profileId);
  }

  async createClase(profileId: string, payload: ClaseApoderadoDTO): Promise<void> {
    await createClaseMock(profileId, payload);
    // ⚠️ HTTP repository no retorna la clase creada, solo confirma éxito
  }

  async updateClase(profileId: string, payload: ClaseApoderadoDTO): Promise<void> {
    await updateClaseMock(profileId, payload);
    // ⚠️ HTTP repository no retorna nada, solo confirma éxito
  }

  async deleteClase(profileId: string, claseId: string): Promise<void> {
    await deleteClaseMock(profileId, claseId);
  }

  async listApoderados(profileId: string): Promise<Apoderado[]> {
    return await listApoderadosMock(profileId);
  }

  async createApoderado(profileId: string, payload: ApoderadoDTO): Promise<void> {
    await createApoderadoMock(profileId, payload);
    // ⚠️ HTTP repository no retorna el apoderado creado, solo confirma éxito
  }

  async updateApoderado(profileId: string, payload: ApoderadoDTO): Promise<void> {
    await updateApoderadoMock(profileId, payload);
    // ⚠️ HTTP repository no retorna nada, solo confirma éxito
  }

  async deleteApoderado(profileId: string, apoderadoId: string): Promise<void> {
    await deleteApoderadoMock(profileId, apoderadoId);
  }

  async createGerenteGeneral(profileId: string, payload: ApoderadoDTO): Promise<void> {
    await createApoderadoMock(profileId, payload);
  }

  async updateGerenteGeneral(profileId: string, payload: ApoderadoDTO): Promise<void> {
    await updateApoderadoMock(profileId, payload);
  }
}

