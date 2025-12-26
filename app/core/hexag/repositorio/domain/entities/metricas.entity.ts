/**
 * Entidad de dominio que representa métricas del dashboard
 */
export interface Metricas {
  totalDocumentos: number;
  espacioUsado: number; // en GB
  espacioTotal: number; // en GB
  actividadReciente: number; // cantidad de actividades
  usuariosActivos: number;
}

