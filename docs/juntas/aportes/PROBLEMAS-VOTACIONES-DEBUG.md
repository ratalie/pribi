# 🐛 PROBLEMAS IDENTIFICADOS: Votaciones Aporte Dinerario

## 📋 Resumen de Errores

### **Error 1: Backend rechaza `votos: []` al crear item**

**Request enviado:**
```json
{
  "contexto": "APORTES_DINERARIOS",
  "items": [{
    "accion": "add",
    "id": "4d52510c-e6a9-4e8b-9646-78d768a11895",
    "orden": 0,
    "label": "Se aprueba el aumento de capital...",
    "descripción": "Votación sobre la aprobación...",
    "tipoAprobacion": "APROBADO_POR_TODOS",
    "votos": []  // ❌ Backend rechaza esto
  }]
}
```

**Error del backend:**
```json
{
  "success": false,
  "message": "Error de validación",
  "data": {
    "items.0.votos": "Array must contain at least 1 element(s)"
  },
  "code": 422
}
```

**Pregunta para el backend:**
- ¿Si `tipoAprobacion: "APROBADO_POR_TODOS"` (unanimidad), el array `votos` puede estar vacío?
- ¿O debe no enviarse el campo `votos` cuando es unanimidad?
- ¿O debe enviarse `votos: []` pero el backend debe aceptarlo para unanimidad?

---

### **Error 2: Props incorrectas en la página**

**Warnings:**
```
[Vue warn]: Property "isLoading" was accessed during render but is not defined on instance.
[Vue warn]: Property "error" was accessed during render but is not defined on instance.
[Vue warn]: Invalid prop: type check failed for prop "votantes". Expected Array, got Object
[Vue warn]: Invalid prop: type check failed for prop "textoVotacion". Expected String, got Object
```

**Causa:** Los computed del controller están siendo pasados directamente sin `.value`

---

### **Error 3: No se muestran los accionistas en la tabla**

**Logs:**
```
[MayoriaVotacion] No hay votantes ni accionistas
[DEBUG][VotacionController] Votantes filtrados: Array(2)  // ✅ Hay 2 votantes
```

**Causa:** El componente recibe `votantes` como ComputedRef (objeto) en lugar de Array

---

### **Error 4: No funciona cambiar entre unanimidad y mayoría**

**Error:**
```
[Controller][Votacion] No hay item de votación, creando uno...
```

**Causa:** Cuando se intenta cambiar el tipo, no hay item porque:
1. El GET devuelve `items: []`
2. El intento de crear el item falla con 422
3. Por lo tanto, `itemVotacion` es `null`

---

## 🔍 Archivos a Revisar

### **Frontend:**
1. `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/aporte-dinerario/votacion.vue`
   - Props `isLoading` y `error` no están en el return del controller
   - Props `votantes` y `textoVotacion` están pasando ComputedRef en lugar de valores

2. `app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/composables/useVotacionController.ts`
   - Return no incluye `isLoading` y `error`
   - `votantes` y `textoVotacion` son computed pero se pasan directamente

3. `app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore.ts`
   - `addVoteItem` envía `votos: []` que el backend rechaza

4. `app/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MayoriaVotacion.vue`
   - Recibe `votantes` como ComputedRef pero espera Array

---

## ❓ Preguntas para el Backend

### **Pregunta 1: Validación de `votos` en `accion: "add"` - CRÍTICO**

**Contexto:** Cuando se crea un item de votación con `tipoAprobacion: "APROBADO_POR_TODOS"` (unanimidad), no debería haber votos individuales.

**Error actual:**
```json
Request: {
  "accion": "add",
  "tipoAprobacion": "APROBADO_POR_TODOS",
  "votos": []
}

Response: 422
{
  "items.0.votos": "Array must contain at least 1 element(s)"
}
```

**Pregunta:**
- ¿El campo `votos` es obligatorio en `accion: "add"`?
- Si `tipoAprobacion: "APROBADO_POR_TODOS"`, ¿puede `votos: []` estar vacío?
- ¿O no debe enviarse el campo `votos` cuando es unanimidad?

**Opciones:**
```json
// Opción A: votos vacío permitido (backend debe aceptar)
{
  "accion": "add",
  "tipoAprobacion": "APROBADO_POR_TODOS",
  "votos": []  // ¿Debe ser permitido?
}

// Opción B: votos no se envía (frontend no envía el campo)
{
  "accion": "add",
  "tipoAprobacion": "APROBADO_POR_TODOS"
  // Sin campo votos
}

// Opción C: votos con al menos 1 elemento siempre (no tiene sentido para unanimidad)
{
  "accion": "add",
  "tipoAprobacion": "APROBADO_POR_TODOS",
  "votos": [{ ... }]  // ¿Obligatorio siempre?
}
```

**⚠️ NECESITO RESPUESTA URGENTE:** ¿Cuál es la opción correcta?

---

### **Pregunta 2: Crear item cuando sesión existe pero `items: []`**

**Contexto:** El GET devuelve:
```json
{
  "id": "019af88a-9ebd-76e2-b111-7e5c931ea86a",
  "modo": "SIMPLE",
  "items": []  // Vacío
}
```

**Pregunta:**
- ¿Es válido que una sesión exista sin items?
- ¿Debo usar `accion: "add"` para crear el item?
- ¿O debo usar `POST /votes` para crear la sesión completa desde cero?

---

### **Pregunta 3: Default de `tipoAprobacion`**

**Pregunta:**
- ¿Cuál es el valor por defecto de `tipoAprobacion` cuando se crea una votación?
- ¿Debe ser `APROBADO_POR_TODOS` (unanimidad) o `SOMETIDO_A_VOTACION` (mayoría)?

---

## 🛠️ Correcciones Necesarias en Frontend

1. ✅ Corregir props en `votacion.vue` (usar `.value` en computed)
2. ✅ Agregar `isLoading` y `error` al return del controller
3. ✅ Manejar `votos: []` según respuesta del backend
4. ✅ Agregar más logs para debuggear
5. ✅ Corregir paso de props a componentes hijos

