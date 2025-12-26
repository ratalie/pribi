/**
 * Composable para gestionar navegación en el flujo de Juntas
 */

import { computed, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getSectionNavigation, findParentSectionForAnchor, detectCurrentSection } from "~/utils/juntas/navigation.utils";
import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";

/**
 * Gestiona la navegación entre secciones
 */
export function useJuntasNavigation(
  isResumenPage: { value: boolean },
  currentSubStepId: { value: string | undefined }
) {
  const route = useRoute();
  const router = useRouter();
  const juntasFlowStore = useJuntasFlowStore();

  // Detectar la sección actual
  const detectedCurrentSection = computed(() => {
    const path = route.path;
    const hash = route.hash?.replace("#", "") || "";
    return detectCurrentSection(path, hash, currentSubStepId.value);
  });

  // Manejar click en sección
  const handleSectionClick = (sectionId: string) => {
    console.log("🟦 [useJuntasNavigation] handleSectionClick:", sectionId);
    juntasFlowStore.setCurrentSection(sectionId);

    // Si estamos en resumen, todas las secciones son anclas
    if (isResumenPage.value) {
      console.log("🟦 [useJuntasNavigation] Navegando a ancla en resumen:", sectionId);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        router.replace({ hash: `#${sectionId}` });
      }
      return;
    }

    // ⭐ Extraer societyId y flowId de los parámetros de la ruta
    const societyId = route.params.societyId as string | undefined;
    const flowId = route.params.flowId as string | undefined;
    const navigation = getSectionNavigation(sectionId, currentSubStepId.value, societyId, flowId);
    const currentPath = route.path;

    if (navigation) {
      if (navigation.type === "route") {
        console.log("🟦 [useJuntasNavigation] Navegando a ruta:", navigation.target);
        router.push(navigation.target);
      } else {
        // Es un ancla
        console.log("🟦 [useJuntasNavigation] Navegando a ancla:", navigation.target);

        // Buscar la sección padre de esta ancla
        const parentInfo = findParentSectionForAnchor(
          sectionId,
          currentSubStepId.value,
          societyId,
          flowId
        );

        if (parentInfo) {
          // Verificar si estamos en la página correcta
          const isOnParentPage = currentPath.includes(
            parentInfo.parentRoute.split("/").pop() || ""
          );

          if (!isOnParentPage) {
            // Estamos en otra ruta, navegar primero a la página padre con el hash
            console.log(
              "🟦 [useJuntasNavigation] Navegando primero a página padre:",
              parentInfo.parentRoute
            );
            router.push(`${parentInfo.parentRoute}#${navigation.target}`).then(() => {
              // Después de navegar, hacer scroll cuando la página se cargue
              nextTick(() => {
                const element = document.getElementById(navigation.target);
                if (element) {
                  setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 100);
                }
              });
            });
          } else {
            // Ya estamos en la página correcta, solo hacer scroll
            const element = document.getElementById(navigation.target);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
              router.replace({ hash: `#${navigation.target}` });
            }
          }
        } else {
          // No se encontró padre, intentar scroll directo
          const element = document.getElementById(navigation.target);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            router.replace({ hash: `#${navigation.target}` });
          }
        }
      }
    } else {
      // Si no hay mapeo, intentar scroll a un elemento con ese ID (ancla por defecto)
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        router.replace({ hash: `#${sectionId}` });
      }
    }
  };

  return {
    detectedCurrentSection,
    handleSectionClick,
  };
}

