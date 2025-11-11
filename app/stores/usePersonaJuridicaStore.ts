import type { PersonaNatural } from "./usePersonaNaturalStore";

export type JurisdiccionPersonaJuridica = "peruana" | "extranjera";

export const usePersonaJuridicaStore = defineStore("personaJuridicaForm", {
  state: (): PersonaJuridicaState => ({
    jurisdiccion: "peruana",
    tipoDocumento: "RUC",
    numeroDocumento: "",
    nombreComercial: "",
    razonSocial: "",
    pais: "PER",
    direccion: "",
    provincia: "",
    distrito: "",
    departamento: "",
    representadoPor: null,
  }),

  actions: {
    setJurisdiccion(value: JurisdiccionPersonaJuridica) {
      this.jurisdiccion = value;

      if (value === "peruana") {
        this.tipoDocumento = "RUC";
        if (!this.pais) {
          this.pais = "PER";
        }
        return;
      }

      this.tipoDocumento = "";
      this.pais = "";
      this.provincia = "";
      this.distrito = "";
      this.departamento = "";
    },

    setRepresentadoPor(value: PersonaNatural | null) {
      this.representadoPor = value ? { ...value } : null;
    },

    resetRepresentadoPor() {
      this.representadoPor = null;
    },

    resetUbicacionPeruana() {
      this.provincia = "";
      this.distrito = "";
      this.departamento = "";
    },
  },
});

export interface PersonaJuridicaState {
  jurisdiccion: JurisdiccionPersonaJuridica;
  tipoDocumento: string;
  numeroDocumento: string;
  nombreComercial: string;
  razonSocial: string;
  pais: string;
  direccion: string;
  provincia: string;
  distrito: string;
  departamento: string;
  representadoPor: PersonaNatural | null;
}
