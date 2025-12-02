import { computed } from "vue";
import { useRoute } from "vue-router";
import { useJuntasSummarySections } from "~/core/hexag/juntas/summaries";
import type { SummarySection } from "~/core/hexag/juntas/summaries/types";
import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";
import type { SectionItem } from "~/types/junta-navigation.types";

/**
 * Mapeo de IDs del store (Paso 1) a IDs de SummarySection
 * El store usa IDs como "aporte-dinerarios" (plural) pero los SummarySection usan "aporte-dinerario" (singular)
 *
 * Esta función se exporta para ser reutilizada en otros lugares
 */
export const mapStoreIdToSectionId = (storeId: string): string => {
  const idMap: Record<string, string> = {
    "aporte-dinerarios": "aporte-dinerario",
    "aporte-no-dinerario": "aporte-no-dinerario",
    "capitalizacion-creditos": "capitalizacion-creditos",
    "remocion-gerente": "remocion-gerente",
    "remocion-apoderados": "remocion-apoderados",
    "remocion-directores": "remocion-directores",
    "nombramiento-gerente": "nombramiento-gerente",
    "nombramiento-apoderados": "nombramiento-apoderados",
    "nombramiento-directores": "nombramiento-directores",
    "nombramiento-nuevo-directorio": "nombramiento-directorio",
    "pronunciamiento-gestion": "pronunciamiento-gestion",
    "aplicacion-resultados": "aplicacion-resultados",
    "delegacion-auditores": "nombramiento-auditores",
  };
  return idMap[storeId] || storeId; // Si no hay mapeo, usar el ID original
};

/**
 * Composable para generar las secciones del sidebar derecho en la página de Resumen
 *
 * Este composable:
 * 1. Obtiene todas las secciones de resumen (base + puntos de acuerdo)
 * 2. Filtra las secciones relevantes para el resumen general
 * 3. Transforma SummarySection → SectionItem con anclas
 * 4. Genera sub-secciones para los blocks dentro de cada sección
 * 5. Es reactivo y se actualiza cuando cambian los puntos de acuerdo
 *
 * @returns Computed ref con las secciones del sidebar para el resumen
 */
export const useJuntasResumenSections = () => {
  const route = useRoute();
  const juntasFlowStore = useJuntasFlowStore();
  const allSummarySections = useJuntasSummarySections();

  /**
   * Secciones base que siempre aparecen en el resumen
   * Solo 3 items: detalles, instalacion, y puntos-acuerdo (este último con hijos dinámicos)
   */
  const baseSectionIds = [
    "detalles",
    "instalacion",
    "puntos-acuerdo", // Esta es especial, contiene sub-secciones dinámicas
  ];

  /**
   * Transforma un SummaryBlock a un SectionItem (sub-sección)
   */
  const transformBlockToSubSection = (block: SummarySection["blocks"][0]): SectionItem => {
    return {
      id: block.id,
      title: block.title,
      description: block.description,
      navigationType: "anchor", // Los blocks siempre son anclas en el resumen
      status: "upcoming", // Por defecto, se actualizará según la sección actual
    };
  };

  /**
   * Transforma un SummarySection a un SectionItem principal
   * Para detalles e instalacion: NO tienen sub-secciones (no son desplegables)
   */
  const transformSectionToItem = (
    section: SummarySection,
    currentSectionId?: string,
    allowSubSections: boolean = false
  ): SectionItem => {
    // Solo crear sub-secciones si allowSubSections es true
    // Para detalles e instalacion, NO crear sub-secciones
    const subSections: SectionItem[] | undefined =
      allowSubSections && section.blocks && section.blocks.length > 0
        ? section.blocks.map((block) => transformBlockToSubSection(block))
        : undefined;

    // Determinar el status de la sección principal
    let status: SectionItem["status"] = "upcoming";
    if (currentSectionId === section.id) {
      status = "current";
    } else if (subSections) {
      // Si alguna sub-sección está activa, la sección principal está "current"
      const hasActiveSubSection = subSections.some((sub) => sub.id === currentSectionId);
      if (hasActiveSubSection) {
        status = "current";
      }
    }

    // Actualizar status de sub-secciones
    if (subSections) {
      subSections.forEach((sub) => {
        if (sub.id === currentSectionId) {
          sub.status = "current";
        } else {
          // Marcar como completed si ya pasamos por ella
          // (lógica simplificada, se puede mejorar)
          sub.status = "upcoming";
        }
      });
    }

    return {
      id: section.id,
      title: section.title,
      description: section.blocks?.[0]?.description, // Usar la descripción del primer block
      navigationType: "anchor", // En el resumen, todas las secciones son anclas
      status,
      subSections,
    };
  };

  /**
   * Genera las secciones de "Puntos de Acuerdo" dinámicamente
   * SOLO incluye los acuerdos que fueron seleccionados en Paso 1
   */
  const generatePuntosAcuerdoSections = (
    allSections: SummarySection[],
    currentSectionId?: string
  ): SectionItem[] => {
    // Acceder directamente al state para asegurar reactividad completa
    const selectedSubSteps = juntasFlowStore.selectedSubSteps;
    console.log(
      "🔵 [useJuntasResumenSections] selectedSubSteps desde state:",
      selectedSubSteps
    );

    // Mapear los IDs del store a los IDs de SummarySection
    const selectedSectionIds = selectedSubSteps.map(mapStoreIdToSectionId);
    console.log(
      "🔵 [useJuntasResumenSections] selectedSectionIds mapeados:",
      selectedSectionIds
    );

    // Filtrar SOLO las secciones que están en selectedSectionIds
    // IMPORTANTE: NO usar startsWith, solo incluir los que están explícitamente seleccionados
    console.log(
      "🔵 [useJuntasResumenSections] allSections disponibles:",
      allSections.map((s) => ({ id: s.id, title: s.title }))
    );

    const puntosAcuerdoSections = allSections.filter((section) => {
      const isIncluded = selectedSectionIds.includes(section.id);
      if (!isIncluded) {
        console.log(
          "🔵 [useJuntasResumenSections] Sección excluida:",
          section.id,
          "no está en",
          selectedSectionIds
        );
      }
      return isIncluded;
    });

    console.log(
      "🔵 [useJuntasResumenSections] puntosAcuerdoSections filtradas:",
      puntosAcuerdoSections.map((s) => s.id)
    );

    // Transformar a SectionItem SIN sub-secciones
    // Los hijos de "puntos-acuerdo" NO son desplegables, solo son items simples
    return puntosAcuerdoSections.map((section) => {
      // NO pasar allowSubSections=true, para que NO tenga sub-secciones
      const item = transformSectionToItem(section, currentSectionId, false);

      // Los puntos de acuerdo NO tienen sub-secciones en el sidebar
      // Son items simples que navegan a anclas en la página
      item.subSections = undefined;

      return item;
    });
  };

  /**
   * Secciones reactivas del sidebar para el resumen
   */
  const sections = computed<SectionItem[]>(() => {
    const currentHash = route.hash?.replace("#", "") || "";
    const currentSectionId = currentHash || (route.query.section as string) || undefined;

    console.log("🔵 [useJuntasResumenSections] Generando secciones para resumen");
    console.log("🔵 [useJuntasResumenSections] currentSectionId:", currentSectionId);
    console.log(
      "🔵 [useJuntasResumenSections] allSummarySections:",
      allSummarySections.value.length
    );

    const allSections = allSummarySections.value;
    const result: SectionItem[] = [];

    // 1. Agregar secciones base (detalles, instalacion) - SIN sub-secciones
    baseSectionIds.forEach((sectionId) => {
      if (sectionId === "puntos-acuerdo") {
        // Esta se maneja por separado
        return;
      }

      const section = allSections.find((s) => s.id === sectionId);
      if (section) {
        // detalles e instalacion NO tienen sub-secciones (no son desplegables)
        const item = transformSectionToItem(section, currentSectionId, false);
        result.push(item);
        console.log("🔵 [useJuntasResumenSections] Agregada sección base:", item.id);
      }
    });

    // 2. Agregar sección "Puntos de Acuerdo" como contenedor
    const puntosAcuerdoItem: SectionItem = {
      id: "puntos-acuerdo",
      title: "Puntos de Acuerdo",
      description: "Síntesis de cada punto tratado y su estado actual dentro de la junta.",
      navigationType: "anchor",
      status: currentSectionId === "puntos-acuerdo" ? "current" : "upcoming",
      subSections: generatePuntosAcuerdoSections(allSections, currentSectionId),
    };

    result.push(puntosAcuerdoItem);
    console.log(
      "🔵 [useJuntasResumenSections] Agregada sección puntos-acuerdo con",
      puntosAcuerdoItem.subSections?.length || 0,
      "sub-secciones"
    );

    // 3. Actualizar status de todas las secciones según la sección actual
    result.forEach((item) => {
      if (item.id === currentSectionId) {
        item.status = "current";
      } else if (item.subSections) {
        const hasActiveSub = item.subSections.some((sub) => sub.id === currentSectionId);
        if (hasActiveSub) {
          item.status = "current";
        }
      }
    });

    console.log("🔵 [useJuntasResumenSections] Total de secciones generadas:", result.length);
    return result;
  });

  return {
    sections,
  };
};
