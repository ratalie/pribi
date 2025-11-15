import type { Apoderado } from "./apoderado.entity";

export interface ClaseApoderado {
  id: string;
  nombre: string;
  apoderados?: Apoderado[];
  createdAt?: string;
  updatedAt?: string;
}


