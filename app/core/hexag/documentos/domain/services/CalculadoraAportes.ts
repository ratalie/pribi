/**
 * Servicio de Dominio: CalculadoraAportes
 * 
 * Responsabilidades:
 * - Calcular capital social desde aportes
 * - Calcular prima desde aportes
 * - Calcular reserva desde aportes
 * - Calcular monto total de aportes
 * - Calcular incremento de capital
 * - Calcular capital social antes/después
 * - Calcular acciones antes/después
 * 
 * Este servicio encapsula toda la lógica de cálculo financiero
 * relacionada con aportes dinerarios.
 */

import type { SnapshotCompleteDTO } from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";
import { FormateadorTexto } from "./FormateadorTexto";

export interface AporteData {
  contributionAmountInBaseCurrency: number;
  socialCapital: number;
  premium: number;
  reserve: number;
  sharesToReceive: number;
  shareClass?: {
    id: string;
    type: string;
  };
}

export class CalculadoraAportes {
  constructor(private readonly formateador: FormateadorTexto = new FormateadorTexto()) {}

  /**
   * Calcula el capital social total desde un array de aportes
   * @param aportes - Array de aportes
   * @returns Capital social total
   */
  calcularCapitalSocialDesdeAportes(aportes: AporteData[]): number {
    return aportes.reduce((sum, aporte) => sum + (aporte.socialCapital || 0), 0);
  }

  /**
   * Calcula la prima total desde un array de aportes
   * @param aportes - Array de aportes
   * @returns Prima total
   */
  calcularPrimaDesdeAportes(aportes: AporteData[]): number {
    return aportes.reduce((sum, aporte) => sum + (aporte.premium || 0), 0);
  }

  /**
   * Calcula la reserva total desde un array de aportes
   * @param aportes - Array de aportes
   * @returns Reserva total
   */
  calcularReservaDesdeAportes(aportes: AporteData[]): number {
    return aportes.reduce((sum, aporte) => sum + (aporte.reserve || 0), 0);
  }

  /**
   * Calcula el monto total de aportes (capital + prima + reserva)
   * @param aportes - Array de aportes
   * @returns Monto total
   */
  calcularMontoTotal(aportes: AporteData[]): number {
    const capital = this.calcularCapitalSocialDesdeAportes(aportes);
    const prima = this.calcularPrimaDesdeAportes(aportes);
    const reserva = this.calcularReservaDesdeAportes(aportes);
    return capital + prima + reserva;
  }

  /**
   * Calcula el incremento de capital
   * @param capitalAntes - Capital social antes
   * @param capitalDespues - Capital social después
   * @returns Incremento de capital
   */
  calcularIncrementoCapital(capitalAntes: number, capitalDespues: number): number {
    return capitalDespues - capitalAntes;
  }

  /**
   * Calcula el capital social antes del aporte desde el snapshot
   * @param snapshot - Snapshot completo
   * @returns Capital social antes
   */
  calcularCapitalSocialAntes(snapshot: SnapshotCompleteDTO | null): number {
    if (!snapshot) return 0;
    const valorNominal = snapshot.nominalValue || 0;
    const shareAllocations = snapshot.shareAllocations || [];
    return shareAllocations.reduce((sum, asig) => {
      return sum + valorNominal * (asig.cantidadSuscrita || 0);
    }, 0);
  }

  /**
   * Calcula el capital social después del aporte
   * @param snapshot - Snapshot completo
   * @param aportes - Array de aportes
   * @returns Capital social después
   */
  calcularCapitalSocialDespues(
    snapshot: SnapshotCompleteDTO | null,
    aportes: AporteData[]
  ): number {
    const capitalAntes = this.calcularCapitalSocialAntes(snapshot);
    const capitalAportes = this.calcularCapitalSocialDesdeAportes(aportes);
    return capitalAntes + capitalAportes;
  }

  /**
   * Calcula el total de acciones antes del aporte desde el snapshot
   * @param snapshot - Snapshot completo
   * @returns Total de acciones antes
   */
  calcularAccionesAntes(snapshot: SnapshotCompleteDTO | null): number {
    if (!snapshot) return 0;
    const shareAllocations = snapshot.shareAllocations || [];
    return shareAllocations.reduce((sum, asig) => sum + (asig.cantidadSuscrita || 0), 0);
  }

  /**
   * Calcula el total de acciones después del aporte
   * @param snapshot - Snapshot completo
   * @param aportes - Array de aportes
   * @returns Total de acciones después
   */
  calcularAccionesDespues(snapshot: SnapshotCompleteDTO | null, aportes: AporteData[]): number {
    const accionesAntes = this.calcularAccionesAntes(snapshot);
    const accionesAportes = aportes.reduce((sum, aporte) => sum + (aporte.sharesToReceive || 0), 0);
    return accionesAntes + accionesAportes;
  }

  /**
   * Calcula el número de acciones incrementadas
   * @param aportes - Array de aportes
   * @returns Número de acciones incrementadas
   */
  calcularNumeroDeAccionesIncrementadas(aportes: AporteData[]): number {
    return aportes.reduce((sum, aporte) => sum + (aporte.sharesToReceive || 0), 0);
  }

  /**
   * Calcula todos los valores relacionados con aportes desde datos formateados
   * Útil cuando los datos vienen del backend con strings formateados
   * @param aportantesData - Array de aportantes con aportes formateados
   * @returns Objeto con todos los totales calculados
   */
  calcularTotalesDesdeAportantesFormateados(aportantesData: Array<{
    aportes: Array<{
      capital_social: string;
      prima: string;
      reserva: string;
      cantidad_acciones: string;
    }>;
  }>): {
    sumaCapitalSocial: number;
    sumaPrimaTotal: number;
    sumaReserva: number;
    sumaTotalAcciones: number;
  } {
    const sumaCapitalSocial = aportantesData.reduce(
      (sum: number, a: any) =>
        sum +
        a.aportes.reduce(
          (s: number, ap: any) => s + this.formateador.parseFormattedNumber(ap.capital_social),
          0
        ),
      0
    );

    const sumaPrimaTotal = aportantesData.reduce(
      (sum: number, a: any) =>
        sum +
        a.aportes.reduce(
          (s: number, ap: any) => s + this.formateador.parseFormattedNumber(ap.prima),
          0
        ),
      0
    );

    const sumaReserva = aportantesData.reduce(
      (sum: number, a: any) =>
        sum +
        a.aportes.reduce(
          (s: number, ap: any) => s + this.formateador.parseFormattedNumber(ap.reserva),
          0
        ),
      0
    );

    const sumaTotalAcciones = aportantesData.reduce(
      (sum: number, a: any) =>
        sum +
        a.aportes.reduce(
          (s: number, ap: any) => s + this.formateador.parseFormattedInteger(ap.cantidad_acciones),
          0
        ),
      0
    );

    return {
      sumaCapitalSocial,
      sumaPrimaTotal,
      sumaReserva,
      sumaTotalAcciones,
    };
  }
}


