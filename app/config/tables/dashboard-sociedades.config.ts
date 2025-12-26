/**
 * Configuración de tabla para Dashboard de Sociedades
 * Replica los estilos de v2.5 CustomTableSociedades
 */

import type { TableConfig } from "~/types/tables/table-config";

export const sociedadesTableConfig: TableConfig = {
  columns: [
    { id: 1, label: "Razón Social", key: "name" },
    { id: 2, label: "RUC", key: "ruc" },
    { id: 3, label: "Nombre Comercial", key: "commercialName" },
    { id: 4, label: "Tipo de Sociedad", key: "societyType" },
    { id: 5, label: "Estado", key: "state" },
    { id: 6, label: "", key: "edit-remove" },
  ],
  gridClass: "grid grid-cols-[3fr_1fr_2fr_1fr_1fr_2fr]",
};

/**
 * Props específicas para CustomTable cuando se usa para Dashboard de Sociedades
 * Estas props replican los estilos exactos de v2.5
 */
export const sociedadesTableProps = {
  headerTextSize: "text-t2" as const,
  containerPadding: "py-4 px-8" as const,
  headerPadding: "py-4.5" as const, // Similar a py-spc-18
  rowTextColor: "text-layout-gray-700" as const,
};




