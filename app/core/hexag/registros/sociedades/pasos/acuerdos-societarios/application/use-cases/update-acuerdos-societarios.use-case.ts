import type { AcuerdoSocietario } from "../../domain/entities/acuerdo-societario.entity";
import type { AcuerdosSocietariosRepository } from "../../domain/ports/acuerdos-societarios.repository";
import type { AcuerdoSocietarioDTO } from "../dtos/acuerdo-societario.dto";

/**
 * Caso de uso para actualizar los acuerdos societarios de una sociedad.
 */
export class UpdateAcuerdosSocietariosUseCase {
  constructor(private readonly repository: AcuerdosSocietariosRepository) {}

  /**
   * Ejecuta la actualización de acuerdos societarios.
   * @param profileId ID del perfil de sociedad
   * @param payload Datos actualizados de los acuerdos societarios
   * @returns Acuerdos societarios actualizados
   */
  async execute(profileId: string, payload: AcuerdoSocietarioDTO): Promise<AcuerdoSocietario> {
    return this.repository.update(profileId, payload);
  }
}
