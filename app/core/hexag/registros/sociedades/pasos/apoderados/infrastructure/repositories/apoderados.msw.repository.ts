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
import type { ApoderadoDTO, ClaseApoderadoDTO } from "~/core/hexag/registros/sociedades/pasos/apoderados/application/dtos";
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

  async createClase(profileId: string, payload: ClaseApoderadoDTO): Promise<ClaseApoderado> {
    return await createClaseMock(profileId, payload);
  }

  async updateClase(profileId: string, payload: ClaseApoderadoDTO): Promise<ClaseApoderado> {
    return await updateClaseMock(profileId, payload);
  }

  async deleteClase(profileId: string, claseId: string): Promise<void> {
    await deleteClaseMock(profileId, claseId);
  }

  async listApoderados(profileId: string): Promise<Apoderado[]> {
    return await listApoderadosMock(profileId);
  }

  async createApoderado(profileId: string, payload: ApoderadoDTO): Promise<Apoderado> {
    return await createApoderadoMock(profileId, payload);
  }

  async updateApoderado(profileId: string, payload: ApoderadoDTO): Promise<Apoderado> {
    return await updateApoderadoMock(profileId, payload);
  }

  async deleteApoderado(profileId: string, claseId: string, apoderadoId: string): Promise<void> {
    await deleteApoderadoMock(profileId, apoderadoId);
  }
}

