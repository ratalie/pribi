import { ref } from "vue";
import { VerificarDocumentoDuplicadoUseCase } from "~/core/hexag/repositorio/application/use-cases/verificar-documento-duplicado.use-case";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";

/**
 * Composable para manejar la verificación de documentos duplicados
 * 
 * Funcionalidades:
 * - Verificar si un documento existe en una carpeta
 * - Verificar múltiples documentos en paralelo
 * - Filtrar documentos duplicados
 */
export function useDocumentosDuplicados() {
  const repositorio = new RepositorioDocumentosHttpRepository();
  const useCase = new VerificarDocumentoDuplicadoUseCase(repositorio);

  const isVerificando = ref(false);

  /**
   * Verifica si un documento existe en una carpeta
   */
  const verificarDuplicado = async (
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
  }> => {
    try {
      isVerificando.value = true;
      return await useCase.execute(structureId, folderId, fileName);
    } finally {
      isVerificando.value = false;
    }
  };

  /**
   * Verifica múltiples documentos en paralelo
   */
  const verificarMultiplesDuplicados = async (
    structureId: string,
    folderId: number,
    fileNames: string[]
  ): Promise<Map<string, {
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
  }>> => {
    try {
      isVerificando.value = true;
      const checks = await Promise.all(
        fileNames.map(fileName =>
          verificarDuplicado(structureId, folderId, fileName)
        )
      );

      const result = new Map();
      fileNames.forEach((fileName, index) => {
        result.set(fileName, checks[index]);
      });

      return result;
    } finally {
      isVerificando.value = false;
    }
  };

  /**
   * Verifica y filtra documentos duplicados
   */
  const filtrarDuplicados = async (
    structureId: string,
    folderId: number,
    documentos: Documento[]
  ): Promise<{
    nuevos: Documento[];
    duplicados: Array<{
      documento: Documento;
      documentoExistente: {
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
      };
    }>;
  }> => {
    try {
      isVerificando.value = true;
      
      const checks = await Promise.all(
        documentos.map(doc =>
          verificarDuplicado(structureId, folderId, doc.nombre)
        )
      );

      const nuevos: Documento[] = [];
      const duplicados: Array<{
        documento: Documento;
        documentoExistente: {
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
        };
      }> = [];

      documentos.forEach((documento, index) => {
        const check = checks[index];
        if (check.exists && check.document) {
          duplicados.push({
            documento,
            documentoExistente: check.document,
          });
        } else {
          nuevos.push(documento);
        }
      });

      return { nuevos, duplicados };
    } finally {
      isVerificando.value = false;
    }
  };

  return {
    isVerificando,
    verificarDuplicado,
    verificarMultiplesDuplicados,
    filtrarDuplicados,
  };
}

