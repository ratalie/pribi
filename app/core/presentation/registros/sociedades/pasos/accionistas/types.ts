import type { Persona } from "@hexag/registros/sociedades/pasos/accionistas/domain";

export type PersonaTipoForm =
  | "NATURAL"
  | "JURIDICA"
  | "SUCURSAL"
  | "SUCESION_INDIVISA"
  | "FONDO_INVERSION"
  | "FIDEICOMISO";

export interface AccionistaFormValuesBase {
  id?: string;
  personaType: PersonaTipoForm;
  participacionPorcentual?: number | null;
}

export type AccionistaFormValues =
  | (AccionistaFormValuesBase & {
      personaType: "NATURAL";
      tipoDocumento: string;
      numeroDocumento: string;
      nombre: string;
      apellidoPaterno: string;
      apellidoMaterno?: string;
      paisEmision?: string;
    })
  | (AccionistaFormValuesBase & {
      personaType: "JURIDICA";
      tipoDocumento: string;
      numeroDocumento: string;
      razonSocial: string;
      nombreComercial?: string;
      direccion?: string;
      pais?: string;
    });

export interface AccionistaRow {
  id: string;
  etiqueta: string;
  tipo: string;
  documento: string;
  participacion?: string;
}

export interface AccionistaModalPayload {
  values: AccionistaFormValues;
}

export const personaTypeLabels: Record<PersonaTipoForm, string> = {
  NATURAL: "Persona natural",
  JURIDICA: "Persona jurídica",
  SUCURSAL: "Sucursal",
  SUCESION_INDIVISA: "Sucesión indivisa",
  FONDO_INVERSION: "Fondo de inversión",
  FIDEICOMISO: "Fideicomiso",
};

const SUPPORTED_PERSONA_TYPES: PersonaTipoForm[] = ["NATURAL", "JURIDICA"];

export const personaOptions = SUPPORTED_PERSONA_TYPES.map((value) => ({
  id: value,
  value,
  label: personaTypeLabels[value],
}));

export const DOCUMENT_TYPES = [
  { id: "dni", label: "DNI", value: "DNI" },
  { id: "ruc", label: "RUC", value: "RUC" },
  { id: "passport", label: "Pasaporte", value: "PASAPORTE" },
  { id: "cex", label: "Carné extranjería", value: "CEX" },
];

export function personaToFormValues(
  persona: Persona,
  extras: { id?: string; participacionPorcentual?: number | null }
): AccionistaFormValues {
  switch (persona.tipo) {
    case "NATURAL":
      return {
        personaType: "NATURAL",
        id: extras.id,
        participacionPorcentual: extras.participacionPorcentual ?? null,
        tipoDocumento: persona.tipoDocumento,
        numeroDocumento: persona.numeroDocumento,
        nombre: persona.nombre,
        apellidoPaterno: persona.apellidoPaterno,
        apellidoMaterno: persona.apellidoMaterno,
        paisEmision: persona.paisEmision,
      };
    case "JURIDICA":
      return {
        personaType: "JURIDICA",
        id: extras.id,
        participacionPorcentual: extras.participacionPorcentual ?? null,
        tipoDocumento: persona.tipoDocumento,
        numeroDocumento: persona.numeroDocumento,
        razonSocial: persona.razonSocial,
        nombreComercial: persona.nombreComercial,
        direccion: persona.direccion,
        pais: persona.pais,
      };
    default:
      return {
        personaType: "JURIDICA",
        id: extras.id,
        participacionPorcentual: extras.participacionPorcentual ?? null,
        tipoDocumento: "RUC",
        numeroDocumento: persona.tipo === "SUCESION_INDIVISA" && persona.ruc ? persona.ruc : "",
        razonSocial:
          persona.tipo === "SUCESION_INDIVISA" || persona.tipo === "FIDEICOMISO"
            ? persona.razonSocial ?? "Accionista sin razón social"
            : "Accionista",
      };
  }
}

