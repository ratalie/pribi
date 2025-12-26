/**
 * HELPERS PARA TESTING DE JUNTAS
 * 
 * Reutiliza helpers de Sociedades para crear sociedad completa,
 * luego crea juntas y valida snapshots con datos conocidos.
 */

import { JuntaHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/junta.http.repository";
import type { SnapshotCompleteDTO } from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";
import {
  setupSociety,
  setupDatosSociedad,
  setupAccionista,
  setupValorNominal,
  setupAccion,
  setupDirectorio,
  setupApoderados,
  setupQuorum,
  cleanupSociety,
} from "../test-setup-helpers";

/**
 * Datos conocidos que se crean en una sociedad completa
 */
export interface SociedadCompletaData {
  societyId: string;
  accionistaId: string;
  accionId: string;
  directorioId: string;
  directoresIds: string[];
  presidenteId: string;
  gerenteGeneralId: string;
  claseApoderadoId: string;
}

/**
 * Crear sociedad BÁSICA con datos mínimos conocidos para validar snapshot
 * Incluye: Datos + Accionista + Valor Nominal + Acción
 */
export async function crearSociedadCompletaParaJunta(): Promise<SociedadCompletaData> {
  console.log("\n🚀 [Setup Junta] Creando sociedad con datos conocidos...");

  // PASO 0: Crear sociedad vacía
  const societyId = await setupSociety();

  // PASO 1: Datos de sociedad
  await setupDatosSociedad(societyId);

  // PASO 2: Accionista (crea 1 accionista: "Ana Torres Ruiz")
  const accionistaId = await setupAccionista(societyId);

  // PASO 2.5: Valor nominal (requerido antes de acciones)
  await setupValorNominal(societyId);

  // PASO 3: Acción (crea 1 acción común con 500 acciones)
  const accionId = await setupAccion(societyId);

  console.log("✅ [Setup Junta] Sociedad creada con datos conocidos:");
  console.log(`   - 1 accionista (Ana Torres Ruiz)`);
  console.log(`   - 1 clase de acción (500 acciones COMUN)`);
  console.log(`   - Valor nominal: 1.0\n`);

  return {
    societyId,
    accionistaId,
    accionId,
    directorioId: "",
    directoresIds: [],
    presidenteId: "",
    gerenteGeneralId: "",
    claseApoderadoId: "",
  };
}

/**
 * Crear junta para una sociedad
 */
export async function crearJunta(societyId: string): Promise<string> {
  const repo = new JuntaHttpRepository();
  const flowId = await repo.create(parseInt(societyId, 10));
  console.log(`  📝 [Junta] Junta creada: flowId=${flowId}`);
  return flowId;
}

/**
 * Obtener snapshot completo
 */
export async function obtenerSnapshot(
  societyId: string,
  flowId: string
): Promise<SnapshotCompleteDTO> {
  const repo = new JuntaHttpRepository();
  const snapshot = await repo.getSnapshot(parseInt(societyId, 10), flowId);
  console.log(`  📸 [Junta] Snapshot obtenido`);
  return snapshot;
}

/**
 * Eliminar junta
 */
export async function eliminarJunta(societyId: string, flowId: string): Promise<void> {
  const repo = new JuntaHttpRepository();
  await repo.delete(parseInt(societyId, 10), flowId);
  console.log(`  🗑️  [Junta] Junta eliminada: flowId=${flowId}`);
}

/**
 * Cleanup completo: junta + sociedad
 */
export async function cleanupJuntaCompleta(
  societyId: string,
  flowId: string
): Promise<void> {
  await eliminarJunta(societyId, flowId);
  await cleanupSociety(societyId);
  console.log(`  ✅ [Cleanup] Junta y sociedad eliminadas\n`);
}

