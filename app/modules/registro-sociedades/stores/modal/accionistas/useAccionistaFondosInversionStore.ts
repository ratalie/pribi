import type { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

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
  representanteLegal: {
    tipoDocumento: TipoDocumentosEnum | "";
    numeroDocumento: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    paisPasaporte: string;
  };
}
