/**
 * Controller para la lógica de selección de agenda
 * 
 * Responsabilidades:
 * - Validar selección de puntos
 * - Convertir y guardar agenda items
 * - Manejar errores
 */

import { AgendaItemsMapper } from "~/core/hexag/juntas/infrastructure/mappers/agenda-items.mapper";
import { useAgendaItemsStore } from "~/core/presentation/juntas/stores/agenda-items.store";
import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";

export function useSeleccionAgendaController() {
  const juntasFlowStore = useJuntasFlowStore();
  const agendaItemsStore = useAgendaItemsStore();

  /**
   * Valida que haya al menos un punto seleccionado
   */
  const validateSelection = (): string[] => {
    const selectedPuntos = juntasFlowStore.getDynamicSubSteps;

    if (selectedPuntos.length === 0) {
      throw new Error("Debes seleccionar al menos un punto de agenda para continuar.");
    }

    return selectedPuntos;
  };

  /**
   * Guarda los puntos de agenda seleccionados
   */
  const saveAgendaItems = async (societyId: number, flowId: number): Promise<void> => {
    // Validar selección
    const selectedPuntos = validateSelection();

    // Convertir IDs del frontend a estructura del backend
    const payload = AgendaItemsMapper.frontendIdsToDTO(selectedPuntos);

    // Guardar en el backend
    await agendaItemsStore.saveAgendaItems(societyId, flowId, payload);
  };

  /**
   * Handler completo para el botón "Siguiente"
   * Incluye validación de IDs y guardado
   */
  const handleNext = async (societyId: number | null, flowId: string | null): Promise<void> => {
    // Validar IDs
    if (!societyId || !flowId) {
      throw new Error(
        "No se pudo identificar la sociedad o la junta. Por favor, recarga la página."
      );
    }

    // Convertir flowId a number
    const flowIdNumber = parseInt(flowId, 10);
    if (Number.isNaN(flowIdNumber)) {
      throw new Error("ID de junta inválido.");
    }

    // Guardar
    await saveAgendaItems(societyId, flowIdNumber);
  };

  return {
    validateSelection,
    saveAgendaItems,
    handleNext,
  };
}

