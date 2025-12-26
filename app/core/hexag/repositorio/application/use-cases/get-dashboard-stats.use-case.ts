import type { RepositorioRepository } from '../../domain/ports/repositorio.repository';
import type { DashboardStatsDTO } from '../dtos/dashboard-stats.dto';

/**
 * Caso de uso: Obtener estadísticas del dashboard
 */
export class GetDashboardStatsUseCase {
  constructor(private readonly repository: RepositorioRepository) {}

  async execute(sociedadId: string): Promise<DashboardStatsDTO> {
    const [stats, metricas] = await Promise.all([
      this.repository.getStats(sociedadId),
      this.repository.getMetricas(sociedadId),
    ]);

    return {
      documentosSocietarios: stats.documentosSocietarios,
      documentosGenerados: stats.documentosGenerados,
      carpetasPersonalizadas: stats.carpetasPersonalizadas,
      metricas: metricas,
    };
  }
}

