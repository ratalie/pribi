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
    representanteLegal: {
      tipoDocumento: "",
      numeroDocumento: "",
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      paisPasaporte: "",
    },
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
  representanteLegal: {
    tipoDocumento: string;
    numeroDocumento: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    paisPasaporte: string;
  };
}

