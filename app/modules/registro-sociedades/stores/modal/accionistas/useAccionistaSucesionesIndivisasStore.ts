export const useAccionistaSucesionesIndivisasStore = defineStore(
  "accionistaSucesionesIndivisasForm",
  {
    state: (): AccionistaSucesionesIndivisasState => ({
      tipoDocumento: "",
      numeroDocumento: "",
      razonSocial: "",
      direccion: "",
      distrito: "",
      provincia: "",
      departamento: "",
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
  }
);

export interface AccionistaSucesionesIndivisasState {
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
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

