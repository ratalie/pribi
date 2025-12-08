# ✅ SOLUCIÓN: Un Solo Fetch al Guardar

## 🎯 Problema Identificado

**Antes:** Se enviaban **múltiples requests** al hacer click en "Siguiente":
1. `createVotacion()` → POST
2. Loop de `addOrUpdateVote()` → Múltiples PUTs

O si existía:
1. `updateTipoAprobacion()` → PUT con `accion: "update"`
2. Loop de `addOrUpdateVote()` → Múltiples PUTs

**Según diagnóstico:** El backend no crea el item cuando se usa `accion: "update"` y el item no existe.

---

## ✅ Solución Implementada

### **1. Nuevas Funciones en el Store**

#### **`addVoteItemConVotos()`**
- **Propósito:** Agregar item con votos en un solo request
- **Método:** PUT con `accion: "add"`
- **Payload:** Item + votos en un solo objeto

```typescript
{
  accion: "add",
  id: itemId,
  orden: 0,
  label: "...",
  descripción: "...",
  tipoAprobacion: "APROBADO_POR_TODOS" | "SOMETIDO_A_VOTACION",
  votos: [
    {
      accion: "addVote",
      id: voteId,
      itemId: itemId,
      voterPersonId: accionistaId,
      value: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION"
    }
  ]
}
```

#### **`updateItemConVotos()`**
- **Propósito:** Actualizar item existente con votos en un solo request
- **Método:** PUT con `accion: "add"` (reemplaza todo el item)
- **Payload:** Item + votos en un solo objeto

---

### **2. Lógica en `guardarVotacion()`**

```typescript
if (!existeEnBackend) {
  // ✅ POST con item + votos (createVotacion ya incluye votos)
  await votacionStore.createVotacion(...);
} else if (!itemExisteEnBackend) {
  // ✅ PUT con accion: "add" + votos (un solo request)
  await votacionStore.addVoteItemConVotos(...);
} else {
  // ✅ PUT con accion: "add" + votos (un solo request, reemplaza todo)
  await votacionStore.updateItemConVotos(...);
}
```

---

## 📋 Flujo Actual

### **Al Hacer Click en "Siguiente":**

1. ✅ Generar votos si es unanimidad (todos a favor)
2. ✅ **Un solo request:**
   - Si no existe: POST con item + votos
   - Si existe pero sin item: PUT con `accion: "add"` + votos
   - Si existe con item: PUT con `accion: "add"` + votos (reemplaza)

**Total: 1 request al guardar** ✅

---

## 🔧 Archivos Modificados

1. **`app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore.ts`**
   - ✅ Agregada `addVoteItemConVotos()` - Un solo request con item + votos
   - ✅ Agregada `updateItemConVotos()` - Un solo request para actualizar todo
   - ⚠️ `updateTipoAprobacion()` marcada como DEPRECATED

2. **`app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/composables/useVotacionController.ts`**
   - ✅ `guardarVotacion()` ahora usa las nuevas funciones
   - ✅ Eliminado loop de `addOrUpdateVote()`
   - ✅ Eliminado `updateTipoAprobacion()` separado

---

## ✅ Comportamiento Esperado

### **Caso 1: Nueva Votación (Unanimidad)**
1. Usuario selecciona "Unanimidad"
2. Usuario hace click en "Siguiente"
3. ✅ **1 POST** con:
   - Item con `tipoAprobacion: "APROBADO_POR_TODOS"`
   - Votos: todos los votantes con `valor: "A_FAVOR"`

### **Caso 2: Nueva Votación (Mayoría)**
1. Usuario selecciona "Mayoría"
2. Usuario vota en la tabla
3. Usuario hace click en "Siguiente"
4. ✅ **1 POST** con:
   - Item con `tipoAprobacion: "SOMETIDO_A_VOTACION"`
   - Votos: los votos que el usuario seleccionó

### **Caso 3: Votación Existente (Actualizar)**
1. Usuario cambia votos o tipo de aprobación
2. Usuario hace click en "Siguiente"
3. ✅ **1 PUT** con `accion: "add"` que incluye:
   - Item actualizado
   - Todos los votos (reemplaza los anteriores)

---

## 🐛 Nota sobre Backend

Según el diagnóstico:
- `accion: "update"` no crea el item si no existe
- `accion: "add"` puede crear o reemplazar el item

**Solución:** Usar siempre `accion: "add"` cuando se incluyen votos, incluso para actualizar.

---

## ✅ Checklist de Verificación

- [x] Eliminado loop de `addOrUpdateVote()`
- [x] Eliminado `updateTipoAprobacion()` separado
- [x] Creado `addVoteItemConVotos()` - Un solo request
- [x] Creado `updateItemConVotos()` - Un solo request
- [x] `guardarVotacion()` ahora envía 1 request máximo
- [x] POST incluye votos cuando se crea nueva sesión
- [x] PUT incluye votos cuando se actualiza

---

## 🎯 Resultado Final

**Antes:** 2-5 requests al guardar  
**Ahora:** **1 request al guardar** ✅

