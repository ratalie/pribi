import { defineStore } from "pinia";

export const useAccionistaFideicomisosStore = defineStore("accionistaFideicomisosForm", {
  state: (): AccionistaFideicomisosState => ({
    tieneRuc: false,
    numeroDocumento: "",
    tipoDocumento: "",
    razonSocial: "",
    identificacionFideicomiso: "",
    partidaRegistral: "",
    sedeRegistral: "",
    domicilioFiscal: "",
    numeroDocumentoFiduciaria: "",
    tipoDocumentoFiduciaria: "",
    razonSocialFiduciaria: "",
    tieneRepresentante: false,
  }),
});

export interface AccionistaFideicomisosState {
  tieneRuc: boolean;
  numeroDocumento: string;
  tipoDocumento: string;
  razonSocial: string;
  identificacionFideicomiso: string;
  partidaRegistral: string;
  sedeRegistral: string;
  domicilioFiscal: string;
  numeroDocumentoFiduciaria: string;
  tipoDocumentoFiduciaria: string;
  razonSocialFiduciaria: string;
  tieneRepresentante: boolean;
}
