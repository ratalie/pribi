import type { DirectoryConfigurationRepository } from "~/core/hexag/juntas/domain/ports/directory-configuration.repository";
import type { DirectoryConfigurationResponseDTO } from "../../dtos/directory-configuration.dto";

/**
 * Use Case para obtener la configuración de directorio del snapshot
 */
export class GetDirectoryConfigurationUseCase {
  constructor(private readonly repository: DirectoryConfigurationRepository) {}

  async execute(
    societyId: number,
    flowId: number
  ): Promise<DirectoryConfigurationResponseDTO> {
    return await this.repository.get(societyId, flowId);
  }
}



