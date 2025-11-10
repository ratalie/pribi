import { defineStore } from "pinia";
import type { NavigationStep } from "~/types/navigationSteps";

export type StepStatus = NavigationStep["status"];

interface StepState {
  status: StepStatus;
  updatedAt: string;
  metadata?: Record<string, any>;
}

interface FlowState {
  steps: Record<string, StepState>;
  updatedAt: string;
}

interface FlowProgressState {
  flows: Record<string, FlowState>;
}

export const useFlowProgressStore = defineStore("flowProgress", {
  state: (): FlowProgressState => ({
    flows: {},
  }),

  getters: {
    getStepStatus: (state) => (flowId: string, stepId: string): StepStatus | undefined => {
      return state.flows[flowId]?.steps[stepId]?.status;
    },
    getFlowSteps: (state) => (flowId: string): Record<string, StepState> | undefined => {
      return state.flows[flowId]?.steps;
    },
  },

  actions: {
    initializeFlow(flowId: string, stepIds: string[] = [], defaultStatus: StepStatus = "empty") {
      if (!flowId) return;

      const existing = this.flows[flowId];
      const now = new Date().toISOString();

      if (existing) {
        // Solo agregar pasos que no existan aún
        for (const stepId of stepIds) {
          if (!existing.steps[stepId]) {
            existing.steps[stepId] = {
              status: defaultStatus,
              updatedAt: now,
            };
          }
        }
        existing.updatedAt = now;
        return;
      }

      const steps = stepIds.reduce<Record<string, StepState>>((acc, stepId) => {
        acc[stepId] = {
          status: defaultStatus,
          updatedAt: now,
        };
        return acc;
      }, {});

      this.flows[flowId] = {
        steps,
        updatedAt: now,
      };
    },

    setStepStatus(flowId: string, stepId: string, status: StepStatus, metadata?: Record<string, any>) {
      if (!flowId || !stepId) return;

      const now = new Date().toISOString();

      if (!this.flows[flowId]) {
        this.flows[flowId] = {
          steps: {},
          updatedAt: now,
        };
      }

      this.flows[flowId].steps[stepId] = {
        status,
        updatedAt: now,
        metadata,
      };

      this.flows[flowId].updatedAt = now;
    },

    bulkUpdateFlow(flowId: string, payload: Record<string, StepState>) {
      if (!flowId) return;

      const now = new Date().toISOString();

      if (!this.flows[flowId]) {
        this.flows[flowId] = {
          steps: {},
          updatedAt: now,
        };
      }

      this.flows[flowId].steps = {
        ...this.flows[flowId].steps,
        ...payload,
      };

      this.flows[flowId].updatedAt = now;
    },

    resetFlow(flowId: string) {
      if (!flowId) return;
      delete this.flows[flowId];
    },
  },
});

