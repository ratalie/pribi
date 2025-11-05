import { defineStore } from "pinia";

export const useClasesAccionesStore = defineStore("clasesAccionesModal", {
  state: () => ({
    // Campos del formulario
    nombreClaseAccion: "",
    cantidadAccionesClase: "",
    conDerechoVoto: false,
    redimiblesClase: false,
    otrosDerechosEspecialesClase: false,
    obligacionesAdicionalesClase: false,

    // Archivos de "Otros derechos especiales"
    archivosDerechosEspecialesClase: [] as File[],

    // Archivos de "Obligaciones adicionales"
    archivosObligacionesClase: [] as File[],
  }),

  actions: {
    // Método para obtener todos los datos del formulario
    getFormData() {
      return {
        nombreClaseAccion: this.nombreClaseAccion,
        cantidadAccionesClase: this.cantidadAccionesClase,
        conDerechoVoto: this.conDerechoVoto,
        redimiblesClase: this.redimiblesClase,
        otrosDerechosEspecialesClase: this.otrosDerechosEspecialesClase,
        obligacionesAdicionalesClase: this.obligacionesAdicionalesClase,
        archivosDerechosEspecialesClase: this.archivosDerechosEspecialesClase,
        archivosObligacionesClase: this.archivosObligacionesClase,
      };
    },
  },
});
