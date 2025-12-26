/**
 * DTOs para los detalles de la junta (Meeting Details)
 */

// ============================================
// DTOs DE ENTRADA (Request - PUT)
// ============================================

export interface ConvocatoriaDto {
  direccion: string; // Dirección física si es IN_PERSON, o link si es VIRTUAL
  modo: 'IN_PERSON' | 'VIRTUAL';  // ⚠️ Mismo formato que el backend
  fecha: string; // ISO Date string (ej: "2025-01-15T00:00:00.000Z")
  hora: string; // ISO Date string (ej: "2025-01-15T14:00:00.000Z")
}

export interface DetallesJuntaDto {
  tipoJunta: 'JUNTA_UNIVERSAL' | 'JUNTA_GENERAL';
  esAnualObligatoria: boolean;
  primeraConvocatoria?: ConvocatoriaDto;
  segundaConvocatoria?: ConvocatoriaDto;
  instaladaEnConvocatoria: 'PRIMERA' | 'SEGUNDA';
  presidenteId?: string;
  secretarioId?: string;
  presidenteAsistio: boolean;
  secretarioAsistio: boolean;
  nombreOtroPresidente?: string;
  nombreOtroSecretario?: string;
  juntaNombrada?: boolean;
  nombreJunta?: string;
}

// ============================================
// DTOs DE SALIDA (Response - GET)
// ============================================

export interface MeetingCallDto {
  address: string;
  mode: 'IN_PERSON' | 'VIRTUAL';
  date: string; // ISO Date string
  time: string; // ISO Date string
}

export interface GeneralMeetingConfigDto {
  id: string;
  meetingType: 'JUNTA_UNIVERSAL' | 'JUNTA_GENERAL';
  isAnnualMandatory: boolean;
  firstCall?: MeetingCallDto;
  secondCall?: MeetingCallDto;
  heldAtCall?: 'FIRST' | 'SECOND';
  // ✅ Backend puede devolver string O { value: string }
  presidentId?: string | { value: string };
  secretaryId?: string | { value: string };
  presidentAttended: boolean;
  secretaryAttended: boolean;
  otherPresidentName?: string;
  otherSecretaryName?: string;
  juntaNombrada: boolean;
  nombreJunta?: string;
}

