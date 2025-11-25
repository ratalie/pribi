import { defineStore } from "pinia";
import { ListAccionesUseCase } from "~/core/hexag/registros/sociedades/pasos/acciones/application";
import { AccionesHttpRepository } from "~/core/hexag/registros/sociedades/pasos/acciones/infrastructure";
import type { AccionRegistro, AccionTableRow } from "../types/acciones";

interface State {
  acciones: AccionRegistro[];
}

const repository = new AccionesHttpRepository();
const listUseCase = new ListAccionesUseCase(repository);

const percentageFormatter = new Intl.NumberFormat("es-PE", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useRegistroAccionesStore = defineStore("registroAcciones", {
  state: (): State => ({
    acciones: [],
  }),

  getters: {
    totalAcciones: (state) =>
      state.acciones.reduce((total, accion) => total + accion.accionesSuscritas, 0),
    totalTipos: (state) => state.acciones.length,
    tablaAcciones: (state): AccionTableRow[] =>
      state.acciones.map((accion) => ({
        id: accion.id,
        tipo_acciones: accion.descripcion,
        acciones_suscritas: accion.accionesSuscritas,
        participacion: percentageFormatter.format(accion.participacion),
        derecho_voto: accion.derechoVoto,
        redimibles: accion.redimibles,
        derechos_especiales: accion.derechosEspeciales,
        obligaciones_adicionales: accion.obligacionesAdicionales,
      })),
  },

  actions: {
    async loadAcciones(profileId: string) {
      try {
        await listUseCase.execute(profileId);
      } catch (error) {
        console.error(error);
      }
    },

    addAccion(
      payload: Omit<AccionRegistro, "id" | "participacion"> & {
        id?: string;
      }
    ) {
      const id = payload.id ?? generateId();
      const accion: AccionRegistro = {
        id,
        tipo: payload.tipo,
        descripcion: payload.descripcion,
        accionesSuscritas: payload.accionesSuscritas,
        derechoVoto: payload.derechoVoto,
        redimibles: payload.redimibles,
        derechosEspeciales: payload.derechosEspeciales,
        obligacionesAdicionales: payload.obligacionesAdicionales,
        archivosDerechosEspeciales: [...payload.archivosDerechosEspeciales],
        archivosObligaciones: [...payload.archivosObligaciones],
        participacion: 0,
      };

      this.acciones.push(accion);
      this.recalculateParticipaciones();

      return accion;
    },

    updateAccion(payload: AccionRegistro) {
      const index = this.acciones.findIndex((accion) => accion.id === payload.id);

      if (index === -1) {
        return;
      }

      this.acciones.splice(index, 1, {
        ...payload,
        archivosDerechosEspeciales: [...payload.archivosDerechosEspeciales],
        archivosObligaciones: [...payload.archivosObligaciones],
      });

      this.recalculateParticipaciones();
    },

    removeAccion(id: string) {
      this.acciones = this.acciones.filter((accion) => accion.id !== id);
      this.recalculateParticipaciones();
    },

    getAccionById(id: string) {
      const accion = this.acciones.find((item) => item.id === id);

      if (!accion) {
        return null;
      }

      return {
        ...accion,
        archivosDerechosEspeciales: [...accion.archivosDerechosEspeciales],
        archivosObligaciones: [...accion.archivosObligaciones],
      };
    },

    clearAcciones() {
      this.acciones = [];
    },

    recalculateParticipaciones() {
      const total = this.totalAcciones;

      if (total === 0) {
        this.acciones.forEach((accion) => {
          accion.participacion = 0;
        });
        return;
      }

      this.acciones.forEach((accion) => {
        accion.participacion = accion.accionesSuscritas / total;
      });
    },
  },
});
