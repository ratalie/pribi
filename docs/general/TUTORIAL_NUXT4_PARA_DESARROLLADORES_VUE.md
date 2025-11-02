# 🚀 Tutorial Completo de Nuxt 4 para Desarrolladores Vue

**Para**: Desarrolladores que conocen Vue.js pero son nuevos en Nuxt  
**Nivel**: Intermedio  
**Proyecto**: Probo Frontend V3  
**Fecha**: Octubre 2025

---

## 📚 TABLA DE CONTENIDOS

1. [Vue.js vs Nuxt 4 - Diferencias Clave](#1-vuejs-vs-nuxt-4---diferencias-clave)
2. [Estructura de Carpetas en Tu Proyecto](#2-estructura-de-carpetas-en-tu-proyecto)
3. [Routing en Nuxt (File-Based Routing)](#3-routing-en-nuxt-file-based-routing)
4. [Layouts - El Sistema de Plantillas](#4-layouts---el-sistema-de-plantillas)
5. [Composables - La Magia de Nuxt](#5-composables---la-magia-de-nuxt)
6. [Stores con Pinia](#6-stores-con-pinia)
7. [Auto-imports - No más imports manuales](#7-auto-imports---no-más-imports-manuales)
8. [Componentes Globales](#8-componentes-globales)
9. [Plugins - Extendiendo Nuxt](#9-plugins---extendiendo-nuxt)
10. [Middleware - Guardias de Navegación](#10-middleware---guardias-de-navegación)
11. [Server Routes (API)](#11-server-routes-api)
12. [Ejemplo Completo: Tu Sistema de Flow](#12-ejemplo-completo-tu-sistema-de-flow)

---

## 1. Vue.js vs Nuxt 4 - Diferencias Clave

### **En Vue.js SPA haces:**

```javascript
// main.js
import { createApp } from "vue";
import { createRouter } from "vue-router";
import App from "./App.vue";

const router = createRouter({
  routes: [
    { path: "/about", component: About },
    { path: "/contact", component: Contact },
  ],
});

const app = createApp(App);
app.use(router);
app.mount("#app");
```

### **En Nuxt 4 haces:**

```javascript
// ¡NADA! Todo es automático 🎉
```

**Nuxt hace por ti:**

- ✅ Crea el router automáticamente
- ✅ Configura SSR/SSG
- ✅ Auto-importa componentes
- ✅ Auto-importa composables
- ✅ Gestiona layouts
- ✅ Optimiza el bundle

---

## 2. Estructura de Carpetas en Tu Proyecto

```
app/                         ← TODO tu código va aquí (Nuxt 4 feature)
├── pages/                   ← Rutas automáticas
│   ├── index.vue           → / (home)
│   ├── about.vue           → /about
│   └── users/
│       ├── index.vue       → /users
│       └── [id].vue        → /users/:id (dinámico)
│
├── layouts/                 ← Plantillas de página
│   ├── default.vue         → Layout por defecto
│   ├── juntas-flow.vue     → Layout para Juntas
│   └── registro-flow.vue   → Layout para Registro
│
├── components/              ← Componentes auto-importados
│   ├── ProboSidebar.vue    → <ProboSidebar /> (disponible en todas partes)
│   └── flow-system/
│       └── FlowSidebar.vue → <FlowSidebar /> (auto-importado)
│
├── composables/             ← Hooks reutilizables (auto-importados)
│   ├── useFlowNavigation.ts → useFlowNavigation() disponible global
│   └── useTheme.ts         → useTheme() disponible global
│
├── stores/                  ← Pinia stores (auto-importados)
│   └── useFlowNavigationStore.ts → useFlowNavigationStore()
│
├── plugins/                 ← Código que se ejecuta al inicio
│   ├── i18n-translations.client.ts → Solo en cliente
│   └── vee-validate.ts     → En cliente y servidor
│
├── middleware/              ← Guardias de navegación
│   └── auth.ts             → Middleware de autenticación
│
├── server/                  ← API backend (Nitro)
│   └── api/
│       └── users.ts        → /api/users endpoint
│
├── utils/                   ← Utilidades (auto-importadas)
│   └── iconMapper.ts       → iconMapper() disponible global
│
├── config/                  ← Configuraciones
│   ├── navigation.ts
│   └── flows/
│       ├── juntas.flow.ts
│       └── registro.flow.ts
│
└── types/                   ← TypeScript types
    └── flow-system/
        └── index.ts

public/                      ← Archivos estáticos (sin procesar)
├── favicon.ico
└── images/

nuxt.config.ts              ← Configuración de Nuxt
package.json
tsconfig.json
```

---

## 3. Routing en Nuxt (File-Based Routing)

### **Concepto Clave**: El nombre del archivo = la ruta

### **Ejemplos de Tu Proyecto:**

#### **Ruta Simple**

```
📁 app/pages/demo-sidebars/index.vue
   ↓
🌐 URL: /demo-sidebars
```

```vue
<!-- app/pages/demo-sidebars/index.vue -->
<script setup lang="ts">
  // Este archivo se accede en /demo-sidebars
</script>

<template>
  <div>
    <h1>Demo de Sidebars</h1>
  </div>
</template>
```

#### **Ruta Anidada**

```
📁 app/pages/juntas/seleccion-puntos.vue
   ↓
🌐 URL: /juntas/seleccion-puntos
```

#### **Ruta Dinámica** (con parámetros)

```
📁 app/pages/registro-societario/sociedades/editar/[id]/datos-sociedad.vue
   ↓
🌐 URL: /registro-societario/sociedades/editar/123/datos-sociedad
```

```vue
<!-- app/pages/users/[id].vue -->
<script setup lang="ts">
  const route = useRoute(); // ← Auto-importado por Nuxt
  const userId = route.params.id; // ← "123"
</script>

<template>
  <div>Usuario ID: {{ userId }}</div>
</template>
```

#### **Ruta Index (página principal de una carpeta)**

```
📁 app/pages/juntas/index.vue
   ↓
🌐 URL: /juntas
```

### **Navegación entre Rutas**

#### **En Vue Router hacías:**

```vue
<script>
  import { useRouter } from "vue-router";

  const router = useRouter();
  router.push("/about");
</script>

<template>
  <router-link to="/about">About</router-link>
</template>
```

#### **En Nuxt haces:**

```vue
<script setup lang="ts">
  // useRouter() está AUTO-IMPORTADO (no necesitas importar)
  const router = useRouter();

  function goToAbout() {
    router.push("/about");
  }

  // O mejor aún, usa navigateTo (función global de Nuxt)
  function goToContact() {
    navigateTo("/contact"); // ← Maneja SSR correctamente
  }
</script>

<template>
  <!-- NuxtLink es mejor que router-link -->
  <NuxtLink to="/about">About</NuxtLink>

  <button @click="goToAbout">Ir a About</button>
  <button @click="navigateTo('/contact')">Ir a Contact</button>
</template>
```

### **Tu Proyecto - Ejemplo Real:**

```vue
<!-- app/pages/demo-sidebars/index.vue -->
<template>
  <!-- Navegación a Juntas -->
  <NuxtLink to="/juntas/seleccion-puntos">Ver Juntas</NuxtLink>

  <!-- Navegación a Registro -->
  <NuxtLink to="/registro-societario/sociedades/crear/datos-sociedad">Ver Registro</NuxtLink>
</template>
```

---

## 4. Layouts - El Sistema de Plantillas

### **Concepto**: Los layouts son **wrappers** que envuelven tus páginas.

### **Estructura Básica:**

```
┌─────────────────────────────────────┐
│         LAYOUT                      │
│  ┌───────────────────────────────┐  │
│  │    Header (en layout)         │  │
│  ├───────────────────────────────┤  │
│  │                               │  │
│  │    <slot /> ← Aquí va la     │  │
│  │              página           │  │
│  │                               │  │
│  ├───────────────────────────────┤  │
│  │    Footer (en layout)         │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

### **Layout Default** (se aplica a todas las páginas)

```vue
<!-- app/layouts/default.vue -->
<script setup lang="ts">
  // Lógica compartida para todas las páginas
  const user = useUser(); // ← Composable auto-importado
</script>

<template>
  <div>
    <!-- Sidebar principal -->
    <ProboSidebar />

    <!-- Aquí se inyecta cada página -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer>© 2025 Probo</footer>
  </div>
</template>
```

### **Layout Personalizado** (para casos específicos)

```vue
<!-- app/layouts/juntas-flow.vue -->
<script setup lang="ts">
  import { juntasFlowConfig } from "~/config/flows/juntas.flow";
</script>

<template>
  <UniversalFlowLayout :config="juntasFlowConfig">
    <slot />
  </UniversalFlowLayout>
</template>
```

### **Cómo usar un layout en una página:**

```vue
<!-- app/pages/juntas/seleccion-puntos.vue -->
<script setup lang="ts">
  definePageMeta({
    layout: "juntas-flow", // ← Usa layouts/juntas-flow.vue
  });
</script>

<template>
  <div>
    <!-- Este contenido se inyecta en el <slot /> del layout -->
    <h1>Selección de Puntos</h1>
  </div>
</template>
```

### **Tu Proyecto - Layouts Reales:**

#### **1. Layout Default** (`app/layouts/default.vue`)

- Tiene el `ProboSidebar` principal
- Usado por páginas que no especifican layout

#### **2. Layout Juntas** (`app/layouts/juntas-flow.vue`)

- Usa `UniversalFlowLayout`
- Pasa configuración de Juntas
- Renderiza sidebar jerárquico

#### **3. Layout Registro** (`app/layouts/registro-flow.vue`)

- Usa `UniversalFlowLayout`
- Pasa configuración de Registro
- Renderiza sidebar secuencial
- Detecta modo (crear/editar)

---

## 5. Composables - La Magia de Nuxt

### **¿Qué son los Composables?**

Funciones reutilizables que encapsulan lógica reactiva. En Nuxt, se **auto-importan**.

### **En Vue.js hacías:**

```javascript
// utils/useCounter.js
import { ref } from "vue";

export function useCounter() {
  const count = ref(0);
  const increment = () => count.value++;
  return { count, increment };
}
```

```vue
<!-- Component.vue -->
<script setup>
  import { useCounter } from "@/utils/useCounter"; // ← Import manual
  const { count, increment } = useCounter();
</script>
```

### **En Nuxt haces:**

```typescript
// app/composables/useCounter.ts
export const useCounter = () => {
  const count = ref(0); // ← ref está auto-importado
  const increment = () => count.value++;
  return { count, increment };
};
```

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
  // ¡NO NECESITAS IMPORTAR! useCounter está disponible globalmente
  const { count, increment } = useCounter();
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">+1</button>
  </div>
</template>
```

### **Tu Proyecto - Composables Reales:**

#### **1. `useFlowNavigation`** (app/composables/useFlowNavigation.ts)

```typescript
export const useFlowNavigation = (flowId: string) => {
  const store = useFlowNavigationStore(); // ← Store auto-importada

  const currentItem = computed(() => store.currentItem);
  const canGoNext = computed(() => store.canGoNext);

  const next = () => store.navigateNext();
  const previous = () => store.navigateBack();

  return {
    currentItem,
    canGoNext,
    next,
    previous,
  };
};
```

**Uso en componente:**

```vue
<script setup lang="ts">
  // Sin imports!
  const flow = useFlowNavigation("juntas");
</script>

<template>
  <button @click="flow.next" :disabled="!flow.canGoNext">Siguiente</button>
</template>
```

#### **2. `useTheme`** (app/composables/useTheme.ts)

```vue
<script setup lang="ts">
  const { theme, toggleTheme } = useTheme(); // ← Auto-importado
</script>

<template>
  <button @click="toggleTheme">Tema actual: {{ theme }}</button>
</template>
```

### **Composables Built-in de Nuxt:**

```typescript
// Routing
const route = useRoute(); // ← Ruta actual
const router = useRouter(); // ← Instancia del router

// Estado reactivo
const state = useState("key", () => 0); // ← Estado compartido

// Fetch de datos
const { data } = await useFetch("/api/users");

// Navegación
navigateTo("/about");

// Runtime config
const config = useRuntimeConfig();

// Y muchos más...
```

---

## 6. Stores con Pinia

### **Setup Store (Composition API Style)**

```typescript
// app/stores/useFlowNavigationStore.ts
export const useFlowNavigationStore = defineStore("flowNavigation", () => {
  // Estado (como ref)
  const currentItemId = ref<string | null>(null);
  const itemStates = ref(new Map());

  // Getters (como computed)
  const currentItem = computed(() => {
    return itemStates.value.get(currentItemId.value);
  });

  const canGoNext = computed(() => {
    // Lógica para determinar si puede avanzar
    return currentItem.value?.status === "completed";
  });

  // Actions (funciones normales)
  function navigateNext() {
    // Lógica de navegación
  }

  function navigateBack() {
    // Lógica de navegación atrás
  }

  return {
    // Estado
    currentItemId,
    itemStates,

    // Getters
    currentItem,
    canGoNext,

    // Actions
    navigateNext,
    navigateBack,
  };
});
```

### **Uso del Store:**

```vue
<script setup lang="ts">
  // El store está auto-importado
  const flowStore = useFlowNavigationStore();

  // Acceso a estado (reactivo)
  console.log(flowStore.currentItemId);

  // Acceso a getters (reactivo)
  console.log(flowStore.canGoNext);

  // Llamar a actions
  flowStore.navigateNext();
</script>

<template>
  <div>
    <p>Item actual: {{ flowStore.currentItemId }}</p>
    <button @click="flowStore.navigateNext" :disabled="!flowStore.canGoNext">Siguiente</button>
  </div>
</template>
```

---

## 7. Auto-imports - No más imports manuales

### **En Vue.js hacías:**

```vue
<script setup>
  import { ref, computed, watch } from "vue";
  import { useRouter } from "vue-router";
  import { storeToRefs } from "pinia";
  import { useUserStore } from "@/stores/user";
  import MyComponent from "@/components/MyComponent.vue";
  import { formatDate } from "@/utils/formatters";

  const router = useRouter();
  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  // ... resto del código
</script>
```

### **En Nuxt haces:**

```vue
<script setup lang="ts">
  // ¡TODO está auto-importado! 🎉

  const count = ref(0); // ← ref auto-importado
  const doubled = computed(() => count.value * 2); // ← computed auto-importado

  watch(count, (val) => {
    // ← watch auto-importado
    console.log("Changed:", val);
  });

  const router = useRouter(); // ← useRouter auto-importado
  const userStore = useUserStore(); // ← store auto-importada
  const formatted = formatDate(new Date()); // ← utils auto-importadas

  // Componentes también auto-importados (no necesitas import)
</script>

<template>
  <div>
    <MyComponent />
    <!-- ← Sin import! -->
    <p>{{ doubled }}</p>
  </div>
</template>
```

### **¿Qué se auto-importa?**

✅ **Vue APIs**: `ref`, `computed`, `watch`, `onMounted`, etc.  
✅ **Composables**: Todo en `app/composables/`  
✅ **Utils**: Todo en `app/utils/`  
✅ **Stores**: Todo en `app/stores/`  
✅ **Componentes**: Todo en `app/components/`  
✅ **Nuxt APIs**: `useRoute`, `useRouter`, `navigateTo`, etc.

---

## 8. Componentes Globales

### **Estructura de Componentes:**

```
app/components/
├── ProboSidebar.vue           → <ProboSidebar />
├── UserDropdownMenu.vue       → <UserDropdownMenu />
├── flow-system/
│   ├── FlowSidebar.vue       → <FlowSystemFlowSidebar />
│   └── FlowHeader.vue        → <FlowSystemFlowHeader />
└── base/
    └── buttons/
        └── ActionButton.vue   → <BaseButtonsActionButton />
```

### **Reglas de Naming:**

- **Archivo único**: `ProboSidebar.vue` → `<ProboSidebar />`
- **Carpeta**: `flow-system/FlowSidebar.vue` → `<FlowSystemFlowSidebar />`
- **Anidado**: `base/buttons/ActionButton.vue` → `<BaseButtonsActionButton />`

### **Uso en tu proyecto:**

```vue
<template>
  <div>
    <!-- Componente en raíz -->
    <ProboSidebar />

    <!-- Componente en carpeta -->
    <FlowSystemFlowSidebar />

    <!-- Componente anidado -->
    <BaseButtonsActionButton label="Guardar" />
  </div>
</template>
```

### **Sobrescribir el nombre:**

```vue
<!-- app/components/flow-system/FlowSidebar.vue -->
<script setup lang="ts">
  defineOptions({
    name: "FlowSidebar", // ← Ahora se usa <FlowSidebar />
  });
</script>
```

---

## 9. Plugins - Extendiendo Nuxt

### **¿Qué son los Plugins?**

Código que se ejecuta **una vez** cuando la app inicia.

### **Tipos de Plugins:**

#### **1. Plugin Universal** (cliente + servidor)

```typescript
// app/plugins/my-plugin.ts
export default defineNuxtPlugin((nuxtApp) => {
  // Se ejecuta en cliente Y servidor
  console.log("Plugin cargado");

  // Agregar una helper global
  return {
    provide: {
      hello: (name: string) => `Hola ${name}`,
    },
  };
});
```

**Uso:**

```vue
<script setup lang="ts">
  const { $hello } = useNuxtApp();
  console.log($hello("Juan")); // → "Hola Juan"
</script>
```

#### **2. Plugin Solo Cliente**

```typescript
// app/plugins/my-plugin.client.ts  ← .client.ts
export default defineNuxtPlugin(() => {
  // Solo se ejecuta en el navegador
  console.log("Solo en cliente");
});
```

#### **3. Plugin Solo Servidor**

```typescript
// app/plugins/my-plugin.server.ts  ← .server.ts
export default defineNuxtPlugin(() => {
  // Solo se ejecuta en el servidor (SSR)
  console.log("Solo en servidor");
});
```

### **Tu Proyecto - Plugins Reales:**

#### **`i18n-translations.client.ts`**

```typescript
// app/plugins/i18n-translations.client.ts
export default defineNuxtPlugin(() => {
  // Configura internacionalización solo en cliente
  // porque usa localStorage
});
```

#### **`vee-validate.ts`**

```typescript
// app/plugins/vee-validate.ts
export default defineNuxtPlugin(() => {
  // Configura validación de formularios
  // Se ejecuta en cliente y servidor
});
```

---

## 10. Middleware - Guardias de Navegación

### **¿Qué es el Middleware?**

Código que se ejecuta **antes** de cargar una página.

### **Tipos de Middleware:**

#### **1. Global Middleware** (todas las rutas)

```typescript
// app/middleware/auth.global.ts  ← .global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUser();

  // Redirigir si no está autenticado
  if (!user.value && to.path !== "/login") {
    return navigateTo("/login");
  }
});
```

#### **2. Named Middleware** (rutas específicas)

```typescript
// app/middleware/admin.ts
export default defineNuxtRouteMiddleware(() => {
  const user = useUser();

  if (user.value?.role !== "admin") {
    return navigateTo("/forbidden");
  }
});
```

**Uso:**

```vue
<script setup lang="ts">
  definePageMeta({
    middleware: "admin", // ← Usa app/middleware/admin.ts
  });
</script>
```

#### **3. Inline Middleware** (en la página)

```vue
<script setup lang="ts">
  definePageMeta({
    middleware: (to, from) => {
      // Lógica inline
      if (!someCondition) {
        return navigateTo("/home");
      }
    },
  });
</script>
```

### **Tu Proyecto - Ejemplo Real:**

```vue
<!-- app/pages/juntas/seleccion-puntos.vue -->
<script setup lang="ts">
  definePageMeta({
    layout: "juntas-flow",
    middleware: (to, from) => {
      // Validar que el usuario tenga permisos
      const user = useUser();
      if (!user.value?.permissions.includes("juntas")) {
        return navigateTo("/forbidden");
      }
    },
  });
</script>
```

---

## 11. Server Routes (API)

### **Backend en Nuxt (Nitro)**

Nuxt incluye un **servidor backend** integrado (Nitro). Puedes crear APIs sin backend separado.

### **Estructura:**

```
server/
├── api/
│   ├── users.ts           → GET/POST /api/users
│   ├── users/
│   │   └── [id].ts        → GET/PUT /api/users/:id
│   └── auth/
│       └── login.ts       → POST /api/auth/login
└── middleware/
    └── auth.ts            → Middleware de API
```

### **Ejemplo de API:**

```typescript
// server/api/users.ts
export default defineEventHandler(async (event) => {
  // GET /api/users
  if (event.method === "GET") {
    const users = await getUsersFromDB();
    return users;
  }

  // POST /api/users
  if (event.method === "POST") {
    const body = await readBody(event);
    const newUser = await createUser(body);
    return newUser;
  }
});
```

### **API con parámetros:**

```typescript
// server/api/users/[id].ts
export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");

  // GET /api/users/123
  return { id, name: "Juan" };
});
```

### **Consumir API en el Frontend:**

```vue
<script setup lang="ts">
  // Opción 1: useFetch (reactivo, cacheable)
  const { data: users, pending } = await useFetch("/api/users");

  // Opción 2: $fetch (imperativo, una vez)
  const createUser = async (user: User) => {
    await $fetch("/api/users", {
      method: "POST",
      body: user,
    });
  };
</script>

<template>
  <div v-if="pending">Cargando...</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
</template>
```

---

## 12. Ejemplo Completo: Tu Sistema de Flow

Voy a explicar **PASO A PASO** cómo funciona tu sistema de navegación de flujos.

### **📁 Estructura del Sistema:**

```
app/
├── pages/
│   └── juntas/
│       └── seleccion-puntos.vue    ← 1. Página (solo contenido)
│
├── layouts/
│   └── juntas-flow.vue             ← 2. Layout (pasa config)
│
├── components/
│   └── flow-system/
│       └── UniversalFlowLayout.vue ← 3. Orquestador (renderiza sidebar)
│
├── config/
│   └── flows/
│       └── juntas.flow.ts          ← 4. Configuración (define estructura)
│
├── composables/
│   └── useFlowNavigation.ts        ← 5. Lógica (API del flow)
│
└── stores/
    └── useFlowNavigationStore.ts   ← 6. Estado (Pinia)
```

### **🔄 Flujo de Ejecución:**

#### **PASO 1: Usuario visita `/juntas/seleccion-puntos`**

```
Browser → Nuxt Router → Busca archivo
                      → Encuentra: app/pages/juntas/seleccion-puntos.vue
```

#### **PASO 2: Nuxt lee la página**

```vue
<!-- app/pages/juntas/seleccion-puntos.vue -->
<script setup lang="ts">
  definePageMeta({
    layout: "juntas-flow", // ← Nuxt: "Ok, usar layouts/juntas-flow.vue"
  });
</script>

<template>
  <div class="p-6">
    <h1>Selección de Puntos</h1>
    <!-- Solo contenido de negocio -->
  </div>
</template>
```

#### **PASO 3: Nuxt carga el layout**

```vue
<!-- app/layouts/juntas-flow.vue -->
<script setup lang="ts">
  import { juntasFlowConfig } from "~/config/flows/juntas.flow";
  // ↑ Import manual porque está en config/, no en composables/
</script>

<template>
  <UniversalFlowLayout :config="juntasFlowConfig">
    <!-- El <slot /> aquí será reemplazado por la página -->
    <slot />
  </UniversalFlowLayout>
</template>
```

#### **PASO 4: UniversalFlowLayout se renderiza**

```vue
<!-- app/components/flow-system/UniversalFlowLayout.vue -->
<script setup lang="ts">
  interface Props {
    config: FlowConfig; // ← Recibe juntasFlowConfig
  }
  const props = defineProps<Props>();

  // Inicializa el composable con la config
  const flow = useFlowNavigation(props.config.id);

  // Detecta ruta actual
  const route = useRoute(); // ← Auto-importado
  const currentPath = route.path; // ← /juntas/seleccion-puntos
</script>

<template>
  <div class="universal-flow-layout">
    <!-- ProboSidebar (main app) -->
    <ProboSidebar />

    <!-- FlowSidebar (navegación del flujo) -->
    <FlowSidebar
      :config="config"
      ←
      juntasFlowConfig
      :navigation="config.navigation"
      ←
      Array
      de
      items
      :current-path="currentPath"
    />

    <!-- Contenido de la página -->
    <main>
      <slot />
      ← Aquí va app/pages/juntas/seleccion-puntos.vue
    </main>
  </div>
</template>
```

#### **PASO 5: FlowSidebar selecciona renderer**

```vue
<!-- app/components/flow-system/FlowSidebar.vue -->
<script setup lang="ts">
  const props = defineProps<{
    config: FlowConfig;
    navigation: FlowItem[];
    currentPath: string;
  }>();

  // Selecciona renderer según tipo
  const rendererComponent = computed(() => {
    switch (props.config.type) {
      case "hierarchical":
        return HierarchicalRenderer; // ← Para Juntas
      case "sequential":
        return SequentialRenderer; // ← Para Registro
    }
  });
</script>

<template>
  <aside class="flow-sidebar">
    <!-- Renderiza el componente dinámico -->
    <component :is="rendererComponent" :navigation="navigation" :current-path="currentPath" />
  </aside>
</template>
```

#### **PASO 6: HierarchicalRenderer dibuja el sidebar**

```vue
<!-- app/components/flow-system/renderers/HierarchicalRenderer.vue -->
<script setup lang="ts">
  const props = defineProps<{
    navigation: FlowItem[];
    currentPath: string;
  }>();
</script>

<template>
  <nav>
    <FlowNavItem
      v-for="item in navigation"
      :key="item.id"
      :item="item"
      :current-path="currentPath"
      :level="0"
    />
  </nav>
</template>
```

#### **PASO 7: FlowNavItem se renderiza (recursivo)**

```vue
<!-- app/components/flow-system/shared/FlowNavItem.vue -->
<script setup lang="ts">
  const props = defineProps<{
    item: FlowItem;
    currentPath: string;
    level: number;
  }>();

  const isActive = computed(() => props.item.path === props.currentPath);
  const hasChildren = computed(() => props.item.children?.length > 0);
</script>

<template>
  <div>
    <!-- Item actual -->
    <NuxtLink v-if="item.path" :to="item.path" :class="{ active: isActive }">
      {{ item.title }}
    </NuxtLink>

    <!-- Hijos (recursivo) -->
    <div v-if="hasChildren" class="children">
      <FlowNavItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :current-path="currentPath"
        :level="level + 1"
      />
    </div>
  </div>
</template>
```

### **🎯 Resultado Final en HTML:**

```html
<div class="universal-flow-layout">
  <!-- ProboSidebar -->
  <aside class="probo-sidebar">
    <nav>
      <a href="/dashboard">Dashboard</a>
      <a href="/juntas">Juntas</a>
    </nav>
  </aside>

  <!-- FlowSidebar (Juntas) -->
  <aside class="flow-sidebar">
    <nav>
      <a href="/juntas/seleccion-puntos" class="active">Selección de Puntos</a>
      <a href="/juntas/detalles-junta">Detalles de Junta</a>
      <div class="nav-group">
        <span>Puntos de Acuerdo</span>
        <div class="children">
          <a href="/juntas/puntos-acuerdo/...">Aumento de Capital</a>
        </div>
      </div>
    </nav>
  </aside>

  <!-- Contenido de la página -->
  <main>
    <div class="p-6">
      <h1>Selección de Puntos</h1>
    </div>
  </main>
</div>
```

---

## 🎓 CONCEPTOS CLAVE A RECORDAR

### **1. File-Based Routing**

```
📁 Archivo                        → 🌐 URL
pages/index.vue                   → /
pages/about.vue                   → /about
pages/users/[id].vue              → /users/:id
pages/blog/[slug]/comments.vue    → /blog/:slug/comments
```

### **2. Layouts son Wrappers**

```vue
<!-- Layout envuelve página -->
<Layout>
  <Page />
</Layout>
```

### **3. Auto-imports Everywhere**

```typescript
// NO necesitas importar:
ref, computed, watch; // Vue APIs
useRoute, useRouter, navigateTo; // Nuxt APIs
useFlowNavigation, useTheme; // Tus composables
useFlowNavigationStore; // Tus stores
iconMapper, formatDate; // Tus utils
```

### **4. Composables = Lógica Reutilizable**

```typescript
// app/composables/useMiLogica.ts
export const useMiLogica = () => {
  const state = ref(0);
  const increment = () => state.value++;
  return { state, increment };
};
```

### **5. Pinia Stores = Estado Global**

```typescript
export const useMiStore = defineStore("mi-store", () => {
  const state = ref(0);
  return { state };
});
```

### **6. Plugins = Código de Inicio**

```typescript
// app/plugins/mi-plugin.ts
export default defineNuxtPlugin(() => {
  // Se ejecuta una vez al inicio
});
```

### **7. Middleware = Guardias**

```typescript
export default defineNuxtRouteMiddleware(() => {
  // Se ejecuta antes de cada navegación
});
```

---

## 📚 RECURSOS ADICIONALES

- **Documentación Oficial**: https://nuxt.com/docs
- **Nuxt 4 Migration**: https://nuxt.com/docs/getting-started/upgrade
- **Pinia**: https://pinia.vuejs.org/
- **TypeScript**: https://www.typescriptlang.org/

---

## 🎯 PRÓXIMOS PASOS

1. Lee este tutorial completo
2. Explora el código de tu proyecto con este conocimiento
3. Experimenta creando una página nueva en `app/pages/`
4. Crea un composable simple en `app/composables/`
5. Revisa cómo funciona `UniversalFlowLayout.vue` con este contexto

---

**¿Dudas sobre alguna sección específica?** ¡Pregunta lo que necesites! 🚀
