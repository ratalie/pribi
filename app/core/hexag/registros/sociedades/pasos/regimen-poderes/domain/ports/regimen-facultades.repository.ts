import type {
  CreateOtorgamientoPoderPayload,
  TipoFacultad,
  TipoFacultadPayload,
  UpdateOtorgamientoPoderPayload,
} from "..";

export interface RegimenFacultadesRepository {
  listTipoFacultades(profileId: string): Promise<TipoFacultad[]>;
  createTipoFacultad(profileId: string, payload: TipoFacultadPayload): Promise<void>;
  updateTipoFacultad(profileId: string, payload: TipoFacultadPayload): Promise<void>;
  deleteTipoFacultad(profileId: string, ids: string[]): Promise<void>;

  /**
   * Crea un nuevo otorgamiento de poder.
   * @param profileId ID del perfil de la sociedad
   * @param payload Payload con los datos del otorgamiento de poder a crear
   */
  createOtorgamientoPoder(
    profileId: string,
    payload: CreateOtorgamientoPoderPayload
  ): Promise<void>;

  /**
   * Actualiza un otorgamiento de poder existente usando el patrón de acciones.
   * @param profileId ID del perfil de la sociedad
   * @param payload Payload con las acciones a realizar (add, update, remove, updateSigners)
   */
  updateOtorgamientoPoder(
    profileId: string,
    payload: UpdateOtorgamientoPoderPayload
  ): Promise<void>;
}
