import { TiposDirectoresEnum } from "~/types/enums/TiposDirectoresEnum";
export const tipoDirectorOptions = [
  {
    id: 1,
    value: TiposDirectoresEnum.TITULAR,
    label: "Titular",
  },
  {
    id: 2,
    value: TiposDirectoresEnum.SUPLENTE,
    label: "Suplente",
  },
  {
    id: 3,
    value: TiposDirectoresEnum.ALTERNO,
    label: "Alterno",
  },
];
