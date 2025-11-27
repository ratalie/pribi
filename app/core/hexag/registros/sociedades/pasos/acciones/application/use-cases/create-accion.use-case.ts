import type { AccionPayload } from "../../domain/entities/accion-payload.entity";
import type { AccionesRepository } from "../../domain/ports/acciones.repository";

/**
 * Caso de uso para crear una nueva acción.
 */
export class CreateAccionUseCase {
  constructor(private readonly repository: AccionesRepository) {}

  /**
   * Ejecuta la creación de una acción.
   * @param profileId ID del perfil de sociedad
   * @param payload Datos de la acción a crear
   */
  async execute(profileId: string, payload: AccionPayload): Promise<void> {
    return this.repository.create(profileId, payload);
  }
}

