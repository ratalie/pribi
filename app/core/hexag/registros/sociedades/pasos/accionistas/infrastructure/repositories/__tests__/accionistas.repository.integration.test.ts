/**
 * Tests de Integración - Backend Real
 *
 * Estos tests validan que los endpoints de Accionistas funcionan correctamente
 * contra el backend real.
 *
 * ⚠️ IMPORTANTE: Estos tests requieren:
 * - Backend corriendo en TEST_BACKEND_URL
 * - Credenciales válidas en TEST_EMAIL y TEST_PASSWORD
 * - TEST_USE_MSW=false
 *
 * Ejecutar con:
 *   TEST_USE_MSW=false npm run test accionistas.repository.integration.test.ts
 */

import { getTestConfig } from "@tests/config/test-config";
import {
  clearAllSocieties,
  createTestAccionistaJuridico,
  generateTestData,
} from "@tests/helpers/seed-helpers";
import { TestLogger } from "@tests/utils/test-logger";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";
import type { AccionistaDTO } from "../../../application/dtos/accionista.dto";
import { isPersonaNatural } from "../../../domain/entities/persona.entity";
import { AccionistasHttpRepository } from "../accionistas.http.repository";

const testConfig = getTestConfig();

// ⚠️ Solo ejecutar si NO estamos usando MSW
const shouldRun = !testConfig.useMsw;

// Helper para generar UUID
function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

(shouldRun ? describe : describe.skip)("AccionistasHttpRepository - Backend Real", () => {
  let repository: AccionistasHttpRepository;
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
    repository = new AccionistasHttpRepository();
    sociedadRepository = new SociedadHttpRepository();

    // Inicializar logger
    logger = new TestLogger("AccionistasHttpRepository - Backend Real", {
      backendUrl: testConfig.backendUrl,
      useMsw: testConfig.useMsw,
      email: testConfig.credentials.email,
    });

    // 🧹 Limpiar todas las sociedades del backend antes de empezar los tests
    await clearAllSocieties();
  });

  // Limpiar sociedades creadas después de todos los tests y generar resumen
  afterAll(async () => {
    // Limpiar sociedades (esto eliminará también los accionistas)
    for (const id of createdSocietyIds) {
      try {
        await sociedadRepository.delete(id);
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

  /**
   * Helper para crear una sociedad de prueba
   */
  async function createTestSociety(): Promise<string> {
    const societyId = await sociedadRepository.create();
    logger.logCreate(societyId);
    createdSocietyIds.push(societyId);
    return societyId;
  }

  // Usar directamente los helpers del seed (que ya funcionan)
  // No crear helpers nuevos, usar generateTestData() directamente

  describe("POST /api/v2/society-profile/:id/shareholder - Backend Real", () => {
    it("debe crear un accionista natural en el backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        // Usar exactamente la misma data que el seed (que funciona)
        const testData = generateTestData(0);
        const accionistaDTO = testData.accionistas[0]; // Juan (primer accionista del seed)

        if (!accionistaDTO) {
          throw new Error("No se pudo obtener el accionista del test data");
        }

        console.log(
          "[Test] Creando accionista natural con datos del seed:",
          JSON.stringify(accionistaDTO, null, 2)
        );

        // Crear accionista
        const result = await repository.create(societyId, accionistaDTO);
        logger.logCreate(societyId);

        console.log(
          "[Test] Accionista creado (respuesta del backend):",
          JSON.stringify(result, null, 2)
        );

        // Verificar solo campos que el backend SÍ devuelve (como el seed, solo verifica que no haya error)
        expect(result).toBeDefined();
        if (
          result &&
          isPersonaNatural(result.persona) &&
          isPersonaNatural(accionistaDTO.persona)
        ) {
          expect(result.id).toBeDefined();
          expect(result.persona.tipo).toBe("NATURAL");
          expect(result.persona.nombre).toBe(accionistaDTO.persona.nombre);
          expect(result.persona.apellidoPaterno).toBe(accionistaDTO.persona.apellidoPaterno);
          expect(result.persona.numeroDocumento).toBe(accionistaDTO.persona.numeroDocumento);
          // NO verificar participacionPorcentual: el backend no lo devuelve en la respuesta
        }

        testResults.passed++;
      } catch (error: any) {
        testResults.failed++;
        console.error("[Test] ❌ Error completo:", error);
        console.error("[Test] ❌ Error message:", error?.message);
        console.error("[Test] ❌ Error data:", error?.response?.data || error?.data);
        logger.logError("Error al crear accionista natural", error);
        throw error;
      }
    });

    it("debe crear un accionista jurídico en el backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        // Usar exactamente el helper del seed (que ya funciona)
        const accionistaDTO = createTestAccionistaJuridico(0);

        console.log(
          "[Test] Creando accionista jurídico con datos del seed:",
          JSON.stringify(accionistaDTO, null, 2)
        );

        // Crear accionista
        const result = await repository.create(societyId, accionistaDTO);
        logger.logCreate(societyId);

        console.log(
          "[Test] Accionista creado (respuesta del backend):",
          JSON.stringify(result, null, 2)
        );

        // Verificar solo campos que el backend SÍ devuelve (como el seed, solo verifica que no haya error)
        expect(result).toBeDefined();
        if (result) {
          expect(result.id).toBeDefined();
          expect(result.persona.tipo).toBe("JURIDICA");
          if (
            result.persona.tipo === "JURIDICA" &&
            accionistaDTO.persona.tipo === "JURIDICA"
          ) {
            expect(result.persona.razonSocial).toBe(accionistaDTO.persona.razonSocial);
            expect(result.persona.numeroDocumento).toBe(accionistaDTO.persona.numeroDocumento);
          }
          // NO verificar participacionPorcentual: el backend no lo devuelve en la respuesta
        }

        testResults.passed++;
      } catch (error: any) {
        testResults.failed++;
        console.error("[Test] ❌ Error completo:", error);
        console.error("[Test] ❌ Error message:", error?.message);
        console.error("[Test] ❌ Error data:", error?.response?.data || error?.data);
        logger.logError("Error al crear accionista jurídico", error);
        throw error;
      }
    });

    it("debe crear múltiples accionistas en la misma sociedad", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        // Usar exactamente la misma data que el seed (que funciona)
        const testData = generateTestData(0);
        const accionista1 = testData.accionistas[0]; // Juan
        const accionista2 = testData.accionistas[1]; // María

        if (!accionista1 || !accionista2) {
          throw new Error("No se pudieron obtener los accionistas del test data");
        }

        console.log("[Test] Creando múltiples accionistas con datos del seed:");
        console.log("[Test] Accionista 1 (Juan):", JSON.stringify(accionista1, null, 2));
        console.log("[Test] Accionista 2 (María):", JSON.stringify(accionista2, null, 2));

        // Crear ambos accionistas
        const result1 = await repository.create(societyId, accionista1);
        const result2 = await repository.create(societyId, accionista2);
        logger.logCreate(societyId);

        console.log(
          "[Test] Accionista 1 creado (respuesta backend):",
          JSON.stringify(result1, null, 2)
        );
        console.log(
          "[Test] Accionista 2 creado (respuesta backend):",
          JSON.stringify(result2, null, 2)
        );

        expect(result1.id).not.toBe(result2.id);
        if (
          result1 &&
          result2 &&
          isPersonaNatural(result1.persona) &&
          accionista1 &&
          isPersonaNatural(accionista1.persona) &&
          isPersonaNatural(result2.persona) &&
          accionista2 &&
          isPersonaNatural(accionista2.persona)
        ) {
          expect(result1.persona.nombre).toBe(accionista1.persona.nombre);
          expect(result2.persona.nombre).toBe(accionista2.persona.nombre);
        }
        // NO verificar participacionPorcentual: el backend no lo devuelve en la respuesta

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al crear múltiples accionistas", error);
        throw error;
      }
    });
  });

  describe("GET /api/v2/society-profile/:id/shareholder - Backend Real", () => {
    it("debe listar accionistas de una sociedad del backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        // Usar exactamente la misma data que el seed (que funciona)
        const testData = generateTestData(0);
        const accionista1 = testData.accionistas[0]; // Juan
        const accionista2 = testData.accionistas[1]; // María

        if (!accionista1 || !accionista2) {
          throw new Error("No se pudieron obtener los accionistas del test data");
        }

        // Crear accionistas
        await repository.create(societyId, accionista1);
        await repository.create(societyId, accionista2);

        // Listar
        const result = await repository.list(societyId);
        logger.logList();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThanOrEqual(2);

        // Verificar que los accionistas creados están en la lista
        const found1 = result.find(
          (a) => a.persona.tipo === "NATURAL" && a.persona.nombre === "Juan"
        );
        const found2 = result.find(
          (a) => a.persona.tipo === "NATURAL" && a.persona.nombre === "María"
        );
        expect(found1).toBeDefined();
        expect(found2).toBeDefined();

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al listar accionistas", error);
        throw error;
      }
    });

    it("debe retornar array vacío si la sociedad no tiene accionistas", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();

        // Listar sin crear accionistas
        const result = await repository.list(societyId);
        logger.logList();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al listar accionistas vacíos", error);
        throw error;
      }
    });
  });

  describe("PUT /api/v2/society-profile/:id/shareholder - Backend Real", () => {
    it("debe actualizar un accionista existente en el backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        // Usar exactamente la misma data que el seed (que funciona)
        const testData = generateTestData(0);
        const accionistaDTO = testData.accionistas[0]; // Juan

        if (!accionistaDTO) {
          throw new Error("No se pudo obtener el accionista del test data");
        }

        // Crear accionista
        const created = await repository.create(societyId, accionistaDTO);
        if (isPersonaNatural(created.persona)) {
          expect(created.persona.nombre).toBe("Juan");
        }

        // Actualizar
        const updatedDTO: AccionistaDTO = {
          ...accionistaDTO,
          id: created.id,
          persona: {
            ...accionistaDTO.persona,
            id: created.persona.id,
            ...(isPersonaNatural(accionistaDTO.persona) && {
              nombre: "Juan Carlos",
              apellidoPaterno: "Pérez García",
            }),
          } as any,
        };

        const updated = await repository.update(societyId, updatedDTO);
        logger.logCreate(societyId);

        expect(updated.id).toBe(created.id);
        if (isPersonaNatural(updated.persona)) {
          expect(updated.persona.nombre).toBe("Juan Carlos");
          expect(updated.persona.apellidoPaterno).toBe("Pérez García");
        }

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al actualizar accionista", error);
        throw error;
      }
    });
  });

  describe("DELETE /api/v2/society-profile/:id/shareholder/:accionistaId - Backend Real", () => {
    it("debe eliminar un accionista del backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        // Usar exactamente la misma data que el seed (que funciona)
        const testData = generateTestData(0);
        const accionistaDTO = testData.accionistas[0]; // Juan

        if (!accionistaDTO) {
          throw new Error("No se pudo obtener el accionista del test data");
        }

        // Crear accionista
        const created = await repository.create(societyId, accionistaDTO);

        // Verificar que existe
        let list = await repository.list(societyId);
        expect(list.find((a) => a.id === created.id)).toBeDefined();

        // Eliminar
        await repository.delete(societyId, created.id);
        logger.logDelete(created.id, true);

        // Verificar que fue eliminado
        list = await repository.list(societyId);
        expect(list.find((a) => a.id === created.id)).toBeUndefined();

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al eliminar accionista", error);
        throw error;
      }
    });
  });

  describe("Flujo completo - Backend Real", () => {
    it("debe ejecutar flujo completo (crear, listar, actualizar, eliminar) contra backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        // Usar exactamente la misma data que el seed (que funciona)
        const testData = generateTestData(0);
        const accionistaDTO = testData.accionistas[0]; // Juan

        if (!accionistaDTO) {
          throw new Error("No se pudo obtener el accionista del test data");
        }

        // CREATE
        const created = await repository.create(societyId, accionistaDTO);
        logger.logCreate(societyId);
        if (isPersonaNatural(created.persona)) {
          expect(created.persona.nombre).toBe("Juan");
        }

        // READ (list)
        let list = await repository.list(societyId);
        logger.logList();
        expect(list.find((a) => a.id === created.id)).toBeDefined();

        // UPDATE
        const updatedDTO: AccionistaDTO = {
          ...accionistaDTO,
          id: created.id,
          persona: {
            ...accionistaDTO.persona,
            id: created.persona.id,
            ...(isPersonaNatural(accionistaDTO.persona) && {
              nombre: "Juan Actualizado",
            }),
          } as any,
        };
        const updated = await repository.update(societyId, updatedDTO);
        logger.logCreate(societyId);
        if (isPersonaNatural(updated.persona)) {
          expect(updated.persona.nombre).toBe("Juan Actualizado");
        }

        // DELETE
        await repository.delete(societyId, created.id);
        logger.logDelete(created.id, true);

        // Verificar eliminación
        list = await repository.list(societyId);
        logger.logList();
        expect(list.find((a) => a.id === created.id)).toBeUndefined();

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error en flujo completo", error);
        throw error;
      }
    });
  });
});
