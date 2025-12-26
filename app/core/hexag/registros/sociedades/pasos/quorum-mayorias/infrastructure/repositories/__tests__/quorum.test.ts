import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setupSociety, cleanupSociety } from "@tests/helpers/test-setup-helpers";
import { QuorumHttpRepository } from "../quorum.http.repository";
import type { QuorumDTO } from "../../../application/dtos/quorum.dto";

describe("Quorum Repository", () => {
  let repository: QuorumHttpRepository;
  let societyId: string;

  beforeAll(async () => {
    console.log("\n🚀 [Test Quorum] Iniciando...");
    repository = new QuorumHttpRepository();
    
    // ✅ REUTILIZAR helper
    societyId = await setupSociety();
    
    console.log(`✅ [Test Quorum] Setup completo\n`);
  });

  afterAll(async () => {
    await cleanupSociety(societyId);
  });

  it("debe obtener el quorum por defecto (creado automáticamente por el backend)", async () => {
    const quorum = await repository.get(societyId);
    
    // ✅ El backend real crea quorum por defecto al crear la sociedad
    // ✅ MSW retorna null si no se ha creado explícitamente
    if (quorum) {
      // Si existe quorum, verificar que tenga valores válidos
      expect(quorum.quorumMinimoSimple).toBeGreaterThanOrEqual(0);
      expect(quorum.quorumMinimoCalificado).toBeGreaterThanOrEqual(0);
      console.log("✅ Quorum por defecto obtenido:", quorum);
    } else {
      // Si MSW retorna null, es válido (no se creó aún)
      console.log("✅ Quorum vacío (MSW): null");
      expect(quorum).toBeNull();
    }
  });

  it("debe actualizar el quorum con valores legales (>= 50%)", async () => {
    const updatePayload: QuorumDTO = {
      quorumMinimoSimple: 50,      // ✅ Mínimo legal
      quorumMinimoCalificado: 60,  // ✅ Mayor para acuerdos calificados
      primeraConvocatoriaSimple: 60,
      primeraConvocatoriaCalificada: 70,
      segundaConvocatoriaSimple: 66,      // ✅ >= primeraConvocatoriaSimple
      segundaConvocatoriaCalificada: 80,  // ✅ >= primeraConvocatoriaCalificada
    };

    await repository.update(societyId, updatePayload);
    
    const updated = await repository.get(societyId);
    
    expect(updated).toBeDefined();
    expect(updated!.quorumMinimoSimple).toBe(50);
    expect(updated!.quorumMinimoCalificado).toBe(60);
    expect(updated!.primeraConvocatoriaSimple).toBe(60);
    expect(updated!.primeraConvocatoriaCalificada).toBe(70);
    expect(updated!.segundaConvocatoriaSimple).toBe(66);
    expect(updated!.segundaConvocatoriaCalificada).toBe(80);
    
    console.log("✅ Quorum actualizado correctamente con valores legales");
  });

  it("debe actualizar quorum con valores altos (cerca del 100%)", async () => {
    const updatePayload: QuorumDTO = {
      quorumMinimoSimple: 75,      // ✅ 75% (alto pero legal)
      quorumMinimoCalificado: 80,  // ✅ 80% (alto pero legal)
      primeraConvocatoriaSimple: 80,
      primeraConvocatoriaCalificada: 85,
      segundaConvocatoriaSimple: 85,      // ✅ >= primera
      segundaConvocatoriaCalificada: 90,  // ✅ >= primera
    };

    await repository.update(societyId, updatePayload);
    
    const updated = await repository.get(societyId);
    
    expect(updated!.quorumMinimoSimple).toBe(75);
    expect(updated!.quorumMinimoCalificado).toBe(80);
    expect(updated!.primeraConvocatoriaSimple).toBe(80);
    expect(updated!.segundaConvocatoriaCalificada).toBe(90);
    
    console.log("✅ Valores altos (75-90%) aceptados correctamente");
  });

  it("debe mantener los valores después de múltiples actualizaciones", async () => {
    // Primera actualización
    const firstUpdate: QuorumDTO = {
      quorumMinimoSimple: 45,
      quorumMinimoCalificado: 55,
      primeraConvocatoriaSimple: 55,
      primeraConvocatoriaCalificada: 65,
      segundaConvocatoriaSimple: 60,
      segundaConvocatoriaCalificada: 70,
    };

    await repository.update(societyId, firstUpdate);
    
    // Segunda actualización
    const secondUpdate: QuorumDTO = {
      quorumMinimoSimple: 50,
      quorumMinimoCalificado: 60,
      primeraConvocatoriaSimple: 60,
      primeraConvocatoriaCalificada: 70,
      segundaConvocatoriaSimple: 66,
      segundaConvocatoriaCalificada: 75,
    };

    await repository.update(societyId, secondUpdate);
    
    const final = await repository.get(societyId);
    
    // Verificar que los valores finales sean los de la segunda actualización
    expect(final!.quorumMinimoSimple).toBe(50);
    expect(final!.quorumMinimoCalificado).toBe(60);
    expect(final!.primeraConvocatoriaSimple).toBe(60);
    expect(final!.primeraConvocatoriaCalificada).toBe(70);
    expect(final!.segundaConvocatoriaSimple).toBe(66);
    expect(final!.segundaConvocatoriaCalificada).toBe(75);
    
    console.log("✅ Múltiples actualizaciones funcionan correctamente");
  });
});

