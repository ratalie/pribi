import type { PersonaJuridicaState } from "~/stores/usePersonaJuridicaStore";
import type { PersonaNaturalState } from "~/stores/usePersonaNaturalStore";

export interface ClaseApoderado {
  id: string;
  nombre: string;
}

export interface ClaseApoderadoRow {
  id: string;
  table_id: number;
  clase_apoderado: string;
  numero_apoderados: number;
}

export interface RegistroApoderado {
  id: string;
  claseApoderadoId: string;
  tipoPersona: "natural" | "juridica";
  nombreRazonSocial: string;
  tipoDocumento: string;
  numeroDocumento: string;
  personaNatural?: PersonaNaturalState | null;
  personaJuridica?: PersonaJuridicaState | null;
}

export interface RegistroApoderadoRow {
  id: string;
  clase_apoderado: string;
  nombre_razon_social: string;
  tipo_documento: string;
  numero_documento: string;
}

export interface OtroApoderado {
  id: string;
  nombreRazonSocial: string;
  tipoDocumento: string;
  numeroDocumento: string;
  personaNatural: PersonaNaturalState | null;
}

export interface OtroApoderadoRow {
  id: string;
  nombre_razon_social: string;
  tipo_documento: string;
  numero_documento: string;
}
