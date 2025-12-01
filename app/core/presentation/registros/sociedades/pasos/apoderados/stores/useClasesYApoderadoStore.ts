import {
  CreateApoderadoUseCase,
  CreateClaseApoderadoUseCase,
  DeleteApoderadoUseCase,
  DeleteClaseApoderadoUseCase,
  ListApoderadosUseCase,
  ListClasesApoderadoUseCase,
  UpdateApoderadoUseCase,
  UpdateClaseApoderadoUseCase,
} from "~/core/hexag/registros/sociedades/pasos/apoderados/application";
import { CreateGerenteGeneralUseCase } from "~/core/hexag/registros/sociedades/pasos/apoderados/application/use-cases/create-gerente.use-case";
import { UpdateGerenteGeneralUseCase } from "~/core/hexag/registros/sociedades/pasos/apoderados/application/use-cases/update-gerente.use-case";
import {
  PersonTypeEnum,
  type Apoderado,
  type ClaseApoderado,
  type DocumentTypeEnum,
} from "~/core/hexag/registros/sociedades/pasos/apoderados/domain";

import { ApoderadosHttpRepository } from "~/core/hexag/registros/sociedades/pasos/apoderados/infrastructure";
import { ApoderadosMapper } from "~/core/hexag/registros/sociedades/pasos/apoderados/infrastructure/mappers/apoderados.mapper";
import { ClasesApoderadosMapper } from "~/core/hexag/registros/sociedades/pasos/apoderados/infrastructure/mappers/clases-apoderados.mapper";
import { ClasesApoderadoEspecialesEnum } from "../types/enums/ClasesApoderadoEspecialesEnum";
import type { ApoderadoRow, ClaseApoderadoRow, GerenteGeneralRow } from "../types/types";
import { convertirDocumentoDomainAUI } from "../utils/mapper-apoderados";

const repository = new ApoderadosHttpRepository();

const listUseCase = new ListClasesApoderadoUseCase(repository);
const createUseCase = new CreateClaseApoderadoUseCase(repository);
const updateUseCase = new UpdateClaseApoderadoUseCase(repository);
const deleteUseCase = new DeleteClaseApoderadoUseCase(repository);

const listApoderadosUseCase = new ListApoderadosUseCase(repository);
const createApoderadoUseCase = new CreateApoderadoUseCase(repository);
const updateApoderadoUseCase = new UpdateApoderadoUseCase(repository);
const deleteApoderadoUseCase = new DeleteApoderadoUseCase(repository);

const createGerenteGeneralUseCase = new CreateGerenteGeneralUseCase(repository);
const updateGerenteGeneralUseCase = new UpdateGerenteGeneralUseCase(repository);

export const useClasesYApoderadosStore = defineStore("clases-y-apoderados", {
  state: (): State => ({
    clases: [],
    apoderados: [],
  }),

  getters: {
    tieneGerenteRegistrado(): boolean {
      const claseGerente = this.clases.find(
        (c) => c.nombre === ClasesApoderadoEspecialesEnum.GERENTE_GENERAL
      );

      if (!claseGerente) return false;

      return this.apoderados.some(
        (apoderado) => apoderado.claseApoderadoId === claseGerente.id
      );
    },

    datosClasesOpciones(): { id: string; value: string; label: string }[] {
      const clasesAsignables = this.clases.filter(
        (clase) =>
          clase.nombre !== ClasesApoderadoEspecialesEnum.GERENTE_GENERAL &&
          clase.nombre !== ClasesApoderadoEspecialesEnum.OTROS_APODERADOS
      );

      return clasesAsignables.map((clase) => ({
        id: clase.id,
        value: clase.id,
        label: clase.nombre,
      }));
    },

    datosTablaClases(): ClaseApoderadoRow[] {
      return this.clases.map((clase) => {
        const numeroApoderados = this.apoderados.filter(
          (apoderado) => apoderado.claseApoderadoId === clase.id
        ).length;

        return {
          id: clase.id,
          nombre: clase.nombre,
          numeroApoderados,
        };
      });
    },

    datosTablaGerenteGeneral(): GerenteGeneralRow[] {
      const claseGerente = this.clases.find(
        (c) => c.nombre === ClasesApoderadoEspecialesEnum.GERENTE_GENERAL
      );
      if (!claseGerente) return [];

      const gerenteGeneral = this.apoderados.find(
        (apoderado) => apoderado.claseApoderadoId === claseGerente.id
      );
      if (!gerenteGeneral) return [];

      const nombre =
        gerenteGeneral.persona.tipo === PersonTypeEnum.NATURAL
          ? `${gerenteGeneral.persona.nombre} ${gerenteGeneral.persona.apellidoPaterno} ${gerenteGeneral.persona.apellidoMaterno}`
          : gerenteGeneral.persona.razonSocial;

      return [
        {
          id: gerenteGeneral.id,
          nombre: nombre,
          tipoDocumento: convertirDocumentoDomainAUI(
            gerenteGeneral.persona.tipoDocumento as DocumentTypeEnum
          ),
          numeroDocumento: gerenteGeneral.persona.numeroDocumento,
        },
      ];
    },

    datosTablaApoderados(): ApoderadoRow[] {
      const apoderados = this.apoderados.filter((apoderado) => {
        const clase = this.clases.find((c) => c.id === apoderado.claseApoderadoId);

        if (!clase) return true;

        const esClaseEspecial =
          clase.nombre === ClasesApoderadoEspecialesEnum.GERENTE_GENERAL ||
          clase.nombre === ClasesApoderadoEspecialesEnum.OTROS_APODERADOS;

        return !esClaseEspecial;
      });

      return apoderados.map((apoderado) => {
        const clase = this.clases.find((c) => c.id === apoderado.claseApoderadoId);
        const nombre =
          apoderado.persona.tipo === PersonTypeEnum.NATURAL
            ? `${apoderado.persona.nombre} ${apoderado.persona.apellidoPaterno} ${apoderado.persona.apellidoMaterno}`
            : apoderado.persona.razonSocial;

        return {
          id: apoderado.id,
          claseApoderadoNombre: clase?.nombre ?? "",
          nombre: nombre,
          tipoDocumento: convertirDocumentoDomainAUI(
            apoderado.persona.tipoDocumento as DocumentTypeEnum
          ),
          numeroDocumento: apoderado.persona.numeroDocumento,
        };
      });
    },

    datosTablaOtrosApoderados(): ApoderadoRow[] {
      const apoderados = this.apoderados.filter((apoderado) => {
        const clase = this.clases.find((c) => c.id === apoderado.claseApoderadoId);

        return clase?.nombre === ClasesApoderadoEspecialesEnum.OTROS_APODERADOS;
      });

      return apoderados.map((apoderado) => {
        const nombre =
          apoderado.persona.tipo === PersonTypeEnum.NATURAL
            ? `${apoderado.persona.nombre} ${apoderado.persona.apellidoPaterno} ${apoderado.persona.apellidoMaterno}`
            : apoderado.persona.razonSocial;

        return {
          id: apoderado.id,
          claseApoderadoNombre: ClasesApoderadoEspecialesEnum.OTROS_APODERADOS,
          nombre: nombre,
          tipoDocumento: convertirDocumentoDomainAUI(
            apoderado.persona.tipoDocumento as DocumentTypeEnum
          ),
          numeroDocumento: apoderado.persona.numeroDocumento,
        };
      });
    },
  },

  actions: {
    //clases de apoderados
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

    //gerente general
    obtenerGerenteGeneral(): ClaseApoderado | undefined {
      return this.clases.find(
        (c) => c.nombre === ClasesApoderadoEspecialesEnum.GERENTE_GENERAL
      );
    },

    async crearGerenteGeneral(profileId: string, apoderado: Apoderado) {
      try {
        const payload = ApoderadosMapper.deEntityAPayload(apoderado);
        await createGerenteGeneralUseCase.execute(profileId, payload);

        this.apoderados.push(apoderado);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async actualizarGerenteGeneral(profileId: string, apoderado: Apoderado) {
      try {
        const payload = ApoderadosMapper.deEntityAPayload(apoderado);
        await updateGerenteGeneralUseCase.execute(profileId, payload);

        const index = this.apoderados.findIndex((a) => a.id === apoderado.id);
        if (index !== -1) {
          this.apoderados[index] = apoderado;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    //apoderados
    obtenerApoderadoPorId(id: string) {
      return this.apoderados.find((a) => a.id === id);
    },

    async loadApoderados(profileId: string) {
      try {
        const apoderados = await listApoderadosUseCase.execute(profileId);

        this.apoderados = apoderados;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async crearApoderado(profileId: string, apoderado: Apoderado) {
      try {
        const payload = ApoderadosMapper.deEntityAPayload(apoderado);
        await createApoderadoUseCase.execute(profileId, payload);

        this.apoderados.push(apoderado);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async actualizarApoderado(profileId: string, apoderado: Apoderado) {
      try {
        const payload = ApoderadosMapper.deEntityAPayload(apoderado);
        await updateApoderadoUseCase.execute(profileId, payload);

        const index = this.apoderados.findIndex((a) => a.id === apoderado.id);
        if (index !== -1) {
          this.apoderados[index] = apoderado;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async eliminarApoderado(profileId: string, apoderadoId: string) {
      try {
        await deleteApoderadoUseCase.execute(profileId, apoderadoId);

        this.apoderados = this.apoderados.filter((a) => a.id !== apoderadoId);
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
