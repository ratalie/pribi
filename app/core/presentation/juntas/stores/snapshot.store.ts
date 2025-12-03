import { defineStore } from 'pinia';
import type {
  SnapshotCompleteDTO,
  Shareholder,
  Directorio,
  Director,
  Quorum,
} from '~/core/hexag/juntas/application/dtos/snapshot-complete.dto';
import { GetSnapshotUseCase } from '~/core/hexag/juntas/application/use-cases/get-snapshot.use-case';
import { JuntaHttpRepository } from '~/core/hexag/juntas/infrastructure/repositories/junta.http.repository';

/**
 * Store para el Snapshot de la Junta
 * 
 * ⚠️ IMPORTANTE: Este store es READ-ONLY
 * - Solo tiene getters (no modifica datos)
 * - Los datos vienen del snapshot del backend
 * - Se carga una vez al crear la junta
 */
export const useSnapshotStore = defineStore('snapshot', {
  state: () => ({
    snapshot: null as SnapshotCompleteDTO | null,
    status: 'idle' as 'idle' | 'loading' | 'error',
    errorMessage: null as string | null,
  }),
  
  getters: {
    /**
     * Accionistas con acciones con derecho a voto
     * 
     * Agrupa las asignaciones por accionista y calcula:
     * - Total de acciones con derecho a voto
     * - Porcentaje de participación
     */
    accionistasConDerechoVoto(): ShareholderWithShares[] {
      if (!this.snapshot) return [];
      
      const asignaciones = this.snapshot.shareAllocations;
      const shareClasses = this.snapshot.shareClasses;
      const shareholders = this.snapshot.shareholders;
      
      // Agrupar asignaciones por accionista
      const accionistaMap = new Map<string, {
        shareholder: Shareholder;
        totalAcciones: number;
      }>();
      
      asignaciones.forEach((asig) => {
        const shareClass = shareClasses.find((sc) => sc.id === asig.accionId);
        
        // Solo contar acciones con derecho a voto
        if (shareClass?.conDerechoVoto) {
          if (!accionistaMap.has(asig.accionistaId)) {
            const shareholder = shareholders.find((sh) => sh.id === asig.accionistaId);
            if (shareholder) {
              accionistaMap.set(asig.accionistaId, {
                shareholder,
                totalAcciones: 0,
              });
            }
          }
          
          const current = accionistaMap.get(asig.accionistaId);
          if (current) {
            current.totalAcciones += asig.cantidadSuscrita;
          }
        }
      });
      
      // Calcular total de acciones con voto
      const totalAccionesConVoto = Array.from(accionistaMap.values())
        .reduce((sum, item) => sum + item.totalAcciones, 0);
      
      // Calcular porcentajes
      const result: ShareholderWithShares[] = Array.from(accionistaMap.values()).map((item) => {
        const porcentaje = totalAccionesConVoto > 0
          ? (item.totalAcciones / totalAccionesConVoto) * 100
          : 0;
        
        return {
          shareholder: item.shareholder,
          totalAcciones: item.totalAcciones,
          porcentajeParticipacion: porcentaje,
        };
      });
      
      return result;
    },
    
    /**
     * Quórums de la sociedad (del snapshot)
     * 
     * Contiene 6 valores:
     * - primeraConvocatoriaSimple
     * - primeraConvocatoriaCalificada
     * - segundaConvocatoriaSimple
     * - segundaConvocatoriaCalificada
     * - quorumMinimoSimple
     * - quorumMinimoCalificado
     */
    quorums(): Quorum | null {
      return this.snapshot?.quorums || null;
    },
    
    /**
     * Directorio de la sociedad
     */
    directorio(): Directorio | null {
      return this.snapshot?.directory || null;
    },
    
    /**
     * Lista de directores
     */
    directores(): Director[] {
      return this.snapshot?.directors || [];
    },
    
    /**
     * Presidente del directorio
     */
    presidenteDirectorio(): Director | null {
      if (!this.snapshot?.directory?.presidenteId) return null;
      return this.directores.find((d) => d.id === this.snapshot!.directory!.presidenteId) || null;
    },
    
    /**
     * Si la sociedad tiene directorio
     */
    tieneDirectorio(): boolean {
      return !!this.snapshot?.directory;
    },
    
  },
  
  actions: {
    /**
     * Cargar snapshot desde el backend
     */
    async loadSnapshot(societyId: number, flowId: number) {
      this.status = 'loading';
      this.errorMessage = null;
      
      console.debug('[Store][Snapshot] Cargando snapshot', {
        societyId,
        flowId,
      });
      
      try {
        const repository = new JuntaHttpRepository();
        const useCase = new GetSnapshotUseCase(repository);
        this.snapshot = await useCase.execute(societyId, flowId);
        
        console.debug('[Store][Snapshot] Snapshot cargado exitosamente', {
          accionistas: this.snapshot.shareholders.length,
          quorums: this.snapshot.quorums,
          tieneDirectorio: !!this.snapshot.directory,
        });
        
        this.status = 'idle';
      } catch (error: any) {
        this.status = 'error';
        this.errorMessage = error.message || 'Error al cargar snapshot';
        console.error('[Store][Snapshot] Error al cargar', error);
        throw error;
      }
    },
  },
});

/**
 * Helper interface para accionistas con sus acciones
 */
export interface ShareholderWithShares {
  shareholder: Shareholder;
  totalAcciones: number;
  porcentajeParticipacion: number;
}

