import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

export const tipoDocumentoOptions = [
  {
    id: 1,
    value: TipoDocumentosEnum.DNI,
    label: TipoDocumentosEnum.DNI,
  },
  {
    id: 2,
    value: TipoDocumentosEnum.PASAPORTE,
    label: TipoDocumentosEnum.PASAPORTE,
  },
  {
    id: 3,
    value: TipoDocumentosEnum.CARNET_DE_EXTRANJERIA,
    label: TipoDocumentosEnum.CARNET_DE_EXTRANJERIA,
  },
];
