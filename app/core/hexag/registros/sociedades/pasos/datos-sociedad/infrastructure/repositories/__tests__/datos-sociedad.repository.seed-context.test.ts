/**
 * Tests de Integración con Seed Context
 *
 * Estos tests usan el seed de 5 sociedades como contexto.
 * Cada test puede usar las sociedades ya creadas para testear su funcionalidad específica.
 *
 * ⚠️ IMPORTANTE: Estos tests requieren:
 * - Backend corriendo en TEST_BACKEND_URL
 * - Credenciales válidas en TEST_EMAIL y TEST_PASSWORD
 * - TEST_USE_MSW=false
 *
 * Ejecutar con:
 *   TEST_USE_MSW=false npm run test datos-sociedad.repository.seed-context.test.ts
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DatosSociedadHttpRepository } from "../datos-sociedad.http.repository";
import { getTestConfig } from "@tests/config/test-config";
import { TestLogger } from "@tests/utils/test-logger";
import {
  createSeedContext,
  cleanupSeedContext,
  type SeedContext,
} from "@tests/helpers/seed-context.helper";
import type { DatosSociedadDTO } from "../../../application/dtos/datos-sociedad.dto";

const testConfig = getTestConfig();

// ⚠️ Solo ejecutar si NO estamos usando MSW
const shouldRun = !testConfig.useMsw;

(shouldRun ? describe : describe.skip)(
  "DatosSociedadHttpRepository - Con Seed Context",
  () => {
    let repository: DatosSociedadHttpRepository;
    let seedContext: SeedContext | null = null;
    let logger: TestLogger;
    const testResults: { total: number; passed: number; failed: number } = {
      total: 0,
      passed: 0,
      failed: 0,
    };

    beforeAll(async () => {
      if (testConfig.useMsw) {
        console.warn("⚠️ Estos tests requieren TEST_USE_MSW=false");
        return;
      }

      repository = new DatosSociedadHttpRepository();

      // Inicializar logger
      logger = new TestLogger("DatosSociedadHttpRepository - Seed Context", {
        backendUrl: testConfig.backendUrl,
        useMsw: testConfig.useMsw,
        email: testConfig.credentials.email,
      });

      // 🧹 Limpiar BD antes de crear seed
      console.log("🧹 [Seed Context] Limpiando BD antes de crear seed...");
      try {
        const { clearAllSocieties } = await import("@tests/helpers/seed-helpers");
        await clearAllSocieties();
      } catch (error) {
        console.warn("⚠️ Error al limpiar BD:", error);
      }

      // 🌱 Crear seed context (5 sociedades completas)
      seedContext = await createSeedContext();

      if (!seedContext || seedContext.societies.length === 0) {
        throw new Error("No se pudo crear el seed context");
      }

      console.log(
        `✅ [Seed Context] ${seedContext.societies.length} sociedades listas para tests\n`
      );
    });

    afterAll(async () => {
      // Limpiar seed context
      if (seedContext) {
        await cleanupSeedContext(seedContext);
      }

      // Generar resumen
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

    describe("GET /api/v2/society-profile/:id/society - Con Seed Context", () => {
      it("debe obtener datos de todas las sociedades del seed", async () => {
        testResults.total++;
        try {
          if (!seedContext) {
            throw new Error("Seed context no disponible");
          }

          // Testear cada sociedad del seed
          for (let i = 0; i < seedContext.societies.length; i++) {
            const society = seedContext.societies[i]!;
            const datos = await repository.get(society.societyId);
            logger.logList();

            expect(datos).not.toBeNull();
            if (datos) {
              expect(datos.razonSocial).toBe(`Empresa Test ${i + 1}`);
              expect(datos.numeroRuc).toBeDefined();
            }
          }

          testResults.passed++;
        } catch (error) {
          testResults.failed++;
          logger.logError("Error al obtener datos del seed", error);
          throw error;
        }
      });

      it("debe poder actualizar datos de una sociedad del seed", async () => {
        testResults.total++;
        try {
          if (!seedContext || seedContext.societies.length === 0) {
            throw new Error("Seed context no disponible");
          }

          // Usar la primera sociedad del seed
          const society = seedContext.societies[0]!;
          const datosActuales = await repository.get(society.societyId);

          if (!datosActuales) {
            throw new Error("No se encontraron datos de la sociedad");
          }

          // Actualizar
          const datosActualizados: DatosSociedadDTO = {
            ...datosActuales,
            razonSocial: "Empresa Actualizada desde Test",
            nombreComercial: "Empresa Actualizada S.A.C.",
          };

          const updated = await repository.update(society.societyId, datosActualizados);
          logger.logCreate(society.societyId);

          expect(updated.razonSocial).toBe("Empresa Actualizada desde Test");

          // Verificar que se guardó
          const verificacion = await repository.get(society.societyId);
          expect(verificacion?.razonSocial).toBe("Empresa Actualizada desde Test");

          testResults.passed++;
        } catch (error) {
          testResults.failed++;
          logger.logError("Error al actualizar datos del seed", error);
          throw error;
        }
      });
    });

    describe("Validaciones con Seed Context", () => {
      it("debe tener todas las sociedades con datos completos", async () => {
        testResults.total++;
        try {
          if (!seedContext) {
            throw new Error("Seed context no disponible");
          }

          for (const society of seedContext.societies) {
            const datos = await repository.get(society.societyId);
            expect(datos).not.toBeNull();
            expect(datos?.razonSocial).toBeDefined();
            expect(datos?.numeroRuc).toBeDefined();
          }

          testResults.passed++;
        } catch (error) {
          testResults.failed++;
          logger.logError("Error validando seed context", error);
          throw error;
        }
      });
    });
  }
);

