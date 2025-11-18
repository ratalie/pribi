# 🎨 PLAN DE MIGRACIÓN DE ESTILOS - Accionistas

**Fecha:** 15 de Noviembre, 2025  
**Objetivo:** Aplicar estilos de Figma (AccionistasStep.vue) a la nueva versión (AccionistasManager.vue + componentes)  
**Estado:** 📋 Plan de acción detallado

---

## 📊 Análisis Comparativo de Estilos

### Vista LEGACY (registro-societario) - ✅ Cumple con Figma

**Archivo:** `app/modules/registro-sociedades/components/steps/AccionistasStep.vue`

```vue
<template>
  <div class="h-full p-14 flex flex-col gap-12">
    <CardTitle title="Accionistas" body="Complete todos los campos requeridos.">
      <template #actions>
        <ActionButton
          variant="secondary"
          label="Agregar"
          size="md"
          icon="Plus"
          @click="openModal"
        />
      </template>
    </CardTitle>

    <SimpleTable
      :columns="columns"
      :data="registroAccionistasStore.tablaAccionistas"
      title-menu="Actions"
      :actions="actions"
    />

    <AccionistasModal ... />
  </div>
</template>
```

**Estilos aplicados (Figma):**

- ✅ `h-full` - Altura completa
- ✅ `p-14` - **Padding 56px** (igual que Datos Principales)
- ✅ `flex flex-col` - Layout vertical
- ✅ `gap-12` - **Gap 48px** entre CardTitle y tabla
- ✅ CardTitle con actions slot para botón
- ✅ SimpleTable sin estilos hardcodeados

---

### Vista NUEVA (registros) - ⚠️ Estilos diferentes

**Archivo:** `app/core/presentation/registros/sociedades/pasos/accionistas/AccionistasManager.vue`

```vue
<template>
  <div class="flex flex-col gap-8">
    <CardTitle
      title="Accionistas"
      body="Administra los accionistas registrados para esta sociedad."
    >
      <template #actions>
        <ActionButton
          v-if="!isReadonly"
          variant="secondary"
          label="Agregar"
          size="md"
          icon="Plus"
          @click="openCreateModal"
        />
      </template>
    </CardTitle>

    <p v-if="errorMessage" class="rounded-lg border ...">
      {{ errorMessage }}
    </p>

    <AccionistasList
      :items="rows"
      :is-loading="isLoading"
      :readonly="isReadonly"
      @edit="handleEdit"
      @remove="handleRemove"
    />

    <AccionistaModal ... />
  </div>
</template>
```

**Estilos aplicados (diferentes a Figma):**

- ⚠️ `flex flex-col` ✅ OK
- ⚠️ `gap-8` - **Gap 32px** (debería ser `gap-12` = 48px)
- ❌ Sin `p-14` - **Falta padding principal**
- ❌ Sin `h-full` - Falta altura completa
- ⚠️ Mensaje error con estilos complejos (border, rounded-lg, etc.)
- ⚠️ Body text diferente ("Administra..." vs "Complete todos los campos requeridos.")

---

## 🎯 Cambios Necesarios por Componente

### 1. AccionistasManager.vue (Contenedor Principal)

**Ubicación:** `app/core/presentation/registros/sociedades/pasos/accionistas/AccionistasManager.vue`

#### Cambio 1.1: Aplicar padding y height al contenedor

**De:**

```vue
<div class="flex flex-col gap-8">
```

**A:**

```vue
<div class="h-full p-14 flex flex-col gap-12">
```

**Justificación:**

- `h-full`: Altura completa (como Figma)
- `p-14`: Padding 56px (consistente con Datos Principales)
- `gap-12`: Gap 48px (como Figma, no 32px)

---

#### Cambio 1.2: Actualizar texto del CardTitle

**De:**

```vue
<CardTitle
  title="Accionistas"
  body="Administra los accionistas registrados para esta sociedad."
>
```

**A:**

```vue
<CardTitle
  title="Accionistas"
  body="Complete todos los campos requeridos."
>
```

**Justificación:**

- Texto consistente con Figma y legacy
- Más directo y alineado con otros pasos

---

#### Cambio 1.3: Simplificar mensaje de error

**De:**

```vue
<p
  v-if="errorMessage"
  class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
>
  {{ errorMessage }}
</p>
```

**A:**

```vue
<p v-if="errorMessage" class="text-sm text-red-500">
  {{ errorMessage }}
</p>
```

**Justificación:**

- Simplifica estilos (sin border, rounded, bg)
- Consistente con DatosSociedadForm.vue
- Más limpio visualmente

---

### 2. AccionistasList.vue (Tabla)

**Ubicación:** `app/core/presentation/registros/sociedades/pasos/accionistas/components/AccionistasList.vue`

#### Cambio 2.1: Eliminar bordes redondeados y borde de tabla

**De:**

```vue
<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
  <Table>
```

**A:**

```vue
<div class="overflow-hidden bg-white">
  <Table>
```

**Justificación:**

- Sin `rounded-2xl` (no en Figma)
- Sin `border border-slate-200` (SimpleTable legacy no tiene)
- Solo `bg-white` necesario
- El overflow-hidden se mantiene para comportamiento correcto

---

### 3. AccionistaModal.vue (Modal)

**Ubicación:** `app/core/presentation/registros/sociedades/pasos/accionistas/components/AccionistaModal.vue`

#### Análisis del Modal Legacy:

```vue
<!-- Legacy Modal -->
<BaseModal v-model="modelValue" size="lg" @close="handleCancel">
  <div class="flex flex-col gap-12">
    <CardTitle title="Tipo de Accionista" body="Selecciona una opción">
      <template #actions>
        <div class="w-[440px]">
          <CascadeSelectInputZod ... />
        </div>
      </template>
    </CardTitle>

    <!-- Forms condicionales -->
    <AccionistaNaturalForm v-if="tipoAccionista === TipoAccionistaEnum.NATURAL" />
    <!-- ... otros forms -->
  </div>

  <template #footer>
    <div class="flex items-center justify-center gap-3 w-full px-14">
      <ActionButton variant="primary_outline" label="Cancelar" ... />
      <ActionButton type="submit" variant="primary" label="..." ... />
    </div>
  </template>
</BaseModal>
```

**Estilos aplicados (Figma):**

- ✅ `flex flex-col gap-12` - Layout vertical con gap 48px
- ✅ CardTitle con actions slot (ancho fijo `w-[440px]`)
- ✅ Footer con `px-14` - Padding horizontal 56px
- ✅ Footer con `gap-3` entre botones
- ✅ `justify-center` en footer

---

#### Cambio 3.1: Estructura del contenido del modal (ya está correcto ✅)

El modal nuevo tiene estructura correcta pero verificar spacing:

```vue
<div class="flex flex-col gap-12">
  <!-- ✅ gap-12 correcto -->
```

#### Cambio 3.2: Verificar footer del modal

**Debe tener:**

```vue
<template #footer>
  <div class="flex items-center justify-center gap-3 w-full px-14">
    <ActionButton variant="primary_outline" label="Cancelar" ... />
    <ActionButton type="submit" variant="primary" ... />
  </div>
</template>
```

**Puntos clave:**

- ✅ `px-14` - Padding horizontal 56px
- ✅ `gap-3` - Gap 12px entre botones
- ✅ `justify-center` - Botones centrados
- ✅ `w-full` - Ancho completo

---

### 4. BaseModal.vue (Componente Base)

**Ubicación:** `app/components/base/modal/BaseModal.vue`

Este componente es compartido y define el padding del modal. **NO modificar** a menos que afecte solo este flujo.

**Verificar que tenga:**

- Padding interno adecuado
- Footer con padding `px-14`

---

## 📝 Resumen de Cambios

### AccionistasManager.vue (3 cambios)

| #   | Elemento       | Actual ❌           | Debe ser ✅                             | Razón                  |
| --- | -------------- | ------------------- | --------------------------------------- | ---------------------- |
| 1   | Contenedor     | `gap-8` sin padding | `h-full p-14 gap-12`                    | Consistencia con Figma |
| 2   | CardTitle body | "Administra..."     | "Complete todos los campos requeridos." | Texto de Figma         |
| 3   | Mensaje error  | Estilos complejos   | `text-sm text-red-500`                  | Simplicidad            |

### AccionistasList.vue (1 cambio)

| #   | Elemento         | Actual ❌                             | Debe ser ✅        | Razón          |
| --- | ---------------- | ------------------------------------- | ------------------ | -------------- |
| 1   | Contenedor tabla | `rounded-2xl border border-slate-200` | Sin bordes/rounded | Figma no tiene |

### AccionistaModal.vue (verificación)

| #   | Elemento       | Estado           | Acción                |
| --- | -------------- | ---------------- | --------------------- |
| 1   | Contenido gap  | `gap-12`         | ✅ Verificar que esté |
| 2   | Footer padding | `px-14`          | ✅ Verificar que esté |
| 3   | Footer gap     | `gap-3`          | ✅ Verificar que esté |
| 4   | Footer justify | `justify-center` | ✅ Verificar que esté |

---

## 🔍 Tabla Comparativa Completa

| Componente             | Elemento       | Legacy (Figma) ✅                       | Nuevo (Actual) ⚠️                              | Acción                                     |
| ---------------------- | -------------- | --------------------------------------- | ---------------------------------------------- | ------------------------------------------ |
| **AccionistasManager** |
|                        | Contenedor     | `h-full p-14 flex flex-col gap-12`      | `flex flex-col gap-8`                          | ⚠️ Agregar `h-full p-14`, cambiar `gap-12` |
|                        | CardTitle body | "Complete todos los campos requeridos." | "Administra..."                                | ⚠️ Cambiar texto                           |
|                        | Error message  | Sin estilos                             | `rounded-lg border...`                         | ⚠️ Simplificar                             |
| **AccionistasList**    |
|                        | Contenedor     | `bg-white` simple                       | `rounded-2xl border border-slate-200 bg-white` | ⚠️ Eliminar rounded/border                 |
|                        | Tabla          | SimpleTable sin bordes                  | Table con bordes                               | ✅ OK (componente diferente)               |
| **AccionistaModal**    |
|                        | Content gap    | `gap-12`                                | `gap-12`                                       | ✅ Verificar                               |
|                        | Footer padding | `px-14`                                 | ?                                              | ⚠️ Verificar                               |
|                        | Footer gap     | `gap-3`                                 | ?                                              | ⚠️ Verificar                               |

---

## 📦 Impacto y Dependencias

### Componentes que NO cambian:

- ✅ `ActionButton`
- ✅ `CardTitle`
- ✅ `BaseModal`
- ✅ Forms individuales (Natural, Jurídico, etc.)
- ✅ `CascadeSelectInputZod`
- ✅ Componentes UI de shadcn (Table, TableCell, etc.)

### Componentes que cambian:

1. ⚠️ `AccionistasManager.vue` - Contenedor principal
2. ⚠️ `AccionistasList.vue` - Tabla
3. ⚠️ `AccionistaModal.vue` - Verificación de estilos

---

## 🎯 Checklist de Implementación

### Fase 1: AccionistasManager.vue ✅

- [x] **Paso 1.1:** Cambiar `<div class="flex flex-col gap-8">` a `<div class="h-full p-14 flex flex-col gap-12">`
- [x] **Paso 1.2:** Cambiar body de CardTitle a "Complete todos los campos requeridos."
- [x] **Paso 1.3:** Simplificar mensaje de error a `class="text-sm text-red-500"`

### Fase 2: AccionistasList.vue ✅

- [x] **Paso 2.1:** Eliminar `rounded-2xl border border-slate-200` del contenedor de tabla

### Fase 3: AccionistaModal.vue ✅

- [x] **Paso 3.1:** Cambiar content de `gap-8` a `gap-12`
- [x] **Paso 3.2:** Aplicar footer con `px-14 gap-3 justify-center`
- [x] **Paso 3.3:** Eliminar clases responsive innecesarias (`w-full md:w-auto`, `flex-col md:flex-row`)

### Fase 4: Testing

- [ ] Probar vista en navegador
- [ ] Comparar con Figma (espaciados, padding)
- [ ] Abrir modal y verificar estilos
- [ ] Verificar tabla vacía y con datos
- [ ] Verificar modo readonly
- [ ] Tomar screenshots antes/después

---

## 🚀 Código Específico para Aplicar

### Cambio 1: AccionistasManager.vue - Línea ~137

**Buscar:**

```vue
<template>
  <div class="flex flex-col gap-8">
    <CardTitle
      title="Accionistas"
      body="Administra los accionistas registrados para esta sociedad."
    ></CardTitle>
  </div>
</template>
```

**Reemplazar con:**

```vue
<template>
  <div class="h-full p-14 flex flex-col gap-12">
    <CardTitle title="Accionistas" body="Complete todos los campos requeridos."></CardTitle>
  </div>
</template>
```

---

### Cambio 2: AccionistasManager.vue - Mensaje Error (Línea ~149)

**Buscar:**

```vue
<p
  v-if="errorMessage"
  class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
>
      {{ errorMessage }}
    </p>
```

**Reemplazar con:**

```vue
<p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>
```

---

### Cambio 3: AccionistasList.vue - Línea ~30

**Buscar:**

```vue
<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <Table></Table>
  </div>
</template>
```

**Reemplazar con:**

```vue
<template>
  <div class="overflow-hidden bg-white">
    <Table></Table>
  </div>
</template>
```

---

## 📊 Resultado Esperado

### Estructura Final AccionistasManager.vue:

```vue
<template>
  <div class="h-full p-14 flex flex-col gap-12">
    <!-- Título con botón agregar -->
    <CardTitle title="Accionistas" body="Complete todos los campos requeridos.">
      <template #actions>
        <ActionButton
          v-if="!isReadonly"
          variant="secondary"
          label="Agregar"
          size="md"
          icon="Plus"
          @click="openCreateModal"
        />
      </template>
    </CardTitle>

    <!-- Mensaje de error simple -->
    <p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>

    <!-- Tabla de accionistas -->
    <AccionistasList
      :items="rows"
      :is-loading="isLoading"
      :readonly="isReadonly"
      @edit="handleEdit"
      @remove="handleRemove"
    />

    <!-- Modal -->
    <AccionistaModal ... />
  </div>
</template>
```

### Estructura Final AccionistasList.vue:

```vue
<template>
  <div class="overflow-hidden bg-white">
    <Table>
      <!-- headers y rows -->
    </Table>
  </div>
</template>
```

---

## 📊 Comparación Visual Esperada

### Espaciados (según Figma):

| Elemento              | Valor           | Clase Tailwind | Componente         |
| --------------------- | --------------- | -------------- | ------------------ |
| Padding contenedor    | 56px            | `p-14`         | AccionistasManager |
| Gap CardTitle → Tabla | 48px            | `gap-12`       | AccionistasManager |
| Footer modal padding  | 56px horizontal | `px-14`        | BaseModal          |
| Gap botones footer    | 12px            | `gap-3`        | BaseModal footer   |

---

## 💡 Notas Importantes

1. **Consistencia con Datos Principales:**

   - Mismo `p-14` (56px padding)
   - Mismo `gap-12` entre secciones
   - Misma simplicidad en mensajes de error

2. **No modificar BaseModal:**

   - Es componente compartido
   - Solo verificar que tenga estilos correctos
   - Si falta algo, agregar específicamente

3. **Tabla sin bordes:**

   - Figma muestra tabla limpia sin bordes externos
   - Solo bordes internos entre filas (TableRow)

4. **Testing exhaustivo:**
   - Crear accionista de cada tipo
   - Editar accionista
   - Eliminar accionista
   - Ver en modo readonly

---

## ✅ Criterios de Aceptación

La migración será exitosa cuando:

1. ✅ Padding del contenedor es 56px (`p-14`)
2. ✅ Gap entre CardTitle y tabla es 48px (`gap-12`)
3. ✅ Texto del CardTitle es "Complete todos los campos requeridos."
4. ✅ Mensaje de error tiene estilos simples (`text-sm text-red-500`)
5. ✅ Tabla no tiene bordes redondeados ni borde externo
6. ✅ Modal mantiene estructura con `gap-12` y footer con `px-14`
7. ✅ Vista se ve idéntica a Figma/Legacy
8. ✅ Funcionalidad intacta (crear/editar/eliminar)
9. ✅ Modo readonly funciona correctamente

---

## 🎨 Comparación Antes vs Después

### ANTES (incorrecto):

- Padding: ausente ❌
- Gap: 32px (gap-8) ❌
- Tabla: bordes redondeados ❌
- Error: estilos complejos ❌
- Texto: "Administra..." ❌

### DESPUÉS (correcto = Figma):

- Padding: 56px (p-14) ✅
- Gap: 48px (gap-12) ✅
- Tabla: sin bordes externos ✅
- Error: simple y claro ✅
- Texto: "Complete todos..." ✅

---

**¿Listo para implementar?** 🚀

Los cambios son mínimos pero precisos. Sigue el checklist en orden y compara constantemente con Figma.
