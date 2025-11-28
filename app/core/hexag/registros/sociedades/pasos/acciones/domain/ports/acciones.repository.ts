import type { AccionPayload } from "../entities/accion-payload.entity";
import type { Accion } from "../entities/accion.entity";

/**
 * Puerto (contrato) para el repositorio de acciones.
 */
export interface AccionesRepository {
  /**
   * Obtiene la lista de acciones de una sociedad.
   */
  list(profileId: string): Promise<Accion[]>;

  /**
   * Crea una nueva acción.
   */
  create(profileId: string, payload: AccionPayload): Promise<void>;

  /**
   * Actualiza una acción existente.
   */
  update(profileId: string, payload: AccionPayload): Promise<void>;

  /**
   * Elimina una acción.
   */
  delete(profileId: string, accionIds: string[]): Promise<void>;
}
