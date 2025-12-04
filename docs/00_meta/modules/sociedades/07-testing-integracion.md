# 🔗 Sociedades - Testing de Integración

> Tests de integración en `tests/sociedades/`

---

## 📍 Ubicación

```
tests/sociedades/
├── paso-1-datos-principales.test.ts
├── paso-2-accionistas.test.ts
├── paso-3-acciones.test.ts
├── paso-4-asignacion.test.ts
├── paso-5-directorio.test.ts
├── paso-6-apoderados.test.ts
└── paso-8-quorum.test.ts
```

---

## 📊 Tests de Integración

| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `paso-1-datos-principales.test.ts` | Crear sociedad completa | ✅ |
| `paso-2-accionistas.test.ts` | Flujo accionistas | ✅ |
| `paso-3-acciones.test.ts` | Flujo acciones | ✅ |
| `paso-4-asignacion.test.ts` | Flujo asignación | ✅ |
| `paso-5-directorio.test.ts` | Flujo directorio completo | ✅ |
| `paso-6-apoderados.test.ts` | Flujo apoderados + clases | ✅ |
| `paso-8-quorum.test.ts` | Configurar quorum | ✅ |

**Total:** 7 tests de integración, todos passing ✅

---

## 🎯 Ejemplo: Flujo Completo

```typescript
import { describe, it, expect } from "vitest";
import { createTestSociety, cleanupTestSociety } from "@tests/helpers/test-setup-helpers";

describe("Flujo Completo: Sociedad", () => {
  let societyId: string;

  afterEach(async () => {
    if (societyId) {
      await cleanupTestSociety(societyId);
    }
  });

  it("debe crear sociedad completa (8 pasos)", async () => {
    // Paso 1: Datos principales
    const result = await createTestSociety({
      razonSocial: "Test SA",
      capitalSocial: 10000,
    });
    societyId = result.societyId;

    expect(societyId).toBeDefined();

    // Paso 2-8: Ver helpers en @tests/helpers/
  });
});
```

---

## 🛠️ Helpers Reutilizables

Ubicación: `tests/helpers/test-setup-helpers.ts`

```typescript
export async function createTestSociety(data: Partial<CreateSocietyDTO>)
export async function createTestAccionistas(societyId: string, count: number)
export async function createTestAcciones(societyId: string, data: any)
export async function createTestAsignacion(societyId: string, assignments: any[])
export async function cleanupTestSociety(societyId: string)
```

---

## 📚 Ver También

- [06-testing-unitario.md](./06-testing-unitario.md) - Tests unitarios
- [../../../testing/03-test-helpers.md](../../../testing/03-test-helpers.md) - Helpers completos

---

**Última actualización:** Diciembre 3, 2025


