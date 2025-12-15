/**
 * Composable para gestionar la lógica de categorías de agenda
 * 
 * Responsabilidades:
 * - Gestionar estado de categorías expandidas/colapsadas
 * - Agrupar puntos por categoría
 * - Toggle de categorías
 */

import type { PuntoAgenda } from "../types/puntos-agenda.types";
import { PUNTOS_AGENDA } from "../types/puntos-agenda.types";

export function useCategoriasAgenda() {
  // Estado de categorías expandidas (por defecto todas expandidas)
  const expandedCategories = ref<string[]>([
    "Aumento de Capital",
    "Remoción",
    "Nombramiento",
    "Gestión Social y Resultados Económicos",
  ]);

  /**
   * Toggle de categoría (expandir/colapsar)
   */
  const toggleCategory = (category: string) => {
    if (expandedCategories.value.includes(category)) {
      expandedCategories.value = expandedCategories.value.filter((c) => c !== category);
    } else {
      expandedCategories.value.push(category);
    }
  };

  /**
   * Verificar si una categoría está expandida
   */
  const isCategoryExpanded = (category: string): boolean => {
    return expandedCategories.value.includes(category);
  };

  /**
   * Expandir todas las categorías
   */
  const expandAll = () => {
    const allCategories = Array.from(
      new Set(PUNTOS_AGENDA.map((p) => p.category))
    );
    expandedCategories.value = [...allCategories];
  };

  /**
   * Colapsar todas las categorías
   */
  const collapseAll = () => {
    expandedCategories.value = [];
  };

  /**
   * Agrupar puntos por categoría
   */
  const puntosPorCategoria = computed(() => {
    const categorias: Record<string, PuntoAgenda[]> = {};

    PUNTOS_AGENDA.forEach((punto) => {
      const categoria = punto.category;
      if (!categorias[categoria]) {
        categorias[categoria] = [];
      }
      categorias[categoria]!.push(punto);
    });

    return categorias;
  });

  /**
   * Obtener lista de todas las categorías
   */
  const allCategories = computed(() => {
    return Array.from(new Set(PUNTOS_AGENDA.map((p) => p.category)));
  });

  return {
    // Estado
    expandedCategories: readonly(expandedCategories),
    puntosPorCategoria,
    allCategories,

    // Métodos
    toggleCategory,
    isCategoryExpanded,
    expandAll,
    collapseAll,
  };
}

