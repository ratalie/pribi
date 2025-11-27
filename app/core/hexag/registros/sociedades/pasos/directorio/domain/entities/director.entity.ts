import type { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
import type { TipoDirector } from "../enums/director-tipo.enum";

export interface PersonaDirectorConfig {
  id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: TipoDocumentosEnum;
  numeroDocumento: string;
  paisEmision: string | null;
}

export interface DirectorConfig {
  id: string;
  persona: PersonaDirectorConfig;
  rolDirector: TipoDirector;
  reemplazaId: string | null;
  createdAt: string;
  updatedAt: string;
}
// export interface DirectorConfig {
//   id: string;
//   nombres: string;
//   apellidoPaterno: string;
//   apellidoMaterno: string;
//   numeroDocumento: string;
//   tipoDocumento: TipoDocumentosEnum;
//   tipoDirector: TipoDirector;
//   reemplazoAsignado: string | null;
//   createdAt: string;
//   updatedAt: string;
// }
