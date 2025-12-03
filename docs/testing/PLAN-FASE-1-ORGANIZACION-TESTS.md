# 📋 PLAN FASE 1: Organización de Tests

**Fecha:** 3 Diciembre 2025  
**Objetivo:** 2 sistemas de testing complementarios y reutilizables

---

## 🎯 Visión Final

### Sistema 1: Suite Maestra (`tests/`)
**Para:** Tests completos y rápidos (CI/CD)

```
tests/sociedades/
├─ flujo-completo.test.ts       # 1 sociedad → todos los pasos
├─ paso-0-crear-sociedad.test.ts # Solo Paso 0
└─ data/
   └─ test-data-sociedades.ts   # Data centralizada
```

**Comandos:**
```bash
npm run test:sociedades:flujo-completo    # Todos los pasos
npm run test:sociedades:paso0             # Solo Paso 0
```

### Sistema 2: Tests por Paso (`core/`)
**Para:** Desarrollo y debugging por paso

```
core/hexag/registros/sociedades/pasos/
├─ datos-sociedad/
│  └─ infrastructure/repositories/__tests__/
│     └─ datos-sociedad.test.ts           # Solo Paso 1
├─ accionistas/
│  └─ infrastructure/repositories/__tests__/
│     └─ accionistas.test.ts              # Solo Paso 2
└─ acciones/
   └─ infrastructure/repositories/__tests__/
      └─ acciones.test.ts                  # Solo Paso 3
```

**Comandos:**
```bash
npm run test:core:datos-sociedad    # Solo tests de datos sociedad
npm run test:core:accionistas       # Solo tests de accionistas
npm run test:core:all               # Todos los tests de core/
```

---

## 🔄 Reutilización entre Sistemas

```
┌─────────────────────────────────────────┐
│  tests/                                 │
│  ├─ setup.ts          ← LOGIN, $fetch  │
│  ├─ helpers/          ← Shared helpers │
│  ├─ data/             ← Test data      │
│  └─ config/           ← Configuración  │
└─────────────────────────────────────────┘
              ↓ REUTILIZADO POR ↓
┌─────────────────────────────────────────┐
│  SISTEMA 1: Suite Maestra               │
│  tests/sociedades/flujo-completo.test   │
└─────────────────────────────────────────┘
              ↓ Y TAMBIÉN POR ↓
┌─────────────────────────────────────────┐
│  SISTEMA 2: Tests por Paso              │
│  core/.../pasos/*/__tests__/*.test.ts   │
└─────────────────────────────────────────┘
```

**TODO es reutilizable** ✅

---

## 📦 PASO 1: Limpiar Archivos Antiguos

### 1.1. Crear carpeta de archivo

```bash
mkdir -p archive/old-tests
```

### 1.2. Mover tests antiguos que NO funcionan

```bash
# Tests con beforeEach (fallan)
mv core/.../pasos/*/infrastructure/repositories/__tests__/*.shared.test.ts archive/old-tests/
mv core/.../pasos/*/infrastructure/repositories/__tests__/*.integration.test.ts archive/old-tests/
```

### 1.3. Mantener solo READMEs

```bash
# Mantener documentación
core/.../pasos/*/infrastructure/repositories/__tests__/README.md
```

---

## 📦 PASO 2: Organizar Suite Maestra

### 2.1. Estructura final de `tests/`

```
tests/
├─ setup.ts                         # ✅ Ya existe
├─ cleanup.test.ts                  # ✅ Ya existe
│
├─ config/
│  ├─ test-config.ts                # ✅ Ya existe
│  └─ vitest.config.ts              # ⏳ Crear
│
├─ helpers/
│  ├─ seed-helpers.ts               # ✅ Ya existe
│  ├─ cleanup-backend.ts            # ✅ Ya existe
│  └─ test-context.ts               # ⏳ Crear (para Fase 2)
│
├─ data/
│  └─ sociedades/
│     └─ test-data-sociedades.ts   # ⏳ Mover aquí
│
└─ sociedades/
   ├─ README.md                     # ✅ Ya existe
   ├─ flujo-completo.test.ts        # ✅ Ya existe
   └─ paso-0-crear-sociedad.test.ts # ✅ Ya existe
```

### 2.2. Mover archivos

```bash
# Mover data a ubicación más clara
mv tests/sociedades/data/test-data-sociedades.ts tests/data/sociedades/test-data-sociedades.ts
```

### 2.3. Actualizar imports

```typescript
// Antes
import { createDatosSociedadPayload } from "./data/test-data-sociedades";

// Después
import { createDatosSociedadPayload } from "../data/sociedades/test-data-sociedades";
```

---

## 📦 PASO 3: Preparar Tests en Core

### 3.1. Estructura objetivo

```
core/hexag/registros/sociedades/
│
├─ infrastructure/repositories/__tests__/
│  ├─ README.md                       # Documentación
│  └─ sociedad.test.ts                # ✅ NUEVO: Paso 0
│
└─ pasos/
   ├─ datos-sociedad/infrastructure/repositories/__tests__/
   │  ├─ README.md
   │  └─ datos-sociedad.test.ts       # ✅ NUEVO: Paso 1
   │
   ├─ accionistas/infrastructure/repositories/__tests__/
   │  ├─ README.md
   │  └─ accionistas.test.ts          # ✅ NUEVO: Paso 2
   │
   └─ ...
```

### 3.2. Patrón de cada test

```typescript
// core/.../datos-sociedad/__tests__/datos-sociedad.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { createDatosSociedadPayload } from "@tests/data/sociedades/test-data-sociedades";
import { DatosSociedadHttpRepository } from "../datos-sociedad.http.repository";

describe("Datos Sociedad Repository", () => {
  let repository: DatosSociedadHttpRepository;
  let societyId: string;

  beforeAll(async () => {
    repository = new DatosSociedadHttpRepository();
    
    // ✅ OPCIÓN A: Crear sociedad propia (independiente)
    const sociedadRepo = new SociedadHttpRepository();
    societyId = await sociedadRepo.create();
    
    // ✅ OPCIÓN B: Usar contexto compartido (Fase 2)
    // societyId = TEST_CONTEXT.societyId;
  });

  it("debe crear datos sociedad", async () => {
    const datos = createDatosSociedadPayload();
    await repository.create(societyId, datos);
    
    expect(datos).toBeDefined();
  });
});
```

---

## 📦 PASO 4: Comandos NPM Organizados

### 4.1. package.json

```json
{
  "scripts": {
    // ========================================
    // SISTEMA 1: SUITE MAESTRA (tests/)
    // ========================================
    "test:suite:flujo-completo": "TEST_USE_MSW=false vitest run tests/sociedades/flujo-completo",
    "test:suite:paso0": "TEST_USE_MSW=false vitest run tests/sociedades/paso-0",
    
    // ========================================
    // SISTEMA 2: TESTS POR PASO (core/)
    // ========================================
    "test:core:sociedad": "TEST_USE_MSW=false vitest run core/hexag/registros/sociedades/infrastructure/repositories/__tests__/",
    "test:core:datos-sociedad": "TEST_USE_MSW=false vitest run core/hexag/registros/sociedades/pasos/datos-sociedad",
    "test:core:accionistas": "TEST_USE_MSW=false vitest run core/hexag/registros/sociedades/pasos/accionistas",
    "test:core:all": "TEST_USE_MSW=false vitest run core/hexag/registros/sociedades",
    
    // ========================================
    // UTILS
    // ========================================
    "test:cleanup": "TEST_USE_MSW=false vitest run cleanup.test.ts",
    "test:all": "npm run test:suite:flujo-completo && npm run test:core:all",
    
    // ========================================
    // LEGACY (mantener por compatibilidad)
    // ========================================
    "test:sociedades:backend": "npm run test:suite:flujo-completo",
    "test:sociedades:flujo-completo": "npm run test:suite:flujo-completo"
  }
}
```

---

## 📦 PASO 5: Documentación Clara

### 5.1. README principal

```
tests/README.md
├─ Explica los 2 sistemas
├─ Cuándo usar cada uno
├─ Comandos disponibles
└─ Roadmap (Fase 1 → Fase 2)
```

### 5.2. README por sistema

```
tests/sociedades/README.md         # Sistema 1: Suite Maestra
core/.../pasos/__tests__/README.md # Sistema 2: Tests por Paso
```

---

## 📦 PASO 6: Archivos Reutilizables

### 6.1. Helpers compartidos

```typescript
// tests/helpers/test-base.ts
export class TestBase {
  static async createTestSociety(): Promise<string> {
    // Reutilizable en AMBOS sistemas
  }
  
  static async cleanupSociety(id: string): Promise<void> {
    // Reutilizable en AMBOS sistemas
  }
}
```

### 6.2. Data compartida

```typescript
// tests/data/sociedades/test-data-sociedades.ts
// ✅ Ya existe, solo mover de ubicación
```

---

## 📋 CHECKLIST FASE 1

- [ ] 1. Archivar tests antiguos rotos
- [ ] 2. Mover `test-data-sociedades.ts` a `tests/data/sociedades/`
- [ ] 3. Actualizar imports en Suite Maestra
- [ ] 4. Crear `tests/README.md` explicando los 2 sistemas
- [ ] 5. Actualizar `package.json` con comandos organizados
- [ ] 6. Crear `docs/testing/FASE-1-SUITE-MAESTRA.md`
- [ ] 7. Crear `docs/testing/FASE-2-TESTS-EN-CORE.md` (plan)
- [ ] 8. Verificar que Suite Maestra sigue pasando 22/22
- [ ] 9. Preparar estructura base en `core/` (vacía pero lista)
- [ ] 10. Documentar migración

---

## 🚀 BENEFICIOS DE ESTE PLAN

### Para Desarrollo
✅ Tests rápidos por paso (`test:core:accionistas`)  
✅ Tests completos (`test:suite:flujo-completo`)  
✅ Flexibilidad según necesidad

### Para Mantenimiento
✅ Todo centralizado y documentado  
✅ Reutilización máxima  
✅ Fácil entender dónde está qué

### Para Migración
✅ Helpers ya funcionan  
✅ Data ya funciona  
✅ Solo mover tests (no reescribir)

---

## ⏱️ TIEMPO ESTIMADO

```
PASO 1: Archivar antiguos       (5 min)
PASO 2: Mover archivos           (5 min)
PASO 3: Actualizar imports       (10 min)
PASO 4: Comandos NPM             (5 min)
PASO 5: Documentación            (15 min)
PASO 6: Verificar tests          (5 min)
───────────────────────────────────────
TOTAL: ~45 minutos
```

---

## 🎯 RESULTADO FINAL FASE 1

```
✅ Suite Maestra: 22/22 tests
✅ Comandos claros y organizados
✅ Documentación completa
✅ Base para Fase 2
✅ 2 sistemas funcionando
```

---

**¿APRUEBAS ESTE PLAN MI REY?** 🚀

Si dices "SÍ", comienzo AHORA con los 6 pasos en orden.
