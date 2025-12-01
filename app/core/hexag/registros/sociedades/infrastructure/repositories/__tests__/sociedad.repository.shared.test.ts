/**
 * Tests Compartidos para Repositorios de Sociedades
 *
 * Este archivo contiene tests que se ejecutan con AMBOS repositorios:
 * - SociedadHttpRepository (HTTP real o interceptado por MSW)
 * - SociedadMswRepository (directo al state mock)
 *
 * @pattern Shared Test Suite - Repository Contract Testing
 *
 * Objetivo: Garantizar que ambos repositorios implementan el mismo contrato
 * y producen los mismos resultados para las mismas operaciones.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { clearAllMockData } from "~/core/hexag/registros/shared/mock-database";
import type { SociedadRepository } from "../../../domain/ports/sociedad.repository";
import { SociedadHttpRepository } from "../sociedad.http.repository";
import { SociedadMswRepository } from "../sociedad.msw.repository";

/**
 * Suite de tests compartidos
 *
 * Se ejecuta una vez por cada repositorio usando describe.each
 */
describe.each([
  { name: "SociedadHttpRepository", factory: () => new SociedadHttpRepository() },
  { name: "SociedadMswRepository", factory: () => new SociedadMswRepository() },
])("$name - Tests Compartidos", ({ name: _name, factory }) => {
  let repository: SociedadRepository;

  beforeEach(async () => {
    repository = factory();
    // Limpiar datos mock antes de cada test
    await clearAllMockData();
  });

  describe("create() - POST /api/v2/society-profile", () => {
    it("debe crear una sociedad y retornar structureId como string", async () => {
      const structureId = await repository.create();

      expect(structureId).toBeDefined();
      expect(typeof structureId).toBe("string");
      expect(structureId.length).toBeGreaterThan(0);

      // Debe ser un número válido (el backend retorna números)
      const numericId = Number(structureId);
      expect(Number.isInteger(numericId)).toBe(true);
      expect(numericId).toBeGreaterThan(0);
    });

    it("debe crear múltiples sociedades con IDs incrementales", async () => {
      const id1 = await repository.create();
      const id2 = await repository.create();
      const id3 = await repository.create();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id3).toBeDefined();

      // Los IDs deben ser diferentes
      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);

      // Deben ser números incrementales
      const num1 = Number(id1);
      const num2 = Number(id2);
      const num3 = Number(id3);

      expect(num2).toBeGreaterThan(num1);
      expect(num3).toBeGreaterThan(num2);
    });

    it("debe retornar structureId en formato string", async () => {
      const structureId = await repository.create();

      // Debe ser string (el repositorio convierte number a string)
      expect(typeof structureId).toBe("string");

      // Debe ser parseable a número
      const numericId = Number(structureId);
      expect(Number.isInteger(numericId)).toBe(true);
    });
  });

  describe("list() - GET /api/v2/society-profile/list", () => {
    it("debe retornar un array vacío cuando no hay sociedades", async () => {
      const result = await repository.list();

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it("debe listar todas las sociedades creadas", async () => {
      // Crear 3 sociedades
      await repository.create();
      await repository.create();
      await repository.create();

      const result = await repository.list();

      expect(result).toHaveLength(3);
      expect(Array.isArray(result)).toBe(true);
    });

    it("debe retornar sociedades con estructura correcta", async () => {
      await repository.create();

      const result = await repository.list();

      expect(result).toHaveLength(1);

      const sociedad = result[0];
      expect(sociedad).toHaveProperty("idSociety");
      expect(sociedad).toHaveProperty("razonSocial");
      expect(sociedad).toHaveProperty("ruc");
      expect(sociedad).toHaveProperty("directorio");
      expect(sociedad).toHaveProperty("pasoActual");
      expect(sociedad).toHaveProperty("createdAt");
      expect(sociedad).toHaveProperty("updatedAt");
    });

    it("debe retornar sociedades ordenadas por fecha de creación (más recientes primero)", async () => {
      const id1 = await repository.create();
      // Pequeña pausa para asegurar diferentes timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));
      const id2 = await repository.create();

      const result = await repository.list();

      expect(result).toHaveLength(2);
      // La más reciente debe estar primero
      expect(result[0]?.idSociety).toBe(id2);
      expect(result[1]?.idSociety).toBe(id1);
    });
  });

  describe("delete() - DELETE /api/v2/society-profile/:id", () => {
    it("debe eliminar una sociedad existente", async () => {
      // Crear sociedad
      const structureId = await repository.create();

      // Verificar que existe
      let list = await repository.list();
      expect(list.find((s) => s.idSociety === structureId)).toBeDefined();

      // Eliminar
      await repository.delete(structureId);

      // Verificar que fue eliminada
      list = await repository.list();
      expect(list.find((s) => s.idSociety === structureId)).toBeUndefined();
    });

    it("debe lanzar error si la sociedad no existe", async () => {
      await expect(repository.delete("999999")).rejects.toThrow();
    });

    it("debe eliminar solo la sociedad especificada", async () => {
      // Crear 2 sociedades
      const id1 = await repository.create();
      const id2 = await repository.create();

      // Eliminar solo la primera
      await repository.delete(id1);

      // Verificar que solo quedó la segunda
      const list = await repository.list();
      expect(list).toHaveLength(1);
      expect(list[0]?.idSociety).toBe(id2);
    });
  });

  describe("Flujo completo CRUD", () => {
    it("debe permitir crear, listar y eliminar sociedades", async () => {
      // CREATE
      const structureId = await repository.create();
      expect(structureId).toBeDefined();

      // READ (list)
      let list = await repository.list();
      expect(list).toHaveLength(1);
      expect(list[0]?.idSociety).toBe(structureId);

      // DELETE
      await repository.delete(structureId);

      // Verificar eliminación
      list = await repository.list();
      expect(list).toHaveLength(0);
    });

    it("debe manejar múltiples operaciones secuenciales", async () => {
      // Crear 3 sociedades
      const id1 = await repository.create();
      const id2 = await repository.create();
      const id3 = await repository.create();

      // Listar (debe tener 3)
      let list = await repository.list();
      expect(list).toHaveLength(3);

      // Eliminar la del medio
      await repository.delete(id2);

      // Listar (debe tener 2)
      list = await repository.list();
      expect(list).toHaveLength(2);
      expect(list.find((s) => s.idSociety === id1)).toBeDefined();
      expect(list.find((s) => s.idSociety === id2)).toBeUndefined();
      expect(list.find((s) => s.idSociety === id3)).toBeDefined();
    });
  });
});
