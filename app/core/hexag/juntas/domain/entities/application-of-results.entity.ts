/**
 * Entity: Application of Results
 * 
 * Representa la aplicación de resultados económicos de una sociedad
 * en el contexto de una junta de accionistas.
 * 
 * Esta entidad contiene todos los cálculos financieros relacionados con:
 * - Valores preliminares
 * - Cálculo de utilidades antes de reserva legal
 * - Cálculo de reserva legal
 * - Valores finales de utilidad distribuible
 */
export interface ApplicationOfResults {
  // Valores Preliminares
  capitalSocialPagadoInicial: number;
  utilidadPerdidaAcumuladaInicial: number;
  resultadoEjercicioInicial: number;
  patrimonioNetoInicial: number;

  // Cálculo Utilidad Antes de Reserva Legal
  diferenciaPatrimonioCapitalPagado: number;
  utilidadDistribuibleAntesReservaLegal: number;

  // Cálculo de Reserva Legal
  capitalSocialSuscrito: number;
  reservaLegalActual: number;
  porcentajeReservaLegal: number; // 0-100
  montoReservaLegal: number;
  nuevaReservaLegal: number;

  // Valores Finales
  capitalSocialPagadoFinal: number;
  utilidadPerdidaAcumuladaFinal: number;
  resultadoEjercicioFinal: number;
  patrimonioNetoFinal: number;
  utilidadDistribuibleFinal: number;
  utilidadNoDistribuida: number;
  utilidadADistribuir: number;
}


