import { computed } from "vue";
import type { SummaryRegistry, SummarySection } from "./types";
import { baseSummarySections } from "./base";
import { puntosAcuerdoSummarySections, usePuntosAcuerdoSummary } from "./puntos-acuerdo";

const FLOW_ID = "juntas-accionistas-layout";

const sections: SummarySection[] = [
  ...baseSummarySections,
  ...puntosAcuerdoSummarySections,
].sort((a, b) => a.order - b.order);

export const juntasSummaryRegistry: SummaryRegistry = {
  flowId: FLOW_ID,
  sections,
};

export const useJuntasSummarySections = () => {
  return computed(() => sections);
};

export const getSummarySectionById = (id: string) => {
  return sections.find((section) => section.id === id);
};

export const useSummarySection = (id: string) => {
  return computed(() => getSummarySectionById(id));
};

export { usePuntosAcuerdoSummary, puntosAcuerdoSummarySections };

