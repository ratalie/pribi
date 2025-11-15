import { defineStore } from "pinia";
import type { EstadoCivilEnum } from "~/types/enums/EstadoCivilEnum";
import type { RegimenPatrimonialEnum } from "~/types/enums/RegimenPatrimonialEnum";
import type { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

export const useAccionistaNaturalStore = defineStore("accionistas-natural-form", {
  state: (): AccionistaNaturalState => ({
    tipoDocumento: "" as TipoDocumentosEnum | "",
    numeroDocumento: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    paisPasaporte: "",
    estadoCivil: "" as EstadoCivilEnum | "",
    regimenPatrimonial: "" as RegimenPatrimonialEnum | "",
    conyuge: {
      tipoDocumento: "" as TipoDocumentosEnum | "",
      numeroDocumento: "",
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      paisPasaporte: "",
    },
    partidaRegistral: "",
    sedeRegistral: "",
  }),
});

export interface AccionistaNaturalState {
  tipoDocumento: TipoDocumentosEnum | "";
  numeroDocumento: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  paisPasaporte: string;
  estadoCivil: EstadoCivilEnum | "";
  regimenPatrimonial: RegimenPatrimonialEnum | "";
  conyuge: {
    tipoDocumento: TipoDocumentosEnum | "";
    numeroDocumento: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    paisPasaporte: string;
  };
  partidaRegistral: string;
  sedeRegistral: string;
}
