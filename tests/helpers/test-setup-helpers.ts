/**
 * HELPERS REUTILIZABLES PARA SETUP DE TESTS
 * 
 * Estos helpers permiten que cada test cree fácilmente
 * los datos previos que necesita (sociedad, accionistas, acciones, etc.)
 * 
 * Uso:
 * ```typescript
 * beforeAll(async () => {
 *   societyId = await setupSociety();
 *   accionistaId = await setupAccionista(societyId);
 *   accionId = await setupAccion(societyId);
 * });
 * ```
 */

import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";
import { DatosSociedadHttpRepository } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/infrastructure/repositories/datos-sociedad.http.repository";
import { AccionistasHttpRepository } from "~/core/hexag/registros/sociedades/pasos/accionistas/infrastructure/repositories/accionistas.http.repository";
import { AccionesHttpRepository } from "~/core/hexag/registros/sociedades/pasos/acciones/infrastructure/repositories/acciones.http.repository";
import { QuorumHttpRepository } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/infrastructure/repositories/quorum.http.repository";
import { DirectorHttpRepository } from "~/core/hexag/registros/sociedades/pasos/directorio/infrastructure/repositories/director.http.repository";

import { createTestAccionistaNatural, createTestAccion } from "./seed-helpers";
import { createDatosSociedadPayload } from "../data/sociedades/test-data-sociedades";
import { TipoAccionEnum } from "~/core/hexag/registros/sociedades/pasos/acciones/domain/enums/tipo-accion.enum";

// ========================================
// PASO 0: SOCIEDAD
// ========================================

/**
 * Crea una sociedad de prueba
 * @returns societyId
 */
export async function setupSociety(): Promise<string> {
  const repo = new SociedadHttpRepository();
  const id = await repo.create();
  console.log(`  📝 [Setup] Sociedad creada: ${id}`);
  return id;
}

/**
 * Elimina una sociedad
 */
export async function cleanupSociety(societyId: string): Promise<void> {
  try {
    const repo = new SociedadHttpRepository();
    await repo.delete(societyId);
    console.log(`  🧹 [Cleanup] Sociedad ${societyId} eliminada`);
  } catch (error) {
    console.warn(`  ⚠️ [Cleanup] No se pudo eliminar sociedad ${societyId}`);
  }
}

// ========================================
// PASO 1: DATOS SOCIEDAD
// ========================================

/**
 * Crea datos de sociedad
 * @param societyId ID de la sociedad
 */
export async function setupDatosSociedad(societyId: string): Promise<void> {
  const repo = new DatosSociedadHttpRepository();
  const datos = createDatosSociedadPayload();
  await repo.create(societyId, datos);
  console.log(`  📝 [Setup] Datos sociedad creados`);
}

// ========================================
// PASO 2: ACCIONISTAS
// ========================================

/**
 * Crea un accionista de prueba
 * @param societyId ID de la sociedad
 * @returns accionistaId
 */
export async function setupAccionista(societyId: string): Promise<string> {
  const repo = new AccionistasHttpRepository();
  const accionista = createTestAccionistaNatural(1);
  const result = await repo.create(societyId, accionista);
  console.log(`  📝 [Setup] Accionista creado: ${result.id}`);
  return result.id;
}

// ========================================
// PASO 3: ACCIONES
// ========================================

/**
 * Crea una acción de prueba
 * @param societyId ID de la sociedad
 * @returns accionId (UUID generado en frontend)
 */
export async function setupAccion(societyId: string): Promise<string> {
  const repo = new AccionesHttpRepository();
  const accion = createTestAccion(TipoAccionEnum.COMUN, 500);
  
  // ✅ El UUID ya está en accion.id (generado en frontend)
  await repo.create(societyId, accion);
  
  console.log(`  📝 [Setup] Acción creada: ${accion.id}`);
  return accion.id;  // ✅ Retornar el UUID que ya generamos
}

// ========================================
// PASO 5: QUÓRUM
// ========================================

/**
 * Crea quórum por defecto (si no existe)
 */
export async function setupQuorum(societyId: string): Promise<void> {
  const repo = new QuorumHttpRepository();
  // El backend crea quórum por defecto, solo verificamos que exista
  const quorum = await repo.get(societyId);
  if (quorum) {
    console.log(`  ✅ [Setup] Quórum ya existe`);
  }
}

// ========================================
// PASO 6: DIRECTORIO
// ========================================

/**
 * Crea un director de prueba
 * @param societyId ID de la sociedad
 * @returns directorId
 */
export async function setupDirector(societyId: string): Promise<string> {
  const repo = new DirectorHttpRepository();
  const { createTestDirector } = await import("./seed-helpers");
  const director = createTestDirector(1);
  
  const { CreateDirectorUseCase } = await import(
    "~/core/hexag/registros/sociedades/pasos/directorio/application/use-cases/director/create-director.use-case"
  );
  const useCase = new CreateDirectorUseCase(repo);
  const result = await useCase.execute(societyId, director);
  
  console.log(`  📝 [Setup] Director creado: ${result.id}`);
  return result.id;
}

// ========================================
// SETUP COMPLETO (TODOS LOS PASOS)
// ========================================

/**
 * Crea sociedad + datos + accionistas + acciones
 * Útil para tests que necesitan todo el setup previo
 */
export async function setupCompleto() {
  const societyId = await setupSociety();
  await setupDatosSociedad(societyId);
  const accionistaId = await setupAccionista(societyId);
  const accionId = await setupAccion(societyId);
  
  return {
    societyId,
    accionistaId,
    accionId,
  };
}

