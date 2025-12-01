import type { RepositorioRepository } from '../../domain/ports/repositorio.repository';
import type { SearchQueryDTO, SearchResultDTO } from '../dtos/search-query.dto';

/**
 * Caso de uso: Búsqueda global en el repositorio
 */
export class SearchGlobalUseCase {
  constructor(private readonly repository: RepositorioRepository) {}

  async execute(query: SearchQueryDTO): Promise<SearchResultDTO[]> {
    if (!query.query || query.query.trim().length === 0) {
      return [];
    }

    return this.repository.searchGlobal(query.sociedadId, query.query);
  }
}

