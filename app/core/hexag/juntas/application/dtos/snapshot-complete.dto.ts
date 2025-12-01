/**
 * DTO para Snapshot Completo de Junta
 * 
 * Representa todos los datos replicados de la sociedad cuando se crea una junta.
 * Este snapshot contiene toda la información necesaria para construir los pasos de la junta.
 * 
 * @see docs/juntas/snapshot/FRONTEND_TYPES.ts para tipos completos
 */

// Tipos de Persona
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

// Accionistas
export interface Shareholder {
  id: string;
  person: Persona;
}

// Clases de Acciones
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

// Asignaciones de Acciones
export interface AsignacionAccion {
  id: string;
  accionId: string;
  accionistaId: string;
  cantidadSuscrita: number;
  precioPorAccion: number;
  porcentajePagadoPorAccion: number;
  totalDividendosPendientes: number;
  pagadoCompletamente: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// Directorio
export interface Directorio {
  cantidadDirectores?: number;
  conteoPersonalizado: boolean;
  minimoDirectores?: number;
  maximoDirectores?: number;
  inicioMandato?: string | null;
  finMandato?: string | null;
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

// Apoderados
export interface Apoderado {
  id: string;
  claseApoderadoId: string;
  persona: PersonaNatural | PersonaJuridica;
  poderId: string | null;
}

// Poderes
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

// Quorums
export interface Quorum {
  primeraConvocatoriaSimple: number;
  primeraConvocatoriaCalificada: number;
  segundaConvocatoriaSimple: number;
  segundaConvocatoriaCalificada: number;
  quorumMinimoSimple: number;
  quorumMinimoCalificado: number;
}

// Acuerdos Societarios
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

// Configuración de Junta
export interface MeetingConfig {
  id: string;
  meetingType: string;
  isAnnualMandatory: boolean;
}

// Información del Flujo
export interface FlowInfo {
  flowStructureId: number;
  currentStep: string;
  statusProgression: string;
}

// Snapshot Completo (DTO Principal)
export interface SnapshotCompleteDTO {
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

// Type Guards
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

