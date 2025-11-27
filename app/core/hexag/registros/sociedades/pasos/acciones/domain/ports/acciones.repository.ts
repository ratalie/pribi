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
   * Actualiza una acción existente.
   */
  update(profileId: string, accionId: string, payload: AccionPayload): Promise<void>;

  /**
   * Elimina una acción.
   */
  delete(profileId: string, accionId: string): Promise<void>;
}
