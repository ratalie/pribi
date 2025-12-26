import { createTestDirector } from "@tests/helpers/seed-helpers";
import {
  cleanupSociety,
  setupDirectorio,
  setupSociety,
} from "@tests/helpers/test-setup-helpers";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TipoDirector } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/enums/director-tipo.enum";
import type { DirectorioDTO } from "../../../application/dtos/directorio.dto";
import { CreateDirectorUseCase } from "../../../application/use-cases/director/create-director.use-case";
import { DirectorHttpRepository } from "../director.http.repository";
import { DirectorioHttpRepository } from "../directorio.http.repository";

describe("Directorio Repository", () => {
  let directorioRepo: DirectorioHttpRepository;
  let directorRepo: DirectorHttpRepository;
  let societyId: string;
  let directorioId: string;
  let directoresIds: string[];
  let presidenteId: string;

  beforeAll(async () => {
    console.log("\n🚀 [Test Directorio] Iniciando...");

    directorioRepo = new DirectorioHttpRepository();
    directorRepo = new DirectorHttpRepository();

    // ✅ SETUP: Sociedad + Directorio completo (3 directores + config)
    societyId = await setupSociety();
    const directorio = await setupDirectorio(societyId);

    directorioId = directorio.directorioId;
    directoresIds = directorio.directoresIds;
    presidenteId = directorio.presidenteId;

    console.log(`✅ [Test Directorio] Setup completo`);
    console.log(`   - Sociedad: ${societyId}`);
    console.log(`   - Directorio: ${directorioId}`);
    console.log(`   - Directores: ${directoresIds.length}`);
    console.log(`   - Presidente: ${presidenteId}\n`);
  });

  afterAll(async () => {
    await cleanupSociety(societyId);
  });

  // ========================================
  // CONFIG DIRECTORIO
  // ========================================

  it("debe obtener la configuración del directorio", async () => {
    const config = await directorioRepo.get(societyId);

    expect(config).toBeDefined();
    expect(config?.id).toBe(directorioId);
    expect(config?.cantidadDirectores).toBe(3);
    expect(config?.presidenteId).toBe(presidenteId); // ✅ UUID del director
  });

  it("debe actualizar la configuración del directorio", async () => {
    const updatePayload: DirectorioDTO = {
      id: directorioId,
      cantidadDirectores: 5,
      conteoPersonalizado: false,
      minimoDirectores: null,
      maximoDirectores: null,
      inicioMandato: "01-02-2025",
      finMandato: "01-02-2026",
      quorumMinimo: 3,
      mayoria: 3,
      presidenteDesignado: true,
      secretarioAsignado: true,
      reeleccionPermitida: true,
      presidentePreside: true,
      presidenteDesempata: true,
      periodo: "2", // "2" = TWO_YEARS
      presidenteId, // Mantener mismo presidente
    };

    const updated = await directorioRepo.update(societyId, updatePayload);

    expect(updated).toBeDefined();
    expect(updated.cantidadDirectores).toBe(5);
    expect(updated.quorumMinimo).toBe(3);
    expect(updated.presidenteId).toBe(presidenteId);
  });

  // ========================================
  // DIRECTORES
  // ========================================

  it("debe listar los directores creados", async () => {
    const directores = await directorRepo.get(societyId);

    expect(directores).toBeDefined();
    expect(Array.isArray(directores)).toBe(true);
    expect(directores.length).toBeGreaterThanOrEqual(3); // Al menos los 3 iniciales

    // Verificar que los directores creados estén en la lista
    for (const directorId of directoresIds) {
      const found = directores.find((d) => d.id === directorId);
      expect(found).toBeDefined();
      expect(found?.rolDirector).toBe(TipoDirector.TITULAR);
    }
  });

  it("debe crear un nuevo director", async () => {
    const nuevoDirector = createTestDirector(10, TipoDirector.SUPLENTE);

    const useCase = new CreateDirectorUseCase(directorRepo);
    const created = await useCase.execute(societyId, nuevoDirector);

    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.rolDirector).toBe(TipoDirector.SUPLENTE);
    expect(created.persona).toBeDefined();
    expect(created.persona.nombre).toBe("Carlos"); // Primer nombre del array

    // Limpiar: eliminar director creado
    await directorRepo.delete(societyId, created.id);
  });

  it("debe eliminar un director", async () => {
    // Crear director temporal
    const temporal = createTestDirector(99, TipoDirector.TITULAR);
    const useCase = new CreateDirectorUseCase(directorRepo);
    const created = await useCase.execute(societyId, temporal);

    expect(created.id).toBeDefined();

    // Eliminar
    await directorRepo.delete(societyId, created.id);

    // Verificar que ya no existe
    const directores = await directorRepo.get(societyId);
    const found = directores.find((d) => d.id === created.id);
    expect(found).toBeUndefined();
  });

  it("debe cambiar el presidente del directorio", async () => {
    // Cambiar presidente al segundo director
    const nuevoPresidenteId = directoresIds[1]!;

    const updatePayload: DirectorioDTO = {
      id: directorioId,
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

    const updated = await directorioRepo.update(societyId, updatePayload);

    expect(updated.presidenteId).toBe(nuevoPresidenteId);

    // Restaurar presidente original para siguientes tests
    await directorioRepo.update(societyId, { ...updatePayload, presidenteId });
  });
});
