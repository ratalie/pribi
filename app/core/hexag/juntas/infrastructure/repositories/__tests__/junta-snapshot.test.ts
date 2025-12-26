/**
 * TEST COMPLETO: Snapshot de Junta con Datos Conocidos
 * 
 * Este test crea una sociedad COMPLETA con datos conocidos,
 * luego crea una junta y valida que el snapshot contenga
 * EXACTAMENTE los datos esperados.
 * 
 * Comando: npm run test:juntas:snapshot
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  crearSociedadCompletaParaJunta,
  crearJunta,
  obtenerSnapshot,
  cleanupJuntaCompleta,
  type SociedadCompletaData,
} from "@tests/helpers/juntas/test-juntas-helpers";

describe("Snapshot Completo de Junta - Con Datos Conocidos", () => {
  let sociedadData: SociedadCompletaData;
  let flowId: string;

  beforeAll(async () => {
    console.log("\n🚀 [Test Snapshot] Iniciando...\n");

    // 1. Crear sociedad COMPLETA con todos los pasos
    sociedadData = await crearSociedadCompletaParaJunta();

    // 2. Crear junta
    flowId = await crearJunta(sociedadData.societyId);

    console.log("✅ [Test Snapshot] Setup completo\n");
  }, 120000); // 2 minutos de timeout para crear todo

  afterAll(async () => {
    // Cleanup
    if (flowId && sociedadData?.societyId) {
      await cleanupJuntaCompleta(sociedadData.societyId, flowId);
    }
  });

  it("debe obtener snapshot con estructura completa", async () => {
    const snapshot = await obtenerSnapshot(sociedadData.societyId, flowId);

    // Validar IDs principales
    expect(snapshot.shareholderId).toBeDefined();
    expect(snapshot.nominalValueId).toBeDefined();
    expect(snapshot.shareAllocationId).toBeDefined();
    expect(snapshot.meetingConfigId).toBeDefined();

    // Validar que tiene todas las propiedades
    expect(snapshot).toHaveProperty("nominalValue");
    expect(snapshot).toHaveProperty("shareClasses");
    expect(snapshot).toHaveProperty("shareholders");
    expect(snapshot).toHaveProperty("shareAllocations");
    expect(snapshot).toHaveProperty("flowInfo");
  });

  it("debe contener EXACTAMENTE 1 accionista creado", async () => {
    const snapshot = await obtenerSnapshot(sociedadData.societyId, flowId);

    expect(snapshot.shareholders).toBeDefined();
    expect(Array.isArray(snapshot.shareholders)).toBe(true);
    expect(snapshot.shareholders.length).toBe(1);

    // Validar que es el accionista que creamos
    const accionista = snapshot.shareholders[0]!;
    expect(accionista.id).toBe(sociedadData.accionistaId);
    expect(accionista.person).toBeDefined();
    expect(accionista.person.tipo).toBe("NATURAL");
    
    // Type guard para persona natural
    if (accionista.person.tipo === "NATURAL") {
      expect(accionista.person.nombre).toBe("Ana");
      expect(accionista.person.apellidoPaterno).toBe("Torres");
      expect(accionista.person.apellidoMaterno).toBe("Ruiz");
    }
  });

  it("debe contener EXACTAMENTE 1 clase de acción (500 acciones)", async () => {
    const snapshot = await obtenerSnapshot(sociedadData.societyId, flowId);

    expect(snapshot.shareClasses).toBeDefined();
    expect(Array.isArray(snapshot.shareClasses)).toBe(true);
    expect(snapshot.shareClasses.length).toBe(1);

    const accion = snapshot.shareClasses[0]!;
    expect(accion.id).toBe(sociedadData.accionId);
    expect(accion.tipo).toBe("COMUN");
    expect(accion.cantidadSuscrita).toBe(500);
    expect(accion.conDerechoVoto).toBe(true);
  });

  it("debe contener asignaciones de acciones (array)", async () => {
    const snapshot = await obtenerSnapshot(sociedadData.societyId, flowId);

    expect(snapshot.shareAllocations).toBeDefined();
    expect(Array.isArray(snapshot.shareAllocations)).toBe(true);
    // Puede estar vacío si no se crearon asignaciones
  });

  it("debe contener directorio (puede ser null si no se creó)", async () => {
    const snapshot = await obtenerSnapshot(sociedadData.societyId, flowId);

    // Directorio es opcional (puede ser null)
    expect(snapshot).toHaveProperty("directory");
    
    // Si no se creó directorio, debe ser null
    // Si se creó, debe ser un objeto
    if (snapshot.directory !== null && snapshot.directory !== undefined) {
      expect(typeof snapshot.directory).toBe("object");
    }
  });

  it("debe contener arrays de directors y attorneys (pueden estar vacíos)", async () => {
    const snapshot = await obtenerSnapshot(sociedadData.societyId, flowId);

    // Directors y attorneys son opcionales
    expect(snapshot).toHaveProperty("directors");
    expect(snapshot).toHaveProperty("attorneys");
    
    // Si existen, deben ser arrays
    if (snapshot.directors !== undefined && snapshot.directors !== null) {
      expect(Array.isArray(snapshot.directors)).toBe(true);
    }
    if (snapshot.attorneys !== undefined && snapshot.attorneys !== null) {
      expect(Array.isArray(snapshot.attorneys)).toBe(true);
    }
  });

  it("debe contener quorum (puede ser null si no se configuró)", async () => {
    const snapshot = await obtenerSnapshot(sociedadData.societyId, flowId);

    // Quorum es opcional
    expect(snapshot).toHaveProperty("quorums");
    
    // Si se configuró, validar estructura
    if (snapshot.quorums !== null && snapshot.quorums !== undefined) {
      expect(snapshot.quorums).toHaveProperty("mayoriasAcuerdosSimple");
      expect(snapshot.quorums).toHaveProperty("mayoriasAcuerdosCalificado");
    }
  });

  it("debe contener valor nominal = 1.0", async () => {
    const snapshot = await obtenerSnapshot(sociedadData.societyId, flowId);

    expect(snapshot.nominalValue).toBeDefined();
    expect(snapshot.nominalValue).toBe(1.0);
  });

  it("debe contener flowInfo con estado correcto", async () => {
    const snapshot = await obtenerSnapshot(sociedadData.societyId, flowId);

    expect(snapshot.flowInfo).toBeDefined();
    expect(snapshot.flowInfo.flowStructureId).toBe(parseInt(flowId, 10));
    expect(snapshot.flowInfo.currentStep).toBe("INIT");
    expect(snapshot.flowInfo.statusProgression).toBe("CREATED");
  });

  it("debe contener meetingConfig", async () => {
    const snapshot = await obtenerSnapshot(sociedadData.societyId, flowId);

    expect(snapshot.meetingConfig).toBeDefined();
    expect(snapshot.meetingConfig.id).toBeDefined();
    expect(snapshot.meetingConfig).toHaveProperty("meetingType");
    expect(snapshot.meetingConfig).toHaveProperty("isAnnualMandatory");
  });
});

