/**
 * Repositorio MSW para Asignación de Acciones
 *
 * Implementa AsignacionAccionesRepository usando directamente las funciones del state mock.
 * Este repositorio permite:
 * - Tests unitarios sin HTTP
 * - Validación de que ambos repositorios (HTTP y MSW) funcionan igual
 *
 * @pattern Repository Pattern - MSW Implementation
 */
import type {
  AsignacionAccionesDTO,
  AsignacionAccionesRepository,
} from "~/core/hexag/registros/sociedades/pasos/asignacion-acciones/domain/ports/asignacion-acciones.repository";
import { createAsignacionMock } from "../mocks/data/asignacion-acciones.state";

export class AsignacionAccionesMswRepository implements AsignacionAccionesRepository {
  async create(societyProfileId: string, payload: AsignacionAccionesDTO): Promise<string> {
    const entity = await createAsignacionMock(societyProfileId, payload);
    return entity.id;
  }
}
