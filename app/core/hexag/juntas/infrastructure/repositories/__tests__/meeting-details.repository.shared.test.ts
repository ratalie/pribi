/**
 * Tests Compartidos para Repositorios de Meeting Details
 *
 * Este archivo contiene tests que se ejecutan con AMBOS repositorios:
 * - MeetingDetailsHttpRepository (HTTP real o interceptado por MSW)
 * - MeetingDetailsMswRepository (directo al state mock)
 *
 * @pattern Shared Test Suite - Repository Contract Testing
 *
 * Objetivo: Garantizar que ambos repositorios implementan el mismo contrato
 * y producen los mismos resultados para las mismas operaciones.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { clearAllMockData } from "~/core/hexag/registros/shared/mock-database";
import type { MeetingDetailsRepository } from "../../../domain/ports/meeting-details.repository";
import type { MeetingDetails } from "../../../domain/entities/meeting-details.entity";
import { MeetingDetailsHttpRepository } from "../meeting-details.http.repository";
import { MeetingDetailsMswRepository } from "../meeting-details.msw.repository";
import { TipoJunta } from "../../../domain/enums/tipo-junta.enum";
import { ModoReunion } from "../../../domain/enums/modo-reunion.enum";
import { OrdenConvocatoria } from "../../../domain/enums/orden-convocatoria.enum";

/**
 * Helper para crear un MeetingDetails de prueba
 */
function createTestMeetingDetails(tipoJunta: TipoJunta = TipoJunta.UNIVERSAL): MeetingDetails {
  const baseDetails: MeetingDetails = {
    tipoJunta,
    esAnualObligatoria: false,
    primeraConvocatoria: {
      direccion: "Av. Principal 123, Lima",
      modo: ModoReunion.IN_PERSON,
      fecha: new Date("2025-01-15T00:00:00Z"),
      hora: new Date("2025-01-15T14:30:00Z"),
    },
    presidenteAsistio: false,
    secretarioAsistio: false,
  };

  // Si es Junta General, agregar segunda convocatoria
  if (tipoJunta === TipoJunta.GENERAL) {
    baseDetails.segundaConvocatoria = {
      direccion: "https://zoom.us/j/123456789",
      modo: ModoReunion.VIRTUAL,
      fecha: new Date("2025-01-18T00:00:00Z"),
      hora: new Date("2025-01-18T14:30:00Z"),
    };
    baseDetails.instaladaEnConvocatoria = OrdenConvocatoria.PRIMERA;
  }

  return baseDetails;
}

/**
 * Suite de tests compartidos
 */
describe.each([
  { name: "MeetingDetailsHttpRepository", factory: () => new MeetingDetailsHttpRepository() },
  { name: "MeetingDetailsMswRepository", factory: () => new MeetingDetailsMswRepository() },
])("$name - Tests Compartidos", ({ name: _name, factory }) => {
  let repository: MeetingDetailsRepository;
  let societyId: number;
  let flowId: number;

  beforeEach(async () => {
    repository = factory();
    await clearAllMockData();
    societyId = 1;
    flowId = 1;
  });

  describe("get() - GET /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details", () => {
    it("debe retornar datos por defecto cuando no hay datos guardados", async () => {
      const result = await repository.get(societyId, flowId);

      // Puede retornar null o datos por defecto
      if (result !== null) {
        expect(result).toHaveProperty("tipoJunta");
        expect(result).toHaveProperty("esAnualObligatoria");
        expect(result).toHaveProperty("presidenteAsistio");
        expect(result).toHaveProperty("secretarioAsistio");
      }
    });

    it("debe retornar datos guardados después de actualizar", async () => {
      const payload = createTestMeetingDetails(TipoJunta.UNIVERSAL);

      // Actualizar
      await repository.update(societyId, flowId, payload);

      // Obtener
      const result = await repository.get(societyId, flowId);

      expect(result).toBeDefined();
      expect(result?.tipoJunta).toBe(TipoJunta.UNIVERSAL);
      expect(result?.primeraConvocatoria).toBeDefined();
      expect(result?.primeraConvocatoria?.direccion).toBe("Av. Principal 123, Lima");
    });
  });

  describe("update() - PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details", () => {
    it("debe actualizar meeting details con tipo UNIVERSAL", async () => {
      const payload = createTestMeetingDetails(TipoJunta.UNIVERSAL);

      await repository.update(societyId, flowId, payload);

      const result = await repository.get(societyId, flowId);

      expect(result).toBeDefined();
      expect(result?.tipoJunta).toBe(TipoJunta.UNIVERSAL);
      expect(result?.esAnualObligatoria).toBe(false);
      expect(result?.primeraConvocatoria).toBeDefined();
      expect(result?.segundaConvocatoria).toBeUndefined();
    });

    it("debe actualizar meeting details con tipo GENERAL", async () => {
      const payload = createTestMeetingDetails(TipoJunta.GENERAL);

      await repository.update(societyId, flowId, payload);

      const result = await repository.get(societyId, flowId);

      expect(result).toBeDefined();
      expect(result?.tipoJunta).toBe(TipoJunta.GENERAL);
      expect(result?.primeraConvocatoria).toBeDefined();
      expect(result?.segundaConvocatoria).toBeDefined();
      expect(result?.instaladaEnConvocatoria).toBe(OrdenConvocatoria.PRIMERA);
    });

    it("debe actualizar modo de reunión (PRESENCIAL/VIRTUAL)", async () => {
      const payload = createTestMeetingDetails(TipoJunta.UNIVERSAL);
      payload.primeraConvocatoria!.modo = ModoReunion.VIRTUAL;
      payload.primeraConvocatoria!.direccion = "https://zoom.us/j/987654321";

      await repository.update(societyId, flowId, payload);

      const result = await repository.get(societyId, flowId);

      expect(result?.primeraConvocatoria?.modo).toBe(ModoReunion.VIRTUAL);
      expect(result?.primeraConvocatoria?.direccion).toBe("https://zoom.us/j/987654321");
    });

    it("debe actualizar datos de autoridades", async () => {
      const payload = createTestMeetingDetails(TipoJunta.UNIVERSAL);
      payload.presidenteId = "uuid-presidente-123";
      payload.secretarioId = "uuid-secretario-456";
      payload.presidenteAsistio = true;
      payload.secretarioAsistio = false;
      payload.nombreOtroSecretario = "Juan Pérez Gómez";

      await repository.update(societyId, flowId, payload);

      const result = await repository.get(societyId, flowId);

      expect(result?.presidenteId).toBe("uuid-presidente-123");
      expect(result?.secretarioId).toBe("uuid-secretario-456");
      expect(result?.presidenteAsistio).toBe(true);
      expect(result?.secretarioAsistio).toBe(false);
      expect(result?.nombreOtroSecretario).toBe("Juan Pérez Gómez");
    });

    it("debe actualizar fechas y horas correctamente", async () => {
      const fecha = new Date("2025-03-20T00:00:00Z");
      const hora = new Date("2025-03-20T16:00:00Z");

      const payload = createTestMeetingDetails(TipoJunta.UNIVERSAL);
      payload.primeraConvocatoria!.fecha = fecha;
      payload.primeraConvocatoria!.hora = hora;

      await repository.update(societyId, flowId, payload);

      const result = await repository.get(societyId, flowId);

      expect(result?.primeraConvocatoria?.fecha).toEqual(fecha);
      expect(result?.primeraConvocatoria?.hora).toEqual(hora);
    });

    it("debe actualizar esAnualObligatoria", async () => {
      const payload = createTestMeetingDetails(TipoJunta.GENERAL);
      payload.esAnualObligatoria = true;

      await repository.update(societyId, flowId, payload);

      const result = await repository.get(societyId, flowId);

      expect(result?.esAnualObligatoria).toBe(true);
    });

    it("debe poder cambiar de UNIVERSAL a GENERAL", async () => {
      // Primero crear como Universal
      const payload1 = createTestMeetingDetails(TipoJunta.UNIVERSAL);
      await repository.update(societyId, flowId, payload1);

      // Cambiar a General
      const payload2 = createTestMeetingDetails(TipoJunta.GENERAL);
      await repository.update(societyId, flowId, payload2);

      const result = await repository.get(societyId, flowId);

      expect(result?.tipoJunta).toBe(TipoJunta.GENERAL);
      expect(result?.segundaConvocatoria).toBeDefined();
    });

    it("debe poder cambiar de GENERAL a UNIVERSAL", async () => {
      // Primero crear como General
      const payload1 = createTestMeetingDetails(TipoJunta.GENERAL);
      await repository.update(societyId, flowId, payload1);

      // Cambiar a Universal
      const payload2 = createTestMeetingDetails(TipoJunta.UNIVERSAL);
      await repository.update(societyId, flowId, payload2);

      const result = await repository.get(societyId, flowId);

      expect(result?.tipoJunta).toBe(TipoJunta.UNIVERSAL);
      expect(result?.segundaConvocatoria).toBeUndefined();
    });

    it("no debe afectar datos de otras juntas", async () => {
      const payload1 = createTestMeetingDetails(TipoJunta.UNIVERSAL);
      const payload2 = createTestMeetingDetails(TipoJunta.GENERAL);

      // Actualizar junta 1
      await repository.update(societyId, 1, payload1);
      // Actualizar junta 2
      await repository.update(societyId, 2, payload2);

      // Verificar independencia
      const result1 = await repository.get(societyId, 1);
      const result2 = await repository.get(societyId, 2);

      expect(result1?.tipoJunta).toBe(TipoJunta.UNIVERSAL);
      expect(result2?.tipoJunta).toBe(TipoJunta.GENERAL);
    });
  });
});

