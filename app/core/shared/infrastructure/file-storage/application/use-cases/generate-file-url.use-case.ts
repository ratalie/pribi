import type { FileStorageRepository } from "../../domain/ports/file-storage.repository";
import type { GenerateFileUrlRequestDTO } from "../dtos/generate-url-request.dto";
import type { GenerateFileUrlResponseDTO } from "../dtos/generate-url-response.dto";

/**
 * Caso de uso para generar URLs de archivos existentes.
 */
export class GenerateFileUrlUseCase {
  constructor(private readonly fileStorageRepository: FileStorageRepository) {}

  /**
   * Ejecuta la generación de URLs para uno o más archivos.
   * @param societyProfileId ID del perfil de sociedad
   * @param request Datos con los fileId y versiones de los archivos
   * @returns Respuesta con las URLs generadas
   */
  async execute(
    societyProfileId: string,
    request: GenerateFileUrlRequestDTO
  ): Promise<GenerateFileUrlResponseDTO> {
    return this.fileStorageRepository.generateFileUrl(societyProfileId, request);
  }
}
