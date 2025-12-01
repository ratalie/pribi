import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";
import { useJuntasNavbarStore } from "~/stores/useJuntasNavbarStore";

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

      // Navegar al siguiente paso
      console.log("🔍 [useJuntasFlowNext] Buscando siguiente paso para:", route.path);
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

