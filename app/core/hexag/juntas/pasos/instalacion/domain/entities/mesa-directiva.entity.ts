/**
 * Entidad: Mesa Directiva de Junta
 */

export interface MesaDirectivaEntity {
  id: string;
  juntaId: string;
  presidenteId: string;
  secretarioId: string;
  presidenteAsistio: boolean;
  secretarioAsistio: boolean;
  presidenteOrigen: "PRESIDENTE_DIRECTORIO" | "ASISTENTE";
  secretarioOrigen: "GERENTE_GENERAL" | "ASISTENTE";
  createdAt: Date;
  updatedAt: Date;
}


