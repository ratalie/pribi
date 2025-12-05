import type { BaseSelectOption } from "~/components/base/inputs/text/BaseInputSelect.vue";
import {
  EntityCoinUIEnum,
  TiempoVigenciaUIEnum,
  TipoFirmasUIEnum,
  TipoMontoUIEnum,
} from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/domain";

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
      //por ahora solo se muestran las cantidades de 1 a 10
      return Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        label: String(index + 1),
        value: index + 1,
      }));
    },

    grupoFirmantesOptions(): BaseSelectOption[] {
      //por ahora solo se muestran los grupos de ejemplo
      return [
        { id: "1", label: "Gerente General", value: "Gerente General" },
        { id: "2", label: "Apoderado de Grupo A", value: "Apoderado de Grupo A" },
        { id: "3", label: "Apoderado de Grupo B", value: "Apoderado de Grupo B" },
      ];
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
