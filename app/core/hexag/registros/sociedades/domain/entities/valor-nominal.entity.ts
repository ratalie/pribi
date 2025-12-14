import type { TipoAccionesSociedad } from "../../application/dtos/valor-nominal.dto";

/**
 * Entidad de dominio que representa el valor nominal y tipo de acciones de una sociedad.
 */
export interface ValorNominal {
  valorNominal: number;
  tipoAccionesSociedad: TipoAccionesSociedad;
}

