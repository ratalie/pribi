/**
 * DTO: Respuesta de Detalles de Junta
 * 
 * Formato exacto que el backend devuelve (snake_case).
 */

export interface DetallesJuntaResponseDTO {
  id: string;
  junta_id: string;
  tipo_junta: string;
  modo_realizacion: string;
  fecha_junta: string;
  hora_junta: string;
  lugar_junta?: string;
  enlace_virtual?: string;
  observaciones?: string;
  created_at: string;
  updated_at: string;
}


