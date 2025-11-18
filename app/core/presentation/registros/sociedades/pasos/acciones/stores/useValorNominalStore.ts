import { defineStore } from "pinia";

export const useValorNominalStore = defineStore("valorNominal", {
  state: () => ({
    valor: 0 as number,
  }),

  actions: {
    setValor(nuevoValor: number) {
      this.valor = nuevoValor;
    },
  },
});
