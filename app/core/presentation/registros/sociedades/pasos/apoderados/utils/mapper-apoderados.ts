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
      return TipoDocumentosEnum.DNI;
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
      return DocumentTypeEnum.DNI;
  }
};

export const mapperApoderadoNaturalModalALista = (
  claseApoderadoId: string,
  personaNaturalStore: ReturnType<typeof usePersonaNaturalStore>,
  apoderadoId?: string
): Apoderado => {
  return {
    id: apoderadoId ?? uuidv4(),
    claseApoderadoId: claseApoderadoId,
    persona: {
      id: uuidv4(),
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
  const personaNatural = {
    name: apoderado.persona.tipo === PersonTypeEnum.NATURAL ? apoderado.persona.nombre : "",
    apellidoPaterno:
      apoderado.persona.tipo === PersonTypeEnum.NATURAL
        ? apoderado.persona.apellidoPaterno
        : "",
    apellidoMaterno:
      apoderado.persona.tipo === PersonTypeEnum.NATURAL
        ? apoderado.persona.apellidoMaterno
        : "",
    paisPasaporte:
      apoderado.persona.tipo === PersonTypeEnum.NATURAL
        ? apoderado.persona.paisEmision ?? ""
        : "",
  };

  return {
    tipoDocumento: convertirDocumentoDomainAUI(apoderado.persona.tipoDocumento),
    numeroDocumento: apoderado.persona.numeroDocumento,
    nombre: personaNatural.name,
    apellidoPaterno: personaNatural.apellidoPaterno,
    apellidoMaterno: personaNatural.apellidoMaterno,
    paisPasaporte: personaNatural.paisPasaporte,
    estadoCivil: null,
  };
};
