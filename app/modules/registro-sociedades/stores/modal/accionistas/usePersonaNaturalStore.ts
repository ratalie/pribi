import type { EstadoCivilEnum } from "~/types/enums/EstadoCivilEnum";
import type { RegimenPatrimonialEnum } from "~/types/enums/RegimenPatrimonialEnum";

export const usePersonaNaturalStore = defineStore("personaNaturalForm", {
  state: (): PersonaNaturalState => ({
    tipoDocumento: "",
    numeroDocumento: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    estadoCivil: "" as EstadoCivilEnum | "",
    regimenPatrimonial: "" as RegimenPatrimonialEnum | "",
    conyuge: {
      tipoDocumento: "",
      numeroDocumento: "",
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
    },
    partidaRegistral: "",
    sedeRegistral: "",
  }),
});

export interface PersonaNaturalState {
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  paisPasaporte?: string;
  estadoCivil: EstadoCivilEnum | "";
  regimenPatrimonial: RegimenPatrimonialEnum | "";
  conyuge: {
    tipoDocumento: string;
    numeroDocumento: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  };
  partidaRegistral: string;
  sedeRegistral: string;
}
