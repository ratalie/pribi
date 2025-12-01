/**
 * DTO de respuesta para estadísticas del dashboard
 */
export interface DashboardStatsDTO {
  documentosSocietarios: {
    totalDocuments: number;
    totalFolders: number;
    totalSize: number;
  };
  documentosGenerados: {
    totalDocuments: number;
    totalCategories: number;
    totalSize: number;
  };
  carpetasPersonalizadas: {
    totalFolders: number;
    totalEnlaces: number;
    totalSize: number;
  };
  metricas: {
    totalDocumentos: number;
    espacioUsado: number;
    espacioTotal: number;
    actividadReciente: number;
    usuariosActivos: number;
  };
}

