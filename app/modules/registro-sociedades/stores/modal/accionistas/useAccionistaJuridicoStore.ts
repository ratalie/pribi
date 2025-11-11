export const useAccionistaJuridicoStore = defineStore("accionistaJuridicoForm", {
  state: (): AccionistaJuridicoState => ({
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
});

export interface AccionistaJuridicoState {
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
