/**
 * Tests Compartidos para Repositorios de Directores
 *
 * Este archivo contiene tests que se ejecutan con AMBOS repositorios:
 * - DirectorHttpRepository (HTTP real o interceptado por MSW)
 * - DirectorMswRepository (directo al state mock)
 *
 * @pattern Shared Test Suite - Repository Contract Testing
 *
 * Objetivo: Garantizar que ambos repositorios implementan el mismo contrato
 * y producen los mismos resultados para las mismas operaciones.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { clearAllMockData } from "@hexag/registros/shared/mock-database";
import type { DirectorRepository } from "../../../domain/ports/director.repositorio";
import type { DirectorDTO } from "../../../application/dtos/director.dto";
import { DirectorHttpRepository } from "../director.http.repository";
import { DirectorMswRepository } from "../director.msw.repository";
import { TipoDirector } from "../../../domain/enums/director-tipo.enum";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";
import { generateUUID } from "@tests/utils/uuid-generator";

/**
 * Helper para crear un DirectorDTO de prueba
 */
function createTestDirectorDTO(overrides?: Partial<DirectorDTO>): DirectorDTO {
  return {
    id: generateUUID(),
    persona: {
      id: generateUUID(),
      nombre: "Juan",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "García",
      tipoDocumento: TipoDocumentosEnum.DNI,
      numeroDocumento: "12345678",
      paisEmision: "PE",
    },
    rolDirector: TipoDirector.TITULAR,
    reemplazaId: null,
    ...overrides,
  };
}

/**
 * Suite de tests compartidos
 */
describe.each([
  { name: "DirectorHttpRepository", factory: () => new DirectorHttpRepository() },
  { name: "DirectorMswRepository", factory: () => new DirectorMswRepository() },
])("$name - Tests Compartidos", ({ name: _name, factory }) => {
  let repository: DirectorRepository;
  let societyId: string;

  beforeEach(async () => {
    repository = factory();
    // Limpiar datos mock antes de cada test
    await clearAllMockData();
    // Generar un ID de sociedad de prueba
    societyId = generateUUID();
  });

  describe("get() - GET /api/v2/society-profile/:id/directorio/directores", () => {
    it("debe retornar un array vacío cuando no hay directores", async () => {
      const result = await repository.get(societyId);

      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("create() - POST /api/v2/society-profile/:id/directorio/directores", () => {
    it("debe crear un director titular", async () => {
      const payload = createTestDirectorDTO({
        rolDirector: TipoDirector.TITULAR,
      });

      const director = await repository.create(societyId, payload);

      expect(director).toBeDefined();
      expect(director.id).toBeDefined();
      expect(director.persona.nombre).toBe("Juan");
      expect(director.rolDirector).toBe(TipoDirector.TITULAR);
    });

    it("debe crear múltiples directores", async () => {
      const payload1 = createTestDirectorDTO({
        persona: {
          id: generateUUID(),
          nombre: "Juan",
          apellidoPaterno: "Pérez",
          apellidoMaterno: "García",
          tipoDocumento: TipoDocumentosEnum.DNI,
          numeroDocumento: "12345678",
          paisEmision: "PE",
        },
        rolDirector: TipoDirector.TITULAR,
      });

      const payload2 = createTestDirectorDTO({
        persona: {
          id: generateUUID(),
          nombre: "María",
          apellidoPaterno: "González",
          apellidoMaterno: "López",
          tipoDocumento: TipoDocumentosEnum.DNI,
          numeroDocumento: "87654321",
          paisEmision: "PE",
        },
        rolDirector: TipoDirector.SUPLENTE,
      });

      await repository.create(societyId, payload1);
      await repository.create(societyId, payload2);

      const directores = await repository.get(societyId);
      expect(directores.length).toBe(2);
    });
  });

  describe("update() - PUT /api/v2/society-profile/:id/directorio/directores", () => {
    it("debe actualizar un director existente", async () => {
      const payload = createTestDirectorDTO();

      const created = await repository.create(societyId, payload);

      // Actualizar
      const updatedPayload: DirectorDTO = {
        ...payload,
        id: created.id,
        persona: {
          ...payload.persona,
          nombre: "Juan Carlos",
        },
      };

      const updated = await repository.update(societyId, created.id, updatedPayload);

      expect(updated.persona.nombre).toBe("Juan Carlos");
    });
  });

  describe("delete() - DELETE /api/v2/society-profile/:id/directorio/directores", () => {
    it("debe eliminar un director", async () => {
      const payload = createTestDirectorDTO();

      const created = await repository.create(societyId, payload);

      // Verificar que existe
      let directores = await repository.get(societyId);
      expect(directores.find((d) => d.id === created.id)).toBeDefined();

      // Eliminar
      await repository.delete(societyId, created.id);

      // Verificar eliminación
      directores = await repository.get(societyId);
      expect(directores.find((d) => d.id === created.id)).toBeUndefined();
    });
  });

  describe("Flujo completo CRUD", () => {
    it("debe permitir crear, listar, actualizar y eliminar directores", async () => {
      const payload = createTestDirectorDTO();

      // CREATE
      const created = await repository.create(societyId, payload);

      // READ (get)
      let directores = await repository.get(societyId);
      expect(directores.length).toBe(1);
      expect(directores[0]?.id).toBe(created.id);

      // UPDATE
      const updatedPayload: DirectorDTO = {
        ...payload,
        id: created.id,
        persona: {
          ...payload.persona,
          nombre: "Juan Actualizado",
        },
      };
      const updated = await repository.update(societyId, created.id, updatedPayload);
      expect(updated.persona.nombre).toBe("Juan Actualizado");

      // DELETE
      await repository.delete(societyId, created.id);

      // Verificar eliminación
      directores = await repository.get(societyId);
      expect(directores.length).toBe(0);
    });
  });
});


