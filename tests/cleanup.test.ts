/**
 * Test de Cleanup - Ejecutar ANTES de los tests principales
 * 
 * Comando: npm run test cleanup.test.ts
 */

import { beforeAll, describe, it, expect } from "vitest";
import { cleanupAllSociedades } from "./helpers/cleanup-backend";

describe("Cleanup del Backend", () => {
  beforeAll(async () => {
    console.log('🚀 [Cleanup Test] Iniciando limpieza del backend...');
  });

  it("debe eliminar TODAS las sociedades del backend", async () => {
    await cleanupAllSociedades();
    
    // Verificar que quedó limpio
    const { SociedadHttpRepository } = await import("~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository");
    const repo = new SociedadHttpRepository();
    const list = await repo.list();
    
    expect(list).toEqual([]);
    expect(list.length).toBe(0);
  }, 60000); // Timeout de 60 segundos
});

