# 🧪 Sociedades - Testing Unitario

> Tests unitarios en `hexag/.../infrastructure/repositories/__tests__/`

---

## 📍 Ubicación

```
app/core/hexag/registros/sociedades/pasos/
└── [paso]/
    └── infrastructure/
        └── repositories/
            └── __tests__/
                └── [paso].test.ts
```

---

## 📊 Tests por Paso

| Paso | Archivo | Tests | Estado |
|------|---------|-------|--------|
| 1. Datos Principales | `datos-principales.test.ts` | 3 | ✅ 3/3 |
| 2. Accionistas | `accionistas.test.ts` | 3 | ✅ 3/3 |
| 3. Acciones | `acciones.test.ts` | 3 | ✅ 3/3 |
| 4. Asignación | `asignacion.test.ts` | 1 | ✅ 1/1 |
| 5. Directorio | `directorio.test.ts` | 6 | ⚠️ 4/6 (2 issues backend) |
| 6. Apoderados | `apoderados.test.ts` | 9 | ✅ 9/9 |
| 8. Quorum | `quorum.test.ts` | 4 | ⚠️ 3/4 (1 issue backend) |

**Total:** 29 tests, 26 passing (89.6%)

---

## 🎯 Estructura de Test

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { Repository } from "../repository.http.repository";

describe("Repository", () => {
  const repository = new Repository();

  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it("debe hacer X", async () => {
    // Arrange
    const input = { ... };

    // Act
    const result = await repository.method(input);

    // Assert
    expect(result).toBeDefined();
    expect(result.field).toBe("esperado");
  });
});
```

---

## 📚 Ver También

- [04-infrastructure.md](./04-infrastructure.md) - Repositorios testeados
- [../../../architecture/04-patron-testing.md](../../../architecture/04-patron-testing.md) - Estrategia global

---

**Última actualización:** Diciembre 3, 2025


