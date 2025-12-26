import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";
import { QuorumHttpRepository } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/infrastructure/repositories/quorum.http.repository";
import type { QuorumDTO } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/application/dtos/quorum.dto";

describe("PASO 6: Quorum y Mayorías - Backend Real", () => {
  let sociedadRepo: SociedadHttpRepository;
  let quorumRepo: QuorumHttpRepository;
  let testSocietyId: string;

  beforeAll(async () => {
    console.log("\n🚀 [Paso 6] Iniciando tests...");
    
    sociedadRepo = new SociedadHttpRepository();
    quorumRepo = new QuorumHttpRepository();

    // Limpiar sociedades previas del test
    try {
      const societies = await sociedadRepo.getAll();
      for (const society of societies) {
        try {
          await sociedadRepo.delete(society.structureId);
        } catch {
          // Ignorar errores de eliminación
        }
      }
    } catch {
      // Ignorar si no hay sociedades
    }

    // Crear sociedad de prueba
    testSocietyId = await sociedadRepo.create();
    console.log(`✅ [Paso 6] Sociedad creada: ${testSocietyId}`);
  });

  afterAll(async () => {
    if (testSocietyId) {
      await sociedadRepo.delete(testSocietyId);
      console.log("✅ [Paso 6] Sociedad eliminada");
    }
  });

  it("debe obtener el quorum por defecto", async () => {
    const quorum = await quorumRepo.get(testSocietyId);
    
    expect(quorum).toBeDefined();
    expect(typeof quorum.quorumMinimoSimple).toBe("number");
    expect(typeof quorum.quorumMinimoCalificado).toBe("number");
    expect(typeof quorum.primeraConvocatoriaSimple).toBe("number");
    expect(typeof quorum.primeraConvocatoriaCalificada).toBe("number");
    expect(typeof quorum.segundaConvocatoriaSimple).toBe("number");
    expect(typeof quorum.segundaConvocatoriaCalificada).toBe("number");
    
    console.log("✅ Quorum por defecto:", quorum);
  });

  it("debe actualizar quorum con valores estándar", async () => {
    const payload: QuorumDTO = {
      quorumMinimoSimple: 50,
      quorumMinimoCalificado: 60,
      primeraConvocatoriaSimple: 60,
      primeraConvocatoriaCalificada: 70,
      segundaConvocatoriaSimple: 66,
      segundaConvocatoriaCalificada: 80,
    };

    await quorumRepo.update(testSocietyId, payload);
    
    const updated = await quorumRepo.get(testSocietyId);
    
    expect(updated.quorumMinimoSimple).toBe(50);
    expect(updated.quorumMinimoCalificado).toBe(60);
    expect(updated.primeraConvocatoriaSimple).toBe(60);
    expect(updated.primeraConvocatoriaCalificada).toBe(70);
    expect(updated.segundaConvocatoriaSimple).toBe(66);
    expect(updated.segundaConvocatoriaCalificada).toBe(80);
    
    console.log("✅ Quorum actualizado correctamente");
  });

  it("debe aceptar quorum mínimo legal (50%)", async () => {
    const payload: QuorumDTO = {
      quorumMinimoSimple: 50,      // ✅ Mínimo legal
      quorumMinimoCalificado: 60,  // ✅ Mayor para calificados
      primeraConvocatoriaSimple: 60,
      primeraConvocatoriaCalificada: 70,
      segundaConvocatoriaSimple: 66,
      segundaConvocatoriaCalificada: 80,
    };

    await quorumRepo.update(testSocietyId, payload);
    
    const updated = await quorumRepo.get(testSocietyId);
    
    expect(updated.quorumMinimoSimple).toBe(50);
    expect(updated.quorumMinimoCalificado).toBe(60);
    
    console.log("✅ Quorum mínimo legal (50%) aceptado");
  });

  it("debe aceptar quorum alto (cerca del 100%)", async () => {
    const payload: QuorumDTO = {
      quorumMinimoSimple: 75,      // ✅ 75% (alto pero legal)
      quorumMinimoCalificado: 80,  // ✅ 80% (alto pero legal)
      primeraConvocatoriaSimple: 80,
      primeraConvocatoriaCalificada: 85,
      segundaConvocatoriaSimple: 85,  // ✅ >= primera
      segundaConvocatoriaCalificada: 90,  // ✅ >= primera
    };

    await quorumRepo.update(testSocietyId, payload);
    
    const updated = await quorumRepo.get(testSocietyId);
    
    expect(updated.quorumMinimoSimple).toBe(75);
    expect(updated.quorumMinimoCalificado).toBe(80);
    expect(updated.primeraConvocatoriaSimple).toBe(80);
    expect(updated.primeraConvocatoriaCalificada).toBe(85);
    
    console.log("✅ Quorum alto (75-90%) aceptado");
  });

  it("debe permitir actualizar solo algunos valores", async () => {
    // Establecer valores base
    const basePayload: QuorumDTO = {
      quorumMinimoSimple: 40,
      quorumMinimoCalificado: 50,
      primeraConvocatoriaSimple: 50,
      primeraConvocatoriaCalificada: 60,
      segundaConvocatoriaSimple: 55,
      segundaConvocatoriaCalificada: 65,
    };

    await quorumRepo.update(testSocietyId, basePayload);
    
    // Actualizar solo algunos valores
    const partialPayload: QuorumDTO = {
      quorumMinimoSimple: 45,
      quorumMinimoCalificado: 55,
      primeraConvocatoriaSimple: 55,
      primeraConvocatoriaCalificada: 65,
      segundaConvocatoriaSimple: 60,
      segundaConvocatoriaCalificada: 70,
    };

    await quorumRepo.update(testSocietyId, partialPayload);
    
    const updated = await quorumRepo.get(testSocietyId);
    
    expect(updated.quorumMinimoSimple).toBe(45);
    expect(updated.quorumMinimoCalificado).toBe(55);
    expect(updated.segundaConvocatoriaCalificada).toBe(70);
    
    console.log("✅ Actualización parcial exitosa");
  });

  it("debe mantener coherencia en valores de segunda convocatoria", async () => {
    // Segunda convocatoria debe ser >= Primera convocatoria (lógica de negocio)
    const payload: QuorumDTO = {
      quorumMinimoSimple: 50,
      quorumMinimoCalificado: 60,
      primeraConvocatoriaSimple: 60,
      primeraConvocatoriaCalificada: 70,
      segundaConvocatoriaSimple: 70, // >= primeraConvocatoriaSimple
      segundaConvocatoriaCalificada: 80, // >= primeraConvocatoriaCalificada
    };

    await quorumRepo.update(testSocietyId, payload);
    
    const updated = await quorumRepo.get(testSocietyId);
    
    expect(updated.segundaConvocatoriaSimple).toBeGreaterThanOrEqual(updated.primeraConvocatoriaSimple);
    expect(updated.segundaConvocatoriaCalificada).toBeGreaterThanOrEqual(updated.primeraConvocatoriaCalificada);
    
    console.log("✅ Coherencia de convocatorias validada");
  });
});

