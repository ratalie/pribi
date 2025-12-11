import type { BaseSelectOption } from "~/components/base/inputs/text/BaseInputSelect.vue";
import {
  EntityCoinUIEnum,
  TiempoVigenciaUIEnum,
  TipoFirmasUIEnum,
  TipoMontoUIEnum,
} from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/domain";
import { useRegimenFacultadesStore } from "../useRegimenFacultadesStore";

export const useApoderadoFacultadStore = defineStore("apoderadoFacultad", {
  state: (): State => ({
    tipoFacultad: "",
    reglasYLimites: false,
    esIrrevocable: false,
    vigencia: TiempoVigenciaUIEnum.INDEFINIDO,
    fechaInicio: "",
    fechaFin: "",
    tipoMoneda: EntityCoinUIEnum.SOLES,
    limiteMonetario: [],
    claseApoderadoIdSeleccionada: null,
    claseFirmanteSeleccionada: null,
    esOtrosApoderados: false,
  }),

  getters: {
    monedaOptions(): BaseSelectOption[] {
      return Object.values(EntityCoinUIEnum).map((moneda) => ({
        id: moneda,
        label: moneda,
        value: moneda,
      }));
    },

    tipoMontoOptions(): BaseSelectOption[] {
      return Object.values(TipoMontoUIEnum).map((tipoMonto) => ({
        id: tipoMonto,
        label: tipoMonto,
        value: tipoMonto,
      }));
    },

    tipoFirmaOptions(): BaseSelectOption[] {
      return Object.values(TipoFirmasUIEnum).map((tipoFirma) => ({
        id: tipoFirma,
        label: tipoFirma,
        value: tipoFirma,
      }));
    },

    cantidadFirmantesOptions(): BaseSelectOption[] {
      // Si no hay clase de firmante seleccionada, retornar opciones por defecto (1-10)
      if (!this.claseFirmanteSeleccionada) {
        return Array.from({ length: 10 }, (_, index) => ({
          id: index + 1,
          label: String(index + 1),
          value: index + 1,
        }));
      }

      const regimenStore = useRegimenFacultadesStore();
      const clase = regimenStore.clasesApoderadosDisponibles.find(
        (c) => c.id === this.claseFirmanteSeleccionada
      );

      if (!clase || clase.cantidadApoderados === 0) {
        return [];
      }

      // Generar opciones desde 1 hasta la cantidad de apoderados de la clase
      return Array.from({ length: clase.cantidadApoderados }, (_, index) => ({
        id: index + 1,
        label: String(index + 1),
        value: index + 1,
      }));
    },

    grupoFirmantesOptions(): BaseSelectOption[] {
      const regimenStore = useRegimenFacultadesStore();

      // Si es "Otros Apoderados", mostrar TODAS las clases disponibles (sin filtrar)
      if (this.esOtrosApoderados) {
        return regimenStore.clasesApoderadosDisponibles.map((clase) => ({
          id: clase.id,
          label: clase.nombre,
          value: clase.id,
        }));
      }

      // Para clases normales, excluir la clase seleccionada
      return regimenStore.clasesApoderadosDisponibles
        .filter((clase) => clase.id !== this.claseApoderadoIdSeleccionada)
        .map((clase) => ({
          id: clase.id,
          label: clase.nombre,
          value: clase.id,
        }));
    },
  },
});

interface State {
  tipoFacultad: string;
  reglasYLimites: boolean;
  esIrrevocable: boolean;
  vigencia: TiempoVigenciaUIEnum;
  fechaInicio: string;
  fechaFin: string;
  tipoMoneda: EntityCoinUIEnum;
  limiteMonetario: LimiteMonetarioModal[];
  claseApoderadoIdSeleccionada: string | null;
  claseFirmanteSeleccionada: string | null;
  esOtrosApoderados: boolean;
}

export interface LimiteMonetarioModal {
  id: string;
  desde: number;
  tipoMonto: TipoMontoUIEnum;
  hasta: number;
  tipoFirma: TipoFirmasUIEnum;
  firmantes: FirmanteModal[];
}

interface FirmanteModal {
  id: string;
  cantidad: string;
  grupo: string;
}
