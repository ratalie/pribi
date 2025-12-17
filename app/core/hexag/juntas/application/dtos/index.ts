export type {
  CreateCreditCapitalizationDTO,
  CreditCapitalizationActionResponse,
  CreditCapitalizationCreateResponse,
  CreditCapitalizationListResponse,
  CreditCapitalizationResponseDTO,
  UpdateCreditCapitalizationDTO,
} from "./credit-capitalization.dto";
export type {
  CreateCreditorDTO,
  CreditorActionResponse,
  CreditorCreateResponse,
  CreditorListResponse,
  CreditorResponseDTO,
  UpdateCreditorDTO,
} from "./creditor.dto";
export type { JuntaResumenDTO } from "./junta-resumen.dto";
export type {
  ConvocatoriaDto,
  DetallesJuntaDto,
  GeneralMeetingConfigDto,
  MeetingCallDto,
} from "./meeting-details.dto";
export type {
  CreateRemovalAttorneyDTO,
  RemovalAttorneyActionResponse,
  RemovalAttorneyListResponse,
  RemovalAttorneyResponseDTO,
  UpdateRemovalAttorneyDTO,
} from "./removal-attorney.dto";
export type {
  CreateDesignationAttorneyDTO,
  DesignationAttorneyActionResponse,
  DesignationAttorneyListResponse,
  DesignationAttorneyResponseDTO,
  PersonJuridicDTO,
  PersonNaturalDTO,
  UpdateDesignationAttorneyDTO,
} from "./designation-attorney.dto";
export type { RemovalManagerResponseDTO } from "./removal-manager.dto";
export {
  isPersonaFideicomiso,
  isPersonaFondoInversion,
  isPersonaJuridica,
  isPersonaNatural,
  isPersonaSucesionIndivisa,
  isPersonaSucursal,
} from "./snapshot-complete.dto";
export type {
  Accion,
  AcuerdoEspecial,
  Apoderado,
  AsignacionAccion,
  Director,
  Directorio,
  FlowInfo,
  MeetingConfig,
  Persona,
  PersonaFideicomiso,
  PersonaFondoInversion,
  PersonaJuridica,
  PersonaNatural,
  PersonaSucesionIndivisa,
  PersonaSucursal,
  Quorum,
  RegimenPoderes,
  Shareholder,
  SnapshotCompleteDTO,
} from "./snapshot-complete.dto";
