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
 * Tipografía optimizada con clases Tailwind 4 personalizadas
 */
export const historialSociedadesTableProps = {
  headerTextSize: "t-b2" as const, // 11.2px - headers más pequeños
  containerPadding: "py-2 px-2" as const, // Padding reducido al mínimo
  headerPadding: "py-2" as const, // Padding vertical mínimo
  headerPaddingExtra: "gap-2 pl-2" as const, // Gap y padding mínimos
  rowTextColor: "text-layout-gray-700" as const,
};
