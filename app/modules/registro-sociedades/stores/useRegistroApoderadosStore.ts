import type { BaseSelectOption } from "~/components/base/inputs/text/BaseInputSelect.vue";
import {
  type ClaseApoderado,
  type ClaseApoderadoRow,
  type OtroApoderado,
  type OtroApoderadoRow,
  type RegistroApoderado,
  type RegistroApoderadoRow,
} from "../types/registroApoderados";

export const useRegistroApoderadosStore = defineStore("registroApoderados", {
  state: (): State => ({
    clasesApoderado: [
      { id: "1", nombre: "Gerente General" },
      { id: "2", nombre: "Otros apoderados" },
      { id: "3", nombre: "Apoderado de Grupo" },
    ],
    apoderados: [
      {
        id: "1",
        claseApoderadoId: "1",
        nombreRazonSocial: "Juan Perez Lopez",
        tipoDocumento: "DNI",
        numeroDocumento: "71641140",
      },
      {
        id: "2",
        claseApoderadoId: "3",
        nombreRazonSocial: "Ana Gomez Fernandez",
        tipoDocumento: "DNI",
        numeroDocumento: "71641150",
      },
      {
        id: "3",
        claseApoderadoId: "3",
        nombreRazonSocial: "Cristian Quispe Perez",
        tipoDocumento: "DNI",
        numeroDocumento: "71641160",
      },
    ],
    otrosApoderados: [
      {
        id: "1",
        nombreRazonSocial: "Maria Fernanda Torres",
        tipoDocumento: "DNI",
        numeroDocumento: "71641141",
      },
      {
        id: "2",
        nombreRazonSocial: "Carlos Alberto Rojas",
        tipoDocumento: "Carnet de Extranjería",
        numeroDocumento: "CE-456789",
      },
    ],
  }),

  getters: {
    tablaClasesApoderado(): ClaseApoderadoRow[] {
      return this.clasesApoderado.map((clase) => ({
        id: clase.id,
        clase_apoderado: clase.nombre,
        numero_apoderados: this.apoderados.filter(
          (apoderado) => apoderado.claseApoderadoId === clase.id
        ).length,
      }));
    },

    tablaRegistroApoderados(): RegistroApoderadoRow[] {
      return this.apoderados.map((apoderado) => {
        const clase = this.clasesApoderado.find(
          (item) => item.id === apoderado.claseApoderadoId
        );

        return {
          id: apoderado.id,
          clase_apoderado: clase?.nombre ?? "",
          nombre_razon_social: apoderado.nombreRazonSocial,
          tipo_documento: apoderado.tipoDocumento,
          numero_documento: apoderado.numeroDocumento,
        };
      });
    },

    tablaOtrosApoderados(): OtroApoderadoRow[] {
      return this.otrosApoderados.map((apoderado) => ({
        id: apoderado.id,
        nombre_razon_social: apoderado.nombreRazonSocial,
        tipo_documento: apoderado.tipoDocumento,
        numero_documento: apoderado.numeroDocumento,
      }));
    },

    clasesApoderadoOptions(): BaseSelectOption[] {
      return this.clasesApoderado.map((clase) => ({
        id: clase.id,
        value: clase.id,
        label: clase.nombre,
      }));
    },
  },

  actions: {
    agregarClaseApoderado(payload: ClaseApoderado) {
      this.clasesApoderado.push(payload);
    },

    editarClaseApoderado(payload: ClaseApoderado) {
      const index = this.clasesApoderado.findIndex((clase) => clase.id === payload.id);
      if (index !== -1) {
        this.clasesApoderado[index] = payload;
      }
    },

    eliminarClaseApoderado(id: string) {
      this.clasesApoderado = this.clasesApoderado.filter((clase) => clase.id !== id);
      this.apoderados = this.apoderados.filter(
        (apoderado) => apoderado.claseApoderadoId !== id
      );
    },

    agregarApoderado(payload: RegistroApoderado) {
      this.apoderados.push(payload);
    },

    editarApoderado(payload: RegistroApoderado) {
      const index = this.apoderados.findIndex((apoderado) => apoderado.id === payload.id);
      if (index !== -1) {
        this.apoderados[index] = payload;
      }
    },

    eliminarApoderado(id: string) {
      this.apoderados = this.apoderados.filter((apoderado) => apoderado.id !== id);
    },

    agregarOtroApoderado(payload: OtroApoderado) {
      this.otrosApoderados.push(payload);
    },

    editarOtroApoderado(payload: OtroApoderado) {
      const index = this.otrosApoderados.findIndex((apoderado) => apoderado.id === payload.id);
      if (index !== -1) {
        this.otrosApoderados[index] = payload;
      }
    },

    eliminarOtroApoderado(id: string) {
      this.otrosApoderados = this.otrosApoderados.filter((apoderado) => apoderado.id !== id);
    },
  },
});

interface State {
  clasesApoderado: ClaseApoderado[];
  apoderados: RegistroApoderado[];
  otrosApoderados: OtroApoderado[];
}

