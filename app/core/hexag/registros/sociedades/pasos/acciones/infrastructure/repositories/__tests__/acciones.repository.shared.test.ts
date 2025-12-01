/**
 * Tests Compartidos para Repositorios de Acciones
 *
 * Este archivo contiene tests que se ejecutan con AMBOS repositorios:
 * - AccionesHttpRepository (HTTP real o interceptado por MSW)
 * - AccionesMswRepository (directo al state mock)
 *
 * @pattern Shared Test Suite - Repository Contract Testing
 *
 * Objetivo: Garantizar que ambos repositorios implementan el mismo contrato
 * y producen los mismos resultados para las mismas operaciones.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { clearAllMockData } from "@hexag/registros/shared/mock-database";
import type { AccionesRepository } from "../../../domain/ports/acciones.repository";
import type { AccionPayload } from "../../../domain/entities/accion-payload.entity";
import { AccionesHttpRepository } from "../acciones.http.repository";
import { AccionesMswRepository } from "../acciones.msw.repository";
import { TipoAccionEnum } from "../../../domain/enums/tipo-accion.enum";
import { generateUUID } from "@tests/utils/uuid-generator";

/**
 * Suite de tests compartidos
 */
describe.each([
  { name: "AccionesHttpRepository", factory: () => new AccionesHttpRepository() },
  { name: "AccionesMswRepository", factory: () => new AccionesMswRepository() },
])("$name - Tests Compartidos", ({ name: _name, factory }) => {
  let repository: AccionesRepository;
  let societyId: string;

  beforeEach(async () => {
    repository = factory();
    // Limpiar datos mock antes de cada test
    await clearAllMockData();
    // Generar un ID de sociedad de prueba
    societyId = generateUUID();
  });

  describe("list() - GET /api/v2/society-profile/:id/acction", () => {
    it("debe retornar un array vacío cuando no hay acciones", async () => {
      const result = await repository.list(societyId);

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("create() - POST /api/v2/society-profile/:id/acction", () => {
    it("debe crear una acción común", async () => {
      const payload: AccionPayload = {
        id: generateUUID(),
        tipo: TipoAccionEnum.COMUN,
        accionesSuscritas: 100,
        derechoVoto: true,
        redimible: false,
        otrosDerechosEspeciales: false,
        obligacionesAdicionales: false,
        comentariosAdicionales: false,
      };

      await repository.create(societyId, payload);

      // Verificar que se creó listando
      const acciones = await repository.list(societyId);
      expect(acciones.length).toBe(1);
      expect(acciones[0]?.tipo).toBe(TipoAccionEnum.COMUN);
      expect(acciones[0]?.accionesSuscritas).toBe(100);
    });

    it("debe crear múltiples acciones", async () => {
      const payload1: AccionPayload = {
        id: generateUUID(),
        tipo: TipoAccionEnum.COMUN,
        accionesSuscritas: 100,
        derechoVoto: true,
        redimible: false,
        otrosDerechosEspeciales: false,
        obligacionesAdicionales: false,
        comentariosAdicionales: false,
      };

      const payload2: AccionPayload = {
        id: generateUUID(),
        tipo: TipoAccionEnum.SIN_DERECHO_A_VOTO,
        accionesSuscritas: 50,
        derechoVoto: false,
        redimible: true,
        otrosDerechosEspeciales: false,
        obligacionesAdicionales: false,
        comentariosAdicionales: false,
      };

      await repository.create(societyId, payload1);
      await repository.create(societyId, payload2);

      const acciones = await repository.list(societyId);
      expect(acciones.length).toBe(2);
    });
  });

  describe("update() - PUT /api/v2/society-profile/:id/acction", () => {
    it("debe actualizar una acción existente", async () => {
      const payload: AccionPayload = {
        id: generateUUID(),
        tipo: TipoAccionEnum.COMUN,
        accionesSuscritas: 100,
        derechoVoto: true,
        redimible: false,
        otrosDerechosEspeciales: false,
        obligacionesAdicionales: false,
        comentariosAdicionales: false,
      };

      await repository.create(societyId, payload);

      // Actualizar
      const updatedPayload: AccionPayload = {
        ...payload,
        accionesSuscritas: 200,
      };

      await repository.update(societyId, updatedPayload);

      // Verificar actualización
      const acciones = await repository.list(societyId);
      const updated = acciones.find((a) => a.id === payload.id);
      expect(updated?.accionesSuscritas).toBe(200);
    });
  });

  describe("delete() - DELETE /api/v2/society-profile/:id/acction", () => {
    it("debe eliminar una acción", async () => {
      const payload: AccionPayload = {
        id: generateUUID(),
        tipo: TipoAccionEnum.COMUN,
        accionesSuscritas: 100,
        derechoVoto: true,
        redimible: false,
        otrosDerechosEspeciales: false,
        obligacionesAdicionales: false,
        comentariosAdicionales: false,
      };

      await repository.create(societyId, payload);

      // Eliminar
      await repository.delete(societyId, [payload.id]);

      // Verificar eliminación
      const acciones = await repository.list(societyId);
      expect(acciones.find((a) => a.id === payload.id)).toBeUndefined();
    });

    it("debe eliminar múltiples acciones", async () => {
      const payload1: AccionPayload = {
        id: generateUUID(),
        tipo: TipoAccionEnum.COMUN,
        accionesSuscritas: 100,
        derechoVoto: true,
        redimible: false,
        otrosDerechosEspeciales: false,
        obligacionesAdicionales: false,
        comentariosAdicionales: false,
      };

      const payload2: AccionPayload = {
        id: generateUUID(),
        tipo: TipoAccionEnum.SIN_DERECHO_A_VOTO,
        accionesSuscritas: 50,
        derechoVoto: false,
        redimible: true,
        otrosDerechosEspeciales: false,
        obligacionesAdicionales: false,
        comentariosAdicionales: false,
      };

      await repository.create(societyId, payload1);
      await repository.create(societyId, payload2);

      // Eliminar ambas
      await repository.delete(societyId, [payload1.id, payload2.id]);

      // Verificar eliminación
      const acciones = await repository.list(societyId);
      expect(acciones.length).toBe(0);
    });
  });

  describe("Flujo completo CRUD", () => {
    it("debe permitir crear, listar, actualizar y eliminar acciones", async () => {
      const payload: AccionPayload = {
        id: generateUUID(),
        tipo: TipoAccionEnum.COMUN,
        accionesSuscritas: 100,
        derechoVoto: true,
        redimible: false,
        otrosDerechosEspeciales: false,
        obligacionesAdicionales: false,
        comentariosAdicionales: false,
      };

      // CREATE
      await repository.create(societyId, payload);

      // READ (list)
      let acciones = await repository.list(societyId);
      expect(acciones.length).toBe(1);

      // UPDATE
      const updatedPayload: AccionPayload = {
        ...payload,
        accionesSuscritas: 200,
      };
      await repository.update(societyId, updatedPayload);

      // Verificar actualización
      acciones = await repository.list(societyId);
      expect(acciones[0]?.accionesSuscritas).toBe(200);

      // DELETE
      await repository.delete(societyId, [payload.id]);

      // Verificar eliminación
      acciones = await repository.list(societyId);
      expect(acciones.length).toBe(0);
    });
  });
});

