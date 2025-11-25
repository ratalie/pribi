import type { AccionDTO } from "../../application/dtos/accion.dto";
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
  create(profileId: string, payload: AccionDTO): Promise<Accion>;

  /**
   * Actualiza una acción existente.
   */
  update(profileId: string, accionId: string, payload: AccionDTO): Promise<Accion>;

  /**
   * Elimina una acción.
   */
  delete(profileId: string, accionId: string): Promise<void>;
}
