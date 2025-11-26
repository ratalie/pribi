import type { GenerateFileUrlRequestDTO } from "../../application/dtos/generate-url-request.dto";
import type { GenerateFileUrlResponseDTO } from "../../application/dtos/generate-url-response.dto";
import type { UploadFileRequestDTO } from "../../application/dtos/upload-file-request.dto";
import type { UploadFileResponseDTO } from "../../application/dtos/upload-file-response.dto";

/**
 * Puerto (contrato) para el repositorio de almacenamiento de archivos.
 * Define las operaciones disponibles sin especificar la implementación.
 */
export interface FileStorageRepository {
  /**
   * Sube un archivo a AWS S3 y devuelve la respuesta del servidor.
   * @param societyProfileId ID del perfil de sociedad
   * @param file Archivo a subir
   * @returns Respuesta con información del archivo subido
   */
  uploadFile(
    societyProfileId: string,
    file: UploadFileRequestDTO
  ): Promise<UploadFileResponseDTO>;

  /**
   * Genera URLs para uno o más archivos existentes.
   * @param societyProfileId ID del perfil de sociedad
   * @param request Datos con los fileId y versiones de los archivos
   * @returns Respuesta con las URLs generadas
   */
  generateFileUrl(
    societyProfileId: string,
    request: GenerateFileUrlRequestDTO
  ): Promise<GenerateFileUrlResponseDTO>;
}
