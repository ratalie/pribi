import { computed } from "vue";
import { buildFlowItemTree } from "~/utils/flowHelpers";
import { juntaAccionistasFlowConfig } from "@/config/flows/junta-accionistas.flow";
import { JuntaRoutes } from "@/config/routes";
import type { SummaryBlock, SummarySection } from "./types";
import type { FlowItemTree } from "~/types/flow-system";

const flowTree = buildFlowItemTree(juntaAccionistasFlowConfig.items);

function findItemById(items: FlowItemTree[], id: string): FlowItemTree | undefined {
  for (const item of items) {
    if (item.identity.id === id) return item;
    if (item.children && item.children.length > 0) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

function deriveRoute(item: FlowItemTree): string {
  return item.navigation.route ?? "/";
}

function createBlockFromChild(child: FlowItemTree): SummaryBlock {
  const baseDescription =
    child.behavior.description ||
    `Resumen del paso "${child.identity.label}" dentro del flujo del acuerdo.`;

  const highlights =
    child.children?.map((grandChild) => ({
      id: grandChild.identity.id,
      label: grandChild.identity.label,
      value: "—",
      description:
        grandChild.behavior.description || `Detalle resumido de "${grandChild.identity.label}".`,
      status: "pending" as const,
    })) || [];

  return {
    id: child.identity.id,
    title: child.identity.label,
    description: baseDescription,
    highlights: highlights.length > 0 ? highlights : undefined,
  };
}

function createSectionFromAgreement(item: FlowItemTree, order: number): SummarySection {
  const blocks = (item.children || []).map(createBlockFromChild);

  if (blocks.length === 0) {
    blocks.push({
      id: `${item.identity.id}-resumen`,
      title: `Resumen de ${item.identity.label}`,
      description:
        item.behavior.description ||
        "Completa este bloque con la síntesis del acuerdo, decisiones y tareas pendientes.",
    });
  }

  return {
    id: item.identity.id,
    title: item.identity.label,
    route: deriveRoute(item),
    order,
    blocks,
  };
}

function buildPuntosAcuerdoSections(): SummarySection[] {
  const puntosAcuerdo = findItemById(flowTree, "puntos-acuerdo");
  if (!puntosAcuerdo?.children) return [];
  return puntosAcuerdo.children.map((child, index) => createSectionFromAgreement(child, index + 10));
}

/**
 * Secciones de resumen para Puntos de Acuerdo (Nivel 2)
 * El order comienza en 10 para ubicarlas después de las secciones base.
 */
export const puntosAcuerdoSummarySections: SummarySection[] = buildPuntosAcuerdoSections();

/**
 * Helper reactivo por si en el futuro los acuerdos son dinámicos
 */
export const usePuntosAcuerdoSummary = () => {
  return computed(() => puntosAcuerdoSummarySections);
};

