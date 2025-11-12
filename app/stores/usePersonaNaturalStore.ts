import type { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

export const usePersonaNaturalStore = defineStore("personaNatural", {
  state: (): State => ({
    tipoDocumento: "",
    numeroDocumento: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    paisPasaporte: "",
  }),
});

export interface PersonaNaturalState {
  tipoDocumento: TipoDocumentosEnum | "";
  numeroDocumento: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  paisPasaporte: string;
}

type State = PersonaNaturalState;
