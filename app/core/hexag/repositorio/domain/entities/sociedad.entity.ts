/**
 * Entidad de dominio que representa una Sociedad
 */
export interface Sociedad {
  id: string;
  nombre: string;
  tipo: 'SpA' | 'Ltda' | 'SA' | 'SRL';
  rut: string;
  activa: boolean;
}

