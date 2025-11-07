export const useTiposFacultadStore = defineStore("tiposFacultadModal", {
  state: (): State => ({
    nombreFacultad: "",
  }),

  actions: {
    setNombreFacultad(nombreFacultad: string) {
      this.nombreFacultad = nombreFacultad;
    },
  },
});

interface State {
  nombreFacultad: string;
}
