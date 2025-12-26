import { defineStore } from 'pinia';
import {
  GetMeetingDetailsUseCase,
  UpdateMeetingDetailsUseCase,
} from '~/core/hexag/juntas/application/use-cases';
import { MeetingDetailsHttpRepository } from '~/core/hexag/juntas/infrastructure/repositories/meeting-details.http.repository';
import type { MeetingDetails } from '~/core/hexag/juntas/domain/entities/meeting-details.entity';

type Status = 'idle' | 'loading' | 'error';

/**
 * Store para gestionar los detalles de la junta
 *
 * Usa Option API de Pinia (NO Composition API)
 */
export const useMeetingDetailsStore = defineStore('meeting-details', {
  // ✅ PERSISTENCIA: Guardar en localStorage para debug
  persist: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    key: 'probo-meeting-details',
  },
  
  state: () => ({
    // Datos actuales de meeting details
    meetingDetails: null as MeetingDetails | null,

    // Estado de carga
    status: 'idle' as Status,
    errorMessage: null as string | null,

    // IDs de la junta actual
    currentSocietyId: null as number | null,
    currentFlowId: null as number | null,
  }),

  getters: {
    /**
     * Indica si hay datos cargados
     */
    hasData: (state) => state.meetingDetails !== null,

    /**
     * Indica si está cargando
     */
    isLoading: (state) => state.status === 'loading',

    /**
     * Obtiene el tipo de junta actual
     */
    tipoJunta: (state) => state.meetingDetails?.tipoJunta || null,

    /**
     * Obtiene la convocatoria en la que se instaló la junta
     */
    instaladaEnConvocatoria: (state) => state.meetingDetails?.instaladaEnConvocatoria || null,
  },

  actions: {
    /**
     * Establece los IDs de la junta actual
     */
    setCurrentJunta(societyId: number | null, flowId: number | null) {
      this.currentSocietyId = societyId;
      this.currentFlowId = flowId;
    },

    /**
     * Carga los detalles de la junta desde el backend
     */
    async loadMeetingDetails(societyId: number, flowId: number): Promise<void> {
      this.status = 'loading';
      this.errorMessage = null;
      this.setCurrentJunta(societyId, flowId);

      const repository = new MeetingDetailsHttpRepository();
      const useCase = new GetMeetingDetailsUseCase(repository);

      try {
        const details = await useCase.execute(societyId, flowId);
        this.meetingDetails = details;
        this.status = 'idle';
        console.debug('[Store][MeetingDetails] Datos cargados:', details);
      } catch (error: any) {
        this.errorMessage = error?.message || 'Error al cargar los detalles de la junta';
        this.status = 'error';
        console.error('[Store][MeetingDetails] Error al cargar:', error);
        throw error;
      }
    },

    /**
     * Actualiza los detalles de la junta en el backend
     */
    async updateMeetingDetails(details: MeetingDetails): Promise<void> {
      if (!this.currentSocietyId || !this.currentFlowId) {
        throw new Error('Debes establecer societyId y flowId primero');
      }

      this.status = 'loading';
      this.errorMessage = null;

      const repository = new MeetingDetailsHttpRepository();
      const useCase = new UpdateMeetingDetailsUseCase(repository);

      try {
        await useCase.execute(this.currentSocietyId, this.currentFlowId, details);
        // Actualizar el estado local después de una actualización exitosa
        this.meetingDetails = details;
        this.status = 'idle';
        console.debug('[Store][MeetingDetails] Datos actualizados:', details);
      } catch (error: any) {
        this.errorMessage = error?.message || 'Error al actualizar los detalles de la junta';
        this.status = 'error';
        console.error('[Store][MeetingDetails] Error al actualizar:', error);
        throw error;
      }
    },

    /**
     * Actualiza parcialmente los detalles de la junta de forma reactiva
     * Esto mantiene la reactividad de Pinia cuando navegas entre páginas
     */
    patchMeetingDetails(updates: Partial<MeetingDetails>) {
      if (!this.meetingDetails) {
        console.warn('[Store][MeetingDetails] No hay meetingDetails para actualizar');
        return;
      }
      
      // Usar Object.assign para mantener la reactividad
      Object.assign(this.meetingDetails, updates);
    },

    /**
     * Limpia el estado del store
     */
    clear() {
      this.meetingDetails = null;
      this.status = 'idle';
      this.errorMessage = null;
      this.currentSocietyId = null;
      this.currentFlowId = null;
    },
  },
});

