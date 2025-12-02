import { defineStore } from "pinia";

export const useAsignacionAccionesStore = defineStore("asignacionAccionesForm", {
  state: () => ({
    accionId: "", // ID de la acción (UUID)
    cantidadSuscrita: 0,
    precioPorAccion: 0,
    porcentajePagadoPorAccion: 0,
    totalDividendosPendientes: 0,
    pagadoCompletamente: true, // Por defecto en true (SI)
    // Campos calculados/UI (no van al backend)
    capitalSocial: 0,
    prima: 0,
  }),

  actions: {
    // Método para obtener todos los datos del formulario
    getFormData() {
      return {
        accionId: this.accionId,
        cantidadSuscrita: this.cantidadSuscrita,
        precioPorAccion: this.precioPorAccion,
        porcentajePagadoPorAccion: this.porcentajePagadoPorAccion,
        totalDividendosPendientes: this.totalDividendosPendientes,
        pagadoCompletamente: this.pagadoCompletamente,
        capitalSocial: this.capitalSocial,
        prima: this.prima,
      };
    },
  },
});
