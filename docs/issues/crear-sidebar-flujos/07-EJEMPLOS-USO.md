# 📸 Ejemplos Visuales y de Código

**Fecha**: 31 de Octubre, 2025  
**Objetivo**: Ver el sistema en acción con ejemplos concretos

---

## 🎨 Comparativa Visual: Antes vs Después

### **ANTES: Sistema Actual (Juntas)**

```vue
<!-- ❌ Componente específico de 168 líneas -->
<!-- app/components/JuntasDoubleSidebar.vue -->
<script setup lang="ts">
  import { juntasNavigation } from "~/config/juntas-navigation";

  // 50+ líneas de lógica hardcodeada...
  const isLeftSidebarOpen = ref(true);
  const isRightSidebarOpen = ref(true);
  const rightSidebarSteps = computed(() => getRightSidebarSteps(route.path));

  function navigateTo(path: string | undefined) {
    if (path) router.push(path);
  }

  function isItemActive(item: JuntasNavigationItem): boolean {
    // Lógica específica hardcodeada
    if (item.path === route.path) return true;
    // ... más lógica
  }
</script>

<template>
  <div class="flex h-[calc(100vh-4rem)] overflow-hidden">
    <!-- 100+ líneas de template hardcodeado -->
    <aside v-if="isLeftSidebarOpen" class="w-64 border-r">
      <nav class="p-4 space-y-1">
        <template v-for="item in juntasNavigation">
          <!-- Renderizado específico para 3 niveles -->
          <div v-if="!item.children">...</div>
          <div v-else>
            <div v-for="child1 in item.children">
              <div v-if="!child1.children">...</div>
              <div v-else>
                <div v-for="child2 in child1.children">
                  <!-- Más anidación hardcodeada -->
                </div>
              </div>
            </div>
          </div>
        </template>
      </nav>
    </aside>

    <main class="flex-1"><slot /></main>

    <aside v-if="rightSidebarSteps.length > 0">
      <!-- Más código específico -->
    </aside>
  </div>
</template>
```

**Problemas**:

- 168 líneas hardcodeadas
- Lógica específica para Juntas
- No reutilizable para Registro
- Cambios requieren modificar componente

---

### **DESPUÉS: Sistema Universal**

```vue
<!-- ✅ Uso simple con configuración -->
<!-- app/pages/juntas/index.vue -->
<script setup lang="ts">
  import { juntasFlowConfig } from "~/config/flows";
</script>

<template>
  <UniversalFlowLayout :config="juntasFlowConfig">
    <template #content>
      <!-- Tu contenido aquí -->
      <div class="p-6">
        <h1>Junta de Accionistas</h1>
        <!-- ... -->
      </div>
    </template>
  </UniversalFlowLayout>
</template>
```

**Beneficios**:

- 10 líneas de código
- Configuración separada
- Componente reutilizable
- Cambios en config, no en componente

---

## 📝 Ejemplo Completo: Crear Nuevo Flujo

### **Caso: Crear Flujo de "Sucursales"**

#### **Paso 1: Crear Configuración** (30 minutos)

```typescript
// app/config/flows/sucursales.flow.ts
import type { FlowConfig } from "~/types/flow-system";

export const sucursalesFlowConfig: FlowConfig = {
  id: "registro-sucursales",
  name: "Registro de Sucursales",
  type: "sequential", // ← Tipo de navegación

  startPath: "/registro-societario/sucursales/datos-basicos",

  allowFreeNavigation: false, // Navegación secuencial obligatoria
  validateOnNavigate: true, // Validar antes de avanzar
  autoSave: true,
  autoSaveInterval: 60000,

  // Header personalizado
  header: {
    enabled: true,
    component: "HeaderProgressNavbar",
    showProgress: true,
    progressType: "bar",
  },

  // Footer personalizado
  footer: {
    enabled: true,
    showPrevious: true,
    showNext: true,
    customButtons: [
      {
        id: "save-draft",
        label: "Guardar Borrador",
        variant: "secondary",
        icon: "save",
        action: async () => {
          await saveDraft();
        },
      },
    ],
  },

  // Navegación (5 pasos)
  navigation: [
    {
      id: "datos-basicos",
      title: "Datos Básicos",
      description: "Información general de la sucursal",
      path: "/registro-societario/sucursales/datos-basicos",
      icon: "building",
      initialStatus: "in-progress",
      validate: async () => {
        const form = useDatosBasicosForm();
        return form.validate();
      },
    },
    {
      id: "ubicacion",
      title: "Ubicación",
      description: "Dirección y datos de ubicación",
      path: "/registro-societario/sucursales/ubicacion",
      icon: "map-pin",
      initialStatus: "locked",
      requires: ["datos-basicos"],
    },
    {
      id: "representante",
      title: "Representante Legal",
      description: "Designar representante de la sucursal",
      path: "/registro-societario/sucursales/representante",
      icon: "user-check",
      initialStatus: "locked",
      requires: ["ubicacion"],
    },
    {
      id: "documentos",
      title: "Documentos",
      description: "Subir documentación requerida",
      path: "/registro-societario/sucursales/documentos",
      icon: "file-upload",
      initialStatus: "locked",
      requires: ["representante"],
    },
    {
      id: "resumen",
      title: "Resumen y Confirmación",
      description: "Revisar información antes de enviar",
      path: "/registro-societario/sucursales/resumen",
      icon: "file-check",
      initialStatus: "locked",
      requires: ["documentos"],
    },
  ],

  // Eventos
  events: {
    onBeforeNavigate: async (from, to) => {
      // Validar antes de avanzar
      if (from.validate) {
        const isValid = await from.validate();
        if (!isValid) {
          throw new Error("Completa todos los campos requeridos");
        }
      }
      return true;
    },

    onStatusChange: (itemId, oldStatus, newStatus) => {
      if (newStatus === "completed") {
        const store = useFlowNavigationStore();
        store.unlockNextItem(itemId);
      }
    },

    onComplete: async () => {
      await api.submitSucursalRegistration();
      router.push("/registro-societario/sucursales/confirmacion");
    },
  },
};
```

#### **Paso 2: Usar en Páginas** (15 minutos por página = 75 minutos)

```vue
<!-- app/pages/registro-societario/sucursales/datos-basicos.vue -->
<script setup lang="ts">
  import { sucursalesFlowConfig } from "~/config/flows";
  import DatosBasicosStep from "~/modules/sucursales/components/steps/DatosBasicosStep.vue";
</script>

<template>
  <UniversalFlowLayout :config="sucursalesFlowConfig">
    <template #content>
      <DatosBasicosStep />
    </template>
  </UniversalFlowLayout>
</template>
```

**Repetir para las otras 4 páginas...**

#### **Paso 3: Testing** (15 minutos)

```bash
npm run dev
# Navegar a /registro-societario/sucursales/datos-basicos
# Verificar que todo funciona
```

**TOTAL: ~2 horas para flujo completo** ✅

---

## 🔄 Ejemplo: Cambiar Estructura de Flujo

### **Escenario**: "Junta dos pasos en uno solo"

#### **ANTES: Con Componente Específico**

```vue
<!-- ❌ Modificar componente (3-4 horas) -->
<!-- app/components/JuntasDoubleSidebar.vue -->

<template>
  <div class="flex">
    <aside>
      <nav>
        <!-- Hardcodeado - hay que modificar template -->
        <div v-for="item in juntasNavigation">
          <!-- Eliminar manualmente el nivel... -->
          <!-- Ajustar indentación... -->
          <!-- Probar que no rompiste nada... -->
        </div>
      </nav>
    </aside>
  </div>
</template>
```

#### **DESPUÉS: Con Sistema Universal**

```typescript
// ✅ Modificar config (30 minutos)
// app/config/flows/juntas.flow.ts

export const juntasFlowConfig: FlowConfig = {
  // ...
  navigation: [
    // ...
    {
      id: "nombramiento",
      title: "Nombramiento",
      children: [
        // ANTES: Tenía 3 items
        // {
        //   id: 'nombramiento-apoderados',
        //   title: 'Nombramiento de Apoderados',
        //   path: '/juntas/puntos-acuerdo/nombramiento/apoderados',
        // },
        // {
        //   id: 'nombramiento-gerente',
        //   title: 'Nombramiento de Gerente General',
        //   path: '/juntas/puntos-acuerdo/nombramiento/gerente-general',
        // },
        // DESPUÉS: Solo 2 items (juntar gerente con directores)
        {
          id: "nombramiento-apoderados",
          title: "Nombramiento de Apoderados",
          path: "/juntas/puntos-acuerdo/nombramiento/apoderados",
        },
        {
          id: "nombramiento-directorio", // ← Nuevo item combinado
          title: "Nombramiento de Directorio y Gerencia",
          path: "/juntas/puntos-acuerdo/nombramiento/directorio",
        },
      ],
    },
    // ...
  ],
};
```

**Listo!** El componente se adapta automáticamente. 🎉

---

## 🎭 Ejemplo: Diferentes Tipos de Navegación

### **Tipo 1: Hierarchical (Juntas)**

```typescript
{
  type: 'hierarchical',
  navigation: [
    {
      id: 'puntos-acuerdo',
      title: 'Puntos de Acuerdo',
      children: [
        {
          id: 'aumento-capital',
          title: 'Aumento de Capital',
          children: [
            {
              id: 'aporte-dinerario',
              title: 'Aporte Dinerario',
              path: '/juntas/.../aporte-dinerario/aportantes',
            }
          ]
        }
      ]
    }
  ]
}
```

**Renderiza como**:

```
□ Puntos de Acuerdo
  □ Aumento de Capital
    → Aporte Dinerario
```

---

### **Tipo 2: Sequential (Registro)**

```typescript
{
  type: 'sequential',
  navigation: [
    {
      id: 'paso-1',
      title: 'Datos Principales',
      path: '/registro/.../datos-sociedad',
    },
    {
      id: 'paso-2',
      title: 'Accionistas',
      path: '/registro/.../accionistas',
    },
    {
      id: 'paso-3',
      title: 'Capital Social',
      path: '/registro/.../acciones',
    },
  ]
}
```

**Renderiza como**:

```
1 ✓ Datos Principales
2 → Accionistas
3 🔒 Capital Social
```

---

### **Tipo 3: Mixed**

```typescript
{
  type: 'mixed',
  navigation: [
    {
      id: 'seccion-a',
      title: 'Sección A (libre)',
      path: '/...',
    },
    {
      id: 'seccion-b',
      title: 'Sección B (tiene sub-flujo)',
      rightSidebar: {
        enabled: true,
        steps: [
          { id: 'b-1', title: 'Paso 1', path: '/...' },
          { id: 'b-2', title: 'Paso 2', path: '/...' },
        ]
      }
    },
  ]
}
```

**Renderiza como**:

```
Left Sidebar       |  Content  |  Right Sidebar
─────────────────────────────────────────────────
→ Sección A        |           |
  Sección B        |           |  1 → Paso 1
                   |           |  2   Paso 2
```

---

## 🔧 Ejemplo: Validación Personalizada

```typescript
{
  id: 'accionistas',
  title: 'Accionistas',
  path: '/registro/.../accionistas',

  // Validación síncrona
  validate: () => {
    const store = useAccionistasStore();
    return store.accionistas.length >= 2; // Mínimo 2 accionistas
  },

  // O validación asíncrona
  validate: async () => {
    const store = useAccionistasStore();
    const result = await api.validateAccionistas(store.accionistas);
    return result.isValid;
  },
}
```

**Comportamiento**:

```
Usuario hace clic en "Siguiente"
    ↓
Sistema ejecuta validate()
    ↓
Si retorna false → Mostrar error, no permite avanzar
Si retorna true → Marcar como "completed", navegar al siguiente
```

---

## 🎨 Ejemplo: Estados Personalizados

```typescript
{
  id: 'documentos',
  title: 'Documentos',
  path: '/registro/.../documentos',
  initialStatus: 'locked', // Estado inicial
}

// Durante el flujo, cambiar estado:
const { updateStatus } = useFlowNavigation();

// Cuando se complete
updateStatus('completed'); // ✓ Marca como completado

// Si necesita revisión
updateStatus('pending-review'); // ⏳ Pendiente

// Si fue aprobado
updateStatus('approved'); // ✅ Aprobado

// Si fue rechazado
updateStatus('rejected'); // ❌ Rechazado
```

**Renderizado Visual**:

```
Estado           | Icono | Color
─────────────────────────────────
not-started      | ⚪    | Gray
in-progress      | 🔵    | Blue
completed        | ✓     | Green
locked           | 🔒    | Gray (disabled)
pending-review   | ⏳    | Yellow
approved         | ✅    | Green
rejected         | ❌    | Red
```

---

## 🎯 Ejemplo: Usar Composable en Componente

```vue
<!-- En tu componente de página -->
<script setup lang="ts">
  import { useFlowNavigation } from "~/composables/flows";

  const {
    currentItem, // Item actual reactivo
    progress, // Progreso general (0-100)
    next, // Ir al siguiente
    previous, // Ir al anterior
    goTo, // Ir a específico
    reset, // Resetear flujo
    updateStatus, // Actualizar estado
  } = useFlowNavigation();

  // Ejemplo: botón personalizado
  async function handleSave() {
    // Guardar datos
    await saveFormData();

    // Marcar como completado
    updateStatus("completed");

    // Navegar al siguiente
    await next();
  }

  // Ejemplo: ir directo a paso
  function jumpToStep(stepId: string) {
    goTo(stepId, false); // false = sin validación
  }
</script>

<template>
  <div>
    <!-- Mostrar progreso -->
    <div class="progress-bar">
      <div :style="{ width: `${progress}%` }" />
    </div>

    <!-- Mostrar info del paso actual -->
    <h1>{{ currentItem?.title }}</h1>
    <p>{{ currentItem?.description }}</p>

    <!-- Formulario -->
    <form @submit.prevent="handleSave">
      <!-- ... campos ... -->

      <div class="flex gap-2">
        <button type="button" @click="previous">Anterior</button>
        <button type="submit">Guardar y Continuar</button>
      </div>
    </form>

    <!-- Debug info -->
    <div class="mt-4 text-xs text-gray-500">
      Estado: {{ currentItem?.status }} Progreso: {{ progress }}%
    </div>
  </div>
</template>
```

---

## 🔄 Ejemplo: Eventos del Flujo

```typescript
export const myFlowConfig: FlowConfig = {
  // ...

  events: {
    // Antes de inicializar
    onBeforeInit: async (config) => {
      console.log("Inicializando flujo:", config.name);
      // Cargar datos del backend
      await loadInitialData();
    },

    // Después de inicializar
    onAfterInit: (config) => {
      console.log("Flujo inicializado!");
      // Analytics
      trackEvent("flow_started", { flowId: config.id });
    },

    // Antes de navegar
    onBeforeNavigate: async (from, to) => {
      console.log("Navegando de", from.title, "a", to.title);

      // Validar si es necesario
      if (from.validate) {
        const isValid = await from.validate();
        if (!isValid) {
          alert("Completa los campos requeridos");
          return false; // Cancelar navegación
        }
      }

      // Confirmar si hay cambios sin guardar
      if (hasUnsavedChanges()) {
        const confirm = await showConfirmDialog("¿Salir sin guardar?");
        return confirm; // Solo navegar si confirma
      }

      return true; // Permitir navegación
    },

    // Después de navegar
    onAfterNavigate: async (from, to) => {
      console.log("Navegación completada!");

      // Guardar progreso automáticamente
      await useFlowNavigationStore().saveProgress();

      // Analytics
      trackEvent("step_completed", {
        from: from.id,
        to: to.id,
      });

      // Scroll to top
      window.scrollTo(0, 0);
    },

    // Al cambiar estado
    onStatusChange: (itemId, oldStatus, newStatus) => {
      console.log(`${itemId}: ${oldStatus} → ${newStatus}`);

      // Si se completa, desbloquear siguiente
      if (newStatus === "completed") {
        const store = useFlowNavigationStore();
        store.unlockNextItem(itemId);
      }

      // Notificación visual
      if (newStatus === "approved") {
        showToast("¡Paso aprobado!", "success");
      }
    },

    // Al completar el flujo
    onComplete: async () => {
      console.log("¡Flujo completado!");

      // Enviar todos los datos
      await api.submitFlowData();

      // Navegar a confirmación
      router.push("/confirmacion");

      // Analytics
      trackEvent("flow_completed", {
        flowId: myFlowConfig.id,
      });

      // Mostrar confetti 🎉
      showCelebration();
    },

    // Al resetear
    onReset: () => {
      console.log("Flujo reseteado");
      // Limpiar datos
      clearAllFormData();
    },

    // Al guardar progreso
    onSave: async (states) => {
      console.log("Guardando progreso...");
      // Enviar a backend
      await api.saveProgress(states);
    },

    // Al restaurar progreso
    onRestore: (states) => {
      console.log("Progreso restaurado!");
      // Mostrar notificación
      showToast("Continuando desde donde quedaste");
    },

    // Al ocurrir error
    onError: (error, context) => {
      console.error("Error en:", context, error);
      // Logging
      logError(error, { context, flowId: myFlowConfig.id });
      // Mostrar al usuario
      showErrorDialog(error.message);
    },
  },
};
```

---

## 📊 Ejemplo: Comparativa de Código

### **Crear Nuevo Flujo**

#### **Sistema Actual (Componente Específico)**

```
Líneas de código: ~200
Archivos: 1 componente + 1 config
Tiempo: 4-6 horas
```

#### **Sistema Universal**

```
Líneas de código: ~100 (solo config)
Archivos: 1 config
Tiempo: 1-2 horas
Ahorro: 50-66%
```

---

### **Modificar Estructura**

#### **Sistema Actual**

```
Modificar: Template del componente
Testing: Todo el componente
Tiempo: 2-4 horas
```

#### **Sistema Universal**

```
Modificar: Config (agregar/quitar items del array)
Testing: Solo el cambio específico
Tiempo: 30 minutos
Ahorro: 75-87%
```

---

### **Agregar Feature Global**

#### **Sistema Actual**

```
Modificar: Todos los componentes (10 archivos)
Testing: Todos los flujos
Tiempo: 8-10 horas
```

#### **Sistema Universal**

```
Modificar: UniversalFlowLayout (1 archivo)
Testing: Un solo componente
Tiempo: 2-3 horas
Ahorro: 70-75%
```

---

## 🎓 Tips y Buenas Prácticas

### **1. Organización de Configs**

```typescript
// ✅ BUENO: Un archivo por flujo
app/config/flows/
├─ juntas.flow.ts
├─ registro.flow.ts
├─ sucursales.flow.ts
└─ index.ts (export all)

// ❌ MALO: Todo en un archivo
app/config/all-flows.ts (1000+ líneas)
```

### **2. Nombres de IDs**

```typescript
// ✅ BUENO: IDs descriptivos con contexto
{
  id: 'registro-datos-sociedad',
  id: 'juntas-aumento-capital',
}

// ❌ MALO: IDs genéricos
{
  id: 'step1',
  id: 'page2',
}
```

### **3. Validación**

```typescript
// ✅ BUENO: Validación específica con mensaje claro
validate: async () => {
  const store = useAccionistasStore();
  if (store.accionistas.length < 2) {
    throw new Error("Se requieren mínimo 2 accionistas");
  }
  return true;
};

// ❌ MALO: Validación silenciosa
validate: () => store.accionistas.length >= 2;
```

### **4. Estados**

```typescript
// ✅ BUENO: Usar estados apropiados
initialStatus: "locked"; // Para pasos futuros
initialStatus: "in-progress"; // Para paso actual
initialStatus: "completed"; // Para pasos anteriores

// ❌ MALO: Todo not-started
initialStatus: "not-started";
```

---

## ✅ Checklist para Nuevo Flujo

```markdown
## Crear Nuevo Flujo

### Antes de empezar

- [ ] Definir nombre del flujo
- [ ] Identificar tipo (hierarchical/sequential/mixed)
- [ ] Listar todos los pasos
- [ ] Definir validaciones necesarias
- [ ] Identificar si necesita header/footer personalizado

### Implementación

- [ ] Crear archivo config en `app/config/flows/`
- [ ] Definir FlowConfig completo
- [ ] Crear páginas en `app/pages/`
- [ ] Usar UniversalFlowLayout en cada página
- [ ] Crear componentes de steps si necesario
- [ ] Implementar validaciones

### Testing

- [ ] Navegar por todos los pasos
- [ ] Verificar validaciones funcionan
- [ ] Verificar estados (locked, completed, etc.)
- [ ] Verificar ProboSidebar visible
- [ ] Verificar responsive
- [ ] Verificar dark mode

### Documentación

- [ ] Agregar comentarios en config
- [ ] Documentar validaciones especiales
- [ ] Agregar ejemplo de uso en docs

### Deploy

- [ ] Code review
- [ ] Merge a branch principal
- [ ] Verificar en staging
- [ ] Deploy a producción
```

---

## 🚀 ¿Listo para Empezar?

1. Lee el [Plan de Implementación](./05-PLAN-IMPLEMENTACION.md)
2. Comienza con **Fase 1: Fundamentos**
3. Sigue los ejemplos de este documento
4. Consulta la [Arquitectura](./03-ARQUITECTURA.md) cuando tengas dudas

**¡Éxito con la implementación!** 🎯

---

**Última actualización**: 31 de Octubre, 2025
