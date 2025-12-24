import type { TableConfig } from "~/types/tables/table-config";

/**
 * Configuración de tabla para Historial de Juntas
 * Actualizada con nuevas columnas: Fecha de la Junta, Nombre de Junta, Tipo de Junta
 */
export const historialJuntasTableConfig: TableConfig = {
  columns: [
    { id: 1, label: "Fecha de la Junta", key: "fechaJunta" },
    { id: 2, label: "Nombre de Junta", key: "nombreJunta" },
    { id: 3, label: "Tipo de Junta", key: "tipoJunta" },
    { id: 4, label: "Estado", key: "estado" },
    { id: 5, label: "", key: "edit-remove" },
  ],
  gridClass: "grid grid-cols-[1fr_3fr_1.5fr_1fr_auto]",
  containerClass: "",
};

/**
 * Props específicas para CustomTable cuando se usa para Historial de Juntas
 * Estilo v2.5: Tipografía, espaciado y colores mejorados
 */
export const historialJuntasTableProps = {
  headerTextSize: "text-sm" as const,
  containerPadding: "p-4" as const,
  headerPadding: "py-4.5 pr-16" as const,
  headerPaddingExtra: "gap-2" as const,
  rowTextColor: "text-layout-gray-800" as const,
  rowPadding: "py-5 pr-16" as const,
  rowHover: "hover:bg-[#f1eeff]" as const,
  borderColor: "border-gray-200" as const,
};

