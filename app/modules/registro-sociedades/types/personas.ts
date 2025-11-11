import type { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

export interface PersonaNatural {
  tipoDocumento: TipoDocumentosEnum;
  numeroDocumento: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  paisPasaporte?: string;
}

export interface EntidadLegalPeruanaBase {
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  tieneRepresentante: boolean;
  representanteLegal?: PersonaNatural;
}

export interface PersonaJuridicaPeruana extends EntidadLegalPeruanaBase {
  seConstituyoEnPeru: true;
  nombreComercial: string;
}

export interface PersonaJuridicaExtranjera {
  seConstituyoEnPeru: false;
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  paisOrigen: string;
  direccion: string;
  tieneRepresentante: boolean;
  representanteLegal?: PersonaNatural;
}

export type PersonaJuridica = PersonaJuridicaPeruana | PersonaJuridicaExtranjera;
