export const useRegistroApoderadoModalStore = defineStore("registroApoderadoModal", {
  state: (): State => ({
    tipoApoderado: "",
    tipoPersona: "",
    esEmpresaConstituidaEnPeru: false,
    tieneRepresentante: false,
  }),

  actions: {
    setTipoApoderado(value: string) {
      this.tipoApoderado = value;
    },

    setTipoPersona(value: string) {
      this.tipoPersona = value;
    },
  },
});

interface State {
  tipoApoderado: string;
  tipoPersona: string;
  esEmpresaConstituidaEnPeru: boolean;
  tieneRepresentante: boolean;
}

