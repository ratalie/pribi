/**
 * Port: Repositorio de Asistencia
 */

import type { AsistenciaEntity } from "../entities/asistencia.entity";
import type { CreateAsistenciaDTO } from "../../application/dtos/create-asistencia.dto";

export interface AsistenciaRepositoryPort {
  create(juntaId: string, data: CreateAsistenciaDTO): Promise<AsistenciaEntity>;
  getByJuntaId(juntaId: string): Promise<AsistenciaEntity[]>;
  toggleAsistencia(id: string): Promise<AsistenciaEntity>;
  setRepresentante(id: string, representanteId: string): Promise<AsistenciaEntity>;
}


