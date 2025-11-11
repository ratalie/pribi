import { TiposDirectoresEnum } from "~/types/enums/TiposDirectoresEnum";

export const tipoDirectoresOptions = Object.values(TiposDirectoresEnum).map((tipo, index) => ({
  id: index + 1,
  value: tipo,
  label: tipo,
}));
