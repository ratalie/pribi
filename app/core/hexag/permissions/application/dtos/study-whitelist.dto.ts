/**
 * DTO para la whitelist de módulos del estudio
 * 
 * Representa los módulos habilitados para un estudio.
 * Solo disponible para SuperAdmin.
 */
export interface StudyWhitelistDto {
  /** ID del estudio */
  studyId: string;
  
  /** Lista de módulos habilitados */
  modules: string[];
}






