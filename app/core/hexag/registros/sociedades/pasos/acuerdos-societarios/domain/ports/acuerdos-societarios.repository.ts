import type { AcuerdoSocietarioDTO } from "../../application/dtos/acuerdo-societario.dto";
import type { AcuerdoSocietario } from "../entities/acuerdo-societario.entity";

/**
 * Puerto (contrato) para el repositorio de acuerdos societarios.
 */
export interface AcuerdosSocietariosRepository {
  /**
   * Obtiene los acuerdos societarios de una sociedad.
   */
  get(profileId: string): Promise<AcuerdoSocietario | null>;

  /**
   * Actualiza los acuerdos societarios de una sociedad.
   */
  update(profileId: string, payload: AcuerdoSocietarioDTO): Promise<void>;
}
