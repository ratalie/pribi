/**
 * Composable para handlers de eventos del layout
 */

import { useRouter } from "vue-router";
import type { Ref } from "vue";

/**
 * Gestiona los handlers de eventos del layout
 */
export function useJuntasLayoutHandlers(
  steps: Ref<any[]>,
  currentStepIndex: Ref<number>,
  currentSubStepId: Ref<string | undefined>,
  detectedCurrentSection: Ref<string>,
  finalSections: Ref<any[]>,
  handleSectionClick: (sectionId: string) => void
) {
  const router = useRouter();

  // Manejar click en paso
  const handleStepClick = (_stepId: string) => {
    // La navegación se maneja automáticamente por el NuxtLink en el sidebar
  };

  // Manejar click en sub-step
  const handleSubStepClick = (_subStepId: string) => {
    // La navegación se maneja automáticamente por el router en el sidebar
  };

  // Manejar botón "Salir"
  const handleBack = () => {
    const route = useRoute();
    // Intentar obtener societyId de la ruta actual
    const societyId = route.params.societyId;
    if (societyId) {
      router.push(`/operaciones/sociedades/${societyId}/junta-accionistas/historial`);
    } else {
      router.push("/operaciones/sociedades/junta-accionistas/historial");
    }
  };

  // Manejar botón "Guardar"
  const handleSave = () => {
    // TODO: Implementar lógica de guardado
    console.log("Guardar cambios");
  };

  // Manejar botón "Restablecer"
  const handleReset = () => {
    // TODO: Implementar lógica de restablecimiento
    console.log("Restablecer formulario");
  };

  // Manejar botón "Anterior"
  const handlePrev = () => {
    // Si estamos en una sección dentro de un sub-step, navegar a la sección anterior
    if (currentSubStepId.value && detectedCurrentSection.value) {
      const currentSections = finalSections.value;
      const currentIdx = currentSections.findIndex(
        (s) => s.id === detectedCurrentSection.value
      );

      if (currentIdx > 0) {
        const prevSection = currentSections[currentIdx - 1];
        if (prevSection) {
          handleSectionClick(prevSection.id);
          return;
        }
      }
    }

    // Si estamos en un paso principal, navegar al paso anterior
    const currentIdx = currentStepIndex.value;
    if (currentIdx > 0) {
      const prevStep = steps.value[currentIdx - 1];
      if (prevStep) {
        router.push(prevStep.route);
      }
    }
  };

  return {
    handleStepClick,
    handleSubStepClick,
    handleBack,
    handleSave,
    handleReset,
    handlePrev,
  };
}

