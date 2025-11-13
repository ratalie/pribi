import { defineStore } from "pinia";

export const useAsignacionAccionesStore = defineStore("asignacionAccionesForm", {
  state: () => ({
    tipoAccion: "",
    cantidadAccionesSuscritas: 0,
    precioAccion: 0,
    capitalSocial: 0,
    prima: 0,
    totalmentePagado: false,
    porcentajePagado: 0,
    dividendoPasivo: 0,
  }),

  actions: {
    // Método para obtener todos los datos del formulario
    getFormData() {
      return {
        tipoAccion: this.tipoAccion,
        cantidadAccionesSuscritas: this.cantidadAccionesSuscritas,
        precioAccion: this.precioAccion,
        capitalSocial: this.capitalSocial,
        prima: this.prima,
        totalmentePagado: this.totalmentePagado,
        porcentajePagado: this.porcentajePagado,
        dividendoPasivo: this.dividendoPasivo,
      };
    },
  },
});
