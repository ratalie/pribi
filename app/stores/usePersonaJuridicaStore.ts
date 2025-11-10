import type { PersonaNatural } from "./usePersonaNaturalStore";
export const usePersonaJuridicaStore = defineStore("personaJuridicaForm", {
  state: (): PersonaJuridica => ({
    tipoDocumento: "",
    numeroDocumento: "",
    nombreComercial: "",
    razonSocial: "",
    pais: "",
    direccion: "",
    provincia: "",
    distrito: "",
    departamento: "",
    representadoPor: {
      tipoDocumento: "",
      numeroDocumento: "",
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      estadoCivil: null,
    },
  }),
});

interface PersonaJuridica {
  tipoDocumento: string;
  numeroDocumento: string;
  nombreComercial: string;
  razonSocial: string;
  pais: string;
  direccion: string;
  provincia: string;
  distrito: string;
  departamento: string;
  representadoPor: PersonaNatural;
}
