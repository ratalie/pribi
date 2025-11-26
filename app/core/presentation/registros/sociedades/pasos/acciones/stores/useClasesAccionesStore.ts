import { defineStore } from "pinia";
import type { FileMetadataDTO } from "../types/acciones";

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
    metadataDerechosEspecialesClase: [] as FileMetadataDTO[],

    // Metadata de archivos de "Obligaciones adicionales"
    metadataObligacionesClase: [] as FileMetadataDTO[],
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

    setFormData(data: State) {
      this.nombreClaseAccion = data.nombreClaseAccion;
      this.cantidadAccionesClase = data.cantidadAccionesClase;
      this.conDerechoVoto = data.conDerechoVoto;
      this.redimiblesClase = data.redimiblesClase;
      this.otrosDerechosEspecialesClase = data.otrosDerechosEspecialesClase;
      this.obligacionesAdicionalesClase = data.obligacionesAdicionalesClase;
      this.comentariosAdicionales = data.comentariosAdicionales;
      this.comentariosAdicionalesTexto = data.comentariosAdicionalesTexto;
      this.metadataDerechosEspecialesClase = [...(data.metadataDerechosEspecialesClase || [])];
      this.metadataObligacionesClase = [...(data.metadataObligacionesClase || [])];
    },

    addDerechosEspecialesClaseMetadata(metadata: FileMetadataDTO) {
      this.metadataDerechosEspecialesClase.push(metadata);
    },

    removeDerechosEspecialesClaseMetadata(fileId: string) {
      const index = this.metadataDerechosEspecialesClase.findIndex((m) => m.fileId === fileId);
      if (index !== -1) {
        this.metadataDerechosEspecialesClase.splice(index, 1);
      }
    },

    addObligacionesClaseMetadata(metadata: FileMetadataDTO) {
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

export interface ClasesAccionesState {
  nombreClaseAccion: string;
  cantidadAccionesClase: number;
  conDerechoVoto: boolean;
  redimiblesClase: boolean;
  otrosDerechosEspecialesClase: boolean;
  obligacionesAdicionalesClase: boolean;
  comentariosAdicionales: boolean;
  comentariosAdicionalesTexto: string;
  metadataDerechosEspecialesClase: FileMetadataDTO[];
  metadataObligacionesClase: FileMetadataDTO[];
}

type State = ClasesAccionesState;
