import type { RepositorioStats } from '../entities/repositorio-stats.entity';
import type { Metricas } from '../entities/metricas.entity';
import type { Sociedad } from '../entities/sociedad.entity';

/**
 * Puerto (contrato) para el repositorio del módulo Repositorio
 */
export interface RepositorioRepository {
  /**
   * Obtiene las estadísticas del repositorio para una sociedad
   */
  getStats(sociedadId: string): Promise<RepositorioStats>;

  /**
   * Obtiene las métricas del dashboard
   */
  getMetricas(sociedadId: string): Promise<Metricas>;

  /**
   * Lista todas las sociedades disponibles
   */
  listSociedades(): Promise<Sociedad[]>;

  /**
   * Busca globalmente en el repositorio
   */
  searchGlobal(sociedadId: string, query: string): Promise<any[]>;
}

