import type { DatosSociedadDTO } from "../dtos/datos-sociedad.dto";
import type { SociedadDatosGenerales, DatosSociedadRepository } from "../../domain";

export class UpdateDatosSociedadUseCase {
  constructor(private readonly repository: DatosSociedadRepository) {}

  execute(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales> {
    return this.repository.update(idSociety, payload);
  }
}

