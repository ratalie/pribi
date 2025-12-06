import type { TipoFirmaEnum } from "../../enums/tipo-firma.enum";
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

// Para ActualizarReglaMonetariaDTO, el tipoFirma no incluye firmantes
// porque los firmantes se manejan en una acción separada (updateSigners)
type ActualizarReglaMonetariaDTO = BaseReglaMonetaria &
  LimiteMonetarioDTO &
  TipoFirmaActualizarDTO;

// Tipo de firma para actualizar (sin firmantes, se manejan en updateSigners)
type TipoFirmaActualizarDTO = SolaFirmaActualizar | FirmaConjuntaActualizar;

interface SolaFirmaActualizar {
  tipoFirma: TipoFirmaEnum.SOLA_FIRMA;
}

interface FirmaConjuntaActualizar {
  tipoFirma: TipoFirmaEnum.FIRMA_CONJUNTA;
  // No incluye firmantes porque se manejan en updateSigners
}

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
