````markdown
# 💻 Ejemplos de Código: Sistema de Sidebar Doble

Este documento contiene ejemplos prácticos de cómo usar el sistema de sidebar doble en diferentes escenarios.

---

## 📚 Tabla de Contenidos

1. [Ejemplo 1: Flujo Wizard Simple](#ejemplo-1-flujo-wizard-simple)
2. [Ejemplo 2: Registro de Sociedades (Migración)](#ejemplo-2-registro-de-sociedades-migración)
3. [Ejemplo 3: Documentación con ToC](#ejemplo-3-documentación-con-toc)
4. [Ejemplo 4: Dashboard Híbrido](#ejemplo-4-dashboard-híbrido)
5. [Ejemplo 5: Validaciones Avanzadas](#ejemplo-5-validaciones-avanzadas)
6. [Ejemplo 6: Persistencia Custom](#ejemplo-6-persistencia-custom)

---

## Ejemplo 1: Flujo Wizard Simple

### Caso de Uso

Crear un flujo wizard de 3 pasos para onboarding de usuarios.

### 1. Configuración del Flujo

```typescript
// config/flows/onboarding.ts
import type { DoubleSidebarConfig } from "~/types/double-sidebar";

export const onboardingFlowConfig: DoubleSidebarConfig = {
  flowId: "onboarding",
  mode: "wizard",

  // Navegación global (optional, puede ser null si solo quieres el wizard)
  navigation: null,

  // Pasos del wizard
  steps: [
    {
      id: "welcome",
      title: "Bienvenida",
      description: "Información básica",
      route: "/onboarding/welcome",
      status: "active", // Primer paso empieza activo
      icon: "Hand",
      optional: false,
    },
    {
      id: "profile",
      title: "Tu Perfil",
      description: "Completa tu información",
      route: "/onboarding/profile",
      status: "pending",
      icon: "User",
      optional: false,
    },
    {
      id: "preferences",
      title: "Preferencias",
      description: "Personaliza tu experiencia",
      route: "/onboarding/preferences",
      status: "pending",
      icon: "Settings",
      optional: true, // Este paso se puede saltar
    },
  ],

  // Configuración de persistencia
  persistence: {
    enabled: true,
    backend: {
      endpoint: "/api/onboarding/progress",
      method: "PUT",
      pathKey: "path_current",
    },
    localStorage: {
      enabled: true,
      key: "probo_onboarding_progress",
    },
  },
};
```

### 2. Layout del Flujo

```vue
<!-- pages/onboarding/index.vue -->
<template>
  <DoubleSidebarLayout
    :config="onboardingFlowConfig"
    :is-wizard-flow="true"
    :show-progress-bar="true"
    :show-footer-actions="true"
    :left-sidebar="{ visible: false }"
    :right-sidebar="{ visible: true, mode: 'progress', width: '360px' }"
  >
    <!-- Contenido principal -->
    <NuxtPage />
  </DoubleSidebarLayout>
</template>

<script setup lang="ts">
  import { onboardingFlowConfig } from "~/config/flows/onboarding";

  // El composable se encarga de toda la lógica
  const { currentStep, progress } = useFlowNavigation("onboarding");

  // Configurar meta tags
  useHead({
    title: computed(() => `Onboarding - ${currentStep.value?.title}`),
  });
</script>
```

### 3. Página de un Paso

```vue
<!-- pages/onboarding/profile.vue -->
<template>
  <div class="max-w-2xl mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6">Completa tu perfil</h1>

    <form @submit.prevent="handleSubmit">
      <div class="space-y-6">
        <div>
          <Label for="name">Nombre completo</Label>
          <Input id="name" v-model="form.name" required />
        </div>

        <div>
          <Label for="email">Email</Label>
          <Input id="email" v-model="form.email" type="email" required />
        </div>

        <div>
          <Label for="company">Empresa</Label>
          <Input id="company" v-model="form.company" />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  const { nextStep, saveProgress } = useFlowNavigation("onboarding");

  const form = reactive({
    name: "",
    email: "",
    company: "",
  });

  const handleSubmit = async () => {
    // Guardar datos
    await saveProgress({
      formData: form,
    });

    // Ir al siguiente paso
    await nextStep();
  };
</script>
```

---

## Ejemplo 2: Registro de Sociedades (Migración)

### Caso de Uso

Migrar el flujo actual de "Registro de Sociedades" al nuevo sistema.

### 1. Configuración del Flujo

```typescript
// config/flows/registro-sociedades.ts
import type { DoubleSidebarConfig } from "~/types/double-sidebar";
import { navigationSections } from "~/config/navigation";

export const registroSociedadesConfig: DoubleSidebarConfig = {
  flowId: "registro-sociedades",
  mode: "wizard",

  // Usar navegación global existente
  navigation: {
    sections: navigationSections,
    mode: "global",
  },

  // Pasos del wizard
  steps: [
    {
      id: "tipo-sociedad",
      title: "Tipo de Sociedad",
      description: "Selecciona el tipo de sociedad a registrar",
      route: "/registro-societario/sociedades/crear/tipo-sociedad",
      status: "active",
      icon: "Building",
      canNavigateTo: (context) => {
        return context.user.hasPermission("sociedades:crear");
      },
    },
    {
      id: "datos-sociedad",
      title: "Datos de la Sociedad",
      description: "Información básica de la sociedad",
      route: "/registro-societario/sociedades/crear/datos-sociedad",
      status: "pending",
      icon: "FileText",
      onExit: async (context) => {
        // Validar que los datos básicos estén completos
        if (!context.formData.nombreSociedad) {
          throw new Error("El nombre de la sociedad es requerido");
        }
      },
    },
    {
      id: "accionistas",
      title: "Accionistas",
      description: "Agregar accionistas y su participación",
      route: "/registro-societario/sociedades/crear/accionistas",
      status: "pending",
      icon: "Users",
      substeps: [
        {
          id: "lista-accionistas",
          title: "Lista de Accionistas",
          anchor: "#lista",
          status: "pending",
        },
        {
          id: "distribucion-capital",
          title: "Distribución de Capital",
          anchor: "#capital",
          status: "pending",
        },
      ],
    },
    {
      id: "directorio",
      title: "Directorio",
      description: "Designar miembros del directorio",
      route: "/registro-societario/sociedades/crear/directorio",
      status: "pending",
      icon: "Users2",
    },
    {
      id: "apoderados",
      title: "Apoderados",
      description: "Designar apoderados",
      route: "/registro-societario/sociedades/crear/apoderados",
      status: "pending",
      icon: "UserCheck",
      optional: true, // Este paso es opcional
    },
    {
      id: "documentos",
      title: "Documentos",
      description: "Adjuntar documentación requerida",
      route: "/registro-societario/sociedades/crear/documentos",
      status: "pending",
      icon: "FileUp",
    },
    {
      id: "revision",
      title: "Revisión",
      description: "Revisa y confirma la información",
      route: "/registro-societario/sociedades/crear/revision",
      status: "pending",
      icon: "Eye",
    },
    {
      id: "confirmacion",
      title: "Confirmación",
      description: "Registro completado",
      route: "/registro-societario/sociedades/crear/confirmacion",
      status: "pending",
      icon: "CheckCircle",
    },
  ],

  persistence: {
    enabled: true,
    backend: {
      endpoint: "/api/sociedades/crear/progress",
      method: "PUT",
      pathKey: "path_current",
    },
    localStorage: {
      enabled: true,
      key: "probo_registro_sociedades",
    },
  },
};
```

### 2. Layout Maestro

```vue
<!-- pages/registro-societario/sociedades/[mode]/layout.vue -->
<template>
  <DoubleSidebarLayout
    :config="config"
    :is-wizard-flow="true"
    :show-progress-bar="true"
    :show-footer-actions="true"
    :is-loading="isLoading"
    :left-sidebar="{
      visible: true,
      collapsible: true,
      defaultCollapsed: false,
    }"
    :right-sidebar="{
      visible: true,
      mode: 'progress',
      width: '380px',
    }"
  >
    <!-- Header personalizado con info de la sociedad -->
    <template #header>
      <div v-if="sociedadData" class="bg-blue-50 border-b px-8 py-4">
        <div class="flex items-center gap-4">
          <Building class="w-5 h-5 text-blue-600" />
          <div>
            <p class="text-sm text-gray-600">Registrando</p>
            <p class="font-semibold">{{ sociedadData.nombre }}</p>
          </div>
          <div class="ml-auto">
            <Badge variant="secondary"> {{ currentStep?.title }} </Badge>
          </div>
        </div>
      </div>
    </template>

    <!-- Contenido principal -->
    <NuxtPage :key="route.fullPath" />

    <!-- Footer actions personalizado -->
    <template #footer>
      <div class="flex items-center justify-between px-8 py-4 border-t">
        <Button
          variant="outline"
          :disabled="!canGoPrev"
          @click="prevStep"
        >
          <ChevronLeft class="w-4 h-4 mr-2" />
          Anterior
        </Button>

        <div class="text-sm text-gray-600">
          Paso {{ currentStepIndex + 1 }} de {{ steps.length }}
        </div>

        <Button
          :disabled="!canGoNext || isLoading"
          @click="nextStep"
        >
          {{ isLastStep ? "Finalizar" : "Siguiente" }}
          <ChevronRight v-if="!isLastStep" class="w-4 h-4 ml-2" />
          <Check v-else class="w-4 h-4 ml-2" />
        </Button>
      </div>
    </template>
  </DoubleSidebarLayout>
</template>

<script setup lang="ts">
  import { registroSociedadesConfig } from "~/config/flows/registro-sociedades";
  import { Building, ChevronLeft, ChevronRight, Check } from "lucide-vue-next";

  const route = useRoute();
  const config = registroSociedadesConfig;

  const {
    steps,
    currentStep,
    currentStepIndex,
    isLoading,
    canGoPrev,
    canGoNext,
    prevStep,
    nextStep,
  } = useFlowNavigation("registro-sociedades");

  // Datos de la sociedad en creación
  const sociedadData = ref(null);

  const isLastStep = computed(() => currentStepIndex.value === steps.value.length - 1);

  // Cargar datos de la sociedad
  onMounted(async () => {
    const { data } = await useFetch("/api/sociedades/crear/draft");
    sociedadData.value = data.value;
  });
</script>
```

### 3. Página de Paso Individual

```vue
<!-- pages/registro-societario/sociedades/[mode]/accionistas.vue -->
<template>
  <div class="max-w-5xl mx-auto p-8">
    <!-- Encabezado del paso -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Accionistas</h1>
      <p class="text-gray-600">
        Agrega los accionistas de la sociedad y define su participación en el capital social.
      </p>
    </div>

    <!-- Lista de accionistas -->
    <div id="lista" class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold">Lista de Accionistas</h2>
        <Button @click="openAddModal">
          <Plus class="w-4 h-4 mr-2" />
          Agregar Accionista
        </Button>
      </div>

      <AccionistasTable :accionistas="accionistas" @edit="editAccionista" @delete="deleteAccionista" />
    </div>

    <!-- Distribución de capital -->
    <div id="capital" class="mb-8">
      <h2 class="text-xl font-semibold mb-6">Distribución de Capital</h2>
      <CapitalDistributionChart :accionistas="accionistas" />

      <Alert v-if="!capitalDistribuidoCompleto" variant="warning" class="mt-4">
        <AlertCircle class="w-4 h-4" />
        <AlertTitle>Capital no distribuido completamente</AlertTitle>
        <AlertDescription>
          Falta distribuir {{ capitalRestante }}% del capital social.
        </AlertDescription>
      </Alert>
    </div>

    <!-- Modal para agregar/editar -->
    <AccionistaModal v-model:open="showModal" :accionista="selectedAccionista" @save="saveAccionista" />
  </div>
</template>

<script setup lang="ts">
  import { Plus, AlertCircle } from "lucide-vue-next";

  const { saveProgress } = useFlowNavigation("registro-sociedades");

  const accionistas = ref([]);
  const showModal = ref(false);
  const selectedAccionista = ref(null);

  const capitalDistribuidoCompleto = computed(() => {
    const total = accionistas.value.reduce((sum, a) => sum + a.porcentaje, 0);
    return total === 100;
  });

  const capitalRestante = computed(() => {
    const total = accionistas.value.reduce((sum, a) => sum + a.porcentaje, 0);
    return 100 - total;
  });

  const openAddModal = () => {
    selectedAccionista.value = null;
    showModal.value = true;
  };

  const editAccionista = (accionista) => {
    selectedAccionista.value = accionista;
    showModal.value = true;
  };

  const deleteAccionista = async (id) => {
    accionistas.value = accionistas.value.filter((a) => a.id !== id);
    await saveProgress({ formData: { accionistas: accionistas.value } });
  };

  const saveAccionista = async (data) => {
    if (selectedAccionista.value) {
      // Editar
      const index = accionistas.value.findIndex((a) => a.id === selectedAccionista.value.id);
      accionistas.value[index] = data;
    } else {
      // Agregar nuevo
      accionistas.value.push({ ...data, id: Date.now() });
    }

    await saveProgress({ formData: { accionistas: accionistas.value } });
    showModal.value = false;
  };

  // Cargar accionistas al montar
  onMounted(async () => {
    const { data } = await useFetch("/api/sociedades/crear/accionistas");
    accionistas.value = data.value || [];
  });
</script>
```

---

## Ejemplo 3: Documentación con ToC

### Caso de Uso

Sistema de documentación técnica con navegación por secciones y tabla de contenidos.

### 1. Configuración

```typescript
// config/flows/documentacion.ts
export const documentacionConfig: DoubleSidebarConfig = {
  flowId: "docs",
  mode: "docs", // Modo documentación

  navigation: {
    sections: [
      {
        id: "getting-started",
        title: "Getting Started",
        translationKey: "docs.gettingStarted",
        defaultExpanded: true,
        items: [
          {
            id: "introduction",
            title: "Introduction",
            translationKey: "docs.introduction",
            href: "/docs/introduction",
          },
          {
            id: "installation",
            title: "Installation",
            translationKey: "docs.installation",
            href: "/docs/installation",
          },
          {
            id: "quick-start",
            title: "Quick Start",
            translationKey: "docs.quickStart",
            href: "/docs/quick-start",
          },
        ],
      },
      {
        id: "components",
        title: "Components",
        translationKey: "docs.components",
        items: [
          {
            id: "sidebar",
            title: "Sidebar",
            translationKey: "docs.sidebar",
            href: "/docs/components/sidebar",
          },
          // ...más componentes
        ],
      },
    ],
    mode: "global",
  },

  // No hay steps, usa ToC
  steps: undefined,
};
```

### 2. Layout de Documentación

```vue
<!-- pages/docs/layout.vue -->
<template>
  <DoubleSidebarLayout
    :config="documentacionConfig"
    :is-wizard-flow="false"
    :left-sidebar="{ visible: true, width: '280px' }"
    :right-sidebar="{ visible: true, mode: 'toc', width: '240px' }"
  >
    <!-- Sidebar derecho con ToC -->
    <template #right-content>
      <TableOfContents :items="currentToc" :scroll-spy="true" />
    </template>

    <!-- Contenido de la página -->
    <article class="prose prose-lg max-w-4xl mx-auto px-8 py-12">
      <NuxtPage />
    </article>
  </DoubleSidebarLayout>
</template>

<script setup lang="ts">
  import { documentacionConfig } from "~/config/flows/documentacion";

  const route = useRoute();

  // ToC dinámico según la ruta
  const currentToc = computed(() => {
    return tocByRoute[route.path] || [];
  });

  // Mapa de ToC por ruta
  const tocByRoute: Record<string, TocItem[]> = {
    "/docs/introduction": [
      { id: "overview", title: "Overview", level: 2 },
      { id: "why-probo", title: "Why Probo?", level: 2 },
      { id: "key-features", title: "Key Features", level: 2 },
    ],
    "/docs/components/sidebar": [
      { id: "usage", title: "Usage", level: 2 },
      { id: "api", title: "API Reference", level: 2 },
      { id: "examples", title: "Examples", level: 2 },
    ],
    // ...más rutas
  };
</script>
```

### 3. Componente TableOfContents

```vue
<!-- components/TableOfContents.vue -->
<template>
  <div class="sticky top-8">
    <h4 class="text-sm font-semibold mb-4 text-gray-900">En esta página</h4>

    <nav class="space-y-1">
      <a
        v-for="item in items"
        :key="item.id"
        :href="`#${item.id}`"
        :class="[
          'block py-2 text-sm transition-colors',
          item.level === 2 ? 'pl-0' : 'pl-4',
          activeId === item.id
            ? 'text-primary-600 font-medium'
            : 'text-gray-600 hover:text-gray-900',
        ]"
        @click.prevent="scrollToSection(item.id)"
      >
        {{ item.title }}
      </a>
    </nav>
  </div>
</template>

<script setup lang="ts">
  interface TocItem {
    id: string;
    title: string;
    level: number;
  }

  interface Props {
    items: TocItem[];
    scrollSpy?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    scrollSpy: true,
  });

  const activeId = ref("");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      activeId.value = id;
    }
  };

  // Scroll spy: detectar sección visible
  onMounted(() => {
    if (!props.scrollSpy) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id;
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    props.items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    onUnmounted(() => observer.disconnect());
  });
</script>
```

---

## Ejemplo 4: Dashboard Híbrido

### Caso de Uso

Dashboard con navegación modular en el sidebar izquierdo y widgets/acciones rápidas en el derecho.

### 1. Layout del Dashboard

```vue
<!-- pages/dashboard/layout.vue -->
<template>
  <DoubleSidebarLayout
    :left-sidebar="{ visible: true, collapsible: true }"
    :right-sidebar="{ visible: true, mode: 'custom', width: '320px' }"
  >
    <!-- Sidebar izquierdo: Navegación del módulo -->
    <template #left-content>
      <MainSidebar :navigation="dashboardNavigation" />
    </template>

    <!-- Sidebar derecho: Widgets -->
    <template #right-content>
      <div class="p-4 space-y-6">
        <!-- Quick Actions -->
        <Card>
          <CardHeader>
            <CardTitle class="text-sm">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent class="space-y-2">
            <Button variant="outline" size="sm" class="w-full justify-start" @click="nuevaSociedad">
              <Plus class="w-4 h-4 mr-2" />
              Nueva Sociedad
            </Button>
            <Button variant="outline" size="sm" class="w-full justify-start" @click="nuevaJunta">
              <Calendar class="w-4 h-4 mr-2" />
              Nueva Junta
            </Button>
            <Button variant="outline" size="sm" class="w-full justify-start" @click="buscarDocumento">
              <Search class="w-4 h-4 mr-2" />
              Buscar Documento
            </Button>
          </CardContent>
        </Card>

        <!-- Recent Activity -->
        <Card>
          <CardHeader>
            <CardTitle class="text-sm">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivityList :items="recentActivity" />
          </CardContent>
        </Card>

        <!-- Notifications -->
        <Card>
          <CardHeader>
            <CardTitle class="text-sm flex items-center justify-between">
              Notificaciones
              <Badge variant="secondary">{{ unreadCount }}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationsList :notifications="notifications" />
          </CardContent>
        </Card>
      </div>
    </template>

    <!-- Contenido principal -->
    <NuxtPage />
  </DoubleSidebarLayout>
</template>

<script setup lang="ts">
  import { Plus, Calendar, Search } from "lucide-vue-next";

  const dashboardNavigation = {
    sections: [
      {
        id: "dashboard",
        title: "Dashboard",
        items: [
          { id: "overview", title: "Overview", href: "/dashboard" },
          { id: "analytics", title: "Analytics", href: "/dashboard/analytics" },
        ],
      },
      // ...más secciones
    ],
  };

  const recentActivity = ref([]);
  const notifications = ref([]);
  const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length);

  const nuevaSociedad = () => navigateTo("/registro-societario/sociedades/crear");
  const nuevaJunta = () => navigateTo("/operaciones/juntas/nueva");
  const buscarDocumento = () => navigateTo("/storage/search");
</script>
```

---

## Ejemplo 5: Validaciones Avanzadas

### Caso de Uso

Flujo con validaciones complejas, bloqueo condicional de pasos y confirmaciones.

### 1. Configuración con Validaciones

```typescript
// config/flows/flujo-complejo.ts
export const flujoComplejoConfig: DoubleSidebarConfig = {
  flowId: "flujo-complejo",
  mode: "wizard",

  steps: [
    {
      id: "datos-basicos",
      title: "Datos Básicos",
      route: "/flujo/datos-basicos",
      status: "active",

      // Validación para poder SALIR del paso
      onExit: async (context) => {
        const { formData } = context;

        // Validar campos requeridos
        if (!formData.nombre) {
          throw new Error("El nombre es requerido");
        }

        if (!formData.email || !isValidEmail(formData.email)) {
          throw new Error("El email es inválido");
        }

        // Llamar a API para validar
        const { data, error } = await useFetch("/api/validar-datos-basicos", {
          method: "POST",
          body: formData,
        });

        if (error.value) {
          throw new Error(error.value.message);
        }

        return true;
      },
    },
    {
      id: "paso-condicional",
      title: "Paso Condicional",
      route: "/flujo/paso-condicional",
      status: "pending",

      // Validación para poder ENTRAR al paso
      canNavigateTo: (context) => {
        // Solo puede entrar si completó el paso anterior
        if (!context.completedSteps.includes(0)) {
          return false;
        }

        // Y si tiene un rol específico
        if (!context.user.hasRole("admin")) {
          return false;
        }

        return true;
      },

      // Hook al entrar
      onEnter: async (context) => {
        console.log("Entrando al paso condicional");

        // Cargar datos específicos de este paso
        const { data } = await useFetch("/api/data-for-step");
        context.formData.additionalData = data.value;
      },
    },
    {
      id: "confirmacion",
      title: "Confirmación",
      route: "/flujo/confirmacion",
      status: "pending",

      // Validación de bloqueo
      canNavigateTo: (context) => {
        // No puede entrar si hay errores pendientes
        if (context.formData.hasErrors) {
          return false;
        }

        // Debe haber completado al menos 2 pasos anteriores
        return context.completedSteps.length >= 2;
      },

      // Confirmación antes de salir
      onExit: async (context) => {
        const confirmed = await confirm("¿Estás seguro de finalizar el flujo?");

        if (!confirmed) {
          throw new Error("Operación cancelada");
        }

        // Enviar datos finales al backend
        await $fetch("/api/finalizar-flujo", {
          method: "POST",
          body: context.formData,
        });
      },
    },
  ],
};
```

### 2. Uso en Componente

```vue
<!-- pages/flujo/datos-basicos.vue -->
<template>
  <div class="max-w-2xl mx-auto p-8">
    <form @submit.prevent="handleNext">
      <div class="space-y-6">
        <div>
          <Label for="nombre">Nombre *</Label>
          <Input id="nombre" v-model="form.nombre" :error="errors.nombre" required />
          <p v-if="errors.nombre" class="text-sm text-red-600 mt-1">
            {{ errors.nombre }}
          </p>
        </div>

        <div>
          <Label for="email">Email *</Label>
          <Input id="email" v-model="form.email" type="email" :error="errors.email" required />
          <p v-if="errors.email" class="text-sm text-red-600 mt-1">
            {{ errors.email }}
          </p>
        </div>

        <Button type="submit" :disabled="isLoading">
          {{ isLoading ? "Validando..." : "Siguiente" }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  const { nextStep, saveProgress, isDirty } = useFlowNavigation("flujo-complejo");

  const form = reactive({
    nombre: "",
    email: "",
  });

  const errors = reactive({
    nombre: "",
    email: "",
  });

  const isLoading = ref(false);

  const handleNext = async () => {
    // Limpiar errores
    errors.nombre = "";
    errors.email = "";

    try {
      isLoading.value = true;

      // Guardar progreso
      await saveProgress({ formData: form });

      // Intentar avanzar al siguiente paso
      // El onExit del step se ejecutará automáticamente
      await nextStep();
    } catch (error) {
      // Si falla la validación del onExit, se muestra el error
      toast.error(error.message);

      // Parsear errores de campo
      if (error.fieldErrors) {
        Object.assign(errors, error.fieldErrors);
      }
    } finally {
      isLoading.value = false;
    }
  };

  // Guardar automáticamente al cambiar
  watch(
    form,
    debounce(async () => {
      if (isDirty.value) {
        await saveProgress({ formData: form, silent: true });
      }
    }, 1000)
  );
</script>
```

---

## Ejemplo 6: Persistencia Custom

### Caso de Uso

Implementar lógica personalizada de persistencia con sincronización compleja.

### 1. Composable Custom

```typescript
// composables/useCustomFlowPersistence.ts
export function useCustomFlowPersistence(flowId: string) {
  const { saveProgress, restoreProgress } = useFlowNavigation(flowId);

  // Guardar con retry y queue
  const saveQueue = ref<Array<any>>([]);
  const isSyncing = ref(false);

  const queueSave = async (data: any) => {
    saveQueue.value.push(data);

    if (!isSyncing.value) {
      await processSaveQueue();
    }
  };

  const processSaveQueue = async () => {
    if (saveQueue.value.length === 0) return;

    isSyncing.value = true;

    while (saveQueue.value.length > 0) {
      const data = saveQueue.value[0];

      try {
        await saveProgress(data);
        saveQueue.value.shift(); // Remover si fue exitoso
      } catch (error) {
        console.error("Error saving progress:", error);

        // Retry con backoff exponencial
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Si falla después de 3 intentos, guardar en localStorage
        if (data.retries > 3) {
          await saveToLocalStorage(data);
          saveQueue.value.shift();
        } else {
          data.retries = (data.retries || 0) + 1;
        }
      }
    }

    isSyncing.value = false;
  };

  const saveToLocalStorage = async (data: any) => {
    const key = `probo_${flowId}_backup_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(data));
    console.log("Saved to localStorage as backup:", key);
  };

  // Restaurar con merge inteligente
  const smartRestore = async () => {
    // Intentar restaurar desde backend
    let backendData = null;
    try {
      backendData = await restoreProgress();
    } catch (error) {
      console.error("Failed to restore from backend:", error);
    }

    // Buscar backups en localStorage
    const localBackups = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`probo_${flowId}_backup_`)) {
        const data = JSON.parse(localStorage.getItem(key)!);
        localBackups.push(data);
      }
    }

    // Merge: priorizar datos más recientes
    if (backendData && localBackups.length > 0) {
      const merged = mergeProgressData(backendData, localBackups);
      return merged;
    }

    return backendData || (localBackups.length > 0 ? localBackups[0] : null);
  };

  const mergeProgressData = (backend: any, locals: any[]) => {
    // Lógica de merge personalizada
    const mostRecent = [backend, ...locals].sort(
      (a, b) => b.timestamp - a.timestamp
    )[0];

    // Combinar completedSteps (unión)
    const allCompleted = new Set([
      ...backend.completedSteps,
      ...locals.flatMap((l) => l.completedSteps),
    ]);

    return {
      ...mostRecent,
      completedSteps: Array.from(allCompleted),
    };
  };

  // Auto-save cada 30 segundos
  const autoSaveInterval = ref<NodeJS.Timeout | null>(null);

  const startAutoSave = (getData: () => any) => {
    autoSaveInterval.value = setInterval(async () => {
      const data = getData();
      if (data.isDirty) {
        await queueSave(data);
      }
    }, 30000); // 30 segundos
  };

  const stopAutoSave = () => {
    if (autoSaveInterval.value) {
      clearInterval(autoSaveInterval.value);
      autoSaveInterval.value = null;
    }
  };

  // Cleanup
  onUnmounted(() => {
    stopAutoSave();
  });

  return {
    queueSave,
    smartRestore,
    startAutoSave,
    stopAutoSave,
    isSyncing,
    pendingSaves: computed(() => saveQueue.value.length),
  };
}
```

### 2. Uso en Componente

```vue
<script setup lang="ts">
  const { queueSave, smartRestore, startAutoSave, isSyncing } =
    useCustomFlowPersistence("mi-flujo");

  const form = reactive({
    /* ... */
  });

  // Restaurar al montar
  onMounted(async () => {
    const restored = await smartRestore();
    if (restored?.formData) {
      Object.assign(form, restored.formData);
    }
  });

  // Auto-save
  startAutoSave(() => ({
    formData: form,
    isDirty: isDirty.value,
  }));

  // Guardar manualmente
  const handleSave = async () => {
    await queueSave({
      formData: form,
      timestamp: Date.now(),
    });
  };
</script>

<template>
  <div>
    <!-- Indicador de sincronización -->
    <div v-if="isSyncing" class="fixed bottom-4 right-4 bg-blue-100 px-4 py-2 rounded-lg">
      <Loader2 class="w-4 h-4 animate-spin inline mr-2" />
      Guardando...
    </div>

    <!-- Tu formulario -->
    <form @submit.prevent="handleNext">
      <!-- ... -->
    </form>
  </div>
</template>
```

---

## 🎓 Conclusión

Estos ejemplos cubren los casos de uso más comunes:

1. ✅ **Flujo wizard simple** - Onboarding básico
2. ✅ **Migración completa** - Registro de Sociedades
3. ✅ **Documentación** - Sistema de docs con ToC
4. ✅ **Dashboard híbrido** - Navegación + widgets
5. ✅ **Validaciones avanzadas** - Flujos complejos
6. ✅ **Persistencia custom** - Lógica personalizada

El sistema es **extremadamente flexible** y puede adaptarse a cualquier caso de uso. 🚀

---

**Siguiente paso**: Implementar la Fase 1 del plan! 💪

````
