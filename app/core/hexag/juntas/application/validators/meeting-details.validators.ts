/**
 * Validadores de negocio para los detalles de la junta
 */

/**
 * Valida que el plazo entre convocatoria y junta sea de al menos 3 días calendarios
 * para la primera convocatoria
 */
export function validatePrimeraConvocatoriaPlazo(
  fechaConvocatoria: Date,
  fechaJunta: Date
): boolean {
  const diffTime = fechaJunta.getTime() - fechaConvocatoria.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 3;
}

/**
 * Valida que el plazo entre primera y segunda convocatoria sea de 3 a 10 días calendarios
 */
export function validateSegundaConvocatoriaPlazo(
  fechaPrimera: Date,
  fechaSegunda: Date
): boolean {
  const diffTime = fechaSegunda.getTime() - fechaPrimera.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 3 && diffDays <= 10;
}

/**
 * Valida que la segunda convocatoria sea posterior a la primera
 */
export function validateSegundaPosteriorPrimera(
  fechaPrimera: Date,
  fechaSegunda: Date
): boolean {
  return fechaSegunda.getTime() > fechaPrimera.getTime();
}

/**
 * Calcula los días entre dos fechas
 */
export function calcularDiasEntreFechas(fechaInicio: Date, fechaFin: Date): number {
  const diffTime = fechaFin.getTime() - fechaInicio.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

