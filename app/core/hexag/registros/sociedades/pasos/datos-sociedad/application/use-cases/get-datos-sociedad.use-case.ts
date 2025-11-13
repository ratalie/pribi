import type { DatosSociedadRepository } from "../../domain";
import type { SociedadDatosGenerales } from "../../domain";

export class GetDatosSociedadUseCase {
  constructor(private readonly repository: DatosSociedadRepository) {}

  execute(idSociety: string): Promise<SociedadDatosGenerales | null> {
    return this.repository.get(idSociety);
  }
}

