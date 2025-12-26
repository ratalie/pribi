/**
 * TEST: Acciones
 * 
 * Test independiente que puede correr SOLO.
 * Crea su propia sociedad usando helpers reutilizables.
 * 
 * Comando: npm run test:core:acciones
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setupSociety, cleanupSociety, setupValorNominal } from "@tests/helpers/test-setup-helpers";
import { createTestAccion } from "@tests/helpers/seed-helpers";
import { TipoAccionEnum } from "~/core/hexag/registros/sociedades/pasos/acciones/domain/enums/tipo-accion.enum";
import { AccionesHttpRepository } from "../acciones.http.repository";

describe("Acciones Repository", () => {
  let repository: AccionesHttpRepository;
  let societyId: string;
  let createdAccionId: string;

  beforeAll(async () => {
    console.log("\n🚀 [Test Acciones] Iniciando...");
    repository = new AccionesHttpRepository();
    
    // ✅ REUTILIZAR helper
    societyId = await setupSociety();
    
    // ✅ Crear valor nominal (REQUERIDO antes de acciones)
    await setupValorNominal(societyId);
    
    console.log(`✅ [Test Acciones] Setup completo\n`);
  });

  afterAll(async () => {
    await cleanupSociety(societyId);
  });

  it("debe iniciar con lista vacía", async () => {
    const acciones = await repository.list(societyId);
    expect(acciones).toEqual([]);
  });

  it("debe crear una acción", async () => {
    // ✅ REUTILIZAR helper de data
    const accion = createTestAccion(TipoAccionEnum.COMUN, 500);

    // ✅ UUID ya generado en frontend
    createdAccionId = accion.id;

    await repository.create(societyId, accion);

    expect(createdAccionId).toBeDefined();
  });

  it("debe listar la acción creada", async () => {
    const acciones = await repository.list(societyId);

    expect(acciones.length).toBe(1);
    expect(acciones[0]!.id).toBe(createdAccionId);
  });
});

