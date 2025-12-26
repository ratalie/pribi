/**
 * Repositorio MSW para Quórums
 * 
 * Implementa QuorumRepository usando directamente las funciones del state mock.
 * Este repositorio permite:
 * - Tests unitarios sin HTTP
 * - Validación de que ambos repositorios (HTTP y MSW) funcionan igual
 * 
 * @pattern Repository Pattern - MSW Implementation
 */
import type { QuorumRepository, QuorumConfig } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/domain";
import type { QuorumDTO } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/application/dtos/quorum.dto";
import {
  getQuorumMock,
  createQuorumMock,
  updateQuorumMock,
} from "../mocks/data/quorum.state";

export class QuorumMswRepository implements QuorumRepository {
  async get(societyProfileId: string): Promise<QuorumConfig | null> {
    return await getQuorumMock(societyProfileId);
  }

  async create(societyProfileId: string, payload: QuorumDTO): Promise<QuorumConfig> {
    return await createQuorumMock(societyProfileId, payload);
  }

  async update(societyProfileId: string, payload: QuorumDTO): Promise<QuorumConfig> {
    return await updateQuorumMock(societyProfileId, payload);
  }
}

