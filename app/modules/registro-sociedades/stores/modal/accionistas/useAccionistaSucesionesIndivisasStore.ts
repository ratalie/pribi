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
}
