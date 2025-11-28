import {
  CreateClaseApoderadoUseCase,
  DeleteClaseApoderadoUseCase,
  ListClasesApoderadoUseCase,
  UpdateClaseApoderadoUseCase,
} from "~/core/hexag/registros/sociedades/pasos/apoderados/application";
import type {
  Apoderado,
  ClaseApoderado,
} from "~/core/hexag/registros/sociedades/pasos/apoderados/domain";
import { ApoderadosHttpRepository } from "~/core/hexag/registros/sociedades/pasos/apoderados/infrastructure";
import { ClasesApoderadosMapper } from "~/core/hexag/registros/sociedades/pasos/apoderados/infrastructure/mappers/clases-apoderados.mapper";
import type { ClaseApoderadoRow } from "../types";

const repository = new ApoderadosHttpRepository();

const listUseCase = new ListClasesApoderadoUseCase(repository);
const createUseCase = new CreateClaseApoderadoUseCase(repository);
const updateUseCase = new UpdateClaseApoderadoUseCase(repository);
const deleteUseCase = new DeleteClaseApoderadoUseCase(repository);

export const useClasesYApoderadosStore = defineStore("clases-y-apoderados", {
  state: (): State => ({
    clases: [],
    apoderados: [],
  }),

  getters: {
    datosTablaClases(): ClaseApoderadoRow[] {
      return this.clases.map((clase) => ({
        id: clase.id,
        nombre: clase.nombre,
        numeroApoderados: 0,
      }));
    },
  },

  actions: {
    obtenerClasePorId(id: string) {
      return this.clases.find((c) => c.id === id);
    },

    async loadClases(profileId: string) {
      try {
        const clases = await listUseCase.execute(profileId);
        this.clases = clases;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async crearClase(profileId: string, clase: ClaseApoderado) {
      try {
        const payload = ClasesApoderadosMapper.deEntityAPayload(clase);

        await createUseCase.execute(profileId, payload);

        this.clases.push(clase);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async actualizarClase(profileId: string, clase: ClaseApoderado) {
      try {
        const payload = ClasesApoderadosMapper.deEntityAPayload(clase);

        await updateUseCase.execute(profileId, payload);

        const index = this.clases.findIndex((c) => c.id === clase.id);
        if (index !== -1) {
          this.clases[index] = clase;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async eliminarClase(profileId: string, claseId: string) {
      try {
        await deleteUseCase.execute(profileId, claseId);

        this.clases = this.clases.filter((c) => c.id !== claseId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
});

interface State {
  clases: ClaseApoderado[];
  apoderados: Apoderado[];
}
