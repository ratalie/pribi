import { defineStore } from "pinia";
import { ListAccionesUseCase } from "~/core/hexag/registros/sociedades/pasos/acciones/application";
import { AccionesHttpRepository } from "~/core/hexag/registros/sociedades/pasos/acciones/infrastructure";
import type { AccionRegistro, AccionTableRow } from "../types/acciones";
import { TipoAccionesEnum } from "../types/enums/tipoAccionesEnum";
import { getTipoAccionUI } from "../utils/mapper-acciones-lista";

interface State {
  acciones: AccionRegistro[];
}

// Formateador de porcentaje
const percentageFormatter = new Intl.NumberFormat("es-PE", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const repository = new AccionesHttpRepository();
const listUseCase = new ListAccionesUseCase(repository);

export const useRegistroAccionesStore = defineStore("registroAcciones", {
  state: (): State => ({
    acciones: [],
  }),

  getters: {
    totalAcciones: (state) =>
      state.acciones.reduce((total, accion) => total + accion.accionesSuscritas, 0),

    totalTipos: (state) => state.acciones.length,

    tablaAcciones: (state): AccionTableRow[] => {
      const total = state.acciones.reduce((sum, accion) => sum + accion.accionesSuscritas, 0);
      return state.acciones.map((accion) => ({
        id: accion.id,
        tipo_acciones:
          accion.tipo === TipoAccionesEnum.CLASES
            ? accion.nombreAccion
            : getTipoAccionUI(accion.tipo),
        acciones_suscritas: accion.accionesSuscritas,
        participacion:
          total > 0 ? percentageFormatter.format(accion.accionesSuscritas / total) : "0%",
        derecho_voto: accion.derechoVoto,
        redimibles: accion.redimibles,
        derechos_especiales: accion.otrosDerechosEspeciales,
        obligaciones_adicionales: accion.obligacionesAdicionales,
      }));
    },
  },

  actions: {
    async loadAcciones(profileId: string) {
      try {
        await listUseCase.execute(profileId);
      } catch (error) {
        console.error(error);
      }
    },

    addAccion(accion: AccionRegistro) {
      this.acciones.push(accion);
    },

    updateAccion(payload: AccionRegistro) {
      const index = this.acciones.findIndex((accion) => accion.id === payload.id);

      if (index === -1) {
        return;
      }

      this.acciones.splice(index, 1, { ...payload });
    },

    removeAccion(id: string) {
      this.acciones = this.acciones.filter((accion) => accion.id !== id);
    },

    getAccionById(id: string): AccionRegistro | null {
      return this.acciones.find((accion) => accion.id === id) ?? null;
    },

    clearAcciones() {
      this.acciones = [];
    },
  },
});
