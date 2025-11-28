import type { ValorNominal } from "../../domain/entities/valor-nominal.entity";
import type { ValorNominalRepository } from "../../domain/ports/valor-nominal.repository";

/**
 * Caso de uso para obtener el valor nominal de una sociedad.
 */
export class GetValorNominalUseCase {
  constructor(private readonly repository: ValorNominalRepository) {}

  /**
   * Ejecuta la obtención del valor nominal.
   * @param profileId ID del perfil de sociedad
   * @returns Valor nominal (número)
   */
  async execute(profileId: string): Promise<ValorNominal> {
    return this.repository.get(profileId);
  }
}

