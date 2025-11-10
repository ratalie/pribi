import type { EstadoCivilEnum } from "~/types/enums/EstadoCivilEnum";
import type { RegimenPatrimonialEnum } from "~/types/enums/RegimenPatrimonialEnum";
import type { EntidadLegalPeruanaBase, PersonaJuridica, PersonaNatural } from "./personas";

export interface BaseAccionista {
  id: string;
  tipoAccionista:
    | "natural"
    | "juridica"
    | "sucursal"
    | "sucesiones_indivisas"
    | "fideicomisos"
    | "fondos_inversion";
}

// ============================================
// ACCIONISTA: PERSONA NATURAL
// ============================================

export interface PersonaNaturalAccionista extends BaseAccionista, PersonaNatural {
  tipoAccionista: "natural";
  estadoCivil: EstadoCivilEnum;
  regimenPatrimonial?: RegimenPatrimonialEnum;
  conyuge?: PersonaNatural;
  partidaRegistral?: string;
  sedeRegistral?: string;
}

// ============================================
// ACCIONISTA: PERSONA JURÍDICA
// ============================================

export type PersonaJuridicaAccionista = BaseAccionista &
  PersonaJuridica & {
    tipoAccionista: "juridica";
  };

// ============================================
// ACCIONISTA: SUCURSAL
// ============================================

export interface SucursalAccionista extends BaseAccionista {
  tipoAccionista: "sucursal";
  tipoDocumento: string;
  numeroDocumento: string;
  nombreSucursal: string;
  partidaRegistral: string;
  sedeRegistral: string;
  domicilioFiscal: string;
  tieneRepresentante: boolean;
  representanteLegal?: PersonaNatural;
}

// ============================================
// ACCIONISTA: SUCESIONES INDIVISAS
// ============================================

export interface SucesionesIndivisasAccionista
  extends BaseAccionista,
    EntidadLegalPeruanaBase {
  tipoAccionista: "sucesiones_indivisas";
}

// ============================================
// ACCIONISTA: FIDEICOMISOS
// ============================================

interface FideicomisosBase {
  identificacionFideicomiso: string;
  partidaRegistral: string;
  sedeRegistral: string;
  domicilioFiscal: string;
  tieneRepresentante: boolean;
  representanteLegal?: PersonaNatural;
}

interface FideicomisosConRuc extends FideicomisosBase {
  tieneRuc: true;
  numeroDocumento: string;
  tipoDocumento: string;
  razonSocial: string;
}

interface FideicomisosSinRuc extends FideicomisosBase {
  tieneRuc: false;
}

export type FideicomisosAccionista = BaseAccionista &
  (FideicomisosConRuc | FideicomisosSinRuc) & {
    tipoAccionista: "fideicomisos";
  };

// ============================================
// ACCIONISTA: FONDOS DE INVERSIÓN
// ============================================

export interface FondosInversionAccionista extends BaseAccionista {
  tipoAccionista: "fondos_inversion";
  // Completa según tus necesidades
}

export type Accionista =
  | PersonaNaturalAccionista
  | PersonaJuridicaAccionista
  | SucursalAccionista
  | SucesionesIndivisasAccionista
  | FideicomisosAccionista
  | FondosInversionAccionista;

export interface AccionistaRow {
  id: string;
  name: string;
  person_type: string;
  document_type: string;
  document_number: string;
}
