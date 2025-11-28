import type { FileStorageRepository } from "../../domain/ports/file-storage.repository";
import type { UploadFileRequestDTO } from "../dtos/upload-file-request.dto";
import type { UploadFileResponseDTO } from "../dtos/upload-file-response.dto";

/**
 * Caso de uso para subir un archivo a AWS S3.
 */
export class UploadFileUseCase {
  constructor(private readonly fileStorageRepository: FileStorageRepository) {}

  /**
   * Ejecuta la subida de un archivo.
   * @param societyProfileId ID del perfil de sociedad
   * @param file Archivo a subir
   * @returns Respuesta con información del archivo subido
   */
  async execute(
    societyProfileId: string,
    file: UploadFileRequestDTO
  ): Promise<UploadFileResponseDTO> {
    return this.fileStorageRepository.uploadFile(societyProfileId, file);
  }
}
