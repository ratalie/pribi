import { defineStore } from "pinia";

interface FileMetadataResponseDTO {
  fileId: string;
  mimeType: string;
  originalName: string;
  size: number;
}

export const useClasesAccionesStore = defineStore("clasesAccionesModal", {
  state: (): State => ({
    // Campos del formulario
    nombreClaseAccion: "",
    cantidadAccionesClase: 0,
    conDerechoVoto: false,
    redimiblesClase: false,
    otrosDerechosEspecialesClase: false,
    obligacionesAdicionalesClase: false,
    comentariosAdicionales: false,
    comentariosAdicionalesTexto: "",

    // Metadata de archivos de "Otros derechos especiales"
    metadataDerechosEspecialesClase: [] as FileMetadataResponseDTO[],

    // Metadata de archivos de "Obligaciones adicionales"
    metadataObligacionesClase: [] as FileMetadataResponseDTO[],
  }),

  actions: {
    // Método para obtener todos los datos del formulario
    getFormData() {
      return {
        nombreClaseAccion: this.nombreClaseAccion,
        cantidadAccionesClase: this.cantidadAccionesClase,
        conDerechoVoto: this.conDerechoVoto,
        redimiblesClase: this.redimiblesClase,
        otrosDerechosEspecialesClase: this.otrosDerechosEspecialesClase,
        obligacionesAdicionalesClase: this.obligacionesAdicionalesClase,
        comentariosAdicionales: this.comentariosAdicionales,
        comentariosAdicionalesTexto: this.comentariosAdicionalesTexto,
        metadataDerechosEspecialesClase: this.metadataDerechosEspecialesClase,
        metadataObligacionesClase: this.metadataObligacionesClase,
      };
    },

    addDerechosEspecialesClaseMetadata(metadata: FileMetadataResponseDTO) {
      this.metadataDerechosEspecialesClase.push(metadata);
    },

    removeDerechosEspecialesClaseMetadata(fileId: string) {
      const index = this.metadataDerechosEspecialesClase.findIndex((m) => m.fileId === fileId);
      if (index !== -1) {
        this.metadataDerechosEspecialesClase.splice(index, 1);
      }
    },

    addObligacionesClaseMetadata(metadata: FileMetadataResponseDTO) {
      this.metadataObligacionesClase.push(metadata);
    },

    removeObligacionesClaseMetadata(fileId: string) {
      const index = this.metadataObligacionesClase.findIndex((m) => m.fileId === fileId);
      if (index !== -1) {
        this.metadataObligacionesClase.splice(index, 1);
      }
    },
  },
});

interface State {
  nombreClaseAccion: string;
  cantidadAccionesClase: number;
  conDerechoVoto: boolean;
  redimiblesClase: boolean;
  otrosDerechosEspecialesClase: boolean;
  obligacionesAdicionalesClase: boolean;
  comentariosAdicionales: boolean;
  comentariosAdicionalesTexto: string;
  metadataDerechosEspecialesClase: FileMetadataResponseDTO[];
  metadataObligacionesClase: FileMetadataResponseDTO[];
}
