/**
 * TEST: Accionistas
 * 
 * Test independiente que puede correr SOLO.
 * Crea su propia sociedad usando helpers reutilizables.
 * 
 * Comando: npm run test:core:accionistas
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setupSociety, cleanupSociety } from "@tests/helpers/test-setup-helpers";
import { createTestAccionistaNatural } from "@tests/helpers/seed-helpers";
import { AccionistasHttpRepository } from "../accionistas.http.repository";

describe("Accionistas Repository", () => {
  let repository: AccionistasHttpRepository;
  let societyId: string;
  let createdAccionistaId: string;

  beforeAll(async () => {
    console.log("\n🚀 [Test Accionistas] Iniciando...");
    repository = new AccionistasHttpRepository();
    
    // ✅ REUTILIZAR helper
    societyId = await setupSociety();
    
    console.log(`✅ [Test Accionistas] Setup completo\n`);
  });

  afterAll(async () => {
    await cleanupSociety(societyId);
  });

  it("debe iniciar con lista vacía", async () => {
    const accionistas = await repository.list(societyId);
    expect(accionistas).toEqual([]);
  });

  it("debe crear un accionista", async () => {
    // ✅ REUTILIZAR helper de data
    const accionista = createTestAccionistaNatural(1);
    
    const result = await repository.create(societyId, accionista);
    createdAccionistaId = result.id;

    expect(createdAccionistaId).toBeDefined();
    expect(typeof createdAccionistaId).toBe("string");
  });

  it("debe listar el accionista creado", async () => {
    const accionistas = await repository.list(societyId);

    expect(accionistas.length).toBe(1);
    expect(accionistas[0]!.id).toBe(createdAccionistaId);
  });
});

