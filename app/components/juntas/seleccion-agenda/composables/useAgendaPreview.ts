/**
 * Composable para gestionar la vista previa de agenda
 * 
 * Responsabilidades:
 * - Generar agenda ordenada
 * - Agrupar por categoría para vista previa
 * - Calcular números de orden
 */

import type { PuntoAgenda } from "./usePuntosAgenda";
import { PUNTOS_AGENDA } from "./usePuntosAgenda";

export function useAgendaPreview(selectedPuntos: Ref<string[]> | ComputedRef<string[]>) {
  /**
   * Obtener agenda ordenada (solo puntos seleccionados)
   * Orden: Por categorías (orden de PUNTOS_AGENDA) y dentro de cada categoría, orden de aparición
   */
  const agendaOrdenada = computed(() => {
    const ordenados: PuntoAgenda[] = [];

    // Iterar sobre PUNTOS_AGENDA en su orden original
    PUNTOS_AGENDA.forEach((punto) => {
      // Si está seleccionado, agregarlo al array ordenado
      if (selectedPuntos.value.includes(punto.id)) {
        ordenados.push(punto);
      }
    });

    return ordenados;
  });

  /**
   * Obtener agenda agrupada por categoría (para vista previa)
   */
  const agendaPorCategoria = computed(() => {
    const categorias: Record<string, PuntoAgenda[]> = {};

    agendaOrdenada.value.forEach((punto) => {
      const categoria = punto.category;
      if (!categorias[categoria]) {
        categorias[categoria] = [];
      }
      categorias[categoria]!.push(punto);
    });

    return categorias;
  });

  /**
   * Obtener número de orden de un punto en la agenda
   */
  const getPuntoNumber = (puntoId: string): number => {
    const index = agendaOrdenada.value.findIndex((p) => p.id === puntoId);
    return index >= 0 ? index + 1 : 0;
  };

  /**
   * Verificar si hay puntos seleccionados
   */
  const hasPuntos = computed(() => {
    return agendaOrdenada.value.length > 0;
  });

  /**
   * Obtener total de puntos seleccionados
   */
  const totalPuntos = computed(() => {
    return agendaOrdenada.value.length;
  });

  return {
    // Estado
    agendaOrdenada,
    agendaPorCategoria,
    hasPuntos,
    totalPuntos,

    // Métodos
    getPuntoNumber,
  };
}

