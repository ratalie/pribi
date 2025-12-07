import { defineStore } from "pinia";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useAportesManagerStore } from "../../aportes/stores/useAportesManagerStore";
import type { Aporte } from "../../aportes/stores/useAportesManagerStore";

/**
 * Store para datos calculados de votación de aportes dinerarios
 * 
 * Calcula:
 * - Capital antes y después
 * - Acciones antes y después
 * - Texto de votación dinámico
 */
export const useVotacionAportesStore = defineStore("votacionAportes", {
  state: () => ({
    // Datos calculados
    capitalAntes: 0,
    accionesAntes: 0,
    capitalDespues: 0,
    accionesDespues: 0,
    montoTotalAportes: 0,
    accionesNuevas: 0,
    valorNominal: 0,
  }),

  getters: {
    /**
     * Calcula todos los datos necesarios para la votación
     */
    datosCalculados() {
      const snapshotStore = useSnapshotStore();
      const aportesStore = useAportesManagerStore();

      if (!snapshotStore.snapshot) {
        return {
          capitalAntes: 0,
          accionesAntes: 0,
          capitalDespues: 0,
          accionesDespues: 0,
          montoTotalAportes: 0,
          accionesNuevas: 0,
          valorNominal: 0,
        };
      }

      // Calcular capital antes (del snapshot)
      const asignaciones = snapshotStore.snapshot.shareAllocations;
      const valorNominal = snapshotStore.snapshot.nominalValue;
      
      // Sumar todas las acciones asignadas
      const accionesAntes = asignaciones.reduce(
        (sum, asig) => sum + asig.cantidadSuscrita,
        0
      );
      
      // Capital antes = acciones × valor nominal
      const capitalAntes = accionesAntes * valorNominal;

      // Calcular datos de aportes
      const aportes = aportesStore.aportes;
      
      // Monto total de aportes (en soles)
      const montoTotalAportes = aportes.reduce(
        (sum, a) => sum + (a.montoConvertido || a.monto),
        0
      );
      
      // Total de acciones nuevas a emitir
      const accionesNuevas = aportes.reduce(
        (sum, a) => sum + a.accionesPorRecibir,
        0
      );
      
      // Valor nominal (tomar el primero, generalmente todos tienen el mismo)
      const valorNominalAporte = aportes[0]?.precioPorAccion || valorNominal;

      // Capital después = capital antes + monto total de aportes
      const capitalDespues = capitalAntes + montoTotalAportes;
      
      // Acciones después = acciones antes + acciones nuevas
      const accionesDespues = accionesAntes + accionesNuevas;

      return {
        capitalAntes,
        accionesAntes,
        capitalDespues,
        accionesDespues,
        montoTotalAportes,
        accionesNuevas,
        valorNominal: valorNominalAporte,
      };
    },

    /**
     * Genera el texto de votación dinámicamente
     */
    textoVotacion(): string {
      const datos = this.datosCalculados;
      
      if (datos.montoTotalAportes === 0 || datos.accionesNuevas === 0) {
        return "Se aprueba el aumento de capital mediante aportes dinerarios.";
      }

      return `Se aprueba el aumento de capital POR S/${datos.montoTotalAportes.toFixed(2)} soles, vía aporte dinerario, mediante la emisión de ${datos.accionesNuevas} acciones con un valor nominal de S/${datos.valorNominal.toFixed(2)}, haciendo que el capital aumente de S/${datos.capitalAntes.toFixed(2)} (${datos.accionesAntes} acciones) a S/${datos.capitalDespues.toFixed(2)} (${datos.accionesDespues} acciones)`;
    },
  },

  actions: {
    /**
     * Actualiza los datos calculados
     * Se llama automáticamente cuando cambian los aportes o el snapshot
     */
    actualizarDatos() {
      const datos = this.datosCalculados;
      this.capitalAntes = datos.capitalAntes;
      this.accionesAntes = datos.accionesAntes;
      this.capitalDespues = datos.capitalDespues;
      this.accionesDespues = datos.accionesDespues;
      this.montoTotalAportes = datos.montoTotalAportes;
      this.accionesNuevas = datos.accionesNuevas;
      this.valorNominal = datos.valorNominal;
    },
  },
});


