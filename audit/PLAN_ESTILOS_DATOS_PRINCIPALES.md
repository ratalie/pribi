# 🎨 PLAN DE MIGRACIÓN DE ESTILOS - Datos Principales

**Fecha:** 15 de Noviembre, 2025  
**Objetivo:** Aplicar estilos de Figma (DatosSociedadStep.vue) a la nueva versión (DatosSociedadForm.vue)  
**Estado:** 📋 Plan de acción

---

## 📊 Análisis Comparativo de Estilos

### Vista LEGACY (registro-societario) - ✅ Cumple con Figma

**Archivo:** `app/modules/registro-sociedades/components/steps/DatosSociedadStep.vue`

```vue
<template>
  <div class="bg-white p-14">
    <CardTitle
      title="Datos principales"
      body="Complete todos los datos requeridos."
      class="mb-8"
    />
    <Form class="grid grid-cols-2 gap-14" @submit="handleSubmit">
      <!-- Inputs con gap-14 -->
    </Form>
  </div>
</template>
```

**Estilos aplicados:**
- ✅ `bg-white` - Fondo blanco
- ✅ `p-14` - **Padding 56px** (3.5rem)
- ✅ `mb-8` - **Margen bottom 32px** para título
- ✅ `gap-14` - **Gap 56px** entre campos del formulario
- ✅ Grid de 2 columnas
- ✅ Sin bordes/sombras en el contenedor principal

---

### Vista NUEVA (registros) - ⚠️ Estilos hardcodeados diferentes

**Archivo:** `app/core/presentation/registros/sociedades/pasos/datos-sociedad/DatosSociedadForm.vue`

```vue
<template>
  <div class="rounded-2xl border border-primary-300/40 bg-white shadow-sm">
    <div class="border-b border-primary-200/40 p-6">
      <CardTitle
        title="Datos principales"
        body="Completa o revisa los datos generales de la sociedad."
      />
    </div>
    <div v-else class="p-10">
      <Form class="grid grid-cols-2 gap-8" @submit="handleSubmit">
        <!-- Inputs con gap-8 -->
      </Form>
    </div>
  </div>
</template>
```

**Estilos aplicados (diferentes a Figma):**
- ⚠️ `rounded-2xl` - Bordes redondeados (NO en Figma)
- ⚠️ `border border-primary-300/40` - Borde con color (NO en Figma)
- ⚠️ `shadow-sm` - Sombra (NO en Figma)
- ⚠️ `border-b border-primary-200/40` - Separador header (NO en Figma)
- ⚠️ `p-6` - **Padding 24px** (debería ser `p-14` = 56px)
- ⚠️ `p-10` - **Padding 40px** en form (debería ser `p-14` = 56px)
- ⚠️ `gap-8` - **Gap 32px** entre inputs (debería ser `gap-14` = 56px)
- ⚠️ `mb-8` ausente en CardTitle

---

## 🎯 Cambios Necesarios - Resumen

### 1. Contenedor Principal
```vue
<!-- ❌ ACTUAL (nuevo) -->
<div class="rounded-2xl border border-primary-300/40 bg-white shadow-sm">

<!-- ✅ DEBE SER (como Figma) -->
<div class="bg-white p-14">
```

### 2. Header / CardTitle
```vue
<!-- ❌ ACTUAL (nuevo) -->
<div class="border-b border-primary-200/40 p-6">
  <CardTitle
    title="Datos principales"
    body="Completa o revisa los datos generales de la sociedad."
  />
</div>

<!-- ✅ DEBE SER (como Figma) -->
<CardTitle
  title="Datos principales"
  body="Complete todos los datos requeridos."
  class="mb-8"
/>
```

### 3. Contenedor del Formulario
```vue
<!-- ❌ ACTUAL (nuevo) -->
<div v-else class="p-10">
  <Form class="grid grid-cols-2 gap-8">

<!-- ✅ DEBE SER (como Figma) -->
<Form class="grid grid-cols-2 gap-14">
```

### 4. Modo Preview (ReadOnly)
```vue
<!-- ❌ ACTUAL (nuevo) -->
<div v-else-if="isReadonly" class="space-y-6 p-10">

<!-- ✅ DEBE SER (como Figma) -->
<div v-else-if="isReadonly" class="space-y-6">
```

### 5. Loading State
```vue
<!-- ❌ ACTUAL (nuevo) -->
<div v-if="isLoading" class="p-10">

<!-- ✅ DEBE SER (como Figma) -->
<div v-if="isLoading">
```

---

## 📝 Plan de Implementación Detallado

### Cambio 1: Simplificar contenedor principal

**Ubicación:** Línea ~237 de `DatosSociedadForm.vue`

**De:**
```vue
<div class="rounded-2xl border border-primary-300/40 bg-white shadow-sm">
```

**A:**
```vue
<div class="bg-white p-14">
```

**Justificación:**
- Elimina bordes redondeados (no en Figma)
- Elimina borde y sombra (no en Figma)
- Aplica padding de 56px (igual que Figma)

---

### Cambio 2: Eliminar header separado y aplicar mb-8 a CardTitle

**Ubicación:** Líneas ~238-244 de `DatosSociedadForm.vue`

**De:**
```vue
<div class="border-b border-primary-200/40 p-6">
  <CardTitle
    title="Datos principales"
    body="Completa o revisa los datos generales de la sociedad."
  />
  <p v-if="errorMessage" class="mt-3 text-sm text-red-500">
    {{ errorMessage }}
  </p>
</div>
```

**A:**
```vue
<CardTitle
  title="Datos principales"
  body="Complete todos los datos requeridos."
  class="mb-8"
/>
<p v-if="errorMessage" class="mb-8 text-sm text-red-500">
  {{ errorMessage }}
</p>
```

**Justificación:**
- Elimina el div contenedor con borde inferior
- Aplica `mb-8` (32px) al CardTitle, igual que Figma
- Mantiene mensaje de error pero con mismo margin

---

### Cambio 3: Eliminar padding del contenedor de Loading

**Ubicación:** Línea ~246 de `DatosSociedadForm.vue`

**De:**
```vue
<div v-if="isLoading" class="p-10">
```

**A:**
```vue
<div v-if="isLoading">
```

**Justificación:**
- El padding ya está en el contenedor principal (`p-14`)
- Evita padding duplicado

---

### Cambio 4: Eliminar padding del modo ReadOnly

**Ubicación:** Línea ~254 de `DatosSociedadForm.vue`

**De:**
```vue
<div v-else-if="isReadonly" class="space-y-6 p-10">
```

**A:**
```vue
<div v-else-if="isReadonly" class="space-y-6">
```

**Justificación:**
- El padding ya está en el contenedor principal
- Consistencia con el resto

---

### Cambio 5: Eliminar padding del formulario y cambiar gap

**Ubicación:** Línea ~299 de `DatosSociedadForm.vue`

**De:**
```vue
<div v-else class="p-10">
  <Form
    class="grid grid-cols-2 gap-8"
    @submit="handleSubmit"
    @invalid-submit="handleInvalidSubmit"
  >
```

**A:**
```vue
<Form
  class="grid grid-cols-2 gap-14"
  @submit="handleSubmit"
  @invalid-submit="handleInvalidSubmit"
>
```

**Justificación:**
- Elimina div contenedor con padding duplicado
- Cambia `gap-8` (32px) a `gap-14` (56px) como Figma
- El padding principal (`p-14`) ya existe en el contenedor raíz

---

## 🔍 Tabla Comparativa de Estilos

| Elemento | Legacy (Figma) ✅ | Nuevo (Actual) ⚠️ | Cambio Necesario |
|----------|-------------------|-------------------|------------------|
| **Contenedor principal** |
| Fondo | `bg-white` | `bg-white` | ✅ OK |
| Padding | `p-14` (56px) | `p-6` + `p-10` anidados | ⚠️ Simplificar a `p-14` |
| Bordes | Sin bordes | `rounded-2xl border` | ⚠️ Eliminar |
| Sombra | Sin sombra | `shadow-sm` | ⚠️ Eliminar |
| **Header** |
| Separador | Sin separador | `border-b` | ⚠️ Eliminar |
| Padding header | Dentro de `p-14` | `p-6` | ⚠️ Eliminar div |
| Margin bottom título | `mb-8` (32px) | Sin margen | ⚠️ Agregar `mb-8` |
| **Formulario** |
| Grid | `grid-cols-2` | `grid-cols-2` | ✅ OK |
| Gap entre campos | `gap-14` (56px) | `gap-8` (32px) | ⚠️ Cambiar a `gap-14` |
| Padding form | Dentro de `p-14` | `p-10` | ⚠️ Eliminar |
| **Botones** |
| Ubicación | Col-span-2 | Col-span-2 | ✅ OK |
| Padding top | `pt-4` (implícito) | `pt-4` | ✅ OK |

---

## 📦 Impacto en Componentes

### Componentes que NO cambian:
- ✅ `SearchInputZod`
- ✅ `SelectInputZod`
- ✅ `TextInputZod`
- ✅ `DateInputZod`
- ✅ `CardTitle`
- ✅ `Button`

**Razón:** Solo cambian las clases del contenedor, no los componentes hijos.

---

## ⚠️ Consideraciones Especiales

### 1. Modo Preview (ReadOnly)
El modo preview tiene una estructura diferente con `<dl>` (definition list). **Mantener su estructura**, solo quitar padding:

```vue
<!-- Antes -->
<div v-else-if="isReadonly" class="space-y-6 p-10">
  <dl class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">

<!-- Después -->
<div v-else-if="isReadonly" class="space-y-6">
  <dl class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
```

### 2. Loading Skeleton
El skeleton mantiene su estructura, solo eliminar padding:

```vue
<!-- Antes -->
<div v-if="isLoading" class="p-10">
  <div class="animate-pulse space-y-6">

<!-- Después -->
<div v-if="isLoading">
  <div class="animate-pulse space-y-6">
```

### 3. Mensaje de Error
Mover fuera del header eliminado y mantener con `mb-8`:

```vue
<p v-if="errorMessage" class="mb-8 text-sm text-red-500">
  {{ errorMessage }}
</p>
```

---

## 🎯 Checklist de Implementación

### Antes de empezar:
- [ ] Hacer commit de trabajo actual
- [ ] Tomar screenshot de vista actual (antes)
- [ ] Tener Figma abierto para comparar

### Cambios:
- [ ] **Cambio 1:** Simplificar contenedor principal (quitar bordes/sombra, aplicar `p-14`)
- [ ] **Cambio 2:** Eliminar header con `border-b`, aplicar `mb-8` a CardTitle
- [ ] **Cambio 3:** Eliminar `p-10` de loading state
- [ ] **Cambio 4:** Eliminar `p-10` de modo readonly
- [ ] **Cambio 5:** Eliminar `div` con `p-10` del form, cambiar `gap-8` a `gap-14`

### Después de cambios:
- [ ] Probar vista en navegador
- [ ] Comparar con Figma (espaciados, padding)
- [ ] Verificar modo create/edit/preview
- [ ] Verificar responsive (grid sigue funcionando)
- [ ] Tomar screenshot (después)
- [ ] Commit con mensaje claro

---

## 🚀 Resultado Esperado

### Estructura Final:
```vue
<template>
  <div class="bg-white p-14">
    <!-- Título con margen -->
    <CardTitle
      title="Datos principales"
      body="Complete todos los datos requeridos."
      class="mb-8"
    />
    
    <!-- Mensaje de error (si existe) -->
    <p v-if="errorMessage" class="mb-8 text-sm text-red-500">
      {{ errorMessage }}
    </p>

    <!-- Loading -->
    <div v-if="isLoading">
      <div class="animate-pulse space-y-6">
        <!-- skeleton -->
      </div>
    </div>

    <!-- Preview (ReadOnly) -->
    <div v-else-if="isReadonly" class="space-y-6">
      <dl class="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        <!-- campos readonly -->
      </dl>
    </div>

    <!-- Formulario (Create/Edit) -->
    <Form
      v-else
      class="grid grid-cols-2 gap-14"
      @submit="handleSubmit"
      @invalid-submit="handleInvalidSubmit"
    >
      <!-- inputs -->
      
      <!-- Botones -->
      <div class="col-span-2 flex items-center justify-end gap-3 pt-4">
        <Button variant="ghost" type="button" @click="reset">Restablecer</Button>
        <Button type="submit" :disabled="isSaving">
          <!-- texto botón -->
        </Button>
      </div>
    </Form>
  </div>
</template>
```

---

## 📊 Comparación Visual Esperada

### Espaciados (según Figma):

| Elemento | Valor | Clase Tailwind |
|----------|-------|----------------|
| Padding contenedor | 56px | `p-14` |
| Margen bottom título | 32px | `mb-8` |
| Gap entre campos | 56px | `gap-14` |
| Padding top botones | 16px | `pt-4` |

### Antes vs Después:

**ANTES (incorrecto):**
- Padding total: 24px (header) + 40px (form) = **desigual**
- Gap campos: 32px ❌
- Bordes/sombras innecesarios ❌

**DESPUÉS (correcto = Figma):**
- Padding uniforme: 56px ✅
- Gap campos: 56px ✅
- Sin bordes/sombras ✅

---

## 💡 Notas Importantes

1. **No modificar lógica:** Solo cambiamos clases CSS, no funcionalidad
2. **Conservar responsive:** El grid de 2 columnas sigue funcionando
3. **Mantener accesibilidad:** Todos los elementos mantienen su semántica
4. **Testing visual:** Comparar pixel por pixel con Figma
5. **Consistencia:** Aplicar mismo patrón a otros pasos (Accionistas, etc.)

---

## 🎨 Variables CSS a Considerar (Futuro)

Para evitar hardcodear valores en el futuro:

```css
/* tailwind.css */
:root {
  --form-padding: 3.5rem; /* 56px = p-14 */
  --form-gap: 3.5rem; /* 56px = gap-14 */
  --title-margin-bottom: 2rem; /* 32px = mb-8 */
}
```

Pero por ahora, usar clases Tailwind directamente es suficiente.

---

## ✅ Criterios de Aceptación

La migración será exitosa cuando:

1. ✅ Padding del contenedor es 56px (`p-14`)
2. ✅ Gap entre campos es 56px (`gap-14`)
3. ✅ Título tiene margin-bottom de 32px (`mb-8`)
4. ✅ No hay bordes redondeados
5. ✅ No hay sombras
6. ✅ No hay separador entre título y form
7. ✅ Vista se ve idéntica a Figma
8. ✅ Funcionalidad intacta (create/edit/preview)

---

**¿Listo para implementar?** 🚀

Sigue los cambios en orden, verifica cada uno, y compara con Figma constantemente.
