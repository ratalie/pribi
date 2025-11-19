/**
 * Interfaz genérica para las respuestas del backend.
 * Todas las respuestas del backend siguen esta estructura común.
 */
export interface BackendApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  code: number;
}
