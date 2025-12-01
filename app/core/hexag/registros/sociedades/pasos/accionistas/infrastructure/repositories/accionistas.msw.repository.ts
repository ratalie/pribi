/**
 * Repositorio MSW para Accionistas
 * 
 * Implementa AccionistasRepository usando directamente las funciones del state mock.
 * Este repositorio permite:
 * - Tests unitarios sin HTTP
 * - Validación de que ambos repositorios (HTTP y MSW) funcionan igual
 * 
 * @pattern Repository Pattern - MSW Implementation
 */
import type { AccionistasRepository, Accionista } from "~/core/hexag/registros/sociedades/pasos/accionistas/domain";
import type { AccionistaDTO } from "~/core/hexag/registros/sociedades/pasos/accionistas/application/dtos/accionista.dto";
import {
  listAccionistasMock,
  createAccionistaMock,
  updateAccionistaMock,
  deleteAccionistaMock,
} from "../mocks/data/accionistas.state";

export class AccionistasMswRepository implements AccionistasRepository {
  async list(profileId: string): Promise<Accionista[]> {
    return await listAccionistasMock(profileId);
  }

  async create(profileId: string, payload: AccionistaDTO): Promise<Accionista> {
    return await createAccionistaMock(profileId, payload);
  }

  async update(profileId: string, payload: AccionistaDTO): Promise<Accionista> {
    return await updateAccionistaMock(profileId, payload);
  }

  async delete(profileId: string, accionistaId: string): Promise<void> {
    const deleted = await deleteAccionistaMock(profileId, accionistaId);
    if (!deleted) {
      throw new Error(`Accionista con id ${accionistaId} no encontrado`);
    }
  }
}

