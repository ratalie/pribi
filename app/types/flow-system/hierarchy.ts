/**
 * FlowItemHierarchy
 *
 * Define la estructura jerárquica y relaciones entre FlowItems.
 *
 * @module FlowItemHierarchy
 */

/**
 * Interfaz para la jerarquía de un FlowItem
 *
 * Agrupa todas las propiedades relacionadas con la posición
 * del item en la estructura jerárquica del flujo.
 */
export interface FlowItemHierarchy {
  /**
   * ID del item padre (null si es raíz)
   *
   * @example 'seccion-documentos'
   */
  parentId: string | null;

  /**
   * Nivel de profundidad en la jerarquía
   * 0 = raíz, 1 = hijo directo, 2 = nieto, etc.
   *
   * @example 0, 1, 2, 3
   */
  level: number;

  /**
   * Índice de orden dentro del mismo nivel
   * Determina la posición relativa entre hermanos
   *
   * @example 0, 1, 2, 3
   */
  order: number;

  /**
   * IDs de los items hijos (opcional)
   * Se calcula automáticamente en algunos casos
   *
   * @example ['paso-1-1', 'paso-1-2']
   */
  children?: string[];

  /**
   * Path completo desde la raíz hasta este item
   * Útil para navegación y breadcrumbs
   *
   * @example ['seccion-1', 'subseccion-1-1', 'paso-1-1-1']
   */
  path?: string[];

  /**
   * Profundidad máxima permitida para hijos
   * null = sin límite
   *
   * @example 2 (permite hasta 2 niveles de hijos)
   */
  maxDepth?: number | null;

  /**
   * Permitir reordenamiento por drag & drop (opcional)
   *
   * @default false
   */
  sortable?: boolean;

  /**
   * Puede tener hijos dinámicamente (opcional)
   *
   * @default false
   */
  canHaveChildren?: boolean;
}
