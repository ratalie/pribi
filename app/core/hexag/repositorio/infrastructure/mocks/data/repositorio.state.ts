import type { RepositorioStats } from '../../../domain/entities/repositorio-stats.entity';
import type { Metricas } from '../../../domain/entities/metricas.entity';
import type { Sociedad } from '../../../domain/entities/sociedad.entity';
import type { SearchResultDTO } from '../../../application/dtos/search-query.dto';

/**
 * Mock data estático para el repositorio
 * Basado en la documentación de probo-figma-ai
 */

// Sociedades mock
export const sociedadesMock: Sociedad[] = [
  {
    id: 'soc-1',
    nombre: 'Tech Innovations SpA',
    tipo: 'SpA',
    rut: '76.123.456-7',
    activa: true,
  },
  {
    id: 'soc-2',
    nombre: 'Holding ABC SpA',
    tipo: 'SpA',
    rut: '76.987.654-3',
    activa: true,
  },
  {
    id: 'soc-3',
    nombre: 'Servicios XYZ Ltda',
    tipo: 'Ltda',
    rut: '77.456.789-0',
    activa: true,
  },
  {
    id: 'soc-4',
    nombre: 'Inversiones DEF SA',
    tipo: 'SA',
    rut: '96.321.654-8',
    activa: true,
  },
  {
    id: 'soc-5',
    nombre: 'Consultora GHI Ltda',
    tipo: 'Ltda',
    rut: '77.852.963-5',
    activa: false,
  },
];

/**
 * Obtiene las estadísticas del repositorio para una sociedad
 */
export async function getRepositorioStatsMock(sociedadId: string): Promise<RepositorioStats> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Estadísticas calculadas basadas en mock data
  return {
    documentosSocietarios: {
      totalDocuments: 12,
      totalFolders: 3,
      totalSize: 3244000, // bytes
    },
    documentosGenerados: {
      totalDocuments: 125,
      totalCategories: 2,
      totalSize: 12500000, // bytes
    },
    carpetasPersonalizadas: {
      totalFolders: 3,
      totalEnlaces: 5,
      totalSize: 1500000, // bytes
    },
  };
}

/**
 * Obtiene las métricas del dashboard
 */
export async function getMetricasMock(sociedadId: string): Promise<Metricas> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    totalDocumentos: 137, // 12 + 125
    espacioUsado: 2.4, // GB
    espacioTotal: 10, // GB
    actividadReciente: 4,
    usuariosActivos: 8,
  };
}

/**
 * Lista todas las sociedades
 */
export async function listSociedadesMock(): Promise<Sociedad[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return [...sociedadesMock];
}

/**
 * Busca globalmente en el repositorio
 */
export async function searchGlobalMock(
  sociedadId: string,
  query: string
): Promise<SearchResultDTO[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (!query || query.trim().length === 0) {
    return [];
  }

  const queryLower = query.toLowerCase();

  // Mock de resultados de búsqueda
  const resultados: SearchResultDTO[] = [];

  // Simular búsqueda en documentos societarios
  if (queryLower.includes('sociedad') || queryLower.includes('tech')) {
    resultados.push({
      id: 'doc-1',
      nombre: 'Sociedad Tech SpA.pdf',
      tipo: 'documento',
      ruta: 'Estatutos/Sociedad Tech SpA.pdf',
      categoria: 'societario',
    });
  }

  // Simular búsqueda en documentos generados
  if (queryLower.includes('junta') || queryLower.includes('acta')) {
    resultados.push({
      id: 'gen-junta-1',
      nombre: 'Acta Junta Ordinaria 2024.pdf',
      tipo: 'documento',
      ruta: 'Operaciones/Junta de Accionistas/Junta Ordinaria - 29 Nov 2024',
      categoria: 'generado',
    });
  }

  // Simular búsqueda en carpetas personalizadas
  if (queryLower.includes('diligence') || queryLower.includes('abc')) {
    resultados.push({
      id: 'personal-1',
      nombre: 'Due Diligence Cliente ABC',
      tipo: 'carpeta',
      ruta: 'Carpetas Personalizadas/Due Diligence Cliente ABC',
      categoria: 'personalizada',
    });
  }

  return resultados;
}

