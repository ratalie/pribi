import type { ValorNominal } from "../entities/valor-nominal.entity";
import type { ValorNominalDTO } from "../../application/dtos/valor-nominal.dto";

/**
 * Puerto (contrato) para el repositorio de valor nominal.
 */
export interface ValorNominalRepository {
  /**
   * Obtiene el valor nominal y tipo de acciones de una sociedad.
   */
  get(profileId: string): Promise<ValorNominal>;

  /**
   * Actualiza el valor nominal y tipo de acciones de una sociedad.
   */
  update(profileId: string, payload: ValorNominalDTO): Promise<void>;
}

