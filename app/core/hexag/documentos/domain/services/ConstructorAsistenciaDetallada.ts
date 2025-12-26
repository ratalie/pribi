/**
 * Servicio de Dominio: ConstructorAsistenciaDetallada
 *
 * Responsabilidades:
 * - Construir texto detallado de asistencia con desglose de acciones
 * - Manejar diferentes tipos de acciones (comunes, preferentes, clases)
 * - Filtrar solo acciones con derecho a voto
 * - Formatear según tipo de accionista (natural, jurídica, con/sin representante)
 *
 * Este servicio construye las variables detalladas de asistencia que se usan
 * en el template del acta.
 */

import type { SnapshotCompleteDTO } from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";

export interface AccionistaDetallado {
  id: string;
  nombre: string;
  tipo: "NATURAL" | "JURIDICA";
  documento: string;
  tipoDocumento: string;
  representante: {
    nombre: string;
    tipoDocumento: string;
    numeroDocumento: string;
  } | null;
  acciones: {
    comunes?: number;
    preferentesConDerechoVoto?: number;
    preferentesSinDerechoVoto?: number;
    clases?: Array<{
      id: string;
      nombre: string;
      cantidad: number;
    }>;
    totalConDerechoVoto: number;
  };
  valorNominal: number;
  textoAsistencia: string;
  tipoTexto:
    | "natural_propio"
    | "natural_representado"
    | "juridica_representada"
    | "interviniente_natural"
    | "interviniente_juridica";
}

export class ConstructorAsistenciaDetallada {
  /**
   * Construir texto detallado de asistencia para un accionista
   * @param accionista - Datos del accionista
   * @param snapshot - Snapshot completo para obtener detalles de acciones
   * @returns Texto formateado de asistencia
   */
  construirTextoAsistencia(accionista: any, snapshot: SnapshotCompleteDTO | null): string {
    const shareAllocations = snapshot?.shareAllocations || [];
    const shareClasses = snapshot?.shareClasses || [];
    const valorNominal = snapshot?.nominalValue || 1;

    // Obtener asignaciones de este accionista
    const asignaciones = shareAllocations.filter(
      (asig: any) => asig.accionistaId === accionista.id
    );

    // Agrupar por tipo de acción
    const accionesComunes: number[] = [];
    const accionesPreferentesSinVoto: number[] = [];
    const accionesPorClase = new Map<string, { nombre: string; cantidad: number }>();

    asignaciones.forEach((asig: any) => {
      const shareClass = shareClasses.find((sc: any) => sc.id === asig.accionId);
      if (!shareClass) return;

      const cantidad = asig.cantidadSuscrita || 0;

      if (shareClass.tipo === "COMUN") {
        accionesComunes.push(cantidad);
      } else if (shareClass.tipo === "PREFERENTE_NO_VOTO") {
        // Preferentes sin derecho a voto no se cuentan en el total
        accionesPreferentesSinVoto.push(cantidad);
      } else if (shareClass.tipo === "CLASE" && shareClass.conDerechoVoto) {
        // Solo clases con derecho a voto
        const claseId = shareClass.id;
        const existente = accionesPorClase.get(claseId);
        if (existente) {
          existente.cantidad += cantidad;
        } else {
          accionesPorClase.set(claseId, {
            nombre: shareClass.nombre || "Sin nombre",
            cantidad,
          });
        }
      }
    });

    // Construir texto de acciones
    const textosAcciones: string[] = [];

    // Solo acciones con derecho a voto
    const totalComunes = accionesComunes.reduce((sum, c) => sum + c, 0);
    if (totalComunes > 0) {
      textosAcciones.push(`${totalComunes} comunes`);
    }

    // Clases con derecho a voto
    accionesPorClase.forEach((clase) => {
      if (clase.cantidad > 0) {
        textosAcciones.push(`${clase.cantidad} de clase ${clase.nombre}`);
      }
    });

    const textoAcciones = textosAcciones.length > 0 ? textosAcciones.join(", ") : "0 acciones";

    // Construir texto completo según tipo de accionista
    const esPersonaNatural = accionista.tipo === "NATURAL";
    const tieneRepresentante = !!accionista.representante;

    if (esPersonaNatural && !tieneRepresentante) {
      // Persona natural por derecho propio
      return `${
        accionista.nombre
      }, titular de ${textoAcciones} con derecho a voto representativas del capital social de la Sociedad, de un valor nominal de S/ ${valorNominal.toFixed(
        2
      )}, íntegramente suscritas y pagadas, quien actúa por derecho propio.`;
    } else if (esPersonaNatural && tieneRepresentante) {
      // Persona natural representada
      const repre = accionista.representante;
      return `${
        accionista.nombre
      }, titular de ${textoAcciones} con derecho a voto representativas del capital social de la Sociedad, de un valor nominal de S/ ${valorNominal.toFixed(
        2
      )}, íntegramente suscritas y pagadas, quien actúa a través de ${
        repre.nombre
      }, quien cuenta con ${repre.tipoDocumento} No. ${
        repre.numeroDocumento
      }, según poder que se acreditó, leyó y archivó.`;
    } else if (!esPersonaNatural && tieneRepresentante) {
      // Persona jurídica representada
      const repre = accionista.representante;
      return `${
        accionista.nombre
      }, titular de ${textoAcciones} con derecho a voto representativas del capital social de la Sociedad, de un valor nominal de S/ ${valorNominal.toFixed(
        2
      )}, íntegramente suscritas y pagadas, quien actúa a través de ${
        repre.nombre
      }, quien cuenta con ${repre.tipoDocumento} No. ${
        repre.numeroDocumento
      }, según poder que se acreditó, leyó y archivó.`;
    } else {
      // Fallback
      return `${
        accionista.nombre
      }, titular de ${textoAcciones} con derecho a voto representativas del capital social de la Sociedad, de un valor nominal de S/ ${valorNominal.toFixed(
        2
      )}, íntegramente suscritas y pagadas.`;
    }
  }

  /**
   * Construir texto para interviniente (no accionista)
   */
  construirTextoInterviniente(interviniente: any): string {
    const esPersonaNatural = interviniente.tipo === "NATURAL";
    const tieneRepresentante = !!interviniente.representante;

    if (esPersonaNatural && !tieneRepresentante) {
      return `Asimismo, participa en calidad de interviniente, ${interviniente.nombre}, quien cuenta con ${interviniente.tipoDocumento} No. ${interviniente.documento} y actúa por derecho propio.`;
    } else if (!esPersonaNatural && tieneRepresentante) {
      const repre = interviniente.representante;
      return `Asimismo, participa en calidad de interviniente, ${interviniente.nombre}, quien actúa a través de ${repre.nombre}, quien cuenta con ${repre.tipoDocumento} No. ${repre.numeroDocumento}, según poder que obra en archivos.`;
    } else {
      return `Asimismo, participa en calidad de interviniente, ${interviniente.nombre}.`;
    }
  }

  /**
   * Construir lista completa de asistencia detallada
   * @param asistentes - Lista de accionistas asistentes
   * @param snapshot - Snapshot completo
   * @returns Array de textos de asistencia detallados
   */
  construirListaAsistenciaDetallada(
    asistentes: any[],
    snapshot: SnapshotCompleteDTO | null
  ): Array<{ texto_asistencia: string; tipo: string }> {
    return asistentes.map((accionista) => {
      const texto = this.construirTextoAsistencia(accionista, snapshot);
      return {
        texto_asistencia: texto,
        tipo: accionista.tipo === "NATURAL" ? "natural" : "juridica",
      };
    });
  }

  /**
   * Calcular total de acciones con derecho a voto presentes
   * @param asistentes - Lista de accionistas asistentes
   * @param snapshot - Snapshot completo
   * @returns Total de acciones con derecho a voto
   */
  calcularTotalAccionesConDerechoVoto(
    asistentes: any[],
    snapshot: SnapshotCompleteDTO | null
  ): number {
    const shareAllocations = snapshot?.shareAllocations || [];
    const shareClasses = snapshot?.shareClasses || [];

    let total = 0;

    asistentes.forEach((accionista) => {
      const asignaciones = shareAllocations.filter(
        (asig: any) => asig.accionistaId === accionista.id
      );

      asignaciones.forEach((asig: any) => {
        const shareClass = shareClasses.find((sc: any) => sc.id === asig.accionId);
        if (!shareClass) return;

        // Solo contar acciones con derecho a voto
        if (
          shareClass.tipo === "COMUN" ||
          (shareClass.tipo === "CLASE" && shareClass.conDerechoVoto)
        ) {
          total += asig.cantidadSuscrita || 0;
        }
      });
    });

    return total;
  }
}
