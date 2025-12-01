/**
 * Entidad de dominio que representa las estadísticas del repositorio
 */
export interface RepositorioStats {
  documentosSocietarios: {
    totalDocuments: number;
    totalFolders: number;
    totalSize: number; // en bytes
  };
  documentosGenerados: {
    totalDocuments: number;
    totalCategories: number;
    totalSize: number; // en bytes
  };
  carpetasPersonalizadas: {
    totalFolders: number;
    totalEnlaces: number;
    totalSize: number; // en bytes
  };
}

