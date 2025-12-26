import { defineStore } from "pinia";

/**
 * Interface para metadata de archivo
 * Compatible con FileMetadataResponseDTO de FileUploadMultipleWithMetadata
 */
export interface FileMetadata {
  archivoId: string;
  tipoMino: string;
  nombreOriginal: string;
  tamaño: number;
  version: number;
}

/**
 * Interface para Estado Financiero
 */
export interface EstadoFinanciero {
  id: number | string;
  nombre: string;
  enabled: boolean; // Switch para mostrar/ocultar y controlar archivos
  archivos: FileMetadata[];
  isDefault?: boolean;
}

/**
 * Store para Pronunciamiento y Gestión Social
 * 
 * Maneja:
 * - Memoria Anual (archivos)
 * - Estados Financieros (lista dinámica con archivos)
 * 
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 */
export const usePronunciamientoStore = defineStore("pronunciamiento", {
  // ✅ PERSISTENCIA: Guardar en localStorage
  persist: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    key: "probo-pronunciamiento",
  },

  state: () => ({
    // Memoria Anual
    memoriaAnual: {
      enabled: false,
      archivos: [] as FileMetadata[],
    },

    // Estados Financieros por defecto
    estadosFinancieros: [
      {
        id: 1,
        nombre: "Balance General",
        enabled: false,
        archivos: [] as FileMetadata[],
        isDefault: true,
      },
      {
        id: 2,
        nombre: "Estado de Resultados",
        enabled: false,
        archivos: [] as FileMetadata[],
        isDefault: true,
      },
    ] as EstadoFinanciero[],
  }),

  getters: {
    /**
     * Valida que se pueda avanzar al siguiente paso
     * - Memoria Anual debe tener archivos si está habilitada
     * - Todos los estados financieros habilitados deben tener archivos
     */
    validateNextPath(): boolean {
      // Si memoria anual está habilitada, debe tener archivos
      if (this.memoriaAnual.enabled && this.memoriaAnual.archivos.length === 0) {
        return false;
      }

      // Todos los estados financieros habilitados deben tener archivos
      const estadosHabilitados = this.estadosFinancieros.filter(
        (estado) => estado.enabled && estado.archivos.length > 0
      );

      // Si hay estados financieros habilitados, deben tener archivos
      const estadosHabilitadosSinArchivos = this.estadosFinancieros.filter(
        (estado) => estado.enabled && estado.archivos.length === 0
      );

      if (estadosHabilitadosSinArchivos.length > 0) {
        return false;
      }

      return true;
    },

    /**
     * Obtiene el total de archivos subidos
     */
    totalArchivos(): number {
      const memoriaArchivos = this.memoriaAnual.enabled ? this.memoriaAnual.archivos.length : 0;
      const estadosArchivos = this.estadosFinancieros
        .filter((estado) => estado.enabled)
        .reduce((sum, estado) => sum + estado.archivos.length, 0);
      return memoriaArchivos + estadosArchivos;
    },
  },

  actions: {
    /**
     * Habilitar/deshabilitar memoria anual
     */
    toggleMemoriaAnual() {
      this.memoriaAnual.enabled = !this.memoriaAnual.enabled;
      // Si se deshabilita, limpiar archivos
      if (!this.memoriaAnual.enabled) {
        this.memoriaAnual.archivos = [];
      }
    },

    /**
     * Agregar archivo a memoria anual
     */
    addArchivoMemoriaAnual(metadata: FileMetadata) {
      // Verificar que no esté duplicado
      const existe = this.memoriaAnual.archivos.some(
        (archivo) => archivo.archivoId === metadata.archivoId
      );
      if (!existe) {
        // ✅ Usar spread para garantizar reactividad
        this.memoriaAnual.archivos = [...this.memoriaAnual.archivos, metadata];
        console.log("✅ [Store] Archivo agregado a memoria anual:", {
          archivoId: metadata.archivoId,
          totalArchivos: this.memoriaAnual.archivos.length,
        });
      }
    },

    /**
     * Eliminar archivo de memoria anual
     */
    removeArchivoMemoriaAnual(fileId: string) {
      // ✅ Usar filter para garantizar reactividad
      this.memoriaAnual.archivos = this.memoriaAnual.archivos.filter(
        (archivo) => archivo.archivoId !== fileId
      );
      console.log("🗑️ [Store] Archivo eliminado de memoria anual:", {
        fileId,
        totalArchivos: this.memoriaAnual.archivos.length,
      });
    },

    /**
     * Agregar nuevo estado financiero
     */
    addEstadoFinanciero(nombre: string) {
      const nuevoId = Math.max(...this.estadosFinancieros.map((e) => Number(e.id)), 0) + 1;
      const nuevoEstado: EstadoFinanciero = {
        id: nuevoId,
        nombre: nombre.trim(),
        enabled: false,
        archivos: [],
        isDefault: false,
      };
      this.estadosFinancieros.push(nuevoEstado);
    },

    /**
     * Toggle habilitar/deshabilitar estado financiero
     * Si se desactiva, borra los archivos
     */
    toggleEstadoFinanciero(id: number | string) {
      const estado = this.estadosFinancieros.find((e) => e.id === id);
      if (estado) {
        estado.enabled = !estado.enabled;
        // Si se desactiva, limpiar archivos
        if (!estado.enabled) {
          estado.archivos = [];
        }
      }
    },

    /**
     * Eliminar estado financiero (solo si no es por defecto)
     */
    deleteEstadoFinanciero(id: number | string) {
      const estado = this.estadosFinancieros.find((e) => e.id === id);
      if (estado && !estado.isDefault) {
        const index = this.estadosFinancieros.findIndex((e) => e.id === id);
        if (index !== -1) {
          this.estadosFinancieros.splice(index, 1);
        }
      }
    },

    /**
     * Agregar archivo a un estado financiero
     */
    addArchivoEstadoFinanciero(estadoId: number | string, metadata: FileMetadata) {
      const estado = this.estadosFinancieros.find((e) => e.id === estadoId);
      if (estado) {
        // Verificar que no esté duplicado
        const existe = estado.archivos.some(
          (archivo) => archivo.archivoId === metadata.archivoId
        );
        if (!existe) {
          // ✅ Usar spread para garantizar reactividad
          estado.archivos = [...estado.archivos, metadata];
          console.log("✅ [Store] Archivo agregado a estado financiero:", {
            estadoId,
            estadoNombre: estado.nombre,
            archivoId: metadata.archivoId,
            totalArchivos: estado.archivos.length,
          });
        } else {
          console.warn("⚠️ [Store] Archivo ya existe en estado financiero:", {
            estadoId,
            archivoId: metadata.archivoId,
          });
        }
      } else {
        console.error("❌ [Store] Estado financiero no encontrado:", estadoId);
      }
    },

    /**
     * Eliminar archivo de un estado financiero
     */
    removeArchivoEstadoFinanciero(estadoId: number | string, fileId: string) {
      const estado = this.estadosFinancieros.find((e) => e.id === estadoId);
      if (estado) {
        // ✅ Usar filter para garantizar reactividad
        estado.archivos = estado.archivos.filter((archivo) => archivo.archivoId !== fileId);
        console.log("🗑️ [Store] Archivo eliminado de estado financiero:", {
          estadoId,
          estadoNombre: estado.nombre,
          fileId,
          totalArchivos: estado.archivos.length,
        });
      }
    },

    /**
     * Resetear el store
     */
    reset() {
      this.memoriaAnual = {
        enabled: false,
        archivos: [],
      };
      this.estadosFinancieros = [
        {
          id: 1,
          nombre: "Balance General",
          enabled: false,
          archivos: [],
          isDefault: true,
        },
        {
          id: 2,
          nombre: "Estado de Resultados",
          enabled: false,
          archivos: [],
          isDefault: true,
        },
      ];
    },
  },
});

