import type { Accion } from "../../domain/entities/accion.entity";
import type { AccionesRepository } from "../../domain/ports/acciones.repository";
import type { AccionDTO } from "../dtos/accion.dto";

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
   * @returns Acción actualizada
   */
  async execute(profileId: string, accionId: string, payload: AccionDTO): Promise<Accion> {
    return this.repository.update(profileId, accionId, payload);
  }
}

