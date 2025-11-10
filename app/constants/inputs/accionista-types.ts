import type { CascadeSelectOption } from "~/components/base/inputs/text/BaseCascadeSelect.vue";

export const accionistaTypes: CascadeSelectOption[] = [
  {
    id: "natural",
    value: "natural",
    label: "Persona Natural",
    icon: "User",
  },
  {
    id: "juridica",
    value: "juridica",
    label: "Persona Jurídica",
    icon: "Building",
  },
  {
    id: "sucursal",
    value: "sucursal",
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
        id: "sucesiones",
        value: "sucesiones_indivisas",
        label: "Sucesiones Indivisas",
      },
      {
        id: "fideicomisos",
        value: "fideicomisos",
        label: "Fideicomisos",
      },
      {
        id: "fondos",
        value: "fondos_inversion",
        label: "Fondos de Inversión",
      },
    ],
  },
];
