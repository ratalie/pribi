import type { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

export const useAccionistaFideicomisosStore = defineStore("accionistaFideicomisosForm", {
  state: (): AccionistaFideicomisosState => ({
    tieneRuc: false,
    identificacionFideicomiso: "",
    partidaRegistral: "",
    sedeRegistral: "",
    domicilioFiscal: "",
    numeroDocumento: "",
    tipoDocumento: "",
    razonSocial: "",
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
});

export interface AccionistaFideicomisosState {
  tieneRuc: boolean;
  identificacionFideicomiso: string;
  partidaRegistral: string;
  sedeRegistral: string;
  domicilioFiscal: string;
  numeroDocumento: string;
  tipoDocumento: string;
  razonSocial: string;
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
