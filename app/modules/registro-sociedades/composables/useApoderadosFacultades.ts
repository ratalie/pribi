import type { TableColumn } from "~/components/base/tables/getColumns";
import { useRegimenFacultadesStore } from "../stores/useRegimenFacultadesStore";
import type { FacultadRow } from "../types/apoderadosFacultades";

export const useApoderadosFacultades = () => {
  const _regimenFacultadesStore = useRegimenFacultadesStore();

  const apoderadoFacultadHeaders: TableColumn<FacultadRow>[] = [
    { key: "facultad", label: "Tipo de Facultad", type: "text" },
    { key: "vigencia", label: "Vigencia", type: "text" },
    { key: "reglas_firma", label: "Reglas de Firma", type: "text" },
  ];

  const facultadActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (id: string) => {
        console.log("Editar poder", id);
      },
    },
    {
      label: "Ver",
      icon: "SquarePen",
      onClick: (id: string) => {
        console.log("Ver poder", id);
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (id: string) => {
        console.log("Eliminar poder", id);
      },
    },
  ];

  return {
    apoderadoFacultadHeaders,
    facultadActions,
  };
};
