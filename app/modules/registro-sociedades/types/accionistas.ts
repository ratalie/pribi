// Importamos el enum sin 'type' porque usamos sus valores como tipos literales
import type { EstadoCivilEnum } from "~/types/enums/EstadoCivilEnum";
import type { RegimenPatrimonialEnum } from "~/types/enums/RegimenPatrimonialEnum";
import { TipoAccionistaEnum } from "./enums/TipoAccionistaEnum";
import type { EntidadLegalPeruanaBase, PersonaJuridica, PersonaNatural } from "./personas";

export interface BaseAccionista {
  id: string;
  tipoAccionista: TipoAccionistaEnum;
}

// Re-exportamos el enum para que esté disponible donde se usen los tipos
export { TipoAccionistaEnum };

// ============================================
// ACCIONISTA: PERSONA NATURAL
export interface PersonaNaturalAccionista extends BaseAccionista, PersonaNatural {
  tipoAccionista: TipoAccionistaEnum.NATURAL;
  estadoCivil: EstadoCivilEnum;
  regimenPatrimonial?: RegimenPatrimonialEnum;
  conyuge?: PersonaNatural;
  partidaRegistral?: string;
  sedeRegistral?: string;
}

// ============================================
// ACCIONISTA: PERSONA JURÍDICA
export type PersonaJuridicaAccionista = BaseAccionista &
  PersonaJuridica & {
    tipoAccionista: TipoAccionistaEnum.JURIDICA;
  };

// ============================================
// ACCIONISTA: SUCURSAL
export interface SucursalAccionista extends BaseAccionista {
  tipoAccionista: TipoAccionistaEnum.SUCURSAL;
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
export interface SucesionesIndivisasAccionista
  extends BaseAccionista,
    EntidadLegalPeruanaBase {
  tipoAccionista: TipoAccionistaEnum.SUCESIONES_INDIVISAS;
}

// ============================================
// ACCIONISTA: FIDEICOMISOS
interface FideicomisosBase {
  identificacionFideicomiso: string;
  partidaRegistral: string;
  sedeRegistral: string;
  domicilioFiscal: string;
  numeroDocumentoFiduciaria: string;
  tipoDocumentoFiduciaria: string;
  razonSocialFiduciaria: string;
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
    tipoAccionista: TipoAccionistaEnum.FIDEICOMISOS;
  };

// ============================================
// ACCIONISTA: FONDOS DE INVERSIÓN
export interface FondosInversionAccionista extends BaseAccionista {
  tipoAccionista: TipoAccionistaEnum.FONDOS_INVERSION;
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  direccion: string;
  tipoFondo: string;
  numeroDocumentoSociedadAdministradora: string;
  tipoDocumentoSociedadAdministradora: string;
  razonSocialSociedadAdministradora: string;
  tieneRepresentante: boolean;
  representanteLegal?: PersonaNatural;
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
  nombre: string;
  tipoAccionista: string;
  tipoDocumento: string;
  numeroDocumento: string;
}
