/**
 * Helper para Tests de Sociedades
 * 
 * Proporciona funciones reutilizables para setup de tests con backend real
 */

import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";
import { SociedadMswRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.msw.repository";

/**
 * Crea y retorna factories para tests de sociedades
 * 
 * Uso:
 * describe.each([
 *   createSociedadTestFactories('Http', SociedadHttpRepository, MiHttpRepository),
 *   createSociedadTestFactories('Msw', SociedadMswRepository, MiMswRepository),
 * ])
 */
export function createSociedadTestFactories<T>(
  name: string,
  SociedadRepoClass: any,
  TestRepoClass: any
) {
  return {
    name: `${TestRepoClass.name}`,
    factory: () => new TestRepoClass(),
    sociedadFactory: () => new SociedadRepoClass(),
  };
}

/**
 * Setup estándar para tests de sociedades
 * 
 * Patrón:
 * 1. Crear sociedad (Paso 0)
 * 2. Usar societyId para tests
 * 3. Eliminar sociedad al final
 */
export async function setupSociedadTest(sociedadFactory: () => any) {
  const sociedadRepo = sociedadFactory();
  
  // ✅ PASO 0: Crear sociedad
  const societyId = await sociedadRepo.create();
  
  return { societyId, sociedadRepo };
}

/**
 * Cleanup estándar para tests de sociedades
 */
export async function cleanupSociedadTest(societyId: string, sociedadRepo: any) {
  if (!societyId) return;
  
  try {
    await sociedadRepo.delete(societyId);
  } catch (error) {
    console.warn(`[Tests] No se pudo eliminar sociedad ${societyId}:`, error);
  }
}

