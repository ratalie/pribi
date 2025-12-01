# 📋 Plan: Historial Híbrido (Selector + Ruta)

## 🎯 Objetivo

Implementar un historial que funcione de dos formas:
1. **Por selector**: Usuario selecciona sociedad desde un dropdown (por defecto null)
2. **Por ruta**: Usuario entra directamente con `societyId` en la URL: `/operaciones/sociedades/30/junta-accionistas/historial`

## ✅ Ventajas de la Solución Híbrida

1. **Flexibilidad**: Funciona tanto con selector como con ruta directa
2. **Compartible**: URLs específicas se pueden compartir
3. **Navegación fluida**: Cambiar selector actualiza la URL (sin re-render completo)
4. **Nuxt optimizado**: Nuxt maneja cambios de query params eficientemente

## 🔍 Cómo Funciona Nuxt con Parámetros

### ✅ NO Re-renderiza Innecesariamente

Nuxt es inteligente con los cambios de ruta:

1. **Cambio de query params** (`?societyId=30`): NO re-renderiza el componente, solo actualiza la ruta
2. **Cambio de path params** (`/sociedades/30/...`): Re-renderiza solo si el componente cambia
3. **watchEffect/watch**: Se ejecutan solo cuando cambian las dependencias reactivas

### Estrategia Recomendada

Usar **query params** para el selector, NO path params:

```
/operaciones/sociedades/:societyId/junta-accionistas/historial?societyId=30
```

**Ventajas:**
- Cambiar selector → actualiza query param → NO re-renderiza
- Entrar por ruta directa → lee query param → carga datos
- Compatible con ambos enfoques

## 📊 Implementación

### Opción 1: Query Params (Recomendada) ⭐

**Ruta base:**
```
/operaciones/sociedades/:societyId/junta-accionistas/historial
```

**Con selector:**
- URL: `/operaciones/sociedades/:societyId/junta-accionistas/historial` (societyId opcional o null)
- Selector cambia → actualiza query param: `?societyId=30`
- NO re-renderiza, solo actualiza datos

**Por ruta directa:**
- URL: `/operaciones/sociedades/30/junta-accionistas/historial`
- Lee `route.params.societyId` → carga datos automáticamente

**Código:**
```typescript
const route = useRoute();
const router = useRouter();

// Leer societyId de ruta O query param
const societyId = computed(() => {
  // Prioridad 1: Path param (si existe)
  if (route.params.societyId) {
    return String(route.params.societyId);
  }
  // Prioridad 2: Query param
  if (route.query.societyId) {
    return String(route.query.societyId);
  }
  return null;
});

// Cuando cambia el selector, actualizar query param
const handleSocietyChange = async (newSocietyId: string | null) => {
  // Actualizar query param (NO path param)
  await router.push({
    path: route.path,
    query: { ...route.query, societyId: newSocietyId || undefined },
  });
  
  // Cargar datos
  if (newSocietyId) {
    const id = parseInt(newSocietyId, 10);
    if (!Number.isNaN(id)) {
      await juntaHistorialStore.cargarHistorial(id);
    }
  }
};
```

### Opción 2: Path Params (Alternativa)

**Ruta:**
```
/operaciones/sociedades/:societyId/junta-accionistas/historial
```

**Con selector:**
- Selector cambia → navega a nueva ruta: `/operaciones/sociedades/30/junta-accionistas/historial`
- Re-renderiza el componente (pero Nuxt es eficiente)

**Por ruta directa:**
- URL: `/operaciones/sociedades/30/junta-accionistas/historial`
- Lee `route.params.societyId` → carga datos

**Código:**
```typescript
const route = useRoute();

// Leer societyId de ruta
const societyId = computed(() => {
  const param = route.params.societyId;
  if (typeof param === "string") return param;
  if (Array.isArray(param) && param[0]) return param[0];
  return null;
});

// Cuando cambia el selector, navegar a nueva ruta
const handleSocietyChange = async (newSocietyId: string | null) => {
  if (newSocietyId) {
    // Navegar a nueva ruta con societyId
    await router.push(`/operaciones/sociedades/${newSocietyId}/junta-accionistas/historial`);
  } else {
    // Navegar sin societyId (ruta base)
    await router.push("/operaciones/sociedades/junta-accionistas/historial");
  }
};
```

## 🎯 Recomendación: Opción 1 (Query Params)

### Razones:

1. **No re-renderiza**: Cambiar selector solo actualiza query param
2. **Más flexible**: Funciona con o sin societyId en la ruta
3. **Mejor UX**: Transición más suave
4. **Compartible**: URLs con query params también se pueden compartir

### Implementación Completa:

```vue
<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const sociedadHistorialStore = useSociedadHistorialStore();
const juntaHistorialStore = useJuntaHistorialStore();

// Leer societyId de ruta O query param
const societyIdFromRoute = computed(() => {
  const param = route.params.societyId;
  if (typeof param === "string" && param !== "junta-accionistas") return param;
  if (Array.isArray(param) && param[0] && param[0] !== "junta-accionistas") return param[0];
  return null;
});

const societyIdFromQuery = computed(() => {
  const query = route.query.societyId;
  if (typeof query === "string") return query;
  if (Array.isArray(query) && query[0]) return query[0];
  return null;
});

// Prioridad: ruta > query > null
const currentSocietyId = computed(() => {
  return societyIdFromRoute.value || societyIdFromQuery.value || null;
});

// Selector sincronizado con currentSocietyId
const selectedSocietyId = ref<string | null>(null);

// Sincronizar selector con ruta/query al montar
onMounted(async () => {
  await sociedadHistorialStore.cargarHistorial();
  
  // Si hay societyId en ruta o query, sincronizar selector
  if (currentSocietyId.value) {
    selectedSocietyId.value = currentSocietyId.value;
    const id = parseInt(currentSocietyId.value, 10);
    if (!Number.isNaN(id)) {
      await juntaHistorialStore.cargarHistorial(id);
    }
  }
});

// Watch: cuando cambia currentSocietyId (desde ruta/query), cargar datos
watch(currentSocietyId, async (newId) => {
  if (newId) {
    const id = parseInt(newId, 10);
    if (!Number.isNaN(id)) {
      await juntaHistorialStore.cargarHistorial(id);
    }
  }
}, { immediate: true });

// Cuando cambia el selector, actualizar query param
const handleSocietyChange = async (newSocietyId: string | null) => {
  selectedSocietyId.value = newSocietyId;
  
  // Actualizar query param (mantener path params)
  await router.push({
    path: route.path,
    query: { ...route.query, societyId: newSocietyId || undefined },
  });
  
  // Cargar datos
  if (newSocietyId) {
    const id = parseInt(newSocietyId, 10);
    if (!Number.isNaN(id)) {
      await juntaHistorialStore.cargarHistorial(id);
    }
  }
};
</script>
```

## 🔄 Flujos de Uso

### Flujo 1: Usuario entra sin societyId

1. Usuario navega a `/operaciones/sociedades/junta-accionistas/historial`
2. `currentSocietyId` = `null`
3. Selector muestra placeholder "Selecciona una sociedad..."
4. Tabla de juntas oculta (v-if="selectedSocietyId")

### Flujo 2: Usuario selecciona sociedad

1. Usuario hace clic en selector → selecciona sociedad "30"
2. `handleSocietyChange("30")` se ejecuta
3. Query param se actualiza: `?societyId=30`
4. **NO re-renderiza** (solo actualiza query)
5. `watch(currentSocietyId)` detecta cambio → carga juntas
6. Tabla muestra juntas de sociedad 30

### Flujo 3: Usuario entra con ruta directa

1. Usuario navega a `/operaciones/sociedades/30/junta-accionistas/historial`
2. `societyIdFromRoute` = "30"
3. `currentSocietyId` = "30"
4. `onMounted` sincroniza selector con "30"
5. `watch(currentSocietyId)` carga juntas automáticamente
6. Tabla muestra juntas de sociedad 30

### Flujo 4: Usuario comparte URL

1. URL compartida: `/operaciones/sociedades/30/junta-accionistas/historial?societyId=30`
2. Funciona igual que Flujo 3
3. Si solo tiene query param: `/operaciones/sociedades/junta-accionistas/historial?societyId=30`
4. También funciona (lee de query param)

## ⚠️ Consideraciones

### 1. Ruta Base

**Opción A: Con societyId obligatorio**
```
/operaciones/sociedades/:societyId/junta-accionistas/historial
```
- Requiere societyId en la ruta
- Más restrictivo pero más claro

**Opción B: Sin societyId (más flexible)** ⭐
```
/operaciones/sociedades/junta-accionistas/historial
```
- No requiere societyId en la ruta
- Usa query params para el selector
- Más flexible

**Recomendación:** Opción B (más flexible)

### 2. Sincronización Selector ↔ Ruta

- Selector debe reflejar el `societyId` actual (de ruta o query)
- Cambiar selector debe actualizar query param
- Entrar por ruta debe actualizar selector

### 3. Performance

- Nuxt NO re-renderiza cuando solo cambian query params
- `watch` se ejecuta solo cuando cambia `currentSocietyId`
- Carga de datos se hace solo cuando es necesario

## 📝 Checklist de Implementación

- [ ] Actualizar ruta a: `/operaciones/sociedades/junta-accionistas/historial` (sin societyId obligatorio)
- [ ] Implementar `currentSocietyId` computed (ruta > query > null)
- [ ] Sincronizar selector con `currentSocietyId` en `onMounted`
- [ ] Implementar `watch(currentSocietyId)` para cargar datos
- [ ] Actualizar `handleSocietyChange` para usar query params
- [ ] Probar flujo con selector
- [ ] Probar flujo con ruta directa
- [ ] Probar compartir URL

## 🚀 Ventajas Finales

1. ✅ **No re-renderiza innecesariamente**: Query params no causan re-render
2. ✅ **Funciona por selector**: Usuario puede seleccionar sociedad
3. ✅ **Funciona por ruta**: URLs directas funcionan
4. ✅ **Compartible**: URLs se pueden compartir
5. ✅ **Sincronizado**: Selector y ruta siempre sincronizados
6. ✅ **Performance**: Nuxt optimiza automáticamente

---

**Fecha:** 30 Nov 2025  
**Estado:** Plan listo para implementación

