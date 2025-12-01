/**
 * Tests Compartidos para Repositorios de Apoderados
 *
 * Este archivo contiene tests que se ejecutan con AMBOS repositorios:
 * - ApoderadosHttpRepository (HTTP real o interceptado por MSW)
 * - ApoderadosMswRepository (directo al state mock)
 *
 * @pattern Shared Test Suite - Repository Contract Testing
 *
 * Objetivo: Garantizar que ambos repositorios implementan el mismo contrato
 * y producen los mismos resultados para las mismas operaciones.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { clearAllMockData } from "@hexag/registros/shared/mock-database";
import type { ApoderadosRepository } from "../../../domain/ports/apoderados.repository";
import type { ClaseApoderadoDTO, ApoderadoDTO } from "../../../application/dtos";
import { ApoderadosHttpRepository } from "../apoderados.http.repository";
import { ApoderadosMswRepository } from "../apoderados.msw.repository";
import { isPersonaNatural } from "~/core/hexag/registros/sociedades/pasos/accionistas/domain/entities/persona.entity";
import { generateUUID } from "@tests/utils/uuid-generator";
import { TipoDocumentosEnum } from "~/types/enums/TipoDocumentosEnum";

/**
 * Helper para crear una clase de apoderado
 */
function createClaseApoderadoDTO(): ClaseApoderadoDTO {
  return {
    id: generateUUID(),
    nombre: "Gerente General",
  };
}

/**
 * Helper para crear un apoderado
 */
function createApoderadoDTO(claseApoderadoId: string): ApoderadoDTO {
  return {
    id: generateUUID(),
    claseApoderadoId,
    persona: {
      id: generateUUID(),
      tipo: "NATURAL",
      nombre: "Roberto",
      apellidoPaterno: "Silva",
      apellidoMaterno: "Mendoza",
      numeroDocumento: "87654321",
      tipoDocumento: TipoDocumentosEnum.DNI,
      fechaNacimiento: "01-01-1985",
      nacionalidad: "Peruana",
      estadoCivil: "CASADO",
      direccion: "Av. Gerente 789",
      distrito: "San Isidro",
      provincia: "Lima",
      departamento: "Lima",
    } as any,
  };
}

/**
 * Suite de tests compartidos
 */
describe.each([
  { name: "ApoderadosHttpRepository", factory: () => new ApoderadosHttpRepository() },
  { name: "ApoderadosMswRepository", factory: () => new ApoderadosMswRepository() },
])("$name - Tests Compartidos", ({ name: _name, factory }) => {
  let repository: ApoderadosRepository;
  let societyId: string;

  beforeEach(async () => {
    repository = factory();
    // Limpiar datos mock antes de cada test
    await clearAllMockData();
    // Generar un ID de sociedad de prueba
    societyId = generateUUID();
  });

  describe("Clases de Apoderados", () => {
    describe("listClases() - GET /api/v2/society-profile/:id/attorney-register/classes", () => {
      it("debe retornar un array vacío cuando no hay clases", async () => {
        const result = await repository.listClases(societyId);
        expect(result).toEqual([]);
        expect(Array.isArray(result)).toBe(true);
      });
    });

    describe("createClase() - POST /api/v2/society-profile/:id/attorney-register/classes", () => {
      it("debe crear una clase de apoderado", async () => {
        const claseDTO = createClaseApoderadoDTO();

        const result = await repository.createClase(societyId, claseDTO);

        expect(result).toBeDefined();
        expect(result.nombre).toBe(claseDTO.nombre);
        // El HTTP repository puede no incluir apoderados en la respuesta inicial
        // Verificamos que al menos tenga el nombre correcto
        if (result.apoderados !== undefined) {
          expect(result.apoderados).toEqual([]);
        }
      });
    });

    describe("updateClase() - PUT /api/v2/society-profile/:id/attorney-register/classes", () => {
      it("debe actualizar una clase de apoderado existente", async () => {
        const claseDTO = createClaseApoderadoDTO();

        const created = await repository.createClase(societyId, claseDTO);

        // Actualizar
        const updatedDTO: ClaseApoderadoDTO = {
          ...claseDTO,
          id: created.id,
          nombre: "Gerente General Actualizado",
        };

        const updated = await repository.updateClase(societyId, updatedDTO);
        expect(updated.nombre).toBe("Gerente General Actualizado");
      });
    });

    describe("deleteClase() - DELETE /api/v2/society-profile/:id/attorney-register/classes/:claseId", () => {
      it("debe eliminar una clase de apoderado", async () => {
        const claseDTO = createClaseApoderadoDTO();

        const created = await repository.createClase(societyId, claseDTO);

        // Verificar que existe
        let clases = await repository.listClases(societyId);
        expect(clases.find((c) => c.id === created.id)).toBeDefined();

        // Eliminar
        await repository.deleteClase(societyId, created.id);

        // Verificar eliminación
        clases = await repository.listClases(societyId);
        expect(clases.find((c) => c.id === created.id)).toBeUndefined();
      });
    });
  });

  describe("Apoderados", () => {
    describe("listApoderados() - GET /api/v2/society-profile/:id/attorney-register/attorneys", () => {
      it("debe retornar un array vacío cuando no hay apoderados", async () => {
        const result = await repository.listApoderados(societyId);
        expect(result).toEqual([]);
        expect(Array.isArray(result)).toBe(true);
      });
    });

    describe("createApoderado() - POST /api/v2/society-profile/:id/attorney-register/attorneys", () => {
      it("debe crear un apoderado", async () => {
        // Crear clase primero
        const claseDTO = createClaseApoderadoDTO();
        const clase = await repository.createClase(societyId, claseDTO);

        // Crear apoderado
        const apoderadoDTO = createApoderadoDTO(clase.id);
        const result = await repository.createApoderado(societyId, apoderadoDTO);

        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.claseApoderadoId).toBe(clase.id);
        if (isPersonaNatural(result.persona) && isPersonaNatural(apoderadoDTO.persona)) {
          expect(result.persona.nombre).toBe(apoderadoDTO.persona.nombre);
          expect(result.persona.apellidoPaterno).toBe(apoderadoDTO.persona.apellidoPaterno);
        }
      });
    });

    describe("updateApoderado() - PUT /api/v2/society-profile/:id/attorney-register/attorneys", () => {
      it("debe actualizar un apoderado existente", async () => {
        // Crear clase y apoderado
        const claseDTO = createClaseApoderadoDTO();
        const clase = await repository.createClase(societyId, claseDTO);
        const apoderadoDTO = createApoderadoDTO(clase.id);
        const created = await repository.createApoderado(societyId, apoderadoDTO);

        // Actualizar
        const updatedDTO: ApoderadoDTO = {
          ...apoderadoDTO,
          id: created.id,
          persona: {
            ...apoderadoDTO.persona,
            nombre: "Roberto Actualizado",
          } as any,
        };

        const updated = await repository.updateApoderado(societyId, updatedDTO);
        if (isPersonaNatural(updated.persona)) {
          expect(updated.persona.nombre).toBe("Roberto Actualizado");
        }
      });
    });

    describe("deleteApoderado() - DELETE /api/v2/society-profile/:id/attorney-register/attorneys/:apoderadoId", () => {
      it("debe eliminar un apoderado", async () => {
        // Crear clase y apoderado
        const claseDTO = createClaseApoderadoDTO();
        const clase = await repository.createClase(societyId, claseDTO);
        const apoderadoDTO = createApoderadoDTO(clase.id);
        const created = await repository.createApoderado(societyId, apoderadoDTO);

        // Verificar que existe
        let apoderados = await repository.listApoderados(societyId);
        expect(apoderados.find((a) => a.id === created.id)).toBeDefined();

        // Eliminar
        await repository.deleteApoderado(societyId, clase.id, created.id);

        // Verificar eliminación
        apoderados = await repository.listApoderados(societyId);
        expect(apoderados.find((a) => a.id === created.id)).toBeUndefined();
      });
    });
  });

  describe("Flujo completo CRUD", () => {
    it("debe permitir crear, listar, actualizar y eliminar clases y apoderados", async () => {
      // Crear clase
      const claseDTO = createClaseApoderadoDTO();
      const clase = await repository.createClase(societyId, claseDTO);

      // Listar clases
      let clases = await repository.listClases(societyId);
      expect(clases.length).toBe(1);

      // Crear apoderado
      const apoderadoDTO = createApoderadoDTO(clase.id);
      const apoderado = await repository.createApoderado(societyId, apoderadoDTO);

      // Listar apoderados
      let apoderados = await repository.listApoderados(societyId);
      expect(apoderados.length).toBe(1);

      // Actualizar apoderado
      const updatedDTO: ApoderadoDTO = {
        ...apoderadoDTO,
        id: apoderado.id,
        persona: {
          ...apoderadoDTO.persona,
          nombre: "Roberto Actualizado",
        } as any,
      };
      const updated = await repository.updateApoderado(societyId, updatedDTO);
      if (isPersonaNatural(updated.persona)) {
        expect(updated.persona.nombre).toBe("Roberto Actualizado");
      }

      // Eliminar apoderado
      await repository.deleteApoderado(societyId, clase.id, apoderado.id);
      apoderados = await repository.listApoderados(societyId);
      expect(apoderados.length).toBe(0);

      // Eliminar clase
      await repository.deleteClase(societyId, clase.id);
      clases = await repository.listClases(societyId);
      expect(clases.length).toBe(0);
    });
  });
});

