import { defineStore } from 'pinia';
import { GetDashboardStatsUseCase } from '~/core/hexag/repositorio/application/use-cases/get-dashboard-stats.use-case';
import { SearchGlobalUseCase } from '~/core/hexag/repositorio/application/use-cases/search-global.use-case';
import type { DashboardStatsDTO } from '~/core/hexag/repositorio/application/dtos/dashboard-stats.dto';
import type { SearchResultDTO } from '~/core/hexag/repositorio/application/dtos/search-query.dto';
import type { Sociedad } from '~/core/hexag/repositorio/domain/entities/sociedad.entity';
import { RepositorioMockRepository } from '~/core/hexag/repositorio/infrastructure/repositories/repositorio-mock.repository';
import { useSociedadHistorialStore } from '~/core/presentation/registros/sociedades/stores/sociedad-historial.store';
// TODO: Cambiar a HTTP cuando esté listo
// import { RepositorioHttpRepository } from '~/core/hexag/repositorio/infrastructure/repositories/repositorio-http.repository';

type Status = 'idle' | 'loading' | 'error';

/**
 * Store para el Dashboard del Repositorio
 * Usa Option API según las reglas del proyecto
 */
export const useRepositorioDashboardStore = defineStore('repositorio-dashboard', {
  state: () => ({
    stats: null as DashboardStatsDTO | null,
    sociedades: [] as Sociedad[],
    sociedadSeleccionada: null as Sociedad | null,
    resultadosBusqueda: [] as SearchResultDTO[],
    queryBusqueda: '',
    status: 'idle' as Status,
    errorMessage: null as string | null,
  }),

  getters: {
    isLoading: (state) => state.status === 'loading',
    hasError: (state) => state.status === 'error',
    totalDocumentos: (state) => state.stats?.metricas.totalDocumentos ?? 0,
    espacioUsado: (state) => state.stats?.metricas.espacioUsado ?? 0,
    espacioTotal: (state) => state.stats?.metricas.espacioTotal ?? 10,
    porcentajeEspacio: (state) => {
      if (!state.stats?.metricas.espacioTotal) return 0;
      return (state.stats.metricas.espacioUsado / state.stats.metricas.espacioTotal) * 100;
    },
  },

  actions: {
    /**
     * Carga las estadísticas del dashboard
     */
    async cargarStats(sociedadId?: string) {
      const id = sociedadId || this.sociedadSeleccionada?.id;
      if (!id) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return;
      }

      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new RepositorioMockRepository();
        const useCase = new GetDashboardStatsUseCase(repository);
        const result = await useCase.execute(id);
        
        this.stats = result;
        this.status = 'idle';
      } catch (error: any) {
        console.error('[RepositorioDashboardStore] Error al cargar stats:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos cargar las estadísticas del dashboard';
      }
    },

    /**
     * Selecciona una sociedad por ID y carga sus estadísticas
     * Mapea desde SociedadResumenDTO a Sociedad
     */
    async seleccionarSociedad(societyId: string) {
      console.log("🟢 [RepositorioDashboardStore] Seleccionando sociedad:", societyId);
      
      const sociedadHistorialStore = useSociedadHistorialStore();
      
      // Buscar la sociedad en el store de historial
      const sociedadDTO = sociedadHistorialStore.sociedades.find(
        (s) => s.idSociety === societyId
      );

      if (!sociedadDTO) {
        console.error('[RepositorioDashboardStore] Sociedad no encontrada:', societyId);
        this.errorMessage = 'Sociedad no encontrada';
        return;
      }

      // Mapear SociedadResumenDTO a Sociedad
      const sociedad: Sociedad = {
        id: sociedadDTO.idSociety,
        nombre: sociedadDTO.razonSocial || 'Sociedad sin nombre',
        rut: sociedadDTO.ruc || '',
        tipo: (sociedadDTO.tipoSocietario as Sociedad['tipo']) || 'SpA',
        activa: sociedadDTO.estado === 'completo',
      };

      console.log("🟢 [RepositorioDashboardStore] Sociedad mapeada:", sociedad);
      this.sociedadSeleccionada = sociedad;
      console.log("🟢 [RepositorioDashboardStore] Sociedad seleccionada actualizada en store");
      
      // Cargar stats de la sociedad seleccionada
      await this.cargarStats(sociedad.id);
    },

    /**
     * Realiza una búsqueda global
     */
    async buscar(query: string) {
      this.queryBusqueda = query;
      
      if (!query || query.trim().length === 0) {
        this.resultadosBusqueda = [];
        return;
      }

      const sociedadId = this.sociedadSeleccionada?.id;
      if (!sociedadId) {
        this.errorMessage = 'No hay sociedad seleccionada';
        return;
      }

      this.status = 'loading';
      this.errorMessage = null;

      try {
        const repository = new RepositorioMockRepository();
        const useCase = new SearchGlobalUseCase(repository);
        const resultados = await useCase.execute({
          query,
          sociedadId,
        });
        
        this.resultadosBusqueda = resultados;
        this.status = 'idle';
      } catch (error: any) {
        console.error('[RepositorioDashboardStore] Error al buscar:', error);
        this.status = 'error';
        this.errorMessage = error?.message ?? 'No pudimos realizar la búsqueda';
      }
    },

    /**
     * Limpia los resultados de búsqueda
     */
    limpiarBusqueda() {
      this.queryBusqueda = '';
      this.resultadosBusqueda = [];
    },
  },
});

