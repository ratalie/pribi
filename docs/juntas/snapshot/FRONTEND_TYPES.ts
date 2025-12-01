/**
 * ============================================
 * TIPOS PARA FRONTEND - SNAPSHOT COMPLETO
 * ============================================
 * 
 * Copia este archivo a tu proyecto frontend y úsalo para tipar las respuestas
 * del endpoint /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete
 */

// ============================================
// TIPOS DE PERSONA
// ============================================

export type PersonType = 
  | 'NATURAL' 
  | 'JURIDICA' 
  | 'SUCURSAL' 
  | 'FONDO_INVERSION' 
  | 'FIDEICOMISO' 
  | 'SUCESION_INDIVISA';

export interface PersonaNatural {
  id: string;
  tipo: 'NATURAL';
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  tipoDocumento: string;
  numeroDocumento: string;
  paisEmision?: string;
}

export interface PersonaJuridica {
  id: string;
  tipo: 'JURIDICA';
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  direccion: string;
  constituida: boolean;
  nombreComercial?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  pais?: string;
}

export interface PersonaSucursal {
  id: string;
  tipo: 'SUCURSAL';
  ruc: string;
  nombreSucursal: string;
  partidaRegistral: string;
  oficinaRegistrada: string;
  direccionFiscal: string;
  representante?: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  };
}

export interface PersonaFondoInversion {
  id: string;
  tipo: 'FONDO_INVERSION';
  ruc: string;
  razonSocial: string;
  direccion: string;
  tipoFondo: string;
  representante?: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  };
  fiduciario?: {
    ruc: string;
    razonSocial: string;
  };
}

export interface PersonaFideicomiso {
  id: string;
  tipo: 'FIDEICOMISO';
  tieneRuc: boolean;
  ruc?: string;
  razonSocial?: string;
  numeroRegistroFideicomiso: string;
  partidaRegistral: string;
  oficinaRegistrada: string;
  direccionFiscal: string;
  representante?: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  };
  fiduciario?: {
    ruc: string;
    razonSocial: string;
  };
}

export interface PersonaSucesionIndivisa {
  id: string;
  tipo: 'SUCESION_INDIVISA';
  ruc: string;
  razonSocial: string;
  distrito: string;
  provincia: string;
  departamento: string;
  direccion: string;
  representante?: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  };
}

export type Persona = 
  | PersonaNatural 
  | PersonaJuridica 
  | PersonaSucursal 
  | PersonaFondoInversion 
  | PersonaFideicomiso 
  | PersonaSucesionIndivisa;

// ============================================
// ACCIONISTAS
// ============================================

export interface Shareholder {
  id: string;
  person: Persona;
}

// ============================================
// CLASES DE ACCIONES
// ============================================

export type AccionType = 'COMUN' | 'CLASE' | 'PREFERENTE_NO_VOTO';

export interface ArchivoAccion {
  archivoId: string;
  version: string;
  tipoMino: string;
  nombreOriginal: string;
  tamaño: number;
}

export interface Accion {
  id: string;
  tipo: AccionType;
  nombre?: string;
  cantidadSuscrita: number;
  redimible: boolean;
  conDerechoVoto: boolean;
  archivoOtrosDerechos?: ArchivoAccion[];
  archivoObligaciones?: ArchivoAccion[];
  comentariosAdicionales?: string;
}

// ============================================
// ASIGNACIONES DE ACCIONES
// ============================================

export interface AsignacionAccion {
  id: string;
  accionId: string;
  accionistaId: string;
  cantidadSuscrita: number;
  precioPorAccion: number;
  porcentajePagadoPorAccion: number;
  totalDividendosPendientes: number;
  pagadoCompletamente: boolean;
  fechaCreacion: string; // ISO Date string
  fechaActualizacion: string; // ISO Date string
}

// ============================================
// DIRECTORIO
// ============================================

export interface Directorio {
  cantidadDirectores?: number;
  conteoPersonalizado: boolean;
  minimoDirectores?: number;
  maximoDirectores?: number;
  inicioMandato?: string | null; // ISO Date string
  finMandato?: string | null; // ISO Date string
  quorumMinimo?: number;
  mayoria?: number;
  presidenteDesignado: boolean;
  secretarioAsignado: boolean;
  reeleccionPermitida: boolean;
  presidentePreside: boolean;
  presidenteDesempata: boolean;
  periodo?: string;
  presidenteId?: string;
}

export interface Director {
  id: string;
  persona: {
    id: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    tipoDocumento: string;
    numeroDocumento: string;
    paisEmision?: string;
  };
  rolDirector: string;
  reemplazaId?: string;
}

// ============================================
// APODERADOS
// ============================================

export interface Apoderado {
  id: string;
  claseApoderadoId: string;
  persona: PersonaNatural | PersonaJuridica; // Solo NATURAL o JURIDICA
  poderId: string | null;
}

// ============================================
// PODERES
// ============================================

export interface Poder {
  id: string;
  name: string;
  fileId?: string;
}

export interface FirmantePoder {
  id: string;
  attorneyClassId: string;
  membersQuantity: number;
}

export interface ReglaMonetaria {
  id: string;
  currencyType: string;
  fromAmount: number;
  limitType: string;
  toAmount?: number;
  signatureType: string;
  signers?: FirmantePoder[];
}

export interface OtorgamientoPoder {
  id: string;
  powerId: string;
  signatureRulesEnabled: boolean;
  monetaryRules?: ReglaMonetaria[];
}

export interface RegimenPoderes {
  id: string;
  powers: Poder[];
  powerGrants: OtorgamientoPoder[];
}

// ============================================
// QUORUMS
// ============================================

export interface Quorum {
  primeraConvocatoriaSimple: number;
  primeraConvocatoriaCalificada: number;
  segundaConvocatoriaSimple: number;
  segundaConvocatoriaCalificada: number;
  quorumMinimoSimple: number;
  quorumMinimoCalificado: number;
}

// ============================================
// ACUERDOS SOCIETARIOS
// ============================================

export interface ArchivoAcuerdo {
  versions: Array<{
    fileId: string;
    mimeType: string;
    originalName: string;
    size: number;
  }>;
}

export interface AcuerdoEspecial {
  derechoPreferencia: boolean;
  archivoEstatutos: ArchivoAcuerdo | null;
  archivoAccionistas: ArchivoAcuerdo | null;
  archivoTerceros: ArchivoAcuerdo | null;
}

// ============================================
// CONFIGURACIÓN DE JUNTA
// ============================================

export interface MeetingConfig {
  id: string;
  meetingType: string;
  isAnnualMandatory: boolean;
}

// ============================================
// INFORMACIÓN DEL FLUJO
// ============================================

export interface FlowInfo {
  flowStructureId: number;
  currentStep: string;
  statusProgression: string;
}

// ============================================
// SNAPSHOT COMPLETO (RESPUESTA PRINCIPAL)
// ============================================

export interface SnapshotComplete {
  // IDs del snapshot
  shareholderId: string;
  nominalValueId: string;
  shareAllocationId: string;
  meetingConfigId: string;
  directoryId?: string;
  attorneyRegistryId?: string;
  powerRegimenId?: string;
  quorumId?: string;
  specialAgreementsId?: string;

  // Valor nominal
  nominalValue: number;

  // Clases de acciones
  shareClasses: Accion[];

  // Accionistas
  shareholders: Shareholder[];

  // Asignaciones de acciones
  shareAllocations: AsignacionAccion[];

  // Directorio
  directory?: Directorio | null;
  directors?: Director[];

  // Apoderados
  attorneys?: Apoderado[];

  // Poderes
  powers?: RegimenPoderes | null;

  // Quorums
  quorums?: Quorum | null;

  // Acuerdos Societarios
  specialAgreements?: AcuerdoEspecial | null;

  // Configuración de junta
  meetingConfig: MeetingConfig;

  // Información del flujo
  flowInfo: FlowInfo;
}

// ============================================
// RESPUESTA DE LA API
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  code: number;
}

export type SnapshotCompleteResponse = ApiResponse<SnapshotComplete>;

// ============================================
// TYPE GUARDS (Helpers)
// ============================================

export function isPersonaNatural(person: Persona): person is PersonaNatural {
  return person.tipo === 'NATURAL';
}

export function isPersonaJuridica(person: Persona): person is PersonaJuridica {
  return person.tipo === 'JURIDICA';
}

export function isPersonaSucursal(person: Persona): person is PersonaSucursal {
  return person.tipo === 'SUCURSAL';
}

export function isPersonaFondoInversion(person: Persona): person is PersonaFondoInversion {
  return person.tipo === 'FONDO_INVERSION';
}

export function isPersonaFideicomiso(person: Persona): person is PersonaFideicomiso {
  return person.tipo === 'FIDEICOMISO';
}

export function isPersonaSucesionIndivisa(person: Persona): person is PersonaSucesionIndivisa {
  return person.tipo === 'SUCESION_INDIVISA';
}

