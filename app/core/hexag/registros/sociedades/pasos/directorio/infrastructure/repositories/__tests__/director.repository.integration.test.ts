/**
 * Tests de Integración - Backend Real
 *
 * Estos tests validan que los endpoints de Directores funcionan correctamente
 * contra el backend real.
 *
 * ⚠️ IMPORTANTE: Estos tests requieren:
 * - Backend corriendo en TEST_BACKEND_URL
 * - Credenciales válidas en TEST_EMAIL y TEST_PASSWORD
 * - TEST_USE_MSW=false
 *
 * Ejecutar con:
 *   TEST_USE_MSW=false npm run test director.repository.integration.test.ts
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DirectorHttpRepository } from "../director.http.repository";
import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";
import { getTestConfig } from "@tests/config/test-config";
import { TestLogger } from "@tests/utils/test-logger";
import { clearAllSocieties } from "@tests/helpers/seed-helpers";
import type { DirectorDTO } from "../../../application/dtos/director.dto";
import { TipoDirector } from "../../../domain/enums/director-tipo.enum";
import type { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

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

(shouldRun ? describe : describe.skip)("DirectorHttpRepository - Backend Real", () => {
  let repository: DirectorHttpRepository;
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
    repository = new DirectorHttpRepository();
    sociedadRepository = new SociedadHttpRepository();

    // Inicializar logger
    logger = new TestLogger("DirectorHttpRepository - Backend Real", {
      backendUrl: testConfig.backendUrl,
      useMsw: testConfig.useMsw,
      email: testConfig.credentials.email,
    });

    // 🧹 Limpiar todas las sociedades del backend antes de empezar los tests
    await clearAllSocieties();
  });

  // Limpiar sociedades creadas después de todos los tests y generar resumen
  afterAll(async () => {
    // Limpiar sociedades (esto eliminará también los directores)
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

  /**
   * Helper para crear un director titular de prueba
   */
  function createTitularDirectorDTO(): DirectorDTO {
    const timestamp = Date.now();
    return {
      id: generateUUID(),
      persona: {
        id: generateUUID(),
        nombre: "Carlos",
        apellidoPaterno: "Rodríguez",
        apellidoMaterno: "Vargas",
        tipoDocumento: "DNI" as TipoDocumentosEnum,
        numeroDocumento: String(timestamp).slice(-8).padStart(8, "0"),
        paisEmision: "PE",
      },
      rolDirector: TipoDirector.TITULAR,
    };
  }

  /**
   * Helper para crear un director suplente de prueba
   */
  function createSuplenteDirectorDTO(): DirectorDTO {
    const timestamp = Date.now() + 1;
    return {
      id: generateUUID(),
      persona: {
        id: generateUUID(),
        nombre: "Ana",
        apellidoPaterno: "Martínez",
        apellidoMaterno: "Sánchez",
        tipoDocumento: "DNI" as TipoDocumentosEnum,
        numeroDocumento: String(timestamp).slice(-8).padStart(8, "0"),
        paisEmision: "PE",
      },
      rolDirector: TipoDirector.SUPLENTE,
    };
  }

  describe("POST /api/v2/society-profile/:id/director - Backend Real", () => {
    it("debe crear un director titular en el backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        const directorDTO = createTitularDirectorDTO();

        // Crear director
        const result = await repository.create(societyId, directorDTO);
        logger.logCreate(societyId);

        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.rolDirector).toBe(TipoDirector.TITULAR);
        if (result.persona) {
          expect(result.persona.nombre).toBe(directorDTO.persona.nombre);
          expect(result.persona.apellidoPaterno).toBe(directorDTO.persona.apellidoPaterno);
        }

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al crear director titular", error);
        throw error;
      }
    });

    it("debe crear un director suplente en el backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        const directorDTO = createSuplenteDirectorDTO();

        // Crear director
        const result = await repository.create(societyId, directorDTO);
        logger.logCreate(societyId);

        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.rolDirector).toBe(TipoDirector.SUPLENTE);
        if (result.persona) {
          expect(result.persona.nombre).toBe(directorDTO.persona.nombre);
        }

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al crear director suplente", error);
        throw error;
      }
    });

    it("debe crear múltiples directores en la misma sociedad", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        const director1 = createTitularDirectorDTO();
        const director2 = createTitularDirectorDTO();
        director2.persona.nombre = "Luis";
        director2.persona.apellidoPaterno = "Fernández";
        director2.persona.numeroDocumento = String(Date.now() + 2).slice(-8).padStart(8, "0");

        // Crear ambos directores
        const result1 = await repository.create(societyId, director1);
        const result2 = await repository.create(societyId, director2);
        logger.logCreate(societyId);

        expect(result1.id).not.toBe(result2.id);
        expect(result1.rolDirector).toBe(TipoDirector.TITULAR);
        expect(result2.rolDirector).toBe(TipoDirector.TITULAR);

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al crear múltiples directores", error);
        throw error;
      }
    });
  });

  describe("GET /api/v2/society-profile/:id/director - Backend Real", () => {
    it("debe listar directores de una sociedad del backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        const director1 = createTitularDirectorDTO();
        const director2 = createTitularDirectorDTO();
        director2.persona.nombre = "Ana";
        director2.persona.numeroDocumento = String(Date.now() + 1).slice(-8).padStart(8, "0");

        // Crear directores
        await repository.create(societyId, director1);
        await repository.create(societyId, director2);

        // Listar
        const result = await repository.get(societyId);
        logger.logList();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThanOrEqual(2);

        // Verificar que los directores creados están en la lista
        const found1 = result.find((d: any) => d.persona?.nombre === "Carlos");
        const found2 = result.find((d: any) => d.persona?.nombre === "Ana");
        expect(found1).toBeDefined();
        expect(found2).toBeDefined();

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al listar directores", error);
        throw error;
      }
    });

    it("debe retornar array vacío si la sociedad no tiene directores", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();

        // Listar sin crear directores
        const result = await repository.get(societyId);
        logger.logList();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al listar directores vacíos", error);
        throw error;
      }
    });
  });

  describe("PUT /api/v2/society-profile/:id/director - Backend Real", () => {
    it("debe actualizar un director existente en el backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        const directorDTO = createTitularDirectorDTO();

        // Crear director
        const created = await repository.create(societyId, directorDTO);
        expect(created.persona?.nombre).toBe("Carlos");

        // Actualizar
        const updatedDTO: DirectorDTO = {
          ...directorDTO,
          id: created.id,
          persona: {
            ...directorDTO.persona,
            id: created.persona?.id || generateUUID(),
            nombre: "Carlos Actualizado",
            apellidoPaterno: "Rodríguez Actualizado",
          },
        };

        const updated = await repository.update(societyId, created.id, updatedDTO);
        logger.logCreate(societyId);

        expect(updated.id).toBe(created.id);
        if (updated.persona) {
          expect(updated.persona.nombre).toBe("Carlos Actualizado");
          expect(updated.persona.apellidoPaterno).toBe("Rodríguez Actualizado");
        }

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al actualizar director", error);
        throw error;
      }
    });
  });

  describe("DELETE /api/v2/society-profile/:id/director/:directorId - Backend Real", () => {
    it("debe eliminar un director del backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        const directorDTO = createTitularDirectorDTO();

        // Crear director
        const created = await repository.create(societyId, directorDTO);

        // Verificar que existe
        let list = await repository.get(societyId);
        expect(list.find((d: any) => d.id === created.id)).toBeDefined();

        // Eliminar
        await repository.delete(societyId, created.id);
        logger.logDelete(created.id, true);

        // Verificar que fue eliminado
        list = await repository.get(societyId);
        expect(list.find((d: any) => d.id === created.id)).toBeUndefined();

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al eliminar director", error);
        throw error;
      }
    });
  });

  describe("Flujo completo - Backend Real", () => {
    it("debe ejecutar flujo completo (crear, listar, actualizar, eliminar) contra backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        const directorDTO = createTitularDirectorDTO();

        // CREATE
        const created = await repository.create(societyId, directorDTO);
        logger.logCreate(societyId);
        if (created.persona) {
          expect(created.persona.nombre).toBe("Carlos");
        }

        // READ (get)
        let list = await repository.get(societyId);
        logger.logList();
        expect(list.find((d: any) => d.id === created.id)).toBeDefined();

        // UPDATE
        const updatedDTO: DirectorDTO = {
          ...directorDTO,
          id: created.id,
          persona: {
            ...directorDTO.persona,
            id: created.persona?.id || generateUUID(),
            nombre: "Carlos Final",
          },
        };
        const updated = await repository.update(societyId, created.id, updatedDTO);
        logger.logCreate(societyId);
        if (updated.persona) {
          expect(updated.persona.nombre).toBe("Carlos Final");
        }

        // DELETE
        await repository.delete(societyId, created.id);
        logger.logDelete(created.id, true);

        // Verificar eliminación
        list = await repository.get(societyId);
        logger.logList();
        expect(list.find((d: any) => d.id === created.id)).toBeUndefined();

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error en flujo completo", error);
        throw error;
      }
    });
  });
});

