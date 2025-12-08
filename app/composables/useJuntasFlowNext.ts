import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";
import { useJuntasNavbarStore } from "~/stores/useJuntasNavbarStore";
import { getBaseSectionsForSubStep } from "~/config/juntas/sections.config";
import { getSectionRoutesForSubStep } from "~/config/juntas/navigation-routes.config";
import { detectCurrentSection } from "~/utils/juntas/navigation.utils";
import { buildBasePath } from "~/utils/juntas/route-detection.utils";

type FlowNextHandler = (() => void) | (() => Promise<void>);

/**
 * Composable para configurar el handler del botón "Siguiente" en el flujo de Juntas
 * 
 * Similar a useFlowLayoutNext pero adaptado para usar los stores de juntas.
 * 
 * @param handleNext Función que se ejecuta antes de navegar al siguiente paso
 *                   Puede ser síncrona o asíncrona (para validaciones/guardado)
 * 
 * @example
 * ```vue
 * <script setup>
 * useJuntasFlowNext(async () => {
 *   // Validar formulario
 *   await validateForm();
 *   
 *   // Guardar datos
 *   await saveData();
 *   
 *   // El composable automáticamente navega al siguiente paso
 * });
 * </script>
 * ```
 */
export const useJuntasFlowNext = (handleNext: FlowNextHandler) => {
  const juntasFlowStore = useJuntasFlowStore();
  const juntasNavbarStore = useJuntasNavbarStore();
  const router = useRouter();
  const route = useRoute();

  // Configurar el handler inmediatamente (no esperar a onMounted)
  // Esto asegura que el handler esté disponible cuando el botón se renderice
  const handler = async () => {
    console.log("🎯 [useJuntasFlowNext] onClickNext ejecutado desde el botón");
    console.log("🎯 [useJuntasFlowNext] Ruta actual:", route.path);
    try {
      juntasFlowStore.isLoading = true;
      console.log("⏳ [useJuntasFlowNext] Loading activado");
      
      // Ejecutar el handler (validación/guardado)
      console.log("▶️ [useJuntasFlowNext] Ejecutando handleNext...");
      await handleNext();
      console.log("✅ [useJuntasFlowNext] handleNext completado exitosamente");

      // Intentar navegar entre secciones del sub-step actual primero
      const currentSubStepId = juntasFlowStore.currentSubStepId;
      console.log("🔍 [useJuntasFlowNext] Sub-step actual:", currentSubStepId);
      
      if (currentSubStepId) {
        // Obtener las secciones del sub-step
        const sections = getBaseSectionsForSubStep(currentSubStepId);
        console.log("🔍 [useJuntasFlowNext] Secciones disponibles:", sections.map(s => s.id));
        
        if (sections.length > 0) {
          // Detectar la sección actual
          const path = route.path;
          const hash = route.hash?.replace("#", "") || "";
          const currentSectionId = detectCurrentSection(path, hash, currentSubStepId);
          console.log("🔍 [useJuntasFlowNext] Sección actual detectada:", currentSectionId);
          
          // Encontrar el índice de la sección actual
          const currentSectionIndex = sections.findIndex(s => s.id === currentSectionId);
          console.log("🔍 [useJuntasFlowNext] Índice de sección actual:", currentSectionIndex);
          
          // Si hay una sección siguiente dentro del sub-step
          if (currentSectionIndex >= 0 && currentSectionIndex < sections.length - 1) {
            const nextSection = sections[currentSectionIndex + 1];
            if (nextSection) {
              console.log("🔍 [useJuntasFlowNext] Siguiente sección encontrada:", nextSection.id);
              
              // Obtener la ruta de la siguiente sección
              const societyId = route.params.societyId as string;
              const flowId = route.params.flowId as string;
              const basePath = buildBasePath(societyId, flowId);
              const sectionRoutes = getSectionRoutesForSubStep(currentSubStepId, basePath);
              
              if (sectionRoutes && nextSection.id && sectionRoutes[nextSection.id]) {
                const nextRoute = sectionRoutes[nextSection.id];
                if (nextRoute) {
                  console.log("🚀 [useJuntasFlowNext] Navegando a siguiente sección:", nextRoute);
                  await router.push(nextRoute);
                  console.log("✅ [useJuntasFlowNext] Navegación a sección completada");
                  return; // Salir temprano, ya navegamos
                }
              }
            }
          } else {
            console.log("ℹ️ [useJuntasFlowNext] No hay más secciones en el sub-step, buscando siguiente paso principal");
          }
        }
      }

      // Si no hay más secciones en el sub-step, navegar al siguiente paso principal
      console.log("🔍 [useJuntasFlowNext] Buscando siguiente paso principal para:", route.path);
      const nextStep = juntasNavbarStore.getNextStepByCurrentStep(route.path);
      console.log("🔍 [useJuntasFlowNext] Siguiente paso encontrado:", nextStep);

      if (nextStep) {
        console.log("🚀 [useJuntasFlowNext] Navegando a:", nextStep.route);
        await router.push(nextStep.route);
        console.log("✅ [useJuntasFlowNext] Navegación completada");
      } else {
        console.warn("⚠️ [useJuntasFlowNext] No se encontró siguiente paso");
        console.warn("⚠️ [useJuntasFlowNext] Pasos disponibles:", juntasNavbarStore.steps.map(s => ({ title: s.title, route: s.route })));
      }
    } catch (error) {
      console.error("❌ [useJuntasFlowNext] Error:", error);
      // El error se propaga para que el componente pueda manejarlo
      throw error;
    } finally {
      juntasFlowStore.isLoading = false;
      console.log("⏳ [useJuntasFlowNext] Loading desactivado");
    }
  };

  // Configurar el handler en el store inmediatamente
  juntasFlowStore.onClickNext = handler;
  console.log("✅ [useJuntasFlowNext] Handler configurado inmediatamente");
  console.log("✅ [useJuntasFlowNext] Ruta actual:", route.path);

  onUnmounted(() => {
    // Solo limpiar si el handler actual es el que configuramos
    // Esto evita que se limpie si otro componente ya configuró un nuevo handler
    if (juntasFlowStore.onClickNext === handler) {
      console.log("🧹 [useJuntasFlowNext] Limpiando handler al desmontar");
      juntasFlowStore.clearValues();
    } else {
      console.log("ℹ️ [useJuntasFlowNext] Handler ya fue reemplazado, no limpiar");
    }
  });
};

