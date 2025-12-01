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

  actions: {
    setFormData(data: PersonaNaturalState) {
      this.tipoDocumento = data.tipoDocumento;
      this.numeroDocumento = data.numeroDocumento;
      this.nombre = data.nombre;
      this.apellidoPaterno = data.apellidoPaterno;
      this.apellidoMaterno = data.apellidoMaterno;
      this.paisPasaporte = data.paisPasaporte;
      this.estadoCivil = data.estadoCivil;
    },
  },
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
