import { defineStore } from "pinia";

/**
 * Store temporal para datos de nombramiento de gerente
 *
 * Almacena temporalmente los datos del gerente propuesto
 * para que estén disponibles en votación y resumen
 */
export const useNombramientoGerenteStore = defineStore("nombramientoGerente", {
  state: () => ({
    gerenteNombrado: null as {
      nombreCompleto: string;
      tipoPersona: "natural" | "juridica";
      personaNatural: {
        tipoDocumento: string;
        numeroDocumento: string;
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string;
        paisPasaporte?: string;
      } | null;
      personaJuridica: {
        seConstituyoEnPeru: boolean;
        tipoDocumento: string;
        numeroDocumento: string;
        razonSocial: string;
        nombreComercial?: string;
        direccion: string;
        distrito?: string;
        provincia?: string;
        departamento?: string;
        paisOrigen?: string;
        tieneRepresentante: boolean;
      } | null;
      representante?: {
        tipoDocumento: string;
        numeroDocumento: string;
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string;
        paisPasaporte?: string;
      } | null;
    } | null,
  }),

  getters: {
    /**
     * Obtener nombre completo del gerente nombrado
     */
    nombreCompletoGerente(): string {
      if (!this.gerenteNombrado) return "";
      return this.gerenteNombrado.nombreCompleto;
    },

    /**
     * Verificar si hay un gerente nombrado
     */
    tieneGerenteNombrado(): boolean {
      return this.gerenteNombrado !== null;
    },
  },

  actions: {
    /**
     * Guardar datos del gerente nombrado
     */
    setGerenteNombrado(data: {
      tipoPersona: "natural" | "juridica";
      personaNatural: {
        tipoDocumento: string;
        numeroDocumento: string;
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string;
        paisPasaporte?: string;
      } | null;
      personaJuridica: {
        seConstituyoEnPeru: boolean;
        tipoDocumento: string;
        numeroDocumento: string;
        razonSocial: string;
        nombreComercial?: string;
        direccion: string;
        distrito?: string;
        provincia?: string;
        departamento?: string;
        paisOrigen?: string;
        tieneRepresentante: boolean;
      } | null;
      representante?: {
        tipoDocumento: string;
        numeroDocumento: string;
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string;
        paisPasaporte?: string;
      } | null;
    }) {
      // Calcular nombre completo según el tipo de persona
      let nombreCompleto = "";

      if (data.tipoPersona === "natural" && data.personaNatural) {
        nombreCompleto = `${data.personaNatural.nombre} ${
          data.personaNatural.apellidoPaterno
        } ${data.personaNatural.apellidoMaterno || ""}`.trim();
      } else if (data.tipoPersona === "juridica" && data.personaJuridica) {
        nombreCompleto = data.personaJuridica.razonSocial;
      }

      this.gerenteNombrado = {
        nombreCompleto,
        tipoPersona: data.tipoPersona,
        personaNatural: data.personaNatural,
        personaJuridica: data.personaJuridica,
        representante: data.representante || null,
      };
    },

    /**
     * Limpiar datos del gerente nombrado
     */
    clearGerenteNombrado() {
      this.gerenteNombrado = null;
    },
  },
});
