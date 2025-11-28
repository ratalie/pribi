import { v4 as uuidv4 } from "uuid";
import type { Accion } from "~/core/hexag/registros/sociedades/pasos/acciones/domain";
import { TipoAccionEnum } from "~/core/hexag/registros/sociedades/pasos/acciones/domain";
import type {
  AccionesComunesState,
  useAccionesComunesStore,
} from "../stores/useAccionesComunesStore";
import type {
  ClasesAccionesState,
  useClasesAccionesStore,
} from "../stores/useClasesAccionesStore";
import { tipoAccionesUIEnum } from "../types/enums/tipoAccionesEnum";

/**
 * Mapea el tipo de acción del backend al enum de UI
 */
export const getTipoAccionUI = (tipo: TipoAccionEnum): string => {
  switch (tipo) {
    case TipoAccionEnum.COMUN:
      return tipoAccionesUIEnum.COMUNES;
    case TipoAccionEnum.SIN_DERECHO_A_VOTO:
      return tipoAccionesUIEnum.SIN_DERECHO_A_VOTO;
    case TipoAccionEnum.CLASES:
      return tipoAccionesUIEnum.CLASES_DE_ACCIÓN;
    default:
      return "Tipo desconocido";
  }
};

/**
 * Mapea los datos del store de acciones comunes a AccionRegistro
 */
export const mapperComunesModalALista = (
  store: ReturnType<typeof useAccionesComunesStore>,
  id?: string
): Accion => {
  const formData = store.getFormData();

  return {
    id: id || uuidv4(),
    tipo:
      formData.tipoAcciones === TipoAccionEnum.SIN_DERECHO_A_VOTO
        ? TipoAccionEnum.SIN_DERECHO_A_VOTO
        : TipoAccionEnum.COMUN,
    nombreAccion: "Acciones comunes",
    accionesSuscritas: formData.cantidadAcciones,
    derechoVoto: formData.tipoAcciones !== TipoAccionEnum.SIN_DERECHO_A_VOTO,
    redimibles: formData.redimibles,
    otrosDerechosEspeciales: formData.otrosDerechosEspeciales,
    metadataDerechosEspeciales: formData.otrosDerechosEspeciales
      ? [...formData.metadataDerechosEspeciales]
      : [],
    obligacionesAdicionales: formData.obligacionesAdicionales,
    metadataObligaciones: formData.obligacionesAdicionales
      ? [...formData.metadataObligaciones]
      : [],
    comentariosAdicionales: formData.comentariosAdicionales,
    comentariosAdicionalesTexto: formData.comentariosAdicionales
      ? formData.comentariosAdicionalesTexto
      : "",
  };
};

/**
 * Mapea los datos del store de clases de acciones a AccionRegistro
 */
export const mapperClasesModalALista = (
  store: ReturnType<typeof useClasesAccionesStore>,
  id?: string
): Accion => {
  const formData = store.getFormData();

  return {
    id: id || uuidv4(),
    tipo: TipoAccionEnum.CLASES,
    nombreAccion: formData.nombreClaseAccion.trim() || "Clase sin nombre",
    accionesSuscritas: formData.cantidadAccionesClase,
    derechoVoto: formData.conDerechoVoto,
    redimibles: formData.redimiblesClase,
    otrosDerechosEspeciales: formData.otrosDerechosEspecialesClase,
    metadataDerechosEspeciales: formData.otrosDerechosEspecialesClase
      ? [...formData.metadataDerechosEspecialesClase]
      : [],
    obligacionesAdicionales: formData.obligacionesAdicionalesClase,
    metadataObligaciones: formData.obligacionesAdicionalesClase
      ? [...formData.metadataObligacionesClase]
      : [],
    comentariosAdicionales: formData.comentariosAdicionales,
    comentariosAdicionalesTexto: formData.comentariosAdicionales
      ? formData.comentariosAdicionalesTexto
      : "",
  };
};

/**
 * Mapea los datos de AccionRegistro a AccionesComunesState o ClasesAccionesState
 */
export const mapperAccionesListaAModal = (
  accion: Accion
): AccionesComunesState | ClasesAccionesState => {
  switch (accion.tipo) {
    case TipoAccionEnum.COMUN:
    case TipoAccionEnum.SIN_DERECHO_A_VOTO:
      return convertirComunes(accion);
    case TipoAccionEnum.CLASES:
      return convertirClases(accion);
    default:
      throw new Error("Tipo de acción no válido");
  }
};

const convertirComunes = (accion: Accion): AccionesComunesState => {
  return {
    tipoAcciones: accion.tipo,
    cantidadAcciones: accion.accionesSuscritas,
    redimibles: accion.redimibles,
    otrosDerechosEspeciales: accion.otrosDerechosEspeciales,
    metadataDerechosEspeciales: [...accion.metadataDerechosEspeciales],
    obligacionesAdicionales: accion.obligacionesAdicionales,
    metadataObligaciones: [...accion.metadataObligaciones],
    comentariosAdicionales: accion.comentariosAdicionales,
    comentariosAdicionalesTexto: accion.comentariosAdicionalesTexto,
  };
};

const convertirClases = (accion: Accion): ClasesAccionesState => {
  return {
    nombreClaseAccion: accion.nombreAccion,
    cantidadAccionesClase: accion.accionesSuscritas,
    conDerechoVoto: accion.derechoVoto,
    redimiblesClase: accion.redimibles,
    otrosDerechosEspecialesClase: accion.otrosDerechosEspeciales,
    metadataDerechosEspecialesClase: [...accion.metadataDerechosEspeciales],
    obligacionesAdicionalesClase: accion.obligacionesAdicionales,
    metadataObligacionesClase: [...accion.metadataObligaciones],
    comentariosAdicionales: accion.comentariosAdicionales,
    comentariosAdicionalesTexto: accion.comentariosAdicionalesTexto,
  };
};
