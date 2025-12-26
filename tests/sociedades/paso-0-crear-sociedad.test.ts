/**
 * TEST PASO 0: Crear Sociedad
 * 
 * Tests básicos del flujo de creación de sociedades
 * Usa 1 SOLA sociedad para todos los tests
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";

describe("PASO 0: Crear Sociedad - Backend Real", () => {
  let repository: SociedadHttpRepository;
  let testSocietyId: string;

  beforeAll(async () => {
    console.log('🚀 [Paso 0] Iniciando tests...');
    repository = new SociedadHttpRepository();
    
    // Limpiar sociedades existentes
    try {
      const existing = await repository.list();
      console.log(`🧹 [Paso 0] Limpiando ${existing.length} sociedades existentes...`);
      
      for (const s of existing) {
        await repository.delete(s.idSociety);
      }
      
      console.log('✅ [Paso 0] BD limpia');
    } catch (error: any) {
      // Si devuelve 404, significa que no hay sociedades (perfecto)
      if (error.statusCode !== 404) {
        throw error;
      }
      console.log('✅ [Paso 0] BD ya estaba limpia (404)');
    }
    
    // Crear UNA sociedad para todos los tests
    console.log('📝 [Paso 0] Creando sociedad de prueba...');
    testSocietyId = await repository.create();
    console.log(`✅ [Paso 0] Sociedad creada: ${testSocietyId}`);
  });

  afterAll(async () => {
    // Eliminar la sociedad de prueba
    if (testSocietyId) {
      console.log(`🧹 [Paso 0] Eliminando sociedad ${testSocietyId}...`);
      try {
        await repository.delete(testSocietyId);
        console.log('✅ [Paso 0] Sociedad eliminada');
      } catch (error) {
        console.warn(`⚠️  [Paso 0] No se pudo eliminar sociedad ${testSocietyId}`);
      }
    }
  });

  describe("create() - POST /api/v2/society-profile", () => {
    it("debe haber creado la sociedad en beforeAll", () => {
      expect(testSocietyId).toBeDefined();
      expect(typeof testSocietyId).toBe("string");
      expect(Number(testSocietyId)).toBeGreaterThan(0);
    });

    it("debe ser un número válido", () => {
      const numericId = Number(testSocietyId);
      expect(Number.isInteger(numericId)).toBe(true);
      expect(numericId).toBeGreaterThan(0);
    });
  });

  describe("list() - GET /api/v2/society-profile/list", () => {
    it("debe listar la sociedad creada", async () => {
      const result = await repository.list();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(1);
      
      // Debe incluir nuestra sociedad de prueba
      const ourSociety = result.find(s => s.idSociety === testSocietyId);
      expect(ourSociety).toBeDefined();
    });

    it("debe retornar sociedades con estructura correcta", async () => {
      const result = await repository.list();
      const sociedad = result.find(s => s.idSociety === testSocietyId);

      expect(sociedad).toHaveProperty("idSociety");
      expect(sociedad).toHaveProperty("razonSocial");
      expect(sociedad).toHaveProperty("ruc");
      expect(sociedad).toHaveProperty("directorio");
      expect(sociedad).toHaveProperty("pasoActual");
    });
  });

  describe("delete() - DELETE /api/v2/society-profile/:id", () => {
    it("debe poder crear y eliminar una sociedad temporal", async () => {
      // Crear temporal
      const tempId = await repository.create();
      expect(tempId).toBeDefined();

      // Verificar que existe
      let list = await repository.list();
      expect(list.find(s => s.idSociety === tempId)).toBeDefined();

      // Eliminar
      await repository.delete(tempId);

      // Verificar que fue eliminada
      list = await repository.list();
      expect(list.find(s => s.idSociety === tempId)).toBeUndefined();
    });
  });
});

