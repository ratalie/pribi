# 🧪 Tests por Paso - Registro de Sociedades

## 📁 Estructura de Tests

Cada paso tiene sus tests dentro de su propia carpeta:

```
pasos/
├── datos-sociedad/
│   └── infrastructure/repositories/__tests__/
│       ├── datos-sociedad.repository.shared.test.ts      # Tests con MSW (mock)
│       ├── datos-sociedad.repository.integration.test.ts # Tests con backend real (sin seed)
│       └── datos-sociedad.repository.seed-context.test.ts # Tests con seed context (5 sociedades)
│
├── accionistas/
│   └── infrastructure/repositories/__tests__/
│       ├── accionistas.repository.shared.test.ts
│       ├── accionistas.repository.integration.test.ts
│       └── accionistas.repository.seed-context.test.ts
│
└── ... (mismo patrón para cada paso)
```

---

## 🎯 Tipos de Tests

### **1. Shared Tests (`*.shared.test.ts`)**
- ✅ Usan **MSW (mock)**
- ✅ No requieren backend
- ✅ Tests rápidos
- ✅ Para validar lógica de repositorios

### **2. Integration Tests (`*.integration.test.ts`)**
- ✅ Usan **backend real**
- ✅ Crean sociedades desde cero
- ✅ Tests completos de CRUD
- ✅ Para validar endpoints reales

### **3. Seed Context Tests (`*.seed-context.test.ts`)** ⭐ NUEVO
- ✅ Usan **backend real**
- ✅ Usan **5 sociedades del seed** como contexto
- ✅ Tests enfocados en funcionalidad específica
- ✅ No necesitan crear todo desde cero

---

## 🌱 Seed Context Helper

El helper `seed-context.helper.ts` crea 5 sociedades completas:

```typescript
import { createSeedContext, cleanupSeedContext } from "@tests/helpers/seed-context.helper";

beforeAll(async () => {
  // Crear 5 sociedades completas (como el seed)
  seedContext = await createSeedContext();
});

afterAll(async () => {
  // Limpiar todas las sociedades
  await cleanupSeedContext(seedContext);
});
```

**Cada sociedad incluye:**
- ✅ Datos de sociedad
- ✅ 2 Accionistas
- ✅ Valor nominal
- ✅ 1 Acción común (500 acciones)
- ✅ Asignaciones (300 + 200)
- ✅ Quórum
- ✅ 3-5 Directores
- ✅ Directorio configurado
- ✅ Clase de apoderado
- ✅ 1 Apoderado

---

## 📝 Ejemplo de Test con Seed Context

```typescript
describe("MiPasoHttpRepository - Con Seed Context", () => {
  let repository: MiPasoHttpRepository;
  let seedContext: SeedContext | null = null;

  beforeAll(async () => {
    repository = new MiPasoHttpRepository();
    
    // Crear seed context (5 sociedades)
    seedContext = await createSeedContext();
  });

  afterAll(async () => {
    // Limpiar
    if (seedContext) {
      await cleanupSeedContext(seedContext);
    }
  });

  it("debe funcionar con sociedades del seed", async () => {
    // Usar cualquier sociedad del seed
    const society = seedContext!.societies[0]!;
    
    // Testear tu funcionalidad específica
    const result = await repository.get(society.societyId);
    expect(result).toBeDefined();
  });
});
```

---

## ✅ Ventajas de Seed Context Tests

1. **No necesitas crear todo desde cero** - Las sociedades ya están completas
2. **Tests más rápidos** - Solo testeas tu paso específico
3. **Contexto realista** - Usas datos reales del seed
4. **Tests independientes** - Cada paso puede testearse solo
5. **Fácil de mantener** - Si cambia el seed, los tests se adaptan

---

## 🚀 Cómo Ejecutar

```bash
# Tests con seed context
TEST_USE_MSW=false npm run test datos-sociedad.repository.seed-context.test.ts

# Todos los tests de un paso
TEST_USE_MSW=false npm run test pasos/datos-sociedad/**/*.test.ts

# Solo tests de integración (sin seed)
TEST_USE_MSW=false npm run test **/*.integration.test.ts

# Solo tests con seed context
TEST_USE_MSW=false npm run test **/*.seed-context.test.ts
```

---

## 📋 Checklist para Crear Tests de un Paso

- [ ] Crear `*.shared.test.ts` (tests con MSW)
- [ ] Crear `*.integration.test.ts` (tests con backend, sin seed)
- [ ] Crear `*.seed-context.test.ts` (tests con seed context) ⭐
- [ ] Usar helpers de `@tests/helpers/seed-helpers.ts` para datos
- [ ] Limpiar en `afterAll`
- [ ] Generar resumen con `TestLogger`

---

## 🎯 Pasos que Necesitan Tests

1. ✅ **datos-sociedad** - Ya tiene ejemplo
2. ⏳ **accionistas** - Crear `seed-context.test.ts`
3. ⏳ **acciones** - Crear `seed-context.test.ts`
4. ⏳ **asignacion-acciones** - Crear `seed-context.test.ts`
5. ⏳ **quorum-mayorias** - Crear `seed-context.test.ts`
6. ⏳ **directorio** - Crear `seed-context.test.ts`
7. ⏳ **apoderados** - Crear `seed-context.test.ts`
8. ⏳ **regimen-poderes** - Crear `seed-context.test.ts`
9. ⏳ **acuerdos-societarios** - Crear `seed-context.test.ts`

---

**¡Cada paso puede testearse de forma independiente usando el seed como contexto!** 🚀






