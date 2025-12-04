# 🛠️ Test Helpers

> Helpers reutilizables para tests.

---

## 📍 Ubicación

```
tests/helpers/test-setup-helpers.ts
```

---

## 🔧 Helpers Disponibles

### Sociedad Completa:
```typescript
createTestSociety(data: Partial<CreateSocietyDTO>): Promise<{ societyId: string }>
```

### Accionistas:
```typescript
createTestAccionistas(societyId: string, count: number): Promise<string[]>
```

### Acciones:
```typescript
createTestAcciones(societyId: string, data: any): Promise<string>
```

### Asignación:
```typescript
createTestAsignacion(societyId: string, assignments: any[]): Promise<void>
```

### Cleanup:
```typescript
cleanupTestSociety(societyId: string): Promise<void>
```

---

## 📝 Ejemplo de Uso

```typescript
import { createTestSociety, cleanupTestSociety } from "@tests/helpers/test-setup-helpers";

describe("Mi test", () => {
  let societyId: string;

  beforeEach(async () => {
    const result = await createTestSociety({ razonSocial: "Test SA" });
    societyId = result.societyId;
  });

  afterEach(async () => {
    await cleanupTestSociety(societyId);
  });

  it("debe hacer algo", async () => {
    // Test aquí
  });
});
```

---

**Última actualización:** Diciembre 3, 2025


