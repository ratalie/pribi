# 🎯 PLAN: Sistema de Testing Profesional

**Fecha:** 3 Diciembre 2025  
**Objetivo:** Sistema de tests organizados por paso, con cleanup automático

---

## 🚨 PROBLEMA ACTUAL

**Tests mal organizados:**
- ❌ beforeEach() crea sociedad SIEMPRE (incluso cuando no se necesita)
- ❌ Todos los tests corren juntos (difícil debugear)
- ❌ No hay separación por pasos
- ❌ No hay cleanup automático entre tests

**Resultado:**
- Test "debe retornar array vacío" → FALLA (porque beforeEach creó una sociedad)
- Imposible saber qué paso específico falla

---

## ✅ SOLUCIÓN: Tests Organizados por Paso

### **Estructura Nueva:**

```
tests/
├── sociedades/
│   ├── 0-cleanup.test.ts                    # Limpiar BD
│   ├── 1-crear-sociedad.test.ts             # SOLO Paso 0
│   ├── 2-datos-sociedad.test.ts             # SOLO Paso 1
│   ├── 3-accionistas.test.ts                # SOLO Paso 2
│   ├── 4-acciones.test.ts                   # SOLO Paso 3
│   ├── 5-asignacion.test.ts                 # SOLO Paso 4
│   ├── 6-quorum.test.ts                     # SOLO Paso 5
│   ├── 7-directorio.test.ts                 # SOLO Paso 6
│   ├── 8-apoderados.test.ts                 # SOLO Paso 7
│   └── 9-flujo-completo.test.ts             # TODOS los pasos
└── helpers/
    ├── cleanup.helper.ts
    └── sociedad-flow.helper.ts
```

### **Comandos en package.json:**

```json
{
  "scripts": {
    // Cleanup
    "test:cleanup": "TEST_USE_MSW=false npm run test 0-cleanup.test.ts",
    
    // Por paso individual
    "test:sociedades:paso0": "TEST_USE_MSW=false npm run test 1-crear-sociedad.test.ts",
    "test:sociedades:paso1": "TEST_USE_MSW=false npm run test 2-datos-sociedad.test.ts",
    "test:sociedades:paso2": "TEST_USE_MSW=false npm run test 3-accionistas.test.ts",
    "test:sociedades:paso3": "TEST_USE_MSW=false npm run test 4-acciones.test.ts",
    
    // Hasta cierto paso (acumulativo)
    "test:sociedades:hasta-paso1": "npm run test:cleanup && npm run test:sociedades:paso0 && npm run test:sociedades:paso1",
    "test:sociedades:hasta-paso3": "npm run test:cleanup && npm run test:sociedades:paso0 && npm run test:sociedades:paso1 && npm run test:sociedades:paso2 && npm run test:sociedades:paso3",
    
    // Todos (lo que ya tienes)
    "test:sociedades:backend": "npm run test:cleanup && TEST_USE_MSW=false vitest run sociedad.repository.shared.test.ts datos-sociedad.repository.shared.test.ts accionistas.repository.shared.test.ts acciones.repository.shared.test.ts asignacion-acciones.repository.shared.test.ts quorum.repository.shared.test.ts director.repository.shared.test.ts apoderados.repository.shared.test.ts"
  }
}
```

---

## 📝 EJEMPLO: Test del Paso 0 (Crear Sociedad)

**Archivo:** `tests/sociedades/1-crear-sociedad.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository";
import { cleanupAllSociedades } from "../helpers/cleanup.helper";

describe("PASO 0: Crear Sociedad", () => {
  let repository: SociedadHttpRepository;
  let createdIds: string[] = [];

  beforeAll(async () => {
    repository = new SociedadHttpRepository();
    // Limpiar ANTES de empezar
    await cleanupAllSociedades();
  });

  afterAll(async () => {
    // Limpiar DESPUÉS de terminar
    for (const id of createdIds) {
      try {
        await repository.delete(id);
      } catch (error) {
        console.warn(`No se pudo eliminar ${id}`);
      }
    }
  });

  it("debe crear una sociedad y retornar structureId", async () => {
    const id = await repository.create();
    createdIds.push(id);
    
    expect(id).toBeDefined();
    expect(typeof id).toBe("string");
    expect(Number(id)).toBeGreaterThan(0);
  });

  it("debe listar la sociedad creada", async () => {
    const list = await repository.list();
    
    expect(list.length).toBe(1);
    expect(list[0].idSociety).toBe(createdIds[0]);
  });

  it("debe eliminar la sociedad creada", async () => {
    await repository.delete(createdIds[0]);
    
    const list = await repository.list();
    expect(list.length).toBe(0);
  });
});
```

---

## ⚡ IMPLEMENTACIÓN RÁPIDA

Voy a crear AHORA MISMO:

1. ✅ Test del Paso 0 (crear sociedad)
2. ✅ Test del Paso 1 (datos sociedad)  
3. ✅ Actualizar package.json con comandos

**¿Procedo?** 🚀

