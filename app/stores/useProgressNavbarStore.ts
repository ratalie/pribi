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
  },
});

interface State {
  steps: NavigationStep[];
}
