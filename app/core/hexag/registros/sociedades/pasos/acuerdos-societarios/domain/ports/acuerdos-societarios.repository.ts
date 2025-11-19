import type { AcuerdoSocietario } from "../entities/acuerdo-societario.entity";
import type { AcuerdoSocietarioDTO } from "../../application/dtos/acuerdo-societario.dto";

/**
 * Puerto (contrato) para el repositorio de acuerdos societarios.
 */
export interface AcuerdosSocietariosRepository {
  /**
   * Obtiene los acuerdos societarios de una sociedad.
   */
  get(profileId: string): Promise<AcuerdoSocietario | null>;

  /**
   * Crea los acuerdos societarios de una sociedad.
   */
  create(profileId: string, payload: AcuerdoSocietarioDTO): Promise<AcuerdoSocietario>;

  /**
   * Actualiza los acuerdos societarios de una sociedad.
   */
  update(profileId: string, payload: AcuerdoSocietarioDTO): Promise<AcuerdoSocietario>;
}

