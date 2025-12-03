# 🎯 Explicación: Tests por Paso con Contexto Compartido

**Pregunta:** ¿Cómo testear SOLO asignación de acciones si necesita sociedad, accionistas y acciones ya creadas?

---

## 🔄 **OPCIÓN B: Contexto Compartido** (Recomendada)

### Concepto

**1 sociedad compartida entre TODOS los tests de TODOS los pasos**

```
┌─────────────────────────────────────────┐
│  PASO 0: Sociedad                       │
│  └─ Crea societyId = "123"              │
└─────────────────────────────────────────┘
              ↓ Guarda en contexto
┌─────────────────────────────────────────┐
│  CONTEXTO COMPARTIDO                    │
│  {                                      │
│    societyId: "123",                    │
│    accionistaId: null,                  │
│    accionId: null,                      │
│  }                                      │
└─────────────────────────────────────────┘
              ↓ Lee societyId
┌─────────────────────────────────────────┐
│  PASO 1: Datos Sociedad                 │
│  └─ Usa societyId = "123"               │
└─────────────────────────────────────────┘
              ↓ Lee societyId
┌─────────────────────────────────────────┐
│  PASO 2: Accionistas                    │
│  └─ Usa societyId = "123"               │
│  └─ Crea accionistaId = "abc"           │
└─────────────────────────────────────────┘
              ↓ Guarda accionistaId
┌─────────────────────────────────────────┐
│  CONTEXTO COMPARTIDO                    │
│  {                                      │
│    societyId: "123",                    │
│    accionistaId: "abc",                 │
│    accionId: null,                      │
│  }                                      │
└─────────────────────────────────────────┘
              ↓ Lee societyId
┌─────────────────────────────────────────┐
│  PASO 3: Acciones                       │
│  └─ Usa societyId = "123"               │
│  └─ Crea accionId = "xyz"               │
└─────────────────────────────────────────┘
              ↓ Guarda accionId
┌─────────────────────────────────────────┐
│  CONTEXTO COMPARTIDO                    │
│  {                                      │
│    societyId: "123",                    │
│    accionistaId: "abc",                 │
│    accionId: "xyz",                     │
│  }                                      │
└─────────────────────────────────────────┘
              ↓ Lee todos los IDs
┌─────────────────────────────────────────┐
│  PASO 4: Asignación                     │
│  └─ Usa societyId = "123"               │
│  └─ Usa accionistaId = "abc"            │
│  └─ Usa accionId = "xyz"                │
└─────────────────────────────────────────┘
```

---

## 💻 **IMPLEMENTACIÓN:**

### 1. Crear Contexto Compartido

```typescript
// tests/helpers/test-context.ts
export interface GlobalTestContext {
  // Paso 0
  societyId: string | null;
  
  // Paso 2
  accionistasIds: string[];
  
  // Paso 3
  accionesIds: string[];
  
  // Paso 6
  directoresIds: string[];
  
  // Paso 7
  claseApoderadoId: string | null;
  apoderadosIds: string[];
}

// Contexto global (shared entre todos los tests)
export const GLOBAL_CONTEXT: GlobalTestContext = {
  societyId: null,
  accionistasIds: [],
  accionesIds: [],
  directoresIds: [],
  claseApoderadoId: null,
  apoderadosIds: [],
};

// Helpers para set/get
export function setSocietyId(id: string) {
  GLOBAL_CONTEXT.societyId = id;
}

export function getSocietyId(): string {
  if (!GLOBAL_CONTEXT.societyId) {
    throw new Error("❌ Society ID no disponible. Ejecuta Paso 0 primero.");
  }
  return GLOBAL_CONTEXT.societyId;
}

export function addAccionistaId(id: string) {
  GLOBAL_CONTEXT.accionistasIds.push(id);
}

export function getFirstAccionistaId(): string {
  if (GLOBAL_CONTEXT.accionistasIds.length === 0) {
    throw new Error("❌ No hay accionistas. Ejecuta Paso 2 primero.");
  }
  return GLOBAL_CONTEXT.accionistasIds[0];
}

export function addAccionId(id: string) {
  GLOBAL_CONTEXT.accionesIds.push(id);
}

export function getFirstAccionId(): string {
  if (GLOBAL_CONTEXT.accionesIds.length === 0) {
    throw new Error("❌ No hay acciones. Ejecuta Paso 3 primero.");
  }
  return GLOBAL_CONTEXT.accionesIds[0];
}

export function clearContext() {
  GLOBAL_CONTEXT.societyId = null;
  GLOBAL_CONTEXT.accionistasIds = [];
  GLOBAL_CONTEXT.accionesIds = [];
  GLOBAL_CONTEXT.directoresIds = [];
  GLOBAL_CONTEXT.claseApoderadoId = null;
  GLOBAL_CONTEXT.apoderadosIds = [];
}
```

---

### 2. Test del Paso 0 (Sociedad)

```typescript
// core/.../sociedad/__tests__/0-sociedad.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setSocietyId, clearContext } from "@tests/helpers/test-context";
import { SociedadHttpRepository } from "../sociedad.http.repository";

describe("PASO 0: Crear Sociedad", () => {
  let repository: SociedadHttpRepository;
  let societyId: string;

  beforeAll(async () => {
    repository = new SociedadHttpRepository();
    
    // Limpiar contexto
    clearContext();
    
    // Crear sociedad
    societyId = await repository.create();
    
    // ✅ GUARDAR en contexto para otros pasos
    setSocietyId(societyId);
    
    console.log(`✅ [Paso 0] Sociedad creada: ${societyId}`);
  });

  afterAll(async () => {
    // NO eliminar aquí - se eliminará después del último paso
  });

  it("debe crear sociedad", () => {
    expect(societyId).toBeDefined();
  });
});
```

---

### 3. Test del Paso 2 (Accionistas)

```typescript
// core/.../accionistas/__tests__/2-accionistas.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { getSocietyId, addAccionistaId } from "@tests/helpers/test-context";
import { createTestAccionistaNatural } from "@tests/helpers/seed-helpers";
import { AccionistasHttpRepository } from "../accionistas.http.repository";

describe("PASO 2: Accionistas", () => {
  let repository: AccionistasHttpRepository;
  let societyId: string;

  beforeAll(async () => {
    repository = new AccionistasHttpRepository();
    
    // ✅ LEER societyId del contexto (creado en Paso 0)
    societyId = getSocietyId();
    
    console.log(`✅ [Paso 2] Usando sociedad: ${societyId}`);
  });

  it("debe crear accionista", async () => {
    const accionista = createTestAccionistaNatural(1);
    const result = await repository.create(societyId, accionista);
    
    // ✅ GUARDAR en contexto para Paso 4 (Asignación)
    addAccionistaId(result.id);
    
    expect(result.id).toBeDefined();
  });
});
```

---

### 4. Test del Paso 3 (Acciones)

```typescript
// core/.../acciones/__tests__/3-acciones.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { getSocietyId, addAccionId } from "@tests/helpers/test-context";
import { createTestAccion } from "@tests/helpers/seed-helpers";
import { TipoAccionEnum } from "../../domain/enums/tipo-accion.enum";
import { AccionesHttpRepository } from "../acciones.http.repository";

describe("PASO 3: Acciones", () => {
  let repository: AccionesHttpRepository;
  let societyId: string;

  beforeAll(async () => {
    repository = new AccionesHttpRepository();
    
    // ✅ LEER societyId del contexto
    societyId = getSocietyId();
  });

  it("debe crear acción", async () => {
    const accion = createTestAccion(TipoAccionEnum.COMUN, 500);
    await repository.create(societyId, accion);
    
    // ✅ GUARDAR en contexto para Paso 4
    addAccionId(accion.id);
    
    expect(accion.id).toBeDefined();
  });
});
```

---

### 5. Test del Paso 4 (Asignación) - **TU PREGUNTA**

```typescript
// core/.../asignacion-acciones/__tests__/4-asignacion.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { 
  getSocietyId, 
  getFirstAccionistaId, 
  getFirstAccionId 
} from "@tests/helpers/test-context";
import { createAsignacionPayload } from "@tests/data/sociedades/test-data-sociedades";
import { AsignacionAccionesHttpRepository } from "../asignacion-acciones.http.repository";

describe("PASO 4: Asignación de Acciones", () => {
  let repository: AsignacionAccionesHttpRepository;
  let societyId: string;
  let accionistaId: string;
  let accionId: string;

  beforeAll(async () => {
    repository = new AsignacionAccionesHttpRepository();
    
    // ✅ LEER del contexto (creados en pasos anteriores)
    societyId = getSocietyId();           // Del Paso 0
    accionistaId = getFirstAccionistaId(); // Del Paso 2
    accionId = getFirstAccionId();         // Del Paso 3
    
    console.log(`✅ [Paso 4] Usando:`, {
      societyId,
      accionistaId,
      accionId,
    });
  });

  it("debe crear asignación", async () => {
    // ✅ Usar los IDs que ya existen
    const asignacion = createAsignacionPayload(accionistaId, accionId);
    
    const resultId = await repository.create(societyId, asignacion);
    
    expect(resultId).toBeDefined();
  });

  it("debe validar que los IDs existen", () => {
    // Verificar que tenemos todos los IDs necesarios
    expect(societyId).toBeDefined();
    expect(accionistaId).toBeDefined();
    expect(accionId).toBeDefined();
  });
});
```

---

## 🔄 **FLUJO COMPLETO:**

### Cuando ejecutas:

```bash
npm run test:core:all
```

**Vitest ejecuta en orden alfabético:**

```
1. 0-sociedad.test.ts
   └─ Crea societyId → Guarda en contexto

2. 1-datos-sociedad.test.ts
   └─ Lee societyId → Usa en tests

3. 2-accionistas.test.ts
   └─ Lee societyId → Crea accionistas → Guarda IDs

4. 3-acciones.test.ts
   └─ Lee societyId → Crea acciones → Guarda IDs

5. 4-asignacion.test.ts
   └─ Lee societyId + accionistaId + accionId → Testea asignación

6. ... (resto de pasos)

7. 9-cleanup.test.ts
   └─ Elimina la sociedad del contexto
```

---

## ⚠️ **IMPORTANTE:**

### Si ejecutas SOLO un paso:

```bash
npm run test:core:asignacion
```

**FALLARÁ** porque:
- ❌ No existe societyId (Paso 0 no corrió)
- ❌ No existe accionistaId (Paso 2 no corrió)
- ❌ No existe accionId (Paso 3 no corrió)

**Solución:** El test debe detectar esto y crear los datos necesarios.

---

## 💡 **PATRÓN HÍBRIDO** (Mejor Solución)

Combinar ambas opciones:

```typescript
// core/.../asignacion-acciones/__tests__/4-asignacion.test.ts
import { 
  getSocietyId, 
  getFirstAccionistaId, 
  getFirstAccionId,
  GLOBAL_CONTEXT 
} from "@tests/helpers/test-context";

describe("PASO 4: Asignación", () => {
  let societyId: string;
  let accionistaId: string;
  let accionId: string;
  let createdLocally = false;

  beforeAll(async () => {
    // ✅ INTENTAR usar contexto compartido
    try {
      societyId = getSocietyId();
      accionistaId = getFirstAccionistaId();
      accionId = getFirstAccionId();
      
      console.log("✅ [Paso 4] Usando contexto compartido");
    } catch (error) {
      // ❌ No hay contexto → Crear localmente
      console.log("⚠️ [Paso 4] Sin contexto, creando datos localmente...");
      
      societyId = await sociedadRepo.create();
      
      const accionista = createTestAccionistaNatural(1);
      const resultAcc = await accionistasRepo.create(societyId, accionista);
      accionistaId = resultAcc.id;
      
      const accion = createTestAccion(TipoAccionEnum.COMUN, 500);
      await accionesRepo.create(societyId, accion);
      accionId = accion.id;
      
      createdLocally = true;
      console.log("✅ [Paso 4] Datos creados localmente");
    }
  });

  afterAll(async () => {
    // Solo limpiar si creamos localmente
    if (createdLocally && societyId) {
      await sociedadRepo.delete(societyId);
    }
  });

  it("debe crear asignación", async () => {
    const asignacion = createAsignacionPayload(accionistaId, accionId);
    await repository.create(societyId, asignacion);
    
    expect(asignacion).toBeDefined();
  });
});
```

**Ventajas del Patrón Híbrido:**

✅ **Flexible:** Funciona solo O con otros tests  
✅ **Rápido:** Usa contexto si está disponible  
✅ **Independiente:** Crea datos si no hay contexto  
✅ **Profesional:** Mejor de ambos mundos

---

## 📊 **COMPARACIÓN:**

| Aspecto | Opción A (Independiente) | Opción B (Contexto) | Híbrido |
|---------|--------------------------|---------------------|---------|
| Velocidad | ❌ Lento | ✅ Rápido | ✅ Rápido |
| Independencia | ✅ Sí | ❌ No | ✅ Sí |
| Complejidad | ✅ Simple | ⚠️ Media | ⚠️ Media |
| Flexibilidad | ❌ Baja | ⚠️ Media | ✅ Alta |
| Recomendado | Para pocos tests | Para muchos tests | ⭐ **SÍ** |

---

## 🎯 **RESPUESTA A TU PREGUNTA:**

**"¿Cada test debe incluir pasos anteriores?"**

**RESPUESTA:** Depende de cómo ejecutes:

### Si ejecutas TODOS los tests juntos:
```bash
npm run test:core:all
```
- ✅ **NO** necesita incluir pasos anteriores
- ✅ Usa contexto compartido (más rápido)
- ✅ Paso 0 crea sociedad, todos la usan

### Si ejecutas SOLO un paso:
```bash
npm run test:core:asignacion
```
- ✅ **SÍ** necesita crear sus dependencias
- ✅ Usa patrón híbrido (detecta si hay contexto)
- ✅ Crea lo que falta, limpia lo que creó

---

## 🚀 **MI RECOMENDACIÓN:**

**Usar PATRÓN HÍBRIDO** para cada test:

1. ✅ Intentar usar contexto compartido (rápido)
2. ✅ Si no hay contexto, crear localmente (independiente)
3. ✅ Limpiar solo lo que creó localmente

**Resultado:**
- ✅ Funciona solo (`npm run test:core:asignacion`)
- ✅ Funciona con todos (`npm run test:core:all`)
- ✅ Rápido cuando hay contexto
- ✅ Independiente cuando no hay

---

## 📝 **EJEMPLO COMPLETO:**

Ver archivo completo con el patrón híbrido implementado:
- `docs/testing/FASE-2-TESTS-EN-CORE.md`

---

**¿TE QUEDA CLARO MI REY?** 🎯

**¿Quieres que implemente el patrón híbrido en Fase 2?** 🚀

