import { defineStore } from 'pinia';
import type { SocietyInfo } from '~/core/hexag/panel-administrativo/domain/entities/society-assignment.entity';
import { SocietiesHttpRepository } from '~/core/hexag/panel-administrativo/infrastructure/repositories/societies-http.repository';

/**
 * Store para gestionar las sociedades disponibles
 */
export const useSocietiesStore = defineStore('societies', {
  state: () => ({
    societies: [] as SocietyInfo[],
    isLoading: false,
    error: null as string | null,
    selectedSocieties: [] as string[], // Para el selector
  }),

  getters: {
    /**
     * Obtiene una sociedad por ID
     */
    getSocietyById: (state) => (id: string): SocietyInfo | undefined => {
      return state.societies.find((s) => s.id === id);
    },

    /**
     * Verifica si una sociedad está seleccionada
     */
    isSelected: (state) => (id: string): boolean => {
      return state.selectedSocieties.includes(id);
    },

    /**
     * Obtiene las sociedades seleccionadas
     */
    selectedSocietiesList(state): SocietyInfo[] {
      return state.societies.filter((s) => state.selectedSocieties.includes(s.id));
    },
  },

  actions: {
    /**
     * Carga las sociedades disponibles desde el backend
     */
    async loadSocieties(studyId?: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const repository = new SocietiesHttpRepository();
        const societies = await repository.getAllSocieties(studyId);
        this.societies = societies;
      } catch (error: any) {
        this.error = error?.message ?? 'Error al cargar sociedades';
        console.error('Error al cargar sociedades:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Establece las sociedades seleccionadas
     */
    setSelectedSocieties(ids: string[]) {
      this.selectedSocieties = ids;
    },

    /**
     * Toggle de una sociedad seleccionada
     */
    toggleSociety(id: string) {
      const index = this.selectedSocieties.indexOf(id);
      if (index === -1) {
        this.selectedSocieties.push(id);
      } else {
        this.selectedSocieties.splice(index, 1);
      }
    },

    /**
     * Agrega una sociedad a la selección
     */
    addSociety(id: string) {
      if (!this.selectedSocieties.includes(id)) {
        this.selectedSocieties.push(id);
      }
    },

    /**
     * Remueve una sociedad de la selección
     */
    removeSociety(id: string) {
      this.selectedSocieties = this.selectedSocieties.filter((sId) => sId !== id);
    },

    /**
     * Limpia la selección
     */
    clearSelection() {
      this.selectedSocieties = [];
    },

    /**
     * Resetea el store
     */
    reset() {
      this.societies = [];
      this.selectedSocieties = [];
      this.error = null;
      this.isLoading = false;
    },
  },
});




