/**
 * Tests Compartidos para Repositorios de Datos Sociedad
 *
 * Este archivo contiene tests que se ejecutan con AMBOS repositorios:
 * - DatosSociedadHttpRepository (HTTP real o interceptado por MSW)
 * - DatosSociedadMswRepository (directo al state mock)
 *
 * @pattern Shared Test Suite - Repository Contract Testing
 *
 * Objetivo: Garantizar que ambos repositorios implementan el mismo contrato
 * y producen los mismos resultados para las mismas operaciones.
 */

import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { clearAllMockData } from "@hexag/registros/shared/mock-database";
import type { DatosSociedadRepository } from "../../../domain/ports/datos-sociedad.repository";
import type { DatosSociedadDTO } from "../../../application/dtos/datos-sociedad.dto";
import { DatosSociedadHttpRepository } from "../datos-sociedad.http.repository";
import { DatosSociedadMswRepository } from "../datos-sociedad.msw.repository";
import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";
import { SociedadMswRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.msw.repository";

/**
 * Helper para crear un DTO de datos sociedad válido
 */
function createDatosSociedadDTO(): DatosSociedadDTO {
  return {
    idSociety: undefined,
    numeroRuc: "20123456789",
    tipoSocietario: "S.A.C.",
    razonSocial: "Empresa Test S.A.C.",
    nombreComercial: "Empresa Test",
    direccion: "Av. Test 123",
    distrito: "San Isidro",
    provincia: "Lima",
    departamento: "Lima",
    fechaInscripcionRuc: "2020-01-15",
    actividadExterior: "",
    fechaEscrituraPublica: "2020-01-10",
    fechaRegistrosPublicos: "2020-01-20",
    partidaRegistral: "12345678",
    oficinaRegistral: "LIMA",
  };
}

/**
 * Suite de tests compartidos
 */
describe.each([
  { 
    name: "DatosSociedadHttpRepository", 
    factory: () => new DatosSociedadHttpRepository(),
    sociedadFactory: () => new SociedadHttpRepository(),
  },
  { 
    name: "DatosSociedadMswRepository", 
    factory: () => new DatosSociedadMswRepository(),
    sociedadFactory: () => new SociedadMswRepository(),
  },
])("$name - Tests Compartidos", ({ name: _name, factory, sociedadFactory }) => {
  let repository: DatosSociedadRepository;
  let societyId: string;
  let sociedadRepo: any;

  beforeAll(async () => {  // ✅ UNA VEZ
    repository = factory();
    sociedadRepo = sociedadFactory();
    await clearAllMockData();
    
    societyId = await sociedadRepo.create();
  });

  afterAll(async () => {  // ✅ UNA VEZ
    if (societyId) {
      try {
        await sociedadRepo.delete(societyId);
      } catch (error) {
        console.warn(`[Tests] No se pudo eliminar sociedad ${societyId}`);
      }
    }
  });

  describe("get() - GET /api/v2/society-profile/:id/society", () => {
    it("debe retornar null cuando no hay datos principales", async () => {
      // El HTTP repository puede lanzar un error 404, el MSW retorna null
      // Ambos comportamientos son válidos, verificamos que no retorne datos válidos
      try {
        const result = await repository.get(societyId);
        expect(result).toBeNull();
      } catch (error: any) {
        // Si lanza error 404, también es válido (HTTP repository)
        const statusCode = error?.statusCode ?? error?.response?.status ?? null;
        expect(statusCode).toBe(404);
      }
    });
  });

  describe("create() - PUT /api/v2/society-profile/:id/society", () => {
    it("debe crear datos principales de una sociedad", async () => {
      const datos = createDatosSociedadDTO();

      const result = await repository.create(societyId, datos);

      expect(result).toBeDefined();
      expect(result.razonSocial).toBe(datos.razonSocial);
      expect(result.numeroRuc).toBe(datos.numeroRuc);
      expect(result.nombreComercial).toBe(datos.nombreComercial);
      expect(result.direccion).toBe(datos.direccion);
    });

    it("debe crear datos principales con todos los campos", async () => {
      const datos = createDatosSociedadDTO();

      const result = await repository.create(societyId, datos);

      expect(result.distrito).toBe(datos.distrito);
      expect(result.provincia).toBe(datos.provincia);
      expect(result.departamento).toBe(datos.departamento);
      expect(result.partidaRegistral).toBe(datos.partidaRegistral);
    });
  });

  describe("update() - PUT /api/v2/society-profile/:id/society", () => {
    it("debe actualizar datos principales de una sociedad existente", async () => {
      const datos = createDatosSociedadDTO();

      // Crear datos iniciales
      await repository.create(societyId, datos);

      // Actualizar datos
      const updatedDatos: DatosSociedadDTO = {
        ...datos,
        razonSocial: "Empresa Actualizada",
        nombreComercial: "Empresa Actualizada S.A.C.",
        direccion: "Av. Actualizada 456",
      };

      const updated = await repository.update(societyId, updatedDatos);

      expect(updated.razonSocial).toBe("Empresa Actualizada");
      expect(updated.nombreComercial).toBe("Empresa Actualizada S.A.C.");
      expect(updated.direccion).toBe("Av. Actualizada 456");
    });
  });

  describe("Flujo completo CRUD", () => {
    it("debe permitir crear, obtener y actualizar datos principales", async () => {
      const datos = createDatosSociedadDTO();

      // CREATE
      const created = await repository.create(societyId, datos);
      expect(created.razonSocial).toBe(datos.razonSocial);

      // READ (get)
      const retrieved = await repository.get(societyId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.razonSocial).toBe(datos.razonSocial);

      // UPDATE
      const updatedDatos: DatosSociedadDTO = {
        ...datos,
        razonSocial: "Empresa Actualizada",
      };
      const updated = await repository.update(societyId, updatedDatos);
      expect(updated.razonSocial).toBe("Empresa Actualizada");
    });
  });
});

