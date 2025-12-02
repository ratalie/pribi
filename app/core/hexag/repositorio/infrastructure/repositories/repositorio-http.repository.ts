import type { RepositorioRepository } from '../../domain/ports/repositorio.repository';
import type { RepositorioStats } from '../../domain/entities/repositorio-stats.entity';
import type { Metricas } from '../../domain/entities/metricas.entity';
import type { Sociedad } from '../../domain/entities/sociedad.entity';
import type { SearchResultDTO } from '../../application/dtos/search-query.dto';
import { withAuthHeaders } from '~/lib/api-client';

/**
 * Repositorio HTTP para el módulo Repositorio
 * Implementa RepositorioRepository usando llamadas HTTP reales
 */
export class RepositorioHttpRepository implements RepositorioRepository {
  async getStats(sociedadId: string): Promise<RepositorioStats> {
    const response = await $fetch<{ data: RepositorioStats }>(
      `/api/v2/repositorio/${sociedadId}/stats`,
      {
        ...withAuthHeaders(),
        method: 'GET' as const,
      }
    );
    return response.data;
  }

  async getMetricas(sociedadId: string): Promise<Metricas> {
    const response = await $fetch<{ data: Metricas }>(
      `/api/v2/repositorio/${sociedadId}/metricas`,
      {
        ...withAuthHeaders(),
        method: 'GET' as const,
      }
    );
    return response.data;
  }

  async listSociedades(): Promise<Sociedad[]> {
    const response = await $fetch<{ data: Sociedad[] }>('/api/v2/repositorio/sociedades', {
      ...withAuthHeaders(),
      method: 'GET' as const,
    });
    return response.data;
  }

  async searchGlobal(sociedadId: string, query: string): Promise<SearchResultDTO[]> {
    const response = await $fetch<{ data: SearchResultDTO[] }>(
      `/api/v2/repositorio/${sociedadId}/search`,
      {
        ...withAuthHeaders(),
        method: 'POST' as const,
        body: { query },
      }
    );
    return response.data;
  }
}

