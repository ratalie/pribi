import { defineStore } from "pinia";

/**
 * Store para gestionar el estado del flujo de Juntas de Accionistas
 * 
 * Gestiona:
 * - Sub-steps dinámicos seleccionados en Paso 1
 * - Estado de navegación (paso actual, sub-step, sección)
 * - Handler del botón "Siguiente"
 */
export const useJuntasFlowStore = defineStore("juntasFlow", {
  state: () => ({
    // Sub-steps seleccionados en Paso 1 (Puntos de Agenda)
    selectedSubSteps: [] as string[],
    
    // Estado de navegación actual
    currentStepId: "",
    currentSubStepId: "",
    currentSectionId: "",
    
    // Estado del botón "Siguiente"
    isLoading: false,
    onClickNext: () => {},
  }),
  
  getters: {
    /**
     * Obtiene los sub-steps dinámicos seleccionados
     */
    getDynamicSubSteps: (state) => state.selectedSubSteps,
    
    /**
     * Determina si debe mostrarse el sidebar derecho
     * Solo se muestra cuando hay un sub-step activo
     */
    hasRightSidebar: (state) => !!state.currentSubStepId,
  },
  
  actions: {
    /**
     * Actualiza los sub-steps seleccionados en Paso 1
     * @param subStepIds Array de IDs de sub-steps seleccionados
     */
    updateDynamicSubSteps(subStepIds: string[]) {
      console.log("🟢 [useJuntasFlowStore] updateDynamicSubSteps:", subStepIds);
      this.selectedSubSteps = subStepIds;
      console.log("🟢 [useJuntasFlowStore] selectedSubSteps actualizado:", this.selectedSubSteps);
    },
    
    /**
     * Establece el paso actual
     */
    setCurrentStep(stepId: string) {
      this.currentStepId = stepId;
    },
    
    /**
     * Establece el sub-step actual
     */
    setCurrentSubStep(subStepId: string) {
      this.currentSubStepId = subStepId;
    },
    
    /**
     * Establece la sección actual (dentro de un sub-step)
     */
    setCurrentSection(sectionId: string) {
      this.currentSectionId = sectionId;
    },
    
    /**
     * Limpia los valores del store (usado en onUnmounted)
     */
    clearValues() {
      this.isLoading = false;
      this.onClickNext = () => {};
    },
  },
});

