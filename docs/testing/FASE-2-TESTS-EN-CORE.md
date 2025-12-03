# 📋 PLAN FASE 2: Tests en Core (Arquitectura Hexagonal)

**Fecha:** 3 Diciembre 2025  
**Estado:** 🔵 Planificado (pendiente de implementación)  
**Prerequisito:** ✅ Fase 1 completada

---

## 🎯 Objetivo

Migrar tests a `core/hexag/.../pasos/*/infrastructure/repositories/__tests__/` manteniendo:

✅ Suite Maestra funcionando  
✅ Helpers reutilizables  
✅ Data centralizada  
✅ Contexto compartido entre pasos

---

## 📊 Visión Final

```
core/hexag/registros/sociedades/
│
├─ infrastructure/repositories/__tests__/
│  ├─ README.md
│  └─ sociedad.test.ts              # Paso 0: Crea sociedad global
│
└─ pasos/
   ├─ datos-sociedad/infrastructure/repositories/__tests__/
   │  ├─ README.md
   │  └─ datos-sociedad.test.ts     # Paso 1: Usa societyId global
   │
   ├─ accionistas/infrastructure/repositories/__tests__/
   │  ├─ README.md
   │  └─ accionistas.test.ts        # Paso 2: Usa societyId global
   │
   └─ ... (todos los pasos)
```

**TODOS comparten 1 sociedad creada en Paso 0** ✅

---

## 🔄 Contexto Compartido

### Implementación

```typescript
// tests/helpers/test-context.ts (NUEVO)
export const GLOBAL_TEST_CONTEXT = {
  societyId: null as string | null,
  accionistaId: null as string | null,
  accionId: null as string | null,
  // ... todos los IDs necesarios
};

export function setSocietyId(id: string) {
  GLOBAL_TEST_CONTEXT.societyId = id;
}

export function getSocietyId(): string {
  if (!GLOBAL_TEST_CONTEXT.societyId) {
    throw new Error("Society ID not set. Run Paso 0 first.");
  }
  return GLOBAL_TEST_CONTEXT.societyId;
}
```

### Uso en Tests

```typescript
// core/.../sociedad/__tests__/sociedad.test.ts
import { setSocietyId } from "@tests/helpers/test-context";

describe("Paso 0: Sociedad", () => {
  beforeAll(async () => {
    const id = await sociedadRepo.create();
    setSocietyId(id);  // ✅ Guardar para otros pasos
  });
  
  // ... tests
});
```

```typescript
// core/.../datos-sociedad/__tests__/datos-sociedad.test.ts
import { getSocietyId } from "@tests/helpers/test-context";

describe("Paso 1: Datos Sociedad", () => {
  it("test", async () => {
    const id = getSocietyId();  // ✅ Usar ID del Paso 0
    await repo.create(id, datos);
  });
});
```

---

## 📦 Migración Paso a Paso

### Paso 1: Crear estructura base

```bash
# Crear archivos vacíos (plantillas)
touch core/hexag/registros/sociedades/infrastructure/repositories/__tests__/sociedad.test.ts
touch core/.../pasos/datos-sociedad/infrastructure/repositories/__tests__/datos-sociedad.test.ts
# ... para cada paso
```

### Paso 2: Implementar Paso 0 (Sociedad)

```typescript
// core/.../sociedad/__tests__/sociedad.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setSocietyId, clearContext } from "@tests/helpers/test-context";
import { SociedadHttpRepository } from "../sociedad.http.repository";

describe("Paso 0: Crear Sociedad", () => {
  let repository: SociedadHttpRepository;
  let societyId: string;

  beforeAll(async () => {
    repository = new SociedadHttpRepository();
    societyId = await repository.create();
    setSocietyId(societyId);  // ✅ Compartir con otros pasos
  });

  afterAll(async () => {
    if (societyId) {
      await repository.delete(societyId);
    }
    clearContext();
  });

  it("debe crear sociedad", () => {
    expect(societyId).toBeDefined();
  });

  it("debe listar sociedad", async () => {
    const list = await repository.list();
    expect(list.find(s => s.idSociety === societyId)).toBeDefined();
  });
});
```

### Paso 3: Implementar Paso 1 (Datos Sociedad)

```typescript
// core/.../datos-sociedad/__tests__/datos-sociedad.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { getSocietyId } from "@tests/helpers/test-context";
import { createDatosSociedadPayload } from "@tests/data/sociedades/test-data-sociedades";
import { DatosSociedadHttpRepository } from "../datos-sociedad.http.repository";

describe("Paso 1: Datos Sociedad", () => {
  let repository: DatosSociedadHttpRepository;
  let societyId: string;

  beforeAll(() => {
    repository = new DatosSociedadHttpRepository();
    societyId = getSocietyId();  // ✅ Usar ID del Paso 0
  });

  it("debe crear datos", async () => {
    const datos = createDatosSociedadPayload();
    await repository.create(societyId, datos);
    
    const result = await repository.get(societyId);
    expect(result?.razonSocial).toBe(datos.razonSocial);
  });
});
```

### Paso 4: Repetir para todos los pasos

- Paso 2: Accionistas
- Paso 3: Acciones
- Paso 4: Asignación
- Paso 5: Quórum
- Paso 6: Directorio
- Paso 7: Apoderados

---

## 📝 Orden de Ejecución

```bash
# Vitest ejecuta tests en orden alfabético
# Usar prefijos numéricos para garantizar orden:

core/hexag/registros/sociedades/
├─ infrastructure/repositories/__tests__/
│  └─ 0-sociedad.test.ts              # ← Se ejecuta PRIMERO
└─ pasos/
   ├─ datos-sociedad/.../__tests__/
   │  └─ 1-datos-sociedad.test.ts     # ← SEGUNDO
   ├─ accionistas/.../__tests__/
   │  └─ 2-accionistas.test.ts        # ← TERCERO
   └─ ...
```

O usar Vitest `sequence`:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    sequence: {
      hooks: 'list',  // Ejecutar hooks en orden
    },
  },
});
```

---

## 🔄 Comandos Finales (Fase 2)

```json
{
  "scripts": {
    "// Ejecutar todos los pasos en orden": "",
    "test:core:all-in-order": "vitest run core/hexag/registros/sociedades --sequence.shuffle=false",
    
    "// Ejecutar paso específico": "",
    "test:core:paso1": "vitest run core/hexag/registros/sociedades/pasos/datos-sociedad",
    "test:core:paso2": "vitest run core/hexag/registros/sociedades/pasos/accionistas"
  }
}
```

---

## ⚠️ Consideraciones

### Dependencias entre Tests

Los tests en `core/` **dependen** de que el Paso 0 se ejecute primero:

```
Paso 0 (Sociedad) → crea societyId
  ↓
Paso 1 (Datos) → usa societyId
  ↓
Paso 2 (Accionistas) → usa societyId
  ↓
...
```

**Soluciones:**

**Opción A:** Ejecutar en orden (vitest sequence)  
**Opción B:** Cada test crea su propia sociedad (independiente)  
**Opción C:** globalSetup crea sociedad, globalTeardown la elimina

**Recomendado:** Opción A (orden de ejecución)

---

## 🎯 Ventajas de Fase 2

### vs Fase 1 (Suite Maestra)

| Aspecto | Fase 1 (Suite) | Fase 2 (Core) |
|---------|----------------|---------------|
| **Ubicación** | `tests/` | `core/` (hexagonal) |
| **Granularidad** | Todo junto | Por paso |
| **Desarrollo** | Ver todo | Solo lo necesario |
| **Arquitectura** | Funcional | Hexagonal ✅ |
| **Velocidad** | Rápida (1 file) | Por paso |

### Beneficios

✅ **Arquitectura hexagonal:** Tests donde corresponde  
✅ **Modular:** Test un paso sin correr todos  
✅ **Debugging:** Más fácil encontrar problemas  
✅ **Profesional:** Estructura clara y estándar

---

## ⏱️ Estimación

```
Implementar Fase 2:
- Crear test-context.ts         (15 min)
- Migrar Paso 0                  (10 min)
- Migrar Paso 1                  (10 min)
- Migrar Pasos 2-7               (60 min)
- Configurar orden ejecución     (15 min)
- Documentar                     (30 min)
- Verificar ambos sistemas       (20 min)
────────────────────────────────────────
TOTAL: ~2.5 horas
```

---

## 🚀 Próximos Pasos

1. ⏳ Completar Fase 1 (verificar todo funciona)
2. ⏳ Crear `test-context.ts`
3. ⏳ Implementar Paso 0 en `core/`
4. ⏳ Migrar resto de pasos
5. ⏳ Verificar ambos sistemas funcionan
6. ⏳ Documentar

---

**Estado:** 🔵 Planificado  
**Prerequisito:** ✅ Fase 1 completada  
**Próximo:** Implementación de Fase 2

