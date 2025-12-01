/**
 * Tests Compartidos para Repositorios de Accionistas
 *
 * Este archivo contiene tests que se ejecutan con AMBOS repositorios:
 * - AccionistasHttpRepository (HTTP real o interceptado por MSW)
 * - AccionistasMswRepository (directo al state mock)
 *
 * @pattern Shared Test Suite - Repository Contract Testing
 *
 * Objetivo: Garantizar que ambos repositorios implementan el mismo contrato
 * y producen los mismos resultados para las mismas operaciones.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { clearAllMockData } from "@hexag/registros/shared/mock-database";
import type { AccionistasRepository } from "../../../domain/ports/accionistas.repository";
import type { AccionistaDTO } from "../../../application/dtos/accionista.dto";
import { AccionistasHttpRepository } from "../accionistas.http.repository";
import { AccionistasMswRepository } from "../accionistas.msw.repository";
import { isPersonaNatural, isPersonaJuridica } from "../../../domain/entities/persona.entity";
import { generateUUID } from "@tests/utils/uuid-generator";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

/**
 * Helper para crear un DTO de accionista natural
 */
function createAccionistaNaturalDTO(): AccionistaDTO {
  return {
    id: generateUUID(),
    persona: {
      id: generateUUID(),
      tipo: "NATURAL",
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "García",
      numeroDocumento: "12345678",
      tipoDocumento: TipoDocumentosEnum.DNI,
      fechaNacimiento: "01-01-1985",
      nacionalidad: "Peruana",
      estadoCivil: "SOLTERO",
      direccion: "Av. Test 123",
      distrito: "San Isidro",
      provincia: "Lima",
      departamento: "Lima",
    } as any,
    participacionPorcentual: 50,
  };
}

/**
 * Helper para crear un DTO de accionista jurídico
 */
function createAccionistaJuridicoDTO(): AccionistaDTO {
  return {
    id: generateUUID(),
    persona: {
      id: generateUUID(),
      tipo: "JURIDICA",
      razonSocial: "Empresa Accionista S.A.C.",
      numeroDocumento: "20123456789",
      tipoDocumento: TipoDocumentosEnum.DNI,
      constituida: true,
      fechaConstitucion: "2020-01-15",
      direccion: "Av. Empresa 456",
      distrito: "Miraflores",
      provincia: "Lima",
      departamento: "Lima",
    } as any,
    participacionPorcentual: 50,
  };
}

/**
 * Suite de tests compartidos
 */
describe.each([
  { name: "AccionistasHttpRepository", factory: () => new AccionistasHttpRepository() },
  { name: "AccionistasMswRepository", factory: () => new AccionistasMswRepository() },
])("$name - Tests Compartidos", ({ name: _name, factory }) => {
  let repository: AccionistasRepository;
  let societyId: string;

  beforeEach(async () => {
    repository = factory();
    // Limpiar datos mock antes de cada test
    await clearAllMockData();
    // Generar un ID de sociedad de prueba
    societyId = generateUUID();
  });

  describe("list() - GET /api/v2/society-profile/:id/shareholder", () => {
    it("debe retornar un array vacío cuando no hay accionistas", async () => {
      const result = await repository.list(societyId);

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("create() - POST /api/v2/society-profile/:id/shareholder", () => {
    it("debe crear un accionista natural", async () => {
      const payload = createAccionistaNaturalDTO();

      const result = await repository.create(societyId, payload);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      if (isPersonaNatural(result.persona) && isPersonaNatural(payload.persona)) {
        expect(result.persona.nombre).toBe(payload.persona.nombre);
        expect(result.persona.apellidoPaterno).toBe(payload.persona.apellidoPaterno);
        expect(result.persona.numeroDocumento).toBe(payload.persona.numeroDocumento);
      }
    });

    it("debe crear un accionista jurídico", async () => {
      const payload = createAccionistaJuridicoDTO();

      const result = await repository.create(societyId, payload);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      if (isPersonaJuridica(result.persona) && isPersonaJuridica(payload.persona)) {
        expect(result.persona.razonSocial).toBe(payload.persona.razonSocial);
        expect(result.persona.numeroDocumento).toBe(payload.persona.numeroDocumento);
      }
    });

    it("debe crear múltiples accionistas", async () => {
      const payload1 = createAccionistaNaturalDTO();
      const payload2 = createAccionistaJuridicoDTO();

      await repository.create(societyId, payload1);
      await repository.create(societyId, payload2);

      const accionistas = await repository.list(societyId);
      expect(accionistas.length).toBe(2);
    });
  });

  describe("update() - PUT /api/v2/society-profile/:id/shareholder", () => {
    it("debe actualizar un accionista existente", async () => {
      const payload = createAccionistaNaturalDTO();

      const created = await repository.create(societyId, payload);

      // Actualizar
      const updatedPayload: AccionistaDTO = {
        ...payload,
        id: created.id,
        persona: {
          ...payload.persona,
          nombre: "Juan Carlos",
        } as any,
      };

      const updated = await repository.update(societyId, updatedPayload);

      if (isPersonaNatural(updated.persona) && isPersonaNatural(updatedPayload.persona)) {
        expect(updated.persona.nombre).toBe("Juan Carlos");
      }
    });
  });

  describe("delete() - DELETE /api/v2/society-profile/:id/shareholder/:shareholderId", () => {
    it("debe eliminar un accionista", async () => {
      const payload = createAccionistaNaturalDTO();

      const created = await repository.create(societyId, payload);

      // Verificar que existe
      let accionistas = await repository.list(societyId);
      expect(accionistas.find((a) => a.id === created.id)).toBeDefined();

      // Eliminar
      await repository.delete(societyId, created.id);

      // Verificar eliminación
      accionistas = await repository.list(societyId);
      expect(accionistas.find((a) => a.id === created.id)).toBeUndefined();
    });
  });

  describe("Flujo completo CRUD", () => {
    it("debe permitir crear, listar, actualizar y eliminar accionistas", async () => {
      const payload = createAccionistaNaturalDTO();

      // CREATE
      const created = await repository.create(societyId, payload);

      // READ (list)
      let accionistas = await repository.list(societyId);
      expect(accionistas.length).toBe(1);
      expect(accionistas[0]?.id).toBe(created.id);

      // UPDATE
      const updatedPayload: AccionistaDTO = {
        ...payload,
        id: created.id,
        persona: {
          ...payload.persona,
          nombre: "Juan Actualizado",
        } as any,
      };
      const updated = await repository.update(societyId, updatedPayload);
      if (isPersonaNatural(updated.persona) && isPersonaNatural(updatedPayload.persona)) {
        expect(updated.persona.nombre).toBe("Juan Actualizado");
      }

      // DELETE
      await repository.delete(societyId, created.id);

      // Verificar eliminación
      accionistas = await repository.list(societyId);
      expect(accionistas.length).toBe(0);
    });
  });
});

