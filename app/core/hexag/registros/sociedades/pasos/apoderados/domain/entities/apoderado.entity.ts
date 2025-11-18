import type { Persona } from "@hexag/registros/sociedades/pasos/accionistas/domain";

export interface Apoderado {
  id: string;
  claseApoderadoId: string;
  persona: Persona;
  createdAt?: string;
  updatedAt?: string;
}


