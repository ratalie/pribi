import { TipoFondoEnum } from "~/types/enums/TipoFondoEnum";

const tipoFondoLabels: Record<TipoFondoEnum, string> = {
  [TipoFondoEnum.PRIVADO]: "Fondo privado",
  [TipoFondoEnum.PUBLICO]: "Fondo público",
};

export const tipoFondoOptions = Object.values(TipoFondoEnum).map((tipo, index) => ({
  id: index + 1,
  value: tipo,
  label: tipoFondoLabels[tipo],
}));
