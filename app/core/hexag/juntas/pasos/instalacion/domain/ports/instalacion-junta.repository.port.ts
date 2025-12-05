/**
 * Port: Repositorio de Instalación de Junta
 */

import type { InstalacionJuntaEntity } from "../entities/instalacion-junta.entity";
import type { CreateInstalacionJuntaDTO } from "../../application/dtos/create-instalacion-junta.dto";

export interface InstalacionJuntaRepositoryPort {
  create(juntaId: string, data: CreateInstalacionJuntaDTO): Promise<InstalacionJuntaEntity>;
  getByJuntaId(juntaId: string): Promise<InstalacionJuntaEntity | null>;
  update(id: string, data: Partial<CreateInstalacionJuntaDTO>): Promise<InstalacionJuntaEntity>;
}


