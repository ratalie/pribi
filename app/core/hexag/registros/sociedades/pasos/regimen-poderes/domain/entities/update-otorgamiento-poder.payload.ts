import type { Firmante, TipoFirmasUIEnum } from "..";
import type {
  BaseOtorgamientoPoderPayload,
  BaseReglaMonetariaPayload,
  LimiteMonetarioPayload,
  TipoFirmaPayload,
} from "./otorgamiento-poderes-payload-base";

export type UpdateOtorgamientoPoderPayload = Omit<
  BaseOtorgamientoPoderPayload,
  "poderId" | "claseApoderadoId"
> &
  ReglaMonetaria;

type ReglaMonetaria = ConReglasMonetarias | SinReglasMonetarias;

interface ConReglasMonetarias {
  tieneReglasFirma: true;
  reglasMonetarias: UpdateReglaMonetariaPayload[];
}

interface SinReglasMonetarias {
  tieneReglasFirma: false;
}

type UpdateReglaMonetariaPayload =
  | AgregarNuevaReglaMonetaria
  | ActualizarReglaMonetaria
  | EliminarReglaMonetaria
  | ActualizarFirmantesPorRegla;

//reglas monetarias
type AgregarNuevaReglaMonetaria = {
  accion: "add";
} & AgregarNuevaReglaMonetariaPayload;

type ActualizarReglaMonetaria = {
  accion: "update";
} & ActualizarReglaMonetariaPayload;

type EliminarReglaMonetaria = {
  accion: "remove";
  reglaId: string;
};

type ActualizarFirmantesPorRegla = {
  accion: "updateSigners";
  reglaId: string;
  firmantes: UpdateFirmantesPorRegla[];
};

//tipos complementarios para las acciones
type AgregarNuevaReglaMonetariaPayload = BaseReglaMonetariaPayload &
  LimiteMonetarioPayload &
  TipoFirmaPayload;

// Para ActualizarReglaMonetariaPayload, el tipoFirma no incluye firmantes
// porque los firmantes se manejan en una acción separada (updateSigners)
export type ActualizarReglaMonetariaPayload = BaseReglaMonetariaPayload &
  LimiteMonetarioPayload &
  TipoFirmaActualizarPayload;

// Tipo de firma para actualizar (sin firmantes, se manejan en updateSigners)
type TipoFirmaActualizarPayload = SolaFirmaActualizarPayload | FirmaConjuntaActualizarPayload;

interface SolaFirmaActualizarPayload {
  tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA;
}

interface FirmaConjuntaActualizarPayload {
  tipoFirma: TipoFirmasUIEnum.FIRMA_CONJUNTA;
  // No incluye firmantes porque se manejan en updateSigners
}

type UpdateFirmantesPorRegla = AgregarNuevoFirmante | ActualizarFirmante | EliminarFirmante;

//firmantes
type AgregarNuevoFirmante = Firmante & {
  accion: "add";
};

type ActualizarFirmante = Firmante & {
  accion: "update";
};

interface EliminarFirmante {
  accion: "remove";
  signerId: string;
}
