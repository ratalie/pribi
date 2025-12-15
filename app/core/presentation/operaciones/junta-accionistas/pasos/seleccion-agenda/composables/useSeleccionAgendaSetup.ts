/**
 * Composable de setup para selección de agenda
 * 
 * Inicializa y expone todos los composables necesarios
 * para que los paneles los usen sin props.
 * 
 * Este composable asegura que todos los componentes
 * compartan la misma instancia de los composables.
 */

import { useAgendaPreview } from "./useAgendaPreview";
import { useCategoriasAgenda } from "./useCategoriasAgenda";
import { useJuntaObligatoria } from "./useJuntaObligatoria";
import { usePuntosAgenda } from "./usePuntosAgenda";

// Instancias compartidas (singleton pattern)
let puntosAgendaInstance: ReturnType<typeof usePuntosAgenda> | null = null;
let categoriasInstance: ReturnType<typeof useCategoriasAgenda> | null = null;
let juntaObligatoriaInstance: ReturnType<typeof useJuntaObligatoria> | null = null;
let agendaPreviewInstance: ReturnType<typeof useAgendaPreview> | null = null;

export function useSeleccionAgendaSetup() {
  // Inicializar composables solo una vez (singleton)
  if (!puntosAgendaInstance) {
    puntosAgendaInstance = usePuntosAgenda();
  }

  if (!categoriasInstance) {
    categoriasInstance = useCategoriasAgenda();
  }

  if (!juntaObligatoriaInstance) {
    juntaObligatoriaInstance = useJuntaObligatoria(puntosAgendaInstance);
  }

  if (!agendaPreviewInstance) {
    const selectedPuntosForPreview = computed(() => [
      ...puntosAgendaInstance!.selectedPuntos.value,
    ]);
    agendaPreviewInstance = useAgendaPreview(selectedPuntosForPreview);
  }

  return {
    puntosAgenda: puntosAgendaInstance,
    categorias: categoriasInstance,
    juntaObligatoria: juntaObligatoriaInstance,
    agendaPreview: agendaPreviewInstance,
  };
}

