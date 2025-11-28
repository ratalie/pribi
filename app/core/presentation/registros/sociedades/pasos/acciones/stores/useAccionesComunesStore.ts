import { defineStore } from "pinia";
import type { FileMetadata, TipoAccionEnum } from "~/core/hexag/registros/sociedades/pasos/acciones/domain";

export const useAccionesComunesStore = defineStore("accionesComunesModal", {
  state: (): State => ({
    // Campos del formulario
    tipoAcciones: "",
    cantidadAcciones: 0,
    redimibles: false,
    otrosDerechosEspeciales: false,
    obligacionesAdicionales: false,
    comentariosAdicionales: false,
    comentariosAdicionalesTexto: "",

    // Metadata de archivos de "Otros derechos especiales"
    metadataDerechosEspeciales: [] as FileMetadata[],

    // Metadata de archivos de "Obligaciones adicionales"
    metadataObligaciones: [] as FileMetadata[],
  }),

  actions: {
    // Método para obtener todos los datos del formulario
    getFormData() {
      return {
        tipoAcciones: this.tipoAcciones,
        cantidadAcciones: this.cantidadAcciones,
        redimibles: this.redimibles,
        otrosDerechosEspeciales: this.otrosDerechosEspeciales,
        obligacionesAdicionales: this.obligacionesAdicionales,
        comentariosAdicionales: this.comentariosAdicionales,
        comentariosAdicionalesTexto: this.comentariosAdicionalesTexto,
        metadataDerechosEspeciales: this.metadataDerechosEspeciales,
        metadataObligaciones: this.metadataObligaciones,
      };
    },

    setFormData(data: State) {
      this.tipoAcciones = data.tipoAcciones;
      this.cantidadAcciones = data.cantidadAcciones;
      this.redimibles = data.redimibles;
      this.otrosDerechosEspeciales = data.otrosDerechosEspeciales;
      this.obligacionesAdicionales = data.obligacionesAdicionales;
      this.comentariosAdicionales = data.comentariosAdicionales;
      this.comentariosAdicionalesTexto = data.comentariosAdicionalesTexto;
      this.metadataDerechosEspeciales = [...(data.metadataDerechosEspeciales || [])];
      this.metadataObligaciones = [...(data.metadataObligaciones || [])];
    },

    addDerechosEspecialesMetadata(metadata: FileMetadata) {
      this.metadataDerechosEspeciales.push(metadata);
    },

    removeDerechosEspecialesMetadata(fileId: string) {
      const index = this.metadataDerechosEspeciales.findIndex((m) => m.fileId === fileId);
      if (index !== -1) {
        this.metadataDerechosEspeciales.splice(index, 1);
      }
    },

    addObligacionesMetadata(metadata: FileMetadata) {
      this.metadataObligaciones.push(metadata);
    },

    removeObligacionesMetadata(fileId: string) {
      const index = this.metadataObligaciones.findIndex((m) => m.fileId === fileId);
      if (index !== -1) {
        this.metadataObligaciones.splice(index, 1);
      }
    },
  },
});

export interface AccionesComunesState {
  tipoAcciones: TipoAccionEnum | "";
  cantidadAcciones: number;
  redimibles: boolean;
  otrosDerechosEspeciales: boolean;
  obligacionesAdicionales: boolean;
  comentariosAdicionales: boolean;
  comentariosAdicionalesTexto: string;
  metadataDerechosEspeciales: FileMetadata[];
  metadataObligaciones: FileMetadata[];
}

type State = AccionesComunesState;
