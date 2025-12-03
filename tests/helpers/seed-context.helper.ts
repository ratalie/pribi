/**
 * Helper para crear contexto de seed (5 sociedades completas)
 *
 * Este helper replica la lógica del seed (seeds-sociedades.vue) para crear
 * 5 sociedades completas que pueden ser usadas como contexto en tests.
 *
 * Cada test de paso puede usar estas sociedades para testear su funcionalidad
 * específica sin tener que crear todo desde cero.
 */

import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";
import { ValorNominalHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/valor-nominal.http.repository";
import { AccionesHttpRepository } from "~/core/hexag/registros/sociedades/pasos/acciones/infrastructure/repositories/acciones.http.repository";
import { AccionistasHttpRepository } from "~/core/hexag/registros/sociedades/pasos/accionistas/infrastructure/repositories/accionistas.http.repository";
import { ApoderadosHttpRepository } from "~/core/hexag/registros/sociedades/pasos/apoderados/infrastructure/repositories/apoderados.http.repository";
import { DatosSociedadHttpRepository } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/infrastructure/repositories/datos-sociedad.http.repository";
import { DirectorHttpRepository } from "~/core/hexag/registros/sociedades/pasos/directorio/infrastructure/repositories/director.http.repository";
import { DirectorioHttpRepository } from "~/core/hexag/registros/sociedades/pasos/directorio/infrastructure/repositories/directorio.http.repository";
import { QuorumHttpRepository } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/infrastructure/repositories/quorum.http.repository";
import { generateTestData, generateUUID } from "./seed-helpers";

// Use Cases
import { UpdateValorNominalUseCase } from "~/core/hexag/registros/sociedades/application/use-cases/update-valor-nominal.use-case";
import { CreateAccionUseCase } from "~/core/hexag/registros/sociedades/pasos/acciones/application/use-cases/create-accion.use-case";
import { ListAccionesUseCase } from "~/core/hexag/registros/sociedades/pasos/acciones/application/use-cases/list-acciones.use-case";
import { TipoAccionEnum } from "~/core/hexag/registros/sociedades/pasos/acciones/domain/enums/tipo-accion.enum";
import { CreateAccionistaUseCase } from "~/core/hexag/registros/sociedades/pasos/accionistas/application/use-cases/create-accionista.use-case";
import { ListAccionistasUseCase } from "~/core/hexag/registros/sociedades/pasos/accionistas/application/use-cases/list-accionistas.use-case";
import { CreateApoderadoUseCase } from "~/core/hexag/registros/sociedades/pasos/apoderados/application/use-cases/create-apoderado.use-case";
import { CreateClaseApoderadoUseCase } from "~/core/hexag/registros/sociedades/pasos/apoderados/application/use-cases/create-clase-apoderado.use-case";
import { CreateDatosSociedadUseCase } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/application/use-cases/create-datos-sociedad.use-case";
import { CreateDirectorUseCase } from "~/core/hexag/registros/sociedades/pasos/directorio/application/use-cases/director/create-director.use-case";
import { UpdateDirectorioUseCase } from "~/core/hexag/registros/sociedades/pasos/directorio/application/use-cases/directorio/update-directorio.use-case";
import { TipoDirector } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/enums/director-tipo.enum";
import { CreateQuorumUseCase } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/application/use-cases/create-quorum.use-case";

export interface SeedSocietyContext {
  societyId: string;
  datosSociedadId?: string;
  accionistasIds: string[];
  accionId?: string;
  quorumId?: string;
  directoresIds: string[];
  claseApoderadoId?: string;
  apoderadoId?: string;
}

export interface SeedContext {
  societies: SeedSocietyContext[];
}

/**
 * Crea 5 sociedades completas usando la misma lógica del seed
 *
 * @returns Contexto con todas las sociedades creadas y sus IDs
 */
export async function createSeedContext(): Promise<SeedContext> {
  console.log("🌱 [Seed Context] Creando 5 sociedades completas...\n");

  // Repositorios
  const sociedadRepo = new SociedadHttpRepository();
  const datosSociedadRepo = new DatosSociedadHttpRepository();
  const accionistasRepo = new AccionistasHttpRepository();
  const accionesRepo = new AccionesHttpRepository();
  const quorumRepo = new QuorumHttpRepository();
  const directorRepo = new DirectorHttpRepository();
  const directorioRepo = new DirectorioHttpRepository();
  const apoderadosRepo = new ApoderadosHttpRepository();
  const valorNominalRepo = new ValorNominalHttpRepository();

  // Use Cases
  const datosSociedadUseCase = new CreateDatosSociedadUseCase(datosSociedadRepo);
  const accionistasUseCase = new CreateAccionistaUseCase(accionistasRepo);
  const accionesUseCase = new CreateAccionUseCase(accionesRepo);
  const quorumUseCase = new CreateQuorumUseCase(quorumRepo);
  const directorUseCase = new CreateDirectorUseCase(directorRepo);
  const directorioUseCase = new UpdateDirectorioUseCase(directorioRepo);
  const claseApoderadoUseCase = new CreateClaseApoderadoUseCase(apoderadosRepo);
  const apoderadoUseCase = new CreateApoderadoUseCase(apoderadosRepo);
  const valorNominalUseCase = new UpdateValorNominalUseCase(valorNominalRepo);
  const listAccionesUseCase = new ListAccionesUseCase(accionesRepo);
  const listAccionistasUseCase = new ListAccionistasUseCase(accionistasRepo);

  const societies: SeedSocietyContext[] = [];

  // Crear 5 sociedades
  for (let index = 0; index < 5; index++) {
    console.log(`📝 [Seed Context] Creando sociedad ${index + 1}/5...`);

    const testData = generateTestData(index);
    const context: SeedSocietyContext = {
      societyId: "",
      accionistasIds: [],
      directoresIds: [],
    };

    try {
      // Paso 0: Crear sociedad
      context.societyId = await sociedadRepo.create();
      console.log(`   ✅ Sociedad creada: ${context.societyId}`);

      // Paso 1: Datos sociedad
      await datosSociedadUseCase.execute(context.societyId, testData.datosSociedad);
      console.log(`   ✅ Datos sociedad creados`);

      // Paso 2: Accionistas
      for (const accionista of testData.accionistas) {
        const creado = await accionistasUseCase.execute(context.societyId, accionista);
        context.accionistasIds.push(creado.id);
      }
      console.log(`   ✅ ${context.accionistasIds.length} accionistas creados`);

      // Paso 2.5: Valor nominal
      await valorNominalUseCase.execute(context.societyId, testData.valorNominal);
      console.log(`   ✅ Valor nominal creado`);

      // Paso 3: Acción
      await accionesUseCase.execute(context.societyId, testData.accion);
      const acciones = await listAccionesUseCase.execute(context.societyId);
      const accionComun = acciones.find((a) => a.tipo === TipoAccionEnum.COMUN);
      if (accionComun) {
        context.accionId = accionComun.id;
      }
      console.log(`   ✅ Acción creada: ${context.accionId}`);

      // Paso 4: Asignación (usando $fetch directamente como el seed)
      if (context.accionId && context.accionistasIds.length >= 2) {
        try {
          await createAsignacionAccionesDirect(context.societyId, {
            id: generateUUID(),
            accionId: context.accionId,
            accionistaId: context.accionistasIds[0]!,
            cantidadSuscrita: 300,
            precioPorAccion: 1.0,
            porcentajePagadoPorAccion: 100,
            totalDividendosPendientes: 0,
            pagadoCompletamente: true,
          });

          await createAsignacionAccionesDirect(context.societyId, {
            id: generateUUID(),
            accionId: context.accionId,
            accionistaId: context.accionistasIds[1]!,
            cantidadSuscrita: 200,
            precioPorAccion: 1.0,
            porcentajePagadoPorAccion: 100,
            totalDividendosPendientes: 0,
            pagadoCompletamente: true,
          });
          console.log(`   ✅ Asignaciones creadas`);
        } catch (error) {
          console.warn(`   ⚠️  Asignaciones fallaron (continuando):`, error);
        }
      }

      // Paso 5: Quórum
      await quorumUseCase.execute(context.societyId, testData.quorum);
      console.log(`   ✅ Quórum creado`);

      // Paso 6: Directores
      let primerDirectorId: string | null = null;
      for (const director of testData.directores) {
        const directorCreado = await directorUseCase.execute(context.societyId, director);
        context.directoresIds.push(directorCreado.id);
        // ✅ Comparar con enum, no con string
        if (!primerDirectorId && directorCreado.rolDirector === TipoDirector.TITULAR) {
          primerDirectorId = directorCreado.id;
        }
      }
      console.log(`   ✅ ${context.directoresIds.length} directores creados`);

      // Paso 6.5: Directorio
      if (primerDirectorId) {
        const directorioData = {
          ...testData.directorio,
          presidenteId: primerDirectorId,
        };
        await directorioUseCase.execute(context.societyId, directorioData);
        console.log(`   ✅ Directorio configurado`);
      }

      // Paso 7: Clase de apoderado
      const claseCreada = await claseApoderadoUseCase.execute(
        context.societyId,
        testData.claseApoderado
      );
      context.claseApoderadoId = claseCreada.id;
      console.log(`   ✅ Clase apoderado creada: ${context.claseApoderadoId}`);

      // Paso 7.5: Apoderado
      if (context.claseApoderadoId) {
        const apoderadoData = {
          ...testData.apoderado,
          claseApoderadoId: context.claseApoderadoId,
        };
        // ✅ apoderadoUseCase.execute() devuelve void
        await apoderadoUseCase.execute(context.societyId, apoderadoData);
        context.apoderadoId = apoderadoData.id; // ✅ Usar el ID del payload
        console.log(`   ✅ Apoderado creado: ${context.apoderadoId}`);
      }

      societies.push(context);
      console.log(`   ✅ Sociedad ${index + 1} completada\n`);
    } catch (error) {
      console.error(`   ❌ Error creando sociedad ${index + 1}:`, error);
      // Continuar con las siguientes sociedades
    }
  }

  console.log(`✅ [Seed Context] ${societies.length} sociedades creadas exitosamente\n`);

  return { societies };
}

/**
 * Helper para crear asignación de acciones (replica del seed)
 */
async function createAsignacionAccionesDirect(
  societyId: string,
  payload: {
    id: string;
    accionId: string;
    accionistaId: string;
    cantidadSuscrita: number;
    precioPorAccion: number;
    porcentajePagadoPorAccion: number;
    totalDividendosPendientes: number;
    pagadoCompletamente: boolean;
  }
): Promise<void> {
  const { useRuntimeConfig } = await import("#app");
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;
  const endpoint = `${apiBase}/api/v2/society-profile/${societyId}/share-assignment`;

  await $fetch(endpoint, {
    method: "POST",
    body: {
      ...payload,
      capitalSocial: payload.cantidadSuscrita * payload.precioPorAccion,
      prima: 0,
    },
  });
}

/**
 * Limpia todas las sociedades del contexto
 */
export async function cleanupSeedContext(context: SeedContext): Promise<void> {
  console.log("🧹 [Seed Context] Limpiando sociedades...\n");

  const sociedadRepo = new SociedadHttpRepository();

  for (const society of context.societies) {
    try {
      await sociedadRepo.delete(society.societyId);
      console.log(`   ✅ Sociedad ${society.societyId} eliminada`);
    } catch (error) {
      console.warn(`   ⚠️  No se pudo eliminar ${society.societyId}:`, error);
    }
  }

  console.log("✅ [Seed Context] Limpieza completada\n");
}
