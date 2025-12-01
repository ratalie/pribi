import type { ApoderadoDTO } from "./apoderado.dto";

export interface ClaseApoderadoResponseDTO {
  id: string;
  nombre: string;
  apoderados: ApoderadoDTO[];
}
