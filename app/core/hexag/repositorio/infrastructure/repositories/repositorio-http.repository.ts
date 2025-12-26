import type { RepositorioRepository } from '../../domain/ports/repositorio.repository';
import type { RepositorioStats } from '../../domain/entities/repositorio-stats.entity';
import type { Metricas } from '../../domain/entities/metricas.entity';
import type { Sociedad } from '../../domain/entities/sociedad.entity';
import type { SearchResultDTO } from '../../application/dtos/search-query.dto';
import { withAuthHeaders } from '~/lib/api-client';

/**
 * Repositorio HTTP para el módulo Repositorio
 * Implementa RepositorioRepository usando llamadas HTTP reales
 * 
 * ✅ FASE 1 COMPLETADA: Rutas corregidas a /api/v2/repository/...
 */
export class RepositorioHttpRepository implements RepositorioRepository {
  /**
   * Obtiene las estadísticas del repositorio para una sociedad
   * 
   * ✅ CORREGIDO: Usa endpoint V2 correcto GET /:structureId/documents/storage-usage
   * 
   * NOTA: El endpoint de storage-usage no proporciona toda la información necesaria
   * para RepositorioStats (documentosSocietarios, documentosGenerados, carpetasPersonalizadas).
   * Por ahora, mapeamos lo disponible y dejamos valores por defecto para lo que falta.
   * TODO: Implementar endpoints adicionales o agregar lógica para obtener información completa.
   */
  async getStats(sociedadId: string): Promise<RepositorioStats> {
    // ✅ Usar endpoint V2 correcto
    const response = await $fetch<{
      success: boolean;
      data: {
        societyId: number;
        limitInBytes: number;
        currentUsedInBytes: number;
        currentDocumentCount: number;
        summaries: Array<{
          mimeType: string;
          currentCount: number;
          currentSizeInBytes: number;
        }>;
        expireAt: string | null;
      };
    }>(
      `/api/v2/repository/society-profile/${sociedadId}/documents/storage-usage`,
      {
        ...withAuthHeaders(),
        method: 'GET' as const,
      }
    );

    if (!response.success || !response.data) {
      // Retornar valores por defecto si no hay datos
      return {
        documentosSocietarios: {
          totalDocuments: 0,
          totalFolders: 0,
          totalSize: 0,
        },
        documentosGenerados: {
          totalDocuments: 0,
          totalCategories: 0,
          totalSize: 0,
        },
        carpetasPersonalizadas: {
          totalFolders: 0,
          totalEnlaces: 0,
          totalSize: 0,
        },
      };
    }

    const storageData = response.data;

    // Mapear datos disponibles
    // TODO: Obtener información completa de documentosSocietarios, documentosGenerados y carpetasPersonalizadas
    // Por ahora, usamos los datos de storage-usage como aproximación
    return {
      documentosSocietarios: {
        totalDocuments: storageData.currentDocumentCount,
        totalFolders: 0, // TODO: Obtener de endpoint de nodos
        totalSize: storageData.currentUsedInBytes,
      },
      documentosGenerados: {
        totalDocuments: storageData.currentDocumentCount,
        totalCategories: storageData.summaries.length,
        totalSize: storageData.currentUsedInBytes,
      },
      carpetasPersonalizadas: {
        totalFolders: 0, // TODO: Obtener de endpoint de virtual-nodes
        totalEnlaces: 0, // TODO: Obtener de endpoint de virtual-nodes
        totalSize: 0, // TODO: Obtener de endpoint de virtual-nodes
      },
    };
  }

  /**
   * Obtiene las métricas del dashboard
   * 
   * ✅ CORREGIDO: Usa endpoint V2 correcto GET /:structureId/documents/storage-usage
   * 
   * NOTA: El endpoint de storage-usage no proporciona toda la información necesaria
   * para Metricas (actividadReciente, usuariosActivos).
   * Por ahora, mapeamos lo disponible y dejamos valores por defecto para lo que falta.
   * TODO: Implementar endpoints adicionales o agregar lógica para obtener información completa.
   */
  async getMetricas(sociedadId: string): Promise<Metricas> {
    // ✅ Usar endpoint V2 correcto
    const response = await $fetch<{
      success: boolean;
      data: {
        societyId: number;
        limitInBytes: number;
        currentUsedInBytes: number;
        currentDocumentCount: number;
        summaries: Array<{
          mimeType: string;
          currentCount: number;
          currentSizeInBytes: number;
        }>;
        expireAt: string | null;
      };
    }>(
      `/api/v2/repository/society-profile/${sociedadId}/documents/storage-usage`,
      {
        ...withAuthHeaders(),
        method: 'GET' as const,
      }
    );

    if (!response.success || !response.data) {
      // Retornar valores por defecto si no hay datos
      return {
        totalDocumentos: 0,
        espacioUsado: 0,
        espacioTotal: 0,
        actividadReciente: 0,
        usuariosActivos: 0,
      };
    }

    const storageData = response.data;

    // Convertir bytes a GB (1 GB = 1024^3 bytes)
    const BYTES_TO_GB = 1024 * 1024 * 1024;
    const espacioUsadoGB = storageData.currentUsedInBytes / BYTES_TO_GB;
    const espacioTotalGB = storageData.limitInBytes / BYTES_TO_GB;

    return {
      totalDocumentos: storageData.currentDocumentCount,
      espacioUsado: Math.round(espacioUsadoGB * 100) / 100, // Redondear a 2 decimales
      espacioTotal: Math.round(espacioTotalGB * 100) / 100, // Redondear a 2 decimales
      actividadReciente: 0, // TODO: Obtener de endpoint de actividad
      usuariosActivos: 0, // TODO: Obtener de endpoint de usuarios
    };
  }

  /**
   * Lista todas las sociedades disponibles
   * 
   * ⚠️ CORREGIDO: Este método no es responsabilidad del módulo de repositorio.
   * Debe usar el endpoint del módulo society-profile.
   * 
   * Por ahora, lanzamos un error indicando que debe usar el endpoint correcto.
   * TODO: Remover este método del puerto o redirigir al endpoint de society-profile.
   */
  async listSociedades(): Promise<Sociedad[]> {
    // ⚠️ Este endpoint no existe en el módulo de repositorio
    // Debe usar el endpoint del módulo society-profile: GET /api/v2/society-profile
    throw new Error(
      'listSociedades() no es responsabilidad del módulo de repositorio. ' +
      'Use el endpoint del módulo society-profile: GET /api/v2/society-profile'
    );
  }

  /**
   * Busca globalmente en el repositorio usando búsqueda semántica
   * 
   * ✅ CORREGIDO: Usa endpoint V2 correcto POST /:structureId/documents/search (búsqueda semántica)
   */
  async searchGlobal(sociedadId: string, query: string): Promise<SearchResultDTO[]> {
    // ✅ Usar endpoint V2 correcto para búsqueda semántica
    const response = await $fetch<{
      success: boolean;
      data: {
        searchId: string;
        documents: Array<{
          node?: {
            id: number;
            code: string;
            name: string;
            path: string;
            type: number; // 0 = Document, 1 = Folder
          };
          documentCode?: string;
          title?: string;
          versionCode?: string;
          [key: string]: any;
        }>;
      };
      pagination: {
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
      };
    }>(
      `/api/v2/repository/society-profile/${sociedadId}/documents/search`,
      {
        ...withAuthHeaders(),
        method: 'POST' as const,
        body: {
          query,
          // Parámetros opcionales con valores por defecto
          page: 1,
          size: 20,
        },
      }
    );

    if (!response.success || !response.data || !response.data.documents) {
      return [];
    }

    // Mapear documentos a SearchResultDTO
    return response.data.documents.map((doc): SearchResultDTO => {
      const node = doc.node;
      const nombre = node?.name || doc.title || doc.documentCode || 'Sin nombre';
      const ruta = node?.path || '';
      const tipo = node?.type === 1 ? 'carpeta' : 'documento';
      
      // Determinar categoría basándose en la ruta
      let categoria: 'societario' | 'generado' | 'personalizada' = 'societario';
      if (ruta.includes('/core/documentos-generados/')) {
        categoria = 'generado';
      } else if (ruta.includes('/virtual/') || ruta.includes('/personalizadas/')) {
        categoria = 'personalizada';
      }

      return {
        id: node?.code || doc.documentCode || doc.versionCode || String(node?.id || ''),
        nombre,
        tipo,
        ruta,
        categoria,
      };
    });
  }
}

