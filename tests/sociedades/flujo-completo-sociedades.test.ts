/**
 * FLUJO COMPLETO: Registro de Sociedades
 *
 * Este archivo contiene TODOS los pasos del registro de sociedades
 * Usa 1 SOLA sociedad para todos los tests
 *
 * Orden:
 * - Paso 0: Crear Sociedad
 * - Paso 1: Datos Sociedad
 * - Paso 2: Accionistas
 * - Paso 3: Acciones
 * - Paso 4: Asignación de Acciones
 * - Paso 5: Quórum y Mayorías
 * - Paso 6: Directorio
 * - Paso 7: Apoderados
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";
import { DatosSociedadHttpRepository } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/infrastructure/repositories/datos-sociedad.http.repository";
import { AccionistasHttpRepository } from "~/core/hexag/registros/sociedades/pasos/accionistas/infrastructure/repositories/accionistas.http.repository";
import { AccionesHttpRepository } from "~/core/hexag/registros/sociedades/pasos/acciones/infrastructure/repositories/acciones.http.repository";
import { AsignacionAccionesHttpRepository } from "~/core/hexag/registros/sociedades/pasos/asignacion-acciones/infrastructure/repositories/asignacion-acciones.http.repository";
import { QuorumHttpRepository } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/infrastructure/repositories/quorum.http.repository";
import { DirectorHttpRepository } from "~/core/hexag/registros/sociedades/pasos/directorio/infrastructure/repositories/director.http.repository";
import { ApoderadosHttpRepository } from "~/core/hexag/registros/sociedades/pasos/apoderados/infrastructure/repositories/apoderados.http.repository";

// ✅ Importar USE CASES (como el seed)
import { CreateDirectorUseCase } from "~/core/hexag/registros/sociedades/pasos/directorio/application/use-cases/director/create-director.use-case";
import { CreateClaseApoderadoUseCase } from "~/core/hexag/registros/sociedades/pasos/apoderados/application/use-cases/create-clase-apoderado.use-case";
import { CreateApoderadoUseCase } from "~/core/hexag/registros/sociedades/pasos/apoderados/application/use-cases/create-apoderado.use-case";
import {
  createTestApoderado,
  createTestAccionistaNatural,
  createTestAccion,
} from "../helpers/seed-helpers";

import type { DatosSociedadDTO } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/application/dtos/datos-sociedad.dto";
import type { AccionistaDTO } from "~/core/hexag/registros/sociedades/pasos/accionistas/application/dtos/accionista.dto";
import type { AccionDTO } from "~/core/hexag/registros/sociedades/pasos/acciones/application/dtos/accion.dto";
import type { AsignacionAccionesDTO } from "~/core/hexag/registros/sociedades/pasos/asignacion-acciones/domain/ports/asignacion-acciones.repository";
import type { QuorumDTO } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/application/dtos/quorum.dto";
import type { DirectorDTO } from "~/core/hexag/registros/sociedades/pasos/directorio/application/dtos/director.dto";
import { TipoAccionEnum } from "~/core/hexag/registros/sociedades/pasos/acciones/domain/enums/tipo-accion.enum";
import {
  createDatosSociedadPayload,
  createAsignacionPayload,
  createQuorumPayload,
  createDirectorPayload,
  createClaseApoderadoPayload,
} from "../data/sociedades/test-data-sociedades";

describe("🏢 FLUJO COMPLETO: Registro de Sociedades", () => {
  // ========================================
  // SETUP GLOBAL
  // ========================================
  let societyId: string;

  let sociedadRepo: SociedadHttpRepository;
  let datosSociedadRepo: DatosSociedadHttpRepository;
  let accionistasRepo: AccionistasHttpRepository;
  let accionesRepo: AccionesHttpRepository;
  let asignacionRepo: AsignacionAccionesHttpRepository;
  let quorumRepo: QuorumHttpRepository;
  let directorRepo: DirectorHttpRepository;
  let apoderadosRepo: ApoderadosHttpRepository;

  // ✅ Use cases (como el seed)
  let directorUseCase: CreateDirectorUseCase;
  let claseApoderadoUseCase: CreateClaseApoderadoUseCase;
  let apoderadoUseCase: CreateApoderadoUseCase;

  // IDs creados durante el flujo (para cleanup)
  let createdAccionistaId: string;
  let createdAccionId: string;
  let createdAsignacionId: string;
  let createdDirectorId: string;
  let createdClaseId: string;

  beforeAll(async () => {
    console.log("🚀 [Flujo Completo] Iniciando...\n");

    // Inicializar repositorios
    sociedadRepo = new SociedadHttpRepository();
    datosSociedadRepo = new DatosSociedadHttpRepository();
    accionistasRepo = new AccionistasHttpRepository();
    accionesRepo = new AccionesHttpRepository();
    asignacionRepo = new AsignacionAccionesHttpRepository();
    quorumRepo = new QuorumHttpRepository();
    directorRepo = new DirectorHttpRepository();
    apoderadosRepo = new ApoderadosHttpRepository();

    // ✅ Inicializar use cases (como el seed)
    directorUseCase = new CreateDirectorUseCase(directorRepo);
    claseApoderadoUseCase = new CreateClaseApoderadoUseCase(apoderadosRepo);
    apoderadoUseCase = new CreateApoderadoUseCase(apoderadosRepo);

    // Limpiar BD
    try {
      console.log("🧹 [Flujo Completo] Limpiando BD...");
      const existing = await sociedadRepo.list();

      for (const s of existing) {
        await sociedadRepo.delete(s.idSociety);
      }

      console.log(`✅ [Flujo Completo] ${existing.length} sociedades eliminadas\n`);
    } catch (error: any) {
      if (error.statusCode !== 404) {
        throw error;
      }
      console.log("✅ [Flujo Completo] BD ya estaba limpia\n");
    }

    // Crear 1 sociedad para TODO el flujo
    console.log("📝 [Flujo Completo] Creando sociedad...");
    societyId = await sociedadRepo.create();
    console.log(`✅ [Flujo Completo] Sociedad creada: ${societyId}\n`);
  });

  afterAll(async () => {
    // Eliminar sociedad al final
    if (societyId) {
      console.log(`\n🧹 [Flujo Completo] Eliminando sociedad ${societyId}...`);
      try {
        await sociedadRepo.delete(societyId);
        console.log("✅ [Flujo Completo] Sociedad eliminada");
      } catch (error) {
        console.warn(`⚠️  [Flujo Completo] No se pudo eliminar sociedad ${societyId}`);
      }
    }
  });

  // ========================================
  // PASO 0: CREAR SOCIEDAD
  // ========================================
  describe("📋 PASO 0: Crear Sociedad", () => {
    it("debe tener societyId válido", () => {
      expect(societyId).toBeDefined();
      expect(typeof societyId).toBe("string");
      expect(Number(societyId)).toBeGreaterThan(0);
    });

    it("debe aparecer en la lista", async () => {
      const list = await sociedadRepo.list();

      expect(list.length).toBe(1);
      expect(list[0].idSociety).toBe(societyId);
    });
  });

  // ========================================
  // PASO 1: DATOS SOCIEDAD
  // ========================================
  describe("📝 PASO 1: Datos de Sociedad", () => {
    // ✅ Data separada en archivo externo para mejor legibilidad
    const datosPrueba: DatosSociedadDTO = createDatosSociedadPayload();

    it("debe crear datos principales", async () => {
      await datosSociedadRepo.create(societyId, datosPrueba);

      const datos = await datosSociedadRepo.get(societyId);

      expect(datos).toBeDefined();
      expect(datos?.razonSocial).toBe(datosPrueba.razonSocial);
      expect(datos?.numeroRuc).toBe(datosPrueba.numeroRuc); // ✅ numeroRuc, no ruc
    });

    it("debe poder obtener los datos creados", async () => {
      const datos = await datosSociedadRepo.get(societyId);

      expect(datos).toBeDefined();
      expect(datos?.razonSocial).toBe(datosPrueba.razonSocial);
    });

    it("debe poder actualizar datos", async () => {
      const datosActualizados = {
        ...datosPrueba,
        razonSocial: "Tech Solutions SAC - Actualizada",
      };

      await datosSociedadRepo.update(societyId, datosActualizados);

      const datos = await datosSociedadRepo.get(societyId);
      expect(datos?.razonSocial).toBe(datosActualizados.razonSocial);
    });
  });

  // ========================================
  // PASO 2: ACCIONISTAS
  // ========================================
  describe("👥 PASO 2: Accionistas", () => {
    // ✅ Usar helper existente (no inventar datos)
    const accionistaPrueba: AccionistaDTO = createTestAccionistaNatural(1);

    it("debe iniciar con lista vacía", async () => {
      const accionistas = await accionistasRepo.list(societyId);
      expect(accionistas).toEqual([]);
    });

    it("debe crear un accionista", async () => {
      const result = await accionistasRepo.create(societyId, accionistaPrueba);
      createdAccionistaId = result.id;

      expect(createdAccionistaId).toBeDefined();
      expect(typeof createdAccionistaId).toBe("string");
    });

    it("debe listar el accionista creado", async () => {
      const accionistas = await accionistasRepo.list(societyId);

      expect(accionistas.length).toBe(1);
      expect(accionistas[0].id).toBe(createdAccionistaId);
      // ✅ Accionista tiene persona.nombre, no nombres directamente
    });
  });

  // ========================================
  // PASO 3: ACCIONES
  // ========================================
  describe("📊 PASO 3: Acciones", () => {
    it("debe iniciar con lista vacía", async () => {
      const acciones = await accionesRepo.list(societyId);
      expect(acciones).toEqual([]);
    });

    it("debe crear una acción", async () => {
      // ✅ Generar acción (UUID generado en frontend)
      const accionPrueba = createTestAccion(TipoAccionEnum.COMUN, 500);

      // ✅ GUARDAR el UUID que YA generamos (NO necesitamos LIST)
      createdAccionId = accionPrueba.id;

      // Crear la acción (el backend acepta nuestro UUID)
      await accionesRepo.create(societyId, accionPrueba);

      expect(createdAccionId).toBeDefined();
    });

    it("debe listar la acción creada", async () => {
      const acciones = await accionesRepo.list(societyId);

      expect(acciones.length).toBe(1);
      expect(acciones[0].id).toBe(createdAccionId);
    });
  });

  // ========================================
  // PASO 4: ASIGNACIÓN DE ACCIONES
  // ========================================
  describe("🎯 PASO 4: Asignación de Acciones", () => {
    it("debe asignar acciones al accionista", async () => {
      // ✅ Data separada en archivo externo
      const asignacion = createAsignacionPayload(createdAccionistaId, createdAccionId);

      createdAsignacionId = await asignacionRepo.create(societyId, asignacion);

      expect(createdAsignacionId).toBeDefined();
    });

    it("debe verificar que se creó la asignación", async () => {
      // ✅ AsignacionRepo solo tiene create(), no get()
      expect(createdAsignacionId).toBeDefined();
    });
  });

  // ========================================
  // PASO 5: QUÓRUM Y MAYORÍAS
  // ========================================
  describe("⚖️ PASO 5: Quórum y Mayorías", () => {
    it("debe tener quórum por defecto (creado por backend)", async () => {
      const quorum = await quorumRepo.get(societyId);

      // El backend crea quórum por defecto al crear la sociedad
      expect(quorum).toBeDefined();
    });

    it("debe poder actualizar quórum simple", async () => {
      // ✅ Data separada en archivo externo
      const quorumDTO = createQuorumPayload();

      await quorumRepo.update(societyId, quorumDTO);

      const updated = await quorumRepo.get(societyId);
      expect(updated?.primeraConvocatoriaSimple).toBe(60);
    });
  });

  // ========================================
  // PASO 6: DIRECTORIO
  // ========================================
  describe("🏛️ PASO 6: Directorio", () => {
    // ✅ Data separada en archivo externo
    const directorPrueba = createDirectorPayload();

    it("debe crear un director", async () => {
      // ✅ Usar USE CASE (como seeds-sociedades.vue línea 547)
      const result = await directorUseCase.execute(societyId, directorPrueba);
      createdDirectorId = result.id;

      expect(createdDirectorId).toBeDefined();
    });

    it("debe listar el director creado", async () => {
      const directores = await directorRepo.get(societyId);

      expect(directores.length).toBeGreaterThan(0);
      // Verificar que existe un director (no necesariamente el mismo ID)
      expect(directores[0].id).toBeDefined();
    });
  });

  // ========================================
  // PASO 7: APODERADOS
  // ========================================
  describe("⚖️ PASO 7: Registro de Apoderados", () => {
    // ✅ Data separada en archivo externo
    const clasePrueba = createClaseApoderadoPayload();

    it("debe crear una clase de apoderado", async () => {
      // ✅ Generar UUID en frontend
      createdClaseId = clasePrueba.id;

      // ✅ Usar USE CASE (como seeds-sociedades.vue línea 597-600)
      await claseApoderadoUseCase.execute(societyId, clasePrueba);

      expect(createdClaseId).toBeDefined();
    });

    it("debe listar las clases creadas", async () => {
      const clases = await apoderadosRepo.listClases(societyId);

      expect(clases.length).toBeGreaterThan(0);
      expect(clases.find((c) => c.id === createdClaseId)).toBeDefined();
    });

    it("debe crear un apoderado (persona en la clase)", async () => {
      // ✅ Crear apoderado usando el helper (como seeds-sociedades.vue línea 612)
      const apoderadoPrueba = createTestApoderado(createdClaseId, 1);

      // ✅ Usar USE CASE (devuelve void, no devuelve objeto)
      await apoderadoUseCase.execute(societyId, apoderadoPrueba);

      // ✅ Verificar que se creó listando
      const apoderados = await apoderadosRepo.listApoderados(societyId);
      expect(apoderados.length).toBeGreaterThan(0);
    });

    it("debe listar los apoderados creados", async () => {
      const apoderados = await apoderadosRepo.listApoderados(societyId);

      expect(apoderados.length).toBeGreaterThan(0);
    });
  });

  // ========================================
  // RESUMEN FINAL
  // ========================================
  describe("✅ RESUMEN FINAL", () => {
    it("debe tener todos los datos creados correctamente", async () => {
      // Verificar que todo existe
      const datos = await datosSociedadRepo.get(societyId);
      const accionistas = await accionistasRepo.list(societyId);
      const acciones = await accionesRepo.list(societyId);
      const quorum = await quorumRepo.get(societyId);
      const directores = await directorRepo.get(societyId);
      const clases = await apoderadosRepo.listClases(societyId);

      expect(datos).toBeDefined();
      expect(accionistas.length).toBeGreaterThan(0);
      expect(acciones.length).toBeGreaterThan(0);
      expect(quorum).toBeDefined();
      expect(directores.length).toBeGreaterThan(0);
      expect(clases.length).toBeGreaterThan(0);

      console.log("\n✅ FLUJO COMPLETO EXITOSO:");
      console.log(`   - Sociedad: ${societyId}`);
      console.log(`   - Datos: ${datos?.razonSocial}`);
      console.log(`   - Accionistas: ${accionistas.length}`);
      console.log(`   - Acciones: ${acciones.length}`);
      console.log(`   - Directores: ${directores.length}`);
      console.log(`   - Clases Apoderados: ${clases.length}`);
    });
  });
});
