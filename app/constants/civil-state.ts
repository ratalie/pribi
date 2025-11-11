import { EstadoCivilEnum } from "~/types/enums/EstadoCivilEnum";

export const estadoCivilOptions = Object.values(EstadoCivilEnum).map((estado, index) => ({
  id: index + 1,
  value: estado,
  label: estado,
}));
