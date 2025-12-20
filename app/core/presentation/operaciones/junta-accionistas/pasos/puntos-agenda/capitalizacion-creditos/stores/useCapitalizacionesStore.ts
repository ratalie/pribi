import { defineStore } from "pinia";

/**
 * Store para el formulario de capitalización
 * Similar a useAportesStore pero con comprobantePagoArchivoId REQUERIDO
 */
export const useCapitalizacionesStore = defineStore("capitalizacionesForm", {
  state: () => ({
    // Campos básicos
    tipoMoneda: "PEN" as "PEN" | "USD",
    monto: 0,
    fechaContribucion: "",
    tasaCambio: 1.0,
    montoConvertido: 0,

    // Detalles de acciones
    accionId: "", // ID de la acción (UUID)
    accionesPorRecibir: 0,
    precioPorAccion: 0,

    // Pago del Capital Social
    pagadoCompletamente: true, // Por defecto en true (SI)
    porcentajePagado: 0,
    totalPasivo: 0,
    capitalSocial: 0,
    premium: 0,
    reserva: 0,

    // Comprobante (OPCIONAL)
    comprobantePagoArchivoId: "",
    comprobantePagoFile: null as File | null,
  }),

  actions: {
    // Método para obtener todos los datos del formulario
    getFormData() {
      return {
        tipoMoneda: this.tipoMoneda,
        monto: this.monto,
        fechaContribucion: this.fechaContribucion,
        tasaCambio: this.tasaCambio,
        montoConvertido: this.montoConvertido,
        accionId: this.accionId,
        accionesPorRecibir: this.accionesPorRecibir,
        precioPorAccion: this.precioPorAccion,
        pagadoCompletamente: this.pagadoCompletamente,
        porcentajePagado: this.porcentajePagado,
        totalPasivo: this.totalPasivo,
        capitalSocial: this.capitalSocial,
        premium: this.premium,
        reserva: this.reserva,
        comprobantePagoArchivoId: this.comprobantePagoArchivoId, // ✅ OPCIONAL
      };
    },
  },
});

