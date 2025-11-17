import type { BaseSelectOption } from "~/components/base/inputs/text/BaseInputSelect.vue";
import { EntityCoinEnum } from "~/types/enums/EntityCoinEnum";
import { TiemposVigenciaEnum } from "~/types/enums/TiemposVigenciaEnum";
import { TipoFirmasEnum } from "~/types/enums/TipoFirmasEnum";
import { TipoMontoEnum } from "~/types/enums/TipoMontoEnum";

export const useApoderadoFacultadStore = defineStore("apoderadoFacultad", {
  state: (): State => ({
    tipoFacultad: "",
    reglasYLimites: false,
    esIrrevocable: false,
    vigencia: TiemposVigenciaEnum.INDEFINIDO,
    fechaInicio: "",
    fechaFin: "",
    tipoMoneda: EntityCoinEnum.SOLES,
    limiteMonetario: [],
  }),

  getters: {
    monedaOptions(): BaseSelectOption[] {
      return Object.values(EntityCoinEnum).map((moneda) => ({
        id: moneda,
        label: moneda,
        value: moneda,
      }));
    },

    tipoMontoOptions(): BaseSelectOption[] {
      return Object.values(TipoMontoEnum).map((tipoMonto) => ({
        id: tipoMonto,
        label: tipoMonto,
        value: tipoMonto,
      }));
    },

    tipoFirmaOptions(): BaseSelectOption[] {
      return Object.values(TipoFirmasEnum).map((tipoFirma) => ({
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
  vigencia: TiemposVigenciaEnum;
  fechaInicio: string;
  fechaFin: string;
  tipoMoneda: EntityCoinEnum;
  limiteMonetario: LimiteMonetarioModal[];
}

export interface LimiteMonetarioModal {
  id: string;
  desde: number;
  tipoMonto: TipoMontoEnum;
  hasta: number;
  tipoFirma: TipoFirmasEnum;
  firmantes: Firmante[];
}

interface Firmante {
  id: string;
  cantidad: string;
  grupo: string;
}
