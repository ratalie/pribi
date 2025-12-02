import type { CascadeSelectOption } from "~/components/base/inputs/text/BaseCascadeSelect.vue";
import { TipoAccionistaEnum } from "~/schemas/enums/TipoAccionistaEnum";

export const accionistaTypes: CascadeSelectOption[] = [
  {
    id: TipoAccionistaEnum.NATURAL,
    value: TipoAccionistaEnum.NATURAL,
    label: "Persona Natural",
    icon: "User",
  },
  {
    id: TipoAccionistaEnum.JURIDICA,
    value: TipoAccionistaEnum.JURIDICA,
    label: "Persona Jurídica",
    icon: "Building",
  },
  {
    id: TipoAccionistaEnum.SUCURSAL,
    value: TipoAccionistaEnum.SUCURSAL,
    label: "Sucursal",
    icon: "Building2",
  },
  {
    id: "patrimonios",
    value: "patrimonios_parent",
    label: "Patrimonios autónomos",
    icon: "Vault",
    disabled: false,
    children: [
      {
        id: TipoAccionistaEnum.SUCESIONES_INDIVISAS,
        value: TipoAccionistaEnum.SUCESIONES_INDIVISAS,
        label: "Sucesiones Indivisas",
      },
      {
        id: TipoAccionistaEnum.FIDEICOMISOS,
        value: TipoAccionistaEnum.FIDEICOMISOS,
        label: "Fideicomisos",
      },
      {
        id: TipoAccionistaEnum.FONDOS_INVERSION,
        value: TipoAccionistaEnum.FONDOS_INVERSION,
        label: "Fondos de Inversión",
      },
    ],
  },
];
