import { TipoFondoEnum } from "~/types/enums/TipoFondoEnum";

export const tipoFondoOptions = Object.values(TipoFondoEnum).map((tipo, index) => ({
  id: index + 1,
  value: tipo,
  label: tipo,
}));
