/**
 * Tipo de acciones de la sociedad
 */
export type TipoAccionesSociedad = "COMUNES_SIN_DERECHO_VOTO" | "CON_CLASES" | null;

/**
 * DTO para actualizar el valor nominal y tipo de acciones de una sociedad.
 * Se usa para el PUT.
 */
export interface ValorNominalDTO {
  valorNominal: number;
  tipoAccionesSociedad?: TipoAccionesSociedad;
}

/**
 * DTO de respuesta al obtener valor nominal y tipo de acciones.
 * Se usa para el GET.
 */
export interface ValorNominalResponseDTO {
  valorNominal: number;
  tipoAccionesSociedad: TipoAccionesSociedad;
}

