import type { AcuerdoSocietario } from "../../domain/entities/acuerdo-societario.entity";
import type { AcuerdosSocietariosRepository } from "../../domain/ports/acuerdos-societarios.repository";
import type { AcuerdoSocietarioDTO } from "../dtos/acuerdo-societario.dto";

/**
 * Caso de uso para crear los acuerdos societarios de una sociedad.
 */
export class CreateAcuerdosSocietariosUseCase {
  constructor(private readonly repository: AcuerdosSocietariosRepository) {}

  /**
   * Ejecuta la creación de acuerdos societarios.
   * @param profileId ID del perfil de sociedad
   * @param payload Datos de los acuerdos societarios
   * @returns Acuerdos societarios creados
   */
  async execute(profileId: string, payload: AcuerdoSocietarioDTO): Promise<AcuerdoSocietario> {
    return this.repository.create(profileId, payload);
  }
}

