import type { BaseSelectOption } from "~/components/base/inputs/text/BaseInputSelect.vue";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
import type {
  ClaseApoderado,
  ClaseApoderadoRow,
  OtroApoderado,
  OtroApoderadoRow,
  RegistroApoderado,
  RegistroApoderadoRow,
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
        tipoPersona: "natural",
        nombreRazonSocial: "Juan Perez Lopez",
        tipoDocumento: TipoDocumentosEnum.DNI,
        numeroDocumento: "71641140",
        personaNatural: {
          tipoDocumento: TipoDocumentosEnum.DNI,
          numeroDocumento: "71641140",
          nombre: "Juan",
          apellidoPaterno: "Perez",
          apellidoMaterno: "Lopez",
          paisPasaporte: "",
          estadoCivil: null,
        },
      },
      {
        id: "2",
        claseApoderadoId: "3",
        tipoPersona: "natural",
        nombreRazonSocial: "Ana Gomez Fernandez",
        tipoDocumento: TipoDocumentosEnum.DNI,
        numeroDocumento: "71641150",
        personaNatural: {
          tipoDocumento: TipoDocumentosEnum.DNI,
          numeroDocumento: "71641150",
          nombre: "Ana",
          apellidoPaterno: "Gomez",
          apellidoMaterno: "Fernandez",
          paisPasaporte: "",
          estadoCivil: null,
        },
      },
    ],
    otrosApoderados: [
      {
        id: "1",
        nombreRazonSocial: "Maria Fernanda Torres",
        tipoDocumento: TipoDocumentosEnum.DNI,
        numeroDocumento: "71641141",
        personaNatural: {
          tipoDocumento: TipoDocumentosEnum.DNI,
          numeroDocumento: "71641141",
          nombre: "Maria",
          apellidoPaterno: "Fernanda",
          apellidoMaterno: "Torres",
          paisPasaporte: "",
          estadoCivil: null,
        },
      },
      {
        id: "2",
        nombreRazonSocial: "Carlos Alberto Rojas",
        tipoDocumento: TipoDocumentosEnum.CARNET_DE_EXTRANJERIA,
        numeroDocumento: "CE-456789",
        personaNatural: {
          tipoDocumento: TipoDocumentosEnum.CARNET_DE_EXTRANJERIA,
          numeroDocumento: "CE-456789",
          nombre: "Carlos",
          apellidoPaterno: "Alberto",
          apellidoMaterno: "Rojas",
          paisPasaporte: "",
          estadoCivil: null,
        },
      },
    ],
  }),

  getters: {
    tablaClasesApoderado(): ClaseApoderadoRow[] {
      return this.clasesApoderado.map((clase, index) => ({
        id: clase.id,
        table_id: index + 1,
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
