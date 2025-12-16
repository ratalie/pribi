import { defineStore } from "pinia";
import { useRemocionApoderadosStore } from "../../stores/useRemocionApoderadosStore";

/**
 * Store para datos de votación de remoción de apoderados
 *
 * Responsabilidades:
 * - Generar textos de votación dinámicos por apoderado
 * - Obtener lista de apoderados desde el store de remoción
 *
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 */

/**
 * Helper: Obtener nombre completo de una persona
 */
function getNombreCompletoPersona(persona: {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string | null;
  razonSocial?: string | null;
}): string {
  if (persona.razonSocial) {
    return persona.razonSocial;
  }
  return `${persona.nombre} ${persona.apellidoPaterno} ${
    persona.apellidoMaterno || ""
  }`.trim();
}

export const useVotacionRemocionApoderadosStore = defineStore("votacionRemocionApoderados", {
  state: () => ({
    // Estado vacío por ahora, todo se calcula en getters
  }),

  getters: {
    /**
     * Obtiene la lista de apoderados para remover desde el store de remoción
     * ✅ Reemplaza datos MOCK con datos reales
     */
    apoderadosParaRemover() {
      const remocionStore = useRemocionApoderadosStore();

      // Si hay candidatos cargados, usarlos
      if (remocionStore.candidatos.length > 0) {
        return remocionStore.candidatos.map((c) => ({
          id: c.attorneyId,
          nombre: getNombreCompletoPersona(c.persona),
          puesto: c.claseApoderado.nombre,
        }));
      }

      // Si hay seleccionados pero no candidatos cargados, retornar array vacío
      // (los candidatos se cargarán después de crearlos)
      if (remocionStore.apoderadosSeleccionados.length > 0) {
        console.warn(
          "[Store][VotacionRemocionApoderados] Hay seleccionados pero no candidatos cargados. Cargar candidatos primero."
        );
        return [];
      }

      // Fallback: retornar array vacío (no hay apoderados seleccionados)
      return [];
    },

    /**
     * Genera las preguntas de votación para cada apoderado
     * Formato: "Se aprueba la remoción del apoderado [nombre] de sus funciones como [puesto]"
     */
    preguntasVotacion(): string[] {
      return this.apoderadosParaRemover.map(
        (apoderado) =>
          `Se aprueba la remoción del apoderado ${apoderado.nombre} de sus funciones como ${apoderado.puesto}.`
      );
    },

    /**
     * Obtiene el mensaje de aprobación genérico
     */
    mensajeAprobacion(): string {
      return "la remoción de los apoderados seleccionados.";
    },
  },
});
