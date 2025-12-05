import type { Firmante } from "..";
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

type ActualizarReglaMonetariaPayload = BaseReglaMonetariaPayload & LimiteMonetarioPayload;

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
