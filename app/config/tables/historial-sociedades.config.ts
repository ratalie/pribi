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
    { id: 5, label: "Fecha de Constitución", key: "fechaConstitucion" },
    { id: 6, label: "Fecha Registro", key: "fechaRegistro" },
    { id: 7, label: "Estado", key: "estado" },
    { id: 8, label: "", key: "edit-remove" },
  ],
  gridClass: "grid grid-cols-[3fr_1fr_2fr_1fr_1fr_1fr_1fr_auto]",
  containerClass: "",
};

/**
 * Props específicas para CustomTable cuando se usa para Historial de Sociedades
 * Estilo v2.5: Tipografía, espaciado y colores mejorados
 */
export const historialSociedadesTableProps = {
  headerTextSize: "text-sm" as const, // 14.4px (text-t1 equivalente)
  containerPadding: "p-4" as const, // Padding de 16px (p-4)
  headerPadding: "py-4.5 pr-16" as const, // py-4.5 (18px), pr-16 (64px)
  headerPaddingExtra: "gap-2" as const, // Gap de 8px
  rowTextColor: "text-layout-gray-800" as const, // #2e293d
  rowPadding: "py-5 pr-16" as const, // py-5 (20px), pr-16 (64px)
  rowHover: "hover:bg-[#f1eeff]" as const, // Hover color v2.5
  borderColor: "border-gray-200" as const, // Bordes grises
};
