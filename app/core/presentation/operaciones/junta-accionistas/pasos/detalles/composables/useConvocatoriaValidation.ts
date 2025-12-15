/**
 * Composable para validaciones de convocatorias
 * 
 * Responsabilidades:
 * - Schemas de Zod para validación
 * - Validaciones de plazos (3 días, 3-10 días)
 * - Mensajes de error
 */

import { z } from 'zod';

export function useConvocatoriaValidation() {
  /**
   * Schema de validación para dirección
   */
  const direccionSchema = z.string().min(1, 'Este campo es obligatorio');

  /**
   * Schema de validación para fecha
   */
  const fechaSchema = z.string().min(1, 'La fecha es obligatoria');

  /**
   * Schema de validación para hora
   */
  const horaSchema = z.string().min(1, 'La hora es obligatoria');

  /**
   * Valida que haya un plazo mínimo de 3 días entre convocatoria y junta
   * @param fechaConvocatoria Fecha de la convocatoria
   * @param fechaJunta Fecha de la junta (opcional, si no se proporciona usa hoy)
   */
  const validatePlazoPrimera = (fechaConvocatoria: Date, fechaJunta?: Date): boolean => {
    const fechaReferencia = fechaJunta || new Date();
    const diferencia = fechaConvocatoria.getTime() - fechaReferencia.getTime();
    const dias = diferencia / (1000 * 60 * 60 * 24);
    return dias >= 3;
  };

  /**
   * Valida que el plazo entre primera y segunda convocatoria sea de 3 a 10 días
   * @param fechaPrimera Fecha de la primera convocatoria
   * @param fechaSegunda Fecha de la segunda convocatoria
   */
  const validatePlazoSegunda = (fechaPrimera: Date, fechaSegunda: Date): boolean => {
    const diferencia = fechaSegunda.getTime() - fechaPrimera.getTime();
    const dias = diferencia / (1000 * 60 * 60 * 24);
    return dias >= 3 && dias <= 10;
  };

  return {
    direccionSchema,
    fechaSchema,
    horaSchema,
    validatePlazoPrimera,
    validatePlazoSegunda,
  };
}

