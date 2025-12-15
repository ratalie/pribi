import { defineStore } from "pinia";
import type { ApplicationOfResults } from "~/core/hexag/juntas/domain/entities/application-of-results.entity";

/**
 * Store para Aplicación de Resultados
 * 
 * Maneja el estado de los cálculos financieros para la aplicación de resultados:
 * - Valores preliminares
 * - Cálculo de utilidades antes de reserva legal
 * - Cálculo de reserva legal
 * - Valores finales de utilidad distribuible
 * 
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 */
export const useAplicacionResultadosStore = defineStore("aplicacionResultados", {
  // ✅ PERSISTENCIA: Guardar en localStorage
  persist: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    key: "probo-aplicacion-resultados",
  },

  state: () => ({
    // Valores Preliminares
    capitalSocialPagadoInicial: 0,
    utilidadPerdidaAcumuladaInicial: 0,
    resultadoEjercicioInicial: 0,
    patrimonioNetoInicial: 0,

    // Cálculo Utilidad Antes de Reserva Legal
    diferenciaPatrimonioCapitalPagado: 0,
    utilidadDistribuibleAntesReservaLegal: 0,

    // Cálculo de Reserva Legal
    capitalSocialSuscrito: 0,
    reservaLegalActual: 0,
    porcentajeReservaLegal: 10, // Por defecto 10%
    montoReservaLegal: 0,
    nuevaReservaLegal: 0,

    // Valores Finales
    capitalSocialPagadoFinal: 0,
    utilidadPerdidaAcumuladaFinal: 0,
    resultadoEjercicioFinal: 0,
    patrimonioNetoFinal: 0,
    utilidadDistribuibleFinal: 0,
    utilidadNoDistribuida: 0,
    utilidadADistribuir: 0,
  }),

  getters: {
    /**
     * Verificar si hay datos guardados
     */
    hasData(): boolean {
      return this.patrimonioNetoInicial > 0 || this.utilidadADistribuir > 0;
    },
  },

  actions: {
    /**
     * Cargar datos desde una entidad
     */
    loadFromEntity(entity: ApplicationOfResults) {
      // Valores Preliminares
      this.capitalSocialPagadoInicial = entity.capitalSocialPagadoInicial;
      this.utilidadPerdidaAcumuladaInicial = entity.utilidadPerdidaAcumuladaInicial;
      this.resultadoEjercicioInicial = entity.resultadoEjercicioInicial;
      this.patrimonioNetoInicial = entity.patrimonioNetoInicial;

      // Cálculo Utilidad Antes de Reserva Legal
      this.diferenciaPatrimonioCapitalPagado = entity.diferenciaPatrimonioCapitalPagado;
      this.utilidadDistribuibleAntesReservaLegal = entity.utilidadDistribuibleAntesReservaLegal;

      // Cálculo de Reserva Legal
      this.capitalSocialSuscrito = entity.capitalSocialSuscrito;
      this.reservaLegalActual = entity.reservaLegalActual;
      this.porcentajeReservaLegal = entity.porcentajeReservaLegal;
      this.montoReservaLegal = entity.montoReservaLegal;
      this.nuevaReservaLegal = entity.nuevaReservaLegal;

      // Valores Finales
      this.capitalSocialPagadoFinal = entity.capitalSocialPagadoFinal;
      this.utilidadPerdidaAcumuladaFinal = entity.utilidadPerdidaAcumuladaFinal;
      this.resultadoEjercicioFinal = entity.resultadoEjercicioFinal;
      this.patrimonioNetoFinal = entity.patrimonioNetoFinal;
      this.utilidadDistribuibleFinal = entity.utilidadDistribuibleFinal;
      this.utilidadNoDistribuida = entity.utilidadNoDistribuida;
      this.utilidadADistribuir = entity.utilidadADistribuir;
    },

    /**
     * Convertir estado del store a entidad
     */
    toEntity(): ApplicationOfResults {
      return {
        // Valores Preliminares
        capitalSocialPagadoInicial: this.capitalSocialPagadoInicial,
        utilidadPerdidaAcumuladaInicial: this.utilidadPerdidaAcumuladaInicial,
        resultadoEjercicioInicial: this.resultadoEjercicioInicial,
        patrimonioNetoInicial: this.patrimonioNetoInicial,

        // Cálculo Utilidad Antes de Reserva Legal
        diferenciaPatrimonioCapitalPagado: this.diferenciaPatrimonioCapitalPagado,
        utilidadDistribuibleAntesReservaLegal: this.utilidadDistribuibleAntesReservaLegal,

        // Cálculo de Reserva Legal
        capitalSocialSuscrito: this.capitalSocialSuscrito,
        reservaLegalActual: this.reservaLegalActual,
        porcentajeReservaLegal: this.porcentajeReservaLegal,
        montoReservaLegal: this.montoReservaLegal,
        nuevaReservaLegal: this.nuevaReservaLegal,

        // Valores Finales
        capitalSocialPagadoFinal: this.capitalSocialPagadoFinal,
        utilidadPerdidaAcumuladaFinal: this.utilidadPerdidaAcumuladaFinal,
        resultadoEjercicioFinal: this.resultadoEjercicioFinal,
        patrimonioNetoFinal: this.patrimonioNetoFinal,
        utilidadDistribuibleFinal: this.utilidadDistribuibleFinal,
        utilidadNoDistribuida: this.utilidadNoDistribuida,
        utilidadADistribuir: this.utilidadADistribuir,
      };
    },

    /**
     * Resetear estado
     */
    reset() {
      // Valores Preliminares
      this.capitalSocialPagadoInicial = 0;
      this.utilidadPerdidaAcumuladaInicial = 0;
      this.resultadoEjercicioInicial = 0;
      this.patrimonioNetoInicial = 0;

      // Cálculo Utilidad Antes de Reserva Legal
      this.diferenciaPatrimonioCapitalPagado = 0;
      this.utilidadDistribuibleAntesReservaLegal = 0;

      // Cálculo de Reserva Legal
      this.capitalSocialSuscrito = 0;
      this.reservaLegalActual = 0;
      this.porcentajeReservaLegal = 10;
      this.montoReservaLegal = 0;
      this.nuevaReservaLegal = 0;

      // Valores Finales
      this.capitalSocialPagadoFinal = 0;
      this.utilidadPerdidaAcumuladaFinal = 0;
      this.resultadoEjercicioFinal = 0;
      this.patrimonioNetoFinal = 0;
      this.utilidadDistribuibleFinal = 0;
      this.utilidadNoDistribuida = 0;
      this.utilidadADistribuir = 0;
    },
  },
});

