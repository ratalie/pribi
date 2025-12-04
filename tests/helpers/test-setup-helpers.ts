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
import { ValorNominalHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/valor-nominal.http.repository";
import { AccionesHttpRepository } from "~/core/hexag/registros/sociedades/pasos/acciones/infrastructure/repositories/acciones.http.repository";
import { AccionistasHttpRepository } from "~/core/hexag/registros/sociedades/pasos/accionistas/infrastructure/repositories/accionistas.http.repository";
import { DatosSociedadHttpRepository } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/infrastructure/repositories/datos-sociedad.http.repository";
import { DirectorHttpRepository } from "~/core/hexag/registros/sociedades/pasos/directorio/infrastructure/repositories/director.http.repository";
import { DirectorioHttpRepository } from "~/core/hexag/registros/sociedades/pasos/directorio/infrastructure/repositories/directorio.http.repository";
import { QuorumHttpRepository } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/infrastructure/repositories/quorum.http.repository";

import { TipoAccionEnum } from "~/core/hexag/registros/sociedades/pasos/acciones/domain/enums/tipo-accion.enum";
import { TipoDirector } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/enums/director-tipo.enum";
import { createDatosSociedadPayload } from "../data/sociedades/test-data-sociedades";
import { createTestAccion, createTestAccionistaNatural, createTestDirector } from "./seed-helpers";
import type { DirectorioDTO } from "~/core/hexag/registros/sociedades/pasos/directorio/application/dtos/directorio.dto";

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
// PASO 2.5: VALOR NOMINAL (ANTES DE ACCIONES)
// ========================================

/**
 * Crea valor nominal (requerido ANTES de crear acciones)
 * @param societyId ID de la sociedad
 */
export async function setupValorNominal(societyId: string): Promise<void> {
  const repo = new ValorNominalHttpRepository();
  await repo.update(societyId, { valorNominal: 1.0 });
  console.log(`  📝 [Setup] Valor nominal creado: 1.0`);
}

// ========================================
// PASO 3: ACCIONES
// ========================================

/**
 * Crea una acción de prueba
 * ⚠️ IMPORTANTE: Requiere que el valor nominal esté creado primero
 *
 * @param societyId ID de la sociedad
 * @returns accionId (UUID generado en frontend)
 */
export async function setupAccion(societyId: string): Promise<string> {
  // ✅ Crear valor nominal ANTES de la acción
  await setupValorNominal(societyId);

  const repo = new AccionesHttpRepository();
  const accion = createTestAccion(TipoAccionEnum.COMUN, 500);

  // ✅ El UUID ya está en accion.id (generado en frontend)
  await repo.create(societyId, accion);

  console.log(`  📝 [Setup] Acción creada: ${accion.id}`);
  return accion.id; // ✅ Retornar el UUID que ya generamos
}

// ========================================
// PASO 5: DIRECTORIO
// ========================================

/**
 * Crea config de directorio + 3 directores TITULAR
 * ⚠️ IMPORTANTE: Orden correcto:
 *   1. Crear directores primero
 *   2. Config directorio (con presidenteId del primer director)
 * 
 * @param societyId ID de la sociedad
 * @returns Object con directorioId y array de directoresIds
 */
export async function setupDirectorio(societyId: string): Promise<{
  directorioId: string;
  directoresIds: string[];
  presidenteId: string;
}> {
  console.log(`  📝 [Setup] Creando directorio para sociedad ${societyId}...`);
  
  const directorRepo = new DirectorHttpRepository();
  const directorioRepo = new DirectorioHttpRepository();
  
  // 1️⃣ PRIMERO: Crear 3 directores TITULAR
  const directores = [
    createTestDirector(0, TipoDirector.TITULAR),
    createTestDirector(1, TipoDirector.TITULAR),
    createTestDirector(2, TipoDirector.TITULAR),
  ];
  
  const directoresIds: string[] = [];
  
  for (const director of directores) {
    const { CreateDirectorUseCase } = await import(
      "~/core/hexag/registros/sociedades/pasos/directorio/application/use-cases/director/create-director.use-case"
    );
    const useCase = new CreateDirectorUseCase(directorRepo);
    const result = await useCase.execute(societyId, director);
    directoresIds.push(result.id);
    console.log(`    ✅ Director creado: ${result.id}`);
  }
  
  // 2️⃣ SEGUNDO: Config directorio (con presidenteId = primer director)
  const presidenteId = directoresIds[0]!; // ✅ UUID del director, NO de la persona
  
  const directorioPayload: DirectorioDTO = {
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
    presidenteId, // ✅ UUID del director
  };
  
  const directorio = await directorioRepo.update(societyId, directorioPayload);
  
  console.log(`  📝 [Setup] Directorio configurado: ${directorio.id}`);
  console.log(`  👑 [Setup] Presidente: ${presidenteId}`);
  
  return {
    directorioId: directorio.id,
    directoresIds,
    presidenteId,
  };
}

/**
 * Crea UN director individual (útil para tests específicos de directores)
 * ⚠️ Para setup completo de directorio, usa setupDirectorio()
 * 
 * @param societyId ID de la sociedad
 * @param index Índice para datos únicos
 * @param rolDirector Tipo de director
 * @param reemplazaId ID del director que reemplaza (solo ALTERNO)
 * @returns directorId (UUID del director)
 */
export async function setupDirector(
  societyId: string,
  index: number = 0,
  rolDirector: TipoDirector = TipoDirector.TITULAR,
  reemplazaId: string | null = null
): Promise<string> {
  const repo = new DirectorHttpRepository();
  const director = createTestDirector(index, rolDirector);

  const { CreateDirectorUseCase } = await import(
    "~/core/hexag/registros/sociedades/pasos/directorio/application/use-cases/director/create-director.use-case"
  );
  const useCase = new CreateDirectorUseCase(repo);
  const result = await useCase.execute(societyId, director);

  console.log(`  📝 [Setup] Director creado: ${result.id}`);
  return result.id;
}

// ========================================
// PASO 6: APODERADOS
// ========================================

/**
 * Crea clase de apoderado + 2 apoderados
 * 
 * @param societyId ID de la sociedad
 * @returns Object con claseId y array de apoderadosIds
 */
export async function setupApoderados(societyId: string): Promise<{
  claseId: string;
  apoderadosIds: string[];
}> {
  console.log(`  📝 [Setup] Creando apoderados para sociedad ${societyId}...`);
  
  const repo = new (await import("~/core/hexag/registros/sociedades/pasos/apoderados/infrastructure/repositories/apoderados.http.repository")).ApoderadosHttpRepository();
  
  // 1️⃣ Crear clase de apoderado "Gerente General"
  const { CreateClaseApoderadoUseCase } = await import(
    "~/core/hexag/registros/sociedades/pasos/apoderados/application/use-cases/create-clase-apoderado.use-case"
  );
  const { ClasesApoderadoEspecialesEnum } = await import(
    "~/core/presentation/registros/sociedades/pasos/apoderados/types/enums/ClasesApoderadoEspecialesEnum"
  );
  const { generateUUID } = await import("@tests/utils/uuid-generator");
  
  const claseGerenteGeneral = {
    id: generateUUID(),
    nombre: ClasesApoderadoEspecialesEnum.GERENTE_GENERAL, // ✅ "Gerente General"
  };
  
  const claseUseCase = new CreateClaseApoderadoUseCase(repo);
  await claseUseCase.execute(societyId, claseGerenteGeneral);
  
  console.log(`    ✅ Clase 'Gerente General' creada: ${claseGerenteGeneral.id}`);
  
  // 2️⃣ Crear GERENTE GENERAL (Roberto Silva Mendoza)
  const { CreateApoderadoUseCase } = await import(
    "~/core/hexag/registros/sociedades/pasos/apoderados/application/use-cases/create-apoderado.use-case"
  );
  const { createTestApoderado } = await import("./seed-helpers");
  
  const gerenteGeneral = createTestApoderado(claseGerenteGeneral.id, 0); // índice 0 = Roberto Silva Mendoza
  
  const apoderadoUseCase = new CreateApoderadoUseCase(repo);
  await apoderadoUseCase.execute(societyId, gerenteGeneral);
  
  console.log(`    ✅ Gerente General creado: ${gerenteGeneral.id} (${gerenteGeneral.persona.nombre} ${gerenteGeneral.persona.apellidoPaterno})`);
  
  return {
    claseId: claseGerenteGeneral.id,
    apoderadosIds: [gerenteGeneral.id],
  };
}

// ========================================
// PASO 8: QUÓRUM
// ========================================

/**
 * Configura quorum con valores estándar (según norma legal >= 50%)
 * ⚠️ IMPORTANTE: En la vida real, no puede haber valores < 50%
 * 
 * @param societyId ID de la sociedad
 */
export async function setupQuorum(societyId: string): Promise<void> {
  const repo = new QuorumHttpRepository();
  
  // ✅ Valores realistas según seeds (siempre >= 50)
  const payload = {
    quorumMinimoSimple: 50,
    quorumMinimoCalificado: 60,
    primeraConvocatoriaSimple: 60,
    primeraConvocatoriaCalificada: 70,
    segundaConvocatoriaSimple: 66,
    segundaConvocatoriaCalificada: 80,
  };
  
  await repo.update(societyId, payload);
  console.log(`  📝 [Setup] Quorum configurado (valores legales >= 50%)`);
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
