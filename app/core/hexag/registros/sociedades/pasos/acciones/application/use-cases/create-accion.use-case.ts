import type { Accion } from "../../domain/entities/accion.entity";
import type { AccionesRepository } from "../../domain/ports/acciones.repository";
import type { AccionDTO } from "../dtos/accion.dto";

/**
 * Caso de uso para crear una nueva acción.
 */
export class CreateAccionUseCase {
  constructor(private readonly repository: AccionesRepository) {}

  /**
   * Ejecuta la creación de una acción.
   * @param profileId ID del perfil de sociedad
   * @param payload Datos de la acción a crear
   * @returns Acción creada
   */
  async execute(profileId: string, payload: AccionDTO): Promise<Accion> {
    return this.repository.create(profileId, payload);
  }
}
