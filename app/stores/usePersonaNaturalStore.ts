export const usePersonaNaturalStore = defineStore("personaNaturalForm", {
  state: (): PersonaNatural => ({
    tipoDocumento: "",
    numeroDocumento: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    estadoCivil: "",
  }),
});

interface PersonaNatural {
  tipoDocumento: string;
  numeroDocumento: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  estadoCivil: string;
}
