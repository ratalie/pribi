/**
 * DTOs para Application of Results
 * 
 * Endpoints:
 * - POST /api/v2/society-profile/:societyId/register-assembly/:flowId/application-of-results
 * - GET /api/v2/society-profile/:societyId/register-assembly/:flowId/application-of-results
 * - PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/application-of-results
 */

/**
 * DTO Request/Response para Application of Results
 * 
 * Según documentación del backend, el mismo formato se usa para POST, PUT y GET
 */
export interface ApplicationOfResultsDTO {
  // Valores Preliminares
  capitalSocialPagadoInicial: number; // Capital social pagado al inicio
  utilidadPerdidaAcumuladaInicial: number; // Utilidad o pérdida acumulada inicial
  resultadoEjercicioInicial: number; // Resultado del ejercicio inicial
  patrimonioNetoInicial: number; // Patrimonio neto inicial

  // Cálculo Utilidad Antes de Reserva Legal
  diferenciaPatrimonioCapitalPagado: number; // Diferencia entre patrimonio y capital pagado
  utilidadDistribuibleAntesReservaLegal: number; // Utilidad distribuible antes de reserva legal

  // Cálculo de Reserva Legal
  capitalSocialSuscrito: number; // Capital social suscrito
  reservaLegalActual: number; // Reserva legal actual
  porcentajeReservaLegal: number; // Porcentaje de reserva legal (0-100)
  montoReservaLegal: number; // Monto de reserva legal calculado
  nuevaReservaLegal: number; // Nueva reserva legal (actual + monto)

  // Valores Finales
  capitalSocialPagadoFinal: number; // Capital social pagado final
  utilidadPerdidaAcumuladaFinal: number; // Utilidad o pérdida acumulada final
  resultadoEjercicioFinal: number; // Resultado del ejercicio final
  patrimonioNetoFinal: number; // Patrimonio neto final
  utilidadDistribuibleFinal: number; // Utilidad distribuible final
  utilidadNoDistribuida: number; // Utilidad no distribuida
  utilidadADistribuir: number; // Utilidad a distribuir
}

/**
 * DTO Response del backend
 */
export interface ApplicationOfResultsResponseDTO {
  success: boolean;
  message: string;
  data?: ApplicationOfResultsDTO;
  code: number;
}


