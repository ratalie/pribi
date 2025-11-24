import { defineStore } from "pinia";
import type { NavigationStep } from "~/types/navigationSteps";

export const useProgressNavbarStore = defineStore("progressNavbar", {
  state: (): State => ({
    steps: [],
  }),
  actions: {
    setSteps(newSteps: NavigationStep[]) {
      this.steps = newSteps;
    },

    getNextStepByCurrentStep(currentStep: string) {
      const currentStepIndex = this.steps.findIndex((step) => step.route === currentStep);

      if (currentStepIndex === -1) {
        return null;
      }

      return this.steps[currentStepIndex + 1];
    },
  },
});

interface State {
  steps: NavigationStep[];
}
