import type { TableConfig } from "~/types/tables/table-config";

/**
 * Configuración de tabla para Historial de Sociedades
 * Replica exactamente los estilos de v2.5 CustomTableSociedades
 */
export const historialSociedadesTableConfig: TableConfig = {
  columns: [
    { id: 1, label: "Razón Social", key: "razonSocial" },
    { id: 2, label: "RUC", key: "ruc" },
    { id: 3, label: "Nombre Comercial", key: "nombreComercial" },
    { id: 4, label: "Tipo de Sociedad", key: "tipoSociedad" },
    { id: 5, label: "Estado", key: "estado" },
    { id: 6, label: "", key: "edit-remove" },
  ],
  gridClass: "grid grid-cols-[3fr_1fr_2fr_1fr_1fr_2fr]",
  containerClass: "",
};

/**
 * Props específicas para CustomTable cuando se usa para Historial de Sociedades
 * Estas props replican los estilos exactos de v2.5
 */
export const historialSociedadesTableProps = {
  headerTextSize: "text-t2" as const,
  containerPadding: "py-4 px-8" as const,
  headerPadding: "py-4.5" as const, // Similar a py-spc-18 de v2.5
  headerPaddingExtra: "gap-4 pl-8" as const, // Estilo específico de v2.5
  rowTextColor: "text-layout-gray-700" as const,
};

