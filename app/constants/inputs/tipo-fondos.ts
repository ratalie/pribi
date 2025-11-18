import { TipoFondoEnum } from "~/types/enums/TipoFondoEnum";

const tipoFondoLabels: Record<TipoFondoEnum, string> = {
  [TipoFondoEnum.CERRADO]: "Fondo cerrado",
  [TipoFondoEnum.ABIERTO]: "Fondo abierto",
  [TipoFondoEnum.MIXTO]: "Fondo mixto",
};

export const tipoFondoOptions = Object.values(TipoFondoEnum).map((tipo, index) => ({
  id: index + 1,
  value: tipo,
  label: tipoFondoLabels[tipo],
}));
