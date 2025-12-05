# 🧪 PLAN DE TESTING: Juntas de Accionistas

> Plan completo para implementar testing de Juntas siguiendo el patrón probado de Sociedades.

**Fecha:** Diciembre 4, 2025  
**Patrón base:** Tests de Sociedades (tests/sociedades/)

---

## 🎯 Objetivo

Crear tests completos para **Paso 0 + 3 pasos** de Juntas usando:
- ✅ Helpers reutilizables (como `createTestSociety()`)
- ✅ MSW para tests rápidos
- ✅ Backend real para integración
- ✅ Arquitectura hexagonal que YA existe

---

## 📊 Arquitectura de Testing (Ya Existe)

### Setup Global (tests/setup.ts):
```typescript
✅ MSW Server configurado
✅ Modo dual: TEST_USE_MSW=true|false
✅ Token real para backend
✅ Mocks de Nuxt
```

### Comandos (package.json):
```bash
npm run test              # MSW (rápido)
npm run test:real         # Backend real
```

---

## 🏗️ Pasos a Testear

### Paso 0: CRUD de Juntas ✅ (Arquitectura ya existe)

**Endpoints:**
```
POST   /api/v2/society-profile/:societyId/register-assembly
GET    /api/v2/society-profile/:societyId/register-assembly/list
DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId
GET    /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete
```

**Arquitectura hexagonal:**
- ✅ Domain: `domain/ports/junta.repository.ts`
- ✅ Application: `application/use-cases/create-junta.use-case.ts`
- ✅ Infrastructure: `infrastructure/repositories/junta.http.repository.ts`
- ✅ MSW: `infrastructure/mocks/handlers/juntas.handlers.ts`

---

### Paso 1: Selección de Agenda ✅ (Arquitectura ya existe)

**Endpoint:**
```
PUT /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items
GET /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items
```

**Arquitectura hexagonal:**
- ✅ Domain: `domain/ports/agenda-items.repository.ts`
- ✅ Application: `application/use-cases/update-agenda-items.use-case.ts`
- ✅ Infrastructure: `infrastructure/repositories/agenda-items.http.repository.ts`
- ✅ MSW: `infrastructure/mocks/handlers/agenda-items.handlers.ts`

---

### Paso 2: Detalles ⏳ (Arquitectura creada hoy)

**Endpoint:** (Por confirmar con backend)
```
POST /api/v2/society-profile/:societyId/assembly/:flowId/meeting-details
GET  /api/v2/society-profile/:societyId/assembly/:flowId/meeting-details
PUT  /api/v2/society-profile/:societyId/assembly/:flowId/meeting-details/:id
```

**Arquitectura hexagonal:**
- ✅ Domain: `pasos/detalles/domain/`
- ✅ Application: `pasos/detalles/application/`
- ✅ Infrastructure: `pasos/detalles/infrastructure/` (creado hoy)
- ⏳ MSW: Pendiente

---

### Paso 3: Instalación ⏳ (Arquitectura parcial)

**Endpoints:** (Por confirmar con backend)
```
POST /api/v2/society-profile/:societyId/assembly/:flowId/instalacion
GET  /api/v2/society-profile/:societyId/assembly/:flowId/instalacion
PUT  /api/v2/society-profile/:societyId/assembly/:flowId/instalacion/:id
```

**Arquitectura hexagonal:**
- ✅ Domain: `pasos/instalacion/domain/` (creado hoy)
- ✅ Application: `pasos/instalacion/application/` (creado hoy)
- ⏳ Infrastructure: Pendiente
- ⏳ MSW: Pendiente

---

## 📝 Plan de Helpers de Testing

### Estructura (siguiendo patrón de Sociedades):

```
tests/helpers/
├── test-setup-helpers.ts        # Helpers de Sociedades (YA existe)
└── juntas/
    └── test-juntas-helpers.ts   # Helpers de Juntas (NUEVO)
```

### Contenido de `test-juntas-helpers.ts`:

```typescript
import { createTestSociety, cleanupTestSociety } from "../test-setup-helpers";

/**
 * Crear junta de prueba
 * Requiere una sociedad existente
 */
export async function createTestJunta(
  societyId: number,
  data?: Partial<any>
): Promise<{ juntaId: number }> {
  console.log(`    🔄 Creando junta para sociedad ${societyId}...`);

  // POST /api/v2/society-profile/:societyId/register-assembly
  const response = await $fetch<any>(
    `/api/v2/society-profile/${societyId}/register-assembly`,
    {
      method: "POST",
      body: data || {},
    }
  );

  const juntaId = parseInt(String(response.data.flowStructureId), 10);
  console.log(`    ✅ Junta creada: ID ${juntaId}`);

  return { juntaId };
}

/**
 * Obtener snapshot completo de junta
 */
export async function getJuntaSnapshot(
  societyId: number,
  flowId: number
): Promise<any> {
  console.log(`    🔄 Obteniendo snapshot de junta ${flowId}...`);

  // GET /api/v2/society-profile/:societyId/register-assembly/:flowId/snapshot/complete
  const response = await $fetch<any>(
    `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/snapshot/complete`
  );

  console.log(`    ✅ Snapshot obtenido`);
  return response.data;
}

/**
 * Configurar junta completa (Sociedad + Junta + Snapshot)
 */
export async function setupJuntaCompleta(): Promise<{
  societyId: number;
  juntaId: number;
  snapshot: any;
}> {
  console.log("🚀 [Setup] Creando junta completa para testing...");

  // 1. Crear sociedad completa (REUTILIZANDO helper de Sociedades)
  const { societyId } = await createTestSociety({
    razonSocial: "Test Junta SA",
    tipoSociedad: "SA",
    capitalSocial: 10000,
  });

  console.log(`  ✅ Sociedad creada: ID ${societyId}`);

  // 2. Crear junta
  const { juntaId } = await createTestJunta(societyId);

  // 3. Obtener snapshot
  const snapshot = await getJuntaSnapshot(societyId, juntaId);

  console.log("✅ [Setup] Junta completa lista para testing");

  return { societyId, juntaId, snapshot };
}

/**
 * Guardar selección de agenda
 */
export async function saveSeleccionAgenda(
  societyId: number,
  flowId: number,
  puntosSeleccionados: string[]
): Promise<void> {
  console.log(`    🔄 Guardando selección de agenda...`);

  // Usar mapper para convertir IDs del frontend
  const { AgendaItemsMapper } = await import(
    "~/core/hexag/juntas/infrastructure/mappers/agenda-items.mapper"
  );
  const payload = AgendaItemsMapper.frontendIdsToDTO(puntosSeleccionados);

  // PUT /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items
  await $fetch(
    `/api/v2/society-profile/${societyId}/assembly/${flowId}/agenda-items`,
    {
      method: "PUT",
      body: payload,
    }
  );

  console.log(`    ✅ Selección guardada: ${puntosSeleccionados.length} puntos`);
}

/**
 * Limpiar junta de prueba
 */
export async function cleanupTestJunta(
  societyId: number,
  juntaId: number
): Promise<void> {
  console.log(`    🔄 Limpiando junta ${juntaId}...`);

  try {
    // DELETE /api/v2/society-profile/:societyId/register-assembly/:flowId
    await $fetch(
      `/api/v2/society-profile/${societyId}/register-assembly/${juntaId}`,
      {
        method: "DELETE",
      }
    );
    console.log(`    ✅ Junta eliminada: ID ${juntaId}`);
  } catch (error) {
    console.warn(`    ⚠️ Error al eliminar junta ${juntaId}:`, error);
  }
}

/**
 * Cleanup completo (Junta + Sociedad)
 */
export async function cleanupJuntaCompleta(
  societyId: number,
  juntaId: number
): Promise<void> {
  await cleanupTestJunta(societyId, juntaId);
  await cleanupTestSociety(societyId);
}
```

---

## 📝 Estructura de Tests

### Organización (siguiendo patrón de Sociedades):

```
tests/juntas/
├── paso-0-crear-junta.test.ts          # CRUD de juntas
├── paso-1-seleccion-agenda.test.ts     # Selección de agenda
├── paso-2-detalles.test.ts             # Detalles
├── paso-3-instalacion.test.ts          # Instalación
└── README.md                           # Documentación de tests
```

---

## 🧪 Ejemplo de Test: Paso 0 (CRUD)

```typescript
// tests/juntas/paso-0-crear-junta.test.ts

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createTestSociety, cleanupTestSociety } from "@tests/helpers/test-setup-helpers";
import { createTestJunta, getJuntaSnapshot, cleanupTestJunta } from "@tests/helpers/juntas/test-juntas-helpers";

describe("Paso 0: CRUD de Juntas", () => {
  let societyId: number;

  beforeEach(async () => {
    // Crear sociedad completa
    const result = await createTestSociety({
      razonSocial: "Test Junta CRUD SA",
      tipoSociedad: "SA",
      capitalSocial: 10000,
    });
    societyId = result.societyId;
  });

  afterEach(async () => {
    await cleanupTestSociety(societyId);
  });

  describe("POST - Crear Junta", () => {
    it("debe crear una junta correctamente", async () => {
      const { juntaId } = await createTestJunta(societyId);

      expect(juntaId).toBeDefined();
      expect(typeof juntaId).toBe("number");
      expect(juntaId).toBeGreaterThan(0);

      // Cleanup
      await cleanupTestJunta(societyId, juntaId);
    });
  });

  describe("GET - Snapshot Completo", () => {
    let juntaId: number;

    beforeEach(async () => {
      const result = await createTestJunta(societyId);
      juntaId = result.juntaId;
    });

    afterEach(async () => {
      await cleanupTestJunta(societyId, juntaId);
    });

    it("debe obtener snapshot completo", async () => {
      const snapshot = await getJuntaSnapshot(societyId, juntaId);

      expect(snapshot).toBeDefined();
      expect(snapshot.shareholders).toBeDefined();
      expect(Array.isArray(snapshot.shareholders)).toBe(true);
      expect(snapshot.shareClasses).toBeDefined();
      expect(snapshot.societyData).toBeDefined();
      expect(snapshot.flowInfo).toBeDefined();
    });

    it("snapshot debe tener accionistas de la sociedad", async () => {
      const snapshot = await getJuntaSnapshot(societyId, juntaId);

      expect(snapshot.shareholders.length).toBeGreaterThan(0);
      expect(snapshot.shareholders[0]).toHaveProperty("person");
      expect(snapshot.shareholders[0].person).toHaveProperty("nombre");
    });
  });

  describe("GET - Listar Juntas", () => {
    it("debe listar juntas de una sociedad", async () => {
      // Crear 2 juntas
      const { juntaId: junta1 } = await createTestJunta(societyId);
      const { juntaId: junta2 } = await createTestJunta(societyId);

      // Listar
      const juntas = await $fetch(`/api/v2/society-profile/${societyId}/register-assembly/list`);

      expect(Array.isArray(juntas.data)).toBe(true);
      expect(juntas.data.length).toBeGreaterThanOrEqual(2);

      // Cleanup
      await cleanupTestJunta(societyId, junta1);
      await cleanupTestJunta(societyId, junta2);
    });
  });

  describe("DELETE - Eliminar Junta", () => {
    it("debe eliminar una junta correctamente", async () => {
      const { juntaId } = await createTestJunta(societyId);

      // Eliminar
      await cleanupTestJunta(societyId, juntaId);

      // Verificar que ya no existe (404)
      await expect(
        $fetch(`/api/v2/society-profile/${societyId}/register-assembly/${juntaId}/snapshot/complete`)
      ).rejects.toThrow();
    });
  });
});
```

---

## 🧪 Ejemplo de Test: Paso 1 (Selección de Agenda)

```typescript
// tests/juntas/paso-1-seleccion-agenda.test.ts

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { setupJuntaCompleta, cleanupJuntaCompleta, saveSeleccionAgenda } from "@tests/helpers/juntas/test-juntas-helpers";
import { AgendaItemsMapper } from "~/core/hexag/juntas/infrastructure/mappers/agenda-items.mapper";

describe("Paso 1: Selección de Agenda", () => {
  let societyId: number;
  let juntaId: number;

  beforeEach(async () => {
    const setup = await setupJuntaCompleta();
    societyId = setup.societyId;
    juntaId = setup.juntaId;
  });

  afterEach(async () => {
    await cleanupJuntaCompleta(societyId, juntaId);
  });

  it("debe guardar selección de agenda correctamente", async () => {
    // Seleccionar puntos
    const puntosSeleccionados = [
      "aporte-dinerarios",
      "nombramiento-gerente",
      "pronunciamiento-gestion",
    ];

    await saveSeleccionAgenda(societyId, juntaId, puntosSeleccionados);

    // Verificar que se guardó
    const response = await $fetch(
      `/api/v2/society-profile/${societyId}/assembly/${juntaId}/agenda-items`
    );

    expect(response.data).toBeDefined();
    
    // Convertir respuesta a IDs del frontend
    const frontendIds = AgendaItemsMapper.dtoToFrontendIds(response.data);
    expect(frontendIds).toEqual(puntosSeleccionados);
  });

  it("debe permitir actualizar selección", async () => {
    // Primera selección
    await saveSeleccionAgenda(societyId, juntaId, ["aporte-dinerarios"]);

    // Segunda selección (actualizar)
    await saveSeleccionAgenda(societyId, juntaId, ["aporte-dinerarios", "nombramiento-gerente"]);

    // Verificar
    const response = await $fetch(
      `/api/v2/society-profile/${societyId}/assembly/${juntaId}/agenda-items`
    );
    
    const frontendIds = AgendaItemsMapper.dtoToFrontendIds(response.data);
    expect(frontendIds.length).toBe(2);
    expect(frontendIds).toContain("aporte-dinerarios");
    expect(frontendIds).toContain("nombramiento-gerente");
  });

  it("debe validar que haya al menos un punto seleccionado", async () => {
    await expect(
      saveSeleccionAgenda(societyId, juntaId, [])
    ).rejects.toThrow();
  });
});
```

---

## 📂 Estructura de Archivos de Testing

```
tests/
├── setup.ts                             # Setup global (YA existe)
├── config/
│   └── test-config.ts                   # Configuración (YA existe)
├── helpers/
│   ├── test-setup-helpers.ts            # Sociedades (YA existe)
│   └── juntas/
│       └── test-juntas-helpers.ts       # Juntas (NUEVO)
├── sociedades/
│   ├── paso-1-datos-principales.test.ts # (YA existe)
│   └── ... (8 archivos)
└── juntas/                              # (NUEVO)
    ├── README.md                        # Documentación
    ├── paso-0-crear-junta.test.ts       # CRUD + Snapshot
    ├── paso-1-seleccion-agenda.test.ts  # Selección
    ├── paso-2-detalles.test.ts          # Detalles
    └── paso-3-instalacion.test.ts       # Instalación
```

---

## 🎯 Flujo de Testing Completo

### PASO 0: Preparar Junta

```typescript
// 1. Crear sociedad (REUTILIZANDO helper existente)
const { societyId } = await createTestSociety({ ... });

// 2. Crear junta
const { juntaId } = await createTestJunta(societyId);

// 3. Obtener snapshot
const snapshot = await getJuntaSnapshot(societyId, juntaId);

// Validar snapshot
expect(snapshot.shareholders.length).toBeGreaterThan(0);
expect(snapshot.flowInfo.flowStructureId).toBe(juntaId);
```

---

### PASO 1: Selección de Agenda

```typescript
// Usar junta del beforeEach
await saveSeleccionAgenda(societyId, juntaId, ["aporte-dinerarios"]);

// Validar
const agendaItems = await $fetch(...);
expect(agendaItems.data.aumentoCapital.aportesDinerarios).toBe(true);
```

---

### PASO 2: Detalles

```typescript
// Guardar detalles
await saveDetallesJunta(societyId, juntaId, {
  tipoJunta: "GENERAL",
  fechaJunta: "2025-12-31",
  horaJunta: "10:00",
});

// Validar
const detalles = await getDetallesJunta(societyId, juntaId);
expect(detalles.tipoJunta).toBe("GENERAL");
```

---

### PASO 3: Instalación

```typescript
// Guardar instalación
await saveInstalacion(societyId, juntaId, {
  presidenteId: "...",
  secretarioId: "...",
  asistencias: [...],
});

// Validar
const instalacion = await getInstalacion(societyId, juntaId);
expect(instalacion.presidenteId).toBeDefined();
```

---

## 🔄 Modo Dual: MSW + Backend Real

### Con MSW (Rápido):
```bash
TEST_USE_MSW=true npm run test
```

**Ventajas:**
- ⚡ Ultra rápido (< 5 segundos)
- 🔄 Reproducible
- 🚫 No requiere backend

---

### Con Backend Real (Completo):
```bash
TEST_USE_MSW=false npm run test:real
```

**Ventajas:**
- ✅ Valida contra backend real
- ✅ Detecta problemas de integración

---

## 📋 Checklist de Implementación

### Fase 1: Helpers
- [ ] Crear `tests/helpers/juntas/test-juntas-helpers.ts`
- [ ] Implementar `createTestJunta()`
- [ ] Implementar `getJuntaSnapshot()`
- [ ] Implementar `setupJuntaCompleta()`
- [ ] Implementar `saveSeleccionAgenda()`
- [ ] Implementar `cleanupTestJunta()`
- [ ] Implementar `cleanupJuntaCompleta()`

### Fase 2: Tests Paso 0
- [ ] Crear `tests/juntas/paso-0-crear-junta.test.ts`
- [ ] Test: POST crear junta
- [ ] Test: GET snapshot completo
- [ ] Test: GET lista de juntas
- [ ] Test: DELETE junta

### Fase 3: Tests Paso 1
- [ ] Crear `tests/juntas/paso-1-seleccion-agenda.test.ts`
- [ ] Test: Guardar selección
- [ ] Test: Actualizar selección
- [ ] Test: Validar mínimo 1 punto

### Fase 4: MSW Handlers (AL ÚLTIMO)
- [ ] Verificar handlers en `infrastructure/mocks/handlers/`
- [ ] Sincronizar con backend real

---

## ✅ Ventajas de Este Enfoque

1. ✅ **Reutiliza** patrón de Sociedades
2. ✅ **Helpers** reutilizables
3. ✅ **Modo dual** (MSW + Backend)
4. ✅ **Profesional** (mejores prácticas)
5. ✅ **Mantenible** (fácil de extender)

---

**¿Empezamos creando los helpers de testing para Juntas?**

---

**Última actualización:** Diciembre 4, 2025

