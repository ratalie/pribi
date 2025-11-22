# 🎯 PLAN: Layout para Juntas

**Fecha:** $(date)  
**Objetivo:** Crear `flow-layout-juntas` y modificar `registros.vue` para soportarlo

---

## ✅ TU ENTENDIMIENTO (CORRECTO)

### 1. Crear Nuevo Layout
```
app/layouts/flow-layout-juntas.vue
```
- Similar a `flow-layout.vue` pero con sidebar de juntas
- Usará el nuevo sidebar-juntas (cuando lo crees)

### 2. Modificar Layout Registros
```
app/layouts/registros.vue
```
- Detectar si debe usar `flow-layout` (para registros)
- O `flow-layout-juntas` (para juntas)
- Ambos pueden coexistir

### 3. Uso en Páginas

**Páginas de Registros:**
```vue
definePageMeta({
  layout: "registros",
  flowLayout: true,  // → Activa flow-layout
});
```

**Páginas de Juntas:**
```vue
definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true,  // → Activa flow-layout-juntas
});
```

---

## 📋 ESTRUCTURA PROPUESTA

### Opción A: Flags Separados (Recomendada)

```vue
<!-- app/layouts/registros.vue -->
<script setup lang="ts">
  const route = useRoute();
  
  // Detectar qué layout anidar
  const isFlowLayout = computed(() => route.meta.flowLayout === true);
  const isFlowLayoutJuntas = computed(() => route.meta.flowLayoutJuntas === true);
</script>

<template>
  <div>
    <ProboSidebar />
    <main>
      <!-- Layout para registros -->
      <NuxtLayout v-if="isFlowLayout" name="flow-layout">
        <slot />
      </NuxtLayout>
      
      <!-- Layout para juntas -->
      <NuxtLayout v-else-if="isFlowLayoutJuntas" name="flow-layout-juntas">
        <slot />
      </NuxtLayout>
      
      <!-- Sin layout anidado -->
      <slot v-else />
    </main>
  </div>
</template>
```

**Ventajas:**
- ✅ Explícito y claro
- ✅ Fácil de entender
- ✅ Fácil de extender (agregar más layouts)

---

## 🎯 IMPLEMENTACIÓN PASO A PASO

### Paso 1: Crear `flow-layout-juntas.vue`

```vue
<!-- app/layouts/flow-layout-juntas.vue -->
<script setup lang="ts">
  // Aquí irá la lógica del sidebar de juntas
  // Por ahora, estructura básica
</script>

<template>
  <div class="flow-layout-juntas">
    <!-- Sidebar de Juntas (cuando lo crees) -->
    <SidebarJuntas />
    
    <!-- Contenido principal -->
    <main class="content-area">
      <slot />
    </main>
  </div>
</template>
```

### Paso 2: Modificar `registros.vue`

```vue
<!-- app/layouts/registros.vue -->
<script setup lang="ts">
  const route = useRoute();
  
  // Detectar qué layout anidar
  const isFlowLayout = computed(() => route.meta.flowLayout === true);
  const isFlowLayoutJuntas = computed(() => route.meta.flowLayoutJuntas === true);
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-safe">
    <ProboSidebar />
    
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-y-auto">
        <!-- Layout para registros (sociedades) -->
        <NuxtLayout v-if="isFlowLayout" name="flow-layout">
          <slot />
        </NuxtLayout>
        
        <!-- Layout para juntas -->
        <NuxtLayout v-else-if="isFlowLayoutJuntas" name="flow-layout-juntas">
          <slot />
        </NuxtLayout>
        
        <!-- Sin layout anidado -->
        <slot v-else />
      </main>
    </div>
  </div>
</template>
```

### Paso 3: Actualizar Páginas de Juntas

```vue
<!-- app/pages/operaciones/junta-accionistas/detalles/index.vue -->
<script setup lang="ts">
  definePageMeta({
    layout: "registros",        // Layout base
    flowLayoutJuntas: true,     // Activa flow-layout-juntas
  });
</script>
```

---

## 🔄 FLUJO COMPLETO

### Para Registros (Sociedades)

```
1. Página define:
   - layout: "registros"
   - flowLayout: true

2. Renderiza:
   └─ registros.vue
      └─ ProboSidebar
      └─ flow-layout.vue
         └─ ProgressNavBar
         └─ Contenido
```

### Para Juntas

```
1. Página define:
   - layout: "registros"
   - flowLayoutJuntas: true

2. Renderiza:
   └─ registros.vue
      └─ ProboSidebar
      └─ flow-layout-juntas.vue
         └─ SidebarJuntas (nuevo)
         └─ Contenido
```

---

## ✅ CHECKLIST

### Fase 1: Estructura Base
- [ ] Crear `app/layouts/flow-layout-juntas.vue` (estructura básica)
- [ ] Modificar `app/layouts/registros.vue` para detectar `flowLayoutJuntas`
- [ ] Probar que funciona (sin sidebar aún)

### Fase 2: Sidebar de Juntas
- [ ] Crear componente `SidebarJuntas` (cuando estés listo)
- [ ] Integrar en `flow-layout-juntas.vue`
- [ ] Probar navegación

### Fase 3: Migración de Páginas
- [ ] Actualizar páginas de juntas para usar `layout: "registros"` + `flowLayoutJuntas: true`
- [ ] Remover referencias a `dual-panel-layout` (ya eliminado)

---

## 🎯 DECISIÓN IMPORTANTE

**¿El layout `registros` es solo para registros o también para juntas?**

### Opción A: Layout Separado para Juntas

```vue
<!-- Páginas de juntas -->
definePageMeta({
  layout: "juntas",  // Layout específico para juntas
});
```

**Ventajas:**
- ✅ Separación clara
- ✅ Más explícito

**Desventajas:**
- ⚠️ Duplicación de código (ProboSidebar en ambos)

### Opción B: Layout Compartido (Tu Propuesta) ✅

```vue
<!-- Páginas de juntas -->
definePageMeta({
  layout: "registros",      // Layout compartido
  flowLayoutJuntas: true,    // Flag para juntas
});
```

**Ventajas:**
- ✅ Reutiliza ProboSidebar
- ✅ Un solo layout base
- ✅ Fácil de mantener

**Recomendación:** ✅ **Opción B** (tu propuesta es mejor)

---

## 📝 RESUMEN

**Tu entendimiento es 100% correcto:**

1. ✅ Crear `flow-layout-juntas.vue`
2. ✅ Modificar `registros.vue` para detectar `flowLayoutJuntas`
3. ✅ Ambos layouts pueden coexistir
4. ✅ El componente a atacar es `registros.vue`

**¿Procedo con la implementación?** 🚀

