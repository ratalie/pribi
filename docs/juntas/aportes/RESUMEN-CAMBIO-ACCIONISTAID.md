# ✅ RESUMEN: Cambio `personaId` → `accionistaId` en Votos

## 🎯 Cambio Realizado

**Backend cambió:** `personaId` / `voterPersonId` → `accionistaId` en los votos

**Razón:** Mayor claridad semántica. El campo siempre se refería al ID del accionista (`ShareholderV2.id`), no al ID de la persona (`PersonV2.id`).

---

## 📋 Estructuras Actualizadas

### **1. `VoteEntrySchema` (para `accion: "add"` en item)**

**Estructura correcta:**
```json
{
  "accion": "add",
  "id": "uuid-item",
  "votos": [
    {
      "id": "uuid-voto",
      "accionistaId": "uuid-accionista",  // ✅ Cambiado de personaId
      "valor": "A_FAVOR"  // ✅ "valor" (no "value")
    }
  ]
}
```

**Características:**
- ❌ **NO** incluir `accion` en cada voto
- ❌ **NO** incluir `itemId` en cada voto
- ✅ Usar `accionistaId` (no `personaId` ni `voterPersonId`)
- ✅ Usar `valor` (no `value`)

---

### **2. `VoteOperationSchema` (para `accion: "updateVote"` en item)**

**Estructura correcta:**
```json
{
  "accion": "updateVote",
  "itemId": "uuid-item",
  "votos": [
    {
      "accion": "addVote",
      "id": "uuid-voto",
      "itemId": "uuid-item",
      "accionistaId": "uuid-accionista",  // ✅ Cambiado de voterPersonId
      "value": "A_FAVOR"  // ✅ "value" (no "valor")
    }
  ]
}
```

**Características:**
- ✅ Incluir `accion: "addVote"` en cada voto
- ✅ Incluir `itemId` en cada voto
- ✅ Usar `accionistaId` (no `voterPersonId`)
- ✅ Usar `value` (no `valor`)

---

## 🔧 Archivos Modificados

### **1. DTOs (`app/core/hexag/juntas/application/dtos/vote.dto.ts`)**

- ✅ `VoteEntryDTO`: `personaId` → `accionistaId`
- ✅ `CreateVoteSessionRequestDTO`: `personaId` → `accionistaId` en votos
- ✅ `UpdateVoteSessionRequestDTO`: `voterPersonId` → `accionistaId` en votos

### **2. Mappers (`app/core/hexag/juntas/infrastructure/mappers/vote.mapper.ts`)**

- ✅ `entryFromDto()`: Mapea `accionistaId` directamente (sin conversión)
- ✅ `entryToDto()`: Mapea `accionistaId` directamente (sin conversión)
- ✅ `toCreateRequestDto()`: Usa `accionistaId` en votos

### **3. Store (`app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore.ts`)**

- ✅ `addVoteItemConVotos()`: Usa `VoteEntrySchema` (sin `accion`, sin `itemId`, con `accionistaId` y `valor`)
- ✅ `updateItemConVotos()`: Usa `VoteEntrySchema` (sin `accion`, sin `itemId`, con `accionistaId` y `valor`)
- ✅ `addVote()`: Usa `VoteOperationSchema` (con `accion: "addVote"`, `itemId`, `accionistaId` y `value`)

---

## ⚠️ Nota Importante

**NO confundir:**
- `VoteItem.personaId` (opcional): Asocia el item completo a una persona. **NO se cambió** porque es para otra cosa.
- `VoteEntry.accionistaId`: Identifica qué accionista emitió el voto. **SÍ se cambió** de `personaId` a `accionistaId`.

---

## 📊 Comparación de Estructuras

| Aspecto | `accion: "add"` (VoteEntrySchema) | `accion: "updateVote"` (VoteOperationSchema) |
|---------|-----------------------------------|-----------------------------------------------|
| **`accion` en voto** | ❌ NO | ✅ SÍ (`"addVote"`, `"updateVote"`, `"removeVote"`) |
| **`itemId` en voto** | ❌ NO | ✅ SÍ |
| **Campo ID accionista** | ✅ `accionistaId` | ✅ `accionistaId` |
| **Campo valor** | ✅ `valor` | ✅ `value` |

---

## ✅ Checklist de Verificación

- [x] DTOs actualizados: `personaId` → `accionistaId` en `VoteEntryDTO`
- [x] DTOs actualizados: `voterPersonId` → `accionistaId` en `UpdateVoteSessionRequestDTO`
- [x] Mappers actualizados: mapean `accionistaId` directamente
- [x] `addVoteItemConVotos()`: Usa `VoteEntrySchema` correctamente
- [x] `updateItemConVotos()`: Usa `VoteEntrySchema` correctamente
- [x] `addVote()`: Usa `accionistaId` en lugar de `voterPersonId`
- [x] Eliminadas referencias a `personaId` y `voterPersonId` en votos

---

## 🎯 Resultado Final

**Antes:**
- `personaId` en `VoteEntryDTO` (confuso)
- `voterPersonId` en `UpdateVoteSessionRequestDTO` (confuso)
- Mapeos complejos entre `personaId` y `accionistaId`

**Ahora:**
- ✅ `accionistaId` en todos los DTOs (semánticamente correcto)
- ✅ Mapeos directos sin conversiones
- ✅ Estructura clara y consistente

---

**Fecha de cambio:** 7 de diciembre de 2025  
**Estado:** ✅ **COMPLETADO**

