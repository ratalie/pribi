import type { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

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
        tipoDocumento: "" as TipoDocumentosEnum | "",
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
    tipoDocumento: TipoDocumentosEnum | "";
    numeroDocumento: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    paisPasaporte: string;
  };
}
