/**
 * Repositorio MSW para Juntas de Accionistas
 *
 * Implementa JuntaRepository usando directamente las funciones del state mock.
 * Este repositorio permite:
 * - Tests unitarios sin HTTP
 * - Validación de que ambos repositorios (HTTP y MSW) funcionan igual
 *
 * @pattern Repository Pattern - MSW Implementation
 */
import type { JuntaRepository } from "../../domain/ports/junta.repository";
import type { JuntaResumenDTO, SnapshotCompleteDTO } from "../../application/dtos";
import {
  createJuntaMock,
  listJuntasMock,
  deleteJuntaMock,
} from "../mocks/data/juntas.state";
import { getSnapshotMock } from "../mocks/data/snapshot.state";
import { JuntaMapper } from "../mappers/junta.mapper";

export class JuntaMswRepository implements JuntaRepository {
  async create(societyId: number): Promise<string> {
    const junta = await createJuntaMock(societyId);
    return junta.id;
  }

  async list(societyId: number): Promise<JuntaResumenDTO[]> {
    const juntas = await listJuntasMock(societyId);
    return juntas.map((item) =>
      JuntaMapper.toResumenDTO(
        {
          id: item.id,
          estado: item.estado,
          actual: item.actual,
        },
        societyId
      )
    );
  }

  async delete(societyId: number, flowId: number | string): Promise<void> {
    const flowIdStr = typeof flowId === 'string' ? flowId : String(flowId);
    const deleted = await deleteJuntaMock(societyId, flowIdStr);
    if (!deleted) {
      throw new Error(`Junta con id ${flowId} no encontrada`);
    }
  }

  async getSnapshot(societyId: number, flowId: number | string): Promise<SnapshotCompleteDTO> {
    const flowIdNum = typeof flowId === 'string' ? parseInt(flowId, 10) : flowId;
    return await getSnapshotMock(societyId, flowIdNum);
  }
}


