/**
 * Tests de Integración - Backend Real
 *
 * Estos tests validan que los endpoints de Apoderados funcionan correctamente
 * contra el backend real.
 *
 * ⚠️ IMPORTANTE: Estos tests requieren:
 * - Backend corriendo en TEST_BACKEND_URL
 * - Credenciales válidas en TEST_EMAIL y TEST_PASSWORD
 * - TEST_USE_MSW=false
 *
 * Ejecutar con:
 *   TEST_USE_MSW=false npm run test apoderados.repository.integration.test.ts
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ApoderadosHttpRepository } from "../apoderados.http.repository";
import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";
import { getTestConfig } from "@tests/config/test-config";
import { TestLogger } from "@tests/utils/test-logger";
import { clearAllSocieties } from "@tests/helpers/seed-helpers";
import type { ClaseApoderadoDTO, ApoderadoDTO } from "../../../application";

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

(shouldRun ? describe : describe.skip)("ApoderadosHttpRepository - Backend Real", () => {
  let repository: ApoderadosHttpRepository;
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
    repository = new ApoderadosHttpRepository();
    sociedadRepository = new SociedadHttpRepository();

    // Inicializar logger
    logger = new TestLogger("ApoderadosHttpRepository - Backend Real", {
      backendUrl: testConfig.backendUrl,
      useMsw: testConfig.useMsw,
      email: testConfig.credentials.email,
    });

    // 🧹 Limpiar todas las sociedades del backend antes de empezar los tests
    await clearAllSocieties();
  });

  // Limpiar sociedades creadas después de todos los tests y generar resumen
  afterAll(async () => {
    // Limpiar sociedades (esto eliminará también los apoderados)
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
   * Helper para crear una clase de apoderado de prueba
   */
  function createClaseApoderadoDTO(): ClaseApoderadoDTO {
    return {
      id: generateUUID(),
      nombre: "Gerente General",
    };
  }

  /**
   * Helper para crear un apoderado de prueba
   */
  function createApoderadoDTO(claseApoderadoId: string): ApoderadoDTO {
    const timestamp = Date.now();
    return {
      id: generateUUID(),
      claseApoderadoId,
      persona: {
        id: generateUUID(),
        tipo: "NATURAL",
        nombre: "Roberto",
        apellidoPaterno: "Silva",
        apellidoMaterno: "Mendoza",
        numeroDocumento: String(timestamp).slice(-8).padStart(8, "0"),
        tipoDocumento: "DNI",
        fechaNacimiento: "01-01-1985",
        nacionalidad: "Peruana",
        estadoCivil: "CASADO",
        direccion: "Av. Gerente 789",
        distrito: "San Isidro",
        provincia: "Lima",
        departamento: "Lima",
      } as any,
    };
  }

  describe("POST /api/v2/society-profile/:id/attorney-register/classes - Backend Real", () => {
    it("debe crear una clase de apoderado en el backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        const claseDTO = createClaseApoderadoDTO();

        // Crear clase de apoderado
        const result = await repository.createClase(societyId, claseDTO);
        logger.logCreate(societyId);

        expect(result).toBeDefined();
        expect(result.nombre).toBe(claseDTO.nombre);

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al crear clase de apoderado", error);
        throw error;
      }
    });
  });

  describe("GET /api/v2/society-profile/:id/attorney-register/classes - Backend Real", () => {
    it("debe listar clases de apoderado de una sociedad del backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();
        const claseDTO = createClaseApoderadoDTO();

        // Crear clase
        await repository.createClase(societyId, claseDTO);

        // Listar
        const result = await repository.listClases(societyId);
        logger.logList();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);

        // Verificar que la clase creada está en la lista
        const found = result.find((c) => c.nombre === claseDTO.nombre);
        expect(found).toBeDefined();

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al listar clases de apoderado", error);
        throw error;
      }
    });
  });

  describe("POST /api/v2/society-profile/:id/attorney-register/attorneys - Backend Real", () => {
    it("debe crear un apoderado en el backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();

        // Crear clase de apoderado primero
        const claseDTO = createClaseApoderadoDTO();
        const clase = await repository.createClase(societyId, claseDTO);

        // Crear apoderado
        const apoderadoDTO = createApoderadoDTO(clase.id);
        const result = await repository.createApoderado(societyId, apoderadoDTO);
        logger.logCreate(societyId);

        expect(result).toBeDefined();
        expect(result.claseApoderadoId).toBe(clase.id);
        if (result.persona && result.persona.tipo === "NATURAL" && apoderadoDTO.persona.tipo === "NATURAL") {
          expect(result.persona.nombre).toBe(apoderadoDTO.persona.nombre);
          expect(result.persona.apellidoPaterno).toBe(apoderadoDTO.persona.apellidoPaterno);
        }

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al crear apoderado", error);
        throw error;
      }
    });
  });

  describe("GET /api/v2/society-profile/:id/attorney-register/attorneys - Backend Real", () => {
    it("debe listar apoderados de una sociedad del backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();

        // Crear clase y apoderado
        const clase = await repository.createClase(societyId, createClaseApoderadoDTO());
        const apoderadoDTO = createApoderadoDTO(clase.id);
        await repository.createApoderado(societyId, apoderadoDTO);

        // Listar
        const result = await repository.listApoderados(societyId);
        logger.logList();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);

        // Verificar que el apoderado creado está en la lista
        const found = result.find((a) => a.claseApoderadoId === clase.id);
        expect(found).toBeDefined();

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al listar apoderados", error);
        throw error;
      }
    });
  });

  describe("PUT /api/v2/society-profile/:id/attorney-register/attorneys - Backend Real", () => {
    it("debe actualizar un apoderado existente en el backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();

        // Crear clase y apoderado
        const clase = await repository.createClase(societyId, createClaseApoderadoDTO());
        const apoderadoDTO = createApoderadoDTO(clase.id);
        const created = await repository.createApoderado(societyId, apoderadoDTO);

        // Actualizar
        const updatedDTO: ApoderadoDTO = {
          ...apoderadoDTO,
          id: created.id,
          persona: {
            ...apoderadoDTO.persona,
            id: created.persona?.id || generateUUID(),
            nombre: "Roberto Actualizado",
          } as any,
        };

        const updated = await repository.updateApoderado(societyId, updatedDTO);
        logger.logCreate(societyId);

        expect(updated.id).toBe(created.id);
        if (updated.persona && updated.persona.tipo === "NATURAL") {
          expect(updated.persona.nombre).toBe("Roberto Actualizado");
        }

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al actualizar apoderado", error);
        throw error;
      }
    });
  });

  describe("DELETE /api/v2/society-profile/:id/attorney-register/attorneys/:apoderadoId - Backend Real", () => {
    it("debe eliminar un apoderado del backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();

        // Crear clase y apoderado
        const clase = await repository.createClase(societyId, createClaseApoderadoDTO());
        const apoderadoDTO = createApoderadoDTO(clase.id);
        const created = await repository.createApoderado(societyId, apoderadoDTO);

        // Verificar que existe
        let list = await repository.listApoderados(societyId);
        expect(list.find((a) => a.id === created.id)).toBeDefined();

        // Eliminar
        await repository.deleteApoderado(societyId, clase.id, created.id);
        logger.logDelete(created.id, true);

        // Verificar que fue eliminado
        list = await repository.listApoderados(societyId);
        expect(list.find((a) => a.id === created.id)).toBeUndefined();

        testResults.passed++;
      } catch (error) {
        testResults.failed++;
        logger.logError("Error al eliminar apoderado", error);
        throw error;
      }
    });
  });

  describe("Flujo completo - Backend Real", () => {
    it("debe ejecutar flujo completo (crear clase, crear apoderado, listar, actualizar, eliminar) contra backend real", async () => {
      testResults.total++;
      try {
        const societyId = await createTestSociety();

        // CREATE clase
        const clase = await repository.createClase(societyId, createClaseApoderadoDTO());
        logger.logCreate(societyId);

        // CREATE apoderado
        const apoderadoDTO = createApoderadoDTO(clase.id);
        const created = await repository.createApoderado(societyId, apoderadoDTO);
        logger.logCreate(societyId);

        // READ (list)
        let list = await repository.listApoderados(societyId);
        logger.logList();
        expect(list.find((a) => a.id === created.id)).toBeDefined();

        // UPDATE
        const updatedDTO: ApoderadoDTO = {
          ...apoderadoDTO,
          id: created.id,
          persona: {
            ...apoderadoDTO.persona,
            id: created.persona?.id || generateUUID(),
            nombre: "Roberto Final",
          } as any,
        };
        const updated = await repository.updateApoderado(societyId, updatedDTO);
        logger.logCreate(societyId);
        if (updated.persona && updated.persona.tipo === "NATURAL") {
          expect(updated.persona.nombre).toBe("Roberto Final");
        }

        // DELETE
        await repository.deleteApoderado(societyId, clase.id, created.id);
        logger.logDelete(created.id, true);

        // Verificar eliminación
        list = await repository.listApoderados(societyId);
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

