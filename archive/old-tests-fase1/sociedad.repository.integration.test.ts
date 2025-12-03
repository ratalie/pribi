/**
 * Tests de Integración - Backend Real
 *
 * Estos tests validan que el endpoint POST /api/v2/society-profile funciona correctamente
 * contra el backend real.
 *
 * ⚠️ IMPORTANTE: Estos tests requieren:
 * - Backend corriendo en TEST_BACKEND_URL
 * - Credenciales válidas en TEST_EMAIL y TEST_PASSWORD
 * - TEST_USE_MSW=false
 *
 * Ejecutar con:
 *   TEST_USE_MSW=false npm run test sociedad.repository.integration.test.ts
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { SociedadHttpRepository } from "../sociedad.http.repository";
import { getTestConfig } from "@tests/config/test-config";
import { TestLogger } from "@tests/utils/test-logger";

const testConfig = getTestConfig();

// ⚠️ Solo ejecutar si NO estamos usando MSW
const shouldRun = !testConfig.useMsw;

(shouldRun ? describe : describe.skip)("SociedadHttpRepository - Backend Real", () => {
  let repository: SociedadHttpRepository;
  const createdSocietyIds: string[] = [];
  let logger: TestLogger;
  const testResults: { total: number; passed: number; failed: number } = {
    total: 0,
    passed: 0,
    failed: 0,
  };

  beforeAll(() => {
    if (testConfig.useMsw) {
      console.warn("⚠️ Estos tests requieren TEST_USE_MSW=false");
    }
    repository = new SociedadHttpRepository();

    // Inicializar logger
    logger = new TestLogger("SociedadHttpRepository - Backend Real", {
      backendUrl: testConfig.backendUrl,
      useMsw: testConfig.useMsw,
      email: testConfig.credentials.email,
    });
  });

  // Limpiar sociedades creadas después de todos los tests y generar resumen
  afterAll(async () => {
    // Limpiar sociedades
    for (const id of createdSocietyIds) {
      try {
        await repository.delete(id);
        logger.logDelete(id, true);
      } catch (error) {
        console.warn(`No se pudo eliminar sociedad ${id}:`, error);
        logger.logDelete(id, false);
        logger.logError(`Error al eliminar sociedad ${id}`, error);
      }
    }

    // Generar y guardar resumen
    try {
      const summary = logger.generateSummary(testResults);
      const { jsonPath, mdPath } = await logger.saveSummary(summary);
      console.log("\n📊 Resumen de tests generado:");
      console.log(`   JSON: ${jsonPath}`);
      console.log(`   Markdown: ${mdPath}\n`);
    } catch (error) {
      console.error("Error al generar resumen:", error);
    }
  });

  describe("POST /api/v2/society-profile - Backend Real", () => {
    it("debe crear una sociedad en el backend real y retornar structureId", async () => {
      testResults.total++;
      try {
        const structureId = await repository.create();
        logger.logCreate(structureId);

        expect(structureId).toBeDefined();
        expect(typeof structureId).toBe("string");
        expect(structureId.length).toBeGreaterThan(0);

        // Debe ser un número válido
        const numericId = Number(structureId);
        expect(Number.isInteger(numericId)).toBe(true);
        expect(numericId).toBeGreaterThan(0);

        // Guardar para limpieza
        createdSocietyIds.push(structureId);
        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al crear sociedad", error);
        throw error;
      }
    });

    it("debe crear múltiples sociedades con IDs diferentes", async () => {
      testResults.total++;
      try {
        const id1 = await repository.create();
        logger.logCreate(id1);
        const id2 = await repository.create();
        logger.logCreate(id2);

        expect(id1).not.toBe(id2);
        expect(Number(id1)).not.toBe(Number(id2));

        // Guardar para limpieza
        createdSocietyIds.push(id1, id2);
        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al crear múltiples sociedades", error);
        throw error;
      }
    });

    it("debe incluir Authorization header con token válido", async () => {
      testResults.total++;
      try {
        // Este test valida implícitamente que el token funciona
        // Si el token fuera inválido, el backend retornaría 401
        const structureId = await repository.create();
        logger.logCreate(structureId);

        expect(structureId).toBeDefined();
        createdSocietyIds.push(structureId);
        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al validar token", error);
        throw error;
      }
    });
  });

  describe("GET /api/v2/society-profile/list - Backend Real", () => {
    it("debe listar sociedades del backend real", async () => {
      testResults.total++;
      try {
        // Crear una sociedad primero
        const structureId = await repository.create();
        logger.logCreate(structureId);
        createdSocietyIds.push(structureId);

        // Listar
        const result = await repository.list();
        logger.logList();

        expect(Array.isArray(result)).toBe(true);

        // Debe incluir la sociedad creada
        const found = result.find((s) => s.idSociety === structureId);
        expect(found).toBeDefined();

        if (found) {
          expect(found).toHaveProperty("idSociety");
          expect(found).toHaveProperty("razonSocial");
          expect(found).toHaveProperty("pasoActual");
        }
        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al listar sociedades", error);
        throw error;
      }
    });
  });

  describe("DELETE /api/v2/society-profile/:id - Backend Real", () => {
    it("debe eliminar una sociedad del backend real", async () => {
      testResults.total++;
      try {
        // Crear sociedad
        const structureId = await repository.create();
        logger.logCreate(structureId);
        // No agregar a createdSocietyIds porque este test la elimina directamente

        // Verificar que existe
        let list = await repository.list();
        logger.logList();
        expect(list.find((s) => s.idSociety === structureId)).toBeDefined();

        // Eliminar
        await repository.delete(structureId);
        logger.logDelete(structureId, true);

        // Verificar que fue eliminada
        list = await repository.list();
        logger.logList();
        expect(list.find((s) => s.idSociety === structureId)).toBeUndefined();
        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al eliminar sociedad", error);
        throw error;
      }
    });
  });

  describe("Flujo completo - Backend Real", () => {
    it("debe ejecutar flujo completo contra backend real", async () => {
      testResults.total++;
      try {
        // CREATE
        const structureId = await repository.create();
        logger.logCreate(structureId);
        expect(structureId).toBeDefined();

        // READ (list)
        let list = await repository.list();
        logger.logList();
        expect(list.find((s) => s.idSociety === structureId)).toBeDefined();

        // DELETE
        await repository.delete(structureId);
        logger.logDelete(structureId, true);
        // No agregar a createdSocietyIds porque este test la elimina directamente

        // Verificar eliminación
        list = await repository.list();
        logger.logList();
        expect(list.find((s) => s.idSociety === structureId)).toBeUndefined();
        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error en flujo completo", error);
        throw error;
      }
    });
  });
});
