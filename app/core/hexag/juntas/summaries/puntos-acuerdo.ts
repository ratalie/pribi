import { juntaAccionistasFlowConfig } from "@/config/flows/junta-accionistas.flow";
import { computed } from "vue";
import type { FlowItemTree } from "~/types/flow-system";
import { buildFlowItemTree } from "~/utils/flowHelpers";
import type { SummaryBlock, SummarySection } from "./types";

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
        grandChild.behavior.description ||
        `Detalle resumido de "${grandChild.identity.label}".`,
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

/**
 * Construye las secciones de resumen para Puntos de Acuerdo
 *
 * Estructura del árbol:
 * - puntos-acuerdo (Nivel 0)
 *   - aumento-capital-section (Nivel 1 - SECTION)
 *     - aporte-dinerario (Nivel 2 - AGREEMENT) ← Estos son los que necesitamos
 *     - capitalizacion-creditos (Nivel 2 - AGREEMENT)
 *   - nombramiento-section (Nivel 1 - SECTION)
 *     - nombramiento-gerente (Nivel 2 - AGREEMENT) ← Estos son los que necesitamos
 *     - ...
 *
 * Necesitamos extraer los acuerdos individuales (Nivel 2), NO las sections (Nivel 1)
 */
function buildPuntosAcuerdoSections(): SummarySection[] {
  const puntosAcuerdo = findItemById(flowTree, "puntos-acuerdo");
  if (!puntosAcuerdo?.children) return [];

  const agreements: SummarySection[] = [];
  let orderCounter = 10;

  // Iterar sobre las sections (Nivel 1)
  puntosAcuerdo.children.forEach((section) => {
    // Para cada section, iterar sobre sus hijos (acuerdos de Nivel 2)
    if (section.children && section.children.length > 0) {
      section.children.forEach((agreement) => {
        // Crear SummarySection para cada acuerdo individual (Nivel 2)
        const summarySection = createSectionFromAgreement(agreement, orderCounter);
        agreements.push(summarySection);
        orderCounter++;
      });
    }
  });

  console.log(
    "🔵 [puntos-acuerdo] Acuerdos individuales encontrados:",
    agreements.map((a) => ({ id: a.id, title: a.title }))
  );
  return agreements;
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
