import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";
import { DirectorioHttpRepository } from "~/core/hexag/registros/sociedades/pasos/directorio/infrastructure/repositories/directorio.http.repository";
import { DirectorHttpRepository } from "~/core/hexag/registros/sociedades/pasos/directorio/infrastructure/repositories/director.http.repository";
import { CreateDirectorUseCase } from "~/core/hexag/registros/sociedades/pasos/directorio/application/use-cases/director/create-director.use-case";
import { createTestDirector } from "@tests/helpers/seed-helpers";
import { TipoDirector } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/enums/director-tipo.enum";
import type { DirectorioDTO } from "~/core/hexag/registros/sociedades/pasos/directorio/application/dtos/directorio.dto";

describe("PASO 5: Directorio - Backend Real", () => {
  let sociedadRepo: SociedadHttpRepository;
  let directorioRepo: DirectorioHttpRepository;
  let directorRepo: DirectorHttpRepository;
  let testSocietyId: string;
  let testDirectoresIds: string[] = [];
  let testPresidenteId: string;
  let testDirectorioId: string;

  beforeAll(async () => {
    console.log("\n🚀 [Paso 5] Iniciando tests...");
    
    sociedadRepo = new SociedadHttpRepository();
    directorioRepo = new DirectorioHttpRepository();
    directorRepo = new DirectorHttpRepository();

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
    console.log(`✅ [Paso 5] Sociedad creada: ${testSocietyId}`);
  });

  afterAll(async () => {
    if (testSocietyId) {
      await sociedadRepo.delete(testSocietyId);
      console.log("✅ [Paso 5] Sociedad eliminada");
    }
  });

  // ========================================
  // DIRECTORES
  // ========================================

  it("debe crear el primer director TITULAR", async () => {
    const director1 = createTestDirector(0, TipoDirector.TITULAR, null);
    const useCase = new CreateDirectorUseCase(directorRepo);
    const result = await useCase.execute(testSocietyId, director1);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.rolDirector).toBe(TipoDirector.TITULAR);
    expect(result.persona.nombre).toBe("Carlos");

    testDirectoresIds.push(result.id);
    testPresidenteId = result.id; // El primero será el presidente
    console.log(`✅ Director 1 creado: ${result.id}`);
  });

  it("debe crear el segundo director TITULAR", async () => {
    const director2 = createTestDirector(1, TipoDirector.TITULAR, null);
    const useCase = new CreateDirectorUseCase(directorRepo);
    const result = await useCase.execute(testSocietyId, director2);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.rolDirector).toBe(TipoDirector.TITULAR);
    expect(result.persona.nombre).toBe("Roberto");

    testDirectoresIds.push(result.id);
    console.log(`✅ Director 2 creado: ${result.id}`);
  });

  it("debe crear el tercer director TITULAR", async () => {
    const director3 = createTestDirector(2, TipoDirector.TITULAR, null);
    const useCase = new CreateDirectorUseCase(directorRepo);
    const result = await useCase.execute(testSocietyId, director3);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.rolDirector).toBe(TipoDirector.TITULAR);
    expect(result.persona.nombre).toBe("Luis");

    testDirectoresIds.push(result.id);
    console.log(`✅ Director 3 creado: ${result.id}`);
  });

  it("debe listar los 3 directores creados", async () => {
    const directores = await directorRepo.get(testSocietyId);

    expect(directores).toBeDefined();
    expect(Array.isArray(directores)).toBe(true);
    expect(directores.length).toBe(3);

    // Verificar que todos los directores creados estén presentes
    for (const directorId of testDirectoresIds) {
      const found = directores.find((d) => d.id === directorId);
      expect(found).toBeDefined();
      expect(found?.rolDirector).toBe(TipoDirector.TITULAR);
    }

    console.log(`✅ ${directores.length} directores listados correctamente`);
  });

  // ========================================
  // CONFIG DIRECTORIO
  // ========================================

  it("debe configurar el directorio con presidenteId", async () => {
    const payload: DirectorioDTO = {
      cantidadDirectores: 3,
      conteoPersonalizado: false,
      minimoDirectores: null,
      maximoDirectores: null,
      inicioMandato: "01-01-2025", // dd-mm-aaaa
      finMandato: "01-01-2026", // dd-mm-aaaa
      quorumMinimo: 2,
      mayoria: 2,
      presidenteDesignado: true,
      secretarioAsignado: true,
      reeleccionPermitida: true,
      presidentePreside: true,
      presidenteDesempata: true,
      periodo: "1", // "1" = ONE_YEAR
      presidenteId: testPresidenteId, // ✅ UUID del primer director
    };

    const result = await directorioRepo.update(testSocietyId, payload);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.cantidadDirectores).toBe(3);
    expect(result.presidenteId).toBe(testPresidenteId);
    expect(result.quorumMinimo).toBe(2);
    expect(result.mayoria).toBe(2);

    testDirectorioId = result.id;
    console.log(`✅ Directorio configurado: ${result.id}`);
    console.log(`👑 Presidente asignado: ${testPresidenteId}`);
  });

  it("debe obtener la configuración del directorio", async () => {
    const config = await directorioRepo.get(testSocietyId);

    expect(config).toBeDefined();
    expect(config?.id).toBe(testDirectorioId);
    expect(config?.cantidadDirectores).toBe(3);
    expect(config?.presidenteId).toBe(testPresidenteId);
    expect(config?.presidenteDesignado).toBe(true);
    expect(config?.quorumMinimo).toBe(2);

    console.log("✅ Configuración del directorio obtenida correctamente");
  });

  it("debe cambiar el presidente del directorio", async () => {
    const nuevoPresidenteId = testDirectoresIds[1]; // Segundo director

    const updatePayload: DirectorioDTO = {
      id: testDirectorioId,
      cantidadDirectores: 3,
      conteoPersonalizado: false,
      minimoDirectores: null,
      maximoDirectores: null,
      inicioMandato: "01-01-2025",
      finMandato: "01-01-2026",
      quorumMinimo: 2,
      mayoria: 2,
      presidenteDesignado: true,
      secretarioAsignado: true,
      reeleccionPermitida: true,
      presidentePreside: true,
      presidenteDesempata: true,
      periodo: "1",
      presidenteId: nuevoPresidenteId, // ✅ Cambiar presidente
    };

    const updated = await directorioRepo.update(testSocietyId, updatePayload);

    expect(updated).toBeDefined();
    expect(updated.presidenteId).toBe(nuevoPresidenteId);

    console.log(`✅ Presidente cambiado a: ${nuevoPresidenteId}`);
  });

  it("debe actualizar otras configuraciones del directorio", async () => {
    const updatePayload: DirectorioDTO = {
      id: testDirectorioId,
      cantidadDirectores: 5, // Cambiar cantidad
      conteoPersonalizado: false,
      minimoDirectores: null,
      maximoDirectores: null,
      inicioMandato: "01-02-2025", // Cambiar fechas
      finMandato: "01-02-2026",
      quorumMinimo: 3, // Cambiar quorum
      mayoria: 3, // Cambiar mayoría
      presidenteDesignado: true,
      secretarioAsignado: false, // Cambiar secretario
      reeleccionPermitida: false, // Cambiar reelección
      presidentePreside: true,
      presidenteDesempata: true,
      periodo: "2", // "2" = TWO_YEARS
      presidenteId: testPresidenteId, // Restaurar presidente original
    };

    const updated = await directorioRepo.update(testSocietyId, updatePayload);

    expect(updated).toBeDefined();
    expect(updated.cantidadDirectores).toBe(5);
    expect(updated.quorumMinimo).toBe(3);
    expect(updated.mayoria).toBe(3);
    expect(updated.secretarioAsignado).toBe(false);
    expect(updated.reeleccionPermitida).toBe(false);
    expect(updated.presidenteId).toBe(testPresidenteId);

    console.log("✅ Configuración del directorio actualizada correctamente");
  });
});

