import { defineStore } from "pinia";

type NombraPresidenteOption = "directorio" | "asamblea_accionistas";
type SecretariaOption = "gerente_general" | "junta_accionistas";

interface LimitesDirectorio {
  minimo: number;
  maximo: number;
}

interface ConfiguracionDirectorio {
  cantidadDirectores: number;
  cantidadPersonalizado: boolean;
  duracionDirectorio: string;
  fechaInicioDirectorio: string;
  fechaFinDirectorio: string;
  quorumMinimo: number;
  quorumMayoria: number;
  nombraPresidente: NombraPresidenteOption;
  ejerceSecretaria: SecretariaOption;
  reeleccionDirectores: boolean;
}

interface PresidenteDirectorioConfig {
  presideJuntas: boolean;
  votoDirimente: boolean;
  presidenteDirectorio: string;
}

interface State {
  tieneDirectorio: boolean;
  limites: LimitesDirectorio;
  configuracion: ConfiguracionDirectorio;
  presidente: PresidenteDirectorioConfig;
}

const defaultConfiguracion = (): ConfiguracionDirectorio => ({
  cantidadDirectores: 3,
  cantidadPersonalizado: false,
  duracionDirectorio: "",
  fechaInicioDirectorio: "",
  fechaFinDirectorio: "",
  quorumMinimo: 0,
  quorumMayoria: 0,
  nombraPresidente: "directorio",
  ejerceSecretaria: "gerente_general",
  reeleccionDirectores: false,
});

const defaultPresidente = (): PresidenteDirectorioConfig => ({
  presideJuntas: false,
  votoDirimente: false,
  presidenteDirectorio: "",
});

export const useDirectorioStore = defineStore("directorio", {
  state: (): State => ({
    tieneDirectorio: true,
    limites: {
      minimo: 3,
      maximo: 10,
    },
    configuracion: defaultConfiguracion(),
    presidente: defaultPresidente(),
  }),

  getters: {},

  actions: {
    setTieneDirectorio(value: boolean) {
      this.tieneDirectorio = value;
    },

    updateConfiguracion(partial: Partial<ConfiguracionDirectorio>) {
      this.configuracion = {
        ...this.configuracion,
        ...partial,
      };

      if (
        typeof partial.cantidadDirectores === "number" &&
        partial.cantidadDirectores !== this.limites.minimo
      ) {
        this.configuracion.cantidadPersonalizado = true;
      }
      if (
        typeof partial.cantidadDirectores === "number" &&
        partial.cantidadDirectores === this.limites.minimo
      ) {
        this.configuracion.cantidadPersonalizado = false;
      }
    },

    updatePresidente(partial: Partial<PresidenteDirectorioConfig>) {
      this.presidente = {
        ...this.presidente,
        ...partial,
      };
    },

    resetConfiguracion() {
      this.configuracion = defaultConfiguracion();
    },

    resetPresidente() {
      this.presidente = defaultPresidente();
    },

    hydrate(state: Partial<State>) {
      if (typeof state.tieneDirectorio === "boolean") {
        this.tieneDirectorio = state.tieneDirectorio;
      }

      if (state.limites) {
        this.limites = {
          minimo: state.limites.minimo ?? this.limites.minimo,
          maximo: state.limites.maximo ?? this.limites.maximo,
        };
      }

      if (state.configuracion) {
        this.configuracion = {
          ...this.configuracion,
          ...state.configuracion,
        };
      }

      if (state.presidente) {
        this.presidente = {
          ...this.presidente,
          ...state.presidente,
        };
      }
    },
  },
});
