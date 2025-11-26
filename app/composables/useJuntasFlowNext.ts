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

  onMounted(() => {
    juntasFlowStore.onClickNext = async () => {
      try {
        juntasFlowStore.isLoading = true;
        
        // Ejecutar el handler (validación/guardado)
        await handleNext();

        // Navegar al siguiente paso
        const nextStep = juntasNavbarStore.getNextStepByCurrentStep(route.path);

        if (nextStep) {
          router.push(nextStep.route);
        }
      } catch (error) {
        console.error("Error en useJuntasFlowNext:", error);
        // El error se propaga para que el componente pueda manejarlo
        throw error;
      } finally {
        juntasFlowStore.isLoading = false;
      }
    };
  });

  onUnmounted(() => {
    // Limpiar el handler al desmontar el componente
    juntasFlowStore.clearValues();
  });
};

