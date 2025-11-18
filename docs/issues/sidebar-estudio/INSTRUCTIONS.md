# 🎯 INSTRUCCIONES DEL PROYECTO: sidebar-estudio

**Fecha:** 2 de Noviembre, 2025  
**Proyecto:** Sistema Universal de Sidebars  
**Rama:** `feat/crear-config-para-navegacion-sidebar`

---

## ⚠️ REGLAS DE ORO

### **1. 🚫 NO TOCAR REGISTRO DE SOCIEDADES**

```
❌ PROHIBIDO modificar:
├─ pages/registro-societario/sociedades/
├─ modules/registro-sociedades/
├─ app/config/society-register-navigation.ts
└─ Cualquier archivo relacionado con "sociedades"

✅ PERMITIDO modificar:
├─ pages/operaciones/junta-accionistas/
├─ pages/registro-societario/sucursales/
├─ modules/junta-accionistas/
└─ Espacio aislado de pruebas
```

**Razón:** Otro equipo trabaja en Registro de Sociedades. Nosotros NO interferimos.

---

### **2. 🧪 PROBAR EN ESPACIO AISLADO PRIMERO**

```
Orden de desarrollo:

1️⃣ Crear en espacio aislado
   └─ pages/sidebar-playground/ (pruebas)

2️⃣ Probar y validar
   └─ Testear todo sin afectar producción

3️⃣ Migrar a flujos reales
   └─ Solo cuando todo funciona perfectamente
```

**Filosofía:** "Experimenta en el sandbox, implementa en producción"

---

### **3. 🎯 ENFOQUE DUAL: Juntas + Sucursales**

Trabajaremos SOLO en dos flujos:

#### **A. Junta de Accionistas**

```
pages/operaciones/junta-accionistas/
├─ dashboard.vue       (ya existe - simplificar)
├─ accionistas.vue     (ya existe - simplificar)
├─ historico.vue       (ya existe - simplificar)
└─ [nuevas páginas según flujo]
```

#### **B. Registro de Sucursales**

```
pages/registro-societario/sucursales/
├─ index.vue           (ya existe - modificar)
└─ [nuevas páginas según flujo]
```

---

### **4. 📋 ESTRUCTURA DE PÁGINAS SIMPLES**

Cada página debe tener SOLO:

```vue
<template>
  <div class="page-container">
    <PageTitle :title="pageTitle" />

    <!-- Aquí irá el contenido real después -->
    <div class="placeholder">
      <p>Contenido de {{ pageTitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  const pageTitle = "Nombre del Paso";
</script>
```

**NO incluir:**

- ❌ Formularios complejos
- ❌ Lógica de negocio
- ❌ Componentes elaborados

**SOLO incluir:**

- ✅ Título de página
- ✅ Path definido
- ✅ Placeholder simple

**Razón:** Primero validamos navegación, DESPUÉS agregamos contenido.

---

### **5. 🗂️ ORGANIZACIÓN DE ARCHIVOS**

```
app/
├─ types/
│  └─ flow-system/          ← TODO-001 (Estructura de datos)
│
├─ config/
│  ├─ flows/                ← TODO-002 (Nuevos FlowConfigs)
│  │  ├─ junta-accionistas.flow.ts
│  │  ├─ sucursales.flow.ts
│  │  └─ index.ts
│  │
│  └─ routes/               ← TODO-002 (Route enums)
│     ├─ junta-accionistas.routes.ts
│     ├─ sucursales.routes.ts
│     └─ index.ts
│
├─ modules/
│  ├─ junta-accionistas/    ← TODO-002 (FlowItems de Juntas)
│  │  ├─ flow-items/
│  │  │  ├─ dashboard.item.ts
│  │  │  ├─ accionistas.item.ts
│  │  │  └─ historico.item.ts
│  │  └─ index.ts
│  │
│  └─ registro-sociedades/  ← ⚠️ NO TOCAR
│
├─ pages/
│  ├─ operaciones/
│  │  └─ junta-accionistas/ ← Simplificar páginas existentes
│  │
│  ├─ registro-societario/
│  │  ├─ sociedades/        ← ⚠️ NO TOCAR
│  │  └─ sucursales/        ← Crear páginas simples
│  │
│  └─ sidebar-playground/   ← TODO-002 (Espacio aislado)
│     ├─ index.vue
│     ├─ junta-test.vue
│     └─ sucursales-test.vue
│
└─ components/
   ├─ flow-layout/          ← TODO-003+ (Componentes del sistema)
   │  ├─ UniversalFlowLayout.vue
   │  ├─ FlowSidebar.vue
   │  └─ renderers/
   │
   └─ ProboSidebar.vue      ← ⚠️ NO TOCAR (legacy)
```

---

## 🎯 TRABAJO EN PARALELO: TODO-001 + TODO-002

### **TODO-001: Estructura de Datos** (75% completo)

**Estado Actual:**

- ✅ Expediente técnico completo (todos-inicial/)
- ✅ Usuario aprobó diseño
- ⏳ Código TypeScript en proceso

**Pendiente:**

- [ ] Implementar código TypeScript (20 archivos)
- [ ] Escribir tests (>90% coverage)
- [ ] Validar con type-check + lint
- [ ] Mover a todos-pulidos/

---

### **TODO-002: Preparación de Flujos** (0% completo)

**Objetivo:** Crear el **espacio aislado** + estructura base para Juntas y Sucursales

**Incluye:**

#### **A. Enums de Rutas**

```typescript
// app/config/routes/junta-accionistas.routes.ts
export enum JuntaAccionistasRoutes {
  DASHBOARD = "/operaciones/junta-accionistas/dashboard",
  ACCIONISTAS = "/operaciones/junta-accionistas/accionistas",
  HISTORICO = "/operaciones/junta-accionistas/historico",
}

// app/config/routes/sucursales.routes.ts
export enum SucursalesRoutes {
  INDEX = "/registro-societario/sucursales",
  CREAR_PASO_1 = "/registro-societario/sucursales/crear/datos-generales",
  CREAR_PASO_2 = "/registro-societario/sucursales/crear/ubicacion",
  // ... más pasos
}
```

#### **B. FlowItems Individuales**

```typescript
// app/modules/junta-accionistas/flow-items/dashboard.item.ts
import type { FlowItem } from "@/types/flow-system";

export const juntaDashboardItem: FlowItem = {
  identity: {
    id: "junta-dashboard",
    type: FlowItemType.STEP,
    label: "Dashboard",
    icon: "IconDashboard",
  },
  hierarchy: {
    parentId: null,
    level: 0,
    order: 0,
  },
  navigation: {
    route: JuntaAccionistasRoutes.DASHBOARD,
    behavior: NavigationBehavior.PUSH,
  },
  // ... resto de configuración
};
```

#### **C. FlowConfig Completo**

```typescript
// app/config/flows/junta-accionistas.flow.ts
import type { FlowConfig } from '@/types/flow-system';
import { juntaDashboardItem, juntaAccionistasItem, ... } from '@/modules/junta-accionistas';

export const juntaAccionistasFlowConfig: FlowConfig = {
  id: 'junta-accionistas-flow',
  name: 'Junta de Accionistas',
  items: [
    juntaDashboardItem,
    juntaAccionistasItem,
    // ...
  ],
  renderOptions: { /* ... */ },
  sidebarOptions: { /* ... */ }
};
```

#### **D. Páginas Simples**

```vue
<!-- pages/operaciones/junta-accionistas/dashboard.vue -->
<template>
  <div>
    <PageTitle title="Dashboard - Junta de Accionistas" />
    <p>Placeholder: Dashboard content</p>
  </div>
</template>
```

#### **E. Playground Aislado**

```vue
<!-- pages/sidebar-playground/index.vue -->
<template>
  <div>
    <h1>Sidebar Playground</h1>
    <NuxtLink to="/sidebar-playground/junta-test">Probar Junta de Accionistas</NuxtLink>
    <NuxtLink to="/sidebar-playground/sucursales-test">Probar Sucursales</NuxtLink>
  </div>
</template>
```

---

## 📊 ESTRATEGIA DE DESARROLLO

### **Fase 1: TODO-001 (En Progreso)**

```
⏳ Implementar tipos base (FlowItem, FlowConfig, helpers)
└─ Sin esto, no podemos crear FlowConfigs reales
```

### **Fase 2: TODO-002 (Preparar en Paralelo)**

```
📋 Crear expediente técnico en todos-inicial/
├─ Definir enums de rutas (Juntas + Sucursales)
├─ Diseñar estructura de páginas
├─ Documentar FlowItems necesarios
└─ Planificar FlowConfigs completos
```

### **Fase 3: Implementación Paralela**

```
🏗️ Cuando TODO-001 esté listo:
├─ Crear enums de rutas
├─ Crear páginas simples (solo título)
├─ Crear FlowItems individuales
├─ Crear FlowConfigs completos
└─ Crear playground de pruebas
```

### **Fase 4: Integración**

```
🧪 Probar en playground:
├─ Montar sidebar con FlowConfig de Juntas
├─ Navegar entre páginas
├─ Validar que todo funciona
└─ Ajustar según necesidad
```

---

## 🎯 DECISIONES DE DISEÑO

### **1. ¿Cuántas páginas necesita cada flujo?**

#### **Junta de Accionistas (Mínimo Viable)**

```
3 páginas existentes (simplificar):
├─ dashboard.vue       - Vista general
├─ accionistas.vue     - Gestión de accionistas
└─ historico.vue       - Historial de juntas
```

#### **Sucursales (Crear desde cero)**

```
5-7 páginas nuevas:
├─ index.vue                    - Lista de sucursales
├─ crear/
│  ├─ datos-generales.vue       - RUC, razón social
│  ├─ ubicacion.vue             - Dirección, mapa
│  ├─ representantes.vue        - Gerentes, contactos
│  ├─ documentacion.vue         - Subir archivos
│  └─ resumen.vue               - Confirmar y crear
```

**¿Apruebas esta estructura o modificamos?**

---

### **2. ¿Qué enums crear?**

```typescript
// Rutas
JuntaAccionistasRoutes (3 rutas)
SucursalesRoutes (6-8 rutas)

// Estados (si aplica)
JuntaStatus (PENDIENTE, EN_SESION, FINALIZADA)
SucursalStatus (ACTIVA, INACTIVA, EN_TRAMITE)

// Tipos (si aplica)
JuntaTipo (ORDINARIA, EXTRAORDINARIA, UNIVERSAL)
SucursalTipo (PRINCIPAL, SECUNDARIA, AGENCIA)
```

**¿Necesitas más enums específicos?**

---

### **3. ¿Estructura de FlowItems?**

**Opción A: Flat (Todos al mismo nivel)**

```
Juntas:
├─ Dashboard (level 0)
├─ Accionistas (level 0)
└─ Histórico (level 0)
```

**Opción B: Jerárquica (Con secciones)**

```
Juntas:
├─ Sección: Gestión (level 0)
│  ├─ Dashboard (level 1)
│  └─ Accionistas (level 1)
└─ Sección: Historial (level 0)
   └─ Histórico (level 1)
```

**¿Cuál prefieres?**

---

## 🛠️ PRÓXIMOS PASOS INMEDIATOS

### **Acción 1: Finalizar TODO-001** (1-2 horas)

```bash
# Ya tenemos 20 archivos creados
# Falta:
1. Ejecutar npm run type-check
2. Ejecutar npm run lint
3. Crear tests básicos
4. Mover a todos-pulidos/
```

### **Acción 2: Crear Expediente TODO-002** (2-3 horas)

```bash
# Crear en todos-inicial/:
1. todo-002-preparacion-flujos.roadmap.md
2. todo-002-preparacion-flujos.documentation.md
3. todo-002-preparacion-flujos.routes.md (enums)
4. todo-002-preparacion-flujos.pages.md (estructura)
5. todo-002-preparacion-flujos.flow-items.md (objetos)
```

### **Acción 3: Implementar TODO-002** (3-4 horas)

```bash
# Crear archivos TypeScript:
1. Enums de rutas (2 archivos)
2. Páginas simples (8-10 archivos .vue)
3. FlowItems (8-10 archivos .ts)
4. FlowConfigs (2 archivos .ts)
5. Playground (3 archivos .vue)
```

---

## ✅ CHECKLIST DE VALIDACIÓN

Antes de considerar TODO-002 completo:

```markdown
- [ ] ✅ Enums de rutas creados (Juntas + Sucursales)
- [ ] ✅ Páginas simples creadas (solo título + placeholder)
- [ ] ✅ Todas las rutas funcionan (no 404)
- [ ] ✅ FlowItems individuales creados
- [ ] ✅ FlowConfigs completos creados
- [ ] ✅ Playground funcional
- [ ] ✅ TypeScript sin errores
- [ ] ✅ Linter sin warnings
- [ ] ✅ Tests básicos pasando
- [ ] ✅ Usuario valida estructura
- [ ] ⚠️ NO se tocó Registro de Sociedades
```

---

## 🚨 ALERTAS Y WARNINGS

### **⚠️ Antes de modificar cualquier archivo:**

```bash
# Verificar que NO sea de Registro de Sociedades:
if [[ $FILE == *"sociedades"* ]] || [[ $FILE == *"society-register"* ]]; then
  echo "❌ PROHIBIDO: Este archivo es de Registro de Sociedades"
  exit 1
fi
```

### **⚠️ Al crear nuevas rutas:**

```typescript
// ❌ MAL: Hardcodear rutas
const route = "/operaciones/junta-accionistas/dashboard";

// ✅ BIEN: Usar enums
import { JuntaAccionistasRoutes } from "@/config/routes";
const route = JuntaAccionistasRoutes.DASHBOARD;
```

### **⚠️ Al crear FlowItems:**

```typescript
// ❌ MAL: Crear en línea
const items = [{ id: 'paso-1', label: 'Paso 1', ... }];

// ✅ BIEN: Importar desde módulo
import { juntaDashboardItem } from '@/modules/junta-accionistas';
const items = [juntaDashboardItem, ...];
```

---

## 📚 REFERENCIAS

- [FILOSOFIA.md](./FILOSOFIA.md) - Metodología "Expediente Técnico"
- [README.md](./README.md) - Sistema modular de TODOs
- [ROADMAP.md](./ROADMAP.md) - Tabla maestra de progreso
- [TODO-001](./todos-inicial/todo-001-*) - Estructura de datos
- [TODO-002](./todos-inicial/todo-002-*) - Preparación de flujos (próximo)

---

## 🎯 OBJETIVO FINAL

```
Crear un sistema de sidebar universal que:

✅ NO toque Registro de Sociedades
✅ Funcione en Juntas de Accionistas
✅ Funcione en Registro de Sucursales
✅ Se pruebe primero en playground aislado
✅ Use enums para todas las rutas
✅ Use FlowItems modulares
✅ Sea type-safe (TypeScript completo)
✅ Tenga tests (>90% coverage)
```

---

**🏗️ "Primero el expediente, después la casa.  
Primero el playground, después la producción."**
