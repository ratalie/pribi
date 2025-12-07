# ✅ RESUMEN: Corrección de Fetches en Votaciones

## 🎯 Cambios Realizados

### **1. Eliminado creación automática de votación**
- ❌ **ANTES:** `loadData()` creaba la votación automáticamente si no existía
- ✅ **AHORA:** `loadData()` solo carga datos (GET), NO crea votación

### **2. Eliminados fetches en interacciones de UI**
- ❌ **ANTES:** `cambiarTipoAprobacion()` era async y hacía PUT al backend
- ✅ **AHORA:** `cambiarTipoAprobacion()` solo actualiza estado local (síncrono)

- ❌ **ANTES:** `setVoto()` podía hacer fetches
- ✅ **AHORA:** `setVoto()` solo actualiza estado local (síncrono)

### **3. Guardado solo en "Siguiente"**
- ✅ **AHORA:** `guardarVotacion()` se ejecuta SOLO cuando el usuario hace click en "Siguiente"
- ✅ **Lógica:**
  - Si es unanimidad: genera todos los votos a favor automáticamente
  - Si es sometida a votos: usa los votos que el usuario haya seleccionado
  - Crea o actualiza la votación en el backend

---

## 📋 Flujo Actual

### **Al Montar la Vista:**
1. ✅ GET `/snapshot` - Cargar snapshot
2. ✅ GET `/attendance` - Cargar asistentes
3. ✅ GET `/participants` - Cargar participantes
4. ✅ GET `/contributions` - Cargar contribuciones
5. ✅ GET `/votes?contexto=APORTES_DINERARIOS` - Cargar votación existente (si existe)
6. ✅ Calcular datos (capital antes/después, texto de votación)

**Total: 5 GETs al montar**

### **Al Interactuar con la UI:**
- ✅ Cambiar de unanimidad a mayoría: **NO hace fetch** (solo actualiza estado local)
- ✅ Cambiar votos: **NO hace fetch** (solo actualiza estado local)

### **Al Hacer Click en "Siguiente":**
1. ✅ Generar votos si es unanimidad (todos a favor)
2. ✅ POST `/votes` o PUT `/votes` - Crear o actualizar votación
3. ✅ PUT `/votes` (múltiples) - Agregar/actualizar votos si es necesario

**Total: 1-2 requests al guardar**

---

## 🔧 Archivos Modificados

1. **`app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/composables/useVotacionController.ts`**
   - `loadData()`: Eliminada creación automática
   - `cambiarTipoAprobacion()`: Ahora es síncrono, solo actualiza estado local
   - `setVoto()`: Ahora es síncrono, solo actualiza estado local
   - `guardarVotacion()`: Reescrito completamente para guardar solo en "Siguiente"

2. **`app/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore.ts`**
   - `createVotacion()`: Usa sesión en memoria (con votos si los hay)

3. **`app/core/hexag/juntas/infrastructure/mappers/vote.mapper.ts`**
   - `toCreateRequestDto()`: Envía votos si los hay (tanto unanimidad como mayoría)

---

## ✅ Comportamiento Esperado

### **Unanimidad:**
1. Usuario selecciona "Unanimidad" → Solo actualiza estado local
2. Usuario hace click en "Siguiente" → Genera todos los votos a favor automáticamente
3. Envía POST/PUT con `tipoAprobacion: "APROBADO_POR_TODOS"` y todos los votos a favor

### **Sometida a Votación:**
1. Usuario selecciona "Mayoría" → Solo actualiza estado local
2. Usuario vota en la tabla → Solo actualiza estado local
3. Usuario hace click en "Siguiente" → Envía POST/PUT con `tipoAprobacion: "SOMETIDO_A_VOTACION"` y los votos seleccionados

---

## 🐛 Problema Pendiente: Backend rechaza `votos: []`

**Solución temporal:** No enviar `votos` si está vacío (solo enviar si hay votos).

**Pregunta para backend:** ¿Qué hacer cuando es unanimidad?
- Opción A: No enviar campo `votos`
- Opción B: Enviar `votos: []` y backend debe aceptarlo
- Opción C: Enviar votos con todos a favor (actual)

**Estado actual:** Opción C (enviar todos los votos a favor para unanimidad)

