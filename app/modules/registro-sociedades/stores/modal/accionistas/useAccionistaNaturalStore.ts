import type { EstadoCivilEnum } from "~/types/enums/EstadoCivilEnum";
import type { RegimenPatrimonialEnum } from "~/types/enums/RegimenPatrimonialEnum";

export const useAccionistaNaturalStore = defineStore("accionistas-natural-form", {
  state: (): AccionistaNaturalState => ({
    tipoDocumento: "",
    numeroDocumento: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    paisPasaporte: "",
    estadoCivil: "" as EstadoCivilEnum | "",
    regimenPatrimonial: "" as RegimenPatrimonialEnum | "",
    conyuge: {
      tipoDocumento: "",
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
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  paisPasaporte: string;
  estadoCivil: EstadoCivilEnum | "";
  regimenPatrimonial: RegimenPatrimonialEnum | "";
  conyuge: {
    tipoDocumento: string;
    numeroDocumento: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    paisPasaporte: string;
  };
  partidaRegistral: string;
  sedeRegistral: string;
}
