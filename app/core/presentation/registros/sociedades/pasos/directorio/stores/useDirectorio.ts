import { defineStore } from "pinia";

interface LimitesDirectorio {
  minimo: number;
  maximo: number;
}

interface ConfiguracionDirectorio {
  cantidadDirectores: number;
  conteoPersonalizado: boolean; // Backend: conteoPersonalizado
  minimoDirectores: number | null; // Backend: minimoDirectores
  maximoDirectores: number | null; // Backend: maximoDirectores
  inicioMandato: string; // Backend: inicioMandato (antes fechaInicioDirectorio)
  finMandato: string; // Backend: finMandato (antes fechaFinDirectorio)
  quorumMinimo: number;
  mayoria: number; // Backend: mayoria (antes quorumMayoria)
  presidenteDesignado: boolean; // Backend: presidenteDesignado (derivado de nombraPresidente)
  secretarioAsignado: boolean; // Backend: secretarioAsignado (derivado de ejerceSecretaria)
  reeleccionPermitida: boolean; // Backend: reeleccionPermitida (antes reeleccionDirectores)
  periodo: string; // Backend: periodo (antes duracionDirectorio)
}

interface PresidenteDirectorioConfig {
  presidentePreside: boolean; // Backend: presidentePreside (antes presideJuntas)
  presidenteDesempata: boolean; // Backend: presidenteDesempata (antes votoDirimente)
  presidenteId: string; // Backend: presidenteId (antes presidenteDirectorio)
}

interface State {
  tieneDirectorio: boolean;
  limites: LimitesDirectorio;
  configuracion: ConfiguracionDirectorio;
  presidente: PresidenteDirectorioConfig;
}

const defaultConfiguracion = (): ConfiguracionDirectorio => ({
  cantidadDirectores: 3,
  conteoPersonalizado: false,
  minimoDirectores: null,
  maximoDirectores: null,
  inicioMandato: "",
  finMandato: "",
  quorumMinimo: 0,
  mayoria: 0,
  presidenteDesignado: true, // true = directorio, false = asamblea_accionistas
  secretarioAsignado: true, // true = gerente_general, false = junta_accionistas
  reeleccionPermitida: false,
  periodo: "",
});

const defaultPresidente = (): PresidenteDirectorioConfig => ({
  presidentePreside: false,
  presidenteDesempata: false,
  presidenteId: "",
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
        this.configuracion.conteoPersonalizado = true;
      }
      if (
        typeof partial.cantidadDirectores === "number" &&
        partial.cantidadDirectores === this.limites.minimo
      ) {
        this.configuracion.conteoPersonalizado = false;
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
