import { defineStore } from "pinia";

import { TipoFondoEnum } from "~/types/enums/TipoFondoEnum";

export const useAccionistaFondosInversionStore = defineStore("accionistaFondosInversionForm", {
  state: (): AccionistaFondosInversionState => ({
    tipoDocumento: "",
    numeroDocumento: "",
    razonSocial: "",
    direccion: "",
    tipoFondo: TipoFondoEnum.PRIVADO,
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
  tipoFondo: TipoFondoEnum;
  numeroDocumentoSociedadAdministradora: string;
  tipoDocumentoSociedadAdministradora: string;
  razonSocialSociedadAdministradora: string;
  tieneRepresentante: boolean;
}
