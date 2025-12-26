/**
 * Sistema de configuración de tablas reutilizable
 * Inspirado en v2.5 header.data.ts
 */

export interface TableColumn {
  id: number;
  label: string;
  key: string;
  /** Clase CSS opcional para la columna */
  class?: string;
  /** Si la columna debe estar alineada a la izquierda, centro o derecha */
  align?: "left" | "center" | "right";
}

export interface TableConfig {
  /** Columnas de la tabla */
  columns: TableColumn[];
  /** Clase CSS para el contenedor grid (ej: "grid grid-cols-[3fr_1fr_2fr]") */
  gridClass: string;
  /** Clase CSS adicional para el contenedor */
  containerClass?: string;
}

export interface TableAction {
  /** ID único de la acción */
  id: string;
  /** Etiqueta visible */
  label: string;
  /** Icono (lucide-vue-next o string) */
  icon?: string;
  /** Si la acción es destructiva (roja) */
  destructive?: boolean;
  /** Si la acción está deshabilitada */
  disabled?: boolean;
  /** Handler de la acción */
  handler: (rowData: any) => void | Promise<void>;
}

export interface TableCellRenderer {
  /** Key de la columna a renderizar */
  columnKey: string;
  /** Función que renderiza el contenido de la celda */
  render: (rowData: any, column: TableColumn) => any;
}

export interface CustomTableProps {
  /** Configuración de la tabla */
  config: TableConfig;
  /** Datos a mostrar */
  data: any[];
  /** Si está cargando */
  isLoading?: boolean;
  /** Mensaje cuando no hay datos */
  emptyMessage?: string;
  /** Renderizadores personalizados para celdas específicas */
  cellRenderers?: TableCellRenderer[];
  /** Acciones del dropdown (opcional) */
  actions?: TableAction[];
  /** Función para obtener el ID único de cada fila */
  getRowId?: (row: any) => string | number;
  /** Clase CSS adicional para las filas */
  rowClass?: string;
  /** Altura máxima del contenedor scrollable */
  maxHeight?: string;
  /** Tamaño de texto del header: 'text-t1' (más grande) o 'text-t2' (más pequeño) */
  headerTextSize?: "text-t1" | "text-t2" | "t-b1" | "t-b2";
  /** Padding del contenedor principal: 'p-4' (default) o 'py-4 px-8' (sociedades) */
  containerPadding?: "p-4" | "py-4 px-8" | "py-2 px-2" | "py-3 px-4";
  /** Padding del header: 'py-4' (default) o 'py-4.5' (similar a py-spc-18) */
  headerPadding?: "py-4" | "py-4.5" | "py-2" | "py-3";
  /** Padding adicional del header (ej: 'pr-16 gap-2' para juntas) */
  headerPaddingExtra?: string;
  /** Color de texto de las filas: 'text-layout-gray-700' o 'text-layout-gray-800' */
  rowTextColor?: "text-layout-gray-700" | "text-layout-gray-800";
}

