import type { DatosSociedadRepository, SociedadDatosGenerales } from "../../domain";

export class GetDatosSociedadUseCase {
  constructor(private readonly repository: DatosSociedadRepository) {}

  execute(idSociety: string): Promise<SociedadDatosGenerales | null> {
    return this.repository.get(idSociety);
  }
}

