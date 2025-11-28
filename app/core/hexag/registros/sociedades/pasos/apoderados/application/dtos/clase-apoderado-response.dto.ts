import type { ApoderadoDTO } from ".";

export interface ClaseApoderadoResponseDTO {
  id: string;
  nombre: string;
  apoderados: ApoderadoDTO[];
}
