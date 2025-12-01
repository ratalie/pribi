/**
 * Tests Compartidos para Repositorios de Asignación de Acciones
 *
 * Este archivo contiene tests que se ejecutan con AMBOS repositorios:
 * - AsignacionAccionesHttpRepository (HTTP real o interceptado por MSW)
 * - AsignacionAccionesMswRepository (directo al state mock)
 *
 * @pattern Shared Test Suite - Repository Contract Testing
 *
 * Objetivo: Garantizar que ambos repositorios implementan el mismo contrato
 * y producen los mismos resultados para las mismas operaciones.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { clearAllMockData } from "@hexag/registros/shared/mock-database";
import type { AsignacionAccionesRepository, AsignacionAccionesDTO } from "../../../domain/ports/asignacion-acciones.repository";
import { AsignacionAccionesHttpRepository } from "../asignacion-acciones.http.repository";
import { AsignacionAccionesMswRepository } from "../asignacion-acciones.msw.repository";
import { generateUUID } from "@tests/utils/uuid-generator";

/**
 * Suite de tests compartidos
 */
describe.each([
  { name: "AsignacionAccionesHttpRepository", factory: () => new AsignacionAccionesHttpRepository() },
  { name: "AsignacionAccionesMswRepository", factory: () => new AsignacionAccionesMswRepository() },
])("$name - Tests Compartidos", ({ name: _name, factory }) => {
  let repository: AsignacionAccionesRepository;
  let societyId: string;

  beforeEach(async () => {
    repository = factory();
    // Limpiar datos mock antes de cada test
    await clearAllMockData();
    // Generar un ID de sociedad de prueba
    societyId = generateUUID();
  });

  describe("create() - POST /api/v2/society-profile/:id/share-assignment", () => {
    it("debe crear una asignación de acciones y retornar el ID", async () => {
      const payload: AsignacionAccionesDTO = {
        id: generateUUID(),
        accionId: generateUUID(),
        accionistaId: generateUUID(),
        cantidadSuscrita: 100,
        precioPorAccion: 10.5,
        porcentajePagadoPorAccion: 100,
        totalDividendosPendientes: 0,
        pagadoCompletamente: true,
      };

      const assignmentId = await repository.create(societyId, payload);

      expect(assignmentId).toBeDefined();
      expect(typeof assignmentId).toBe("string");
      expect(assignmentId.length).toBeGreaterThan(0);
      // El ID retornado debe ser el mismo que el del payload
      expect(assignmentId).toBe(payload.id);
    });

    it("debe crear múltiples asignaciones", async () => {
      const payload1: AsignacionAccionesDTO = {
        id: generateUUID(),
        accionId: generateUUID(),
        accionistaId: generateUUID(),
        cantidadSuscrita: 100,
        precioPorAccion: 10.5,
        porcentajePagadoPorAccion: 100,
        totalDividendosPendientes: 0,
        pagadoCompletamente: true,
      };

      const payload2: AsignacionAccionesDTO = {
        id: generateUUID(),
        accionId: generateUUID(),
        accionistaId: generateUUID(),
        cantidadSuscrita: 50,
        precioPorAccion: 15.0,
        porcentajePagadoPorAccion: 50,
        totalDividendosPendientes: 375,
        pagadoCompletamente: false,
      };

      const id1 = await repository.create(societyId, payload1);
      const id2 = await repository.create(societyId, payload2);

      expect(id1).toBe(payload1.id);
      expect(id2).toBe(payload2.id);
      expect(id1).not.toBe(id2);
    });
  });
});

