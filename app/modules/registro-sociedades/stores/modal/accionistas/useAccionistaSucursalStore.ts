import type { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

export const useAccionistaSucursalStore = defineStore("accionistaSucursalForm", {
  state: (): AccionistaSucursalState => ({
    tipoDocumento: "",
    numeroDocumento: "",
    nombreSucursal: "",
    partidaRegistral: "",
    sedeRegistral: "",
    domicilioFiscal: "",
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

export interface AccionistaSucursalState {
  tipoDocumento: string;
  numeroDocumento: string;
  nombreSucursal: string;
  partidaRegistral: string;
  sedeRegistral: string;
  domicilioFiscal: string;
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
