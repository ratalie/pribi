import type { TipoAccionEnum } from "../enums/tipo-accion.enum";

export interface AccionPayload {
  id: string;
  tipo: TipoAccionEnum;
  nombreAccion?: string;
  accionesSuscritas: number;
  derechoVoto: boolean;
  redimible: boolean;
  otrosDerechosEspeciales: boolean;
  archivosOtrosDerechos?: string[];
  obligacionesAdicionales: boolean;
  archivosObligaciones?: string[];
  comentariosAdicionales: boolean;
  comentariosAdicionalesTexto?: string;
}
