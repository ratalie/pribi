# ✅ CAMBIO: `personaId` → `accionistaId` en Votaciones

## 📋 Resumen del Cambio

Se ha cambiado el nombre del campo en los DTOs de votos de `personaId` a `accionistaId` para mayor claridad semántica.

**Razón:** El campo siempre se refería al ID del accionista (`ShareholderV2.id`), no al ID de la persona (`PersonV2.id`). El nombre `accionistaId` es más descriptivo y evita confusiones.

---

## 🔄 Cambios Realizados

### **1. `VoteEntrySchema` (para `accion: "add"` en item)**

**Antes:**
```typescript
export const VoteEntrySchema = z.object({
  id: z.string().uuid(),
  personaId: z.string().uuid(),  // ❌ Confuso
  valor: z.union([...]),
});
```

**Después:**
```typescript
export const VoteEntrySchema = z.object({
  id: z.string().uuid(),
  accionistaId: z.string().uuid(),  // ✅ Semánticamente correcto
  valor: z.union([...]),
});
```

**Archivos modificados:**
- `src/modules/flows-v2/shared/vote/vote.dto.ts`
- `src/modules/flows-v2/shared/vote/commands/create-vote/create-vote.dto.ts`

---

### **2. `VoteOperationSchema` (para `accion: "updateVote"` en item)**

**Antes:**
```typescript
const addVote = z.object({
  accion: z.literal('addVote'),
  itemId: z.string().uuid(),
  id: z.string().uuid(),
  voterPersonId: z.string().uuid(),  // ❌ Confuso
  value: z.string().min(1),
});
```

**Después:**
```typescript
const addVote = z.object({
  accion: z.literal('addVote'),
  itemId: z.string().uuid(),
  id: z.string().uuid(),
  accionistaId: z.string().uuid(),  // ✅ Semánticamente correcto
  value: z.string().min(1),
});
```

**Archivos modificados:**
- `src/modules/flows-v2/shared/vote/commands/update-vote/update-vote.dto.ts`

---

### **3. Handlers y Mappers**

**Archivos actualizados:**
- `src/modules/flows-v2/shared/vote/vote.mapper.ts`
- `src/modules/flows-v2/shared/vote/commands/update-vote/update-vote.handler.ts`
- `src/modules/flows-v2/shared/vote/querys/get-all-votes/get-all-votes.handler.ts`

**Cambios:**
- `vote.personaId` → `vote.accionistaId`
- `vote.voterPersonId` → `vote.accionistaId`
- Respuesta GET ahora retorna `accionistaId` en lugar de `personaId`

---

## 📝 Estructura Correcta para el Frontend

### **Request: Crear item con votos (`accion: "add"`)**

```json
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes

{
  "contexto": "APORTES_DINERARIOS",
  "items": [{
    "accion": "add",
    "id": "uuid-del-item",
    "orden": 0,
    "label": "Se aprueba el aumento...",
    "descripción": "Votación sobre...",
    "tipoAprobacion": "SOMETIDO_A_VOTACION",
    "votos": [
      {
        "id": "uuid-del-voto",
        "accionistaId": "uuid-del-accionista",  // ✅ ID del accionista (ShareholderV2.id)
        "valor": "A_FAVOR"
      }
    ]
  }]
}
```

---

### **Request: Actualizar votos (`accion: "updateVote"`)**

```json
PUT /api/v2/society-profile/:societyId/register-assembly/:flowId/votes

{
  "contexto": "APORTES_DINERARIOS",
  "items": [{
    "accion": "updateVote",
    "itemId": "uuid-del-item",
    "votos": [
      {
        "accion": "addVote",
        "id": "uuid-del-voto",
        "itemId": "uuid-del-item",
        "accionistaId": "uuid-del-accionista",  // ✅ ID del accionista (ShareholderV2.id)
        "value": "A_FAVOR"
      }
    ]
  }]
}
```

---

### **Response: Obtener votación (GET)**

```json
GET /api/v2/society-profile/:societyId/register-assembly/:flowId/votes?contexto=APORTES_DINERARIOS

{
  "success": true,
  "data": {
    "id": "uuid-sesion",
    "modo": "SIMPLE",
    "items": [
      {
        "id": "uuid-item",
        "orden": 0,
        "label": "Se aprueba...",
        "descripción": "...",
        "personaId": null,  // ⚠️ Este es diferente: asocia el item a una persona (opcional)
        "tipoAprobacion": "SOMETIDO_A_VOTACION",
        "votos": [
          {
            "id": "uuid-voto",
            "accionistaId": "uuid-del-accionista",  // ✅ ID del accionista que votó
            "valor": "A_FAVOR"
          }
        ]
      }
    ]
  }
}
```

**Nota:** En la respuesta, `personaId` del item es diferente a `accionistaId` del voto:
- `item.personaId`: Asocia el item completo a una persona (opcional, para casos especiales)
- `voto.accionistaId`: Identifica qué accionista emitió ese voto específico

---

## ⚠️ Nota Importante

**NO confundir:**
- `VoteItemSchema.personaId` (opcional): Asocia el item completo a una persona. **NO se cambió** porque es para otra cosa.
- `VoteEntrySchema.accionistaId`: Identifica qué accionista emitió el voto. **SÍ se cambió** de `personaId` a `accionistaId`.

---

## ✅ Checklist de Actualización Frontend

- [ ] Cambiar `personaId` → `accionistaId` en votos cuando se usa `accion: "add"`
- [ ] Cambiar `voterPersonId` → `accionistaId` en votos cuando se usa `accion: "updateVote"`
- [ ] Actualizar tipos TypeScript para reflejar el cambio
- [ ] Actualizar mappers del frontend
- [ ] Actualizar componentes que muestren o usen estos campos
- [ ] Verificar que se usa `accionista.id` (ShareholderV2.id) y NO `accionista.person.id` (PersonV2.id)

---

## 📚 Referencias

- **VoteEntrySchema:** `src/modules/flows-v2/shared/vote/vote.dto.ts`
- **VoteOperationSchema:** `src/modules/flows-v2/shared/vote/commands/update-vote/update-vote.dto.ts`
- **Documentación completa:** [`ANALISIS-ERROR-ESTRUCTURA-VOTOS.md`](./ANALISIS-ERROR-ESTRUCTURA-VOTOS.md)

---

**Fecha de cambio:** 7 de diciembre de 2025  
**Estado:** ✅ **COMPLETADO**

