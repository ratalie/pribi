// app/constants/inputs/society-types.ts
import type { SelectOption } from "@/types/inputs/select";

export const societyTypeOptions: SelectOption[] = [
  {
    id: 1,
    label: "Sociedad Anónima (S.A.)",
    name: "SOCIEDAD ANONIMA",
    value: 1,
    acronimo: "S.A.",
  },
  {
    id: 2,
    label: "Sociedad Anónima Cerrada (S.A.C.)",
    name: "SOCIEDAD ANONIMA CERRADA",
    value: 2,
    acronimo: "S.A.C.",
  },
  {
    id: 3,
    label: "Sociedad Anónima Abierta (S.A.A.)",
    name: "SOCIEDAD ANONIMA ABIERTA",
    value: 3,
    acronimo: "S.A.A.",
  },
  {
    id: 4,
    label: "Sociedad Comercial de Responsabilidad Limitada (S.R.L.)",
    name: "SOC.COM.RESPONS. LTDA",
    value: 4,
    acronimo: "S.R.L.",
  },
  {
    id: 5,
    label: "Sociedad Civil de Responsabilidad Limitada (S. Civ. R.L.)",
    name: "SOCIEDAD CIVIL",
    value: 5,
    acronimo: "S. Civ. R.L.",
  },
  {
    id: 6,
    label: "Sociedad Colectiva (S.C.)",
    name: "SOCIEDAD COLECTIVA",
    value: 6,
    acronimo: "S.C.",
  },
  {
    id: 7,
    label: "Sociedad en Comandita (S. en C.)",
    name: "SOCIEDAD EN COMANDITA",
    value: 7,
    acronimo: "S. en C.",
  },
  {
    id: 8,
    label: "Sociedad por Acciones Simplificada (S.A.S.)",
    name: "SOCIEDAD POR ACCIONES SIMPLIFICADAS",
    value: 8,
    acronimo: "S.A.S.",
  },
  {
    id: 9,
    label: "Sociedad de Beneficio e Interés Colectivo (B.I.C.)",
    name: "SOCIEDAD DE BENEFICIO E INTERES COLECTIVO",
    value: 9,
    acronimo: "B.I.C.",
  },
  {
    id: 10,
    label: "Empresa Individual de Responsabilidad Limitada (E.I.R.L.)",
    name: "EMPRESA INDIVIDUAL DE RESP. LTDA",
    value: 10,
    acronimo: "E.I.R.L.",
  },
];
