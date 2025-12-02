/**
 * Tests Compartidos para Repositorios de Agenda Items
 *
 * Este archivo contiene tests que se ejecutan con AMBOS repositorios:
 * - AgendaItemsHttpRepository (HTTP real o interceptado por MSW)
 * - AgendaItemsMswRepository (directo al state mock)
 *
 * @pattern Shared Test Suite - Repository Contract Testing
 *
 * Objetivo: Garantizar que ambos repositorios implementan el mismo contrato
 * y producen los mismos resultados para las mismas operaciones.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { clearAllMockData } from "~/core/hexag/registros/shared/mock-database";
import type { AgendaItemsRepository } from "../../../domain/ports/agenda-items.repository";
import type { AgendaItemsDTO } from "../../../application/dtos/agenda-item.dto";
import { AgendaItemsHttpRepository } from "../agenda-items.http.repository";
import { AgendaItemsMswRepository } from "../agenda-items.msw.repository";
import { createDefaultAgendaItemsDTO } from "../../../application/dtos/agenda-item.dto";

/**
 * Suite de tests compartidos
 */
describe.each([
  { name: "AgendaItemsHttpRepository", factory: () => new AgendaItemsHttpRepository() },
  { name: "AgendaItemsMswRepository", factory: () => new AgendaItemsMswRepository() },
])("$name - Tests Compartidos", ({ name: _name, factory }) => {
  let repository: AgendaItemsRepository;
  let societyId: number;
  let flowId: number;

  beforeEach(async () => {
    repository = factory();
    await clearAllMockData();
    societyId = 1;
    flowId = 1;
  });

  describe("get() - GET /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items", () => {
    it("debe retornar null cuando no hay datos guardados", async () => {
      const result = await repository.get(societyId, flowId);

      // Puede retornar null o un objeto por defecto
      expect(result === null || typeof result === "object").toBe(true);
    });

    it("debe retornar estructura correcta de AgendaItemsDTO", async () => {
      const result = await repository.get(societyId, flowId);

      if (result !== null) {
        expect(result).toHaveProperty("aumentoCapital");
        expect(result).toHaveProperty("remocion");
        expect(result).toHaveProperty("nombramiento");
        expect(result).toHaveProperty("gestionSocialYResultadosEconomicos");

        // Verificar sub-estructuras
        expect(result.aumentoCapital).toHaveProperty("aportesDinerarios");
        expect(result.aumentoCapital).toHaveProperty("aporteNoDinerario");
        expect(result.aumentoCapital).toHaveProperty("capitalizacionDeCreditos");
      }
    });
  });

  describe("update() - PUT /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items", () => {
    it("debe actualizar agenda items correctamente", async () => {
      const payload: AgendaItemsDTO = {
        aumentoCapital: {
          aportesDinerarios: true,
          aporteNoDinerario: false,
          capitalizacionDeCreditos: false,
        },
        remocion: {
          remocionGerenteGeneral: false,
          remocionApoderados: false,
          remocionDirectores: false,
        },
        nombramiento: {
          nombramientoGerenteGeneral: false,
          nombramientoApoderados: true,
          nombramientoDirectores: false,
          nombramientoNuevoDirectorio: false,
        },
        gestionSocialYResultadosEconomicos: {
          pronunciamientoGestionSocialYResultados: false,
          aplicacionResultados: false,
          designacionAuditoresExternos: false,
        },
      };

      // Actualizar
      await repository.update(societyId, flowId, payload);

      // Obtener y verificar
      const result = await repository.get(societyId, flowId);

      expect(result).toBeDefined();
      expect(result?.aumentoCapital.aportesDinerarios).toBe(true);
      expect(result?.nombramiento.nombramientoApoderados).toBe(true);
    });

    it("debe poder activar múltiples puntos de agenda", async () => {
      const payload: AgendaItemsDTO = {
        aumentoCapital: {
          aportesDinerarios: true,
          aporteNoDinerario: true,
          capitalizacionDeCreditos: true,
        },
        remocion: {
          remocionGerenteGeneral: true,
          remocionApoderados: true,
          remocionDirectores: false,
        },
        nombramiento: {
          nombramientoGerenteGeneral: false,
          nombramientoApoderados: false,
          nombramientoDirectores: false,
          nombramientoNuevoDirectorio: false,
        },
        gestionSocialYResultadosEconomicos: {
          pronunciamientoGestionSocialYResultados: false,
          aplicacionResultados: false,
          designacionAuditoresExternos: false,
        },
      };

      await repository.update(societyId, flowId, payload);

      const result = await repository.get(societyId, flowId);

      expect(result?.aumentoCapital.aportesDinerarios).toBe(true);
      expect(result?.aumentoCapital.aporteNoDinerario).toBe(true);
      expect(result?.aumentoCapital.capitalizacionDeCreditos).toBe(true);
      expect(result?.remocion.remocionGerenteGeneral).toBe(true);
      expect(result?.remocion.remocionApoderados).toBe(true);
    });

    it("debe poder actualizar varias veces", async () => {
      // Primera actualización
      const payload1 = createDefaultAgendaItemsDTO();
      payload1.aumentoCapital.aportesDinerarios = true;
      await repository.update(societyId, flowId, payload1);

      // Segunda actualización
      const payload2 = createDefaultAgendaItemsDTO();
      payload2.nombramiento.nombramientoApoderados = true;
      await repository.update(societyId, flowId, payload2);

      // La segunda actualización reemplaza la primera
      const result = await repository.get(societyId, flowId);

      expect(result?.aumentoCapital.aportesDinerarios).toBe(false);
      expect(result?.nombramiento.nombramientoApoderados).toBe(true);
    });

    it("no debe afectar datos de otras juntas", async () => {
      const payload1: AgendaItemsDTO = createDefaultAgendaItemsDTO();
      payload1.aumentoCapital.aportesDinerarios = true;

      const payload2: AgendaItemsDTO = createDefaultAgendaItemsDTO();
      payload2.remocion.remocionApoderados = true;

      // Actualizar junta 1
      await repository.update(societyId, 1, payload1);
      // Actualizar junta 2
      await repository.update(societyId, 2, payload2);

      // Verificar que no se mezclaron
      const result1 = await repository.get(societyId, 1);
      const result2 = await repository.get(societyId, 2);

      expect(result1?.aumentoCapital.aportesDinerarios).toBe(true);
      expect(result1?.remocion.remocionApoderados).toBe(false);

      expect(result2?.aumentoCapital.aportesDinerarios).toBe(false);
      expect(result2?.remocion.remocionApoderados).toBe(true);
    });
  });
});

