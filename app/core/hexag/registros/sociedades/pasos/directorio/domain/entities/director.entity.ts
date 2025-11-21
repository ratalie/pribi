import type { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
import type { TipoDirector } from "../enums/director-tipo.enum";

export interface DirectorConfig {
  id: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  numeroDocumento: string;
  tipoDocumento: TipoDocumentosEnum;
  tipoDirector: TipoDirector;
  reemplazoAsignado: string | null;
  createdAt: string;
  updatedAt: string;
}
