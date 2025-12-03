# 🧪 **MSW - ESTADO ACTUAL Y CONFIGURACIÓN COMPLETA**

**Fecha**: Diciembre 3, 2025  
**Estado**: ✅ MSW implementado para TODOS los pasos  
**Problema actual**: Tests con MSW fallan, tests con backend real pasan al 100%

---

## 📊 **ESTADO ACTUAL DE MSW**

### ✅ **MSW YA ESTÁ IMPLEMENTADO PARA TODOS LOS PASOS:**

```
✅ PASO 0: Sociedades         - Handlers + State ✅
✅ PASO 1: Datos Sociedad     - Handlers + State ✅
✅ PASO 2: Accionistas        - Handlers + State ✅
✅ PASO 3: Acciones           - Handlers + State ✅
✅ PASO 4: Asignación         - Handlers + State ✅
✅ PASO 5: Directorio         - Handlers + State ✅
✅ PASO 6: Apoderados         - Handlers + State ✅
✅ PASO 8: Quorum             - Handlers + State ✅
```

**Ubicación:**
```
app/core/hexag/registros/sociedades/pasos/[paso]/infrastructure/mocks/
├── handlers/
│   └── [paso].handlers.ts    ✅ Handlers MSW
├── data/
│   └── [paso].state.ts       ✅ Estado en memoria
└── index.ts                   ✅ Export
```

---

## 🔧 **CÓMO FUNCIONA MSW**

### **1. Configuración**

```typescript
// tests/setup.ts (líneas 18-62)

const testConfig = getTestConfig();

// ⭐ Si TEST_USE_MSW=true, crea servidor MSW
export const mswServer = testConfig.useMsw 
  ? setupServer(...allMockHandlers)  // ← Todos los handlers registrados
  : null;

if (mswServer) {
  beforeAll(() => {
    mswServer.listen();  // ✅ Intercepta peticiones HTTP
    console.log("🧪 [Tests] MSW activado - Usando mocks");
  });
}
```

### **2. Handlers Registrados**

```typescript
// app/core/hexag/mocks/register-handlers.ts

export const allMockHandlers = [
  ...authHandlers,          // Auth (login)
  ...registrosHandlers,     // ← Todos los handlers de sociedades
  ...juntasHandlers,        // Juntas
  // ...
];
```

```typescript
// app/core/hexag/registros/sociedades/infrastructure/mocks/register-handlers.ts

export const registrosHandlers = [
  ...sociedadesHandlers,         // PASO 0
  ...datosSociedadHandlers,      // PASO 1
  ...accionistasHandlers,        // PASO 2
  ...accionesHandlers,           // PASO 3
  ...asignacionAccionesHandlers, // PASO 4
  ...directorioHandlers,         // PASO 5 (config)
  ...directoresHandlers,         // PASO 5 (directores)
  ...apoderadosHandlers,         // PASO 6
  ...quorumHandlers,             // PASO 8
];
```

### **3. Estado en Memoria**

```typescript
// Ejemplo: app/core/.../acciones/infrastructure/mocks/data/acciones.state.ts

import { getAllRecords, putRecord, deleteRecord } from "@hexag/registros/shared/mock-database";

const STORE_NAME = "acciones";

// Listar acciones de una sociedad
export async function listAccionesMock(societyProfileId: string): Promise<Accion[]> {
  const all = await getAllRecords<StoredAccion>(STORE_NAME);
  return all.filter(a => a.societyProfileId === societyProfileId);
}

// Crear acción
export async function createAccionMock(societyProfileId: string, payload: AccionPayload): Promise<Accion> {
  const accion = {
    ...payload,
    id: payload.id || generateUUID(),
    societyProfileId,
    createdAt: new Date().toISOString(),
  };
  
  await putRecord(STORE_NAME, accion);
  return accion;
}
```

---

## 🚨 **PROBLEMA ACTUAL**

### **Tests con BACKEND REAL:**
```bash
TEST_USE_MSW=false npm run test:core:all
✅ 29/29 tests pasando (100%)
```

### **Tests con MSW:**
```bash
TEST_USE_MSW=true npm run test:core:datos-sociedad
❌ 1/3 tests fallando

Error: Error de validación (al UPDATE)
```

---

## 🔍 **DIAGNÓSTICO DEL PROBLEMA**

### **Posibles causas:**

1. **Los handlers MSW no están validando correctamente**
   - MSW podría estar rechazando payloads que el backend real acepta
   - Validación muy estricta en los mocks

2. **El estado en memoria no se está compartiendo correctamente**
   - CREATE funciona, pero UPDATE no encuentra el registro
   - Problema de filtrado por `societyProfileId`

3. **Los mappers MSW no coinciden con los del backend**
   - Campo diferente entre mock y backend
   - Transformación incorrecta

4. **Orden de handlers MSW**
   - Un handler más genérico podría estar capturando antes que el específico
   - Ejemplo: `*/api/v2/society-profile/:id/*` captura antes que `*/api/v2/society-profile/:id/society`

---

## 🎯 **PLAN DE ACCIÓN**

### **FASE 1: AUDITORÍA (1-2 horas)**

✅ **Revisar cada handler MSW existente:**

1. **Datos Sociedad**
   - ¿El UPDATE funciona con los mismos payloads que el backend?
   - ¿Valida RUC correctamente?
   - ¿Retorna mismo formato que backend?

2. **Accionistas**
   - ¿El mock acepta personas naturales y jurídicas?
   - ¿Valida documentos correctamente?

3. **Acciones**
   - ¿El handler existe y está registrado?
   - ¿Valida tipos de acción (COMUN, PREFERENCIAL)?

4. **Asignación**
   - ¿El handler existe y está registrado?
   - ¿Valida que existan accionista y acción?

5. **Directorio**
   - ¿Los 2 handlers (config + directores) están bien separados?
   - ¿Valida `presidenteId`?

6. **Apoderados**
   - ¿Los 2 handlers (clases + apoderados) funcionan?
   - ¿Valida `claseApoderadoId`?

7. **Quorum**
   - ¿Acepta valores >= 50%?
   - ¿Valida segunda >= primera?

---

### **FASE 2: CORRECCIÓN (2-4 horas)**

✅ **Para cada handler que falle:**

1. Comparar con el `HttpRepository` correspondiente
2. Revisar qué valida el backend (docs/backend/)
3. Ajustar validaciones del mock para que coincidan
4. Probar con `TEST_USE_MSW=true`

---

### **FASE 3: VALIDACIÓN (1 hora)**

✅ **Ejecutar TODOS los tests con MSW:**

```bash
# Test por test
TEST_USE_MSW=true npm run test:core:datos-sociedad
TEST_USE_MSW=true npm run test:core:accionistas
TEST_USE_MSW=true npm run test:core:acciones
TEST_USE_MSW=true npm run test:core:asignacion
TEST_USE_MSW=true npm run test:core:directorio
TEST_USE_MSW=true npm run test:core:apoderados
TEST_USE_MSW=true npm run test:core:quorum

# Todos juntos
TEST_USE_MSW=true npm run test:core:all
```

**Objetivo:** 29/29 tests pasando con MSW (igual que con backend real)

---

## 🔧 **COMANDOS ÚTILES**

### **Ejecutar con MSW:**
```bash
TEST_USE_MSW=true npm run test:core:[paso]
```

### **Ejecutar con Backend Real:**
```bash
TEST_USE_MSW=false npm run test:core:[paso]
```

### **Ver qué está interceptando MSW:**
```typescript
// En el handler, agregar:
console.debug("[MSW][NombrePaso] Request:", { url, body, params });
console.debug("[MSW][NombrePaso] Response:", responsePayload);
```

---

## 📋 **CHECKLIST DE VALIDACIÓN**

### **Para cada paso, verificar:**

- [ ] Handler está registrado en `register-handlers.ts`
- [ ] State functions existen y filtran por `societyProfileId`
- [ ] Handlers retornan formato estándar: `{ success, message, code, data }`
- [ ] Validaciones coinciden con las del backend
- [ ] UUIDs se respetan si vienen en el payload
- [ ] Test pasa con `TEST_USE_MSW=true`

---

## 🎯 **OBJETIVO FINAL**

```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║  TESTS CON BACKEND REAL:    29/29 (100%) ✅                      ║
║  TESTS CON MSW:             29/29 (100%) ✅ ← META                ║
║                                                                   ║
║  🏆 100% PASSING EN AMBOS MODOS 🏆                               ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## 🚀 **SIGUIENTE PASO**

¿Quieres que:

1. **Audite TODOS los handlers MSW** y los corrija uno por uno?
2. **Solo arregle el que está fallando** (datos-sociedad UPDATE)?
3. **Te muestre un reporte de qué está mal en cada handler** antes de corregir?

**¿Qué prefieres mi rey?** 🎯

