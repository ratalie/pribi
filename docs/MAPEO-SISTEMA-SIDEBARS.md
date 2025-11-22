# 🗺️ MAPEO COMPLETO: Sistema de Sidebars

**Fecha:** $(date)  
**Objetivo:** Mapear todos los elementos relacionados con sidebars para identificar qué conservar y qué eliminar

---

## 📋 RESUMEN EJECUTIVO

### 🚫 **NO TOCAR** - Sistema de Registro Societario
- **Layout:** `flow-layout.vue` (usado por registro-societario)
- **Componentes:** `components/flow-layout/` (ProgressNavBar, HeaderProgressNavbar, etc.)
- **Composable:** `useProgressNavbarRoutes.ts`
- **Páginas:** Todas las páginas de `/registro-societario/` que usan `layout: "flow-layout"`

### 🗑️ **ELIMINAR** - Sistema Dual-Panel-Layout
- **Layouts:** `dual-panel-layout.vue`, `universal-flow-layout.vue`
- **Presentación:** `presentation/dual-panel/` (toda la carpeta)
- **Aplicación:** `application/dual-panel/` (toda la carpeta)
- **Configs:** `config/flows/juntas.layout.ts`, `config/flows/sucursales.layout.ts`
- **Composable:** `useFlowLayoutConfig.ts`
- **Páginas:** Quitar `layout: "dual-panel-layout"` de todas las páginas de juntas y sucursales (pero dejar las páginas)

---

## 🚫 ZONA PROTEGIDA: Registro Societario (NO TOCAR)

### 1. Layout Principal
```
app/layouts/flow-layout.vue
```
- ✅ **NO TOCAR** - Layout usado por registro-societario
- Usa: `ProgressNavBar`, `HeaderProgressNavbar`
- NO usa: `FlowSidebar`, `DualPanelSidebar`, tipos de `flow-layout`

### 2. Componentes del Sidebar
```
app/components/flow-layout/
├── CheckIcon.vue                    ✅ NO TOCAR
├── FlowSidebar.vue                  ⚠️ VERIFICAR (usado por universal-flow-layout)
├── HeaderProgressNavbar.vue         ✅ NO TOCAR
├── ProgressNavBar.vue               ✅ NO TOCAR
└── renderers/
    ├── items/
    │   ├── FlatItem.vue             ⚠️ VERIFICAR
    │   ├── HierarchicalItem.vue     ⚠️ VERIFICAR
    │   └── SequentialItem.vue        ⚠️ VERIFICAR
    └── ...
```
- ✅ **NO TOCAR:** `CheckIcon.vue`, `HeaderProgressNavbar.vue`, `ProgressNavBar.vue`
- ⚠️ **VERIFICAR:** `FlowSidebar.vue` y renderers (usados por `universal-flow-layout.vue`)

### 3. Composables
```
app/composables/useProgressNavbarRoutes.ts
```
- ✅ **NO TOCAR** - Usado por `flow-layout.vue`

### 4. Configuraciones
```
app/config/
├── society-register-navigation.ts   ✅ NO TOCAR (si existe)
└── progress-navbar-map.ts          ✅ NO TOCAR (si existe)
```

### 5. Páginas de Registro Societario
```
app/pages/registro-societario/
├── sociedades/                     ✅ NO TOCAR (usar flow-layout)
└── sucursales/                     ⚠️ VERIFICAR (algunas usan dual-panel-layout)
```
- ✅ **NO TOCAR:** Páginas que usan `layout: "flow-layout"`
- ⚠️ **VERIFICAR:** Páginas de sucursales que usan `layout: "dual-panel-layout"` (migrar a flow-layout o eliminar layout)

---

## 🗑️ ZONA DE ELIMINACIÓN: Dual-Panel-Layout

### 1. Layouts a Eliminar
```
app/layouts/
├── dual-panel-layout.vue           🗑️ ELIMINAR
├── universal-flow-layout.vue       🗑️ ELIMINAR
└── flow-with-sidebar.vue           ⚠️ VERIFICAR (parece obsoleto)
```
- 🗑️ **ELIMINAR:** `dual-panel-layout.vue`, `universal-flow-layout.vue`
- ⚠️ **VERIFICAR:** `flow-with-sidebar.vue` (no parece usarse en páginas)

### 2. Presentación (Toda la Carpeta)
```
app/presentation/dual-panel/
├── sidebar/
│   ├── DualPanelSidebar.vue        🗑️ ELIMINAR
│   ├── panels/
│   │   ├── HierarchicalPanel.vue   🗑️ ELIMINAR
│   │   ├── ScrollAnchorPanel.vue   🗑️ ELIMINAR
│   │   └── StepWizardPanel.vue       🗑️ ELIMINAR
│   └── shared/
│       ├── CategorySeparator.vue   🗑️ ELIMINAR
│       ├── HierarchicalItem.vue    🗑️ ELIMINAR
│       ├── StatusIcon.vue          🗑️ ELIMINAR
│       ├── StepRenderer.vue        🗑️ ELIMINAR
│       └── items/                  🗑️ ELIMINAR (toda la carpeta)
└── ...
```
- 🗑️ **ELIMINAR:** Toda la carpeta `app/presentation/dual-panel/`

### 3. Aplicación
```
app/application/dual-panel/
└── flowConfigToSteps.ts            🗑️ ELIMINAR
```
- 🗑️ **ELIMINAR:** Toda la carpeta `app/application/dual-panel/`

### 4. Configuraciones de Layout
```
app/config/flows/
├── juntas.layout.ts                🗑️ ELIMINAR
├── sucursales.layout.ts            🗑️ ELIMINAR
└── index.ts                        ⚠️ VERIFICAR (exporta juntas y sucursales)
```
- 🗑️ **ELIMINAR:** `juntas.layout.ts`, `sucursales.layout.ts`
- ⚠️ **VERIFICAR:** `index.ts` (quitar exports de layouts eliminados)

### 5. Composables
```
app/composables/useFlowLayoutConfig.ts
```
- 🗑️ **ELIMINAR** - Solo usado por `dual-panel-layout.vue`

### 6. Tipos (Verificar Dependencias)
```
app/types/flow-layout/
├── flow-layout-config.ts           ⚠️ VERIFICAR (usado por FlowSidebar)
├── sidebar-config.ts               ⚠️ VERIFICAR (usado por FlowSidebar)
├── index.ts                        ⚠️ VERIFICAR
├── navigation-types.ts              ⚠️ VERIFICAR
└── renderer-types.ts               ⚠️ VERIFICAR
```
- ⚠️ **VERIFICAR:** Estos tipos son usados por `FlowSidebar.vue` que está en `components/flow-layout/`
- **DECISIÓN:** Si `FlowSidebar.vue` se elimina (porque solo lo usa `universal-flow-layout.vue`), entonces estos tipos también se pueden eliminar
- **SI NO:** Mantener solo los tipos necesarios para `FlowSidebar.vue` si se conserva

### 7. Stores
```
app/stores/flowProgress.store.ts   ⚠️ VERIFICAR
```
- ⚠️ **VERIFICAR:** Si solo lo usa `dual-panel-layout.vue`, eliminar. Si lo usa otro sistema, mantener.

### 8. Utilidades
```
app/utils/flowHelpers.ts            ⚠️ VERIFICAR
```
- ⚠️ **VERIFICAR:** Si solo lo usa `dual-panel-layout.vue`, eliminar. Si lo usa otro sistema, mantener.

### 9. Páginas de Juntas (Quitar Layout, Mantener Páginas)
```
app/pages/operaciones/junta-accionistas/
├── **/*.vue                         ⚠️ MODIFICAR (quitar `layout: "dual-panel-layout"`)
```
- ⚠️ **MODIFICAR:** Todas las páginas que tienen `layout: "dual-panel-layout"` → Quitar esa línea
- ✅ **MANTENER:** Las páginas en sí (solo quitar el layout)

**Total aproximado:** ~100 páginas de juntas que usan `dual-panel-layout`

### 10. Páginas de Sucursales (Quitar Layout, Mantener Páginas)
```
app/pages/registro-societario/sucursales/
├── **/*.vue                         ⚠️ MODIFICAR (quitar `layout: "dual-panel-layout"`)
```
- ⚠️ **MODIFICAR:** Páginas que tienen `layout: "dual-panel-layout"` → Quitar esa línea
- ✅ **MANTENER:** Las páginas en sí (solo quitar el layout)

**Total aproximado:** ~7 páginas de sucursales que usan `dual-panel-layout`

### 11. Páginas de Test
```
app/pages/test/
├── dual-panel-demo.vue             🗑️ ELIMINAR
├── hierarchical-demo.vue           🗑️ ELIMINAR
├── juntas-dual-panel.vue           🗑️ ELIMINAR
├── sucursales-dual-panel.vue       🗑️ ELIMINAR
└── sidebar-test.vue                ⚠️ VERIFICAR
```
- 🗑️ **ELIMINAR:** Páginas de test relacionadas con dual-panel
- ⚠️ **VERIFICAR:** `sidebar-test.vue` (ver si es para flow-layout o dual-panel)

### 12. Componentes de Test
```
app/components/test/
└── SidebarDebugger.vue             ⚠️ VERIFICAR
```
- ⚠️ **VERIFICAR:** Si solo lo usa dual-panel, eliminar

---

## 📊 ESTADÍSTICAS

### Archivos a Eliminar
- **Layouts:** 2-3 archivos
- **Presentación:** ~15-20 archivos (toda la carpeta)
- **Aplicación:** 1 archivo
- **Configs:** 2 archivos
- **Composables:** 1 archivo
- **Páginas de test:** 4-5 archivos
- **Total aproximado:** ~25-35 archivos

### Archivos a Modificar
- **Páginas de juntas:** ~100 páginas (quitar `layout: "dual-panel-layout"`)
- **Páginas de sucursales:** ~7 páginas (quitar `layout: "dual-panel-layout"`)
- **Total aproximado:** ~107 páginas

### Archivos a Verificar
- **Tipos:** 5 archivos en `types/flow-layout/`
- **Componentes:** `FlowSidebar.vue` y renderers
- **Stores:** `flowProgress.store.ts`
- **Utilidades:** `flowHelpers.ts`
- **Total aproximado:** ~10-15 archivos

---

## ✅ CHECKLIST DE ELIMINACIÓN

### Fase 1: Verificación
- [ ] Verificar que `flow-layout.vue` NO usa `FlowSidebar.vue`
- [ ] Verificar que `FlowSidebar.vue` solo se usa en layouts a eliminar
- [ ] Verificar dependencias de tipos en `types/flow-layout/`
- [ ] Verificar si `flowProgress.store.ts` se usa en otro lugar
- [ ] Verificar si `flowHelpers.ts` se usa en otro lugar

### Fase 2: Eliminación de Layouts
- [ ] Eliminar `app/layouts/dual-panel-layout.vue`
- [ ] Eliminar `app/layouts/universal-flow-layout.vue`
- [ ] Verificar y eliminar `app/layouts/flow-with-sidebar.vue` (si no se usa)

### Fase 3: Eliminación de Código
- [ ] Eliminar `app/presentation/dual-panel/` (toda la carpeta)
- [ ] Eliminar `app/application/dual-panel/` (toda la carpeta)
- [ ] Eliminar `app/config/flows/juntas.layout.ts`
- [ ] Eliminar `app/config/flows/sucursales.layout.ts`
- [ ] Actualizar `app/config/flows/index.ts` (quitar exports)
- [ ] Eliminar `app/composables/useFlowLayoutConfig.ts`

### Fase 4: Eliminación de Tipos (Si corresponde)
- [ ] Si `FlowSidebar.vue` se elimina, eliminar `app/types/flow-layout/` (toda la carpeta)
- [ ] Si `FlowSidebar.vue` se mantiene, mantener solo tipos necesarios

### Fase 5: Modificación de Páginas
- [ ] Quitar `layout: "dual-panel-layout"` de todas las páginas de juntas (~100)
- [ ] Quitar `layout: "dual-panel-layout"` de todas las páginas de sucursales (~7)

### Fase 6: Limpieza de Test
- [ ] Eliminar páginas de test relacionadas con dual-panel
- [ ] Eliminar componentes de test relacionados con dual-panel

### Fase 7: Verificación Final
- [ ] Verificar que no hay imports rotos
- [ ] Verificar que `flow-layout.vue` sigue funcionando
- [ ] Verificar que las páginas de juntas cargan sin layout
- [ ] Verificar que las páginas de sucursales cargan sin layout (o con flow-layout)

---

## 🔍 VERIFICACIONES ADICIONALES

### ¿Qué usa `FlowSidebar.vue`?
- ✅ `universal-flow-layout.vue` → ELIMINAR
- ✅ `flow-with-sidebar.vue` → VERIFICAR (parece obsoleto)
- ❓ ¿Algún otro lugar?

### ¿Qué usa los tipos de `flow-layout/`?
- ✅ `DualPanelSidebar.vue` → ELIMINAR
- ✅ `FlowSidebar.vue` → VERIFICAR
- ✅ `juntas.layout.ts` → ELIMINAR
- ✅ `sucursales.layout.ts` → ELIMINAR
- ✅ `useFlowLayoutConfig.ts` → ELIMINAR

### ¿Qué usa `flowProgress.store.ts`?
- ✅ `dual-panel-layout.vue` → ELIMINAR
- ❓ ¿Algún otro lugar?

### ¿Qué usa `flowHelpers.ts`?
- ✅ `dual-panel-layout.vue` → ELIMINAR
- ✅ `juntas.layout.ts` → ELIMINAR
- ✅ `sucursales.layout.ts` → ELIMINAR
- ❓ ¿Algún otro lugar?

---

## 📝 NOTAS FINALES

1. **Las páginas de juntas deben quedar** - Solo quitar el layout, no eliminar las páginas
2. **El sistema de registro-societario NO se toca** - Es independiente y funcional
3. **Verificar dependencias antes de eliminar** - Algunos archivos pueden ser compartidos
4. **Backup recomendado** - Hacer commit antes de eliminar masivamente

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Crear este mapeo (COMPLETADO)
2. ⏳ Revisar y aprobar el mapeo
3. ⏳ Ejecutar verificaciones (Fase 1)
4. ⏳ Eliminar archivos (Fases 2-4)
5. ⏳ Modificar páginas (Fase 5)
6. ⏳ Limpiar tests (Fase 6)
7. ⏳ Verificación final (Fase 7)


