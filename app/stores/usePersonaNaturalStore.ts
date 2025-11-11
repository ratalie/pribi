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

interface State {
  tipoDocumento: TipoDocumentosEnum | "";
  numeroDocumento: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  paisPasaporte: string;
}
