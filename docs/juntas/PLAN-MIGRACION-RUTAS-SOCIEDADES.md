# 📋 Plan de Migración: Rutas de Juntas bajo Sociedades

## 🎯 Objetivo

Reorganizar la estructura de rutas de juntas de accionistas para que estén bajo la sociedad:

**ANTES:**
```
/operaciones/junta-accionistas/[societyId]/[flowId]/seleccion-agenda
/operaciones/junta-accionistas/crear
/operaciones/junta-accionistas/historial
```

**DESPUÉS:**
```
/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/seleccion-agenda
/operaciones/sociedades/[societyId]/junta-accionistas/crear
/operaciones/sociedades/[societyId]/junta-accionistas/historial
```

## ✅ Ventajas

1. **Más semántico**: Las juntas pertenecen a una sociedad, la URL lo refleja
2. **Consistente**: Similar a `/operaciones/sociedades/[societyId]/directorio/`
3. **Mejor organización**: Todo lo relacionado con una sociedad está bajo su carpeta
4. **URLs más claras**: `/operaciones/sociedades/30/junta-accionistas/7/seleccion-agenda`

## 📊 Estructura Objetivo

```
operaciones/
└─ sociedades/
   └─ [societyId]/
      ├─ directorio/
      │  ├─ crear.vue
      │  ├─ dashboard.vue
      │  ├─ directores.vue
      │  └─ historico.vue
      └─ junta-accionistas/
         ├─ [flowId]/
         │  ├─ seleccion-agenda/
         │  │  └─ index.vue
         │  ├─ detalles/
         │  │  ├─ index.vue
         │  │  ├─ paso-1.vue
         │  │  ├─ paso-2.vue
         │  │  ├─ resumen.vue
         │  │  └─ votacion.vue
         │  ├─ instalacion/
         │  ├─ puntos-acuerdo.vue
         │  ├─ resumen/
         │  ├─ descargar.vue
         │  └─ [todos los sub-steps]/
         ├─ crear.vue
         ├─ dashboard.vue
         ├─ historial.vue
         ├─ historico.vue
         └─ accionistas.vue
```

## 🔄 Cambios Necesarios

### Fase 1: Mover Archivos (15 min)

1. **Mover páginas principales:**
   - `operaciones/junta-accionistas/crear.vue` → `operaciones/sociedades/[societyId]/junta-accionistas/crear.vue`
   - `operaciones/junta-accionistas/historial.vue` → `operaciones/sociedades/[societyId]/junta-accionistas/historial.vue`
   - `operaciones/junta-accionistas/historico.vue` → `operaciones/sociedades/[societyId]/junta-accionistas/historico.vue`
   - `operaciones/junta-accionistas/dashboard.vue` → `operaciones/sociedades/[societyId]/junta-accionistas/dashboard.vue`

2. **Mover flujo completo:**
   - `operaciones/junta-accionistas/[societyId]/[flowId]/*` → `operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/*`

### Fase 2: Actualizar Rutas Base (30 min)

**Archivo:** `app/config/routes/junta-accionistas.routes.ts`

**Cambio:** Actualizar todas las rutas base de:
```typescript
"/operaciones/junta-accionistas/..."
```
a:
```typescript
"/operaciones/sociedades/:societyId/junta-accionistas/..."
```

**Ejemplo:**
```typescript
// ANTES
SELECCION_AGENDA = "/operaciones/junta-accionistas/seleccion-agenda",

// DESPUÉS
SELECCION_AGENDA = "/operaciones/sociedades/:societyId/junta-accionistas/seleccion-agenda",
```

**Nota:** Las rutas base NO incluyen los IDs dinámicos, solo el patrón. Los IDs se inyectan con `buildJuntaRoute()`.

### Fase 3: Actualizar Helpers de Rutas (20 min)

**Archivo:** `app/utils/juntas/route-builder.utils.ts`

**Cambio:** Actualizar `buildJuntaRoute()` para construir rutas con el nuevo patrón:

```typescript
// ANTES
return route.replace(
  /^\/operaciones\/junta-accionistas\//,
  `/operaciones/junta-accionistas/${societyId}/${flowId}/`
);

// DESPUÉS
return route.replace(
  /^\/operaciones\/sociedades\/:societyId\/junta-accionistas\//,
  `/operaciones/sociedades/${societyId}/junta-accionistas/${flowId}/`
);
```

### Fase 4: Actualizar Navegación (20 min)

**Archivo:** `app/config/junta-navigation.ts`

**Cambio:** Actualizar `buildRoute()` y `buildSubStepRoute()`:

```typescript
// ANTES
return `/operaciones/junta-accionistas/${context.societyId}/${context.flowId}/${slug}`;

// DESPUÉS
return `/operaciones/sociedades/${context.societyId}/junta-accionistas/${context.flowId}/${slug}`;
```

### Fase 5: Actualizar Detección de Rutas (15 min)

**Archivo:** `app/utils/juntas/route-detection.utils.ts`

**Cambio:** Actualizar regex patterns:

```typescript
// ANTES
const match = path.match(/\/operaciones\/junta-accionistas\/([^/]+)\/([^/]+)/);

// DESPUÉS
const match = path.match(/\/operaciones\/sociedades\/([^/]+)\/junta-accionistas\/([^/]+)/);
```

### Fase 6: Actualizar Páginas Principales (20 min)

**Archivos:**
- `crear.vue`: Redirigir a nueva ruta
- `historial.vue`: Navegar con nueva ruta
- `historico.vue`: Navegar con nueva ruta

**Cambio:**
```typescript
// ANTES
router.push(`/operaciones/junta-accionistas/${societyId}/${flowId}/seleccion-agenda`);

// DESPUÉS
router.push(`/operaciones/sociedades/${societyId}/junta-accionistas/${flowId}/seleccion-agenda`);
```

### Fase 7: Actualizar Composables (15 min)

**Archivo:** `app/composables/useJuntasNavbarRoutes.ts`

**Cambio:** Actualizar extracción de IDs:

```typescript
// ANTES
const extractSocietyId = (): string | undefined => {
  const param = route.params.societyId;
  // ...
};

// DESPUÉS (mismo, pero la ruta cambia)
// La extracción sigue siendo igual porque los nombres de parámetros no cambian
```

**Actualizar regex patterns:**
```typescript
// ANTES
let match = path.match(/\/operaciones\/junta-accionistas\/[^/]+\/[^/]+\/([^/]+)/);

// DESPUÉS
let match = path.match(/\/operaciones\/sociedades\/[^/]+\/junta-accionistas\/[^/]+\/([^/]+)/);
```

### Fase 8: Actualizar Progress Navbar Map (10 min)

**Archivo:** `app/config/progress-navbar-map.ts`

**Cambio:** Actualizar matcher:

```typescript
// ANTES
match: (path: string) => path.includes("/operaciones/junta-accionistas"),

// DESPUÉS
match: (path: string) => path.includes("/operaciones/sociedades") && path.includes("/junta-accionistas"),
```

### Fase 9: Actualizar Todas las Páginas (30 min)

**Buscar y reemplazar en todas las páginas:**

1. **Referencias a rutas hardcodeadas:**
   ```typescript
   // Buscar:
   "/operaciones/junta-accionistas/"
   
   // Reemplazar con:
   "/operaciones/sociedades/:societyId/junta-accionistas/"
   ```

2. **Extracción de IDs de ruta:**
   ```typescript
   // Ya debería estar usando route.params.societyId y route.params.flowId
   // Solo verificar que funcione con la nueva estructura
   ```

### Fase 10: Actualizar Stores y Repositorios (10 min)

**Verificar que no haya rutas hardcodeadas en:**
- Stores de juntas
- Repositorios HTTP
- Use cases

**Nota:** Los repositorios HTTP usan endpoints del backend, no rutas del frontend, así que no deberían cambiar.

## 📋 Checklist de Implementación

### Archivos a Mover
- [ ] `crear.vue` → `sociedades/[societyId]/junta-accionistas/crear.vue`
- [ ] `historial.vue` → `sociedades/[societyId]/junta-accionistas/historial.vue`
- [ ] `historico.vue` → `sociedades/[societyId]/junta-accionistas/historico.vue`
- [ ] `dashboard.vue` → `sociedades/[societyId]/junta-accionistas/dashboard.vue`
- [ ] `[societyId]/[flowId]/*` → `sociedades/[societyId]/junta-accionistas/[flowId]/*`

### Archivos a Actualizar
- [ ] `config/routes/junta-accionistas.routes.ts` (87 rutas)
- [ ] `utils/juntas/route-builder.utils.ts`
- [ ] `utils/juntas/route-detection.utils.ts`
- [ ] `config/junta-navigation.ts`
- [ ] `composables/useJuntasNavbarRoutes.ts`
- [ ] `config/progress-navbar-map.ts`
- [ ] `pages/operaciones/sociedades/[societyId]/junta-accionistas/crear.vue`
- [ ] `pages/operaciones/sociedades/[societyId]/junta-accionistas/historial.vue`
- [ ] `pages/operaciones/sociedades/[societyId]/junta-accionistas/historico.vue`

### Verificaciones
- [ ] Todas las rutas funcionan correctamente
- [ ] Navegación entre pasos funciona
- [ ] Sidebar muestra pasos correctos
- [ ] Redirecciones funcionan
- [ ] Backend endpoints siguen funcionando (no cambian)

## 🔍 Estrategia de Búsqueda y Reemplazo

### Patrón 1: Rutas Base en Enum
```typescript
// Buscar:
"/operaciones/junta-accionistas/

// Reemplazar con:
"/operaciones/sociedades/:societyId/junta-accionistas/
```

### Patrón 2: Construcción Manual de Rutas
```typescript
// Buscar:
`/operaciones/junta-accionistas/${

// Reemplazar con:
`/operaciones/sociedades/${societyId}/junta-accionistas/${

// O mejor, usar buildJuntaRoute() si es posible
```

### Patrón 3: Regex en Detección
```typescript
// Buscar:
/\/operaciones\/junta-accionistas\//

// Reemplazar con:
/\/operaciones\/sociedades\/[^/]+\/junta-accionistas\//
```

## ⚠️ Consideraciones Importantes

1. **Rutas Base vs Rutas Dinámicas:**
   - Las rutas base en `JuntaRoutes` usan `:societyId` como placeholder
   - `buildJuntaRoute()` reemplaza `:societyId` con el ID real
   - Esto mantiene el enum limpio y permite inyección de IDs

2. **Compatibilidad:**
   - Las páginas principales (crear, historial) ahora requieren `societyId` en la ruta
   - Necesitamos actualizar cómo se navega a estas páginas

3. **Backend:**
   - Los endpoints del backend NO cambian
   - Solo cambian las rutas del frontend

4. **Store:**
   - El store de historial ya tiene `selectedSocietyId`
   - Necesitamos asegurarnos de que siempre esté disponible

## 🚀 Orden de Implementación Recomendado

1. **Actualizar rutas base** (JuntaRoutes enum) - Base para todo
2. **Actualizar helpers** (route-builder, route-detection) - Usados por todo
3. **Mover archivos** - Estructura física
4. **Actualizar navegación** - Depende de helpers
5. **Actualizar páginas** - Depende de navegación
6. **Actualizar composables** - Depende de páginas
7. **Verificar todo** - Testing completo

## 📝 Notas Finales

- **Tiempo estimado total:** 2-3 horas
- **Riesgo:** Medio (muchos archivos, pero cambios son sistemáticos)
- **Rollback:** Fácil (git revert si algo falla)
- **Testing:** Probar cada paso antes de continuar

---

**Fecha:** 30 Nov 2025  
**Estado:** Plan listo para implementación

