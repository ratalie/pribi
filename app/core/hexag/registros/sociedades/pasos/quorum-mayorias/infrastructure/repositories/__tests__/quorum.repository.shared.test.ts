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

import { beforeEach, describe, expect, it } from "vitest";
import { clearAllMockData } from "@hexag/registros/shared/mock-database";
import type { QuorumRepository } from "../../../domain/ports/quorum.repository";
import type { QuorumDTO } from "../../../application/dtos/quorum.dto";
import { QuorumHttpRepository } from "../quorum.http.repository";
import { QuorumMswRepository } from "../quorum.msw.repository";
import { generateUUID } from "@tests/utils/uuid-generator";

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
  { name: "QuorumHttpRepository", factory: () => new QuorumHttpRepository() },
  { name: "QuorumMswRepository", factory: () => new QuorumMswRepository() },
])("$name - Tests Compartidos", ({ name: _name, factory }) => {
  let repository: QuorumRepository;
  let societyId: string;

  beforeEach(async () => {
    repository = factory();
    // Limpiar datos mock antes de cada test
    await clearAllMockData();
    // Generar un ID de sociedad de prueba
    societyId = generateUUID();
  });

  describe("get() - GET /api/v2/society-profile/:id/quorum", () => {
    it("debe retornar null cuando no hay quórums configurados", async () => {
      const result = await repository.get(societyId);
      expect(result).toBeNull();
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

