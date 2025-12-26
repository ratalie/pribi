/**
 * Configuración de tabla para Dashboard de Juntas
 * Replica los estilos de v2.5 CustomTableJuntas
 */

import type { TableConfig } from "~/types/tables/table-config";

export const juntasTableConfig: TableConfig = {
  columns: [
    { id: 1, label: "", key: "empty" },
    { id: 2, label: "Fecha de creación", key: "createdAt" },
    { id: 3, label: "Tipo", key: "type" },
    { id: 4, label: "Categoría", key: "category" },
    { id: 5, label: "Acción", key: "action" },
    { id: 6, label: "Estado", key: "state" },
    { id: 7, label: "", key: "options" },
  ],
  gridClass: "grid grid-cols-[0.5fr_1.5fr_2fr_2fr_2fr_1fr_1fr]",
};

/**
 * Props específicas para CustomTable cuando se usa para Dashboard de Juntas
 * Estas props replican los estilos exactos de v2.5
 */
export const juntasTableProps = {
  headerTextSize: "text-t1" as const,
  containerPadding: "p-4" as const,
  headerPadding: "py-4.5" as const, // Similar a py-spc-18
  headerPaddingExtra: "pr-16 gap-2" as const,
  rowTextColor: "text-layout-gray-800" as const,
};




