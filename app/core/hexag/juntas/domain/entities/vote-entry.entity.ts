/**
 * Entidad: Voto Individual
 * Representa un voto emitido por un accionista
 */
export interface VoteEntry {
  /** UUID del voto */
  id: string;
  
  /** UUID del accionista que vota (shareholderId) */
  accionistaId: string;
  
  /** 
   * Valor del voto
   * - Modo SIMPLE: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION"
   * - Modo CUMULATIVO: number (cantidad de acciones)
   */
  valor: string | number;
}

