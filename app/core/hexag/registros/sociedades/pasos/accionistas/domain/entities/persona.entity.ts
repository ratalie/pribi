import type { PersonaTipo, TipoDocumentoPersona } from "../enums/persona-tipo.enum";

interface PersonaBase {
  id?: string;
  tipo: PersonaTipo;
}

export interface Representante {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  tipoDocumento: TipoDocumentoPersona;
  numeroDocumento: string;
  paisEmision?: string;
}

export interface PersonaNatural extends PersonaBase {
  tipo: "NATURAL";
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  tipoDocumento: TipoDocumentoPersona;
  numeroDocumento: string;
  paisEmision?: string;
}

export interface PersonaJuridica extends PersonaBase {
  tipo: "JURIDICA";
  tipoDocumento: TipoDocumentoPersona;
  numeroDocumento: string;
  razonSocial: string;
  direccion?: string;
  constituida?: boolean;
  nombreComercial?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  pais?: string;
  jurisdiccion?: "peruana" | "extranjera";
  representadoPor?: Representante | null;
}

export interface PersonaSucursal extends PersonaBase {
  tipo: "SUCURSAL";
  ruc: string;
  nombreSucursal: string;
  partidaRegistral?: string;
  oficinaRegistrada?: string;
  direccionFiscal?: string;
  representante?: Representante;
}

export interface PersonaFondoInversion extends PersonaBase {
  tipo: "FONDO_INVERSION";
  ruc: string;
  razonSocial: string;
  direccion?: string;
  tipoFondo: "ABIERTO" | "CERRADO" | "MIXTO" | string;
  representante?: Representante;
  fiduciario?: {
    ruc?: string;
    razonSocial?: string;
  };
}

export interface PersonaFideicomiso extends PersonaBase {
  tipo: "FIDEICOMISO";
  tieneRuc?: boolean;
  ruc?: string;
  razonSocial?: string;
  numeroRegistroFideicomiso?: string;
  partidaRegistral?: string;
  oficinaRegistrada?: string;
  direccionFiscal?: string;
  representante?: Representante;
  fiduciario?: {
    ruc?: string;
    razonSocial?: string;
  };
}

export interface PersonaSucesionIndivisa extends PersonaBase {
  tipo: "SUCESION_INDIVISA";
  ruc?: string;
  razonSocial: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  direccion?: string;
  representante?: Representante;
}

export type Persona =
  | PersonaNatural
  | PersonaJuridica
  | PersonaSucursal
  | PersonaFondoInversion
  | PersonaFideicomiso
  | PersonaSucesionIndivisa;

/**
 * Type guards para Persona
 */
export function isPersonaNatural(persona: Persona): persona is PersonaNatural {
  return persona.tipo === "NATURAL";
}

export function isPersonaJuridica(persona: Persona): persona is PersonaJuridica {
  return persona.tipo === "JURIDICA";
}

