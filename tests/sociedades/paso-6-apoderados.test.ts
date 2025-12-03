import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";
import { ApoderadosHttpRepository } from "~/core/hexag/registros/sociedades/pasos/apoderados/infrastructure/repositories/apoderados.http.repository";
import { CreateClaseApoderadoUseCase } from "~/core/hexag/registros/sociedades/pasos/apoderados/application/use-cases/create-clase-apoderado.use-case";
import { CreateApoderadoUseCase } from "~/core/hexag/registros/sociedades/pasos/apoderados/application/use-cases/create-apoderado.use-case";
import { createTestClaseApoderado, createTestApoderado } from "@tests/helpers/seed-helpers";

describe("PASO 6: Apoderados - Backend Real", () => {
  let sociedadRepo: SociedadHttpRepository;
  let apoderadosRepo: ApoderadosHttpRepository;
  let testSocietyId: string;
  let testClaseId: string;
  let testApoderadosIds: string[] = [];

  beforeAll(async () => {
    console.log("\n🚀 [Paso 6] Iniciando tests...");
    
    sociedadRepo = new SociedadHttpRepository();
    apoderadosRepo = new ApoderadosHttpRepository();

    // Limpiar sociedades previas del test
    try {
      const societies = await sociedadRepo.getAll();
      for (const society of societies) {
        try {
          await sociedadRepo.delete(society.structureId);
        } catch {
          // Ignorar errores de eliminación
        }
      }
    } catch {
      // Ignorar si no hay sociedades
    }

    // Crear sociedad de prueba
    testSocietyId = await sociedadRepo.create();
    console.log(`✅ [Paso 6] Sociedad creada: ${testSocietyId}`);
  });

  afterAll(async () => {
    if (testSocietyId) {
      await sociedadRepo.delete(testSocietyId);
      console.log("✅ [Paso 6] Sociedad eliminada");
    }
  });

  // ========================================
  // CLASES DE APODERADO
  // ========================================

  it("debe crear la clase 'Gerente General'", async () => {
    const clase = createTestClaseApoderado(1); // ✅ Genera nombre único
    testClaseId = clase.id;
    
    const useCase = new CreateClaseApoderadoUseCase(apoderadosRepo);
    await useCase.execute(testSocietyId, clase);
    
    expect(testClaseId).toBeDefined();
    console.log(`✅ Clase 'Gerente General' creada: ${testClaseId}`);
  });

  it("debe listar las clases creadas", async () => {
    const clases = await apoderadosRepo.listClases(testSocietyId);
    
    expect(clases).toBeDefined();
    expect(Array.isArray(clases)).toBe(true);
    expect(clases.length).toBeGreaterThanOrEqual(1); // ✅ Al menos 1 clase
    
    const found = clases.find((c) => c.id === testClaseId);
    expect(found).toBeDefined();
    expect(found?.nombre).toContain("Gerente"); // ✅ Nombre contiene "Gerente"
    
    console.log(`✅ ${clases.length} clases listadas`);
  });

  it("debe crear una segunda clase 'Apoderado Especial'", async () => {
    const clase2 = createTestClaseApoderado(2); // ✅ Genera nombre único
    
    const useCase = new CreateClaseApoderadoUseCase(apoderadosRepo);
    await useCase.execute(testSocietyId, clase2);
    
    const clases = await apoderadosRepo.listClases(testSocietyId);
    expect(clases.length).toBeGreaterThanOrEqual(2); // ✅ Al menos 2 clases
    
    console.log("✅ Segunda clase creada");
  });

  it("debe actualizar el nombre de una clase", async () => {
    const updatePayload = {
      id: testClaseId,
      nombre: `Gerente-Actualizado-${Date.now()}`, // ✅ Nombre único
    };
    
    await apoderadosRepo.updateClase(testSocietyId, updatePayload);
    
    const clases = await apoderadosRepo.listClases(testSocietyId);
    const updated = clases.find((c) => c.id === testClaseId);
    
    expect(updated).toBeDefined();
    expect(updated?.nombre).toContain("Actualizado"); // ✅ Verifica que contenga "Actualizado"
    
    console.log("✅ Clase actualizada");
  });

  // ========================================
  // APODERADOS (PERSONAS ASIGNADAS A CLASES)
  // ========================================

  it("debe crear el primer apoderado en la clase", async () => {
    const apoderado1 = createTestApoderado(testClaseId, 1);
    testApoderadosIds.push(apoderado1.id);
    
    const useCase = new CreateApoderadoUseCase(apoderadosRepo);
    await useCase.execute(testSocietyId, apoderado1);
    
    expect(apoderado1.id).toBeDefined();
    console.log(`✅ Apoderado 1 creado: ${apoderado1.id}`);
  });

  it("debe crear el segundo apoderado en la clase", async () => {
    const apoderado2 = createTestApoderado(testClaseId, 2);
    testApoderadosIds.push(apoderado2.id);
    
    const useCase = new CreateApoderadoUseCase(apoderadosRepo);
    await useCase.execute(testSocietyId, apoderado2);
    
    expect(apoderado2.id).toBeDefined();
    console.log(`✅ Apoderado 2 creado: ${apoderado2.id}`);
  });

  it("debe listar los apoderados creados", async () => {
    const apoderados = await apoderadosRepo.listApoderados(testSocietyId);
    
    expect(apoderados).toBeDefined();
    expect(Array.isArray(apoderados)).toBe(true);
    expect(apoderados.length).toBe(2);
    
    // Verificar que todos los apoderados creados estén presentes
    for (const id of testApoderadosIds) {
      const found = apoderados.find((a) => a.id === id);
      expect(found).toBeDefined();
      expect(found?.claseApoderadoId).toBe(testClaseId);
      expect(found?.persona.nombre).toBe("Roberto");
    }
    
    console.log(`✅ ${apoderados.length} apoderados listados`);
  });

  it("debe actualizar los datos de un apoderado", async () => {
    const apoderadoId = testApoderadosIds[0];
    const apoderados = await apoderadosRepo.listApoderados(testSocietyId);
    const existing = apoderados.find((a) => a.id === apoderadoId);
    
    expect(existing).toBeDefined();
    
    const updatePayload = {
      id: apoderadoId,
      claseApoderadoId: testClaseId,
      persona: {
        ...existing!.persona,
        nombre: "Roberto José",
        apellidoPaterno: "Silva Actualizado",
      },
    };
    
    await apoderadosRepo.updateApoderado(testSocietyId, updatePayload);
    
    const updated = await apoderadosRepo.listApoderados(testSocietyId);
    const found = updated.find((a) => a.id === apoderadoId);
    
    expect(found).toBeDefined();
    expect(found?.persona.nombre).toBe("Roberto José");
    expect(found?.persona.apellidoPaterno).toBe("Silva Actualizado");
    
    console.log("✅ Apoderado actualizado");
  });

  it("debe eliminar un apoderado", async () => {
    // Crear apoderado temporal
    const temporal = createTestApoderado(testClaseId, 99);
    const useCase = new CreateApoderadoUseCase(apoderadosRepo);
    await useCase.execute(testSocietyId, temporal);
    
    // Verificar que existe
    let apoderados = await apoderadosRepo.listApoderados(testSocietyId);
    let found = apoderados.find((a) => a.id === temporal.id);
    expect(found).toBeDefined();
    
    // Eliminar
    await apoderadosRepo.deleteApoderado(testSocietyId, temporal.id);
    
    // Verificar que ya no existe
    apoderados = await apoderadosRepo.listApoderados(testSocietyId);
    found = apoderados.find((a) => a.id === temporal.id);
    expect(found).toBeUndefined();
    
    console.log("✅ Apoderado eliminado correctamente");
  });

  it("debe crear apoderados en diferentes clases", async () => {
    const clases = await apoderadosRepo.listClases(testSocietyId);
    const clase2 = clases.find((c) => c.id !== testClaseId); // ✅ Encuentra la otra clase
    
    expect(clase2).toBeDefined();
    
    const apoderadoClase2 = createTestApoderado(clase2!.id, 3);
    const useCase = new CreateApoderadoUseCase(apoderadosRepo);
    await useCase.execute(testSocietyId, apoderadoClase2);
    
    const apoderados = await apoderadosRepo.listApoderados(testSocietyId);
    const found = apoderados.find((a) => a.id === apoderadoClase2.id);
    
    expect(found).toBeDefined();
    expect(found?.claseApoderadoId).toBe(clase2!.id);
    
    console.log("✅ Apoderado creado en clase diferente");
  });
});

