import { createTestApoderado, createTestClaseApoderado } from "@tests/helpers/seed-helpers";
import { cleanupSociety, setupSociety } from "@tests/helpers/test-setup-helpers";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CreateApoderadoUseCase } from "../../../application/use-cases/create-apoderado.use-case";
import { CreateClaseApoderadoUseCase } from "../../../application/use-cases/create-clase-apoderado.use-case";
import { ApoderadosHttpRepository } from "../apoderados.http.repository";

describe("Apoderados Repository", () => {
  let repository: ApoderadosHttpRepository;
  let societyId: string;
  let testClaseId: string;
  let testApoderadoId: string;

  beforeAll(async () => {
    console.log("\n🚀 [Test Apoderados] Iniciando...");
    repository = new ApoderadosHttpRepository();

    // ✅ REUTILIZAR helper
    societyId = await setupSociety();

    console.log(`✅ [Test Apoderados] Setup completo\n`);
  });

  afterAll(async () => {
    await cleanupSociety(societyId);
  });

  // ========================================
  // CLASES DE APODERADO
  // ========================================

  it("debe crear una clase de apoderado", async () => {
    const clase = createTestClaseApoderado(1); // ✅ Nombre único
    testClaseId = clase.id;

    const useCase = new CreateClaseApoderadoUseCase(repository);
    await useCase.execute(societyId, clase);

    // Verificar que la clase existe listándola
    const clases = await repository.listClases(societyId);
    const found = clases.find((c) => c.id === testClaseId);

    expect(found).toBeDefined();
    expect(found?.nombre).toContain("Gerente"); // ✅ Nombre contiene "Gerente"

    console.log(`✅ Clase de apoderado creada: ${testClaseId}`);
  });

  it("debe listar las clases de apoderado", async () => {
    const clases = await repository.listClases(societyId);

    expect(clases).toBeDefined();
    expect(Array.isArray(clases)).toBe(true);
    expect(clases.length).toBeGreaterThanOrEqual(1);

    const found = clases.find((c) => c.id === testClaseId);
    expect(found).toBeDefined();

    console.log(`✅ ${clases.length} clases listadas`);
  });

  it("debe actualizar una clase de apoderado", async () => {
    const updatePayload = {
      id: testClaseId,
      nombre: `Gerente-Modificado-${Date.now()}`, // ✅ Nombre único
    };

    await repository.updateClase(societyId, updatePayload);

    const clases = await repository.listClases(societyId);
    const updated = clases.find((c) => c.id === testClaseId);

    expect(updated).toBeDefined();
    expect(updated?.nombre).toContain("Modificado"); // ✅ Verifica que contenga "Modificado"

    console.log("✅ Clase actualizada correctamente");
  });

  // ========================================
  // APODERADOS (PERSONAS ASIGNADAS A CLASES)
  // ========================================

  it("debe crear un apoderado", async () => {
    const apoderado = createTestApoderado(testClaseId, 1);
    testApoderadoId = apoderado.id;

    const useCase = new CreateApoderadoUseCase(repository);
    await useCase.execute(societyId, apoderado);

    // Verificar que el apoderado existe listándolo
    const apoderados = await repository.listApoderados(societyId);
    const found = apoderados.find((a) => a.id === testApoderadoId);

    expect(found).toBeDefined();
    expect(found?.claseApoderadoId).toBe(testClaseId);
    if (found?.persona.tipo === "NATURAL") {
      expect(found.persona.nombre).toBe("Roberto");
    }

    console.log(`✅ Apoderado creado: ${testApoderadoId}`);
  });

  it("debe listar los apoderados", async () => {
    const apoderados = await repository.listApoderados(societyId);

    expect(apoderados).toBeDefined();
    expect(Array.isArray(apoderados)).toBe(true);
    expect(apoderados.length).toBeGreaterThanOrEqual(1);

    const found = apoderados.find((a) => a.id === testApoderadoId);
    expect(found).toBeDefined();

    console.log(`✅ ${apoderados.length} apoderados listados`);
  });

  it("debe actualizar un apoderado", async () => {
    const apoderados = await repository.listApoderados(societyId);
    const existing = apoderados.find((a) => a.id === testApoderadoId);

    expect(existing).toBeDefined();

    const updatePayload = {
      id: testApoderadoId,
      claseApoderadoId: testClaseId,
      persona: {
        ...existing!.persona,
        nombre: "Roberto Modificado",
      },
    };

    await repository.updateApoderado(societyId, updatePayload);

    const updated = await repository.listApoderados(societyId);
    const found = updated.find((a) => a.id === testApoderadoId);

    expect(found).toBeDefined();
    if (found?.persona.tipo === "NATURAL") {
      expect(found.persona.nombre).toBe("Roberto Modificado");
    }

    console.log("✅ Apoderado actualizado correctamente");
  });

  it("debe crear múltiples apoderados en la misma clase", async () => {
    const apoderado2 = createTestApoderado(testClaseId, 2);
    const apoderado3 = createTestApoderado(testClaseId, 3);

    const useCase = new CreateApoderadoUseCase(repository);
    await useCase.execute(societyId, apoderado2);
    await useCase.execute(societyId, apoderado3);

    const apoderados = await repository.listApoderados(societyId);
    const enClase = apoderados.filter((a) => a.claseApoderadoId === testClaseId);

    expect(enClase.length).toBeGreaterThanOrEqual(3);

    console.log(`✅ ${enClase.length} apoderados en la clase`);
  });

  it("debe eliminar un apoderado", async () => {
    // Crear apoderado temporal
    const temporal = createTestApoderado(testClaseId, 99);
    const useCase = new CreateApoderadoUseCase(repository);
    await useCase.execute(societyId, temporal);

    // Eliminar
    await repository.deleteApoderado(societyId, temporal.id);

    // Verificar que ya no existe
    const apoderados = await repository.listApoderados(societyId);
    const found = apoderados.find((a) => a.id === temporal.id);
    expect(found).toBeUndefined();

    console.log("✅ Apoderado eliminado correctamente");
  });

  it("debe eliminar una clase de apoderado", async () => {
    // Crear clase temporal
    const temporal = createTestClaseApoderado();
    temporal.nombre = "Clase Temporal";

    const useCase = new CreateClaseApoderadoUseCase(repository);
    await useCase.execute(societyId, temporal);

    // Eliminar
    await repository.deleteClase(societyId, temporal.id);

    // Verificar que ya no existe
    const clases = await repository.listClases(societyId);
    const found = clases.find((c) => c.id === temporal.id);
    expect(found).toBeUndefined();

    console.log("✅ Clase eliminada correctamente");
  });
});
