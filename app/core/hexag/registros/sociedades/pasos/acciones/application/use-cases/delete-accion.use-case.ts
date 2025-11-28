import type { AccionesRepository } from "../../domain";

/**
 * Caso de uso para eliminar una acción.
 */
export class DeleteAccionUseCase {
  constructor(private readonly repository: AccionesRepository) {}

  /**
   * Ejecuta la eliminación de una acción.
   * @param profileId ID del perfil de sociedad
   * @param accionId ID de la acción a eliminar
   * @returns void
   */
  async execute(profileId: string, accionIds: string[]): Promise<void> {
    return this.repository.delete(profileId, accionIds);
  }
}
