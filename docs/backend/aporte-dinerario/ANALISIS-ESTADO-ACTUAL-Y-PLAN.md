# 🎯 Análisis: Estado Actual y Plan - Aporte Dinerario y Capitalización de Créditos

**Fecha:** 2025-12-18  
**Objetivo:** Entender cómo está todo ahora, qué cambió, y cómo proceder sin inventar nada.

---

## 1️⃣ CÓMO TENEMOS (Estado Actual)

### ✅ **Aporte Dinerario - YA ESTÁ CONECTADO**

**Arquitectura:** Conexión directa (NO DDD hexagonal)

- Store → `$fetch` → Backend
- Sin Use Cases ni Repositories (por ahora)

**Endpoints que ya funcionan:**

```
GET    /participants          → Listar aportantes
POST   /participants          → Crear nuevo aportante
PATCH  /participants          → Toggle isContributor (checkbox)
DELETE /participants          → Eliminar aportante

GET    /contributions         → Listar aportes
POST   /contributions         → Crear aporte
PUT    /contributions         → Actualizar aporte
DELETE /contributions         → Eliminar aportes

GET    /votes?contexto=APORTES_DINERARIOS  → Obtener votación
POST   /votes                              → Crear sesión de votación
PUT    /votes                              → Actualizar votación
```

**Archivos clave:**

- `useAportantesPage.ts` → Maneja participantes (GET, POST, PATCH, DELETE)
- `useAportesPage.ts` → Maneja aportes (orquesta el store)
- `useAportesManagerStore.ts` → Store con GET/POST/PUT/DELETE de aportes
- `useVotacionController.ts` → Maneja votación (GET, POST, PUT)

---

### ❌ **Capitalización de Créditos - NO ESTÁ CONECTADO**

**Estado:** Backend listo, frontend NO implementado

**Endpoints disponibles (igual que aporte dinerario, solo cambia el prefijo):**

```
GET    /credit-capitalization/participants
POST   /credit-capitalization/participants
PATCH  /credit-capitalization/participants
DELETE /credit-capitalization/participants

GET    /credit-capitalization/contributions
POST   /credit-capitalization/contributions
PUT    /credit-capitalization/contributions
DELETE /credit-capitalization/contributions

GET    /votes?contexto=CAPITALIZACION_DE_CREDITOS
POST   /votes
PUT    /votes
```

---

## 2️⃣ CÓMO NOS CONECTÁBAMOS (Antes)

### **Patrón Simple y Directo:**

```typescript
// 1. Resolver URL base
function resolveBaseUrl(): string {
  const config = useRuntimeConfig();
  const apiBase = config.public?.apiBase || "";
  const origin = window.location.origin;
  return apiBase || origin || "http://localhost:3000";
}

// 2. Hacer request con $fetch
const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/participants`;

const response = await $fetch(url, {
  ...withAuthHeaders(), // ✅ Headers de autenticación
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  body: payload, // Si es POST/PUT/PATCH
});
```

**Eso es todo.** No hay capas intermedias, no hay Use Cases, no hay Repositories. Directo al grano.

---

## 3️⃣ QUÉ CAMBIÓ

### **Backend Refactorizó:**

1. **Capitalización de Créditos** ahora tiene prefijo `/credit-capitalization` en todas las rutas
2. **`comprobantePagoArchivoId`** es **REQUERIDO** en capitalización (en aporte dinerario es opcional)
3. **Votación** usa contexto diferente: `CAPITALIZACION_DE_CREDITOS` (en lugar de `APORTES_DINERARIOS`)

**Eso es todo lo que cambió.** La estructura de datos es **idéntica**, solo cambian:

- Rutas (agregar prefijo)
- Validación (comprobante requerido)
- Contexto de votación

---

## 4️⃣ CÓMO PODRÍAMOS COMENZAR

### **Opción 1: Copiar y Pegar (Más Rápido)**

1. **Copiar toda la carpeta de aporte dinerario:**

   ```
   app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/
   → app/core/presentation/juntas/puntos-acuerdo/capitalizacion-creditos/
   ```

2. **Buscar y reemplazar:**

   - `participants` → `credit-capitalization/participants`
   - `contributions` → `credit-capitalization/contributions`
   - `APORTES_DINERARIOS` → `CAPITALIZACION_DE_CREDITOS`
   - `Aportante` → `Acreedor` (solo en nombres de variables/comentarios)
   - `Aporte` → `Credito` (solo en nombres de variables/comentarios)

3. **Validar comprobante:**

   - En el formulario de crédito, hacer `comprobantePagoArchivoId` **requerido**

4. **Listo.** 🎉

---

### **Opción 2: Reutilizar Lógica (Más Limpio)**

1. **Crear composables genéricos** que acepten el prefijo como parámetro:

   ```typescript
   // useParticipantsPage.ts (genérico)
   function useParticipantsPage(prefix: string = "") {
     const url = `${baseUrl}/api/v2/.../${prefix}participants`;
     // ...
   }
   ```

2. **Crear stores genéricos** que acepten el prefijo:

   ```typescript
   // useContributionsStore.ts (genérico)
   function useContributionsStore(prefix: string = "") {
     const url = `${baseUrl}/api/v2/.../${prefix}contributions`;
     // ...
   }
   ```

3. **Usar en cada módulo:**

   ```typescript
   // Aporte Dinerario
   const participantes = useParticipantsPage("");
   const aportes = useContributionsStore("");

   // Capitalización
   const acreedores = useParticipantsPage("credit-capitalization/");
   const creditos = useContributionsStore("credit-capitalization/");
   ```

**Recomendación:** Opción 1 es más rápida y funciona igual. Opción 2 es más elegante pero requiere más refactorización.

---

## 5️⃣ PLANES PROPUESTOS

### **Plan A: Implementación Rápida (1-2 días)**

1. ✅ Copiar estructura de aporte dinerario
2. ✅ Cambiar rutas (agregar prefijo)
3. ✅ Cambiar contexto de votación
4. ✅ Validar comprobante requerido
5. ✅ Probar endpoints

**Ventajas:** Rápido, funciona, sin riesgo  
**Desventajas:** Código duplicado

---

### **Plan B: Refactorización a Genéricos (3-5 días)**

1. ✅ Crear composables genéricos
2. ✅ Crear stores genéricos
3. ✅ Refactorizar aporte dinerario para usar genéricos
4. ✅ Implementar capitalización usando genéricos
5. ✅ Probar ambos módulos

**Ventajas:** Código reutilizable, más mantenible  
**Desventajas:** Más tiempo, más cambios

---

### **Plan C: Híbrido (2-3 días)**

1. ✅ Implementar capitalización copiando (Plan A)
2. ✅ Marcar código duplicado con TODO
3. ✅ Refactorizar a genéricos después (Plan B)
4. ✅ Eliminar código duplicado

**Ventajas:** Funciona rápido, luego se limpia  
**Desventajas:** Código duplicado temporal

---

## 🔍 RESPUESTAS A TUS PREGUNTAS

### **1. ¿Cómo conecto aporte dinerario/capitalización?**

**Ya lo estás haciendo bien.** Es GET, POST, PUT, DELETE, PATCH directo con `$fetch`:

```typescript
// Ejemplo: Crear aporte
const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/contributions`;

await $fetch(url, {
  ...withAuthHeaders(),
  method: "POST",
  body: {
    id: generateUuid(),
    accionistaId: "...",
    accionId: "...",
    // ... resto de campos
  },
});
```

**Para capitalización, solo cambia la ruta:**

```typescript
// Capitalización de créditos
const url = `${baseUrl}/api/v2/society-profile/${societyId}/register-assembly/${flowId}/credit-capitalization/contributions`;
```

**Eso es todo.** No hay nada nuevo, solo cambia el prefijo en la URL.

---

### **2. ¿Cómo se hace la votación?**

**Ya está implementado en aporte dinerario.** Es el mismo patrón que otros módulos:

**Flujo:**

1. **GET** `/votes?contexto=APORTES_DINERARIOS` → Cargar votación existente
2. Si no existe, **POST** `/votes` → Crear sesión nueva
3. Si existe, **PUT** `/votes` → Actualizar votos

**Código de referencia:**

- `app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/composables/useVotacionController.ts`
- `app/core/presentation/juntas/stores/votacion.store.ts`

**Para capitalización, solo cambia el contexto:**

```typescript
// Aporte Dinerario
GET /votes?contexto=APORTES_DINERARIOS

// Capitalización
GET /votes?contexto=CAPITALIZACION_DE_CREDITOS
```

**El store ya maneja el contexto:**

```typescript
votacionStore.createVotacion(
  societyId,
  flowId,
  itemId,
  label,
  descripcion,
  tipoAprobacion,
  VoteContext.CAPITALIZACION_DE_CREDITOS // ✅ Solo cambiar esto
);
```

**No hay nada nuevo.** Es el mismo código, solo cambia el enum del contexto.

---

### **3. ¿Qué de nuevo está trayendo todo esto? ¿Debería preocuparme?**

**Respuesta corta: NO, no te preocupes.** 😊

**Por qué:**

1. **Backend ya está listo** - Los endpoints existen y funcionan
2. **Frontend ya tiene el patrón** - Aporte dinerario ya está conectado
3. **Solo cambian nombres** - Rutas, contexto, validación de comprobante
4. **No hay lógica nueva** - Es copiar, pegar, y cambiar strings

**Lo único "nuevo":**

- Prefijo `/credit-capitalization` en las rutas
- `comprobantePagoArchivoId` requerido (solo validación)
- Contexto `CAPITALIZACION_DE_CREDITOS` (solo enum diferente)

**Todo lo demás ya lo tienes:**

- ✅ Cómo hacer GET/POST/PUT/DELETE
- ✅ Cómo manejar votación
- ✅ Cómo estructurar stores/composables
- ✅ Cómo validar formularios

**Es trabajo mecánico, no creativo.** Copiar, cambiar nombres, probar. Eso es todo.

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### **Para Capitalización de Créditos:**

- [ ] **Paso 1: Copiar estructura**

  - [ ] Copiar `aporte-dinerario/` → `capitalizacion-creditos/`
  - [ ] Renombrar archivos (opcional, solo para claridad)

- [ ] **Paso 2: Cambiar rutas**

  - [ ] Buscar `/participants` → `/credit-capitalization/participants`
  - [ ] Buscar `/contributions` → `/credit-capitalization/contributions`
  - [ ] Verificar todas las URLs

- [ ] **Paso 3: Cambiar contexto de votación**

  - [ ] Buscar `APORTES_DINERARIOS` → `CAPITALIZACION_DE_CREDITOS`
  - [ ] Verificar `VoteContext` en stores

- [ ] **Paso 4: Validar comprobante**

  - [ ] Hacer `comprobantePagoArchivoId` requerido en formulario
  - [ ] Agregar validación Zod si es necesario

- [ ] **Paso 5: Probar**
  - [ ] GET participantes (acreedores)
  - [ ] POST crear acreedor
  - [ ] PATCH toggle isContributor
  - [ ] GET créditos
  - [ ] POST crear crédito
  - [ ] PUT actualizar crédito
  - [ ] GET votación
  - [ ] POST/PUT votación

---

## 🎯 CONCLUSIÓN

**No hay nada nuevo que aprender.** Todo ya está descubierto:

1. ✅ **Conexión al backend:** Ya lo haces con `$fetch` + `withAuthHeaders()`
2. ✅ **Votación:** Ya está implementada en aporte dinerario
3. ✅ **Estructura:** Ya tienes stores, composables, vistas

**Solo necesitas:**

- Copiar código existente
- Cambiar strings (rutas, contexto)
- Validar un campo más

**No inventes nada.** Todo ya está hecho, solo hay que replicarlo con nombres diferentes.

---

## 📚 REFERENCIAS

### **Código de Aporte Dinerario (Referencia):**

- `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportantesPage.ts`
- `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aporte-dinerario/composables/useAportesPage.ts`
- `app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/aportes/stores/useAportesManagerStore.ts`
- `app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/composables/useVotacionController.ts`

### **Documentación:**

- `docs/backend/aporte-dinerario/CONEXION-BACKEND-APORTE-DINERARIO.md`
- `docs/backend/aporte-dinerario/ANALISIS-COMPARATIVO-APORTE-DINERARIO-CAPITALIZACION.md`

---

**✅ Todo listo para implementar. No hay sorpresas, solo trabajo mecánico.** 🚀
