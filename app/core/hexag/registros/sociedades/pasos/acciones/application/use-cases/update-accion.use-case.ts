import type { AccionPayload, AccionesRepository } from "../../domain";

/**
 * Caso de uso para actualizar una acción existente.
 */
export class UpdateAccionUseCase {
  constructor(private readonly repository: AccionesRepository) {}

  /**
   * Ejecuta la actualización de una acción.
   * @param profileId ID del perfil de sociedad
   * @param accionId ID de la acción a actualizar
   * @param payload Datos actualizados de la acción
   */
  async execute(profileId: string, payload: AccionPayload): Promise<void> {
    return this.repository.update(profileId, payload);
  }
}
