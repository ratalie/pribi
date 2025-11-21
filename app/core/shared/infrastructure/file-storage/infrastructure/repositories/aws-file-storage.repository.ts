import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import type { GenerateFileUrlRequestDTO } from "../../application/dtos/generate-url-request.dto";
import type { GenerateFileUrlResponseDTO } from "../../application/dtos/generate-url-response.dto";
import type { UploadFileRequestDTO } from "../../application/dtos/upload-file-request.dto";
import type { UploadFileResponseDTO } from "../../application/dtos/upload-file-response.dto";
import type { FileStorageRepository } from "../../domain/ports/file-storage.repository";

/**
 * Implementación del repositorio de almacenamiento de archivos usando AWS S3.
 */
export class AwsFileStorageRepository implements FileStorageRepository {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    const config = useRuntimeConfig();
    this.baseUrl = baseUrl ?? (config.public?.apiBase as string) ?? "";
  }

  /**
   * Sube un archivo a AWS S3 mediante POST con FormData.
   */
  async uploadFile(
    societyProfileId: string,
    file: UploadFileRequestDTO
  ): Promise<UploadFileResponseDTO> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await $fetch<UploadFileResponseDTO>(
      `${this.baseUrl}/society-profile/${societyProfileId}/files`,
      {
        ...withAuthHeaders(),
        method: "POST",
        body: formData,
      }
    );

    return response;
  }

  /**
   * Genera URLs para uno o más archivos existentes mediante POST con JSON.
   */
  async generateFileUrl(
    societyProfileId: string,
    request: GenerateFileUrlRequestDTO
  ): Promise<GenerateFileUrlResponseDTO> {
    const response = await $fetch<GenerateFileUrlResponseDTO>(
      `${this.baseUrl}/society-profile/${societyProfileId}/files/generate-url`,
      {
        ...withAuthHeaders(),
        method: "POST",
        body: request,
      }
    );

    return response;
  }
}
