import type { RepositorioRepository } from '../../domain/ports/repositorio.repository';
import type { RepositorioStats } from '../../domain/entities/repositorio-stats.entity';
import type { Metricas } from '../../domain/entities/metricas.entity';
import type { Sociedad } from '../../domain/entities/sociedad.entity';
import type { SearchResultDTO } from '../../application/dtos/search-query.dto';
import {
  getRepositorioStatsMock,
  getMetricasMock,
  listSociedadesMock,
  searchGlobalMock,
} from '../mocks/data/repositorio.state';

/**
 * Repositorio Mock para el módulo Repositorio
 * Implementa RepositorioRepository usando datos mock
 */
export class RepositorioMockRepository implements RepositorioRepository {
  async getStats(sociedadId: string): Promise<RepositorioStats> {
    return getRepositorioStatsMock(sociedadId);
  }

  async getMetricas(sociedadId: string): Promise<Metricas> {
    return getMetricasMock(sociedadId);
  }

  async listSociedades(): Promise<Sociedad[]> {
    return listSociedadesMock();
  }

  async searchGlobal(sociedadId: string, query: string): Promise<SearchResultDTO[]> {
    return searchGlobalMock(sociedadId, query);
  }
}

