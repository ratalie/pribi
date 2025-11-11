export const useRegistroApoderadoModalStore = defineStore("registroApoderadoModal", {
  state: (): State => ({
    tipoApoderado: "",
    tipoPersona: "natural",
    esEmpresaConstituidaEnPeru: true,
    tieneRepresentante: false,
  }),

  actions: {
    setTipoApoderado(value: string) {
      this.tipoApoderado = value;
    },

    setTipoPersona(value: "natural" | "juridica") {
      this.tipoPersona = value;
    },
  },
});

interface State {
  tipoApoderado: string;
  tipoPersona: "natural" | "juridica";
  esEmpresaConstituidaEnPeru: boolean;
  tieneRepresentante: boolean;
}
