# 🚀 Plan de Implementación del Sistema Universal

**Fecha**: 31 de Octubre, 2025  
**Objetivo**: Roadmap detallado para construir el sistema

---

## 📋 Resumen Ejecutivo

### **Scope del Proyecto**

Construir un sistema universal de sidebars para flujos que reemplace los componentes específicos actuales.

### **Duración Estimada**

- **Fase 1**: 8 horas (Fundamentos)
- **Fase 2**: 6 horas (Componentes UI)
- **Fase 3**: 4 horas (Migración Juntas)
- **Fase 4**: 4 horas (Migración Registro)
- **Fase 5**: 2 horas (Testing y Polish)
- **TOTAL**: 24 horas (~3 días de trabajo)

### **Recursos Necesarios**

- 1 Desarrollador frontend (full-time)
- Acceso a proyecto actual
- Conocimiento de: Vue 3, TypeScript, Pinia, Nuxt 3

---

## 🎯 Fases del Proyecto

### **FASE 1: Fundamentos (8 horas)** 🏗️

#### **Objetivo**

Crear la base del sistema: tipos, store, y composables.

#### **Tareas**

##### **1.1 Crear Tipos TypeScript** (2 horas)

```bash
# Archivos a crear:
app/types/flow-system/
├─ config.ts          # FlowConfig, FlowHeaderConfig, FlowFooterConfig
├─ item.ts            # FlowItem
├─ state.ts           # FlowItemState, FlowItemStatus
├─ renderer.ts        # Tipos para renderers
├─ events.ts          # FlowEvents
└─ index.ts           # Export all
```

**Checklist**:

- [ ] Definir `FlowConfig` interface
- [ ] Definir `FlowItem` interface
- [ ] Definir `FlowItemState` interface
- [ ] Definir `FlowItemStatus` type
- [ ] Definir `FlowEvents` interface
- [ ] Crear type guards para validación runtime
- [ ] Exportar todos los tipos en index.ts
- [ ] Verificar con `npm run typecheck`

**Validación**:

```typescript
// Test type imports
import type { FlowConfig, FlowItem } from '~/types/flow-system';

const config: FlowConfig = { ... }; // Should autocomplete
```

---

##### **1.2 Crear Store de Pinia** (3 horas)

```bash
# Archivo a crear:
app/stores/useFlowNavigationStore.ts
```

**Checklist**:

- [ ] Definir state: `itemStates`, `currentItemId`, `history`, `activeFlow`
- [ ] Crear getter: `getItemState(itemId)`
- [ ] Crear getter: `overallProgress`
- [ ] Crear getter: `nextItem`
- [ ] Crear getter: `previousItem`
- [ ] Crear getter: `getCurrentItem()`
- [ ] Crear action: `initializeFlow(config)`
- [ ] Crear action: `updateItemState(itemId, state)`
- [ ] Crear action: `navigateTo(itemId, validate)`
- [ ] Crear action: `saveProgress()` (localStorage + API)
- [ ] Crear action: `restoreProgress()`
- [ ] Crear action: `resetFlow()`
- [ ] Agregar tests unitarios básicos

**Validación**:

```typescript
const store = useFlowNavigationStore();
store.initializeFlow(testConfig);
expect(store.activeFlow).toBeDefined();
```

---

##### **1.3 Crear Composable Principal** (2 horas)

```bash
# Archivo a crear:
app/composables/flows/useFlowNavigation.ts
```

**Checklist**:

- [ ] Implementar `useFlowNavigation()` composable
- [ ] Exponer computed: `currentItem`, `progress`
- [ ] Exponer método: `next()`
- [ ] Exponer método: `previous()`
- [ ] Exponer método: `goTo(itemId, validate)`
- [ ] Exponer método: `reset()`
- [ ] Exponer método: `updateStatus(status)`
- [ ] Conectar con router de Nuxt
- [ ] Manejar eventos de navegación
- [ ] Agregar tests

**Validación**:

```typescript
const { next, previous, currentItem } = useFlowNavigation();
await next(); // Should navigate
```

---

##### **1.4 Crear Helpers** (1 hora)

```bash
# Archivo a crear:
app/utils/flow-system/FlowItemHelpers.ts
```

**Checklist**:

- [ ] Implementar `findById(items, id)`
- [ ] Implementar `findByPath(items, path)`
- [ ] Implementar `flatten(items)`
- [ ] Implementar `getAllIds(items)`
- [ ] Implementar `hasChildren(item)`
- [ ] Implementar `isInCurrentPath(item, path)`
- [ ] Agregar tests unitarios

---

### **FASE 2: Componentes UI (6 horas)** 🎨

#### **Objetivo**

Construir los componentes visuales del sistema.

#### **Tareas**

##### **2.1 Crear Componente Principal** (2 horas)

```bash
# Archivo a crear:
app/components/flow-system/UniversalFlowLayout.vue
```

**Checklist**:

- [ ] Crear estructura base del componente
- [ ] Aceptar prop: `config: FlowConfig`
- [ ] Renderizar header condicional con `<component :is="...">`
- [ ] Renderizar FlowSidebar izquierdo (siempre)
- [ ] Renderizar slot para contenido
- [ ] Renderizar FlowSidebar derecho (condicional)
- [ ] Renderizar footer condicional
- [ ] Conectar con store
- [ ] Manejar eventos @navigate
- [ ] Aplicar estilos con Tailwind
- [ ] Ajustar altura: `h-[calc(100vh-4rem)]`

**Validación**:

```vue
<UniversalFlowLayout :config="testConfig">
  <template #content>
    <div>Test content</div>
  </template>
</UniversalFlowLayout>
```

---

##### **2.2 Crear FlowSidebar** (1.5 horas)

```bash
# Archivo a crear:
app/components/flow-system/FlowSidebar.vue
```

**Checklist**:

- [ ] Aceptar props: `items`, `type`, `position`, `currentPath`
- [ ] Computar qué renderer usar según `type`
- [ ] Renderizar `<component :is="rendererComponent">`
- [ ] Emitir evento @navigate
- [ ] Estilos para position left/right
- [ ] Estilos para ancho configurable
- [ ] Soporte para colapsable (opcional)

---

##### **2.3 Crear Renderers** (2 horas)

```bash
# Archivos a crear:
app/components/flow-system/renderers/
├─ HierarchicalRenderer.vue
├─ SequentialRenderer.vue
└─ MixedRenderer.vue
```

**2.3.1 HierarchicalRenderer** (1 hora)
**Checklist**:

- [ ] Renderizar lista jerárquica (recursiva)
- [ ] Soportar hasta 3 niveles de anidación
- [ ] Expandir/colapsar secciones
- [ ] Resaltar item activo
- [ ] Emitir @navigate al hacer clic
- [ ] Estilos con indentación por nivel

**2.3.2 SequentialRenderer** (0.5 horas)
**Checklist**:

- [ ] Renderizar lista lineal numerada
- [ ] Mostrar número de paso (1, 2, 3...)
- [ ] Mostrar título y descripción
- [ ] Mostrar icono de estado
- [ ] Resaltar paso activo
- [ ] Emitir @navigate

**2.3.3 MixedRenderer** (0.5 horas)
**Checklist**:

- [ ] Combinar lógica de ambos renderers
- [ ] Detectar si item tiene children vs es secuencial
- [ ] Renderizar apropiadamente

---

##### **2.4 Crear Componentes Auxiliares** (0.5 horas)

```bash
app/components/flow-system/items/
├─ NavItem.vue
├─ StepItem.vue
└─ StatusIcon.vue
```

**Checklist**:

- [ ] NavItem: Item de navegación genérico
- [ ] StepItem: Item con número de paso
- [ ] StatusIcon: Iconos para estados (completed, in-progress, etc.)

---

### **FASE 3: Migración de Juntas (4 horas)** 🔄

#### **Objetivo**

Migrar Juntas del componente específico al sistema universal.

#### **Tareas**

##### **3.1 Crear Configuración de Juntas** (2 horas)

```bash
# Archivo a crear:
app/config/flows/juntas.flow.ts
```

**Checklist**:

- [ ] Convertir `juntas-navigation.ts` a `FlowConfig`
- [ ] Mapear todos los items con sus rutas
- [ ] Configurar `rightSidebar` para items que lo necesitan
- [ ] Configurar iconos
- [ ] Configurar estados iniciales
- [ ] Configurar eventos (onAfterNavigate, etc.)
- [ ] Validar tipos con TypeScript
- [ ] Exportar en `config/flows/index.ts`

**Validación**:

```typescript
import { juntasFlowConfig } from "~/config/flows";
console.log(juntasFlowConfig.navigation.length); // Should be 6
```

---

##### **3.2 Actualizar Páginas de Juntas** (1.5 horas)

```bash
# Archivos a modificar:
app/pages/juntas/*.vue (18 archivos)
```

**Checklist**:

- [ ] En `app/pages/juntas/index.vue`:
  - [ ] Quitar `<JuntasDoubleSidebar>`
  - [ ] Agregar `<UniversalFlowLayout :config="juntasFlowConfig">`
  - [ ] Mover contenido a slot `#content`
- [ ] Repetir para las otras 17 páginas
- [ ] Script para automatizar (sed/find)?
- [ ] Verificar todas las rutas funcionan

**Script de Migración**:

```bash
# Script helper para migrar páginas
find app/pages/juntas -name "*.vue" -type f | while read file; do
  # Reemplazar JuntasDoubleSidebar con UniversalFlowLayout
  # (implementar lógica de reemplazo)
done
```

---

##### **3.3 Testing de Juntas** (0.5 horas)

**Checklist**:

- [ ] Navegar por todas las páginas de Juntas
- [ ] Verificar sidebar izquierdo se renderiza
- [ ] Verificar sidebar derecho aparece cuando corresponde
- [ ] Verificar navegación funciona
- [ ] Verificar ProboSidebar siempre visible
- [ ] Verificar estilos correctos

---

### **FASE 4: Migración de Registro (4 horas)** 🔄

#### **Objetivo**

Migrar Registro del layout específico al sistema universal.

#### **Tareas**

##### **4.1 Crear Configuración de Registro** (2 horas)

```bash
# Archivo a crear:
app/config/flows/registro.flow.ts
```

**Checklist**:

- [ ] Convertir `society-register-navigation.ts` a `FlowConfig`
- [ ] Configurar `type: 'sequential'`
- [ ] Mapear todos los 10 pasos
- [ ] Configurar header con `HeaderProgressNavbar`
- [ ] Configurar footer con botones
- [ ] Configurar validación por paso
- [ ] Configurar `requires` para pasos bloqueados
- [ ] Configurar eventos (onBeforeNavigate, onStatusChange)
- [ ] Validar tipos

---

##### **4.2 Convertir flow-layout.vue a Componente** (1 hora)

```bash
# Opciones:
# A) Deprecar flow-layout.vue (recomendado)
# B) Convertir flow-layout.vue a componente wrapper
```

**Opción A (Recomendada)**:
**Checklist**:

- [ ] Crear HeaderProgressNavbar como componente standalone (si no existe)
- [ ] Crear FlowFooter como componente standalone
- [ ] Configurar en `registro.flow.ts` para usar estos componentes
- [ ] Marcar `layouts/flow-layout.vue` como deprecated

---

##### **4.3 Actualizar Páginas de Registro** (0.5 horas)

```bash
# Archivos a modificar:
app/pages/registro-societario/sociedades/crear/*.vue (10 archivos)
```

**Checklist**:

- [ ] Quitar `definePageMeta({ flowLayout: true })`
- [ ] En cada página, envolver con:

```vue
<template>
  <UniversalFlowLayout :config="registroFlowConfig">
    <template #content>
      <!-- Contenido existente -->
    </template>
  </UniversalFlowLayout>
</template>
```

---

##### **4.4 Testing de Registro** (0.5 horas)

**Checklist**:

- [ ] Navegar por los 10 pasos
- [ ] Verificar header con progreso se muestra
- [ ] Verificar footer con botones funciona
- [ ] Verificar validación bloquea navegación
- [ ] Verificar estados (locked, completed) funcionan
- [ ] Verificar ProboSidebar visible

---

### **FASE 5: Testing, Polish y Documentación (2 horas)** ✨

#### **Objetivo**

Asegurar calidad y documentar el sistema.

#### **Tareas**

##### **5.1 Tests Unitarios** (0.5 horas)

**Checklist**:

- [ ] Tests para `useFlowNavigationStore`
- [ ] Tests para `useFlowNavigation` composable
- [ ] Tests para `FlowItemHelpers`
- [ ] Correr `npm run test`

---

##### **5.2 Tests de Integración** (0.5 horas)

**Checklist**:

- [ ] Test: Usuario completa flujo de Juntas
- [ ] Test: Usuario completa flujo de Registro
- [ ] Test: Validación bloquea navegación
- [ ] Test: Progreso se guarda en localStorage

---

##### **5.3 Polish de UI** (0.5 horas)

**Checklist**:

- [ ] Revisar estilos de sidebars
- [ ] Agregar transiciones suaves
- [ ] Verificar responsive (mobile, tablet)
- [ ] Verificar dark mode
- [ ] Verificar accesibilidad (aria-labels)

---

##### **5.4 Documentación** (0.5 horas)

**Checklist**:

- [ ] Crear `docs/FLOW_SYSTEM_GUIDE.md`
- [ ] Documentar cómo crear nuevo flujo
- [ ] Documentar estructura de FlowConfig
- [ ] Agregar ejemplos de uso
- [ ] Documentar troubleshooting común

---

## 📅 Cronograma Sugerido

### **Día 1** (8 horas)

```
09:00 - 11:00 | Fase 1.1: Tipos TypeScript
11:00 - 14:00 | Fase 1.2: Store de Pinia
14:00 - 16:00 | Fase 1.3: Composable Principal
16:00 - 17:00 | Fase 1.4: Helpers

✅ Al final del día: Fundamentos completos
```

### **Día 2** (8 horas)

```
09:00 - 11:00 | Fase 2.1: UniversalFlowLayout
11:00 - 12:30 | Fase 2.2: FlowSidebar
12:30 - 14:30 | Fase 2.3: Renderers
14:30 - 15:00 | Fase 2.4: Componentes auxiliares
15:00 - 17:00 | Fase 3.1: Config de Juntas

✅ Al final del día: Componentes completos + Juntas config
```

### **Día 3** (8 horas)

```
09:00 - 10:30 | Fase 3.2: Migrar páginas Juntas
10:30 - 11:00 | Fase 3.3: Testing Juntas
11:00 - 13:00 | Fase 4.1: Config de Registro
13:00 - 14:00 | Fase 4.2: Componentes de Registro
14:00 - 14:30 | Fase 4.3: Migrar páginas Registro
14:30 - 15:00 | Fase 4.4: Testing Registro
15:00 - 17:00 | Fase 5: Testing, Polish, Docs

✅ Al final del día: Sistema completo y documentado
```

---

## 🎯 Milestones y Validación

### **Milestone 1: Fundamentos** ✅

**Criterio de Éxito**:

```typescript
// Debe funcionar:
const store = useFlowNavigationStore();
store.initializeFlow(testConfig);
const { next, currentItem } = useFlowNavigation();
```

### **Milestone 2: Componentes UI** ✅

**Criterio de Éxito**:

```vue
<!-- Debe renderizar correctamente -->
<UniversalFlowLayout :config="testConfig">
  <template #content>Test</template>
</UniversalFlowLayout>
```

### **Milestone 3: Juntas Migrado** ✅

**Criterio de Éxito**:

- Todas las rutas de Juntas funcionan
- ProboSidebar visible
- Sidebar derecho aparece cuando corresponde

### **Milestone 4: Registro Migrado** ✅

**Criterio de Éxito**:

- Todas las rutas de Registro funcionan
- Header y footer personalizados funcionan
- Validación bloquea navegación

### **Milestone 5: Producción Ready** ✅

**Criterio de Éxito**:

- Tests pasan al 100%
- No errores de TypeScript
- Documentación completa
- Code review aprobado

---

## 🚧 Riesgos y Mitigación

### **Riesgo 1: Complejidad Subestimada**

**Probabilidad**: Media  
**Impacto**: Alto  
**Mitigación**:

- Buffer de 20% en estimaciones
- Priorizar MVP sobre features avanzadas
- Iteraciones incrementales

### **Riesgo 2: Romper Funcionalidad Existente**

**Probabilidad**: Media  
**Impacto**: Crítico  
**Mitigación**:

- Tests exhaustivos antes de merge
- Feature flag para nuevo sistema
- Mantener componentes viejos temporalmente

### **Riesgo 3: Performance Issues**

**Probabilidad**: Baja  
**Impacto**: Medio  
**Mitigación**:

- Profiling con Vue DevTools
- Lazy loading de componentes
- Memoización de computed

### **Riesgo 4: Adopción del Equipo**

**Probabilidad**: Baja  
**Impacto**: Medio  
**Mitigación**:

- Documentación clara con ejemplos
- Sesión de training post-implementación
- Support channel para dudas

---

## 📦 Entregables

### **Código**

- [ ] Tipos TypeScript completos
- [ ] Store de Pinia funcional
- [ ] Composables testeados
- [ ] Componentes UI completos
- [ ] Configuraciones de flujos (Juntas, Registro)
- [ ] Páginas migradas

### **Documentación**

- [ ] README del sistema
- [ ] Guía de creación de flujos
- [ ] Ejemplos de uso
- [ ] Troubleshooting guide
- [ ] Architecture diagrams

### **Testing**

- [ ] Unit tests (cobertura >80%)
- [ ] Integration tests
- [ ] E2E tests para flujos críticos

---

## 🎓 Post-Implementación

### **Semana 1 Post-Launch**

- [ ] Monitorear errores en producción
- [ ] Recopilar feedback del equipo
- [ ] Fix bugs críticos

### **Mes 1 Post-Launch**

- [ ] Analizar métricas de uso
- [ ] Optimizaciones de performance si necesario
- [ ] Deprecar componentes viejos oficialmente

### **Mes 2 Post-Launch**

- [ ] Crear flujo #3 (Sucursales) usando nuevo sistema
- [ ] Validar que tiempo de desarrollo es <2 horas
- [ ] Documentar lessons learned

---

## ✅ Checklist Final Pre-Merge

### **Código**

- [ ] No errores de TypeScript
- [ ] No errores de ESLint
- [ ] Todos los tests pasan
- [ ] Bundle size no incrementó significativamente
- [ ] Performance benchmarks pasan

### **Funcionalidad**

- [ ] Juntas funciona 100%
- [ ] Registro funciona 100%
- [ ] ProboSidebar siempre visible
- [ ] Navegación fluida sin bugs
- [ ] Estados de progreso correctos

### **Documentación**

- [ ] README actualizado
- [ ] Comentarios en código crítico
- [ ] Ejemplos de uso disponibles
- [ ] Migration guide para equipo

### **Review**

- [ ] Code review aprobado
- [ ] QA testing completado
- [ ] Stakeholder sign-off

---

## 🚀 Comando de Inicio

```bash
# Crear branch
git checkout -b feature/universal-flow-system

# Crear estructura de carpetas
mkdir -p app/types/flow-system
mkdir -p app/components/flow-system/renderers
mkdir -p app/components/flow-system/items
mkdir -p app/composables/flows
mkdir -p app/config/flows
mkdir -p app/utils/flow-system

# Comenzar con tipos
touch app/types/flow-system/{config,item,state,renderer,events,index}.ts

# Let's go! 🚀
```

---

## 📞 Soporte Post-Implementación

**Contacto**: [Equipo de desarrollo]  
**Slack**: #flow-system-support  
**Docs**: `/docs/FLOW_SYSTEM_GUIDE.md`

---

**¿Listo para comenzar?** 🎯

Revisa la [documentación completa](./00-INDEX.md) y sigue este plan paso a paso.

---

**Última actualización**: 31 de Octubre, 2025
