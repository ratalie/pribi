import { defineStore } from "pinia";
import {
  CreateAccionUseCase,
  DeleteAccionUseCase,
  ListAccionesUseCase,
  UpdateAccionUseCase,
} from "~/core/hexag/registros/sociedades/pasos/acciones/application";
import type { Accion } from "~/core/hexag/registros/sociedades/pasos/acciones/domain";
import { TipoAccionEnum } from "~/core/hexag/registros/sociedades/pasos/acciones/domain";
import {
  AccionesHttpRepository,
  AccionesMapper,
} from "~/core/hexag/registros/sociedades/pasos/acciones/infrastructure";
import type { AccionTableRow } from "../types/acciones";
import { getTipoAccionUI } from "../utils/mapper-acciones-lista";

interface State {
  acciones: Accion[];
}

// Formateador de porcentaje
const percentageFormatter = new Intl.NumberFormat("es-PE", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const repository = new AccionesHttpRepository();
const listUseCase = new ListAccionesUseCase(repository);
const createUseCase = new CreateAccionUseCase(repository);
const updateUseCase = new UpdateAccionUseCase(repository);
const deleteUseCase = new DeleteAccionUseCase(repository);

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
          accion.tipo === TipoAccionEnum.CLASES
            ? accion.nombreAccion
            : getTipoAccionUI(accion.tipo),
        acciones_suscritas: accion.accionesSuscritas.toLocaleString("es-PE"),
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
        const acciones = await listUseCase.execute(profileId);
        this.acciones = acciones;
      } catch (error) {
        console.error(error);
        this.acciones = [];
      }
    },

    /**
     * Crea una nueva acción en el backend y la agrega al estado local.
     * @param profileId ID del perfil de sociedad
     * @param accion Datos de la acción a crear
     */
    async createAccion(profileId: string, accion: Accion) {
      try {
        // Convertir Entity a Payload
        const payload = AccionesMapper.deEntityAPayload(accion);

        // Crear en el backend
        await createUseCase.execute(profileId, payload);

        // Agregar al estado local
        this.acciones.push(accion);
      } catch (error) {
        console.error("[useRegistroAccionesStore] Error al crear acción:", error);
        throw error;
      }
    },

    /**
     * Actualiza una acción en el backend y en el estado local.
     * @param profileId ID del perfil de sociedad
     * @param accion Datos actualizados de la acción
     */
    async updateAccion(profileId: string, accion: Accion) {
      try {
        // Convertir Entity a Payload
        const payload = AccionesMapper.deEntityAPayload(accion);

        // Actualizar en el backend
        await updateUseCase.execute(profileId, payload);

        // Actualizar en el estado local
        const index = this.acciones.findIndex((a) => a.id === accion.id);
        if (index !== -1) {
          this.acciones.splice(index, 1, { ...accion });
        }
      } catch (error) {
        console.error("[useRegistroAccionesStore] Error al actualizar acción:", error);
        throw error;
      }
    },

    /**
     * Elimina una acción del backend y del estado local.
     * @param profileId ID del perfil de sociedad
     * @param accionId ID de la acción a eliminar
     */
    async removeAccion(profileId: string, accionIds: string) {
      try {
        // Eliminar en el backend
        await deleteUseCase.execute(profileId, [accionIds]);

        // Eliminar del estado local
        this.acciones = this.acciones.filter((accion) => accion.id !== accionIds);
      } catch (error) {
        console.error("[useRegistroAccionesStore] Error al eliminar acción:", error);
        throw error;
      }
    },

    /**
     * Elimina todas las acciones del backend y del estado local.
     * @param profileId ID del perfil de sociedad
     */
    async removeAllAcciones(profileId: string) {
      try {
        if (this.acciones.length === 0) {
          return; // No hay acciones que eliminar
        }

        // Obtener todos los IDs de las acciones
        const accionIds = this.acciones.map((accion) => accion.id);

        // Eliminar en el backend
        await deleteUseCase.execute(profileId, accionIds);

        // Limpiar el estado local
        this.acciones = [];
      } catch (error) {
        console.error("[useRegistroAccionesStore] Error al eliminar todas las acciones:", error);
        throw error;
      }
    },

    getAccionById(id: string): Accion | null {
      return this.acciones.find((accion) => accion.id === id) ?? null;
    },

    clearAcciones() {
      this.acciones = [];
    },
  },
});
