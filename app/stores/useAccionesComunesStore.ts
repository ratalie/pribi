import { defineStore } from "pinia";

export const useAccionesComunesStore = defineStore("accionesComunes", {
  state: () => ({
    // Campos del formulario
    cantidadAcciones: "",
    redimibles: false,
    otrosDerechosEspeciales: false,
    obligacionesAdicionales: false,

    // Archivos de "Otros derechos especiales"
    archivosDerechosEspeciales: [] as File[],

    // Archivos de "Obligaciones adicionales"
    archivosObligaciones: [] as File[],
  }),

  actions: {
    // Método para resetear el formulario
    resetForm() {
      this.cantidadAcciones = "";
      this.redimibles = false;
      this.otrosDerechosEspeciales = false;
      this.obligacionesAdicionales = false;
      this.archivosDerechosEspeciales = [];
      this.archivosObligaciones = [];
    },

    // Método para obtener todos los datos del formulario
    getFormData() {
      return {
        cantidadAcciones: this.cantidadAcciones,
        redimibles: this.redimibles,
        otrosDerechosEspeciales: this.otrosDerechosEspeciales,
        obligacionesAdicionales: this.obligacionesAdicionales,
        archivosDerechosEspeciales: this.archivosDerechosEspeciales,
        archivosObligaciones: this.archivosObligaciones,
      };
    },
  },
});
