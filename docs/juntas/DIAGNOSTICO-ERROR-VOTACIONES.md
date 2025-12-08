# 🔍 DIAGNÓSTICO COMPLETO: Error en Votaciones

## 📋 Resumen del Problema

**Error:** `500 Internal Server Error` con mensaje `Item not found`  
**Ubicación:** `VoteSessionEntity.updateVote()` línea 123  
**Contexto:** Segundo PUT request con `accion: "updateVote"`

---

## 🔄 Flujo de Requests

### **Request 1: GET (✅ Funciona)**
```http
GET /api/v2/society-profile/5/register-assembly/2/votes?contexto=APORTES_DINERARIOS
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "019af8bf-4626-76a4-a8f2-4df22a11b47d",
    "modo": "SIMPLE",
    "items": []  // ⚠️ SESIÓN EXISTE PERO SIN ITEMS
  }
}
```

**Estado:** ✅ OK - La sesión existe pero no tiene items cargados en memoria

---

### **Request 2: PUT con `accion: "update"` (✅ Funciona pero NO hace nada)**

```json
PUT /api/v2/society-profile/5/register-assembly/2/votes

{
  "contexto": "APORTES_DINERARIOS",
  "items": [{
    "accion": "update",
    "id": "82a3c818-3de5-4c4a-87a1-1c4ca1859c80",
    "orden": 0,
    "label": "Se aprueba el aumento de capital...",
    "descripción": "Votación sobre la aprobación...",
    "tipoAprobacion": "SOMETIDO_A_VOTACION"
  }]
}
```

**Respuesta:** `200 OK`

**⚠️ PROBLEMA IDENTIFICADO:**

En el handler (`update-vote.handler.ts` líneas 52-63):

```typescript
case 'update':
  const voteItem = session.items.find(i => i.id === item.id);
  if (voteItem) {  // ⚠️ SI EL ITEM NO EXISTE, ESTE BLOQUE NO SE EJECUTA
    session.updateItem(item.id, item.orden, item.label);
    if (item.tipoAprobacion) {
      voteItem.setAgreementType(...);
    }
  }
  break;
```

**Análisis:**
1. `session.items` está vacío (`[]`) porque el GET devolvió `items: []`
2. `session.items.find(i => i.id === item.id)` devuelve `undefined`
3. El bloque `if (voteItem)` NO se ejecuta
4. **El item NO se agrega a la sesión en memoria**
5. El `save()` se ejecuta pero `aggregate.items` está vacío, por lo que no guarda nada

**Resultado:** El item NO se guarda en la base de datos, y NO se agrega a la sesión en memoria.

---

### **Request 3: PUT con `accion: "updateVote"` (❌ FALLA)**

```json
PUT /api/v2/society-profile/5/register-assembly/2/votes

{
  "contexto": "APORTES_DINERARIOS",
  "items": [{
    "accion": "updateVote",
    "itemId": "82a3c818-3de5-4c4a-87a1-1c4ca1859c80",
    "votos": [{
      "accion": "updateVote",
      "id": "6284bb01-2880-4d9e-9dc8-40d1d8ef141e",
      "value": "A_FAVOR"
    }]
  }]
}
```

**Respuesta:** `500 Internal Server Error`

**Error en consola:**
```
Error: Item not found
at VoteSessionEntity.updateVote (/home/yull23/legal-factory/backend/src/modules/flows-v2/shared/vote/domain/entities/vote-session.entity.ts:123:13)
```

**⚠️ PROBLEMA IDENTIFICADO:**

En el handler (`update-vote.handler.ts` líneas 68-84):

```typescript
case 'updateVote':
  for (const vote of item.votos) {
    switch (vote.accion) {
      case 'updateVote':
        session.updateVote(item.itemId, vote.id, vote.value.toString());  // ⚠️ AQUÍ FALLA
        break;
    }
  }
  break;
```

En la entidad (`vote-session.entity.ts` líneas 119-127):

```typescript
updateVote(id: string, voteId: string, value: string) {
  const item = this._items.get(id);  // ⚠️ BUSCA EL ITEM EN MEMORIA
  
  if (!item) {
    throw new Error('Item not found');  // ❌ AQUÍ LANZA EL ERROR
  }
  
  item.updateVote(voteId, value);
}
```

**Análisis:**
1. El handler intenta actualizar un voto en el item `82a3c818-3de5-4c4a-87a1-1c4ca1859c80`
2. `session._items.get(item.itemId)` busca el item en el Map de items en memoria
3. **El item NO existe en memoria** porque:
   - El GET devolvió `items: []`
   - El PUT anterior con `accion: "update"` NO agregó el item a la sesión
4. `this._items.get(id)` devuelve `undefined`
5. Se lanza el error: `Item not found`

---

## 🎯 Responsabilidades Identificadas

### **❌ PROBLEMA DEL BACKEND:**

**1. Handler `update` no crea el item si no existe**

**Ubicación:** `update-vote.handler.ts` líneas 52-63

**Problema:**
- El handler solo actualiza el item si ya existe en memoria
- Si el item no existe, simplemente lo ignora (no lanza error, pero tampoco hace nada)
- **Debería:** Crear el item si no existe, o lanzar un error explícito

**Código actual:**
```typescript
case 'update':
  const voteItem = session.items.find(i => i.id === item.id);
  if (voteItem) {  // ⚠️ Solo ejecuta si existe
    session.updateItem(item.id, item.orden, item.label);
    if (item.tipoAprobacion) {
      voteItem.setAgreementType(...);
    }
  }
  // ⚠️ Si no existe, no hace nada (silenciosamente)
  break;
```

**Solución esperada:**
```typescript
case 'update':
  const voteItem = session.items.find(i => i.id === item.id);
  if (!voteItem) {
    // Opción A: Crear el item si no existe
    session.addItem({ ... });
    // Opción B: Lanzar error explícito
    throw new NotFoundException('Item no encontrado. Use "add" para crear un nuevo item.');
  }
  session.updateItem(item.id, item.orden, item.label);
  if (item.tipoAprobacion) {
    voteItem.setAgreementType(...);
  }
  break;
```

---

**2. Handler `updateVote` no verifica si el item existe antes de usarlo**

**Ubicación:** `update-vote.handler.ts` líneas 68-84

**Problema:**
- El handler asume que el item existe en memoria
- No verifica si el item existe antes de intentar actualizar votos
- **Debería:** Verificar que el item existe, o cargarlo desde la base de datos si no está en memoria

**Código actual:**
```typescript
case 'updateVote':
  for (const vote of item.votos) {
    switch (vote.accion) {
      case 'updateVote':
        session.updateVote(item.itemId, vote.id, vote.value.toString());  // ⚠️ Asume que existe
        break;
    }
  }
  break;
```

**Solución esperada:**
```typescript
case 'updateVote':
  // Verificar que el item existe
  const existingItem = session.items.find(i => i.id === item.itemId);
  if (!existingItem) {
    throw new NotFoundException(`Item con ID ${item.itemId} no encontrado. Debe crear el item primero con "add" o "update".`);
  }
  
  for (const vote of item.votos) {
    switch (vote.accion) {
      case 'updateVote':
        session.updateVote(item.itemId, vote.id, vote.value.toString());
        break;
    }
  }
  break;
```

---

**3. Repository no carga items existentes en la base de datos**

**Ubicación:** `vote-repository.ts` líneas 33-44

**Problema:**
- El `findById()` carga la sesión con `VOTE_SESSION_SELECT`
- `VOTE_SESSION_SELECT` incluye `items` con sus `entries`
- **PERO:** Si el item existe en la BD pero no se carga correctamente, la sesión tendrá `items: []`

**Posible causa:**
- El item puede existir en la BD pero no estar relacionado correctamente
- O el query no está cargando los items correctamente

**Verificación necesaria:**
- Revisar si el item `82a3c818-3de5-4c4a-87a1-1c4ca1859c80` existe en la tabla `VoteItem`
- Verificar que `sessionId` del item coincida con el ID de la sesión

---

### **⚠️ PROBLEMA DEL FRONTEND:**

**1. Envío de dos PUT requests separados**

**Problema:**
- El frontend envía primero un PUT con `accion: "update"` para actualizar el item
- Luego envía otro PUT con `accion: "updateVote"` para actualizar los votos
- **Debería:** Enviar un solo PUT con ambas operaciones, o crear el item primero con `accion: "add"`

**Flujo actual (incorrecto):**
```typescript
// 1. Actualizar item (pero no existe, así que no hace nada)
PUT /votes { items: [{ accion: "update", ... }] }

// 2. Intentar actualizar votos (falla porque el item no existe)
PUT /votes { items: [{ accion: "updateVote", ... }] }
```

**Flujo correcto:**
```typescript
// Opción A: Crear el item primero con "add"
PUT /votes { items: [{ accion: "add", id: "...", votos: [...], ... }] }

// Opción B: Enviar todo en un solo request
PUT /votes { 
  items: [
    { accion: "add", id: "...", votos: [...], ... },
    { accion: "updateVote", itemId: "...", votos: [...] }
  ] 
}
```

---

**2. Uso incorrecto de `accion: "update"` para crear items**

**Problema:**
- El frontend usa `accion: "update"` cuando debería usar `accion: "add"` para crear un nuevo item
- `accion: "update"` está diseñado para actualizar items existentes, no para crearlos

**Solución:**
- Si el item no existe, usar `accion: "add"` con todos los datos necesarios (incluyendo votos si los hay)
- Solo usar `accion: "update"` cuando el item ya existe y solo se quiere cambiar `label`, `orden`, o `tipoAprobacion`

---

## 📊 Análisis de Responsabilidades

| Componente | Responsabilidad | Estado | Problema |
|------------|----------------|--------|----------|
| **Backend Handler `update`** | Actualizar item existente | ❌ **BUG** | No crea el item si no existe, lo ignora silenciosamente |
| **Backend Handler `updateVote`** | Actualizar votos de un item | ❌ **BUG** | No verifica que el item existe antes de usarlo |
| **Backend Repository `findById`** | Cargar sesión con items | ⚠️ **VERIFICAR** | Puede no estar cargando items existentes en BD |
| **Frontend: Flujo de requests** | Enviar datos correctamente | ❌ **INCORRECTO** | Envía dos PUTs separados en lugar de uno |
| **Frontend: Uso de acciones** | Usar `add` vs `update` correctamente | ❌ **INCORRECTO** | Usa `update` cuando debería usar `add` |

---

## 🔧 Soluciones Propuestas

### **Solución 1: Backend - Crear item si no existe en `update`**

**Archivo:** `update-vote.handler.ts`

```typescript
case 'update':
  let voteItem = session.items.find(i => i.id === item.id);
  
  if (!voteItem) {
    // Si el item no existe, crearlo
    session.addItem({
      id: item.id,
      order: item.orden,
      label: item.label,
      description: item.descripción ?? null,
      personId: item.personaId ?? null,
      agreementType: item.tipoAprobacion === 'APROBADO_POR_TODOS'
        ? 'APROVED_BY_ALL'
        : item.tipoAprobacion === 'SOMETIDO_A_VOTACION'
          ? 'SUBMITTED_TO_VOTES'
          : undefined,
      votes: [], // Sin votos iniciales
    });
    voteItem = session.items.find(i => i.id === item.id);
  }
  
  session.updateItem(item.id, item.orden, item.label);
  if (item.tipoAprobacion && voteItem) {
    voteItem.setAgreementType(
      item.tipoAprobacion === 'APROBADO_POR_TODOS'
        ? 'APROVED_BY_ALL'
        : 'SUBMITTED_TO_VOTES',
    );
  }
  break;
```

---

### **Solución 2: Backend - Verificar item antes de `updateVote`**

**Archivo:** `update-vote.handler.ts`

```typescript
case 'updateVote':
  // Verificar que el item existe
  const existingItem = session.items.find(i => i.id === item.itemId);
  if (!existingItem) {
    throw new NotFoundException(
      `Item con ID ${item.itemId} no encontrado. Debe crear el item primero con "add" o "update".`,
    );
  }
  
  for (const vote of item.votos) {
    switch (vote.accion) {
      case 'addVote':
        session.addVote(item.itemId, {
          id: vote.id,
          voterShareholderId: vote.voterPersonId,
          value: vote.value.toString(),
        });
        break;
      case 'removeVote':
        session.removeVote(item.itemId, vote.id);
        break;
      case 'updateVote':
        session.updateVote(item.itemId, vote.id, vote.value.toString());
        break;
      default:
        throw new NotFoundException('Acción no encontrada');
    }
  }
  break;
```

---

### **Solución 3: Frontend - Usar `add` en lugar de `update`**

**Cambio necesario:**

```typescript
// ❌ INCORRECTO
PUT /votes {
  items: [{
    accion: "update",  // ❌ No crea el item si no existe
    id: "...",
    ...
  }]
}

// ✅ CORRECTO
PUT /votes {
  items: [{
    accion: "add",  // ✅ Crea el item si no existe
    id: "...",
    votos: [...],  // Incluir votos si los hay
    ...
  }]
}
```

---

### **Solución 4: Frontend - Enviar todo en un solo request**

**Cambio necesario:**

```typescript
// ❌ INCORRECTO: Dos requests separados
PUT /votes { items: [{ accion: "update", ... }] }
PUT /votes { items: [{ accion: "updateVote", ... }] }

// ✅ CORRECTO: Un solo request con todo
PUT /votes {
  items: [
    {
      accion: "add",
      id: "...",
      votos: [...],  // Incluir votos iniciales
      ...
    }
  ]
}
```

---

## ✅ Checklist de Verificación

### **Backend:**
- [ ] Verificar si el item `82a3c818-3de5-4c4a-87a1-1c4ca1859c80` existe en la tabla `VoteItem`
- [ ] Verificar que `VOTE_SESSION_SELECT` carga correctamente los items
- [ ] Implementar creación de item en `update` si no existe
- [ ] Implementar verificación de item en `updateVote` antes de usarlo
- [ ] Agregar logs para debuggear el flujo

### **Frontend:**
- [ ] Cambiar `accion: "update"` por `accion: "add"` cuando el item no existe
- [ ] Enviar un solo PUT request con todos los datos necesarios
- [ ] Incluir votos en el `add` si los hay
- [ ] Manejar errores cuando el item no existe

---

## 🎯 Conclusión

**Problema Principal:** El backend no crea el item cuando se usa `accion: "update"` y el item no existe, y luego falla cuando se intenta actualizar votos en un item que no existe en memoria.

**Responsabilidades:**
- **Backend (70%):** Debe manejar correctamente el caso cuando el item no existe (crearlo o lanzar error explícito)
- **Frontend (30%):** Debe usar `add` en lugar de `update` para crear items, y enviar un solo request

**Prioridad:** 🔴 **ALTA** - Bloquea la funcionalidad de votaciones

