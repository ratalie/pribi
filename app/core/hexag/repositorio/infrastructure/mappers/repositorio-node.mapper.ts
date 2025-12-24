import type { RepositorioNode } from "../../domain/entities/repositorio-node.entity";
import type { RepositorioNodeDTO } from "../../application/dtos/repositorio-node.dto";

/**
 * Mapper para convertir DTOs del backend a entidades del dominio
 * 
 * Responsabilidad: Transformar datos del backend (DTO) a entidades de dominio
 * Ubicación: Infrastructure (según arquitectura hexagonal)
 */
export class RepositorioNodeMapper {
  /**
   * Infiere el MIME type desde la extensión del archivo
   */
  private static inferMimeTypeFromFileName(fileName: string): string | undefined {
    const extension = fileName.toLowerCase().split(".").pop();
    
    const mimeTypes: Record<string, string> = {
      "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "doc": "application/msword",
      "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "xls": "application/vnd.ms-excel",
      "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "ppt": "application/vnd.ms-powerpoint",
      "pdf": "application/pdf",
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg",
      "png": "image/png",
      "gif": "image/gif",
      "txt": "text/plain",
    };
    
    return mimeTypes[extension || ""];
  }

  /**
   * Convierte un DTO a una entidad del dominio
   */
  static toEntity(dto: RepositorioNodeDTO): RepositorioNode {
    // Si no hay mimeType y es un documento, intentar inferirlo desde el nombre
    let mimeType = dto.mimeType;
    if (!mimeType && dto.type === 0 && dto.name) {
      mimeType = RepositorioNodeMapper.inferMimeTypeFromFileName(dto.name);
      if (mimeType) {
        console.log("🟡 [RepositorioNodeMapper] MIME type inferido desde nombre:", {
          fileName: dto.name,
          inferredMimeType: mimeType,
        });
      }
    }
    
    const result: RepositorioNode = {
      id: String(dto.id),
      code: dto.code,
      societyId: String(dto.societyId),
      parentId: dto.parentId ? String(dto.parentId) : null,
      name: dto.name,
      type: dto.type === 1 ? "folder" : "document", // 0 = documento, 1 = carpeta
      path: dto.path,
      description: dto.description,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      isCore: dto.isCore,
      children: dto.children?.map(RepositorioNodeMapper.toEntity),
      mimeType: mimeType,
      sizeInBytes: dto.sizeInBytes,
      // Mapear documentVersions del backend a versions de la entidad
      versions: dto.documentVersions
        ? dto.documentVersions.map((v) => ({
            versionCode: v.versionCode,
            documentCode: v.documentCode || "",
            createdAt: v.createdAt,
            updatedAt: v.updatedAt,
            userId: v.userId ?? null,
            userIdV2: v.userIdV2 ?? null,
            userName: v.userName ?? null,
          }))
        : dto.versions?.map((v) => ({
            versionCode: v.versionCode,
            documentCode: v.documentCode || "",
            createdAt: v.createdAt,
            updatedAt: v.updatedAt,
            userId: null,
            userIdV2: null,
            userName: null,
          })),
    };
    
    // Log para debugging
    if (dto.type === 0 && !result.versions) {
      console.warn("⚠️ [RepositorioNodeMapper] Documento sin versiones:", {
        id: dto.id,
        name: dto.name,
        hasDocumentVersions: Boolean(dto.documentVersions),
        hasVersions: Boolean(dto.versions),
      });
    }
    
    if (dto.type === 0 && !result.mimeType) {
      console.warn("⚠️ [RepositorioNodeMapper] Documento sin mimeType:", {
        id: dto.id,
        name: dto.name,
        originalMimeType: dto.mimeType,
      });
    }
    
    return result;
  }

  /**
   * Alias para toEntity (compatibilidad)
   */
  static fromDto(dto: RepositorioNodeDTO): RepositorioNode {
    return RepositorioNodeMapper.toEntity(dto);
  }

  /**
   * Convierte un array de DTOs a entidades del dominio
   */
  static toEntities(dtos: RepositorioNodeDTO[]): RepositorioNode[] {
    return dtos.map(RepositorioNodeMapper.toEntity);
  }
}

