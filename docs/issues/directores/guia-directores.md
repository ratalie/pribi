# 🗳️ GUÍA COMPLETA: CÓMO ACTUALIZAR VOTOS DE DIRECTORES

**Versión:** 1.0  
**Fecha:** 2025-01-19  
**Estado:** ✅ **Documentación Completa**

---

## 📋 RESUMEN RÁPIDO

**⚠️ IMPORTANTE:** Para actualizar votos, **NO uses `accion: "update"` con votos**. En su lugar, usa `accion: "updateVote"` con operaciones específicas para cada voto.

---

## 🎯 PROBLEMA COMÚN: VOTOS DUPLICADOS

### **❌ INCORRECTO - Esto crea votos duplicados:**

```typescript
// ❌ NO HACER ESTO
PUT /api/v2/society-profile/11/register-assembly/7/votes
{
  "contexto": "DESIGNACION_DIRECTORES",
  "items": [
    {
      "accion": "update", // ← Esto NO procesa votos
      "id": "44d96d32-17b5-4330-9a0f-37bd91c2c75e",
      "orden": 0,
      "label": "Yull1 Gasdfar Zambrano",
      "votos": [ // ← Estos votos NO se procesan con "update"
        {
          "id": "nuevo-id",
          "accionistaId": "019b37cb-29c5-719c-80d8-c3638d5350cb",
          "valor": 100
        }
      ]
    }
  ]
}
```

### **✅ CORRECTO - Usar `updateVote` con operaciones específicas:**

```typescript
// ✅ CORRECTO
PUT /api/v2/society-profile/11/register-assembly/7/votes
{
  "contexto": "DESIGNACION_DIRECTORES",
  "items": [
    {
      "accion": "updateVote", // ← Usar esta acción para actualizar votos
      "itemId": "44d96d32-17b5-4330-9a0f-37bd91c2c75e",
      "votos": [
        {
          "accion": "addVote", // ← Agregar nuevo voto
          "itemId": "44d96d32-17b5-4330-9a0f-37bd91c2c75e",
          "id": "nuevo-voto-id",
          "accionistaId": "019b37cb-29c5-719c-80d8-c3638d5350cb",
          "value": "100" // ← String, no número
        },
        {
          "accion": "updateVote", // ← Actualizar voto existente
          "id": "9c9b7f5b-01ac-425f-a71c-a2b3700fec59",
          "value": "150" // ← Nuevo valor
        },
        {
          "accion": "removeVote", // ← Eliminar voto
          "id": "7419f592-e8fe-44fa-bedc-09f5c369ca17"
        }
      ]
    }
  ]
}
```

---

## 📊 ESTRUCTURA COMPLETA DEL PAYLOAD

### **1. Actualizar Item (sin votos)**

```json
{
  "contexto": "DESIGNACION_DIRECTORES",
  "items": [
    {
      "accion": "update",
      "id": "44d96d32-17b5-4330-9a0f-37bd91c2c75e",
      "orden": 0,
      "label": "Yull1 Gasdfar Zambrano (actualizado)",
      "descripcion": "Nueva descripción",
      "tipoAprobacion": "SOMETIDO_A_VOTACION"
    }
  ]
}
```

**✅ Usa esto para:** Actualizar solo el label, orden, descripción o tipoAprobación del item.

**❌ NO incluye:** Votos (no se procesan)

---

### **2. Actualizar Votos de un Item**

```json
{
  "contexto": "DESIGNACION_DIRECTORES",
  "items": [
    {
      "accion": "updateVote",
      "itemId": "44d96d32-17b5-4330-9a0f-37bd91c2c75e",
      "votos": [
        {
          "accion": "addVote",
          "itemId": "44d96d32-17b5-4330-9a0f-37bd91c2c75e",
          "id": "nuevo-voto-uuid",
          "accionistaId": "019b37cb-29c5-719c-80d8-c3638d5350cb",
          "value": "100"
        },
        {
          "accion": "updateVote",
          "id": "9c9b7f5b-01ac-425f-a71c-a2b3700fec59",
          "value": "150"
        },
        {
          "accion": "removeVote",
          "id": "7419f592-e8fe-44fa-bedc-09f5c369ca17"
        }
      ]
    }
  ]
}
```

**✅ Usa esto para:** Agregar, actualizar o eliminar votos específicos de un item.

**📝 Campos:**
- **`accion: "updateVote"`**: Acción a nivel de item para actualizar votos
- **`itemId`**: ID del item al que pertenecen los votos
- **`votos`**: Array de operaciones de votos
  - **`accion: "addVote"`**: Agregar nuevo voto
    - **`itemId`**: ID del item (debe coincidir con el itemId del objeto padre)
    - **`id`**: UUID del nuevo voto
    - **`accionistaId`**: ID del accionista (ShareholderV2.id)
    - **`value`**: Valor del voto (string: "100", "0", "A_FAVOR", etc.)
  - **`accion: "updateVote"`**: Actualizar voto existente
    - **`id`**: UUID del voto existente
    - **`value`**: Nuevo valor (string)
  - **`accion: "removeVote"`**: Eliminar voto
    - **`id`**: UUID del voto a eliminar

---

### **3. Agregar Item Completo (con votos iniciales)**

```json
{
  "contexto": "DESIGNACION_DIRECTORES",
  "items": [
    {
      "accion": "add",
      "id": "nuevo-item-uuid",
      "orden": 4,
      "label": "Nuevo Candidato",
      "descripcion": "Descripción del candidato",
      "personaId": "uuid-persona-candidato",
      "tipoAprobacion": "SOMETIDO_A_VOTACION",
      "votos": [
        {
          "id": "voto-1-uuid",
          "accionistaId": "019b37cb-29c5-719c-80d8-c3638d5350cb",
          "valor": 100
        },
        {
          "id": "voto-2-uuid",
          "accionistaId": "019b37cb-29c5-719c-80d8-ca9857a6bfd7",
          "valor": 50
        }
      ]
    }
  ]
}
```

**✅ Usa esto para:** Crear un nuevo item (candidato) con sus votos iniciales.

**⚠️ IMPORTANTE:** Si el item ya existe, esto lo reemplazará completamente.

---

## 🔄 FLUJO RECOMENDADO PARA ACTUALIZAR VOTOS

### **PASO 1: Obtener la votación actual**

```typescript
const response = await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/votes?contexto=DESIGNACION_DIRECTORES`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
);

const data = await response.json();
// data.data.items contiene los items con sus votos actuales
```

---

### **PASO 2: Identificar qué votos agregar/actualizar/eliminar**

```typescript
// Ejemplo: Actualizar el voto del accionista "c3638d5350cb" en el item "44d96d32..."
const itemId = '44d96d32-17b5-4330-9a0f-37bd91c2c75e';
const accionistaId = '019b37cb-29c5-719c-80d8-c3638d5350cb';
const nuevoValor = 150;

// Buscar el voto existente de este accionista
const item = data.data.items.find(i => i.id === itemId);
const votoExistente = item?.votos.find(v => v.accionistaId === accionistaId);

if (votoExistente) {
  // Actualizar voto existente
  return {
    accion: 'updateVote',
    itemId: itemId,
    votos: [
      {
        accion: 'updateVote',
        id: votoExistente.id,
        value: nuevoValor.toString(),
      },
    ],
  };
} else {
  // Agregar nuevo voto
  return {
    accion: 'updateVote',
    itemId: itemId,
    votos: [
      {
        accion: 'addVote',
        itemId: itemId,
        id: generateUUID(),
        accionistaId: accionistaId,
        value: nuevoValor.toString(),
      },
    ],
  };
}
```

---

### **PASO 3: Enviar la actualización**

```typescript
await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/votes`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      contexto: 'DESIGNACION_DIRECTORES',
      items: [
        {
          accion: 'updateVote',
          itemId: itemId,
          votos: [
            {
              accion: votoExistente ? 'updateVote' : 'addVote',
              ...(votoExistente
                ? { id: votoExistente.id, value: nuevoValor.toString() }
                : {
                    itemId: itemId,
                    id: generateUUID(),
                    accionistaId: accionistaId,
                    value: nuevoValor.toString(),
                  }),
            },
          ],
        },
      ],
    }),
  },
);
```

---

## ⚠️ ERRORES COMUNES Y SOLUCIONES

### **Error 1: Votos duplicados**

**Problema:** Cada vez que haces PUT, se crean más votos.

**Causa:** Estás usando `accion: "add"` o `accion: "update"` con votos, lo cual no procesa los votos correctamente.

**Solución:** Usa `accion: "updateVote"` con operaciones específicas (`addVote`, `updateVote`, `removeVote`).

---

### **Error 2: Votos no se actualizan**

**Problema:** Los votos no cambian cuando haces PUT.

**Causa:** Estás usando `accion: "update"` que no procesa votos.

**Solución:** Usa `accion: "updateVote"` para actualizar votos.

---

### **Error 3: Valor debe ser string**

**Problema:** Error de validación al enviar números.

**Causa:** El campo `value` en `addVote` y `updateVote` debe ser string.

**Solución:** Convierte números a string: `value: "100"` en lugar de `value: 100`.

---

## 📝 EJEMPLO COMPLETO: ACTUALIZAR TODOS LOS VOTOS DE UN ITEM

```typescript
// Supongamos que quieres reemplazar todos los votos de un item
const itemId = '44d96d32-17b5-4330-9a0f-37bd91c2c75e';
const nuevosVotos = [
  {
    accionistaId: '019b37cb-29c5-719c-80d8-c3638d5350cb',
    valor: 200,
  },
  {
    accionistaId: '019b37cb-29c5-719c-80d8-ca9857a6bfd7',
    valor: 100,
  },
];

// 1. Obtener votos actuales
const currentData = await getVotes(societyId, flowId);
const currentItem = currentData.items.find(i => i.id === itemId);

// 2. Construir operaciones: eliminar todos los votos existentes y agregar los nuevos
const operaciones = [
  // Eliminar todos los votos existentes
  ...currentItem.votos.map(voto => ({
    accion: 'removeVote',
    id: voto.id,
  })),
  // Agregar nuevos votos
  ...nuevosVotos.map(voto => ({
    accion: 'addVote',
    itemId: itemId,
    id: generateUUID(),
    accionistaId: voto.accionistaId,
    value: voto.valor.toString(),
  })),
];

// 3. Enviar actualización
await fetch(
  `/api/v2/society-profile/${societyId}/register-assembly/${flowId}/votes`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      contexto: 'DESIGNACION_DIRECTORES',
      items: [
        {
          accion: 'updateVote',
          itemId: itemId,
          votos: operaciones,
        },
      ],
    }),
  },
);
```

---

## 🎯 RESUMEN DE ACCIONES

| Acción | Nivel | Propósito | Incluye Votos |
|--------|-------|-----------|---------------|
| **`add`** | Item | Crear nuevo item (candidato) | ✅ Sí (votos iniciales) |
| **`update`** | Item | Actualizar propiedades del item | ❌ No |
| **`remove`** | Item | Eliminar item (soft delete) | ❌ No |
| **`updateVote`** | Item | Actualizar votos del item | ✅ Sí (operaciones de votos) |

| Acción | Nivel | Propósito | Campos Requeridos |
|--------|-------|-----------|-------------------|
| **`addVote`** | Voto | Agregar nuevo voto | `itemId`, `id`, `accionistaId`, `value` |
| **`updateVote`** | Voto | Actualizar voto existente | `id`, `value` |
| **`removeVote`** | Voto | Eliminar voto | `id` |

---

## ✅ CHECKLIST PARA ACTUALIZAR VOTOS

- [ ] 1. Obtener votación actual (GET /votes)
- [ ] 2. Identificar qué votos agregar/actualizar/eliminar
- [ ] 3. Construir payload con `accion: "updateVote"`
- [ ] 4. Para cada voto, usar `addVote`, `updateVote` o `removeVote`
- [ ] 5. Convertir valores numéricos a string (`"100"` en lugar de `100`)
- [ ] 6. Enviar PUT con el payload correcto
- [ ] 7. Verificar que no se crearon votos duplicados

---

## 📚 REFERENCIAS

- **Endpoint:** `PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes`
- **Contexto:** `"DESIGNACION_DIRECTORES"`
- **Modo:** `"CUMULATIVE"` (votos numéricos)

---

**Última actualización:** 2025-01-19  
**Versión del API:** v2



