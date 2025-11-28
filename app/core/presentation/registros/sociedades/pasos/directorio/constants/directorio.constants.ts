import type { TableColumn } from "~/components/base/tables/getColumns";
import type { TypeOption } from "~/types/TypeOptions";
import type { DirectorTableRow } from "../utils/useDirectoresComputed";

/**
 * Opciones para la duración del directorio
 */
export const termOptions: TypeOption[] = [
  {
    id: 1,
    label: "1 año",
    name: "1 año",
    value: "1",
    acronimo: "1",
  },
  {
    id: 2,
    label: "2 años",
    name: "2 años",
    value: "2",
    acronimo: "2",
  },
  {
    id: 3,
    label: "3 años",
    name: "3 años",
    value: "3",
    acronimo: "3",
  },
];

/**
 * Columnas de la tabla de directores
 */
export const directoresColumns: TableColumn<DirectorTableRow>[] = [
  { key: "nombres_apellidos", label: "Nombres y Apellidos", type: "text" },
  { key: "tipo_documento", label: "Tipo de Documento", type: "text" },
  { key: "numero_documento", label: "Nº de Documento", type: "text" },
  { key: "tipo_director", label: "Tipo de Director", type: "text" },
  { key: "reemplazo_asignado", label: "Reemplazo asignado", type: "text" },
];
