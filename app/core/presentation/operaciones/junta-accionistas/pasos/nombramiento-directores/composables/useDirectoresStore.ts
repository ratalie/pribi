import { defineStore } from "pinia";

export interface DirectorData {
  nombreCompleto: string;
  tipoDirector: "titular" | "suplente" | "alterno";
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  paisPasaporte?: string;
  reemplazaId?: string;
  candidato: boolean;
}

export const useDirectoresStore = defineStore("directores", {
  state: (): {
    directoresData: DirectorData[];
    cantidadDirectores: number;
  } => ({
    directoresData: [],
    cantidadDirectores: 5,
  }),

  getters: {
    directoresTitulares: (state) =>
      state.directoresData.filter((d) => d.tipoDirector === "titular"),

    directoresTitularesCandidatos: (state) =>
      state.directoresData.filter((d) => d.tipoDirector === "titular" && d.candidato === true),

    directoresTitularesNoCandidatos: (state) =>
      state.directoresData.filter(
        (d) => d.tipoDirector === "titular" && d.candidato === false
      ),

    cantidadDisponibles: (state) => {
      const cantidadNoCandidatos = state.directoresData.filter(
        (d) => d.tipoDirector === "titular" && d.candidato === false
      ).length;
      return state.cantidadDirectores - cantidadNoCandidatos;
    },
  },

  actions: {
    setDirectoresData(data: DirectorData[]) {
      this.directoresData = data;
    },

    setCantidadDirectores(cantidad: number) {
      this.cantidadDirectores = cantidad;
    },
  },
});
