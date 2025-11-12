import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

export const tipoDocumentoOptions = Object.values(TipoDocumentosEnum).map((tipo, index) => ({
  id: index + 1,
  value: tipo,
  label: tipo,
}));
