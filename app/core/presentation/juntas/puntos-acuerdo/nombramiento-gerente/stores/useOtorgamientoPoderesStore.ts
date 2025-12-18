import { defineStore } from "pinia";
import type { ApoderadoFacultadRow } from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/types/apoderadosFacultades";

/**
 * Store simple para almacenar los poderes/facultades del gerente nombrado
 * ⚠️ IMPORTANTE: Usa persistencia en localStorage para mantener datos entre navegaciones
 */
export const useOtorgamientoPoderesStore = defineStore("otorgamientoPoderes", {
  // ✅ PERSISTENCIA: Guardar en localStorage
  persist: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    key: "probo-otorgamiento-poderes-gerente",
  },

  state: () => ({
    apoderadosFacultades: [] as ApoderadoFacultadRow[],
  }),

  getters: {
    /**
     * Obtener las facultades del gerente (primer apoderado, si existe)
     */
    facultadesGerente(): ApoderadoFacultadRow["facultades"] {
      if (this.apoderadosFacultades.length === 0) return [];
      return this.apoderadosFacultades[0].facultades || [];
    },

    /**
     * Verificar si hay poderes registrados
     */
    tienePoderes(): boolean {
      return this.apoderadosFacultades.length > 0 && this.facultadesGerente.length > 0;
    },
  },

  actions: {
    /**
     * Establecer las facultades del gerente
     */
    setApoderadosFacultades(apoderados: ApoderadoFacultadRow[]) {
      this.apoderadosFacultades = apoderados;
    },

    /**
     * Limpiar el store
     */
    clearPoderes() {
      this.apoderadosFacultades = [];
    },
  },
});
