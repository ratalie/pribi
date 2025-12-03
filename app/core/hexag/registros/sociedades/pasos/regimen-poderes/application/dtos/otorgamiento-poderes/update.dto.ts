import type {
  BaseOtorgamientoPoder,
  BaseReglaMonetaria,
  FirmantesDTO,
  LimiteMonetarioDTO,
  TipoFirmaDTO,
} from "./base.dto";

export type UpdateOtorgamientoPoderDTO = Omit<
  BaseOtorgamientoPoder,
  "poderId" | "claseApoderadoId"
> &
  ReglaMonetaria;

type ReglaMonetaria = ConReglasMonetarias | SinReglasMonetarias;

interface ConReglasMonetarias {
  tieneReglasFirma: true;
  reglasMonetarias: UpdateReglaMonetariaDTO[];
}

interface SinReglasMonetarias {
  tieneReglasFirma: false;
}

type UpdateReglaMonetariaDTO =
  | AgregarNuevaReglaMonetaria
  | ActualizarReglaMonetaria
  | EliminarReglaMonetaria
  | ActualizarFirmantesPorRegla;

//reglas monetarias
type AgregarNuevaReglaMonetaria = {
  accion: "add";
} & AgregarNuevaReglaMonetariaDTO;

type ActualizarReglaMonetaria = {
  accion: "update";
} & ActualizarReglaMonetariaDTO;

type EliminarReglaMonetaria = {
  accion: "remove";
  reglaId: string;
};

type ActualizarFirmantesPorRegla = {
  accion: "updateSigners";
  reglaId: string;
  firmantes: UpdateFirmantesPorRegla[];
};

//tipos complemtarios para las acciones
type AgregarNuevaReglaMonetariaDTO = BaseReglaMonetaria & LimiteMonetarioDTO & TipoFirmaDTO;
type ActualizarReglaMonetariaDTO = BaseReglaMonetaria & LimiteMonetarioDTO;

type UpdateFirmantesPorRegla = AgregarNuevoFirmante | ActualizarFirmante | EliminarFirmante;

//firmantes
type AgregarNuevoFirmante = FirmantesDTO & {
  accion: "add";
};

type ActualizarFirmante = FirmantesDTO & {
  accion: "update";
};

interface EliminarFirmante {
  accion: "remove";
  signerId: string;
}
