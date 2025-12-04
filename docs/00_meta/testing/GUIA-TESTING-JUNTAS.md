# 🧪 Guía de Testing - Juntas de Accionistas

## 📖 Introducción

Esta guía explica cómo probar el módulo de **Juntas** usando la arquitectura hexagonal con **MSW** (Mock Service Worker) y **Backend Real**.

---

## 🎯 Estrategia de Testing

### 1. **Testing por Capas**

```
┌─────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER                                          │
│ ├─ Component Tests (Vitest + @vue/test-utils)              │
│ ├─ Store Tests (Pinia Testing)                             │
│ └─ Controller Tests                                         │
└─────────────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ APPLICATION LAYER                                           │
│ ├─ Use Case Tests (mocks puros)                            │
│ └─ DTO Validation Tests                                    │
└─────────────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ INFRASTRUCTURE LAYER                                        │
│ ├─ Repository Tests con MSW ✅ PRINCIPAL                   │
│ ├─ Repository Tests con Backend ✅ INTEGRACIÓN             │
│ └─ Mapper Tests                                            │
└─────────────────────────────────────────────────────────────┘
```

### 2. **Shared Test Suite Pattern**

Un mismo test corre en **AMBOS** adaptadores (HTTP y MSW):

```typescript
// junta.repository.shared.test.ts

import { testJuntaRepository } from './junta.repository.contract';

describe('Junta Repository - MSW', () => {
  const repository = new JuntaHttpRepository(); // Mismo repositorio
  testJuntaRepository(repository);
});

// El mismo test verifica que MSW se comporta igual que el backend
```

---

## 🚀 Comandos Disponibles

### Tests con MSW (SIN Backend)

```bash
# Todos los tests de juntas con MSW
npm run test:juntas:msw

# Tests individuales
npm run test:juntas:seleccion-agenda:msw
npm run test:juntas:detalles:msw
npm run test:juntas:instalacion:msw
```

### Tests con Backend Real

```bash
# Todos los tests de juntas con backend
npm run test:juntas:backend

# Tests individuales
npm run test:juntas:seleccion-agenda:backend
npm run test:juntas:detalles:backend
npm run test:juntas:instalacion:backend
```

### Tests en modo Watch

```bash
# Desarrollo con MSW
npm run test:juntas:watch

# Desarrollo con backend
TEST_USE_MSW=false npm run test:juntas:watch
```

---

## 🧪 Escribir Nuevos Tests

### Patrón: Shared Test Suite

**Paso 1:** Crear el contrato de tests

```typescript
// app/core/hexag/juntas/infrastructure/repositories/__tests__/helpers/junta.repository.contract.ts

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { SociedadHttpRepository } from '~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository';
import type { JuntaRepository } from '~/core/hexag/juntas/domain/ports/junta.repository';

export function testJuntaRepository(repository: JuntaRepository) {
  let societyId: string;

  beforeAll(async () => {
    const sociedadRepo = new SociedadHttpRepository();
    societyId = await sociedadRepo.create();
  });

  afterAll(async () => {
    if (societyId) {
      const sociedadRepo = new SociedadHttpRepository();
      await sociedadRepo.delete(societyId);
    }
  });

  it('debe crear una junta', async () => {
    const flowId = await repository.create(parseInt(societyId, 10));
    expect(flowId).toBeDefined();
    expect(typeof flowId).toBe('string');
  });

  it('debe listar juntas', async () => {
    const juntas = await repository.list(parseInt(societyId, 10));
    expect(Array.isArray(juntas)).toBe(true);
  });

  it('debe obtener una junta por flowId', async () => {
    const flowId = await repository.create(parseInt(societyId, 10));
    const junta = await repository.get(parseInt(societyId, 10), flowId);
    
    expect(junta).toBeDefined();
    expect(junta?.flowId).toBe(flowId);
  });

  it('debe eliminar una junta', async () => {
    const flowId = await repository.create(parseInt(societyId, 10));
    await repository.delete(parseInt(societyId, 10), flowId);
    
    const junta = await repository.get(parseInt(societyId, 10), flowId);
    expect(junta).toBeNull();
  });
}
```

**Paso 2:** Usar el contrato en tests

```typescript
// app/core/hexag/juntas/infrastructure/repositories/__tests__/junta.repository.shared.test.ts

import { describe } from 'vitest';
import { JuntaHttpRepository } from '../junta.http.repository';
import { testJuntaRepository } from './helpers/junta.repository.contract';

describe('Junta Repository - HTTP (MSW o Backend según TEST_USE_MSW)', () => {
  const repository = new JuntaHttpRepository();
  testJuntaRepository(repository);
});
```

---

## 🔧 Configuración de MSW

### Variables de Entorno

```env
# .env
NUXT_PUBLIC_API_BASE=http://localhost:3000/api/v2
TEST_USE_MSW=false  # Default: usa backend real
TEST_BACKEND_URL=http://localhost:3000
TEST_EMAIL=usuario101@gmail.com
TEST_PASSWORD=#Admin2025-probo!
```

### Activar MSW en Tests

```bash
# Opción 1: Variable de entorno
TEST_USE_MSW=true npm run test:juntas

# Opción 2: Comando específico (ya incluye la variable)
npm run test:juntas:msw
```

### Handlers MSW

Los handlers están en:
```
app/core/hexag/juntas/infrastructure/mocks/
├── handlers/
│   ├── junta.handlers.ts
│   ├── agenda-items.handlers.ts
│   ├── meeting-details.handlers.ts
│   └── asistencia.handlers.ts
└── data/
    ├── junta.state.ts
    ├── agenda-items.state.ts
    ├── meeting-details.state.ts
    └── asistencia.state.ts
```

---

## 📊 Ejemplo: Test Completo de Selección de Agenda

```typescript
// agenda-items.repository.shared.test.ts

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AgendaItemsHttpRepository } from '../agenda-items.http.repository';
import { SociedadHttpRepository } from '~/core/hexag/registros/sociedades/infrastructure/repositories/sociedad.http.repository';
import { JuntaHttpRepository } from '../junta.http.repository';

describe('Agenda Items Repository', () => {
  let repository: AgendaItemsHttpRepository;
  let societyId: string;
  let flowId: string;

  beforeAll(async () => {
    console.log('🚀 [Test Agenda Items] Iniciando...');
    
    // Setup: Crear sociedad
    const sociedadRepo = new SociedadHttpRepository();
    societyId = await sociedadRepo.create();
    
    // Setup: Crear junta
    const juntaRepo = new JuntaHttpRepository();
    flowId = await juntaRepo.create(parseInt(societyId, 10));
    
    repository = new AgendaItemsHttpRepository();
    
    console.log(`✅ Setup completo - Society: ${societyId}, Flow: ${flowId}`);
  });

  afterAll(async () => {
    if (societyId) {
      const sociedadRepo = new SociedadHttpRepository();
      await sociedadRepo.delete(societyId);
      console.log('🧹 Cleanup completo');
    }
  });

  it('debe obtener los puntos de agenda', async () => {
    const items = await repository.get(parseInt(societyId, 10), flowId);
    
    expect(Array.isArray(items)).toBe(true);
    console.log(`✅ ${items.length} puntos obtenidos`);
  });

  it('debe actualizar puntos seleccionados', async () => {
    const items = await repository.get(parseInt(societyId, 10), flowId);
    
    // Seleccionar primer punto
    items[0].selected = true;

    await repository.update(parseInt(societyId, 10), flowId, items);
    
    const updated = await repository.get(parseInt(societyId, 10), flowId);
    const selected = updated.filter((i) => i.selected);
    
    expect(selected.length).toBeGreaterThanOrEqual(1);
    console.log('✅ Puntos actualizados correctamente');
  });
});
```

---

## 🐛 Debugging

### Ver Logs de MSW

Los handlers MSW tienen logs detallados:

```typescript
console.debug('[MSW][Junta] GET', { societyId, flowId, data });
console.debug('[MSW][JuntaState] get', { key, record });
```

Para verlos:
```bash
DEBUG=msw npm run test:juntas:msw
```

### Ver Logs de HTTP Repository

```typescript
console.log('[Repository][JuntaHttp] get:request', { url, societyId, flowId });
console.log('[Repository][JuntaHttp] get:response', response);
```

### Logs Automáticos

Los tests generan logs automáticamente en:
```
logs/tests/
├── test-run-2025-12-04T12-30-45.json
└── test-run-2025-12-04T12-30-45.md
```

---

## ⚠️ Troubleshooting

### Error: `ECONNREFUSED 127.0.0.1:3000`

**Causa:** MSW no tiene handler para ese endpoint

**Solución:**
1. Verificar que el handler existe en `infrastructure/mocks/handlers/`
2. Verificar que está registrado en `register-handlers.ts`
3. Revisar el patrón de URL en el handler

```typescript
// Ejemplo: Handler mal configurado
const baseUrl = '/api/v2/...'; // ❌ MAL

// Correcto:
const baseUrl = '*/api/v2/...'; // ✅ BIEN (wildcards para cualquier host)
```

### Error: `Cannot read properties of null`

**Causa:** El backend/MSW retorna `null` pero el test espera datos

**Solución:**
```typescript
// ❌ MAL
expect(result.field).toBe('value');

// ✅ BIEN
expect(result).toBeDefined();
if (result) {
  expect(result.field).toBe('value');
}
```

### Error: `Ya existe una junta con ese flowId`

**Causa:** No se limpió la junta anterior

**Solución:**
```typescript
afterAll(async () => {
  if (flowId) {
    await juntaRepo.delete(societyId, flowId);
  }
  if (societyId) {
    await sociedadRepo.delete(societyId);
  }
});
```

---

## 📈 Métricas de Calidad

### Cobertura Esperada

- **Domain**: 100% (lógica pura, fácil testear)
- **Application**: 95%+ (use cases simples)
- **Infrastructure**: 90%+ (puede haber casos edge)
- **Presentation**: 80%+ (UI puede tener casos complejos)

### Performance

| Modo | Duración | Ventajas |
|------|----------|----------|
| **MSW** | ~2-3s | ⚡ Rápido, no necesita backend |
| **Backend** | ~5-7s | 🔗 Prueba integración real |

---

## 🎯 Best Practices

### 1. **Siempre usa beforeAll/afterAll**

```typescript
beforeAll(async () => {
  // Setup: Crear recursos necesarios
  societyId = await sociedadRepo.create();
  flowId = await juntaRepo.create(societyId);
});

afterAll(async () => {
  // Cleanup: Eliminar recursos creados
  await sociedadRepo.delete(societyId);
});
```

### 2. **Usa helpers para setup repetitivo**

```typescript
// tests/helpers/juntas-test-helpers.ts
export async function setupJunta() {
  const sociedadRepo = new SociedadHttpRepository();
  const juntaRepo = new JuntaHttpRepository();
  
  const societyId = await sociedadRepo.create();
  const flowId = await juntaRepo.create(parseInt(societyId, 10));
  
  return { societyId, flowId };
}

export async function cleanupJunta(societyId: string, flowId: string) {
  const juntaRepo = new JuntaHttpRepository();
  const sociedadRepo = new SociedadHttpRepository();
  
  await juntaRepo.delete(parseInt(societyId, 10), flowId);
  await sociedadRepo.delete(societyId);
}
```

### 3. **Logs claros**

```typescript
it('debe crear junta', async () => {
  console.log('🚀 [Test] Creando junta...');
  const flowId = await repository.create(societyId);
  console.log(`✅ [Test] Junta creada: ${flowId}`);
  
  expect(flowId).toBeDefined();
});
```

---

## 🔄 Ciclo de Desarrollo

### 1. **Desarrollo con MSW** (rápido)

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Tests en watch mode con MSW
npm run test:juntas:watch
```

**Ventajas:**
- ⚡ Tests súper rápidos (~2s)
- 🔄 No necesitas backend corriendo
- 🎯 Enfoque en lógica de frontend

### 2. **Validación con Backend** (antes de merge)

```bash
# Terminal 1: Backend
cd ../backend && npm run dev

# Terminal 2: Tests con backend real
npm run test:juntas:backend
```

**Ventajas:**
- 🔗 Validas integración real
- 🐛 Detectas problemas de API
- ✅ Confianza para deploy

---

## 📋 Checklist de Tests para Nuevo Paso

Cuando implementes un nuevo paso (ej: Nombramiento de Gerente):

- [ ] **Shared test file** creado (`nombramiento-gerente.repository.shared.test.ts`)
- [ ] **Test con MSW** pasando (100%)
- [ ] **Test con Backend** pasando (100%)
- [ ] **Setup helper** creado (si es complejo)
- [ ] **Cleanup** implementado (no dejar basura en DB)
- [ ] **Logs** claros para debugging
- [ ] **Comandos npm** agregados al `package.json`
- [ ] **README** actualizado

---

## 🎯 Ejemplo: Test de Meeting Details

```typescript
// meeting-details.repository.shared.test.ts

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MeetingDetailsHttpRepository } from '../meeting-details.http.repository';
import { setupJunta, cleanupJunta } from '@tests/helpers/juntas-test-helpers';
import { TipoJunta } from '~/core/hexag/juntas/domain/enums/tipo-junta.enum';

describe('Meeting Details Repository', () => {
  let repository: MeetingDetailsHttpRepository;
  let societyId: string;
  let flowId: string;

  beforeAll(async () => {
    console.log('🚀 [Test Meeting Details] Iniciando...');
    repository = new MeetingDetailsHttpRepository();
    
    const setup = await setupJunta();
    societyId = setup.societyId;
    flowId = setup.flowId;
    
    console.log(`✅ Setup completo - Society: ${societyId}, Flow: ${flowId}`);
  });

  afterAll(async () => {
    await cleanupJunta(societyId, flowId);
  });

  it('debe obtener detalles (puede ser null inicialmente)', async () => {
    const details = await repository.get(parseInt(societyId, 10), flowId);
    
    // Puede ser null si no se ha guardado nada aún
    expect(details).toBeDefined(); // null es válido
    console.log('✅ Detalles obtenidos:', details);
  });

  it('debe actualizar detalles de la junta', async () => {
    const payload = {
      tipo: TipoJunta.GENERAL,
      convocatoria: {
        fechaPrimeraConvocatoria: '2025-02-01',
        fechaSegundaConvocatoria: '2025-02-15',
        // ...
      },
      lugar: {
        direccion: 'Av. Test 123',
        distrito: 'San Isidro',
        // ...
      },
    };

    const updated = await repository.update(parseInt(societyId, 10), flowId, payload);
    
    expect(updated).toBeDefined();
    expect(updated.tipo).toBe(TipoJunta.GENERAL);
    console.log('✅ Detalles actualizados correctamente');
  });

  it('debe mantener los datos después de múltiples actualizaciones', async () => {
    // Primera actualización
    await repository.update(parseInt(societyId, 10), flowId, {
      tipo: TipoJunta.UNIVERSAL,
    });

    // Segunda actualización
    await repository.update(parseInt(societyId, 10), flowId, {
      tipo: TipoJunta.GENERAL,
    });

    // Verificar que se mantuvo el último cambio
    const final = await repository.get(parseInt(societyId, 10), flowId);
    
    expect(final?.tipo).toBe(TipoJunta.GENERAL);
    console.log('✅ Persistencia verificada');
  });
});
```

---

## 🏃 Quick Start

### 1. Correr todos los tests con MSW

```bash
npm run test:juntas:msw
```

### 2. Correr todos los tests con Backend

```bash
# Asegúrate de que el backend esté corriendo en localhost:3000
npm run test:juntas:backend
```

### 3. Desarrollo iterativo

```bash
# Modo watch con MSW (cambios se re-testean automáticamente)
npm run test:juntas:watch
```

---

## 📚 Referencias

- **Arquitectura**: `app/core/hexag/juntas/README.md`
- **Ejemplo Completo**: `docs/00_meta/architecture/JUNTAS-EJEMPLO-COMPLETO.md`
- **Testing Sociedades**: `tests/sociedades/README.md`

---

**Última actualización**: Diciembre 4, 2024

