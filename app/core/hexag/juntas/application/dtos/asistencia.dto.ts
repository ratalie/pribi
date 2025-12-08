import type { Shareholder } from "./snapshot-complete.dto";

/**
 * DTO para actualizar un registro de asistencia (PUT Request)
 * Basado en: FRONTEND_ATTENDANCE_GUIDE.md + REPRESENTANTES-IMPLEMENTACION-COMPLETA.md
 */
export interface RegistroAsistenciaDto {
  /** UUID del registro de asistencia a actualizar */
  id: string;

  /** Si el accionista asistió */
  attended: boolean;

  /** UUID del accionista que lo representa (opcional) - Opción 1 */
  representedById?: string;

  /** Datos completos del representante (opcional) - Opción 2 (NUEVO) */
  representante?: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  };

  /** Si este accionista está representando a otro */
  isRepresentative: boolean;
}

/**
 * DTO de respuesta al obtener asistencia (GET Response)
 * Basado en: FRONTEND_ATTENDANCE_GUIDE.md
 */
export interface AsistenciaJuntaQueryDto {
  /** UUID del registro de asistencia */
  id: string;

  /** UUID del meetingConfigId (del snapshot) */
  configJuntaId: string;

  /** Datos del accionista (del snapshot) */
  accionista: Shareholder;

  /** Cantidad de acciones con derecho a voto (snapshot) */
  accionesConDerechoVoto: number;

  /** Porcentaje de participación (0-100) */
  porcentajeParticipacion: number;

  /** Si asistió a la junta */
  asistio: boolean;

  /** UUID del accionista que lo representa (legacy, puede ser null) */
  representadoPorId: string | null;

  /** Si está representando a otro accionista */
  esRepresentante: boolean;

  /** Datos completos del representante (NUEVO - objeto completo) */
  representante: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string | null;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string | null;
  } | null;
}
