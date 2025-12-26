/**
 * Datos completos del acta de una junta
 * Incluye todos los puntos de agenda
 */
export interface ActaJunta {
  encabezado: {
    tipoJunta: "GENERAL" | "UNIVERSAL";
    ciudad: string;
    hora: string;
    fecha: string;
    razonSocial: string;
    ruc: string;
  };

  instalacion: {
    asistencia: Array<{
      nombre: string;
      documento: string;
      acciones: number;
    }>;
    presidente: string;
    secretario: string;
    quorum: {
      porcentaje: number;
      cumple: string; // "cumple" | "no cumple"
    };
  };

  puntosAcuerdo: Array<{
    numero: number;
    titulo: string;
    datos: any; // Datos específicos del punto (varía según tipo)
    votacion: {
      porcentaje_aprobacion: number;
      accionistas_afavor: Array<{
        nombre: string;
        acciones: number;
      }>;
      accionistas_contra: Array<{
        nombre: string;
        acciones: number;
      }>;
    };
  }>;

  firmas: {
    presidente: string;
    secretario: string;
  };
}

