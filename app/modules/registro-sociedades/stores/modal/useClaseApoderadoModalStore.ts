export const useClaseApoderadoModalStore = defineStore("claseApoderadoModal", {
  state: (): State => ({
    nombreClase: "",
  }),

  actions: {
    setNombreClase(nombre: string) {
      this.nombreClase = nombre;
    },
  },
});

interface State {
  nombreClase: string;
}
