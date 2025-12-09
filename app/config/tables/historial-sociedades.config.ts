import type { TableConfig } from "~/types/tables/table-config";

/**
 * Configuración de tabla para Historial de Sociedades
 * Inspirada en v2.5 listadoSociedades
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

