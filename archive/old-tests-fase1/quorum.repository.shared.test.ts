/**
 * Tests Compartidos para Repositorios de Quórums
 *
 * Este archivo contiene tests que se ejecutan con AMBOS repositorios:
 * - QuorumHttpRepository (HTTP real o interceptado por MSW)
 * - QuorumMswRepository (directo al state mock)
 *
 * @pattern Shared Test Suite - Repository Contract Testing
 *
 * Objetivo: Garantizar que ambos repositorios implementan el mismo contrato
 * y producen los mismos resultados para las mismas operaciones.
 */

import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { clearAllMockData } from "@hexag/registros/shared/mock-database";
import type { QuorumRepository } from "../../../domain/ports/quorum.repository";
import type { QuorumDTO } from "../../../application/dtos/quorum.dto";
import { QuorumHttpRepository } from "../quorum.http.repository";
import { QuorumMswRepository } from "../quorum.msw.repository";
import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";
import { SociedadMswRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.msw.repository";

/**
 * Helper para crear un DTO de quórums válido
 */
function createQuorumDTO(): QuorumDTO {
  return {
    quorumMinimoSimple: 50,
    quorumMinimoCalificado: 60,
    primeraConvocatoriaSimple: 60,
    primeraConvocatoriaCalificada: 60,
    segundaConvocatoriaSimple: 66,
    segundaConvocatoriaCalificada: 66,
  };
}

/**
 * Suite de tests compartidos
 */
describe.each([
  { 
    name: "QuorumHttpRepository", 
    factory: () => new QuorumHttpRepository(),
    sociedadFactory: () => new SociedadHttpRepository(),
  },
  { 
    name: "QuorumMswRepository", 
    factory: () => new QuorumMswRepository(),
    sociedadFactory: () => new SociedadMswRepository(),
  },
])("$name - Tests Compartidos", ({ name: _name, factory, sociedadFactory }) => {
  let repository: QuorumRepository;
  let societyId: string;
  let sociedadRepo: any;

  beforeAll(async () => {  // ✅ UNA VEZ al inicio
    repository = factory();
    sociedadRepo = sociedadFactory();
    await clearAllMockData();
    
    // ✅ PASO 0: Crear UNA sociedad para TODOS los tests
    societyId = await sociedadRepo.create();
  });

  afterAll(async () => {  // ✅ UNA VEZ al final
    // Eliminar la sociedad
    if (societyId) {
      try {
        await sociedadRepo.delete(societyId);
      } catch (error) {
        console.warn(`No se pudo eliminar sociedad ${societyId}:`, error);
      }
    }
  });

  describe("get() - GET /api/v2/society-profile/:id/quorum", () => {
    it("debe retornar quórums (con valores por defecto si es backend real)", async () => {
      const result = await repository.get(societyId);
      
      // Con MSW: null hasta que se creen
      // Con Backend Real: puede tener valores por defecto
      if (result) {
        expect(result).toHaveProperty("quorumMinimoSimple");
        expect(result).toHaveProperty("quorumMinimoCalificado");
      }
      // Aceptamos tanto null como objeto válido
      expect(result === null || typeof result === "object").toBe(true);
    });
  });

  describe("create() - PUT /api/v2/society-profile/:id/quorum", () => {
    it("debe crear quórums y mayorías", async () => {
      const quorumDTO = createQuorumDTO();

      const result = await repository.create(societyId, quorumDTO);

      expect(result).toBeDefined();
      expect(result.quorumMinimoSimple).toBe(quorumDTO.quorumMinimoSimple);
      expect(result.quorumMinimoCalificado).toBe(quorumDTO.quorumMinimoCalificado);
      expect(result.primeraConvocatoriaSimple).toBe(quorumDTO.primeraConvocatoriaSimple);
      expect(result.primeraConvocatoriaCalificada).toBe(quorumDTO.primeraConvocatoriaCalificada);
      expect(result.segundaConvocatoriaSimple).toBe(quorumDTO.segundaConvocatoriaSimple);
      expect(result.segundaConvocatoriaCalificada).toBe(quorumDTO.segundaConvocatoriaCalificada);
    });
  });

  describe("update() - PUT /api/v2/society-profile/:id/quorum", () => {
    it("debe actualizar quórums y mayorías existentes", async () => {
      const quorumDTO = createQuorumDTO();

      // Crear quórums iniciales
      await repository.create(societyId, quorumDTO);

      // Actualizar quórums
      const updatedDTO: QuorumDTO = {
        ...quorumDTO,
        quorumMinimoSimple: 55,
        primeraConvocatoriaSimple: 65,
      };

      const updated = await repository.update(societyId, updatedDTO);

      expect(updated.quorumMinimoSimple).toBe(55);
      expect(updated.primeraConvocatoriaSimple).toBe(65);
      expect(updated.quorumMinimoCalificado).toBe(quorumDTO.quorumMinimoCalificado);
    });
  });

  describe("Flujo completo CRUD", () => {
    it("debe permitir crear, obtener y actualizar quórums", async () => {
      const quorumDTO = createQuorumDTO();

      // CREATE
      const created = await repository.create(societyId, quorumDTO);
      expect(created.quorumMinimoSimple).toBe(quorumDTO.quorumMinimoSimple);

      // READ (get)
      const retrieved = await repository.get(societyId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.quorumMinimoSimple).toBe(quorumDTO.quorumMinimoSimple);

      // UPDATE
      const updatedDTO: QuorumDTO = {
        ...quorumDTO,
        quorumMinimoSimple: 55,
      };
      const updated = await repository.update(societyId, updatedDTO);
      expect(updated.quorumMinimoSimple).toBe(55);
    });
  });
});


