export const useGerenteGeneral = () => {
  const handleEditarGerenteGeneral = (claseId: string) => {
    console.log("Editar gerente general", claseId);
  };

  const handleEliminarGerenteGeneral = (claseId: string) => {
    console.log("Eliminar gerente general", claseId);
  };

  const gerenteActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: handleEditarGerenteGeneral,
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: handleEliminarGerenteGeneral,
    },
  ];

  return {
    gerenteActions,
  };
};
