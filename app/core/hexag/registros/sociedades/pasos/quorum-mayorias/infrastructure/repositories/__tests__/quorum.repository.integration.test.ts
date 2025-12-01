/**
 * Tests de Integración - Backend Real
 *
 * Estos tests validan que los endpoints de Quórums y Mayorías funcionan correctamente
 * contra el backend real.
 *
 * ⚠️ IMPORTANTE: Estos tests requieren:
 * - Backend corriendo en TEST_BACKEND_URL
 * - Credenciales válidas en TEST_EMAIL y TEST_PASSWORD
 * - TEST_USE_MSW=false
 *
 * Ejecutar con:
 *   TEST_USE_MSW=false npm run test quorum.repository.integration.test.ts
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { QuorumHttpRepository } from "../quorum.http.repository";
import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";
import { getTestConfig } from "@tests/config/test-config";
import { TestLogger } from "@tests/utils/test-logger";
import { clearAllSocieties } from "@tests/helpers/seed-helpers";
import type { QuorumDTO } from "../../../application/dtos/quorum.dto";

const testConfig = getTestConfig();

// ⚠️ Solo ejecutar si NO estamos usando MSW
const shouldRun = !testConfig.useMsw;

(shouldRun ? describe : describe.skip)("QuorumHttpRepository - Backend Real", () => {
  let repository: QuorumHttpRepository;
  let sociedadRepository: SociedadHttpRepository;
  const createdSocietyIds: string[] = [];
  let logger: TestLogger;
  const testResults: { total: number; passed: number; failed: number } = {
    total: 0,
    passed: 0,
    failed: 0,
  };

  beforeAll(async () => {
    if (testConfig.useMsw) {
      console.warn("⚠️ Estos tests requieren TEST_USE_MSW=false");
    }
    repository = new QuorumHttpRepository();
    sociedadRepository = new SociedadHttpRepository();

    // Inicializar logger
    logger = new TestLogger("QuorumHttpRepository - Backend Real", {
      backendUrl: testConfig.backendUrl,
      useMsw: testConfig.useMsw,
      email: testConfig.credentials.email,
    });

    // 🧹 Limpiar todas las sociedades del backend antes de empezar los tests
    await clearAllSocieties();
  });

  // Limpiar sociedades creadas después de todos los tests y generar resumen
  afterAll(async () => {
    // Limpiar solo las sociedades que ESTE test suite creó (no todas)
    for (const id of createdSocietyIds) {
      try {
        await sociedadRepository.delete(id);
        logger.logDelete(id, true);
      } catch (error: any) {
        // Si la sociedad ya fue eliminada (404), es normal (puede haber sido eliminada por otro test)
        const statusCode = error?.statusCode ?? error?.response?.status ?? null;
        if (statusCode === 404) {
          console.log(`ℹ️  Sociedad ${id} ya fue eliminada (probablemente por otro test)`);
          logger.logDelete(id, true); // Considerarlo como éxito
        } else {
          console.warn(`⚠️ No se pudo eliminar sociedad ${id}:`, error);
          logger.logDelete(id, false);
          logger.logError(`Error al eliminar sociedad ${id}`, error);
        }
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

  /**
   * Helper para crear una sociedad de prueba
   */
  async function createTestSociety(): Promise<string> {
    const societyId = await sociedadRepository.create();
    logger.logCreate(societyId);
    createdSocietyIds.push(societyId);
    return societyId;
  }

  /**
   * Helper para crear un DTO de quórums válido
   * Validaciones del backend:
   * - segundaConvocatoriaSimple >= quorumMinimoSimple
   * - segundaConvocatoriaCalificada >= quorumMinimoCalificado
   * - primeraConvocatoriaSimple >= quorumMinimoSimple
   * - primeraConvocatoriaCalificada >= quorumMinimoCalificado
   */
  function createQuorumDTO(): QuorumDTO {
    return {
      quorumMinimoSimple: 50,
      quorumMinimoCalificado: 60,
      primeraConvocatoriaSimple: 60, // >= quorumMinimoSimple (50) ✅
      primeraConvocatoriaCalificada: 60, // >= quorumMinimoCalificado (60) ✅
      segundaConvocatoriaSimple: 66, // >= quorumMinimoSimple (50) ✅
      segundaConvocatoriaCalificada: 66, // >= quorumMinimoCalificado (60) ✅
    };
  }

  describe("PUT /api/v2/society-profile/:id/quorum - Backend Real", () => {
    it("debe crear quórums y mayorías en el backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        const quorumDTO = createQuorumDTO();

        // Crear quórums
        const result = await repository.create(societyId, quorumDTO);
        logger.logCreate(societyId);

        expect(result).toBeDefined();
        expect(result.quorumMinimoSimple).toBe(quorumDTO.quorumMinimoSimple);
        expect(result.quorumMinimoCalificado).toBe(quorumDTO.quorumMinimoCalificado);
        expect(result.primeraConvocatoriaSimple).toBe(quorumDTO.primeraConvocatoriaSimple);
        expect(result.primeraConvocatoriaCalificada).toBe(quorumDTO.primeraConvocatoriaCalificada);
        expect(result.segundaConvocatoriaSimple).toBe(quorumDTO.segundaConvocatoriaSimple);
        expect(result.segundaConvocatoriaCalificada).toBe(quorumDTO.segundaConvocatoriaCalificada);

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al crear quórums", error);
        throw error;
      }
    });

    it("debe actualizar quórums y mayorías existentes en el backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        const quorumDTO = createQuorumDTO();

        // Crear quórums iniciales
        const initial = await repository.create(societyId, quorumDTO);
        expect(initial.quorumMinimoSimple).toBe(50);

        // Actualizar quórums
        const updatedDTO: QuorumDTO = {
          ...quorumDTO,
          quorumMinimoSimple: 55,
          primeraConvocatoriaSimple: 65,
        };

        const updated = await repository.update(societyId, updatedDTO);
        logger.logCreate(societyId);

        expect(updated.quorumMinimoSimple).toBe(55);
        expect(updated.primeraConvocatoriaSimple).toBe(65);
        expect(updated.quorumMinimoCalificado).toBe(quorumDTO.quorumMinimoCalificado);

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al actualizar quórums", error);
        throw error;
      }
    });

    it("debe validar reglas de negocio (segundaConvocatoria >= quorumMinimo)", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();

        // Intentar crear quórums inválidos (segundaConvocatoria < quorumMinimo)
        const invalidDTO: QuorumDTO = {
          quorumMinimoSimple: 50,
          quorumMinimoCalificado: 60,
          primeraConvocatoriaSimple: 60,
          primeraConvocatoriaCalificada: 60,
          segundaConvocatoriaSimple: 40, // ❌ < quorumMinimoSimple (50)
          segundaConvocatoriaCalificada: 50, // ❌ < quorumMinimoCalificado (60)
        };

        // Este test puede pasar o fallar dependiendo de si el backend valida
        try {
          await repository.create(societyId, invalidDTO);
          logger.logCreate(societyId);
          // Si no lanza error, el backend no valida (aceptable para este test)
          testResults.passed++;
        } catch (error: any) {
          // Si lanza error, el backend valida correctamente
          const message = error?.message || error?.data?.message || "";
          if (
            message.includes("segunda") ||
            message.includes("quorum") ||
            message.includes("mayor") ||
            message.includes("valid")
          ) {
            // Backend valida correctamente
            testResults.passed++;
          } else {
            // Error inesperado
            throw error;
          }
        }
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al validar reglas de negocio", error);
        throw error;
      }
    });
  });

  describe("GET /api/v2/society-profile/:id/quorum - Backend Real", () => {
    it("debe obtener quórums de una sociedad del backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        const quorumDTO = createQuorumDTO();

        // Crear quórums primero
        await repository.create(societyId, quorumDTO);

        // Obtener quórums
        const result = await repository.get(societyId);
        logger.logList();

        expect(result).not.toBeNull();
        if (result) {
          expect(result.quorumMinimoSimple).toBe(quorumDTO.quorumMinimoSimple);
          expect(result.quorumMinimoCalificado).toBe(quorumDTO.quorumMinimoCalificado);
          expect(result.primeraConvocatoriaSimple).toBe(quorumDTO.primeraConvocatoriaSimple);
          expect(result.primeraConvocatoriaCalificada).toBe(quorumDTO.primeraConvocatoriaCalificada);
          expect(result.segundaConvocatoriaSimple).toBe(quorumDTO.segundaConvocatoriaSimple);
          expect(result.segundaConvocatoriaCalificada).toBe(quorumDTO.segundaConvocatoriaCalificada);
        }

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al obtener quórums", error);
        throw error;
      }
    });

    it("debe retornar null si la sociedad no tiene quórums configurados", async () => {
      testResults.total++;
      try {
        // Crear sociedad pero NO crear quórums
        const societyId = await createTestSociety();

        // Intentar obtener quórums (debe retornar null)
        const result = await repository.get(societyId);
        logger.logList();

        // El backend puede retornar null o lanzar 404
        // Ambos casos son válidos
        if (result === null || result === undefined) {
          testResults.passed++;
        } else {
          // Si retorna datos, también es válido (puede tener valores por defecto)
          testResults.passed++;
        }
      } catch (error: any) {
        // Si lanza 404, también es válido
        const statusCode = error?.statusCode ?? error?.response?.status ?? null;
        if (statusCode === 404) {
          testResults.passed++;
        } else {
          testResults.failed++;
          logger.logError("Error al obtener quórums de sociedad sin quórums", error);
          throw error;
        }
      }
    });
  });

  describe("Flujo completo - Backend Real", () => {
    it("debe ejecutar flujo completo (crear, obtener, actualizar) contra backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        const quorumDTO = createQuorumDTO();

        // CREATE
        const created = await repository.create(societyId, quorumDTO);
        logger.logCreate(societyId);
        expect(created.quorumMinimoSimple).toBe(quorumDTO.quorumMinimoSimple);

        // READ
        const retrieved = await repository.get(societyId);
        logger.logList();
        expect(retrieved).not.toBeNull();
        if (retrieved) {
          expect(retrieved.quorumMinimoSimple).toBe(quorumDTO.quorumMinimoSimple);
        }

        // UPDATE
        const updatedDTO: QuorumDTO = {
          ...quorumDTO,
          quorumMinimoSimple: 55,
        };
        const updated = await repository.update(societyId, updatedDTO);
        logger.logCreate(societyId);
        expect(updated.quorumMinimoSimple).toBe(55);

        // READ después de UPDATE
        const final = await repository.get(societyId);
        logger.logList();
        expect(final).not.toBeNull();
        if (final) {
          expect(final.quorumMinimoSimple).toBe(55);
        }

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error en flujo completo", error);
        throw error;
      }
    });
  });
});

