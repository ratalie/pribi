import type { Accion } from "../../domain/entities/accion.entity";
import type { AccionesRepository } from "../../domain/ports/acciones.repository";

/**
 * Caso de uso para obtener la lista de acciones de una sociedad.
 */
export class ListAccionesUseCase {
  constructor(private readonly repository: AccionesRepository) {}

  /**
   * Ejecuta la obtención de la lista de acciones.
   * @param profileId ID del perfil de sociedad
   * @returns Lista de acciones
   */
  async execute(profileId: string): Promise<Accion[]> {
    return this.repository.list(profileId);
  }
}

