import type { EstadoCivilEnum } from "~/types/enums/EstadoCivilEnum";
import type { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

export const usePersonaNaturalStore = defineStore("personaNatural", {
  state: (): State => ({
    tipoDocumento: "",
    numeroDocumento: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    paisPasaporte: "",
    estadoCivil: null,
  }),
});

export interface PersonaNaturalState {
  tipoDocumento: TipoDocumentosEnum | "";
  numeroDocumento: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  paisPasaporte: string;
  estadoCivil: EstadoCivilEnum | "" | null;
}

type State = PersonaNaturalState;

export type PersonaNatural = PersonaNaturalState;
