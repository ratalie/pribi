import { defineStore } from "pinia";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
import { TiposDirectoresEnum } from "~/types/enums/TiposDirectoresEnum";

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

export interface Director {
  id: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  numeroDocumento: string;
  tipoDocumento: TipoDocumentosEnum;
  tipoDirector: TiposDirectoresEnum;
  reemplazoAsignado: string | null;
}

interface State {
  tieneDirectorio: boolean;
  limites: LimitesDirectorio;
  configuracion: ConfiguracionDirectorio;
  presidente: PresidenteDirectorioConfig;
  directores: Director[];
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

const defaultDirectores = (): Director[] => [
  {
    id: generateId(),
    nombres: "Diego Alonso",
    apellidoPaterno: "Santoro",
    apellidoMaterno: "Velez",
    numeroDocumento: "70124567",
    tipoDocumento: TipoDocumentosEnum.DNI,
    tipoDirector: TiposDirectoresEnum.TITULAR,
    reemplazoAsignado: null,
  },
  {
    id: generateId(),
    nombres: "Nayla Lucia",
    apellidoPaterno: "Cornejo",
    apellidoMaterno: "Bastidas",
    numeroDocumento: "EB12-934",
    tipoDocumento: TipoDocumentosEnum.PASAPORTE,
    tipoDirector: TiposDirectoresEnum.TITULAR,
    reemplazoAsignado: null,
  },
];

const generateId = () => {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useDirectorioStore = defineStore("directorio", {
  state: (): State => ({
    tieneDirectorio: true,
    limites: {
      minimo: 3,
      maximo: 10,
    },
    configuracion: defaultConfiguracion(),
    presidente: defaultPresidente(),
    directores: defaultDirectores(),
  }),

  getters: {
    totalDirectores: (state) => state.directores.length,
    directoresTitulares: (state) =>
      state.directores.filter(
        (director) => director.tipoDirector === TiposDirectoresEnum.TITULAR
      ),
    directoresSuplentes: (state) =>
      state.directores.filter(
        (director) => director.tipoDirector === TiposDirectoresEnum.SUPLENTE
      ),
    directoresAlternos: (state) =>
      state.directores.filter(
        (director) => director.tipoDirector === TiposDirectoresEnum.ALTERNO
      ),
    hasMinimoDirectores: (state) => state.directores.length >= state.limites.minimo,
    hasMaximoDirectores: (state) => state.directores.length >= state.limites.maximo,
  },

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

    addDirector(payload: Omit<Director, "id"> & { id?: string }) {
      const id = payload.id ?? generateId();
      const director: Director = {
        id,
        nombres: payload.nombres,
        apellidoPaterno: payload.apellidoPaterno,
        apellidoMaterno: payload.apellidoMaterno,
        numeroDocumento: payload.numeroDocumento,
        tipoDocumento: payload.tipoDocumento,
        tipoDirector: payload.tipoDirector,
        reemplazoAsignado: payload.reemplazoAsignado ?? null,
      };

      this.directores.push(director);

      return director;
    },

    updateDirector(payload: Director) {
      const index = this.directores.findIndex((director) => director.id === payload.id);

      if (index !== -1) {
        this.directores.splice(index, 1, payload);
      }
    },

    removeDirector(id: string) {
      this.directores = this.directores.filter((director) => director.id !== id);
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

      if (state.directores) {
        this.directores = [...state.directores];
      }
    },
  },
});
