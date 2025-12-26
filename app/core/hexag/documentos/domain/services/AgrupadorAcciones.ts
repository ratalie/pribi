/**
 * Servicio de Dominio: AgrupadorAcciones
 * 
 * Responsabilidades:
 * - Agrupar acciones por tipo (comunes, preferentes, clases)
 * - Filtrar acciones con derecho a voto
 * - Calcular distribuciones antes/después del aporte
 * - Formatear distribuciones para templates
 * 
 * Este servicio encapsula toda la lógica de agrupación y distribución
 * de acciones relacionada con aportes dinerarios.
 */

import type { SnapshotCompleteDTO } from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";
import { FormateadorTexto } from "./FormateadorTexto";

export interface DistribucionAccionesRaw {
  comunes: {
    cantidad: number;
    capitalSocial: number;
    prima: number;
    reserva: number;
    dividendoPasivo: number;
  };
  preferenteSinDerechoVoto: {
    cantidad: number;
    capitalSocial: number;
    prima: number;
    reserva: number;
    dividendoPasivo: number;
  };
  clases: Array<{
    id: string;
    nombre: string;
    cantidad: number;
    capitalSocial: number;
    prima: number;
    reserva: number;
    dividendoPasivo: number;
    conDerechoVoto: boolean;
  }>;
}

export interface DistribucionAccionesFormateada {
  comunes: {
    cantidad: number;
    cantidadTexto: string;
    capitalSocial: number;
    capitalSocialTexto: string;
    prima: number;
    primaTexto: string;
    reserva: number;
    reservaTexto: string;
    dividendoPasivo: number;
    dividendoPasivoTexto: string;
    valorNominal: number;
    valorNominalTexto: string;
  };
  preferenteSinDerechoVoto: {
    cantidad: number;
    cantidadTexto: string;
    capitalSocial: number;
    capitalSocialTexto: string;
    prima: number;
    primaTexto: string;
    reserva: number;
    reservaTexto: string;
    dividendoPasivo: number;
    dividendoPasivoTexto: string;
    valorNominal: number;
    valorNominalTexto: string;
  };
  clases: Array<{
    id: string;
    nombre: string;
    cantidad: number;
    cantidadTexto: string;
    capitalSocial: number;
    capitalSocialTexto: string;
    prima: number;
    primaTexto: string;
    reserva: number;
    reservaTexto: string;
    dividendoPasivo: number;
    dividendoPasivoTexto: string;
    valorNominal: number;
    valorNominalTexto: string;
    conDerechoVoto: boolean;
  }>;
}

export interface AporteFormateado {
  sharesToReceiveFormatted?: string;
  socialCapitalFormatted?: string;
  premiumFormatted?: string;
  reserveFormatted?: string;
  totalLiabilityFormatted?: string;
  shareClass?: {
    id: string;
    type: string;
  };
}

export class AgrupadorAcciones {
  constructor(private readonly formateador: FormateadorTexto = new FormateadorTexto()) {}

  /**
   * Agrupa acciones por tipo desde shareAllocations y shareClasses
   * @param shareAllocations - Asignaciones de acciones del snapshot
   * @param shareClasses - Clases de acciones del snapshot
   * @param valorNominal - Valor nominal de las acciones
   * @returns Distribución agrupada por tipo
   */
  agruparPorTipo(
    shareAllocations: any[],
    shareClasses: any[],
    valorNominal: number
  ): DistribucionAccionesRaw {
    const comunes = {
      cantidad: 0,
      capitalSocial: 0,
      prima: 0,
      reserva: 0,
      dividendoPasivo: 0,
    };

    const preferenteSinDerechoVoto = {
      cantidad: 0,
      capitalSocial: 0,
      prima: 0,
      reserva: 0,
      dividendoPasivo: 0,
    };

    const clasesMap = new Map<
      string,
      {
        id: string;
        nombre: string;
        cantidad: number;
        capitalSocial: number;
        prima: number;
        reserva: number;
        dividendoPasivo: number;
        conDerechoVoto: boolean;
      }
    >();

    shareAllocations.forEach((asig: any) => {
      const shareClass = shareClasses.find((sc: any) => sc.id === asig.accionId);
      if (!shareClass) return;

      const cantidad = asig.cantidadSuscrita || 0;
      const capitalSocial = valorNominal * cantidad;
      const prima = Math.max(0, ((asig.precioPorAccion || 0) - valorNominal) * cantidad);
      const dividendoPasivo = asig.totalDividendosPendientes || 0;

      if (shareClass.tipo === "COMUN") {
        comunes.cantidad += cantidad;
        comunes.capitalSocial += capitalSocial;
        comunes.prima += prima;
        comunes.dividendoPasivo += dividendoPasivo;
      } else if (shareClass.tipo === "PREFERENTE_NO_VOTO") {
        preferenteSinDerechoVoto.cantidad += cantidad;
        preferenteSinDerechoVoto.capitalSocial += capitalSocial;
        preferenteSinDerechoVoto.prima += prima;
        preferenteSinDerechoVoto.dividendoPasivo += dividendoPasivo;
      } else if (shareClass.tipo === "CLASE") {
        const claseId = shareClass.id;
        if (!clasesMap.has(claseId)) {
          clasesMap.set(claseId, {
            id: claseId,
            nombre: shareClass.nombre || "Sin nombre",
            cantidad: 0,
            capitalSocial: 0,
            prima: 0,
            reserva: 0,
            dividendoPasivo: 0,
            conDerechoVoto: shareClass.conDerechoVoto || false,
          });
        }
        const clase = clasesMap.get(claseId)!;
        clase.cantidad += cantidad;
        clase.capitalSocial += capitalSocial;
        clase.prima += prima;
        clase.dividendoPasivo += dividendoPasivo;
      }
    });

    return {
      comunes,
      preferenteSinDerechoVoto,
      clases: Array.from(clasesMap.values()),
    };
  }

  /**
   * Calcula la distribución antes del aporte desde el snapshot
   * @param snapshot - Snapshot completo
   * @returns Distribución antes del aporte
   */
  calcularDistribucionAntes(snapshot: SnapshotCompleteDTO | null): DistribucionAccionesRaw {
    if (!snapshot) {
      return {
        comunes: {
          cantidad: 0,
          capitalSocial: 0,
          prima: 0,
          reserva: 0,
          dividendoPasivo: 0,
        },
        preferenteSinDerechoVoto: {
          cantidad: 0,
          capitalSocial: 0,
          prima: 0,
          reserva: 0,
          dividendoPasivo: 0,
        },
        clases: [],
      };
    }

    const shareAllocations = snapshot.shareAllocations || [];
    const shareClasses = snapshot.shareClasses || [];
    const valorNominal = snapshot.nominalValue || 0;

    return this.agruparPorTipo(shareAllocations, shareClasses, valorNominal);
  }

  /**
   * Calcula la distribución después del aporte
   * @param snapshot - Snapshot completo
   * @param aportes - Array de aportes formateados
   * @returns Distribución después del aporte
   */
  calcularDistribucionDespues(
    snapshot: SnapshotCompleteDTO | null,
    aportes: AporteFormateado[]
  ): DistribucionAccionesRaw {
    const distribucionAntes = this.calcularDistribucionAntes(snapshot);
    const shareClasses = snapshot?.shareClasses || [];

    const distribucionDespues: DistribucionAccionesRaw = {
      comunes: { ...distribucionAntes.comunes },
      preferenteSinDerechoVoto: { ...distribucionAntes.preferenteSinDerechoVoto },
      clases: distribucionAntes.clases.map((c) => ({ ...c })),
    };

    aportes.forEach((aporte: AporteFormateado) => {
      const shareClass = shareClasses.find((sc: any) => sc.id === aporte.shareClass?.id);
      if (!shareClass) return;

      const cantidad = this.formateador.parseFormattedInteger(
        aporte.sharesToReceiveFormatted || "0"
      );
      const capitalSocial = this.formateador.parseFormattedNumber(
        aporte.socialCapitalFormatted || "0"
      );
      const prima = this.formateador.parseFormattedNumber(aporte.premiumFormatted || "0");
      const reserva = this.formateador.parseFormattedNumber(aporte.reserveFormatted || "0");
      const dividendoPasivo = this.formateador.parseFormattedNumber(
        aporte.totalLiabilityFormatted || "0"
      );

      if (shareClass.tipo === "COMUN") {
        distribucionDespues.comunes.cantidad += cantidad;
        distribucionDespues.comunes.capitalSocial += capitalSocial;
        distribucionDespues.comunes.prima += prima;
        distribucionDespues.comunes.reserva += reserva;
        distribucionDespues.comunes.dividendoPasivo += dividendoPasivo;
      } else if (shareClass.tipo === "PREFERENTE_NO_VOTO") {
        distribucionDespues.preferenteSinDerechoVoto.cantidad += cantidad;
        distribucionDespues.preferenteSinDerechoVoto.capitalSocial += capitalSocial;
        distribucionDespues.preferenteSinDerechoVoto.prima += prima;
        distribucionDespues.preferenteSinDerechoVoto.reserva += reserva;
        distribucionDespues.preferenteSinDerechoVoto.dividendoPasivo += dividendoPasivo;
      } else if (shareClass.tipo === "CLASE") {
        let clase = distribucionDespues.clases.find((c: any) => c.id === shareClass.id);
        if (!clase) {
          clase = {
            id: shareClass.id,
            nombre: shareClass.nombre || "Sin nombre",
            cantidad: 0,
            capitalSocial: 0,
            prima: 0,
            reserva: 0,
            dividendoPasivo: 0,
            conDerechoVoto: shareClass.conDerechoVoto || false,
          };
          distribucionDespues.clases.push(clase);
        }
        clase.cantidad += cantidad;
        clase.capitalSocial += capitalSocial;
        clase.prima += prima;
        clase.reserva += reserva;
        clase.dividendoPasivo += dividendoPasivo;
      }
    });

    return distribucionDespues;
  }

  /**
   * Filtra la distribución para incluir solo acciones con derecho a voto
   * @param distribucion - Distribución completa
   * @param shareClasses - Clases de acciones del snapshot
   * @returns Distribución filtrada (solo con derecho a voto)
   */
  filtrarConDerechoVoto(
    distribucion: DistribucionAccionesRaw,
    shareClasses: any[]
  ): DistribucionAccionesRaw {
    const comunes = {
      cantidad: distribucion.comunes?.cantidad || 0,
      capitalSocial: distribucion.comunes?.capitalSocial || 0,
      prima: distribucion.comunes?.prima || 0,
      reserva: distribucion.comunes?.reserva || 0,
      dividendoPasivo: distribucion.comunes?.dividendoPasivo || 0,
    };

    const clases = (distribucion.clases || []).filter((clase: any) => {
      const shareClass = shareClasses.find((sc: any) => sc.id === clase.id);
      return shareClass?.conDerechoVoto === true;
    });

    return {
      comunes,
      preferenteSinDerechoVoto: {
        cantidad: 0,
        capitalSocial: 0,
        prima: 0,
        reserva: 0,
        dividendoPasivo: 0,
      },
      clases,
    };
  }

  /**
   * Formatea una distribución agregando textos en letras
   * @param distribucion - Distribución raw
   * @param valorNominal - Valor nominal de las acciones
   * @returns Distribución formateada con textos
   */
  formatearDistribucion(
    distribucion: DistribucionAccionesRaw,
    valorNominal: number
  ): DistribucionAccionesFormateada {
    const formatearTipo = (tipo: any) => {
      if (!tipo) {
        return {
          cantidad: 0,
          cantidadTexto: this.formateador.accionesATexto(0),
          capitalSocial: 0,
          capitalSocialTexto: this.formateador.capitalSocialATexto(0),
          prima: 0,
          primaTexto: this.formateador.montoATexto(0),
          reserva: 0,
          reservaTexto: this.formateador.montoATexto(0),
          dividendoPasivo: 0,
          dividendoPasivoTexto: this.formateador.montoATexto(0),
          valorNominal,
          valorNominalTexto: this.formateador.montoATexto(valorNominal),
        };
      }

      return {
        cantidad: tipo.cantidad || 0,
        cantidadTexto: this.formateador.accionesATexto(tipo.cantidad || 0),
        capitalSocial: tipo.capitalSocial || 0,
        capitalSocialTexto: this.formateador.capitalSocialATexto(tipo.capitalSocial || 0),
        prima: tipo.prima || 0,
        primaTexto: this.formateador.montoATexto(tipo.prima || 0),
        reserva: tipo.reserva || 0,
        reservaTexto: this.formateador.montoATexto(tipo.reserva || 0),
        dividendoPasivo: tipo.dividendoPasivo || 0,
        dividendoPasivoTexto: this.formateador.montoATexto(tipo.dividendoPasivo || 0),
        valorNominal,
        valorNominalTexto: this.formateador.montoATexto(valorNominal),
      };
    };

    return {
      comunes: formatearTipo(distribucion.comunes),
      preferenteSinDerechoVoto: formatearTipo(distribucion.preferenteSinDerechoVoto),
      clases: (distribucion.clases || []).map((clase: any) => ({
        ...formatearTipo(clase),
        id: clase.id,
        nombre: clase.nombre,
        conDerechoVoto: clase.conDerechoVoto,
      })),
    };
  }
}


