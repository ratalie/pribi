import { v4 as uuidv4 } from "uuid";
import type {
  AccionesComunesState,
  useAccionesComunesStore,
} from "../stores/useAccionesComunesStore";
import type {
  ClasesAccionesState,
  useClasesAccionesStore,
} from "../stores/useClasesAccionesStore";
import type { AccionRegistro } from "../types/acciones";
import { TipoAccionesEnum } from "../types/enums/tipoAccionesEnum";

/**
 * Mapea los datos del store de acciones comunes a AccionRegistro
 */
export const mapperComunesModalALista = (
  store: ReturnType<typeof useAccionesComunesStore>,
  id?: string
): AccionRegistro => {
  const formData = store.getFormData();

  return {
    id: id || uuidv4(),
    tipo:
      formData.tipoAcciones === TipoAccionesEnum.SIN_DERECHO_A_VOTO
        ? TipoAccionesEnum.SIN_DERECHO_A_VOTO
        : TipoAccionesEnum.COMUN,
    nombreAccion: "Acciones comunes",
    accionesSuscritas: formData.cantidadAcciones,
    derechoVoto: formData.tipoAcciones !== TipoAccionesEnum.SIN_DERECHO_A_VOTO,
    redimibles: formData.redimibles,
    otrosDerechosEspeciales: formData.otrosDerechosEspeciales,
    metadataDerechosEspeciales: [...formData.metadataDerechosEspeciales],
    obligacionesAdicionales: formData.obligacionesAdicionales,
    metadataObligaciones: [...formData.metadataObligaciones],
    comentariosAdicionales: formData.comentariosAdicionales,
    comentariosAdicionalesTexto: formData.comentariosAdicionalesTexto,
  };
};

/**
 * Mapea los datos del store de clases de acciones a AccionRegistro
 */
export const mapperClasesModalALista = (
  store: ReturnType<typeof useClasesAccionesStore>,
  id?: string
): AccionRegistro => {
  const formData = store.getFormData();

  return {
    id: id || uuidv4(),
    tipo: TipoAccionesEnum.CLASES,
    nombreAccion: formData.nombreClaseAccion.trim() || "Clase sin nombre",
    accionesSuscritas: formData.cantidadAccionesClase,
    derechoVoto: formData.conDerechoVoto,
    redimibles: formData.redimiblesClase,
    otrosDerechosEspeciales: formData.otrosDerechosEspecialesClase,
    metadataDerechosEspeciales: [...formData.metadataDerechosEspecialesClase],
    obligacionesAdicionales: formData.obligacionesAdicionalesClase,
    metadataObligaciones: [...formData.metadataObligacionesClase],
    comentariosAdicionales: formData.comentariosAdicionales,
    comentariosAdicionalesTexto: formData.comentariosAdicionalesTexto,
  };
};

/**
 * Mapea los datos de AccionRegistro a AccionesComunesState o ClasesAccionesState
 */
export const mapperAccionesListaAModal = (
  accion: AccionRegistro
): AccionesComunesState | ClasesAccionesState => {
  switch (accion.tipo) {
    case TipoAccionesEnum.COMUN:
    case TipoAccionesEnum.SIN_DERECHO_A_VOTO:
      return convertirComunes(accion);
    case TipoAccionesEnum.CLASES:
      return convertirClases(accion);
    default:
      throw new Error("Tipo de acción no válido");
  }
};

const convertirComunes = (accion: AccionRegistro): AccionesComunesState => {
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

const convertirClases = (accion: AccionRegistro): ClasesAccionesState => {
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
