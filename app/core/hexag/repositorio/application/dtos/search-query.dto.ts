/**
 * DTO para búsqueda global
 */
export interface SearchQueryDTO {
  query: string;
  sociedadId: string;
  scope?: 'all' | 'societarios' | 'generados' | 'personalizadas';
}

/**
 * DTO de respuesta para búsqueda
 */
export interface SearchResultDTO {
  id: string;
  nombre: string;
  tipo: 'documento' | 'carpeta';
  ruta: string;
  categoria: 'societario' | 'generado' | 'personalizada';
}

