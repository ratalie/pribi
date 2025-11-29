import type { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
import type { TipoDirector } from "../../domain/enums/director-tipo.enum";


export interface PersonaDirectorDTO {
  id?: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: TipoDocumentosEnum; // "DNI" | "CARNET_EXTRANJERIA" | "PASAPORTE"
  numeroDocumento: string;
  paisEmision?: string | null; // "PE" | null
}

export interface DirectorDTO {
  id?: string;
  persona: PersonaDirectorDTO;
  rolDirector: TipoDirector; // TITULAR, SUPLENTE, ALTERNO
  reemplazaId?: string | null; // ID del director que reemplaza (para ALTERNO)
}