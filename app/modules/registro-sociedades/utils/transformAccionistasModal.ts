import { v4 as uuidv4 } from "uuid";
import type { PersonaNaturalState } from "~/stores/usePersonaNaturalStore";
import { EstadoCivilEnum } from "~/types/enums/EstadoCivilEnum";
import { RegimenPatrimonialEnum } from "~/types/enums/RegimenPatrimonialEnum";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
import type { AccionistaFideicomisosState } from "../stores/modal/accionistas/useAccionistaFideicomisosStore";
import type { AccionistaFondosInversionState } from "../stores/modal/accionistas/useAccionistaFondosInversionStore";
import type { AccionistaJuridicoState } from "../stores/modal/accionistas/useAccionistaJuridicoStore";
import type { AccionistaNaturalState } from "../stores/modal/accionistas/useAccionistaNaturalStore";
import type { AccionistaSucesionesIndivisasState } from "../stores/modal/accionistas/useAccionistaSucesionesIndivisasStore";
import type { AccionistaSucursalState } from "../stores/modal/accionistas/useAccionistaSucursalStore";
import type {
  Accionista,
  FideicomisosAccionista,
  FondosInversionAccionista,
  PersonaJuridicaAccionista,
  PersonaNaturalAccionista,
  SucesionesIndivisasAccionista,
  SucursalAccionista,
} from "../types/accionistas";
import type { PersonaNatural } from "../types/personas";

// ============================================================================
// FUNCIONES HELPER
// ============================================================================

/**
 * Convierte PersonaNaturalState a PersonaNatural haciendo el casting necesario
 */
function convertirStateAPersonaNatural(
  state: PersonaNaturalState | null
): PersonaNatural | undefined {
  if (!state || !state.numeroDocumento) {
    return undefined;
  }

  return {
    tipoDocumento: state.tipoDocumento === "" ? TipoDocumentosEnum.DNI : state.tipoDocumento,
    numeroDocumento: state.numeroDocumento,
    nombre: state.nombre,
    apellidoPaterno: state.apellidoPaterno,
    apellidoMaterno: state.apellidoMaterno,
    paisPasaporte: state.paisPasaporte || undefined,
  };
}

// ============================================================================
// TRANSFORMAR DE MODAL A ACCIONISTA (para guardar)
// ============================================================================

/**
 * Transforma los datos del modal al formato Accionista según el tipo
 * Esta función NO instancia stores, recibe los states como parámetros
 */
export function transformarModalAAccionista(
  tipoAccionista: string,
  stateModal: any,
  stateRepresentante: PersonaNaturalState | null,
  idAccionista?: string
): Accionista | null {
  const id = idAccionista || uuidv4();

  switch (tipoAccionista) {
    case "natural":
      return transformarNaturalAAccionista(stateModal, id);

    case "juridica":
      return transformarJuridicaAAccionista(stateModal, stateRepresentante, id);

    case "sucursal":
      return transformarSucursalAAccionista(stateModal, stateRepresentante, id);

    case "sucesiones_indivisas":
      return transformarSucesionesIndivisasAAccionista(stateModal, stateRepresentante, id);

    case "fideicomisos":
      return transformarFideicomisosAAccionista(stateModal, stateRepresentante, id);

    case "fondos_inversion":
      return transformarFondosInversionAAccionista(stateModal, stateRepresentante, id);

    default:
      console.error(`Tipo de accionista desconocido: ${tipoAccionista}`);
      return null;
  }
}

// ============================================================================
// TRANSFORMAR DE ACCIONISTA A MODAL (para editar)
// ============================================================================

/**
 * Transforma un Accionista al formato del modal para edición
 * Retorna los estados necesarios para hacer $patch en los stores
 */
export function transformarAccionistaAModal(accionista: Accionista): {
  stateModal: any;
  stateRepresentante: PersonaNaturalState | null;
} {
  switch (accionista.tipoAccionista) {
    case "natural":
      return {
        stateModal: transformarAccionistaANatural(accionista as PersonaNaturalAccionista),
        stateRepresentante: null,
      };

    case "juridica":
      return transformarAccionistaAJuridica(accionista as PersonaJuridicaAccionista);

    case "sucursal":
      return transformarAccionistaASucursal(accionista as SucursalAccionista);

    case "sucesiones_indivisas":
      return transformarAccionistaASucesionesIndivisas(
        accionista as SucesionesIndivisasAccionista
      );

    case "fideicomisos":
      return transformarAccionistaAFideicomisos(accionista as FideicomisosAccionista);

    case "fondos_inversion":
      return transformarAccionistaAFondosInversion(accionista as FondosInversionAccionista);

    default:
      console.error(`Tipo de accionista desconocido`);
      return { stateModal: {}, stateRepresentante: null };
  }
}

// ============================================================================
// FUNCIONES ESPECÍFICAS: MODAL → ACCIONISTA
// ============================================================================

function transformarNaturalAAccionista(
  state: AccionistaNaturalState,
  id: string
): PersonaNaturalAccionista {
  const esCasado = state.estadoCivil === EstadoCivilEnum.CASADO;
  const esSociedadGananciales =
    state.regimenPatrimonial === RegimenPatrimonialEnum.SOCIEDAD_GANANCIALES;
  const esSeparacionPatrimonios =
    state.regimenPatrimonial === RegimenPatrimonialEnum.SEPARACION_PATRIMONIOS;

  return {
    id,
    tipoAccionista: "natural",
    tipoDocumento: state.tipoDocumento as TipoDocumentosEnum,
    numeroDocumento: state.numeroDocumento,
    nombre: state.nombre,
    apellidoPaterno: state.apellidoPaterno,
    apellidoMaterno: state.apellidoMaterno,
    paisPasaporte: state.paisPasaporte || undefined,
    estadoCivil: state.estadoCivil as EstadoCivilEnum,
    // Solo incluir régimen si está casado
    regimenPatrimonial: esCasado
      ? (state.regimenPatrimonial as RegimenPatrimonialEnum)
      : undefined,
    // Solo incluir cónyuge si está casado y tiene sociedad de gananciales
    conyuge:
      esCasado && esSociedadGananciales && state.conyuge.numeroDocumento
        ? convertirStateAPersonaNatural(state.conyuge)
        : undefined,
    // Solo incluir partida/sede si está casado y tiene separación de patrimonios
    partidaRegistral:
      esCasado && esSeparacionPatrimonios && state.partidaRegistral
        ? state.partidaRegistral
        : undefined,
    sedeRegistral:
      esCasado && esSeparacionPatrimonios && state.sedeRegistral
        ? state.sedeRegistral
        : undefined,
  };
}

function transformarJuridicaAAccionista(
  state: AccionistaJuridicoState,
  stateRepresentante: PersonaNaturalState | null,
  id: string
): PersonaJuridicaAccionista {
  const representanteLegal =
    state.tieneRepresentante && stateRepresentante
      ? convertirStateAPersonaNatural(stateRepresentante)
      : undefined;

  // Si está constituida en Perú, retornar tipo Peruana
  if (state.seConstituyoEnPeru) {
    return {
      id,
      tipoAccionista: "juridica",
      seConstituyoEnPeru: true,
      tipoDocumento: "RUC", // Siempre es RUC en Perú
      numeroDocumento: state.numeroDocumento,
      razonSocial: state.razonSocial,
      nombreComercial: state.nombreComercial,
      direccion: state.direccion,
      distrito: state.distrito,
      provincia: state.provincia,
      departamento: state.departamento,
      tieneRepresentante: state.tieneRepresentante,
      representanteLegal,
    };
  }

  // Si es extranjera, retornar tipo Extranjera
  return {
    id,
    tipoAccionista: "juridica",
    seConstituyoEnPeru: false,
    tipoDocumento: state.tipoDocumento, // El usuario lo ingresa
    numeroDocumento: state.numeroDocumento,
    razonSocial: state.razonSocial,
    paisOrigen: state.paisOrigen,
    direccion: state.direccion,
    tieneRepresentante: state.tieneRepresentante,
    representanteLegal,
  };
}

function transformarSucursalAAccionista(
  state: AccionistaSucursalState,
  stateRepresentante: PersonaNaturalState | null,
  id: string
): SucursalAccionista {
  return {
    id,
    tipoAccionista: "sucursal",
    tipoDocumento: state.tipoDocumento,
    numeroDocumento: state.numeroDocumento,
    nombreSucursal: state.nombreSucursal,
    partidaRegistral: state.partidaRegistral,
    sedeRegistral: state.sedeRegistral,
    domicilioFiscal: state.domicilioFiscal,
    tieneRepresentante: state.tieneRepresentante,
    representanteLegal:
      state.tieneRepresentante && stateRepresentante
        ? convertirStateAPersonaNatural(stateRepresentante)
        : undefined,
  };
}

function transformarSucesionesIndivisasAAccionista(
  state: AccionistaSucesionesIndivisasState,
  stateRepresentante: PersonaNaturalState | null,
  id: string
): SucesionesIndivisasAccionista {
  return {
    id,
    tipoAccionista: "sucesiones_indivisas",
    tipoDocumento: state.tipoDocumento,
    numeroDocumento: state.numeroDocumento,
    razonSocial: state.razonSocial,
    direccion: state.direccion,
    distrito: state.distrito,
    provincia: state.provincia,
    departamento: state.departamento,
    tieneRepresentante: state.tieneRepresentante,
    representanteLegal:
      state.tieneRepresentante && stateRepresentante
        ? convertirStateAPersonaNatural(stateRepresentante)
        : undefined,
  };
}

function transformarFideicomisosAAccionista(
  state: AccionistaFideicomisosState,
  stateRepresentante: PersonaNaturalState | null,
  id: string
): FideicomisosAccionista {
  const baseData = {
    id,
    tipoAccionista: "fideicomisos" as const,
    identificacionFideicomiso: state.identificacionFideicomiso,
    partidaRegistral: state.partidaRegistral,
    sedeRegistral: state.sedeRegistral,
    domicilioFiscal: state.domicilioFiscal,
    numeroDocumentoFiduciaria: state.numeroDocumentoFiduciaria,
    tipoDocumentoFiduciaria: state.tipoDocumentoFiduciaria,
    razonSocialFiduciaria: state.razonSocialFiduciaria,
    tieneRepresentante: state.tieneRepresentante,
    representanteLegal:
      state.tieneRepresentante && stateRepresentante
        ? convertirStateAPersonaNatural(stateRepresentante)
        : undefined,
  };

  if (state.tieneRuc) {
    return {
      ...baseData,
      tieneRuc: true,
      numeroDocumento: state.numeroDocumento,
      tipoDocumento: state.tipoDocumento,
      razonSocial: state.razonSocial,
    } as FideicomisosAccionista;
  } else {
    return {
      ...baseData,
      tieneRuc: false,
    } as FideicomisosAccionista;
  }
}

function transformarFondosInversionAAccionista(
  state: AccionistaFondosInversionState,
  stateRepresentante: PersonaNaturalState | null,
  id: string
): FondosInversionAccionista {
  return {
    id,
    tipoAccionista: "fondos_inversion",
    tipoDocumento: state.tipoDocumento,
    numeroDocumento: state.numeroDocumento,
    razonSocial: state.razonSocial,
    direccion: state.direccion,
    tipoFondo: state.tipoFondo,
    numeroDocumentoSociedadAdministradora: state.numeroDocumentoSociedadAdministradora,
    tipoDocumentoSociedadAdministradora: state.tipoDocumentoSociedadAdministradora,
    razonSocialSociedadAdministradora: state.razonSocialSociedadAdministradora,
    tieneRepresentante: state.tieneRepresentante,
    representanteLegal:
      state.tieneRepresentante && stateRepresentante
        ? convertirStateAPersonaNatural(stateRepresentante)
        : undefined,
  };
}

// ============================================================================
// FUNCIONES ESPECÍFICAS: ACCIONISTA → MODAL
// ============================================================================

function transformarAccionistaANatural(
  accionista: PersonaNaturalAccionista
): AccionistaNaturalState {
  return {
    tipoDocumento: accionista.tipoDocumento,
    numeroDocumento: accionista.numeroDocumento,
    nombre: accionista.nombre,
    apellidoPaterno: accionista.apellidoPaterno,
    apellidoMaterno: accionista.apellidoMaterno,
    paisPasaporte: accionista.paisPasaporte || "",
    estadoCivil: accionista.estadoCivil,
    regimenPatrimonial: accionista.regimenPatrimonial || ("" as RegimenPatrimonialEnum),
    conyuge: accionista.conyuge
      ? {
          tipoDocumento: accionista.conyuge.tipoDocumento,
          numeroDocumento: accionista.conyuge.numeroDocumento,
          nombre: accionista.conyuge.nombre,
          apellidoPaterno: accionista.conyuge.apellidoPaterno,
          apellidoMaterno: accionista.conyuge.apellidoMaterno,
          paisPasaporte: accionista.conyuge.paisPasaporte || "",
        }
      : {
          tipoDocumento: "" as TipoDocumentosEnum,
          numeroDocumento: "",
          nombre: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          paisPasaporte: "",
        },
    partidaRegistral: accionista.partidaRegistral || "",
    sedeRegistral: accionista.sedeRegistral || "",
  };
}

function transformarAccionistaAJuridica(accionista: PersonaJuridicaAccionista): {
  stateModal: AccionistaJuridicoState;
  stateRepresentante: PersonaNaturalState | null;
} {
  // PersonaJuridica puede ser Peruana o Extranjera con propiedades diferentes
  const stateModal: AccionistaJuridicoState = {
    seConstituyoEnPeru: accionista.seConstituyoEnPeru,
    tipoDocumento: accionista.tipoDocumento,
    numeroDocumento: accionista.numeroDocumento,
    razonSocial: accionista.razonSocial,
    nombreComercial: "",
    direccion: accionista.direccion || "",
    distrito: "",
    provincia: "",
    departamento: "",
    paisOrigen: "",
    tieneRepresentante: accionista.tieneRepresentante || false,
  };

  // Si es peruana, tiene diferentes propiedades
  if (accionista.seConstituyoEnPeru) {
    stateModal.nombreComercial = accionista.nombreComercial || "";
    stateModal.distrito = accionista.distrito || "";
    stateModal.provincia = accionista.provincia || "";
    stateModal.departamento = accionista.departamento || "";
  } else {
    stateModal.paisOrigen = accionista.paisOrigen || "";
  }

  return {
    stateModal,
    stateRepresentante: accionista.representanteLegal
      ? {
          tipoDocumento: accionista.representanteLegal.tipoDocumento || ("" as any),
          numeroDocumento: accionista.representanteLegal.numeroDocumento,
          nombre: accionista.representanteLegal.nombre,
          apellidoPaterno: accionista.representanteLegal.apellidoPaterno,
          apellidoMaterno: accionista.representanteLegal.apellidoMaterno,
          paisPasaporte: accionista.representanteLegal.paisPasaporte || "",
        }
      : null,
  };
}

function transformarAccionistaASucursal(accionista: SucursalAccionista): {
  stateModal: AccionistaSucursalState;
  stateRepresentante: PersonaNaturalState | null;
} {
  return {
    stateModal: {
      tipoDocumento: accionista.tipoDocumento,
      numeroDocumento: accionista.numeroDocumento,
      nombreSucursal: accionista.nombreSucursal,
      partidaRegistral: accionista.partidaRegistral,
      sedeRegistral: accionista.sedeRegistral,
      domicilioFiscal: accionista.domicilioFiscal,
      tieneRepresentante: accionista.tieneRepresentante,
    },
    stateRepresentante: accionista.representanteLegal
      ? {
          tipoDocumento: accionista.representanteLegal.tipoDocumento,
          numeroDocumento: accionista.representanteLegal.numeroDocumento,
          nombre: accionista.representanteLegal.nombre,
          apellidoPaterno: accionista.representanteLegal.apellidoPaterno,
          apellidoMaterno: accionista.representanteLegal.apellidoMaterno,
          paisPasaporte: accionista.representanteLegal.paisPasaporte || "",
        }
      : null,
  };
}

function transformarAccionistaASucesionesIndivisas(
  accionista: SucesionesIndivisasAccionista
): {
  stateModal: AccionistaSucesionesIndivisasState;
  stateRepresentante: PersonaNaturalState | null;
} {
  return {
    stateModal: {
      tipoDocumento: accionista.tipoDocumento,
      numeroDocumento: accionista.numeroDocumento,
      razonSocial: accionista.razonSocial,
      direccion: accionista.direccion,
      distrito: accionista.distrito || "",
      provincia: accionista.provincia || "",
      departamento: accionista.departamento || "",
      tieneRepresentante: accionista.tieneRepresentante || false,
    },
    stateRepresentante: accionista.representanteLegal
      ? {
          tipoDocumento: accionista.representanteLegal.tipoDocumento,
          numeroDocumento: accionista.representanteLegal.numeroDocumento,
          nombre: accionista.representanteLegal.nombre,
          apellidoPaterno: accionista.representanteLegal.apellidoPaterno,
          apellidoMaterno: accionista.representanteLegal.apellidoMaterno,
          paisPasaporte: accionista.representanteLegal.paisPasaporte || "",
        }
      : null,
  };
}

function transformarAccionistaAFideicomisos(accionista: FideicomisosAccionista): {
  stateModal: AccionistaFideicomisosState;
  stateRepresentante: PersonaNaturalState | null;
} {
  const baseState: AccionistaFideicomisosState = {
    tieneRuc: accionista.tieneRuc,
    numeroDocumento: "",
    tipoDocumento: "",
    razonSocial: "",
    identificacionFideicomiso: accionista.identificacionFideicomiso,
    partidaRegistral: accionista.partidaRegistral,
    sedeRegistral: accionista.sedeRegistral,
    domicilioFiscal: accionista.domicilioFiscal,
    numeroDocumentoFiduciaria: accionista.numeroDocumentoFiduciaria,
    tipoDocumentoFiduciaria: accionista.tipoDocumentoFiduciaria,
    razonSocialFiduciaria: accionista.razonSocialFiduciaria,
    tieneRepresentante: accionista.tieneRepresentante,
  };

  if (accionista.tieneRuc) {
    baseState.numeroDocumento = accionista.numeroDocumento;
    baseState.tipoDocumento = accionista.tipoDocumento;
    baseState.razonSocial = accionista.razonSocial;
  }

  return {
    stateModal: baseState,
    stateRepresentante: accionista.representanteLegal
      ? {
          tipoDocumento: accionista.representanteLegal.tipoDocumento,
          numeroDocumento: accionista.representanteLegal.numeroDocumento,
          nombre: accionista.representanteLegal.nombre,
          apellidoPaterno: accionista.representanteLegal.apellidoPaterno,
          apellidoMaterno: accionista.representanteLegal.apellidoMaterno,
          paisPasaporte: accionista.representanteLegal.paisPasaporte || "",
        }
      : null,
  };
}

function transformarAccionistaAFondosInversion(accionista: FondosInversionAccionista): {
  stateModal: AccionistaFondosInversionState;
  stateRepresentante: PersonaNaturalState | null;
} {
  return {
    stateModal: {
      tipoDocumento: accionista.tipoDocumento,
      numeroDocumento: accionista.numeroDocumento,
      razonSocial: accionista.razonSocial,
      direccion: accionista.direccion,
      tipoFondo: accionista.tipoFondo,
      numeroDocumentoSociedadAdministradora: accionista.numeroDocumentoSociedadAdministradora,
      tipoDocumentoSociedadAdministradora: accionista.tipoDocumentoSociedadAdministradora,
      razonSocialSociedadAdministradora: accionista.razonSocialSociedadAdministradora,
      tieneRepresentante: accionista.tieneRepresentante,
    },
    stateRepresentante: accionista.representanteLegal
      ? {
          tipoDocumento: accionista.representanteLegal.tipoDocumento,
          numeroDocumento: accionista.representanteLegal.numeroDocumento,
          nombre: accionista.representanteLegal.nombre,
          apellidoPaterno: accionista.representanteLegal.apellidoPaterno,
          apellidoMaterno: accionista.representanteLegal.apellidoMaterno,
          paisPasaporte: accionista.representanteLegal.paisPasaporte || "",
        }
      : null,
  };
}
