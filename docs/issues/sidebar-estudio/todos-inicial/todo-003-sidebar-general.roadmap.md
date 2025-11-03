# 📋 TODO-003: SidebarGeneral + SidebarFlow - Roadmap

**Fecha:** 3 de Noviembre, 2025  
**Proyecto:** Sistema Universal de Sidebars  
**Estado:** 📋 Expediente en Progreso

---

## 🎯 OBJETIVO

Refactorizar la arquitectura de sidebars para permitir **dos sidebars simultáneos**:

1. **SidebarGeneral** (navegación principal de la app)
2. **SidebarFlow** (navegación del flujo específico)

Ambos deben convivir en Juntas y Sucursales, mientras que Registro de Sociedades mantiene solo el sidebar original.

---

## 🏗️ DECISIONES ARQUITECTÓNICAS

### **DECISIÓN 1: ¿Modificar ProboSidebar o crear SidebarGeneral?**

**Opciones evaluadas:**

#### **Opción A: Modificar ProboSidebar.vue existente**

```
✅ Pros:
- No duplicar código
- Mantener historial git
- Menos archivos

❌ Contras:
- Riesgo de romper Registro de Sociedades
- Difícil de hacer backward compatible
- Código acoplado a dos casos de uso diferentes
```

#### **Opción B: Crear SidebarGeneral.vue nuevo** ⭐ **ELEGIDA**

```
✅ Pros:
- Aislamiento total (no toca ProboSidebar)
- Registro de Sociedades sigue funcionando igual
- Evolucionar sin miedo a breaking changes
- Clara separación de responsabilidades

❌ Contras:
- Duplicación inicial de código
- Dos archivos similares
```

**DECISIÓN:** ✅ **Opción B - Crear SidebarGeneral.vue**

**Razón:** Aislamiento es más importante que DRY. Podemos refactorizar después si vemos patrones comunes.

---

### **DECISIÓN 2: ¿Cómo integrar FlowSidebar dentro de SidebarGeneral?**

**Opciones evaluadas:**

#### **Opción A: Slot named**

```vue
<SidebarGeneral>
  <template #flow>
    <SidebarFlow :config="flowConfig" />
  </template>
</SidebarGeneral>
```

#### **Opción B: Prop flowConfig** ⭐ **ELEGIDA**

```vue
<SidebarGeneral :flow-config="flowConfig" :show-flow-sidebar="true" />
```

#### **Opción C: Composable interno**

```typescript
// SidebarGeneral detecta automáticamente FlowConfig
const flowConfig = useFlowConfigDetector();
```

**DECISIÓN:** ✅ **Opción B - Prop flowConfig**

**Razón:**

- Balance entre flexibilidad y simplicidad
- El layout controla qué mostrar
- Fácil de debuggear
- Permite deshabilitar FlowSidebar si es necesario

---

### **DECISIÓN 3: ¿Layout nuevo o modificar flow-with-sidebar?**

**Opciones evaluadas:**

#### **Opción A: Modificar flow-with-sidebar.vue**

```
❌ Nombre incorrecto (ahora son DOS sidebars)
❌ Layout existente solo tiene FlowSidebar
```

#### **Opción B: Crear sidebar-general.vue** ⭐ **ELEGIDA**

```
✅ Nombre claro (sidebar general = navegación principal)
✅ Nuevo layout para nuevo patrón
✅ flow-with-sidebar puede quedar como legacy
```

**DECISIÓN:** ✅ **Opción B - Crear sidebar-general.vue**

**Razón:** Nombres descriptivos > nombres genéricos

---

### **DECISIÓN 4: ¿Estructura de carpetas para nuevos componentes?**

**Opciones evaluadas:**

#### **Opción A: app/components/flow/**

```
app/components/flow/
├─ FlowSidebar.vue (actual)
├─ FlowSidebarItem.vue (actual)
└─ SidebarFlow.vue (nuevo - ❌ confuso)
```

#### **Opción B: app/components/sidebar/** ⭐ **ELEGIDA**

```
app/components/sidebar/
├─ SidebarGeneral.vue (nuevo)
└─ SidebarFlow.vue (nuevo)

app/components/flow/ (legacy - mantener)
├─ FlowSidebar.vue
└─ FlowSidebarItem.vue
```

#### **Opción C: Flat en app/components/**

```
app/components/
├─ ProboSidebar.vue (actual - legacy)
├─ SidebarGeneral.vue (nuevo)
└─ SidebarFlow.vue (nuevo)
```

**DECISIÓN:** ✅ **Opción B - Crear carpeta sidebar/**

**Razón:**

- Agrupación lógica
- Separar legacy (flow/) de nueva arquitectura (sidebar/)
- Fácil de encontrar

---

### **DECISIÓN 5: ¿Cómo manejar el ancho de los sidebars?**

**Opciones evaluadas:**

#### **Opción A: Anchos fijos**

```
SidebarGeneral: 280px
SidebarFlow: 280px
Total: 560px
```

#### **Opción B: Anchos variables con props** ⭐ **ELEGIDA**

```vue
<SidebarGeneral :width="280" :flow-sidebar-width="280" />
```

#### **Opción C: CSS Grid automático**

```css
.layout-container {
  display: grid;
  grid-template-columns: auto auto 1fr;
}
```

**DECISIÓN:** ✅ **Opción B - Props con defaults**

**Razón:** Flexibilidad para ajustar según necesidad

---

## 📋 ISSUES (Tareas Específicas)

### **ISSUE 3.1: Crear SidebarFlow.vue** ⏳

**Descripción:** Simplificar FlowSidebar.vue para integrarse dentro de SidebarGeneral

**Tareas:**

- [ ] Copiar FlowSidebar.vue como base
- [ ] Remover header (se mostrará en SidebarGeneral)
- [ ] Ajustar estilos para columna secundaria
- [ ] Hacer colapsable independientemente
- [ ] Agregar transiciones suaves

**Archivos a crear:**

```
app/components/sidebar/SidebarFlow.vue
```

**Estimación:** 1 hora  
**Prioridad:** 🔥 Alta  
**Dependencias:** Ninguna

---

### **ISSUE 3.2: Crear SidebarGeneral.vue** ⏳

**Descripción:** Versión mejorada de ProboSidebar con slot para SidebarFlow

**Tareas:**

- [ ] Copiar ProboSidebar.vue como base
- [ ] Agregar prop `flowConfig` (opcional)
- [ ] Agregar prop `showFlowSidebar` (boolean)
- [ ] Renderizar SidebarFlow condicionalmente
- [ ] Ajustar layout para dos columnas
- [ ] Mantener funcionalidad de navegación principal
- [ ] Agregar controles de colapso independientes

**Archivos a crear:**

```
app/components/sidebar/SidebarGeneral.vue
```

**Estimación:** 2 horas  
**Prioridad:** 🔥 Alta  
**Dependencias:** ISSUE 3.1

---

### **ISSUE 3.3: Crear Layout sidebar-general.vue** ⏳

**Descripción:** Layout que orquesta SidebarGeneral + SidebarFlow

**Tareas:**

- [ ] Crear nuevo layout
- [ ] Detectar FlowConfig según ruta actual
- [ ] Pasar props a SidebarGeneral
- [ ] Manejar caso sin FlowConfig (solo navegación principal)
- [ ] Agregar lógica de colapso

**Archivos a crear:**

```
app/layouts/sidebar-general.vue
```

**Estimación:** 1.5 horas  
**Prioridad:** 🔥 Alta  
**Dependencias:** ISSUE 3.2

---

### **ISSUE 3.4: Actualizar páginas de Junta de Accionistas** ⏳

**Descripción:** Aplicar nuevo layout a páginas de juntas

**Tareas:**

- [ ] Actualizar `seleccion-agenda.vue`
- [ ] Actualizar resto de páginas del flujo
- [ ] Cambiar `layout: 'flow-with-sidebar'` → `layout: 'sidebar-general'`
- [ ] Verificar navegación funciona

**Archivos a modificar:**

```
app/pages/operaciones/junta-accionistas/*.vue
```

**Estimación:** 30 min  
**Prioridad:** 🟡 Media  
**Dependencias:** ISSUE 3.3

---

### **ISSUE 3.5: Actualizar páginas de Sucursales** ⏳

**Descripción:** Aplicar nuevo layout a páginas de sucursales

**Tareas:**

- [ ] Actualizar `datos-sociedad.vue`
- [ ] Actualizar resto de páginas del flujo
- [ ] Cambiar `layout: 'flow-with-sidebar'` → `layout: 'sidebar-general'`
- [ ] Verificar navegación funciona

**Archivos a modificar:**

```
app/pages/registro-societario/sucursales/*.vue
```

**Estimación:** 30 min  
**Prioridad:** 🟡 Media  
**Dependencias:** ISSUE 3.3

---

### **ISSUE 3.6: Verificar Registro de Sociedades sigue funcionando** ⏳

**Descripción:** Asegurar que no rompimos nada

**Tareas:**

- [ ] Navegar a `/registro-societario/sociedades`
- [ ] Verificar ProboSidebar se muestra correctamente
- [ ] Verificar navegación funciona
- [ ] Verificar no hay errores en consola

**Archivos a verificar:**

```
app/components/ProboSidebar.vue
app/layouts/default.vue
app/pages/registro-societario/sociedades/*.vue
```

**Estimación:** 15 min  
**Prioridad:** 🔥 Alta  
**Dependencias:** ISSUE 3.5

---

### **ISSUE 3.7: Refactorizar buildFlowItemTree() para jerarquía completa** ⏳

**Descripción:** Construir árbol jerárquico completo basado en parentId

**Tareas:**

- [ ] Leer todos los FlowItems (niveles 0-4)
- [ ] Crear mapa de items por ID
- [ ] Construir jerarquía usando parentId
- [ ] Ordenar por hierarchy.order
- [ ] Actualizar flowHelpers.ts

**Archivos a modificar:**

```
app/utils/flowHelpers.ts
```

**Estimación:** 2 horas  
**Prioridad:** 🟡 Media  
**Dependencias:** ISSUE 3.6

---

### **ISSUE 3.8: Actualizar FlowConfigs para incluir todos los niveles** ⏳

**Descripción:** Importar FlowItems de niveles 1-4 en FlowConfigs

**Tareas:**

- [ ] Importar items de nivel 1-4 en junta-accionistas.flow.ts
- [ ] Agregar al array `items`
- [ ] Verificar que buildFlowItemTree() construye correctamente
- [ ] Probar en navegador

**Archivos a modificar:**

```
app/config/flows/junta-accionistas.flow.ts
```

**Estimación:** 1 hora  
**Prioridad:** 🟢 Baja (opcional para MVP)  
**Dependencias:** ISSUE 3.7

---

## ⏱️ ESTIMACIÓN TOTAL

### **Por Issue:**

```
ISSUE 3.1: 1.0 hora   (SidebarFlow)
ISSUE 3.2: 2.0 horas  (SidebarGeneral)
ISSUE 3.3: 1.5 horas  (Layout)
ISSUE 3.4: 0.5 horas  (Juntas)
ISSUE 3.5: 0.5 horas  (Sucursales)
ISSUE 3.6: 0.25 horas (Verificación)
ISSUE 3.7: 2.0 horas  (buildFlowItemTree - opcional)
ISSUE 3.8: 1.0 hora   (FlowConfigs completos - opcional)
─────────────────────
TOTAL MVP: 5.75 horas (~1 día)
TOTAL COMPLETO: 8.75 horas (~1.5 días)
```

### **Por Fase:**

```
Fase 1 (Componentes):    3.5 horas (3.1 + 3.2 + 3.3)
Fase 2 (Integración):    1.25 horas (3.4 + 3.5 + 3.6)
Fase 3 (Jerarquía Full): 3.0 horas (3.7 + 3.8) - OPCIONAL
```

### **Complejidad:**

- **Técnica:** 🟡 Media (refactorización, no creación desde cero)
- **Riesgo:** 🟢 Bajo (aislado, no toca código existente)
- **Testing:** 🟡 Media (pruebas manuales en navegador)

---

## 🔗 DEPENDENCIAS

### **Requiere (Bloqueado por):**

- ✅ TODO-001: Estructura de datos (FlowConfig, FlowItem)
- ✅ TODO-002: FlowItems y FlowConfigs creados
- ✅ FlowSidebar y FlowSidebarItem funcionando

### **Bloquea a:**

- ⬜ TODO-004: Implementación de jerarquía completa (niveles 1-4)
- ⬜ TODO-005: Optimizaciones de rendimiento
- ⬜ TODO-006: Animaciones avanzadas

---

## 📊 CRITERIOS DE ÉXITO

### **Funcionales:**

- [ ] ✅ SidebarGeneral muestra navegación principal
- [ ] ✅ SidebarFlow muestra pasos del flujo
- [ ] ✅ Ambos sidebars visibles en Juntas
- [ ] ✅ Ambos sidebars visibles en Sucursales
- [ ] ✅ Navegación funciona en ambos sidebars
- [ ] ✅ Items activos se resaltan correctamente
- [ ] ✅ Colapso de sidebars funciona independientemente
- [ ] ✅ Registro de Sociedades sigue funcionando igual

### **Técnicos:**

- [ ] ✅ 0 errores TypeScript
- [ ] ✅ 0 warnings ESLint
- [ ] ✅ 0 errores en consola del navegador
- [ ] ✅ Código documentado con JSDoc
- [ ] ✅ Componentes reutilizables

### **UX:**

- [ ] ✅ Transiciones suaves
- [ ] ✅ Responsive (desktop primero)
- [ ] ✅ Colores coherentes con tema
- [ ] ✅ Estados hover/active claros

---

## 🎯 MVP vs COMPLETO

### **MVP (5.75 horas):**

```
✅ SidebarFlow creado
✅ SidebarGeneral creado
✅ Layout sidebar-general creado
✅ Aplicado a Juntas y Sucursales
✅ Solo muestra items de Nivel 0
✅ Verificación de Registro de Sociedades
```

### **Completo (8.75 horas):**

```
✅ Todo lo del MVP
✅ buildFlowItemTree() construye jerarquía completa
✅ FlowConfigs incluyen niveles 1-4
✅ Sidebar muestra árbol jerárquico completo
✅ Navegación funciona en todos los niveles
```

**Recomendación:** Empezar con MVP, validar con usuario, luego completar jerarquía.

---

## 📝 NOTAS ADICIONALES

### **¿Por qué no modificar ProboSidebar?**

- Usado por Registro de Sociedades (otro equipo)
- Riesgo de romper funcionalidad existente
- Difícil hacer backward compatible
- Mejor aislar cambios

### **¿Por qué no usar el sidebar actual de ShadcnVue?**

- ProboSidebar ya tiene lógica específica del negocio
- SidebarGeneral es una evolución, no un reemplazo
- Mantener consistencia visual con app actual

### **¿Qué pasa con flow-with-sidebar.vue?**

- Puede quedar como legacy (no usarlo más)
- O eliminar después de validar sidebar-general
- Por ahora, no tocar

### **¿Cómo testear?**

1. Iniciar dev server
2. Navegar a `/indiceSidebarsPruebas`
3. Click en "Junta de Accionistas" → Ver ambos sidebars
4. Click en "Sucursales" → Ver ambos sidebars
5. Navegar a `/registro-societario/sociedades` → Ver solo ProboSidebar
6. Verificar navegación funciona en todos los casos

---

## 🚀 SIGUIENTE PASO

**Crear:** `todo-003-sidebar-general.documentation.md`

Ese archivo contendrá el diseño técnico detallado de cada componente.

---

**FIN DEL ROADMAP**
