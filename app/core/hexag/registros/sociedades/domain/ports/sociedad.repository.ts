import type { SociedadResumenDTO } from "../../application/dtos/sociedad-resumen.dto";

export interface SociedadRepository {
  create(): Promise<string>;
  list(): Promise<SociedadResumenDTO[]>;
  delete(id: string): Promise<void>;
}

