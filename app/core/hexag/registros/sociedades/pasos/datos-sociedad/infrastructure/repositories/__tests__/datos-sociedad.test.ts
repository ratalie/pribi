/**
 * TEST: Datos Sociedad
 * 
 * Test independiente que puede correr SOLO.
 * Crea su propia sociedad usando helpers reutilizables.
 * 
 * Comando: npm run test:core:datos-sociedad
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setupSociety, cleanupSociety } from "@tests/helpers/test-setup-helpers";
import { createDatosSociedadPayload } from "@tests/data/sociedades/test-data-sociedades";
import { DatosSociedadHttpRepository } from "../datos-sociedad.http.repository";

describe("Datos Sociedad Repository", () => {
  let repository: DatosSociedadHttpRepository;
  let societyId: string;

  beforeAll(async () => {
    console.log("\n🚀 [Test Datos Sociedad] Iniciando...");
    repository = new DatosSociedadHttpRepository();
    
    // ✅ REUTILIZAR helper (no duplicar código)
    societyId = await setupSociety();
    
    console.log(`✅ [Test Datos Sociedad] Setup completo\n`);
  });

  afterAll(async () => {
    // ✅ REUTILIZAR helper de cleanup
    await cleanupSociety(societyId);
  });

  it("debe crear datos principales", async () => {
    // ✅ REUTILIZAR helper de data
    const datos = createDatosSociedadPayload();

    await repository.create(societyId, datos);

    const result = await repository.get(societyId);
    expect(result).toBeDefined();
    expect(result?.razonSocial).toBe(datos.razonSocial);
  });

  it("debe poder obtener los datos creados", async () => {
    const datos = await repository.get(societyId);

    expect(datos).toBeDefined();
    expect(datos?.razonSocial).toBeDefined();
  });

  it("debe poder actualizar datos", async () => {
    const datosOriginales = createDatosSociedadPayload();
    const datosActualizados = {
      ...datosOriginales,
      razonSocial: "Razón Social Actualizada",
    };

    await repository.update(societyId, datosActualizados);

    const result = await repository.get(societyId);
    expect(result?.razonSocial).toBe(datosActualizados.razonSocial);
  });
});

