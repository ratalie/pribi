import type { RepositorioDocumentosRepository } from "../../domain/ports/repositorio-documentos.repository";

/**
 * Use Case: Verificar Documento Duplicado
 * 
 * Verifica si un documento con un nombre específico ya existe en una carpeta
 */
export class VerificarDocumentoDuplicadoUseCase {
  constructor(
    private readonly repositorio: RepositorioDocumentosRepository
  ) {}

  async execute(
    structureId: string,
    folderId: number,
    fileName: string
  ): Promise<{
    exists: boolean;
    document: {
      versionCode: string;
      documentCode: string;
      title: string;
      latestVersion: {
        versionCode: string;
        versionNumber: number;
        createdAt: string;
        sizeInBytes: number;
      };
      node: {
        id: number;
        code: string;
        name: string;
        path: string;
      };
    } | null;
  }> {
    if (!structureId || !folderId || !fileName) {
      throw new Error("Se requiere structureId, folderId y fileName para verificar duplicados");
    }

    if (fileName.trim() === "") {
      throw new Error("El nombre del archivo no puede estar vacío");
    }

    console.log("🔍 [VerificarDocumentoDuplicado] Verificando duplicado:", {
      structureId,
      folderId,
      fileName,
    });

    const resultado = await this.repositorio.verificarDocumentoDuplicado(
      structureId,
      folderId,
      fileName
    );

    console.log("🔍 [VerificarDocumentoDuplicado] Resultado:", {
      exists: resultado.exists,
      documentCode: resultado.document?.documentCode || null,
    });

    return resultado;
  }
}

