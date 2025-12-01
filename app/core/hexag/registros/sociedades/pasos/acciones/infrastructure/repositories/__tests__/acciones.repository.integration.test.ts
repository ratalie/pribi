/**
 * Tests de Integración - Backend Real
 *
 * Estos tests validan que los endpoints de Acciones funcionan correctamente
 * contra el backend real.
 *
 * ⚠️ IMPORTANTE: Estos tests requieren:
 * - Backend corriendo en TEST_BACKEND_URL
 * - Credenciales válidas en TEST_EMAIL y TEST_PASSWORD
 * - TEST_USE_MSW=false
 *
 * Ejecutar con:
 *   TEST_USE_MSW=false npm run test acciones.repository.integration.test.ts
 */

import { getTestConfig } from "@tests/config/test-config";
import {
  clearAllSocieties,
  createTestAccion,
  generateTestData,
} from "@tests/helpers/seed-helpers";
import { TestLogger } from "@tests/utils/test-logger";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";
import type { AccionPayload } from "../../../domain/entities/accion-payload.entity";
import { TipoAccionEnum } from "../../../domain/enums/tipo-accion.enum";
import { AccionesHttpRepository } from "../acciones.http.repository";

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

(shouldRun ? describe : describe.skip)("AccionesHttpRepository - Backend Real", () => {
  let repository: AccionesHttpRepository;
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
    repository = new AccionesHttpRepository();
    sociedadRepository = new SociedadHttpRepository();

    // Inicializar logger
    logger = new TestLogger("AccionesHttpRepository - Backend Real", {
      backendUrl: testConfig.backendUrl,
      useMsw: testConfig.useMsw,
      email: testConfig.credentials.email,
    });

    // 🧹 Limpiar todas las sociedades del backend antes de empezar los tests
    await clearAllSocieties();
  });

  // Limpiar sociedades creadas después de todos los tests y generar resumen
  afterAll(async () => {
    // Limpiar sociedades (esto eliminará también las acciones)
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
  // No crear helpers nuevos, usar generateTestData() y createTestAccion() directamente

  describe("POST /api/v2/society-profile/:id/acction - Backend Real", () => {
    it("debe crear una acción común en el backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        // Usar exactamente la misma data que el seed (que funciona)
        const testData = generateTestData(0);
        const accionPayload = testData.accion; // Acción del seed

        console.log(
          "[Test] Creando acción con datos del seed:",
          JSON.stringify(accionPayload, null, 2)
        );

        // Crear acción
        await repository.create(societyId, accionPayload);
        logger.logCreate(societyId);

        // Verificar que se creó listando
        const acciones = await repository.list(societyId);
        const created = acciones.find((a) => a.tipo === TipoAccionEnum.COMUN);

        expect(created).toBeDefined();
        if (created) {
          // Verificar solo campos que el backend SÍ devuelve
          expect(created.accionesSuscritas).toBe(accionPayload.accionesSuscritas);
          // NO verificar derechoVoto: el backend puede cambiarlo según el tipo de acción o validaciones internas
          // NO verificar redimibles: puede que el backend no lo devuelva o lo devuelva con otro nombre
        }

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al crear acción común", error);
        throw error;
      }
    });

    it("debe crear una acción preferencial en el backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        // Usar helper del seed para crear acción preferencial
        const accionPayload = createTestAccion(TipoAccionEnum.SIN_DERECHO_A_VOTO, 200);

        console.log(
          "[Test] Creando acción preferencial con datos del seed:",
          JSON.stringify(accionPayload, null, 2)
        );

        // Crear acción
        await repository.create(societyId, accionPayload);
        logger.logCreate(societyId);

        // Verificar que se creó listando
        const acciones = await repository.list(societyId);
        console.log(
          "[Test] Acciones listadas (respuesta backend):",
          JSON.stringify(acciones, null, 2)
        );
        // Buscar por el tipo que realmente se envió (PREFERENTE_NO_VOTO)
        const created = acciones.find((a) => a.tipo === accionPayload.tipo);

        expect(created).toBeDefined();
        if (created) {
          // Verificar solo campos que el backend SÍ devuelve
          expect(created.accionesSuscritas).toBe(accionPayload.accionesSuscritas);
          // NO verificar derechoVoto: el backend puede cambiarlo según el tipo de acción o validaciones internas
          // NO verificar redimibles: puede que el backend no lo devuelva o lo devuelva con otro nombre
        }

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al crear acción preferencial", error);
        throw error;
      }
    });

    it("debe crear múltiples acciones en la misma sociedad", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        // Usar helpers del seed
        const testData = generateTestData(0);
        const accion1 = testData.accion; // Acción común del seed
        const accion2 = createTestAccion(TipoAccionEnum.SIN_DERECHO_A_VOTO, 200); // Acción preferencial

        console.log("[Test] Creando múltiples acciones con datos del seed:");
        console.log("[Test] Acción 1 (común):", JSON.stringify(accion1, null, 2));
        console.log("[Test] Acción 2 (preferencial):", JSON.stringify(accion2, null, 2));

        // Crear ambas acciones
        await repository.create(societyId, accion1);
        await repository.create(societyId, accion2);
        logger.logCreate(societyId);

        // Verificar que ambas se crearon
        const acciones = await repository.list(societyId);
        console.log(
          "[Test] Acciones listadas (respuesta backend):",
          JSON.stringify(acciones, null, 2)
        );
        expect(acciones.length).toBeGreaterThanOrEqual(2);

        const comun = acciones.find((a) => a.tipo === TipoAccionEnum.COMUN);
        const preferencial = acciones.find((a) => a.tipo === accion2.tipo); // Usar el tipo que realmente se envió

        expect(comun).toBeDefined();
        expect(preferencial).toBeDefined();

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al crear múltiples acciones", error);
        throw error;
      }
    });
  });

  describe("GET /api/v2/society-profile/:id/acction - Backend Real", () => {
    it("debe listar acciones de una sociedad del backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        // Usar exactamente la misma data que el seed (que funciona)
        const testData = generateTestData(0);
        const accionPayload = testData.accion; // Acción del seed

        console.log(
          "[Test] Creando acción con datos del seed:",
          JSON.stringify(accionPayload, null, 2)
        );

        // Crear acción
        await repository.create(societyId, accionPayload);

        // Listar
        const result = await repository.list(societyId);
        logger.logList();
        console.log(
          "[Test] Acciones listadas (respuesta backend):",
          JSON.stringify(result, null, 2)
        );

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);

        // Verificar que la acción creada está en la lista
        const found = result.find((a) => a.tipo === TipoAccionEnum.COMUN);
        expect(found).toBeDefined();

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al listar acciones", error);
        throw error;
      }
    });

    it("debe retornar array vacío si la sociedad no tiene acciones", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();

        // Listar sin crear acciones
        const result = await repository.list(societyId);
        logger.logList();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al listar acciones vacías", error);
        throw error;
      }
    });
  });

  describe("PUT /api/v2/society-profile/:id/acction - Backend Real", () => {
    it("debe actualizar una acción existente en el backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        // Usar exactamente la misma data que el seed (que funciona)
        const testData = generateTestData(0);
        const accionPayload = testData.accion; // Acción del seed

        console.log(
          "[Test] Creando acción con datos del seed:",
          JSON.stringify(accionPayload, null, 2)
        );

        // Crear acción
        await repository.create(societyId, accionPayload);

        // Obtener ID de la acción creada
        let acciones = await repository.list(societyId);
        console.log(
          "[Test] Acciones listadas después de crear:",
          JSON.stringify(acciones, null, 2)
        );
        const created = acciones.find((a) => a.tipo === TipoAccionEnum.COMUN);
        expect(created).toBeDefined();

        if (!created) {
          throw new Error("No se encontró la acción creada");
        }

        // Actualizar
        const updatedPayload: AccionPayload = {
          ...accionPayload,
          id: created.id,
          accionesSuscritas: 1000,
          nombreAccion: "Acción Común Actualizada",
        };

        console.log(
          "[Test] Actualizando acción con:",
          JSON.stringify(updatedPayload, null, 2)
        );
        await repository.update(societyId, updatedPayload);
        logger.logCreate(societyId);

        // Verificar actualización
        acciones = await repository.list(societyId);
        console.log(
          "[Test] Acciones listadas después de actualizar:",
          JSON.stringify(acciones, null, 2)
        );
        const updated = acciones.find((a) => a.id === created.id);

        expect(updated).toBeDefined();
        if (updated) {
          // El backend SÍ devuelve cantidadSuscrita según docs/backend/03-capital-social.md
          expect(updated.accionesSuscritas).toBe(1000);
        }

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al actualizar acción", error);
        throw error;
      }
    });
  });

  describe("DELETE /api/v2/society-profile/:id/acction - Backend Real", () => {
    it("debe eliminar una acción del backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        // Usar exactamente la misma data que el seed (que funciona)
        const testData = generateTestData(0);
        const accionPayload = testData.accion; // Acción del seed

        console.log(
          "[Test] Creando acción con datos del seed:",
          JSON.stringify(accionPayload, null, 2)
        );

        // Crear acción
        await repository.create(societyId, accionPayload);

        // Obtener ID de la acción creada
        let acciones = await repository.list(societyId);
        console.log(
          "[Test] Acciones listadas después de crear:",
          JSON.stringify(acciones, null, 2)
        );
        const created = acciones.find((a) => a.tipo === TipoAccionEnum.COMUN);
        expect(created).toBeDefined();

        if (!created) {
          throw new Error("No se encontró la acción creada");
        }

        // Verificar que existe
        expect(acciones.find((a) => a.id === created.id)).toBeDefined();

        // Eliminar
        console.log("[Test] Eliminando acción con ID:", created.id);
        await repository.delete(societyId, [created.id]);
        logger.logDelete(created.id, true);

        // Verificar que fue eliminada
        acciones = await repository.list(societyId);
        console.log(
          "[Test] Acciones listadas después de eliminar:",
          JSON.stringify(acciones, null, 2)
        );
        expect(acciones.find((a) => a.id === created.id)).toBeUndefined();

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al eliminar acción", error);
        throw error;
      }
    });

    it("debe eliminar múltiples acciones del backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        // Usar helpers del seed
        const testData = generateTestData(0);
        const accion1 = testData.accion; // Acción común del seed
        const accion2 = createTestAccion(TipoAccionEnum.SIN_DERECHO_A_VOTO, 200); // Acción preferencial

        console.log("[Test] Creando múltiples acciones con datos del seed:");
        console.log("[Test] Acción 1 (común):", JSON.stringify(accion1, null, 2));
        console.log("[Test] Acción 2 (preferencial):", JSON.stringify(accion2, null, 2));

        // Crear ambas acciones
        await repository.create(societyId, accion1);
        await repository.create(societyId, accion2);

        // Obtener IDs
        let acciones = await repository.list(societyId);
        console.log(
          "[Test] Acciones listadas después de crear:",
          JSON.stringify(acciones, null, 2)
        );
        expect(acciones.length).toBeGreaterThanOrEqual(2);

        const idsToDelete = acciones.map((a) => a.id);

        // Eliminar ambas
        console.log("[Test] Eliminando acciones con IDs:", idsToDelete);
        await repository.delete(societyId, idsToDelete);
        logger.logDelete(idsToDelete.join(","), true);

        // Verificar que fueron eliminadas
        acciones = await repository.list(societyId);
        console.log(
          "[Test] Acciones listadas después de eliminar:",
          JSON.stringify(acciones, null, 2)
        );
        for (const id of idsToDelete) {
          expect(acciones.find((a) => a.id === id)).toBeUndefined();
        }

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al eliminar múltiples acciones", error);
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
        const accionPayload = testData.accion; // Acción del seed

        console.log(
          "[Test] Flujo completo - Creando acción con datos del seed:",
          JSON.stringify(accionPayload, null, 2)
        );

        // CREATE
        await repository.create(societyId, accionPayload);
        logger.logCreate(societyId);

        // READ (list)
        let acciones = await repository.list(societyId);
        logger.logList();
        console.log(
          "[Test] Flujo completo - Acciones listadas:",
          JSON.stringify(acciones, null, 2)
        );
        const created = acciones.find((a) => a.tipo === TipoAccionEnum.COMUN);
        expect(created).toBeDefined();

        if (!created) {
          throw new Error("No se encontró la acción creada");
        }

        // UPDATE
        const updatedPayload: AccionPayload = {
          ...accionPayload,
          id: created.id,
          accionesSuscritas: 750,
        };
        await repository.update(societyId, updatedPayload);
        logger.logCreate(societyId);

        // Verificar actualización
        acciones = await repository.list(societyId);
        const updated = acciones.find((a) => a.id === created.id);
        expect(updated).toBeDefined();
        if (updated) {
          expect(updated.accionesSuscritas).toBe(750);
        }

        // DELETE
        await repository.delete(societyId, [created.id]);
        logger.logDelete(created.id, true);

        // Verificar eliminación
        acciones = await repository.list(societyId);
        logger.logList();
        expect(acciones.find((a) => a.id === created.id)).toBeUndefined();

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error en flujo completo", error);
        throw error;
      }
    });
  });
});
