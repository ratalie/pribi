# 🔍 ANÁLISIS: Error de Estructura en Votos

## 📋 Problema Reportado

**Request enviado:**
```json
PUT /api/v2/society-profile/5/register-assembly/2/votes

{
  "contexto": "APORTES_DINERARIOS",
  "items": [{
    "accion": "add",
    "id": "069a2235-4c1c-4457-b1ef-4647d825282c",
    "orden": 0,
    "label": "Se aprueba el aumento...",
    "descripción": "Votación sobre...",
    "tipoAprobacion": "SOMETIDO_A_VOTACION",
    "votos": [
      {
        "accion": "addVote",  // ❌ INCORRECTO
        "id": "fb697eda-f370-413c-b1ef-cfb19a80b328",
        "itemId": "069a2235-4c1c-4457-b1ef-4647d825282c",  // ❌ INCORRECTO
        "voterPersonId": "019af8bf-460b-7077-9e0b-4f7b0bf5fc29",  // ❌ INCORRECTO
        "value": "A_FAVOR"  // ❌ INCORRECTO
      }
    ]
  }]
}
```

**Error recibido:**
```json
{
  "success": false,
  "message": "Error de validación",
  "data": {
    "items.0.votos.0.accionistaId": "Required",
    "items.0.votos.0.valor": "Invalid input",
    "items.0.votos.1.accionistaId": "Required",
    "items.0.votos.1.valor": "Invalid input"
  },
  "code": 422
}
```

---

## 🎯 Análisis del Problema

### **Estructura Esperada por el Backend**

Cuando se usa `accion: "add"` en un item, el backend espera que `votos` sea un array de `VoteEntrySchema`:

**Schema esperado (`VoteEntrySchema`):**
```typescript
{
  id: string;           // UUID del voto
  personaId: string;   // ✅ ID del accionista (ShareholderV2.id)
  valor: 'A_FAVOR' | 'EN_CONTRA' | 'ABSTENCION' | number;  // ✅ Valor del voto
}
```

**Estructura enviada por el frontend:**
```typescript
{
  accion: "addVote",      // ❌ No debe estar aquí
  id: string;
  itemId: string;         // ❌ No debe estar aquí
  voterPersonId: string;  // ❌ Debe ser "personaId"
  value: string;          // ❌ Debe ser "valor"
}
```

---

## 🔍 Responsabilidad del Error

### **❌ PROBLEMA DEL FRONTEND (100%)**

**Razón:**
1. El frontend está usando la estructura de `VoteOperationSchema` (que se usa en `accion: "updateVote"`)
2. Pero cuando se usa `accion: "add"` en el item, debe usar `VoteEntrySchema` (estructura más simple)
3. Los campos están mal nombrados: `voterPersonId` → `personaId`, `value` → `valor`
4. Campos innecesarios: `accion`, `itemId` no deben estar en los votos cuando están dentro de `accion: "add"`

---

## 📊 Comparación de Estructuras

### **Estructura 1: `VoteEntrySchema` (para `accion: "add"` en item)**

**Cuándo se usa:**
- Cuando se crea un item con `accion: "add"` y se incluyen votos iniciales
- Cuando se crea una sesión completa con `POST /votes`

**Estructura:**
```json
{
  "votos": [
    {
      "id": "uuid-del-voto",
      "accionistaId": "uuid-del-accionista",  // ✅ ID del accionista (ShareholderV2.id)
      "valor": "A_FAVOR"  // ✅ Valor del voto
    }
  ]
}
```

**Schema:**
```typescript
export const VoteEntrySchema = z.object({
  id: z.string().uuid(),
  accionistaId: z.string().uuid(),  // ID del accionista (ShareholderV2.id)
  valor: z.union([
    z.enum(['A_FAVOR', 'EN_CONTRA', 'ABSTENCION']),
    z.number().positive().int().min(0),
  ]),
});
```

---

### **Estructura 2: `VoteOperationSchema` (para `accion: "updateVote"` en item)**

**Cuándo se usa:**
- Cuando se actualiza votos de un item existente con `accion: "updateVote"`

**Estructura:**
```json
{
  "accion": "updateVote",
  "itemId": "uuid-del-item",
  "votos": [
    {
      "accion": "addVote",
      "id": "uuid-del-voto",
      "itemId": "uuid-del-item",
      "accionistaId": "uuid-del-accionista",  // ✅ ID del accionista (ShareholderV2.id)
      "value": "A_FAVOR"  // ✅ Valor del voto
    }
  ]
}
```

**Schema:**
```typescript
const addVote = z.object({
  accion: z.literal('addVote'),
  itemId: z.string().uuid(),
  id: z.string().uuid(),
  accionistaId: z.string().uuid(),  // ID del accionista (ShareholderV2.id)
  value: z.string().min(1),
});
```

---

## ✅ Solución para el Frontend

### **Request Correcto:**

```json
PUT /api/v2/society-profile/5/register-assembly/2/votes

{
  "contexto": "APORTES_DINERARIOS",
  "items": [{
    "accion": "add",
    "id": "069a2235-4c1c-4457-b1ef-4647d825282c",
    "orden": 0,
    "label": "Se aprueba el aumento...",
    "descripción": "Votación sobre...",
    "tipoAprobacion": "SOMETIDO_A_VOTACION",
    "votos": [
      {
        "id": "fb697eda-f370-413c-b1ef-cfb19a80b328",
        "accionistaId": "019af8bf-460b-7077-9e0b-4f7b0bf5fc29",  // ✅ Cambiado de voterPersonId
        "valor": "A_FAVOR"  // ✅ Cambiado de value
      },
      {
        "id": "97f63565-270f-451b-87b1-9a515f2139f1",
        "accionistaId": "019af8bf-460b-7077-9e0b-54867710026b",  // ✅ Cambiado de voterPersonId
        "valor": "A_FAVOR"  // ✅ Cambiado de value
      }
    ]
  }]
}
```

**Cambios necesarios:**
1. ❌ Eliminar `accion: "addVote"` de cada voto
2. ❌ Eliminar `itemId` de cada voto
3. ✅ Cambiar `voterPersonId` → `accionistaId` (semánticamente correcto)
4. ✅ Cambiar `value` → `valor`

---

## 📝 Resumen de Responsabilidades

| Aspecto | Responsable | Estado |
|---------|-------------|--------|
| **Estructura de votos en `accion: "add"`** | Frontend | ❌ **INCORRECTO** |
| **Nombres de campos (`accionistaId` vs `voterPersonId`)** | Frontend | ❌ **INCORRECTO** |
| **Nombres de campos (`valor` vs `value`)** | Frontend | ❌ **INCORRECTO** |
| **Campos innecesarios (`accion`, `itemId`)** | Frontend | ❌ **INCORRECTO** |
| **Schema del backend** | Backend | ✅ **CORRECTO** |
| **Validación del backend** | Backend | ✅ **CORRECTO** |

---

## 🎯 Conclusión

**Responsable:** ❌ **FRONTEND (100%)**

**Problema:**
- El frontend está usando la estructura incorrecta para los votos cuando se usa `accion: "add"` en el item
- Está mezclando la estructura de `VoteOperationSchema` (para `updateVote`) con `VoteEntrySchema` (para `add`)

**Solución:**
- Usar `VoteEntrySchema` cuando se crea un item con `accion: "add"`
- Usar `VoteOperationSchema` solo cuando se actualiza votos con `accion: "updateVote"`

**Nota importante:**
- `accionistaId` en ambos casos se refiere al **ID del accionista** (`ShareholderV2.id`), NO al ID de la persona (`PersonV2.id`)
- Esto es semánticamente correcto y consistente en ambos schemas
- ✅ **Cambio aplicado:** Se cambió `personaId` → `accionistaId` para mayor claridad semántica

---

## 📚 Referencias

- **VoteEntrySchema:** `src/modules/flows-v2/shared/vote/vote.dto.ts` línea 4-11
- **VoteOperationSchema:** `src/modules/flows-v2/shared/vote/commands/update-vote/update-vote.dto.ts` línea 6-12
- **Handler add:** `src/modules/flows-v2/shared/vote/commands/update-vote/update-vote.handler.ts` línea 32-50

