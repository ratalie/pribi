import type { DatosSociedadDTO } from "../../application/dtos/datos-sociedad.dto";
import type { SociedadDatosGenerales } from "../entities/datos-sociedad.entity";

export interface DatosSociedadRepository {
  get(idSociety: string): Promise<SociedadDatosGenerales | null>;
  create(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales>;
  update(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales>;
}

