# 🧪 Patrón de Testing Global

> Este documento describe la estrategia de testing del proyecto, usando **MSW (Mock Service Worker)** + **Vitest**.

---

## 🎯 Objetivos del Testing

### ¿Por qué testear?

1. **Confianza:** Garantizar que el código funciona como se espera
2. **Documentación:** Los tests sirven como documentación viva
3. **Refactoring:** Cambiar código sin miedo a romper funcionalidad
4. **Velocidad:** Detectar bugs antes de producción

### ¿Qué testear?

✅ **SÍ testear:**
- Lógica de negocio (use cases)
- Repositorios (HTTP, mappers)
- Stores (Pinia)
- Flujos completos (integración)

❌ **NO testear:**
- Componentes Vue (por ahora)
- CSS/estilos
- Tipos TypeScript

---

## 📊 Tipos de Tests

### 1. Tests Unitarios (en `hexag/`)

**Ubicación:** `app/core/hexag/.../infrastructure/repositories/__tests__/`

**Propósito:** Testear repositorios individuales (HTTP + mappers)

**Ejemplo:**
```typescript
// app/core/hexag/registros/sociedades/pasos/datos-principales/infrastructure/repositories/__tests__/datos-principales.test.ts

import { describe, it, expect } from "vitest";
import { DatosPrincipalesHttpRepository } from "../datos-principales.http.repository";

describe("DatosPrincipalesHttpRepository", () => {
  it("debe crear datos principales", async () => {
    const repository = new DatosPrincipalesHttpRepository();
    
    const result = await repository.create({
      razonSocial: "Test SA",
      tipoSociedad: "SA",
      capitalSocial: 10000,
    });

    expect(result.id).toBeDefined();
    expect(result.razonSocial).toBe("Test SA");
  });
});
```

**Características:**
- ✅ Rápidos (< 100ms por test)
- ✅ Usan MSW para interceptar HTTP
- ✅ Testean una sola unidad (repository)

---

### 2. Tests de Integración (en `tests/`)

**Ubicación:** `tests/sociedades/paso-X-nombre.test.ts`

**Propósito:** Testear flujos completos (múltiples pasos)

**Ejemplo:**
```typescript
// tests/sociedades/paso-1-datos-principales.test.ts

import { describe, it, expect } from "vitest";
import { createTestSociety } from "@tests/helpers/test-setup-helpers";

describe("Flujo: Crear Sociedad Completa", () => {
  it("debe crear sociedad con todos los pasos", async () => {
    // Paso 1: Crear datos principales
    const { societyId } = await createTestSociety({
      razonSocial: "Test SA",
      capitalSocial: 10000,
    });

    expect(societyId).toBeDefined();

    // Paso 2: Crear accionistas
    // ...
  });
});
```

**Características:**
- ✅ Prueban flujos completos
- ✅ Usan helpers reutilizables
- ✅ Validan estado final

---

## 🌐 MSW (Mock Service Worker)

### ¿Qué es MSW?

MSW intercepta peticiones HTTP en Node.js y devuelve respuestas mockeadas.

```
Test → $fetch('/api/sociedades')
         ↓ (interceptado por MSW)
       MSW Handler → responde { id: 'mock-123', ... }
         ↓
Test recibe respuesta mockeada
```

### Ventajas:

✅ **Tests ultra rápidos** (sin esperar backend real)  
✅ **Tests confiables** (sin depender de red)  
✅ **Tests reproducibles** (mismo resultado siempre)  
✅ **Desarrollo offline** (sin backend corriendo)

---

### Configuración de MSW

#### 1. Setup global (`tests/setup.ts`):

```typescript
import { setupServer } from "msw/node";
import { allMockHandlers } from "~/core/hexag/mocks/register-handlers";

export const mswServer = setupServer(...allMockHandlers);

beforeAll(() => {
  mswServer.listen({ onUnhandledRequest: "bypass" });
});

afterEach(() => {
  mswServer.resetHandlers();
});

afterAll(() => {
  mswServer.close();
});
```

#### 2. Handlers (`app/core/hexag/mocks/handlers/...`):

```typescript
// app/core/hexag/mocks/handlers/sociedades/datos-principales.handlers.ts

import { http, HttpResponse } from "msw";

export const datosPrincipalesHandlers = [
  // POST /api/v2/society-profile
  http.post("/api/v2/society-profile", async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json({
      id: "mock-society-123",
      razon_social: body.razonSocial,
      capital_social: body.capitalSocial,
      created_at: new Date().toISOString(),
    });
  }),

  // GET /api/v2/society-profile/:id
  http.get("/api/v2/society-profile/:id", ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      razon_social: "Test SA",
      capital_social: 10000,
    });
  }),
];
```

#### 3. Registro de handlers (`app/core/hexag/mocks/register-handlers.ts`):

```typescript
import { datosPrincipalesHandlers } from "./handlers/sociedades/datos-principales.handlers";
import { accionistasHandlers } from "./handlers/sociedades/accionistas.handlers";
// ...

export const allMockHandlers = [
  ...datosPrincipalesHandlers,
  ...accionistasHandlers,
  // ...
];
```

---

### Modo de Tests

#### Modo 1: MSW (Rápido - Recomendado)

```bash
# tests/config/test-config.ts
TEST_USE_MSW=true

# Ejecutar tests
npm run test
```

**Ventajas:**
- ⚡ Ultra rápido (< 5 segundos para 51 tests)
- 🔄 Reproducible (siempre mismo resultado)
- 🚫 No requiere backend corriendo

**Desventajas:**
- ⚠️ Mocks deben estar sincronizados con backend real

---

#### Modo 2: Backend Real (Lento)

```bash
# tests/config/test-config.ts
TEST_USE_MSW=false

# Ejecutar tests
npm run test:real
```

**Ventajas:**
- ✅ Valida contra backend real
- ✅ No requiere mantener mocks

**Desventajas:**
- 🐌 Lento (> 30 segundos para 51 tests)
- 🌐 Requiere backend corriendo
- ⚠️ Puede fallar por problemas de red

---

## 🛠️ Helpers de Testing

### Ubicación: `tests/helpers/test-setup-helpers.ts`

### Helpers disponibles:

```typescript
// Crear sociedad completa
export async function createTestSociety(data: Partial<CreateSocietyDTO>): Promise<{ societyId: string }> {
  // ...
}

// Crear accionistas
export async function createTestAccionistas(societyId: string, count: number): Promise<string[]> {
  // ...
}

// Crear acciones
export async function createTestAcciones(societyId: string, data: any): Promise<string> {
  // ...
}

// Crear asignación
export async function createTestAsignacion(societyId: string, assignments: any[]): Promise<void> {
  // ...
}

// Limpiar datos de test
export async function cleanupTestSociety(societyId: string): Promise<void> {
  // ...
}
```

### Uso:

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
    // ...
  });
});
```

---

## 📝 Anatomía de un Test

### Estructura básica:

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";

describe("Nombre del Feature", () => {
  // Setup antes de cada test
  beforeEach(async () => {
    // Preparar datos
  });

  // Cleanup después de cada test
  afterEach(async () => {
    // Limpiar datos
  });

  it("debe hacer X cuando Y", async () => {
    // 1. Arrange (preparar)
    const input = { ... };

    // 2. Act (ejecutar)
    const result = await doSomething(input);

    // 3. Assert (validar)
    expect(result).toBeDefined();
    expect(result.field).toBe("esperado");
  });
});
```

---

## ✅ Checklist de Testing

### Para cada feature nuevo:

- [ ] ¿Creé tests unitarios en `hexag/.../infrastructure/repositories/__tests__/`?
- [ ] ¿Creé handlers MSW en `hexag/mocks/handlers/`?
- [ ] ¿Registré los handlers en `hexag/mocks/register-handlers.ts`?
- [ ] ¿Creé tests de integración en `tests/`?
- [ ] ¿Usé helpers reutilizables de `tests/helpers/`?
- [ ] ¿Los tests pasan en modo MSW? (`npm run test`)
- [ ] ¿Los tests pasan contra backend real? (`npm run test:real`)

---

## 📊 Cobertura de Tests

### Estado actual (Diciembre 3, 2025):

```
Total: 51 tests
Passing: 48 tests (94.1%)
Failing: 3 tests (issues de backend)
```

### Por módulo:

| Módulo | Tests | Passing | Porcentaje |
|--------|-------|---------|------------|
| Datos Principales | 3 | 3 | 100% |
| Accionistas | 3 | 3 | 100% |
| Acciones | 3 | 3 | 100% |
| Asignación | 1 | 1 | 100% |
| Directorio | 6 | 4 | 66.7% (2 issues backend) |
| Apoderados | 9 | 9 | 100% |
| Quorum | 4 | 3 | 75% (1 issue backend) |
| **TOTAL** | **51** | **48** | **94.1%** |

### Issues pendientes (backend):

1. `DELETE /directorio/directores` → 500 Internal Server Error
2. `PUT /quorum` → 422 Validación (valores extremos)

---

## 🎯 Mejores Prácticas

### ✅ Hacer:

1. **Tests descriptivos:**
   ```typescript
   it("debe crear sociedad con datos válidos", async () => { ... });
   ```

2. **Tests independientes:**
   Cada test debe poder ejecutarse solo sin depender de otros.

3. **Cleanup después de tests:**
   ```typescript
   afterEach(async () => {
     await cleanupTestSociety(societyId);
   });
   ```

4. **Usar helpers reutilizables:**
   ```typescript
   const { societyId } = await createTestSociety();
   ```

5. **Validar errores:**
   ```typescript
   await expect(repository.create({})).rejects.toThrow("Campo requerido");
   ```

---

### ❌ Evitar:

1. **Tests que dependen de orden:**
   ```typescript
   // ❌ NO hacer esto
   it("test 1: crear", () => { ... });
   it("test 2: actualizar", () => { ... }); // Depende del anterior
   ```

2. **Tests sin asserts:**
   ```typescript
   // ❌ NO hacer esto
   it("debe crear", async () => {
     await repository.create(data);
     // Sin validación
   });
   ```

3. **Mocks hardcodeados en tests:**
   ```typescript
   // ❌ NO hacer esto
   const mockData = { id: "123", ... }; // Usar MSW handlers en su lugar
   ```

---

## 🚀 Ejecutar Tests

### Comandos disponibles:

```bash
# Tests con MSW (rápido)
npm run test

# Tests contra backend real (lento)
npm run test:real

# Tests con watch mode (desarrollo)
npm run test:watch

# Tests con cobertura
npm run test:coverage

# Un solo archivo
npm run test tests/sociedades/paso-1-datos-principales.test.ts
```

---

## 📚 Recursos Adicionales

- **MSW Docs:** https://mswjs.io/
- **Vitest Docs:** https://vitest.dev/
- **Tests de referencia:** `tests/sociedades/`
- **Helpers:** `tests/helpers/test-setup-helpers.ts`
- **Configuración:** `vitest.config.ts`
- **Setup:** `tests/setup.ts`

---

**Última actualización:** Diciembre 3, 2025



