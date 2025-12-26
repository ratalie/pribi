/**
 * Repositorio MSW para Datos Sociedad
 *
 * Implementa DatosSociedadRepository usando directamente las funciones del state mock.
 * Este repositorio permite:
 * - Tests unitarios sin HTTP
 * - Validación de que ambos repositorios (HTTP y MSW) funcionan igual
 *
 * @pattern Repository Pattern - MSW Implementation
 */
import type { DatosSociedadDTO } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/application/dtos/datos-sociedad.dto";
import type {
  DatosSociedadRepository,
  SociedadDatosGenerales,
} from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/domain";
import {
  createDatosSociedadMock,
  getDatosSociedadMock,
  updateDatosSociedadMock,
} from "../mocks/data/datos-sociedad.state";

export class DatosSociedadMswRepository implements DatosSociedadRepository {
  async get(idSociety: string): Promise<SociedadDatosGenerales | null> {
    return await getDatosSociedadMock(idSociety);
  }

  async create(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales> {
    return await createDatosSociedadMock(idSociety, payload);
  }

  async update(idSociety: string, payload: DatosSociedadDTO): Promise<SociedadDatosGenerales> {
    return await updateDatosSociedadMock(idSociety, payload);
  }
}
