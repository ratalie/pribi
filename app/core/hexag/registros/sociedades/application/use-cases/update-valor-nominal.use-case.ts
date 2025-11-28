import type { ValorNominalRepository } from "../../domain/ports/valor-nominal.repository";
import type { ValorNominalDTO } from "../dtos/valor-nominal.dto";

/**
 * Caso de uso para actualizar el valor nominal de una sociedad.
 */
export class UpdateValorNominalUseCase {
  constructor(private readonly repository: ValorNominalRepository) {}

  /**
   * Ejecuta la actualización del valor nominal.
   * @param profileId ID del perfil de sociedad
   * @param payload Datos del valor nominal a actualizar
   * @returns void
   */
  async execute(profileId: string, payload: ValorNominalDTO): Promise<void> {
    return this.repository.update(profileId, payload);
  }
}

