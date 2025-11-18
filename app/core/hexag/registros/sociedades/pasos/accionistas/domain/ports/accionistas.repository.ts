import type { Accionista } from "../entities/accionista.entity";
import type { AccionistaDTO } from "../../application/dtos/accionista.dto";

export interface AccionistasRepository {
  list(profileId: string): Promise<Accionista[]>;
  create(profileId: string, payload: AccionistaDTO): Promise<Accionista>;
  update(profileId: string, payload: AccionistaDTO): Promise<Accionista>;
  delete(profileId: string, accionistaId: string): Promise<void>;
}

