import type { AcuerdoSocietario } from "../../domain/entities/acuerdo-societario.entity";
import type { AcuerdosSocietariosRepository } from "../../domain/ports/acuerdos-societarios.repository";

/**
 * Caso de uso para obtener los acuerdos societarios de una sociedad.
 */
export class GetAcuerdosSocietariosUseCase {
  constructor(private readonly repository: AcuerdosSocietariosRepository) {}

  /**
   * Ejecuta la obtención de acuerdos societarios.
   * @param profileId ID del perfil de sociedad
   * @returns Acuerdos societarios o null si no existen
   */
  async execute(profileId: string): Promise<AcuerdoSocietario | null> {
    return this.repository.get(profileId);
  }
}

