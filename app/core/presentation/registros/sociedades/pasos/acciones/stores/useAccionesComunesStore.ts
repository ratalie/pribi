import { defineStore } from "pinia";
import type { TipoAccionesEnum } from "../types/enums/tipoAccionesEnum";

interface FileMetadataResponseDTO {
  fileId: string;
  mimeType: string;
  originalName: string;
  size: number;
}

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
    metadataDerechosEspeciales: [] as FileMetadataResponseDTO[],

    // Metadata de archivos de "Obligaciones adicionales"
    metadataObligaciones: [] as FileMetadataResponseDTO[],
  }),

  actions: {
    // Método para obtener todos los datos del formulario
    getFormData() {
      return {
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

    addDerechosEspecialesMetadata(metadata: FileMetadataResponseDTO) {
      this.metadataDerechosEspeciales.push(metadata);
    },

    removeDerechosEspecialesMetadata(fileId: string) {
      const index = this.metadataDerechosEspeciales.findIndex((m) => m.fileId === fileId);
      if (index !== -1) {
        this.metadataDerechosEspeciales.splice(index, 1);
      }
    },

    addObligacionesMetadata(metadata: FileMetadataResponseDTO) {
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

interface State {
  tipoAcciones: TipoAccionesEnum | "";
  cantidadAcciones: number;
  redimibles: boolean;
  otrosDerechosEspeciales: boolean;
  obligacionesAdicionales: boolean;
  comentariosAdicionales: boolean;
  comentariosAdicionalesTexto: string;
  metadataDerechosEspeciales: FileMetadataResponseDTO[];
  metadataObligaciones: FileMetadataResponseDTO[];
}
