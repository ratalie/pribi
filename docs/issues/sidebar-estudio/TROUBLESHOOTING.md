# 🔧 Troubleshooting - Sistema de Sidebar Universal

**Fecha:** 4 de Noviembre, 2025  
**Propósito:** Guía para diagnosticar y resolver problemas comunes  
**Audiencia:** Desarrolladores trabajando con el sistema

---

## 🎯 Problemas Comunes y Soluciones

### Problema 1: Sidebar Derecho No Aparece

**Síntoma:**
- Navegas a una página de nivel 3-4
- Sidebar izquierdo se ve bien
- Sidebar derecho NO aparece

**Causas Posibles:**

#### A) currentItem no se detecta

**Diagnóstico:**
```bash
# Abrir DevTools (F12) → Console
# Buscar logs:
[DEBUG] currentItem result: NOT FOUND
```

**Solución:**
1. Verificar que `findItemByRoute` busca en el árbol construido
2. Verificar que la ruta del item coincide exactamente con `route.path`
3. Verificar que `buildFlowItemTree` está construyendo el árbol correctamente

**Fix aplicado:** ✅ Línea 149 de `universal-flow-layout.vue` usa `findItemByRoute(flowTree.value, ...)`

---

#### B) visibilityRule falla

**Diagnóstico:**
```bash
# Buscar en consola:
[DEBUG] RightSidebar visibility check - current level: undefined
[DEBUG] RightSidebar should be visible: false
```

**Solución:**
1. Verificar que `currentItem` existe ANTES de evaluar visibilityRule
2. Verificar que `visibilityRule.type === "custom"` (no "property")
3. Verificar que la función custom retorna boolean

**Fix aplicado:** ✅ Línea 70 de `juntas.layout.ts` cambió de "property" a "custom"

---

#### C) Item de nivel 3 no está en el árbol

**Diagnóstico:**
```bash
# Buscar en consola:
[DEBUG] flowTree built, root items: 6
[DEBUG] flowTree IDs: ["seleccion-agenda", "detalles", ...]
# Pero no se ven logs de "Item X has Y children"
```

**Solución:**
1. Verificar que items de nivel 3 tienen `parentId` correcto
2. Verificar que items están exportados en `nivel-3/index.ts`
3. Verificar que se importan en `junta-accionistas.flow.ts`

**Verificación:**
```typescript
// app/types/flows/junta-accionistas/nivel-3/nombramiento/apoderados.items.ts
hierarchy: {
  level: 3,
  parentId: "nombramiento-apoderados",  // ← Debe coincidir con ID del padre
  children: [],
}
```

---

### Problema 2: Navegación No Funciona

**Síntoma:**
- Click en item del sidebar
- Nada pasa, o error en consola

**Causas Posibles:**

#### A) Item no tiene route

**Diagnóstico:**
```bash
[UniversalFlowLayout] Item sin ruta: XXX
```

**Solución:**
```typescript
// Verificar que el item tiene navigation.route
navigation: {
  route: JuntaRoutes.NOMBRAMIENTO_APODERADOS_DETALLE,  // ← No debe ser undefined
  behavior: NavigationBehavior.PUSH,
}
```

---

#### B) Ruta no existe en routes enum

**Diagnóstico:**
```bash
# Error 404 en navegador
```

**Solución:**
1. Verificar que la ruta existe en `junta-accionistas.routes.ts`
2. Verificar que la página `.vue` existe en esa ruta
3. Verificar que el enum está importado correctamente

---

### Problema 3: Items No Se Ven en Sidebar Izquierdo

**Síntoma:**
- Sidebar izquierdo vacío o muestra solo algunos items

**Causas Posibles:**

#### A) Filtro muy restrictivo

**Diagnóstico:**
```bash
# Ver en página de testing (/test/sidebar-test)
# Section: "Sidebars configurados"
# Ver "Items after filter: 0"
```

**Solución:**
```typescript
// Ajustar filtro en layout config
filter: {
  type: 'level',
  criteria: {
    minLevel: 0,
    maxLevel: 2,  // ← Aumentar si necesitas ver más niveles
  }
}
```

---

#### B) Items no están en flowConfig

**Diagnóstico:**
```bash
[DEBUG] flowConfig.items length: 0
```

**Solución:**
1. Verificar imports en `junta-accionistas.flow.ts`
2. Verificar exports en archivos de nivel (nivel-0/index.ts, etc.)
3. Verificar que Object.values(nivel0) retorna items

---

### Problema 4: Sidebar Se Colapsa Solo

**Síntoma:**
- Sidebar aparece colapsado automáticamente
- No respeta el estado `collapsed: false`

**Causas Posibles:**

#### A) localStorage tiene estado viejo

**Solución:**
```javascript
// En consola del navegador:
localStorage.removeItem('probo_sidebar_collapsed_juntas-main-sidebar');
localStorage.removeItem('probo_sidebar_collapsed_juntas-steps-sidebar');
// Recargar página
location.reload();
```

---

#### B) persistCollapseState activado

**Solución:**
```typescript
// En layout config:
persistCollapseState: false,  // ← Desactivar si no quieres persistencia
```

---

### Problema 5: Errores de TypeScript

**Síntoma:**
```bash
Cannot find module '~/utils/flowHelpers'
Property 'children' does not exist on type 'FlowItem'
```

**Soluciones:**

#### A) Imports incorrectos

```typescript
// MAL:
import { buildFlowItemTree } from "@/utils/flowHelpers";

// BIEN:
import { buildFlowItemTree } from "~/utils/flowHelpers";
```

#### B) Tipos incorrectos

```typescript
// Asegurar que usas FlowItemTree (con children), no FlowItem
import type { FlowItemTree } from "~/types/flow-system";
```

---

## 🔍 Herramientas de Debugging

### 1. Página de Testing

**URL:** `http://localhost:3000/test/sidebar-test`

**Qué muestra:**
- Árbol completo de FlowItems
- Info del currentItem
- Sidebars activos vs. inactivos
- Debug info en tiempo real

**Cuándo usar:**
- Verificar estructura del árbol
- Ver qué items tienen children
- Validar niveles de jerarquía
- Testear diferentes flujos

---

### 2. Console Logs de Debugging

**Activados en:**
- `universal-flow-layout.vue` (currentItem, activeSidebars, visibilityRule)
- `juntas.layout.ts` (visibilityRule custom function)

**Prefijo:** `[DEBUG]`

**Filtrar en DevTools:**
```
Escribir en el filtro de consola: [DEBUG]
```

**Eliminar cuando funcione:**
```bash
# Buscar y eliminar todos los console.log con [DEBUG]
# En: universal-flow-layout.vue y juntas.layout.ts
```

---

### 3. Vue DevTools

**Instalar:** [Vue DevTools Extension](https://devtools.vuejs.org/)

**Usar para:**
- Ver computed values en tiempo real
- Inspeccionar props de componentes
- Ver el árbol de componentes
- Time-travel debugging

---

## ✅ Checklist de Validación

### Antes de reportar un problema:

- [ ] ¿Servidor corriendo? (`npm run dev`)
- [ ] ¿Consola del navegador abierta? (F12)
- [ ] ¿Hay errores en consola?
- [ ] ¿Logs de [DEBUG] aparecen?
- [ ] ¿currentItem se encuentra? (verificar logs)
- [ ] ¿currentItem tiene el nivel correcto?
- [ ] ¿Cuántos sidebars están activos? (verificar logs)
- [ ] ¿visibilityRule se evalúa correctamente?
- [ ] ¿La ruta coincide exactamente?
- [ ] ¿El item existe en flowConfig.items?

---

## 🧪 Tests Manuales

### Test 1: Sidebar Derecho en Juntas Nivel 3

**Pasos:**
1. Navegar a: `/operaciones/junta-accionistas/nombramiento-apoderados/nombramiento`
2. Abrir DevTools → Console
3. Buscar: `[DEBUG] ✓ FOUND currentItem`
4. Verificar: `Level: 3`
5. Buscar: `[DEBUG] RightSidebar should be visible: true`
6. Verificar: `[DEBUG] Active sidebars count: 2`

**Resultado esperado:**
- ✅ currentItem encontrado con level 3
- ✅ visibilityRule retorna true
- ✅ 2 sidebars activos
- ✅ Sidebar derecho visible en pantalla

---

### Test 2: Sidebar Derecho NO aparece en Nivel 2

**Pasos:**
1. Navegar a: `/operaciones/junta-accionistas/nombramiento-apoderados` (nivel 2)
2. Verificar logs
3. Verificar: `Level: 2`
4. Verificar: `[DEBUG] RightSidebar should be visible: false`
5. Verificar: `[DEBUG] Active sidebars count: 1`

**Resultado esperado:**
- ✅ currentItem encontrado con level 2
- ✅ visibilityRule retorna false
- ✅ 1 sidebar activo (solo izquierdo)
- ✅ Sidebar derecho NO visible

---

### Test 3: Navegación Entre Niveles

**Pasos:**
1. Empezar en nivel 0: `/seleccion-agenda`
2. Click en sidebar: "Puntos de Acuerdo" (nivel 1)
3. Expandir y click: "Nombramiento" (nivel 1)
4. Click: "Nombramiento de Apoderados" (nivel 2)
5. Verificar: ¿Aparecen subitems? ¿Puedes navegar a nivel 3?

**Resultado esperado:**
- ✅ Navegación funciona en todos los niveles
- ✅ Items se expanden/colapsan correctamente
- ✅ Sidebar derecho aparece al entrar a nivel 3

---

## 📊 Casos Edge a Testear

### Edge Case 1: Primer item de nivel 3

**URL:** `/operaciones/junta-accionistas/aporte-dinerario/aportantes`

**Verificar:**
- ✅ Es nivel 3
- ✅ Sidebar derecho aparece
- ✅ Muestra hermanos (Aportes, Votación)

---

### Edge Case 2: Último item de nivel 3

**URL:** `/operaciones/junta-accionistas/aporte-dinerario/votacion`

**Verificar:**
- ✅ Sidebar derecho sigue visible
- ✅ No hay error de "next undefined"

---

### Edge Case 3: Navegación directa (URL manual)

**Pasos:**
1. Escribir URL directo en barra del navegador
2. Presionar Enter

**Verificar:**
- ✅ currentItem se detecta
- ✅ Sidebars correctos aparecen
- ✅ Item activo está destacado

---

## 🚨 Errores Críticos

### Error: "Cannot read property 'hierarchy' of undefined"

**Causa:** `currentItem` es undefined pero se intenta acceder a `currentItem.hierarchy`

**Fix:**
```typescript
// MAL:
const level = currentItem.value.hierarchy.level;

// BIEN:
const level = currentItem.value?.hierarchy.level;
```

---

### Error: "buildFlowItemTree is not a function"

**Causa:** Import incorrecto

**Fix:**
```typescript
// Verificar import:
import { buildFlowItemTree } from "~/utils/flowHelpers";

// NO:
import buildFlowItemTree from "~/utils/flowHelpers";  // ❌ No default export
```

---

### Error: Loops infinitos en consola

**Causa:** computed se ejecuta infinitamente

**Fix:**
- Eliminar console.logs de dentro de computed que modifican estado
- Usar watchEffect para logs one-time

---

## 📝 Logs de Debugging a Buscar

### Logs de Éxito ✅

```
[DEBUG] currentPath: /operaciones/junta-accionistas/nombramiento-apoderados/nombramiento
[DEBUG] flowTree built, root items: 6
[DEBUG] ✓ FOUND currentItem: nombramiento-apoderados-designacion
[DEBUG] - Level: 3
[DEBUG] ====== Evaluating activeSidebars ======
[DEBUG] Evaluating sidebar: juntas-steps-sidebar position: right
[DEBUG] Evaluating visibility rule: custom
[DEBUG] RightSidebar visibility check - current level: 3
[DEBUG] RightSidebar should be visible: true
[DEBUG] ✓ Sidebar juntas-steps-sidebar visibility: true
[DEBUG] Active sidebars count: 2
```

---

### Logs de Fallo ❌

```
[DEBUG] currentPath: /operaciones/junta-accionistas/nombramiento-apoderados/nombramiento
[DEBUG] flowTree built, root items: 6
[DEBUG] ✗ currentItem NOT FOUND for route: ...
[DEBUG] currentItem result: NOT FOUND
[DEBUG] Evaluating sidebar: juntas-steps-sidebar position: right
[DEBUG] Evaluating visibility rule: custom
[DEBUG] ✗ No currentItem, returning false
[DEBUG] Active sidebars count: 1
```

**Indica:** currentItem no se encontró, visibilityRule falla

---

## 🔧 Cómo Agregar Logs de Debugging

### En Componentes Vue

```typescript
<script setup lang="ts">
onMounted(() => {
  console.log('[DEBUG] Component mounted:', componentName);
  console.log('[DEBUG] Props:', props);
});

const computedValue = computed(() => {
  const result = someCalculation();
  console.log('[DEBUG] Computed result:', result);
  return result;
});
</script>
```

---

### En Funciones

```typescript
function myFunction(param: string) {
  console.log('[DEBUG] myFunction called with:', param);
  
  const result = doSomething(param);
  console.log('[DEBUG] myFunction result:', result);
  
  return result;
}
```

---

### En VisibilityRules

```typescript
visibilityRule: {
  type: 'custom',
  fn: (context) => {
    console.log('[DEBUG] Visibility function called');
    console.log('[DEBUG] Context:', context);
    
    const level = context.currentItem?.hierarchy.level;
    console.log('[DEBUG] Level:', level);
    
    const result = level !== undefined && level >= 3;
    console.log('[DEBUG] Result:', result);
    
    return result;
  }
}
```

---

## 🎯 Checklist de Debugging Sistemático

### Paso 1: Verificar Estructura de Datos

- [ ] ¿FlowConfig tiene items? (`flowConfig.items.length > 0`)
- [ ] ¿Items tienen todas las propiedades? (identity, hierarchy, navigation)
- [ ] ¿Items de nivel 3 tienen parentId correcto?
- [ ] ¿Árbol se construye? (`flowTree.length > 0`)

### Paso 2: Verificar Detección de Ruta

- [ ] ¿currentPath tiene valor correcto? (comparar con URL)
- [ ] ¿currentItem se encuentra? (NOT FOUND vs FOUND)
- [ ] ¿currentItem tiene nivel correcto? (debe ser 3)
- [ ] ¿Route del item coincide con currentPath?

### Paso 3: Verificar Sidebars

- [ ] ¿Cuántos sidebars están configurados? (debe ser 2 para Juntas)
- [ ] ¿Cuántos están activos? (debe ser 1 o 2 dependiendo del nivel)
- [ ] ¿visibilityRule se evalúa? (ver logs)
- [ ] ¿visibilityRule retorna el valor esperado?

### Paso 4: Verificar Renderizado

- [ ] ¿FlowSidebar se renderiza? (ver en Elements de DevTools)
- [ ] ¿Cuántos FlowSidebar hay en el DOM? (debe ser 1 o 2)
- [ ] ¿Items tienen contenido? (no están vacíos)
- [ ] ¿CSS está aplicándose correctamente?

---

## 🛠️ Herramientas Útiles

### 1. Vue DevTools

**Instalar:**
- Chrome: [Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/)
- Firefox: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

**Usar para:**
- Inspeccionar computed values
- Ver props de FlowSidebar
- Time-travel debugging
- Performance profiling

---

### 2. Página de Testing

**URL:** `/test/sidebar-test`

**Features:**
- Selector de flujo (Juntas/Sucursales)
- Visualización del árbol completo
- Info del flow actual
- Layout config
- Debug info
- Links rápidos a páginas de testing

---

### 3. Console Tricks

```javascript
// Filtrar solo logs de DEBUG
// En DevTools Console, escribir en filtro:
[DEBUG]

// Copiar objeto completo
copy(layoutConfig)  // Copia al clipboard

// Inspeccionar objeto
console.table(flowTree)  // Muestra en tabla

// Breakpoints condicionales
if (condition) debugger;
```

---

## 📖 Referencias Rápidas

### Archivos Clave

```
Diagnóstico:
→ app/layouts/universal-flow-layout.vue (línea 123-161)

Configuración:
→ app/config/flows/juntas.layout.ts (línea 68-78)

Helpers:
→ app/utils/flowHelpers.ts (línea 46-100)

Testing:
→ app/pages/test/sidebar-test.vue
```

---

### Comandos Útiles

```bash
# Reiniciar servidor
Ctrl+C
npm run dev

# Limpiar cache de Nuxt
rm -rf .nuxt
npm run dev

# Ver errores de TypeScript
npm run type-check

# Ver errores de linting
npm run lint
```

---

## 🚀 Flujo de Debugging Recomendado

```
1. Identifica el problema (¿qué NO funciona?)
   ↓
2. Abre página de testing (/test/sidebar-test)
   ↓
3. Revisa el árbol de FlowItems (¿está correcto?)
   ↓
4. Abre DevTools → Console
   ↓
5. Busca logs [DEBUG]
   ↓
6. Identifica dónde falla (currentItem, visibilityRule, etc.)
   ↓
7. Aplica fix correspondiente
   ↓
8. Refresca página (F5)
   ↓
9. Verifica logs nuevamente
   ↓
10. ¿Funciona? → Elimina logs de debugging
    ¿No funciona? → Agrega más logs
```

---

## 💡 Tips Pro

### Tip 1: Usa la página de testing primero

Antes de debuggear en producción, usa `/test/sidebar-test` para:
- Ver estructura del árbol
- Validar configuración
- Testear en ambiente controlado

---

### Tip 2: Debugging progresivo

Agrega logs poco a poco:
1. Primero: ¿currentItem se encuentra?
2. Luego: ¿visibilityRule se evalúa?
3. Finalmente: ¿Sidebar se renderiza?

No agregues 50 logs a la vez.

---

### Tip 3: Usa breakpoints

En DevTools → Sources:
- Busca `universal-flow-layout.vue`
- Agrega breakpoint en línea 149 (currentItem)
- Recarga página
- Inspecciona variables cuando pare

---

### Tip 4: Testea en orden

1. Nivel 0 → ¿Funciona?
2. Nivel 1 → ¿Funciona?
3. Nivel 2 → ¿Funciona?
4. Nivel 3 → ¿Funciona?

No saltes directo a nivel 3 si nivel 0 no funciona.

---

## 📞 ¿Necesitas Ayuda?

Si después de seguir esta guía aún tienes problemas:

1. **Captura:**
   - Screenshot de la página
   - Screenshot de la consola con logs
   - Archivo con código relevante

2. **Documenta:**
   - ¿Qué intentaste?
   - ¿Qué esperabas?
   - ¿Qué obtuviste?

3. **Comparte:**
   - Logs completos
   - Configuración del flujo
   - Pasos para reproducir

---

**Documento creado:** 4 de Noviembre, 2025  
**Última actualización:** 4 de Noviembre, 2025  
**Estado:** ✅ Completo y listo para usar

