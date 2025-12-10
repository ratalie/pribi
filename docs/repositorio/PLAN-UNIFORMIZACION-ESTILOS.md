# 🎨 PLAN DE UNIFORMIZACIÓN DE ESTILOS - REPOSITORIO

**Objetivo:** Adaptar todas las páginas del repositorio para que tengan el mismo estilo visual que las páginas mejoradas (dashboard, agregar sociedad, historial, etc.)

---

## 📋 ESTADO ACTUAL

### Páginas del Repositorio

1. **`/storage/dashboard`** - Dashboard principal
   - Usa: `RepositoryDashboard` component
   - Tiene gráficos y stats
   - Selector de sociedad integrado

2. **`/storage/almacen`** - Almacén de documentos
   - Usa: `AlmacenView` component
   - Vista estilo Google Drive

3. **`/storage/documentos-generados`** - Documentos generados
   - Vista inicial con categorías
   - Navegación a subcarpetas

4. **`/storage/carpetas-personalizadas`** - Carpetas personalizadas
   - Usa: `CarpetasPersonalizadasView` component
   - Lista de carpetas custom

5. **`/storage/carpetas-personalizadas/[id]`** - Detalle de carpeta
   - Vista de detalle de carpeta personalizada

---

## 🎯 ESTILO OBJETIVO (Filosofía Actual)

### Patrón de Header (Estándar)

```vue
<div class="bg-white border-b border-gray-200 shadow-sm">
  <div class="max-w-[1600px] mx-auto px-8 py-8">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
          style="background: linear-gradient(135deg, var(--primary-700), var(--primary-500))"
        >
          <IconComponent class="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 class="text-3xl font-bold mb-1" style="color: var(--text-primary); font-family: var(--font-primary);">
            Título de la Página
          </h1>
          <p class="text-base" style="color: var(--text-muted); font-family: var(--font-secondary);">
            Descripción de la página
          </p>
        </div>
      </div>
      <!-- Botones de acción (opcional) -->
    </div>
  </div>
</div>
```

### Patrón de Contenido

```vue
<div class="min-h-full bg-gray-50">
  <!-- Header (arriba) -->
  
  <!-- Contenido Principal -->
  <div class="max-w-[1600px] mx-auto px-8 py-10">
    <!-- Contenido aquí -->
  </div>
</div>
```

### Características del Estilo

- ✅ **Header fijo** con icono grande (14x14) con gradiente
- ✅ **Max-width 1600px** centrado
- ✅ **Padding consistente** (px-8 py-8 para header, px-8 py-10 para contenido)
- ✅ **Fondo gris claro** (bg-gray-50)
- ✅ **Tipografía PROBO** (var(--font-primary), var(--font-secondary))
- ✅ **Colores PROBO** (var(--text-primary), var(--text-muted), etc.)
- ✅ **Cards con rounded-xl** y sombras suaves
- ✅ **Iconos en badges y estados**

---

## 📝 PLAN DE IMPLEMENTACIÓN

### Fase 1: Dashboard (`/storage/dashboard`)

**Cambios necesarios:**

1. **Agregar Header estándar:**
   - Icono: `HardDrive` o `FolderOpen`
   - Título: "Dashboard del Repositorio"
   - Descripción: "Vista general de documentos y métricas"

2. **Mantener funcionalidad:**
   - Selector de sociedad (moverlo dentro del contenido)
   - Stats cards (mejorar estilo)
   - Gráficos (mantener, pero mejorar contenedores)

3. **Mejorar cards:**
   - Usar `rounded-xl` en lugar de `rounded-lg`
   - Mejorar sombras
   - Agregar iconos más grandes

**Archivo a modificar:**
- `app/pages/storage/dashboard.vue`
- `app/components/repository/RepositoryDashboard.vue` (ajustar estilos internos)

---

### Fase 2: Almacén (`/storage/almacen`)

**Cambios necesarios:**

1. **Agregar Header estándar:**
   - Icono: `FolderOpen` o `FileText`
   - Título: "Almacén de Documentos"
   - Descripción: "Gestiona tus documentos societarios estilo Google Drive"

2. **Mejorar vista:**
   - Mantener funcionalidad de Google Drive
   - Mejorar cards de documentos
   - Agregar iconos más visibles

**Archivo a modificar:**
- `app/pages/storage/almacen.vue`
- `app/components/repository/AlmacenView.vue` (ajustar estilos)

---

### Fase 3: Documentos Generados (`/storage/documentos-generados`)

**Cambios necesarios:**

1. **Agregar Header estándar:**
   - Icono: `FileText` o `Folder`
   - Título: "Documentos Generados"
   - Descripción: "Documentos creados automáticamente por el sistema"

2. **Mejorar vista inicial:**
   - Cards de categorías más elegantes
   - Iconos más grandes
   - Mejor espaciado

**Archivo a modificar:**
- `app/pages/storage/documentos-generados/index.vue`

---

### Fase 4: Carpetas Personalizadas (`/storage/carpetas-personalizadas`)

**Cambios necesarios:**

1. **Agregar Header estándar:**
   - Icono: `FolderOpen` o `Sparkles`
   - Título: "Carpetas Personalizadas"
   - Descripción: "Espacios de trabajo personalizados con IA"
   - Botón: "Crear Carpeta" (si aplica)

2. **Mejorar lista:**
   - Cards más elegantes
   - Mejor grid layout
   - Iconos y badges mejorados

**Archivo a modificar:**
- `app/pages/storage/carpetas-personalizadas.vue`
- `app/components/repository/CarpetasPersonalizadasView.vue`

---

### Fase 5: Detalle de Carpeta (`/storage/carpetas-personalizadas/[id]`)

**Cambios necesarios:**

1. **Agregar Header estándar:**
   - Icono: `FolderOpen`
   - Título: Nombre de la carpeta (dinámico)
   - Descripción: Información de la carpeta
   - Botones: Editar, Eliminar (si aplica)

2. **Mejorar vista de documentos:**
   - Lista más elegante
   - Mejor preview
   - Iconos consistentes

**Archivo a modificar:**
- `app/pages/storage/carpetas-personalizadas/[id].vue`

---

## 🎨 COMPONENTES A CREAR/MEJORAR

### 1. Header Component Reutilizable

Ya tenemos `DashboardHeader.vue`, pero podemos crear uno más genérico:

```vue
<!-- app/components/repository/RepositoryHeader.vue -->
<script setup lang="ts">
  import type { Component } from "vue";
  
  interface Props {
    title: string;
    subtitle: string;
    icon: Component;
    showActions?: boolean;
  }
  
  defineProps<Props>();
</script>

<template>
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-[1600px] mx-auto px-8 py-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style="background: linear-gradient(135deg, var(--primary-700), var(--primary-500))"
          >
            <component :is="icon" class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1
              class="text-3xl font-bold mb-1"
              style="color: var(--text-primary); font-family: var(--font-primary);"
            >
              {{ title }}
            </h1>
            <p
              class="text-base"
              style="color: var(--text-muted); font-family: var(--font-secondary);"
            >
              {{ subtitle }}
            </p>
          </div>
        </div>
        <div v-if="showActions" class="flex items-center gap-3">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>
```

### 2. Mejorar Cards de Documentos

Aplicar estilos consistentes a todas las cards de documentos.

### 3. Mejorar Selector de Sociedad

Ya existe `SocietySelector`, pero podemos mejorar su estilo para que sea más consistente.

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Dashboard
- [ ] Agregar header estándar
- [ ] Mover selector de sociedad dentro del contenido
- [ ] Mejorar stats cards
- [ ] Mejorar contenedores de gráficos
- [ ] Aplicar max-w-[1600px] y padding consistente

### Almacén
- [ ] Agregar header estándar
- [ ] Mejorar cards de documentos
- [ ] Agregar iconos más visibles
- [ ] Mejorar vista de carpetas

### Documentos Generados
- [ ] Agregar header estándar
- [ ] Mejorar cards de categorías
- [ ] Mejorar navegación
- [ ] Agregar breadcrumbs (si aplica)

### Carpetas Personalizadas
- [ ] Agregar header estándar
- [ ] Agregar botón "Crear Carpeta"
- [ ] Mejorar grid de carpetas
- [ ] Mejorar cards

### Detalle de Carpeta
- [ ] Agregar header estándar (dinámico)
- [ ] Agregar botones de acción
- [ ] Mejorar lista de documentos
- [ ] Mejorar preview

---

## 🎯 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. **Dashboard** (más visible, establece el patrón)
2. **Almacén** (vista principal de documentos)
3. **Documentos Generados** (vista secundaria)
4. **Carpetas Personalizadas** (lista)
5. **Detalle de Carpeta** (vista de detalle)

---

## 📝 NOTAS IMPORTANTES

### Mantener Funcionalidad

- ⚠️ **NO cambiar la funcionalidad existente**
- ⚠️ **Solo mejorar estilos visuales**
- ⚠️ **Mantener todos los componentes internos funcionando**

### Selector de Sociedad

- El selector puede moverse dentro del contenido principal
- O mantenerse en el header si es crítico
- Aplicar estilos consistentes

### Gráficos

- Mantener los gráficos del dashboard
- Solo mejorar contenedores y espaciado
- No cambiar la lógica de datos

---

## 🚀 PRÓXIMOS PASOS

1. **Revisar y aprobar este plan**
2. **Empezar con Dashboard** (Fase 1)
3. **Continuar con las demás fases**
4. **Testing visual** de todas las páginas
5. **Ajustes finales** según feedback

---

**Última actualización:** Diciembre 2024
**Estado:** 📋 Plan listo para implementar


