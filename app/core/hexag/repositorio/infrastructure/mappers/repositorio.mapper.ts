import type { RepositorioStats } from '../../domain/entities/repositorio-stats.entity';
import type { Metricas } from '../../domain/entities/metricas.entity';
import type { DashboardStatsDTO } from '../../application/dtos/dashboard-stats.dto';

/**
 * Mapper para convertir entre DTOs y Entidades del repositorio
 */
export class RepositorioMapper {
  /**
   * Convierte DTO de respuesta a entidad RepositorioStats
   */
  static dtoToStats(dto: DashboardStatsDTO): RepositorioStats {
    return {
      documentosSocietarios: dto.documentosSocietarios,
      documentosGenerados: dto.documentosGenerados,
      carpetasPersonalizadas: dto.carpetasPersonalizadas,
    };
  }

  /**
   * Convierte entidad RepositorioStats a DTO
   */
  static statsToDto(stats: RepositorioStats, metricas: Metricas): DashboardStatsDTO {
    return {
      documentosSocietarios: stats.documentosSocietarios,
      documentosGenerados: stats.documentosGenerados,
      carpetasPersonalizadas: stats.carpetasPersonalizadas,
      metricas: metricas,
    };
  }
}

