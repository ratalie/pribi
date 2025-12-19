import type { DirectoryConfigurationRepository } from "~/core/hexag/juntas/domain/ports/directory-configuration.repository";
import type { UpdateDirectoryConfigurationDTO } from "../../dtos/directory-configuration.dto";

/**
 * Use Case para actualizar la configuración de directorio del snapshot
 *
 * ⚠️ IMPORTANTE: Todos los campos son opcionales - Solo se envían los campos que se necesiten actualizar
 */
export class UpdateDirectoryConfigurationUseCase {
  constructor(private readonly repository: DirectoryConfigurationRepository) {}

  async execute(
    societyId: number,
    flowId: number,
    dto: UpdateDirectoryConfigurationDTO
  ): Promise<void> {
    await this.repository.update(societyId, flowId, dto);
  }
}

