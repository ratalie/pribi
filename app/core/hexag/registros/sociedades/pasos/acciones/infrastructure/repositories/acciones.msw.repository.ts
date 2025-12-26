/**
 * Repositorio MSW para Acciones
 * 
 * Implementa AccionesRepository usando directamente las funciones del state mock.
 * Este repositorio permite:
 * - Tests unitarios sin HTTP
 * - Validación de que ambos repositorios (HTTP y MSW) funcionan igual
 * 
 * @pattern Repository Pattern - MSW Implementation
 */
import type { Accion, AccionPayload, AccionesRepository } from "~/core/hexag/registros/sociedades/pasos/acciones/domain";
import {
  listAccionesMock,
  createAccionMock,
  updateAccionMock,
  deleteAccionesMock,
} from "../mocks/data/acciones.state";

export class AccionesMswRepository implements AccionesRepository {
  async list(profileId: string): Promise<Accion[]> {
    return await listAccionesMock(profileId);
  }

  async create(profileId: string, payload: AccionPayload): Promise<void> {
    await createAccionMock(profileId, payload);
  }

  async update(profileId: string, payload: AccionPayload): Promise<void> {
    await updateAccionMock(profileId, payload);
  }

  async delete(profileId: string, accionIds: string[]): Promise<void> {
    const deleted = await deleteAccionesMock(profileId, accionIds);
    if (!deleted) {
      throw new Error(`Acciones con ids ${accionIds.join(", ")} no encontradas`);
    }
  }
}

