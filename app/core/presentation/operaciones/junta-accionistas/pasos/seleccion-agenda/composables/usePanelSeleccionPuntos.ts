/**
 * Composable para el Panel de Selección de Puntos
 * 
 * Maneja toda la lógica del panel:
 * - Acceso a composables compartidos
 * - Handler para toggle de puntos
 * - Sincronización con junta obligatoria
 */

import { useSeleccionAgendaSetup } from "./useSeleccionAgendaSetup";

export function usePanelSeleccionPuntos() {
  // Obtener composables compartidos
  const { puntosAgenda, categorias, juntaObligatoria } = useSeleccionAgendaSetup();

  /**
   * Handler para toggle de punto
   */
  const handleTogglePunto = (puntoId: string, checked: boolean) => {
    if (checked) {
      puntosAgenda.addPunto(puntoId);
    } else {
      puntosAgenda.removePunto(puntoId);
    }
    // Sincronizar junta obligatoria después de cambiar puntos
    juntaObligatoria.syncFromPuntos();
  };

  /**
   * Handler para toggle de categoría
   */
  const handleToggleCategory = (categoria: string) => {
    categorias.toggleCategory(categoria);
  };

  /**
   * Handler para toggle de junta obligatoria
   */
  const handleToggleJuntaObligatoria = () => {
    juntaObligatoria.toggleJuntaObligatoria();
  };

  return {
    // Composables compartidos
    puntosAgenda,
    categorias,
    juntaObligatoria,
    
    // Handlers
    handleTogglePunto,
    handleToggleCategory,
    handleToggleJuntaObligatoria,
  };
}

