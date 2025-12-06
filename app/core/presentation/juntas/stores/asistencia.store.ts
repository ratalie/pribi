import { defineStore } from 'pinia';
import type { Asistencia } from '~/core/hexag/juntas/domain/entities/asistencia.entity';
import type { QuorumEstado } from '~/core/hexag/juntas/domain/entities/quorum-estado.entity';
import type { Shareholder } from '~/core/hexag/juntas/application/dtos/snapshot-complete.dto';
import { GetAsistenciaUseCase } from '~/core/hexag/juntas/application/use-cases/asistencia/get-asistencia.use-case';
import { UpdateAsistenciaUseCase } from '~/core/hexag/juntas/application/use-cases/asistencia/update-asistencia.use-case';
import { QuorumCalculatorService } from '~/core/hexag/juntas/domain/services/quorum-calculator.service';
import { AsistenciaHttpRepository } from '~/core/hexag/juntas/infrastructure/repositories/asistencia.http.repository';
import { useSnapshotStore } from './snapshot.store';
import { useMeetingDetailsStore } from './meeting-details.store';
import { OrdenConvocatoria } from '~/core/hexag/juntas/domain/enums/orden-convocatoria.enum';

/**
 * Store para manejar Asistencia de Accionistas
 * 
 * Responsabilidades:
 * - Cargar registros de asistencia del backend
 * - Marcar/desmarcar asistencia (checkboxes)
 * - Asignar representantes
 * - Calcular quórum en tiempo real
 */
export const useAsistenciaStore = defineStore('asistencia', {
  // ✅ PERSISTENCIA: Guardar en localStorage para debug
  persist: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    key: 'probo-asistencia',
  },
  
  state: () => ({
    asistencias: [] as Asistencia[],
    quorumEstado: null as QuorumEstado | null,
    status: 'idle' as 'idle' | 'loading' | 'error',
    errorMessage: null as string | null,
  }),
  
  getters: {
    /**
     * Asistencias enriquecidas con nombre completo
     */
    asistenciasEnriquecidas(): AsistenciaEnriquecida[] {
      return this.asistencias.map((asist) => ({
        ...asist,
        nombreCompleto: getNombreCompletoShareholder(asist.accionista),
        tipoPersona: asist.accionista.person.tipo,
      }));
    },
    
    /**
     * Total de acciones con derecho a voto
     */
    totalAcciones(): number {
      return this.asistencias.reduce((sum, a) => sum + a.accionesConDerechoVoto, 0);
    },
    
    /**
     * Acciones presentes (de quienes asistieron)
     */
    accionesPresentes(): number {
      return this.asistencias
        .filter((a) => a.asistio)
        .reduce((sum, a) => sum + a.accionesConDerechoVoto, 0);
    },
    
    /**
     * Porcentaje de asistencia
     */
    porcentajeAsistencia(): number {
      return this.totalAcciones > 0
        ? (this.accionesPresentes / this.totalAcciones) * 100
        : 0;
    },
    
    /**
     * Número de accionistas que asistieron
     */
    cantidadAsistentes(): number {
      return this.asistencias.filter((a) => a.asistio).length;
    },
    
    /**
     * Si cumple quórum simple
     */
    cumpleQuorumSimple(): boolean {
      return this.quorumEstado?.cumpleQuorumSimple || false;
    },
    
    /**
     * Si cumple quórum calificado
     */
    cumpleQuorumCalificado(): boolean {
      return this.quorumEstado?.cumpleQuorumCalificado || false;
    },
  },
  
  actions: {
    /**
     * Cargar asistencias del backend
     */
    async loadAsistencias(societyId: number, flowId: number) {
      this.status = 'loading';
      this.errorMessage = null;
      
      console.debug('[Store][Asistencia] Cargando asistencias', {
        societyId,
        flowId,
      });
      
      try {
        const repository = new AsistenciaHttpRepository();
        const useCase = new GetAsistenciaUseCase(repository);
        this.asistencias = await useCase.execute(societyId, flowId);
        
        console.debug('[Store][Asistencia] Asistencias cargadas', {
          count: this.asistencias.length,
        });
        
        // 🐛 DEBUG: Si está vacío, mostrar más info
        if (this.asistencias.length === 0) {
          console.warn('⚠️ [Store][Asistencia] ARRAY VACÍO - Posibles causas:');
          console.warn('  1. Los registros no se crearon al crear la junta');
          console.warn('  2. El flowId o societyId son incorrectos');
          console.warn('  3. El backend no devuelve datos');
          console.warn('  Parámetros:', { societyId, flowId });
          console.warn('  URL esperada:', `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/attendance`);
        } else {
          console.debug('[Store][Asistencia] Datos:', {
            primerosRegistros: this.asistencias.slice(0, 2),
          });
        }
        
        // Calcular quórum inmediatamente
        this.calcularQuorum();
        
        this.status = 'idle';
      } catch (error: any) {
        this.status = 'error';
        this.errorMessage = error.message || 'Error al cargar asistencias';
        console.error('[Store][Asistencia] Error al cargar', error);
        console.error('[Store][Asistencia] Detalles del error:', {
          statusCode: error.statusCode,
          response: error.response,
          data: error.data,
        });
        throw error;
      }
    },
    
    /**
     * Toggle asistencia de un accionista
     */
    async toggleAsistencia(societyId: number, flowId: number, registroId: string) {
      const asistencia = this.asistencias.find((a) => a.id === registroId);
      if (!asistencia) {
        console.warn('[Store][Asistencia] Registro no encontrado', registroId);
        return;
      }
      
      const nuevoEstado = !asistencia.asistio;
      
      console.debug('[Store][Asistencia] Toggle asistencia', {
        registroId,
        estadoAnterior: asistencia.asistio,
        nuevoEstado,
      });
      
      try {
        // Actualizar en backend
        const repository = new AsistenciaHttpRepository();
        const useCase = new UpdateAsistenciaUseCase(repository);
        await useCase.execute(
          societyId,
          flowId,
          registroId,
          nuevoEstado,
          asistencia.representadoPorId || undefined
        );
        
        // Actualizar en store
        asistencia.asistio = nuevoEstado;
        
        // Recalcular quórum
        this.calcularQuorum();
        
        console.debug('[Store][Asistencia] Asistencia actualizada', {
          registroId,
          nuevoEstado,
        });
      } catch (error: any) {
        console.error('[Store][Asistencia] Error al actualizar asistencia', error);
        throw error;
      }
    },
    
    /**
     * Asignar representante a un accionista (NUEVO: con objeto completo)
     * Backend crea PersonV2 automáticamente
     */
    async asignarRepresentante(
      societyId: number,
      flowId: number,
      registroId: string,
      representante: {
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno?: string;
        tipoDocumento: string;
        numeroDocumento: string;
        paisEmision?: string;
      }
    ) {
      const asistencia = this.asistencias.find((a) => a.id === registroId);
      if (!asistencia) {
        console.warn('[Store][Asistencia] Registro no encontrado', registroId);
        return;
      }
      
      if (!asistencia.asistio) {
        console.error('[Store][Asistencia] Solo se puede asignar representante a quien asistió');
        throw new Error('El accionista debe haber asistido para asignar representante');
      }
      
      console.debug('[Store][Asistencia] Asignando representante (objeto completo)', {
        registroId,
        representante,
      });
      
      try {
        const repository = new AsistenciaHttpRepository();
        const { AssignRepresentanteUseCase } = await import(
          '~/core/hexag/juntas/application/use-cases/asistencia/assign-representante.use-case'
        );
        const useCase = new AssignRepresentanteUseCase(repository);
        
        await useCase.execute(
          societyId,
          flowId,
          registroId,
          asistencia.asistio,
          representante
        );
        
        await this.loadAsistencias(societyId, flowId);
      } catch (error: any) {
        console.error('[Store][Asistencia] Error:', error);
        throw error;
      }
    },
    
    /**
     * Eliminar representante de un accionista
     */
    async eliminarRepresentante(
      societyId: number,
      flowId: number,
      registroId: string
    ) {
      const asistencia = this.asistencias.find((a) => a.id === registroId);
      if (!asistencia) return;
      
      console.debug('[Store][Asistencia] Eliminando representante', { registroId });
      
      try {
        // Actualizar en backend
        const repository = new AsistenciaHttpRepository();
        const useCase = new UpdateAsistenciaUseCase(repository);
        await useCase.execute(
          societyId,
          flowId,
          registroId,
          asistencia.asistio, // Mantener estado de asistencia
          undefined // Sin representante
        );
        
        // Actualizar en store
        asistencia.representadoPorId = null;
        
        // Recalcular quórum
        this.calcularQuorum();
        
        console.debug('[Store][Asistencia] Representante eliminado', { registroId });
      } catch (error: any) {
        console.error('[Store][Asistencia] Error al eliminar representante', error);
        throw error;
      }
    },
    
    /**
     * Calcular quórum en tiempo real
     * 
     * Usa:
     * - Asistencias actuales
     * - Quórums del snapshot
     * - Convocatoria seleccionada (del MeetingDetails store)
     */
    calcularQuorum() {
      const snapshotStore = useSnapshotStore();
      const meetingDetailsStore = useMeetingDetailsStore();
      
      // Validar que tenemos los datos necesarios
      if (!snapshotStore.quorums) {
        console.warn('[Store][Asistencia] No hay quórums en el snapshot');
        return;
      }
      
      if (!meetingDetailsStore.meetingDetails) {
        console.warn('[Store][Asistencia] No hay meeting details');
        return;
      }
      
      // Determinar convocatoria
      const convocatoria =
        meetingDetailsStore.meetingDetails.instaladaEnConvocatoria || OrdenConvocatoria.PRIMERA;
      
      // Calcular usando el servicio
      const calculator = new QuorumCalculatorService();
      this.quorumEstado = calculator.calculate(
        this.asistencias,
        snapshotStore.quorums,
        convocatoria
      );
      
      console.debug('[Store][Asistencia] Quórum calculado', {
        convocatoria,
        porcentajePresente: this.quorumEstado.porcentajePresente,
        cumpleSimple: this.quorumEstado.cumpleQuorumSimple,
        cumpleCalificado: this.quorumEstado.cumpleQuorumCalificado,
      });
    },
    
  },
});

/**
 * Helper interface para asistencias con nombre
 */
/**
 * Helper interface para asistencias con nombre
 */
export interface AsistenciaEnriquecida extends Asistencia {
  nombreCompleto: string;
  tipoPersona: string;
}

/**
 * Helper: Obtener nombre completo de un accionista
 */
function getNombreCompletoShareholder(shareholder: Shareholder): string {
  const person = shareholder.person;
  if (person.tipo === 'NATURAL') {
    return `${person.nombre} ${person.apellidoPaterno} ${person.apellidoMaterno}`;
  }
  // Para personas jurídicas y otros tipos
  if ('razonSocial' in person) {
    return person.razonSocial || '';
  }
  return ''; // Fallback
}

