/**
 * Port: Repositorio de Mesa Directiva
 */

import type { MesaDirectivaEntity } from "../entities/mesa-directiva.entity";
import type { CreateMesaDirectivaDTO } from "../../application/dtos/create-mesa-directiva.dto";

export interface MesaDirectivaRepositoryPort {
  create(juntaId: string, data: CreateMesaDirectivaDTO): Promise<MesaDirectivaEntity>;
  getByJuntaId(juntaId: string): Promise<MesaDirectivaEntity | null>;
  update(id: string, data: Partial<CreateMesaDirectivaDTO>): Promise<MesaDirectivaEntity>;
}


