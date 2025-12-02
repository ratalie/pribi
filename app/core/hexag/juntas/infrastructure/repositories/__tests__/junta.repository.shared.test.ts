/**
 * Tests Compartidos para Repositorios de Juntas
 *
 * Este archivo contiene tests que se ejecutan con AMBOS repositorios:
 * - JuntaHttpRepository (HTTP real o interceptado por MSW)
 * - JuntaMswRepository (directo al state mock)
 *
 * @pattern Shared Test Suite - Repository Contract Testing
 *
 * Objetivo: Garantizar que ambos repositorios implementan el mismo contrato
 * y producen los mismos resultados para las mismas operaciones.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { clearAllMockData } from "~/core/hexag/registros/shared/mock-database";
import type { JuntaRepository } from "../../../domain/ports/junta.repository";
import { JuntaHttpRepository } from "../junta.http.repository";
import { JuntaMswRepository } from "../junta.msw.repository";

/**
 * Suite de tests compartidos
 *
 * Se ejecuta una vez por cada repositorio usando describe.each
 */
describe.each([
  { name: "JuntaHttpRepository", factory: () => new JuntaHttpRepository() },
  { name: "JuntaMswRepository", factory: () => new JuntaMswRepository() },
])("$name - Tests Compartidos", ({ name: _name, factory }) => {
  let repository: JuntaRepository;
  let societyId: number;

  beforeEach(async () => {
    repository = factory();
    // Limpiar datos mock antes de cada test
    await clearAllMockData();
    // ID de sociedad de prueba
    societyId = 1;
  });

  describe("create() - POST /api/v2/society-profile/:societyId/register-assembly", () => {
    it("debe crear una junta y retornar flowId como string", async () => {
      const flowId = await repository.create(societyId);

      expect(flowId).toBeDefined();
      expect(typeof flowId).toBe("string");
      expect(flowId.length).toBeGreaterThan(0);
    });

    it("debe crear múltiples juntas con IDs diferentes", async () => {
      const id1 = await repository.create(societyId);
      const id2 = await repository.create(societyId);
      const id3 = await repository.create(societyId);

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id3).toBeDefined();

      // Los IDs deben ser diferentes
      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it("debe retornar flowId en formato string", async () => {
      const flowId = await repository.create(societyId);

      // Debe ser string
      expect(typeof flowId).toBe("string");

      // Si es numérico, debe ser parseable
      const numericId = Number(flowId);
      if (!Number.isNaN(numericId)) {
        expect(numericId).toBeGreaterThan(0);
      }
    });
  });

  describe("list() - GET /api/v2/society-profile/:societyId/register-assembly/list", () => {
    it("debe retornar array vacío cuando no hay juntas", async () => {
      const result = await repository.list(societyId);

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it("debe listar juntas creadas", async () => {
      // Crear 2 juntas
      await repository.create(societyId);
      await repository.create(societyId);

      const result = await repository.list(societyId);

      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("estado");
      expect(result[0]).toHaveProperty("actual");
    });

    it("debe listar solo juntas de la sociedad correcta", async () => {
      // Crear junta para societyId 1
      await repository.create(1);
      // Crear junta para societyId 2
      await repository.create(2);

      const juntas1 = await repository.list(1);
      const juntas2 = await repository.list(2);

      expect(juntas1.length).toBe(1);
      expect(juntas2.length).toBe(1);
    });

    it("debe retornar array con estructura correcta de JuntaResumenDTO", async () => {
      await repository.create(societyId);

      const result = await repository.list(societyId);

      expect(result.length).toBeGreaterThan(0);
      const junta = result[0];

      // Verificar estructura de JuntaResumenDTO
      expect(junta).toBeDefined();
      expect(junta).toHaveProperty("id");
      expect(junta).toHaveProperty("estado");
      expect(junta).toHaveProperty("actual");
      expect(typeof junta!.id).toBe("string");
      expect(typeof junta!.actual).toBe("string");
    });
  });

  describe("delete() - DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId", () => {
    it("debe eliminar una junta existente", async () => {
      // Crear junta
      const flowId = await repository.create(societyId);

      // Verificar que existe
      let juntas = await repository.list(societyId);
      expect(juntas.length).toBe(1);

      // Eliminar (pasar flowId directamente, el repo maneja string | number)
      await repository.delete(societyId, flowId);

      // Verificar que ya no existe
      juntas = await repository.list(societyId);
      expect(juntas.length).toBe(0);
    });

    it("debe eliminar solo la junta especificada", async () => {
      // Crear 3 juntas
      const id1 = await repository.create(societyId);
      await repository.create(societyId);
      await repository.create(societyId);

      // Eliminar solo la primera (pasar flowId directamente)
      await repository.delete(societyId, id1);

      // Verificar que quedan 2
      const juntas = await repository.list(societyId);
      expect(juntas.length).toBe(2);
    });

    it("debe lanzar error si la junta no existe", async () => {
      await expect(
        repository.delete(societyId, 999999)
      ).rejects.toThrow();
    });

    it("no debe afectar juntas de otras sociedades", async () => {
      // Crear juntas para 2 sociedades
      const flowId1 = await repository.create(1);
      await repository.create(2);

      // Eliminar junta de sociedad 1 (pasar flowId directamente)
      await repository.delete(1, flowId1);

      // Verificar que sociedad 2 sigue teniendo su junta
      const juntas2 = await repository.list(2);
      expect(juntas2.length).toBe(1);
    });
  });

  describe("getSnapshot() - GET /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete", () => {
    it("debe obtener el snapshot completo de una junta", async () => {
      // Crear junta
      const flowId = await repository.create(societyId);

      // Obtener snapshot (pasar flowId directamente)
      const snapshot = await repository.getSnapshot(societyId, flowId);

      expect(snapshot).toBeDefined();
      expect(snapshot).toHaveProperty("shareholders");
      expect(snapshot).toHaveProperty("shareClasses");
      expect(snapshot).toHaveProperty("shareAllocations");
      expect(snapshot).toHaveProperty("nominalValue");
      expect(Array.isArray(snapshot.shareholders)).toBe(true);
      expect(Array.isArray(snapshot.shareClasses)).toBe(true);
      expect(Array.isArray(snapshot.shareAllocations)).toBe(true);
    });

    it("debe incluir información completa del snapshot", async () => {
      const flowId = await repository.create(societyId);

      const snapshot = await repository.getSnapshot(societyId, flowId);

      // Verificar propiedades principales
      expect(snapshot).toHaveProperty("nominalValue");
      expect(typeof snapshot.nominalValue).toBe("number");

      // Verificar que tiene directorio y quorums (pueden ser null)
      expect(snapshot).toHaveProperty("directory");
      expect(snapshot).toHaveProperty("quorums");

      // Verificar que tiene directores y apoderados (arrays o undefined, pero al menos la propiedad existe)
      expect(snapshot).toHaveProperty("directors");
      expect(snapshot).toHaveProperty("attorneys");
      
      // Si existen, deben ser arrays
      if (snapshot.directors !== undefined && snapshot.directors !== null) {
        expect(Array.isArray(snapshot.directors)).toBe(true);
      }
      if (snapshot.attorneys !== undefined && snapshot.attorneys !== null) {
        expect(Array.isArray(snapshot.attorneys)).toBe(true);
      }
    });

    it("debe retornar snapshots independientes para diferentes juntas", async () => {
      const flowId1 = await repository.create(societyId);
      const flowId2 = await repository.create(societyId);

      const snapshot1 = await repository.getSnapshot(societyId, flowId1);
      const snapshot2 = await repository.getSnapshot(societyId, flowId2);

      // Ambos snapshots deben existir
      expect(snapshot1).toBeDefined();
      expect(snapshot2).toBeDefined();

      // Los snapshots son independientes (pueden tener mismos datos pero son objetos diferentes)
      expect(snapshot1).not.toBe(snapshot2);
    });
  });
});

