import { defineStore } from "pinia";

export const useAccionistaFondosInversionStore = defineStore("accionistaFondosInversionForm", {
  state: (): AccionistaFondosInversionState => ({
    tipoDocumento: "",
    numeroDocumento: "",
    razonSocial: "",
    direccion: "",
    tipoFondo: "",
    numeroDocumentoSociedadAdministradora: "",
    tipoDocumentoSociedadAdministradora: "",
    razonSocialSociedadAdministradora: "",
    tieneRepresentante: false,
  }),
});

export interface AccionistaFondosInversionState {
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  direccion: string;
  tipoFondo: string;
  numeroDocumentoSociedadAdministradora: string;
  tipoDocumentoSociedadAdministradora: string;
  razonSocialSociedadAdministradora: string;
  tieneRepresentante: boolean;
}
