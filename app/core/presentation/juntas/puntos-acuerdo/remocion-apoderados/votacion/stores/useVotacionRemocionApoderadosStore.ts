import { defineStore } from "pinia";

/**
 * Store para datos de votación de remoción de apoderados
 *
 * Responsabilidades:
 * - Generar textos de votación dinámicos por apoderado
 * - Gestionar lista de apoderados a remover (hardcodeada por ahora)
 */

/**
 * ⚠️ DATOS MOCK - Temporal hasta que tengamos el endpoint
 * TODO: Reemplazar con GET que obtenga los apoderados seleccionados
 */
interface ApoderadoParaRemover {
  id: string;
  nombre: string;
  puesto: string; // Clase de apoderado (ej: "Apoderado Especial", "Apoderado Judicial")
}

const APODERADOS_MOCK: ApoderadoParaRemover[] = [
  {
    id: "mock-1",
    nombre: "Luis Martínez Torres",
    puesto: "Apoderado Especial",
  },
  {
    id: "mock-2",
    nombre: "Ana Fernández Sánchez",
    puesto: "Apoderado Judicial",
  },
  {
    id: "mock-3",
    nombre: "Carlos Vargas Ramírez",
    puesto: "Apoderado Comercial",
  },
];

export const useVotacionRemocionApoderadosStore = defineStore("votacionRemocionApoderados", {
  state: (): { metodoVotacion: "unanimidad" | "mayoria" } => ({
    metodoVotacion: "unanimidad",
  }),

  getters: {
    /**
     * Obtiene la lista de apoderados para remover
     * ⚠️ MOCK: Por ahora retorna datos hardcodeados
     * TODO: Reemplazar con GET que obtenga los apoderados seleccionados
     */
    apoderadosParaRemover(): ApoderadoParaRemover[] {
      // ⚠️ TEMPORAL: Retornar datos mock
      // TODO: Implementar GET para obtener apoderados seleccionados
      return APODERADOS_MOCK;
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
