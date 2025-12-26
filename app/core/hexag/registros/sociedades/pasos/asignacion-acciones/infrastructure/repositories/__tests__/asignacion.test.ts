/**
 * TEST: Asignación de Acciones
 * 
 * Test independiente que puede correr SOLO.
 * Crea su propia sociedad + accionista + acción usando helpers reutilizables.
 * 
 * Comando: npm run test:core:asignacion
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { 
  setupSociety, 
  setupAccionista, 
  setupAccion,
  cleanupSociety 
} from "@tests/helpers/test-setup-helpers";
import { createAsignacionPayload } from "@tests/data/sociedades/test-data-sociedades";
import { AsignacionAccionesHttpRepository } from "../asignacion-acciones.http.repository";

describe("Asignación de Acciones Repository", () => {
  let repository: AsignacionAccionesHttpRepository;
  let societyId: string;
  let accionistaId: string;
  let accionId: string;

  beforeAll(async () => {
    console.log("\n🚀 [Test Asignación] Iniciando...");
    repository = new AsignacionAccionesHttpRepository();
    
    // ✅ REUTILIZAR helpers (setup completo)
    societyId = await setupSociety();
    accionistaId = await setupAccionista(societyId);
    accionId = await setupAccion(societyId);
    
    console.log(`✅ [Test Asignación] Setup completo:`, {
      societyId,
      accionistaId,
      accionId,
    });
    console.log("");
  });

  afterAll(async () => {
    await cleanupSociety(societyId);
  });

  it("debe crear asignación de acciones", async () => {
    // ✅ REUTILIZAR helper de data
    const asignacion = createAsignacionPayload(accionistaId, accionId);

    const resultId = await repository.create(societyId, asignacion);

    expect(resultId).toBeDefined();
    expect(typeof resultId).toBe("string");
  });
});

