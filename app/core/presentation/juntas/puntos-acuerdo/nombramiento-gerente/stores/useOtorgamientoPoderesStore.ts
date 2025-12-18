import type { OtorgamientoPoder } from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";
import type { OtorgamientoPoderResponseDTO } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/application";
import {
  CreateOtorgamientoPoderUseCase,
  DeleteOtorgamientoPoderUseCase,
  ListOtorgamientosPoderUseCase,
  ListTiposFacultadesUseCase,
  UpdateOtorgamientoPoderUseCase,
} from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/application";
import type {
  CreateOtorgamientoPoderPayload,
  TipoFacultad,
  UpdateOtorgamientoPoderPayload,
} from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/domain";
import { RegimenFacultadesHttpRepository } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/infrastructure/repository/regimen-facultades.http.repository";

const repository = new RegimenFacultadesHttpRepository();

const listTiposFacultadesUseCase = new ListTiposFacultadesUseCase(repository);
const listOtorgamientosPoderUseCase = new ListOtorgamientosPoderUseCase(repository);
const createOtorgamientoPoderUseCase = new CreateOtorgamientoPoderUseCase(repository);
const updateOtorgamientoPoderUseCase = new UpdateOtorgamientoPoderUseCase(repository);
const deleteOtorgamientoPoderUseCase = new DeleteOtorgamientoPoderUseCase(repository);

interface State {
  poderes: TipoFacultad[];
  powerGrants: OtorgamientoPoderResponseDTO[];
  powerGrantsSnapshot: OtorgamientoPoder[]; // Referencia inicial del snapshot (para identificar inmutables)
  status: "idle" | "loading" | "error";
  errorMessage: string | null;
}

/**
 * Store para gestionar el otorgamiento de poderes en juntas
 *
 * Funcionalidades:
 * - Cargar poderes disponibles (del snapshot o endpoint)
 * - Cargar otorgamientos actuales del registro permanente
 * - Crear/editar/eliminar otorgamientos (solo los agregados en esta vista)
 * - Identificar poderes inmutables del snapshot
 */
export const useOtorgamientoPoderesStore = defineStore("otorgamientoPoderes", {
  state: (): State => ({
    poderes: [],
    powerGrants: [],
    powerGrantsSnapshot: [], // Referencia inicial del snapshot
    status: "idle",
    errorMessage: null,
  }),

  getters: {
    /**
     * Verifica si un poder viene del snapshot (inmutable)
     */
    esPoderDelSnapshot: (state) => {
      return (powerGrantId: string): boolean => {
        return state.powerGrantsSnapshot.some((grant) => grant.id === powerGrantId);
      };
    },
  },

  actions: {
    /**
     * Establece la referencia inicial del snapshot
     * ⚠️ IMPORTANTE: Se debe llamar una vez al cargar la vista
     */
    setSnapshotPowerGrants(powerGrants: OtorgamientoPoder[]) {
      this.powerGrantsSnapshot = [...powerGrants];
    },

    /**
     * Cargar poderes disponibles
     * Obtiene los poderes del endpoint (estos son los poderes disponibles para asignar)
     */
    async loadPowers(societyId: string): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const poderes = await listTiposFacultadesUseCase.execute(societyId);
        this.poderes = poderes;
        this.status = "idle";
      } catch (error: any) {
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar poderes";
        console.error("[Store][OtorgamientoPoderes] Error al cargar poderes", error);
        throw error;
      }
    },

    /**
     * Cargar otorgamientos actuales del registro permanente
     * ⚠️ IMPORTANTE: Estos son los otorgamientos del registro permanente (no del snapshot)
     * Los poderes del snapshot se establecen con setSnapshotPowerGrants()
     */
    async loadPowerGrants(societyId: string): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      try {
        const otorgamientos = await listOtorgamientosPoderUseCase.execute(societyId);
        this.powerGrants = otorgamientos;
        this.status = "idle";
      } catch (error: any) {
        this.status = "error";
        this.errorMessage = error.message || "Error al cargar otorgamientos";
        console.error("[Store][OtorgamientoPoderes] Error al cargar otorgamientos", error);
        throw error;
      }
    },

    /**
     * Crear nuevo otorgamiento de poder
     * ⚠️ IMPORTANTE: Solo se pueden crear poderes nuevos (no del snapshot)
     */
    async createPowerGrant(
      societyId: string,
      payload: CreateOtorgamientoPoderPayload
    ): Promise<void> {
      try {
        await createOtorgamientoPoderUseCase.execute(societyId, payload);

        // Recargar otorgamientos después de crear
        await this.loadPowerGrants(societyId);
      } catch (error: any) {
        this.errorMessage = error.message || "Error al crear otorgamiento";
        console.error("[Store][OtorgamientoPoderes] Error al crear otorgamiento", error);
        throw error;
      }
    },

    /**
     * Actualizar otorgamiento de poder existente
     * ⚠️ IMPORTANTE: Solo se pueden actualizar poderes agregados en esta vista (no del snapshot)
     */
    async updatePowerGrant(
      societyId: string,
      payload: UpdateOtorgamientoPoderPayload
    ): Promise<void> {
      try {
        // Verificar que no sea del snapshot
        if (this.esPoderDelSnapshot(payload.id)) {
          throw new Error("No se puede editar un poder del snapshot (inmutable)");
        }

        await updateOtorgamientoPoderUseCase.execute(societyId, payload);

        // Recargar otorgamientos después de actualizar
        await this.loadPowerGrants(societyId);
      } catch (error: any) {
        this.errorMessage = error.message || "Error al actualizar otorgamiento";
        console.error("[Store][OtorgamientoPoderes] Error al actualizar otorgamiento", error);
        throw error;
      }
    },

    /**
     * Eliminar otorgamiento de poder
     * ⚠️ IMPORTANTE: Solo se pueden eliminar poderes agregados en esta vista (no del snapshot)
     */
    async deletePowerGrant(societyId: string, powerGrantIds: string[]): Promise<void> {
      try {
        // Verificar que ninguno sea del snapshot
        const poderesDelSnapshot = powerGrantIds.filter((id) => this.esPoderDelSnapshot(id));
        if (poderesDelSnapshot.length > 0) {
          throw new Error(
            `No se pueden eliminar poderes del snapshot (inmutables): ${poderesDelSnapshot.join(
              ", "
            )}`
          );
        }

        await deleteOtorgamientoPoderUseCase.execute(societyId, powerGrantIds);

        // Recargar otorgamientos después de eliminar
        await this.loadPowerGrants(societyId);
      } catch (error: any) {
        this.errorMessage = error.message || "Error al eliminar otorgamiento";
        console.error("[Store][OtorgamientoPoderes] Error al eliminar otorgamiento", error);
        throw error;
      }
    },

    /**
     * Limpiar estado del store
     */
    reset() {
      this.poderes = [];
      this.powerGrants = [];
      this.powerGrantsSnapshot = [];
      this.status = "idle";
      this.errorMessage = null;
    },
  },
});

