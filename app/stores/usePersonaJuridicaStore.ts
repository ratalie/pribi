export const usePersonaJuridicaStore = defineStore("personaJuridica", {
  state: (): PersonaJuridicaState => ({
    seConstituyoEnPeru: true,
    tipoDocumento: "",
    numeroDocumento: "",
    razonSocial: "",
    nombreComercial: "",
    direccion: "",
    distrito: "",
    provincia: "",
    departamento: "",
    paisOrigen: "",
    tieneRepresentante: false,
  }),

  actions: {
    setFormData(data: PersonaJuridicaState) {
      this.seConstituyoEnPeru = data.seConstituyoEnPeru;
      this.tipoDocumento = data.tipoDocumento;
      this.numeroDocumento = data.numeroDocumento;
      this.razonSocial = data.razonSocial;
      this.nombreComercial = data.nombreComercial;
      this.direccion = data.direccion;
      this.distrito = data.distrito;
      this.provincia = data.provincia;
      this.departamento = data.departamento;
      this.paisOrigen = data.paisOrigen;
      this.tieneRepresentante = data.tieneRepresentante;
    },
  },
});

export interface PersonaJuridicaState {
  seConstituyoEnPeru: boolean;
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  nombreComercial: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  paisOrigen: string;
  tieneRepresentante: boolean;
}
