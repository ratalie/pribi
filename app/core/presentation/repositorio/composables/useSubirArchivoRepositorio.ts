import { ref } from "vue";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
import type { RepositorioNode } from "~/core/hexag/repositorio/domain/entities/repositorio-node.entity";

/**
 * Composable para subir archivos al repositorio
 * 
 * Endpoint: POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/documents
 */
export function useSubirArchivoRepositorio() {
  const isUploading = ref(false);
  const errorMessage = ref<string | null>(null);

  /**
   * Sube un archivo a una carpeta del repositorio
   * 
   * @param structureId ID de la estructura de la sociedad
   * @param parentNodeId ID del nodo padre (carpeta destino)
   * @param file Archivo a subir
   * @returns Nodo creado del documento subido
   */
  const subirArchivo = async (
    structureId: string,
    parentNodeId: number,
    file: File
  ): Promise<RepositorioNode> => {
    console.log("🟣 [useSubirArchivoRepositorio] ========================================");
    console.log("🟣 [useSubirArchivoRepositorio] SUBIR ARCHIVO");
    console.log("🟣 [useSubirArchivoRepositorio] ========================================");
    console.log("🟣 [useSubirArchivoRepositorio] structureId:", structureId);
    console.log("🟣 [useSubirArchivoRepositorio] parentNodeId:", parentNodeId);
    console.log("🟣 [useSubirArchivoRepositorio] fileName:", file.name);
    console.log("🟣 [useSubirArchivoRepositorio] fileSize:", file.size);

    isUploading.value = true;
    errorMessage.value = null;

    try {
      const repository = new RepositorioDocumentosHttpRepository();
      const documento = await repository.subirArchivo(
        structureId,
        parentNodeId.toString(),
        file
      );

      console.log("✅ [useSubirArchivoRepositorio] Archivo subido exitosamente:", {
        id: documento.id,
        name: documento.name,
      });
      console.log("🟣 [useSubirArchivoRepositorio] ========================================");

      return documento;
    } catch (error: any) {
      console.error("🔴 [useSubirArchivoRepositorio] ========================================");
      console.error("🔴 [useSubirArchivoRepositorio] ERROR AL SUBIR ARCHIVO:");
      console.error("🔴 [useSubirArchivoRepositorio] Error completo:", error);
      console.error("🔴 [useSubirArchivoRepositorio] ========================================");

      const message = error?.message || "Error al subir el archivo";
      errorMessage.value = message;
      throw error;
    } finally {
      isUploading.value = false;
    }
  };

  /**
   * Sube múltiples archivos a una carpeta del repositorio
   * 
   * @param structureId ID de la estructura de la sociedad
   * @param parentNodeId ID del nodo padre (carpeta destino)
   * @param files Lista de archivos a subir
   * @returns Lista de nodos creados
   */
  const subirMultiplesArchivos = async (
    structureId: string,
    parentNodeId: number,
    files: File[]
  ): Promise<RepositorioNode[]> => {
    console.log("🟣 [useSubirArchivoRepositorio] ========================================");
    console.log("🟣 [useSubirArchivoRepositorio] SUBIR MÚLTIPLES ARCHIVOS");
    console.log("🟣 [useSubirArchivoRepositorio] ========================================");
    console.log("🟣 [useSubirArchivoRepositorio] structureId:", structureId);
    console.log("🟣 [useSubirArchivoRepositorio] parentNodeId:", parentNodeId);
    console.log("🟣 [useSubirArchivoRepositorio] filesCount:", files.length);

    isUploading.value = true;
    errorMessage.value = null;

    try {
      const repository = new RepositorioDocumentosHttpRepository();
      const documentos = await repository.subirMultiplesArchivos(
        structureId,
        parentNodeId.toString(),
        files
      );

      console.log("✅ [useSubirArchivoRepositorio] Archivos subidos exitosamente:", {
        count: documentos.length,
        documentos: documentos.map((d) => ({ id: d.id, name: d.name })),
      });
      console.log("🟣 [useSubirArchivoRepositorio] ========================================");

      return documentos;
    } catch (error: any) {
      console.error("🔴 [useSubirArchivoRepositorio] ========================================");
      console.error("🔴 [useSubirArchivoRepositorio] ERROR AL SUBIR ARCHIVOS:");
      console.error("🔴 [useSubirArchivoRepositorio] Error completo:", error);
      console.error("🔴 [useSubirArchivoRepositorio] ========================================");

      const message = error?.message || "Error al subir los archivos";
      errorMessage.value = message;
      throw error;
    } finally {
      isUploading.value = false;
    }
  };

  return {
    isUploading,
    errorMessage,
    subirArchivo,
    subirMultiplesArchivos,
  };
}


