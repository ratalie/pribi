import type {
  Persona,
  PersonaFideicomiso,
  PersonaFondoInversion,
  PersonaJuridica,
  PersonaNatural,
  PersonaSucursal,
  PersonaSucesionIndivisa,
  Representante,
} from "@hexag/registros/sociedades/pasos/accionistas/domain";

export type PersonaTipoForm =
  | "NATURAL"
  | "JURIDICA"
  | "SUCURSAL"
  | "SUCESION_INDIVISA"
  | "FONDO_INVERSION"
  | "FIDEICOMISO";

export interface RepresentanteFormValues {
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  paisEmision?: string;
}

export interface FiduciarioFormValues {
  ruc?: string;
  razonSocial?: string;
}

export interface AccionistaFormValuesBase {
  id?: string;
  personaType: PersonaTipoForm;
  participacionPorcentual?: number | null;
}

export type AccionistaFormValues =
  | (AccionistaFormValuesBase & PersonaNaturalFormValues)
  | (AccionistaFormValuesBase & PersonaJuridicaFormValues)
  | (AccionistaFormValuesBase & PersonaSucursalFormValues)
  | (AccionistaFormValuesBase & PersonaFondoInversionFormValues)
  | (AccionistaFormValuesBase & PersonaFideicomisoFormValues)
  | (AccionistaFormValuesBase & PersonaSucesionFormValues);

type PersonaNaturalFormValues = {
  personaType: "NATURAL";
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  paisEmision?: string;
};

type PersonaJuridicaFormValues = {
  personaType: "JURIDICA";
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  nombreComercial?: string;
  direccion?: string;
  pais?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  constituida?: string;
};

type PersonaSucursalFormValues = {
  personaType: "SUCURSAL";
  ruc: string;
  nombreSucursal: string;
  partidaRegistral?: string;
  oficinaRegistrada?: string;
  direccionFiscal?: string;
  representante?: RepresentanteFormValues;
};

type PersonaFondoInversionFormValues = {
  personaType: "FONDO_INVERSION";
  ruc: string;
  razonSocial: string;
  direccion?: string;
  tipoFondo: string;
  representante?: RepresentanteFormValues;
  fiduciario?: FiduciarioFormValues;
};

type PersonaFideicomisoFormValues = {
  personaType: "FIDEICOMISO";
  tieneRuc?: string;
  ruc?: string;
  razonSocial?: string;
  numeroRegistroFideicomiso?: string;
  partidaRegistral?: string;
  oficinaRegistrada?: string;
  direccionFiscal?: string;
  representante?: RepresentanteFormValues;
  fiduciario?: FiduciarioFormValues;
};

type PersonaSucesionFormValues = {
  personaType: "SUCESION_INDIVISA";
  ruc?: string;
  razonSocial: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  direccion?: string;
  representante?: RepresentanteFormValues;
};

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

const SUPPORTED_PERSONA_TYPES: PersonaTipoForm[] = [
  "NATURAL",
  "JURIDICA",
  "SUCURSAL",
  "FONDO_INVERSION",
  "FIDEICOMISO",
  "SUCESION_INDIVISA",
];

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

const mapRepresentante = (representante?: Representante): RepresentanteFormValues | undefined => {
  if (!representante) return undefined;
  return {
    nombre: representante.nombre,
    apellidoPaterno: representante.apellidoPaterno,
    apellidoMaterno: representante.apellidoMaterno,
    tipoDocumento: representante.tipoDocumento,
    numeroDocumento: representante.numeroDocumento,
    paisEmision: representante.paisEmision,
  };
};

const mapPersonaNatural = (
  persona: PersonaNatural,
  extras: { id?: string; participacionPorcentual?: number | null }
): AccionistaFormValues => ({
  personaType: "NATURAL",
  id: extras.id,
  participacionPorcentual: extras.participacionPorcentual ?? null,
  tipoDocumento: persona.tipoDocumento,
  numeroDocumento: persona.numeroDocumento,
  nombre: persona.nombre,
  apellidoPaterno: persona.apellidoPaterno,
  apellidoMaterno: persona.apellidoMaterno,
  paisEmision: persona.paisEmision,
});

const mapPersonaJuridica = (
  persona: PersonaJuridica,
  extras: { id?: string; participacionPorcentual?: number | null }
): AccionistaFormValues => ({
  personaType: "JURIDICA",
  id: extras.id,
  participacionPorcentual: extras.participacionPorcentual ?? null,
  tipoDocumento: persona.tipoDocumento,
  numeroDocumento: persona.numeroDocumento,
  razonSocial: persona.razonSocial,
  nombreComercial: persona.nombreComercial,
  direccion: persona.direccion,
  pais: persona.pais,
  distrito: persona.distrito,
  provincia: persona.provincia,
  departamento: persona.departamento,
  constituida: typeof persona.constituida === "boolean" ? String(persona.constituida) : undefined,
});

const mapPersonaSucursal = (
  persona: PersonaSucursal,
  extras: { id?: string; participacionPorcentual?: number | null }
): AccionistaFormValues => ({
  personaType: "SUCURSAL",
  id: extras.id,
  participacionPorcentual: extras.participacionPorcentual ?? null,
  ruc: persona.ruc,
  nombreSucursal: persona.nombreSucursal,
  partidaRegistral: persona.partidaRegistral,
  oficinaRegistrada: persona.oficinaRegistrada,
  direccionFiscal: persona.direccionFiscal,
  representante: mapRepresentante(persona.representante),
});

const mapPersonaFondo = (
  persona: PersonaFondoInversion,
  extras: { id?: string; participacionPorcentual?: number | null }
): AccionistaFormValues => ({
  personaType: "FONDO_INVERSION",
  id: extras.id,
  participacionPorcentual: extras.participacionPorcentual ?? null,
  ruc: persona.ruc,
  razonSocial: persona.razonSocial,
  direccion: persona.direccion,
  tipoFondo: persona.tipoFondo,
  representante: mapRepresentante(persona.representante),
  fiduciario: persona.fiduciario,
});

const mapPersonaFideicomiso = (
  persona: PersonaFideicomiso,
  extras: { id?: string; participacionPorcentual?: number | null }
): AccionistaFormValues => ({
  personaType: "FIDEICOMISO",
  id: extras.id,
  participacionPorcentual: extras.participacionPorcentual ?? null,
  tieneRuc: typeof persona.tieneRuc === "boolean" ? String(persona.tieneRuc) : undefined,
  ruc: persona.ruc,
  razonSocial: persona.razonSocial,
  numeroRegistroFideicomiso: persona.numeroRegistroFideicomiso,
  partidaRegistral: persona.partidaRegistral,
  oficinaRegistrada: persona.oficinaRegistrada,
  direccionFiscal: persona.direccionFiscal,
  representante: mapRepresentante(persona.representante),
  fiduciario: persona.fiduciario,
});

const mapPersonaSucesion = (
  persona: PersonaSucesionIndivisa,
  extras: { id?: string; participacionPorcentual?: number | null }
): AccionistaFormValues => ({
  personaType: "SUCESION_INDIVISA",
  id: extras.id,
  participacionPorcentual: extras.participacionPorcentual ?? null,
  ruc: persona.ruc,
  razonSocial: persona.razonSocial,
  distrito: persona.distrito,
  provincia: persona.provincia,
  departamento: persona.departamento,
  direccion: persona.direccion,
  representante: mapRepresentante(persona.representante),
});

export function personaToFormValues(
  persona: Persona,
  extras: { id?: string; participacionPorcentual?: number | null }
): AccionistaFormValues {
  switch (persona.tipo) {
    case "NATURAL":
      return mapPersonaNatural(persona, extras);
    case "JURIDICA":
      return mapPersonaJuridica(persona, extras);
    case "SUCURSAL":
      return mapPersonaSucursal(persona, extras);
    case "FONDO_INVERSION":
      return mapPersonaFondo(persona, extras);
    case "FIDEICOMISO":
      return mapPersonaFideicomiso(persona, extras);
    case "SUCESION_INDIVISA":
      return mapPersonaSucesion(persona, extras);
    default:
      return mapPersonaNatural(
        {
          tipo: "NATURAL",
          nombre: "",
          apellidoPaterno: "",
          tipoDocumento: "DNI",
          numeroDocumento: "",
        } as PersonaNatural,
        extras
      );
  }
}

