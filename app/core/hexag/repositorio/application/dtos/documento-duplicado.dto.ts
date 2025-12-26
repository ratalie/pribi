/**
 * DTO para la respuesta de verificación de documento duplicado
 */
export interface DocumentoDuplicadoDTO {
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
}

