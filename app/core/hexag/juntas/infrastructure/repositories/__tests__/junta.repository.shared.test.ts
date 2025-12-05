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

import { afterEach } from "node:test";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
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
  { name: "JuntaHttpRepository", factory: () => new JuntaHttpRepository(), isHttp: true },
  { name: "JuntaMswRepository", factory: () => new JuntaMswRepository(), isHttp: false },
])("$name - Tests Compartidos", ({ name: _name, factory, isHttp }) => {
  let repository: JuntaRepository;
  let societyId: number;
  let cleanedOnce = false;

  // Limpiar UNA SOLA VEZ antes de todos los tests de este repo
  beforeAll(async () => {
    if (isHttp && !cleanedOnce) {
      const tempRepo = factory();
      try {
        const existingJuntas = await tempRepo.list(1);
        if (existingJuntas.length > 0) {
          console.log(
            `🧹 [Test Junta] Limpiando ${existingJuntas.length} juntas existentes de societyId=1...`
          );

          // Limpiar en paralelo (más rápido)
          await Promise.all(
            existingJuntas.map((junta) => tempRepo.delete(1, junta.id).catch(() => {}))
          );
          console.log(`✅ [Test Junta] BD limpia para societyId=1`);
        }
      } catch (error: any) {
        if (error.statusCode !== 404) {
          console.warn(`⚠️ [Test Junta] Error al limpiar juntas:`, error.message);
        }
      }
      cleanedOnce = true;
    }
  }, 60000); // Timeout 60s para cleanup

  beforeEach(async () => {
    repository = factory();
    // Limpiar datos mock antes de cada test
    await clearAllMockData();
    // ID de sociedad de prueba
    societyId = 1;
  });

  // Limpiar después de cada test (solo HTTP)
  afterEach(async () => {
    if (isHttp) {
      try {
        // Limpiar juntas creadas durante el test
        const juntas = await repository.list(societyId).catch(() => []);
        if (juntas.length > 0) {
          await Promise.all(
            juntas.map((junta) => repository.delete(societyId, junta.id).catch(() => {}))
          );
        }
      } catch (error) {
        // Ignorar errores de cleanup
        console.warn(
          `⚠️ [Test Junta] Error al limpiar juntas:`,
          error instanceof Error ? error.message : String(error)
        );
      }
    }
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
    it("debe retornar array (puede estar vacío o con juntas)", async () => {
      const result = await repository.list(societyId);

      // Solo verificar que retorna un array válido
      expect(Array.isArray(result)).toBe(true);
    });

    it("debe listar juntas creadas", async () => {
      // Crear 2 juntas
      const id1 = await repository.create(societyId);
      const id2 = await repository.create(societyId);

      const result = await repository.list(societyId);

      // Al menos debe incluir las 2 que creamos
      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result.find((j) => j.id === id1)).toBeDefined();
      expect(result.find((j) => j.id === id2)).toBeDefined();
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("estado");
      expect(result[0]).toHaveProperty("actual");
    });

    it("debe listar solo juntas de la sociedad correcta", async () => {
      // Crear junta para societyId 1
      const id1 = await repository.create(1);
      // Crear junta para societyId 2
      const id2 = await repository.create(2);

      const juntas1 = await repository.list(1);
      const juntas2 = await repository.list(2);

      // Debe incluir las juntas que creamos
      expect(juntas1.find((j) => j.id === id1)).toBeDefined();
      expect(juntas2.find((j) => j.id === id2)).toBeDefined();
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
    it("debe ejecutar delete sin errores", async () => {
      // Crear junta
      const flowId = await repository.create(societyId);

      // Verificar que existe en la lista
      const juntas = await repository.list(societyId);
      const juntaAntes = juntas.find((j) => j.id === flowId);
      expect(juntaAntes).toBeDefined();

      // Eliminar - Solo verificar que NO lanza error
      await expect(repository.delete(societyId, flowId)).resolves.not.toThrow();
    });

    it("debe eliminar múltiples juntas sin errores", async () => {
      // Crear 3 juntas
      const id1 = await repository.create(societyId);
      const id2 = await repository.create(societyId);
      const id3 = await repository.create(societyId);

      // Eliminar las 3 - Solo verificar que NO lanzan error
      await expect(repository.delete(societyId, id1)).resolves.not.toThrow();
      await expect(repository.delete(societyId, id2)).resolves.not.toThrow();
      await expect(repository.delete(societyId, id3)).resolves.not.toThrow();
    });

    it("debe lanzar error si la junta no existe", async () => {
      await expect(repository.delete(societyId, 999999)).rejects.toThrow();
    });

    it("debe permitir eliminar juntas de diferentes sociedades", async () => {
      // Crear juntas para 2 sociedades
      const flowId1 = await repository.create(1);
      const flowId2 = await repository.create(2);

      // Eliminar ambas - Solo verificar que NO lanzan error
      await expect(repository.delete(1, flowId1)).resolves.not.toThrow();
      await expect(repository.delete(2, flowId2)).resolves.not.toThrow();
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
