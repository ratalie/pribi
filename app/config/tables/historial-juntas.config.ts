import type { TableConfig } from "~/types/tables/table-config";

/**
 * Configuración de tabla para Historial de Juntas
 * Inspirada en v2.5 listadoJuntasEdit
 */
export const historialJuntasTableConfig: TableConfig = {
  columns: [
    { id: 1, label: "", key: "spacer" },
    { id: 2, label: "Fecha de creación", key: "fechaCreacion" },
    { id: 3, label: "Tipo", key: "tipo" },
    { id: 4, label: "Categoría", key: "categoria" },
    { id: 5, label: "Acción", key: "accion" },
    { id: 6, label: "Estado", key: "estado" },
    { id: 7, label: "", key: "options" },
  ],
  gridClass: "grid grid-cols-[0.5fr_1.5fr_2fr_2fr_2fr_1fr_1fr]",
  containerClass: "",
};

