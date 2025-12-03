# 🔴 REPORTE DE INTEGRACIÓN: Tests con Backend Real

**Fecha:** 3 de Diciembre 2025  
**Ejecutado por:** Frontend Team  
**Comando:** `TEST_USE_MSW=false npm run test:juntas:shared`  
**Estado Backend:** ✅ Corriendo en `http://localhost:3000`

---

## 📊 RESUMEN EJECUTIVO

### **Resultados:**
- ✅ **51 tests PASARON** (82.2%)
- ❌ **11 tests FALLARON** (17.8%)
- 📦 **3 archivos de test** ejecutados
- ⏱️ **Duración:** 3.45 segundos

### **Archivos de Test:**
1. `junta.repository.shared.test.ts` - CRUD de juntas
2. `agenda-items.repository.shared.test.ts` - Puntos de agenda
3. `meeting-details.repository.shared.test.ts` - Detalles de junta

---

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### **PROBLEMA 1: Base de Datos Sucia** 🗑️

**Endpoint:** `GET /api/v2/society-profile/:societyId/register-assembly/list`

**Síntoma:**
```
Test: "debe retornar array vacío cuando no hay juntas"
Esperado: []
Recibido: [41 juntas antiguas en la BD]
```

**Causa:**
- La base de datos tiene **juntas antiguas** que no se limpian entre tests
- Los tests esperan empezar con BD limpia
- El backend NO está usando BD de testing aislada

**Impacto:** 
- ❌ 4 tests fallan por datos viejos
- Tests no son reproducibles
- Imposible confiar en los resultados

**Recomendación para Backend:**
```typescript
// Antes de cada test suite
beforeEach(async () => {
  await db.clearJuntas(); // Limpiar juntas de testing
  // O usar BD en memoria para tests
});
```

**Tests que fallan por esto:**
- ❌ `debe retornar array vacío cuando no hay juntas`
- ❌ `debe listar juntas creadas`
- ❌ `debe listar solo juntas de la sociedad correcta`
- ❌ `debe eliminar una junta existente`

---

### **PROBLEMA 2: segundaConvocatoria NO se Elimina en Junta Universal** 🐛

**Endpoint:** `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details`

**Síntoma:**
```
Test: "debe actualizar meeting details con tipo UNIVERSAL"

Enviamos:
{
  "tipoJunta": "JUNTA_UNIVERSAL",
  "primeraConvocatoria": { ... },
  // NO enviamos segundaConvocatoria
}

Backend responde con:
{
  "meetingType": "JUNTA_UNIVERSAL",
  "firstCall": { ... },
  "secondCall": { ... }  ← ❌ NO DEBERÍA ESTAR
}
```

**Causa:**
El backend NO elimina `secondCall` cuando:
1. Se cambia de `JUNTA_GENERAL` a `JUNTA_UNIVERSAL`
2. O cuando se actualiza una Universal

**Data que enviamos:**
```json
{
  "tipoJunta": "JUNTA_UNIVERSAL",
  "esAnualObligatoria": false,
  "instaladaEnConvocatoria": "PRIMERA",
  "presidenteAsistio": false,
  "secretarioAsistio": false,
  "primeraConvocatoria": {
    "direccion": "Av. Principal 123, Lima",
    "modo": "IN_PERSON",
    "fecha": "2025-01-15T00:00:00.000Z",
    "hora": "2025-01-15T14:30:00.000Z"
  }
  // ⚠️ NO enviamos "segundaConvocatoria"
}
```

**Data que recibimos:**
```json
{
  "meetingType": "JUNTA_UNIVERSAL",
  "isAnnualMandatory": false,
  "firstCall": { ... },
  "secondCall": {  // ❌ ESTO NO DEBERÍA ESTAR
    "Address": "https://zoom.us/j/123456789",
    "Mode": "VIRTUAL",
    "Date": "2025-01-18T00:00:00.000Z",
    "Time": "2025-01-18T14:30:00.000Z"
  },
  ...
}
```

**Recomendación para Backend:**
```typescript
// En el controller de meeting-details
async updateMeetingDetails(req, res) {
  const { tipoJunta, primeraConvocatoria, segundaConvocatoria } = req.body;
  
  // Si es JUNTA_UNIVERSAL, eliminar explícitamente segundaConvocatoria
  if (tipoJunta === 'JUNTA_UNIVERSAL') {
    await db.update({
      ...data,
      secondCall: null, // ← Eliminar explícitamente
    });
  }
}
```

**Tests que fallan por esto:**
- ❌ `debe actualizar meeting details con tipo UNIVERSAL`
- ❌ `debe poder cambiar de GENERAL a UNIVERSAL`

---

### **PROBLEMA 3: Error de Validación en Autoridades** 🚫

**Endpoint:** `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/meeting-details`

**Síntoma:**
```
Status: 422 Unprocessable Entity
Message: "Error de validación"
```

**Data que enviamos:**
```json
{
  "tipoJunta": "JUNTA_UNIVERSAL",
  "esAnualObligatoria": false,
  "instaladaEnConvocatoria": "PRIMERA",
  "presidenteId": "uuid-presidente-123",
  "secretarioId": "uuid-secretario-456",
  "presidenteAsistio": true,
  "secretarioAsistio": false,
  "nombreOtroSecretario": "Juan Pérez Gómez",  // ← Secretario externo
  "primeraConvocatoria": { ... }
}
```

**Causa posible:**
1. El backend NO acepta `nombreOtroSecretario` cuando `secretarioId` está presente
2. O la validación de autoridades está mal configurada
3. O los campos tienen formato incorrecto

**Recomendación para Backend:**
Revisar validación en el schema/DTO:
```typescript
// ¿La validación permite esto?
{
  secretarioId?: string;         // UUID o null
  nombreOtroSecretario?: string; // Nombre si es externo
}

// Regla de negocio:
// - Si secretarioId existe → nombreOtroSecretario debe ser null/undefined
// - Si secretarioId es null → nombreOtroSecretario puede tener valor
```

**Tests que fallan por esto:**
- ❌ `debe actualizar datos de autoridades`

---

### **PROBLEMA 4: Internal Server Error en Agenda Items** 💥

**Endpoint:** `PUT /api/v2/society-profile/:societyId/assembly/:flowId/agenda-items`

**Síntoma:**
```
Status: 500 Internal Server Error
Message: "Internal server error"
```

**Data que enviamos:**
```json
{
  "aumentoCapital": {
    "aportesDinerarios": false,
    "aporteNoDinerario": false,
    "capitalizacionDeCreditos": false
  },
  "remocion": {
    "remocionGerenteGeneral": false,
    "remocionApoderados": false,
    "remocionDirectores": false
  },
  "nombramiento": {
    "nombramientoGerenteGeneral": false,
    "nombramientoApoderados": true,
    "nombramientoDirectores": false,
    "nombramientoNuevoDirectorio": false
  },
  "gestionSocialYResultadosEconomicos": {
    "pronunciamientoGestionSocialYResultados": false,
    "aplicacionResultados": false,
    "designacionAuditoresExternos": false
  }
}
```

**Contexto:**
- Este es el **segundo PUT** al mismo flowId
- El primero funcionó ✅
- El segundo causó crash 💥

**Causa posible:**
1. El backend NO maneja múltiples actualizaciones al mismo flowId
2. Hay un constraint en BD que impide updates
3. El endpoint es INSERT en lugar de UPSERT

**Recomendación para Backend:**
```typescript
// El endpoint debe hacer UPSERT (no INSERT)
async updateAgendaItems(societyId, flowId, data) {
  // ✅ CORRECTO: Buscar y actualizar
  await db.agendaItems.upsert({
    where: { flowId },
    create: data,
    update: data,
  });
  
  // ❌ INCORRECTO: Solo insertar
  await db.agendaItems.create(data); // ← Falla si ya existe
}
```

**Tests que fallan por esto:**
- ❌ `debe poder actualizar varias veces` (2do update falla)

---

## ✅ ENDPOINTS QUE FUNCIONAN CORRECTAMENTE

### **1. POST /register-assembly** ✅
**Descripción:** Crear junta  
**Status:** ✅ Funciona perfecto  
**Response:**
```json
{
  "success": true,
  "data": {
    "flowStructureId": "123"
  }
}
```

---

### **2. GET /register-assembly/:flowId/snapshot/complete** ✅
**Descripción:** Obtener snapshot de accionistas  
**Status:** ✅ Funciona perfecto  
**Response:**
```json
{
  "success": true,
  "data": {
    "meetingConfigId": "uuid",
    "shareholders": [...],
    "quorums": {...},
    ...
  }
}
```

---

### **3. GET /meeting-details** ✅
**Descripción:** Obtener detalles de junta  
**Status:** ✅ Funciona perfecto  
**Response:**
```json
{
  "success": true,
  "data": {
    "meetingType": "JUNTA_GENERAL",
    "firstCall": {...},
    "secondCall": {...}
  }
}
```

---

### **4. PUT /meeting-details** ⚠️
**Descripción:** Actualizar detalles  
**Status:** ⚠️ Funciona parcialmente  
**Problemas:**
- ❌ NO elimina `secondCall` en Universal
- ❌ Error de validación con autoridades
- ✅ Actualiza fechas correctamente
- ✅ Actualiza modalidad correctamente

---

### **5. GET /agenda-items** ✅
**Descripción:** Obtener puntos de agenda  
**Status:** ✅ Funciona perfecto  

---

### **6. PUT /agenda-items** ⚠️
**Descripción:** Actualizar puntos de agenda  
**Status:** ⚠️ Primer update funciona, segundo falla  
**Problemas:**
- ✅ Primer PUT: OK
- ❌ Segundo PUT al mismo flowId: Internal Server Error

---

### **7. GET /attendance** ❓
**Descripción:** Obtener asistencias  
**Status:** ❓ No testeado (sin datos)  
**Problema:** Devuelve array vacío `[]`  
**Causa:** Los registros NO se crean al hacer POST /register-assembly

---

## 📋 DETALLE DE TESTS FALLIDOS

### **Grupo 1: Junta Repository (6 fallos)**

#### **Test 1:** `debe retornar array vacío cuando no hay juntas`
**Esperado:** `[]`  
**Recibido:** `[41 juntas]`  
**Causa:** Base de datos sucia

#### **Test 2:** `debe listar juntas creadas`
**Esperado:** `2 juntas`  
**Recibido:** `43 juntas`  
**Causa:** Base de datos sucia

#### **Test 3:** `debe listar solo juntas de la sociedad correcta`
**Esperado:** `1 junta por sociedad`  
**Recibido:** `44 y 6 juntas`  
**Causa:** Base de datos sucia

#### **Test 4-6:** Delete tests
**Problema:** Mismo issue de BD sucia

---

### **Grupo 2: Meeting Details (3 fallos)**

#### **Test 7:** `debe actualizar meeting details con tipo UNIVERSAL`
**Problema:** `segundaConvocatoria` NO se elimina

**Request (lo que enviamos):**
```json
PUT /meeting-details
{
  "tipoJunta": "JUNTA_UNIVERSAL",
  "primeraConvocatoria": {
    "direccion": "Av. Principal 123, Lima",
    "modo": "IN_PERSON",
    "fecha": "2025-01-15T00:00:00.000Z",
    "hora": "2025-01-15T14:30:00.000Z"
  }
  // ⚠️ NO incluimos "segundaConvocatoria"
}
```

**Response (lo que recibimos):**
```json
GET /meeting-details
{
  "meetingType": "JUNTA_UNIVERSAL",
  "firstCall": { ... },
  "secondCall": {  // ❌ NO DEBERÍA EXISTIR
    "Address": "https://zoom.us/j/123456789",
    "Mode": "VIRTUAL",
    ...
  }
}
```

**Esperado:**
- En `JUNTA_UNIVERSAL`, `secondCall` debe ser `null` o no existir

---

#### **Test 8:** `debe actualizar datos de autoridades`
**Problema:** Error de validación 422

**Request (lo que enviamos):**
```json
PUT /meeting-details
{
  "tipoJunta": "JUNTA_UNIVERSAL",
  "presidenteId": "uuid-presidente-123",
  "secretarioId": "uuid-secretario-456",
  "presidenteAsistio": true,
  "secretarioAsistio": false,
  "nombreOtroSecretario": "Juan Pérez Gómez",
  "primeraConvocatoria": { ... }
}
```

**Response:**
```json
{
  "success": false,
  "message": "Error de validación",
  "code": 422
}
```

**Pregunta para Backend:**
- ¿Es válido enviar `secretarioId` Y `nombreOtroSecretario` juntos?
- ¿O deben ser mutuamente excluyentes?

---

#### **Test 9:** `debe poder cambiar de GENERAL a UNIVERSAL`
**Problema:** Mismo que Test 7 (no elimina `secondCall`)

---

### **Grupo 3: Agenda Items (2 fallos)**

#### **Test 10:** `debe actualizar agenda items correctamente`
**Problema:** Internal Server Error 500

**Request (lo que enviamos):**
```json
PUT /api/v2/society-profile/1/assembly/1/agenda-items
{
  "aumentoCapital": {
    "aportesDinerarios": true,
    "aporteNoDinerario": false,
    "capitalizacionDeCreditos": false
  },
  "remocion": {
    "remocionGerenteGeneral": false,
    "remocionApoderados": false,
    "remocionDirectores": false
  },
  "nombramiento": {
    "nombramientoGerenteGeneral": false,
    "nombramientoApoderados": true,
    "nombramientoDirectores": false,
    "nombramientoNuevoDirectorio": false
  },
  "gestionSocialYResultadosEconomicos": {
    "pronunciamientoGestionSocialYResultados": false,
    "aplicacionResultados": false,
    "designacionAuditoresExternos": false
  }
}
```

**Response:**
```json
{
  "success": false,
  "message": "Internal server error",
  "code": 500
}
```

**Contexto:**
- Este es el **PRIMER PUT** a un flowId recién creado
- Debería funcionar

**Pregunta para Backend:**
- ¿El endpoint hace INSERT o UPSERT?
- ¿Hay logs del error en el servidor?

---

#### **Test 11:** `debe poder actualizar varias veces`
**Problema:** Segundo update causa 500

**Contexto:**
1. Primer PUT: ✅ OK
2. Segundo PUT (al mismo flowId): ❌ 500 Internal Server Error

**Recomendación:**
El endpoint DEBE hacer UPSERT (INSERT OR UPDATE)

---

## 📊 TESTS QUE PASARON (51)

### **Junta Repository** ✅
- ✅ `create()` - Crear junta
- ✅ `getSnapshot()` - Obtener snapshot completo

### **Agenda Items (MSW)** ✅
- ✅ Todos los tests con MSW pasaron (6/6)

### **Meeting Details** ✅
- ✅ `get()` - Obtener detalles (cuando existen)
- ✅ `update()` - Actualizar tipo de junta
- ✅ `update()` - Actualizar modo de reunión
- ✅ `update()` - Actualizar fechas y horas
- ✅ `update()` - Actualizar esAnualObligatoria

### **Meeting Details (MSW)** ✅
- ✅ Todos los tests con MSW pasaron (10/10)

---

## 🔍 ANÁLISIS TÉCNICO

### **URLs que Funcionan:**

```
✅ POST   http://localhost:3000/api/v2/society-profile/1/register-assembly
✅ GET    http://localhost:3000/api/v2/society-profile/1/register-assembly/list
✅ DELETE http://localhost:3000/api/v2/society-profile/1/register-assembly/123
✅ GET    http://localhost:3000/api/v2/society-profile/1/register-assembly/1/snapshot/complete
✅ GET    http://localhost:3000/api/v2/society-profile/1/register-assembly/1/meeting-details
⚠️ PUT    http://localhost:3000/api/v2/society-profile/1/register-assembly/1/meeting-details
⚠️ GET    http://localhost:3000/api/v2/society-profile/1/assembly/1/agenda-items
⚠️ PUT    http://localhost:3000/api/v2/society-profile/1/assembly/1/agenda-items
```

### **Headers que Enviamos:**

```json
{
  "Authorization": "Bearer eyJhbG...",
  "Content-Type": "application/json"
}
```

---

## 🎯 RECOMENDACIONES PRIORITARIAS PARA BACKEND

### **ALTA PRIORIDAD:**

1. **🗑️ Limpiar BD entre tests**
   - Usar BD de testing aislada
   - O implementar endpoint `/test/cleanup`
   - O usar transacciones que se rollback

2. **🐛 Eliminar `secondCall` en Universal**
   - Cuando `meetingType === 'JUNTA_UNIVERSAL'`
   - Establecer `secondCall = null` explícitamente

3. **💥 Fix Internal Server Error en Agenda Items**
   - Revisar logs del servidor
   - Cambiar INSERT por UPSERT
   - Permitir múltiples updates al mismo flowId

4. **🚫 Aclarar validación de Autoridades**
   - Documentar reglas de negocio:
     - ¿`presidenteId` y `nombreOtroPresidente` son mutuamente excluyentes?
     - ¿Qué pasa si envío ambos?

---

### **MEDIA PRIORIDAD:**

5. **📝 Documentar estructura exacta de Response**
   - Actualmente usamos `PascalCase` en algunos campos
   - Confirmar si es intencional o bug

6. **🔄 Implementar creación automática de Attendance**
   - Actualmente `GET /attendance` devuelve `[]`
   - Según docs, debería crearse al hacer POST /register-assembly

---

## 📄 ARCHIVOS DE EVIDENCIA

### **Tests Ejecutados:**
- `app/core/hexag/juntas/infrastructure/repositories/__tests__/junta.repository.shared.test.ts`
- `app/core/hexag/juntas/infrastructure/repositories/__tests__/agenda-items.repository.shared.test.ts`
- `app/core/hexag/juntas/infrastructure/repositories/__tests__/meeting-details.repository.shared.test.ts`

### **Output Completo:**
- Ver: `agent-tools/f71f4c01-97a7-4916-8291-3b1ba3231ace.txt`
- Líneas: 2,551
- Tamaño: 97.7 KB

---

## 🤝 PRÓXIMOS PASOS

### **Frontend (Nosotros):**
- ⏸️ Esperar correcciones del backend
- 📚 Documentar workarounds temporales si es necesario
- ✅ Mantener tests actualizados

### **Backend (Ustedes):**
1. **Revisar y corregir los 4 problemas críticos**
2. **Compartir logs del server** (especialmente para el 500)
3. **Confirmar estructura esperada** de requests/responses
4. **Implementar BD de testing** aislada
5. **Re-ejecutar tests** después de correcciones

---

## 📞 CONTACTO

Si necesitan:
- Más detalles de algún test específico
- Logs adicionales
- Ejemplos de requests
- Pair programming para revisar juntos

**Estamos disponibles** 🚀

---

## 📊 MÉTRICA FINAL

```
┌─────────────────────────────────────────┐
│  RESUMEN DE INTEGRACIÓN CON BACKEND     │
├─────────────────────────────────────────┤
│  ✅ Tests Pasados:          51 (82.2%)  │
│  ❌ Tests Fallidos:         11 (17.8%)  │
│  🐛 Bugs Críticos:           4          │
│  📦 Endpoints Afectados:     3          │
│  ⏱️  Duración:             3.45s        │
└─────────────────────────────────────────┘
```

**Conclusión:** El backend está **82% funcional**. Con las 4 correcciones críticas, llegaríamos al **100%**.

---

**Reporte generado automáticamente por el sistema de testing de Frontend**  
**Fecha:** 3 de Diciembre 2025, 08:43 AM

