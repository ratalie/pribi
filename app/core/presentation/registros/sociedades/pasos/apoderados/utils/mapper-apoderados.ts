import { v4 as uuidv4 } from "uuid";
import {
  DocumentTypeEnum,
  PersonTypeEnum,
  type Apoderado,
} from "~/core/hexag/registros/sociedades/pasos/apoderados/domain";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

export const convertirDocumentoDomainAUI = (
  documento: DocumentTypeEnum
): TipoDocumentosEnum => {
  switch (documento) {
    case DocumentTypeEnum.DNI:
      return TipoDocumentosEnum.DNI;
    case DocumentTypeEnum.CE:
      return TipoDocumentosEnum.CARNET_DE_EXTRANJERIA;
    case DocumentTypeEnum.PASAPORTE:
      return TipoDocumentosEnum.PASAPORTE;
    case DocumentTypeEnum.RUC:
      return TipoDocumentosEnum.RUC;
    default:
      return documento;
  }
};

export const convertirDocumentoUIADomain = (
  documento: TipoDocumentosEnum
): DocumentTypeEnum => {
  switch (documento) {
    case TipoDocumentosEnum.DNI:
      return DocumentTypeEnum.DNI;
    case TipoDocumentosEnum.CARNET_DE_EXTRANJERIA:
      return DocumentTypeEnum.CE;
    case TipoDocumentosEnum.PASAPORTE:
      return DocumentTypeEnum.PASAPORTE;
    case TipoDocumentosEnum.RUC:
      return DocumentTypeEnum.RUC;
    default:
      return documento;
  }
};

export const mapperApoderadoNaturalModalALista = (
  claseApoderadoId: string,
  personaNaturalStore: ReturnType<typeof usePersonaNaturalStore>,
  apoderadoId?: string,
  personaId?: string
): Apoderado => {
  return {
    id: apoderadoId ?? uuidv4(),
    claseApoderadoId: claseApoderadoId,
    persona: {
      id: personaId ?? uuidv4(),
      tipo: PersonTypeEnum.NATURAL,
      nombre: personaNaturalStore.nombre,
      apellidoPaterno: personaNaturalStore.apellidoPaterno,
      apellidoMaterno: personaNaturalStore.apellidoMaterno,
      tipoDocumento: convertirDocumentoUIADomain(
        personaNaturalStore.tipoDocumento as TipoDocumentosEnum
      ),
      numeroDocumento: personaNaturalStore.numeroDocumento,
      paisEmision: personaNaturalStore.paisPasaporte ?? undefined,
    },
  };
};

export const mapperApoderadoNaturalEntityAModal = (
  apoderado: Apoderado
): PersonaNaturalState => {
  if (apoderado.persona.tipo !== PersonTypeEnum.NATURAL) {
    throw new Error("Apoderado no es natural");
  }

  return {
    tipoDocumento: convertirDocumentoDomainAUI(
      apoderado.persona.tipoDocumento as DocumentTypeEnum
    ),
    numeroDocumento: apoderado.persona.numeroDocumento,
    nombre: apoderado.persona.nombre,
    apellidoPaterno: apoderado.persona.apellidoPaterno,
    apellidoMaterno: apoderado.persona.apellidoMaterno,
    paisPasaporte: apoderado.persona.paisEmision ?? "",
    estadoCivil: null,
  };
};

export const mapperApoderadoJuridicaModalALista = (
  claseApoderadoId: string,
  personaJuridicaStore: ReturnType<typeof usePersonaJuridicaStore>,
  personaNaturalStore: ReturnType<typeof usePersonaNaturalStore>,
  apoderadoId?: string,
  personaId?: string
): Apoderado => {
  const representante = {
    nombre: personaNaturalStore.nombre,
    apellidoPaterno: personaNaturalStore.apellidoPaterno,
    apellidoMaterno: personaNaturalStore.apellidoMaterno,
    tipoDocumento: convertirDocumentoUIADomain(
      personaNaturalStore.tipoDocumento as TipoDocumentosEnum
    ),
    numeroDocumento: personaNaturalStore.numeroDocumento,
    paisEmision: personaNaturalStore.paisPasaporte ?? undefined,
  };

  return {
    id: apoderadoId ?? uuidv4(),
    claseApoderadoId: claseApoderadoId,
    persona: {
      id: personaId ?? uuidv4(),
      tipo: PersonTypeEnum.JURIDICA,
      tipoDocumento: personaJuridicaStore.seConstituyoEnPeru
        ? DocumentTypeEnum.RUC
        : personaJuridicaStore.tipoDocumento,
      numeroDocumento: personaJuridicaStore.numeroDocumento,
      razonSocial: personaJuridicaStore.razonSocial,
      direccion: personaJuridicaStore.direccion,
      constituida: personaJuridicaStore.seConstituyoEnPeru,
      nombreComercial: personaJuridicaStore.seConstituyoEnPeru
        ? personaJuridicaStore.nombreComercial
        : undefined,
      distrito: personaJuridicaStore.seConstituyoEnPeru
        ? personaJuridicaStore.distrito
        : undefined,
      provincia: personaJuridicaStore.seConstituyoEnPeru
        ? personaJuridicaStore.provincia
        : undefined,
      departamento: personaJuridicaStore.seConstituyoEnPeru
        ? personaJuridicaStore.departamento
        : undefined,
      pais: !personaJuridicaStore.seConstituyoEnPeru
        ? personaJuridicaStore.paisOrigen
        : undefined,
      representante: personaJuridicaStore.tieneRepresentante ? representante : undefined,
    },
  };
};

export const mapperApoderadoJuridicaEntityAModal = (
  apoderado: Apoderado
): PersonaJuridicaState => {
  if (apoderado.persona.tipo !== PersonTypeEnum.JURIDICA) {
    throw new Error("Apoderado no es jurídico");
  }

  return {
    seConstituyoEnPeru: apoderado.persona.constituida,
    tipoDocumento: apoderado.persona.tipoDocumento,
    numeroDocumento: apoderado.persona.numeroDocumento,
    razonSocial: apoderado.persona.razonSocial,
    nombreComercial: apoderado.persona.nombreComercial ?? "",
    direccion: apoderado.persona.direccion ?? "",
    distrito: apoderado.persona.distrito ?? "",
    provincia: apoderado.persona.provincia ?? "",
    departamento: apoderado.persona.departamento ?? "",
    paisOrigen: apoderado.persona.pais ?? "",
    tieneRepresentante: apoderado.persona.representante ? true : false,
  };
};
