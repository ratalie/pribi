# 🎨 PLAN DE MIGRACIÓN DE ESTILOS - Apoderados

**Fecha:** 15 de Noviembre, 2025  
**Objetivo:** Aplicar estilos de Figma (RegistroApoderadosStep.vue) a la nueva versión (ApoderadosManager.vue + componentes)  
**Estado:** 📋 Plan de acción detallado  
**Complejidad:** ⚠️ **ALTA** - 4 tablas + 4 modales diferentes

---

## 📊 Análisis Comparativo de Estilos

### Vista LEGACY (registro-societario) - ✅ Cumple con Figma

**Archivo:** `app/modules/registro-sociedades/components/steps/RegistroApoderadosStep.vue`

```vue
<template>
  <div class="p-14 flex flex-col gap-12">
    <CardTitle title="Registro de Apoderados" body="Complete todos los campos requeridos." />

    <SimpleCard>
      <CardTitle title="Clase de Apoderados" body="">
        <template #actions>
          <ActionButton
            variant="secondary"
            label="Agregar Clase de Apoderado"
            size="xl"
            icon="Plus"
            @click="handleCreateClase"
          />
        </template>
      </CardTitle>
      <SimpleTable ... />
    </SimpleCard>

    <SimpleCard>
      <CardTitle title="Registro de Apoderados" body="">
        <template #actions>
          <ActionButton ... />
        </template>
      </CardTitle>
      <SimpleTable ... />
    </SimpleCard>

    <SimpleCard>
      <CardTitle title="Otros Apoderados" body="">
        <template #actions>
          <ActionButton ... />
        </template>
      </CardTitle>
      <SimpleTable ... />
    </SimpleCard>

    <!-- Modales -->
    <ClaseApoderadoModal ... />
    <RegistroApoderadoModal ... />
    <RegistroOtroApoderadoModal ... />
  </div>
</template>
```

**Estilos aplicados (Figma):**

- ✅ `p-14` - **Padding 56px** en contenedor principal
- ✅ `flex flex-col gap-12` - Layout vertical con gap 48px
- ✅ SimpleCard sin estilos hardcodeados (limpio)
- ✅ CardTitle con actions slot
- ✅ SimpleTable sin bordes redondeados

---

### Vista NUEVA (registros) - ⚠️ Estilos diferentes

**Archivo:** `app/core/presentation/registros/sociedades/pasos/apoderados/ApoderadosManager.vue`

```vue
<template>
  <section class="flex flex-col gap-12">
    <CardTitle
      title="Registro de Apoderados"
      body="Gestiona las clases y los apoderados de la sociedad."
    />

    <p
      v-if="errorMessage"
      class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errorMessage }}
    </p>

    <SimpleCard>
      <CardTitle title="Clases de apoderado">
        <template #actions>
          <ActionButton ... />
        </template>
      </CardTitle>
      <ClasesApoderadoTable ... />
    </SimpleCard>

    <!-- 3 SimpleCards más para Gerente General, Apoderados, Otros Apoderados -->

    <!-- 4 Modales: Clase, Registro, Gerente, Otro -->
  </section>
</template>
```

**Estilos aplicados (diferentes a Figma):**

- ❌ Sin `p-14` - **Falta padding principal**
- ⚠️ `gap-12` ✅ OK
- ❌ CardTitle body diferente: "Gestiona las clases..." vs "Complete todos los campos requeridos."
- ⚠️ Mensaje error con estilos complejos (border, rounded-lg, bg-red-50)
- ⚠️ Tablas con `rounded-2xl border border-slate-200` (no en Figma)
- ⚠️ Modales con footer diferente (border-t, flex-col md:flex-row)

---

## 🎯 Componentes a Migrar

### Estructura del Módulo Apoderados:

```
app/core/presentation/registros/sociedades/pasos/apoderados/
├── ApoderadosManager.vue           ← Contenedor principal ⚠️
├── components/
│   ├── ClasesApoderadoTable.vue    ← Tabla clases ⚠️
│   ├── ApoderadosTable.vue         ← Tabla apoderados ⚠️
│   └── modals/
│       ├── ClaseApoderadoModal.vue      ← Modal clase ⚠️
│       ├── RegistroApoderadoModal.vue   ← Modal registro ⚠️
│       ├── GerenteGeneralModal.vue      ← Modal gerente ⚠️
│       └── OtroApoderadoModal.vue       ← Modal otro ⚠️
```

**Total: 7 archivos a revisar/modificar**

---

## 🔍 Análisis Detallado por Componente

### 1. ApoderadosManager.vue (Contenedor Principal)

**Ubicación:** `app/core/presentation/registros/sociedades/pasos/apoderados/ApoderadosManager.vue`

#### Problemas identificados:

| #   | Elemento       | Actual ❌                                                                   | Debe ser ✅                               | Razón              |
| --- | -------------- | --------------------------------------------------------------------------- | ----------------------------------------- | ------------------ |
| 1   | Contenedor     | `<section class="flex flex-col gap-12">`                                    | `<div class="p-14 flex flex-col gap-12">` | Falta padding 56px |
| 2   | CardTitle body | "Gestiona las clases..."                                                    | "Complete todos los campos requeridos."   | Texto de Figma     |
| 3   | Mensaje error  | `rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700` | `text-sm text-red-500`                    | Simplicidad        |

#### Cambios necesarios:

**Cambio 1.1: Contenedor principal**

**De:**

```vue
<template>
  <section class="flex flex-col gap-12"></section>
</template>
```

**A:**

```vue
<template>
  <div class="p-14 flex flex-col gap-12"></div>
</template>
```

**Cambio 1.2: CardTitle body**

**De:**

```vue
<CardTitle
  title="Registro de Apoderados"
  body="Gestiona las clases y los apoderados de la sociedad."
/>
```

**A:**

```vue
<CardTitle title="Registro de Apoderados" body="Complete todos los campos requeridos." />
```

**Cambio 1.3: Mensaje de error**

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

---

### 2. ClasesApoderadoTable.vue (Tabla de Clases)

**Ubicación:** `app/core/presentation/registros/sociedades/pasos/apoderados/components/ClasesApoderadoTable.vue`

#### Problemas identificados:

| #   | Elemento         | Actual ❌                                      | Debe ser ✅        | Razón          |
| --- | ---------------- | ---------------------------------------------- | ------------------ | -------------- |
| 1   | Contenedor tabla | `rounded-2xl border border-slate-200 bg-white` | Sin rounded/border | Figma no tiene |

#### Cambios necesarios:

**Cambio 2.1: Eliminar bordes**

**De:**

```vue
<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
```

**A:**

```vue
<div class="overflow-hidden bg-white">
```

---

### 3. ApoderadosTable.vue (Tabla de Apoderados)

**Ubicación:** `app/core/presentation/registros/sociedades/pasos/apoderados/components/ApoderadosTable.vue`

#### Problemas identificados:

| #   | Elemento         | Actual ❌                                      | Debe ser ✅        | Razón          |
| --- | ---------------- | ---------------------------------------------- | ------------------ | -------------- |
| 1   | Contenedor tabla | `rounded-2xl border border-slate-200 bg-white` | Sin rounded/border | Figma no tiene |

#### Cambios necesarios:

**Cambio 3.1: Eliminar bordes**

**De:**

```vue
<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
```

**A:**

```vue
<div class="overflow-hidden bg-white">
```

**⚠️ NOTA:** Este mismo componente se usa para:

- Tabla Gerente General
- Tabla Apoderados (con clase)
- Tabla Otros Apoderados

---

### 4. ClaseApoderadoModal.vue (Modal Clase)

**Ubicación:** `app/core/presentation/registros/sociedades/pasos/apoderados/components/modals/ClaseApoderadoModal.vue`

#### Comparación Legacy vs Nuevo:

**Legacy (Figma ✅):**

```vue
<BaseModal v-model="modelValue" size="md" @close="handleCancel">
  <div class="flex flex-col gap-10">
    <CardTitle
      title="Agregar Clase de Apoderado"
      body="Ingresa el nombre de la nueva clase de Apoderados."
    />
    <TextInputZod ... />
  </div>

  <template #footer>
    <div class="flex items-center justify-center gap-3 w-full px-14">
      <ActionButton variant="primary_outline" label="Cancelar" ... />
      <ActionButton type="submit" variant="primary" :label="submitLabel" ... />
    </div>
  </template>
</BaseModal>
```

**Nuevo (Actual ❌):**

```vue
<BaseModal v-model="isOpen" size="md" @close="handleClose">
  <div class="flex flex-col gap-8">
    <!-- ❌ gap-8 (debería ser gap-10 o gap-12) -->
    <div>
      <p class="t-h5 font-semibold text-slate-900">{{ title }}</p>
      <p class="t-b3 text-slate-500">Completa el nombre de la clase...</p>
    </div>
    <TextInputZod ... />
  </div>

  <template #footer>
    <div class="flex w-full flex-col gap-3 border-t border-slate-200 pt-4 md:flex-row md:justify-end">
      <!-- ❌ border-t, flex-col md:flex-row, md:justify-end (no en Figma) -->
      <ActionButton ... class="w-full md:w-auto" />
      <ActionButton ... class="w-full md:w-auto" />
    </div>
  </template>
</BaseModal>
```

#### Problemas identificados:

| #   | Elemento    | Actual ❌                                           | Debe ser ✅            | Razón             |
| --- | ----------- | --------------------------------------------------- | ---------------------- | ----------------- |
| 1   | Content gap | `gap-8`                                             | `gap-10` o `gap-12`    | Legacy usa gap-10 |
| 2   | CardTitle   | Sin usar                                            | Usar CardTitle         | Consistencia      |
| 3   | Footer      | `border-t pt-4 flex-col md:flex-row md:justify-end` | `px-14 justify-center` | Figma             |
| 4   | Botones     | `w-full md:w-auto`                                  | Sin clases responsive  | Simplicidad       |

#### Cambios necesarios:

**Cambio 4.1: Content con CardTitle**

**De:**

```vue
<div class="flex flex-col gap-8">
  <div>
    <p class="t-h5 font-semibold text-slate-900">{{ title }}</p>
    <p class="t-b3 text-slate-500">Completa el nombre de la clase para identificarla.</p>
  </div>
  <TextInputZod ... />
</div>
```

**A:**

```vue
<div class="flex flex-col gap-12">
  <CardTitle
    :title="title"
    body="Ingresa el nombre de la nueva clase de apoderados."
  />
  <TextInputZod ... />
</div>
```

**Cambio 4.2: Footer simplificado**

**De:**

```vue
<template #footer>
  <div
    class="flex w-full flex-col gap-3 border-t border-slate-200 pt-4 md:flex-row md:justify-end"
  >
    <ActionButton
      variant="primary_outline"
      label="Cancelar"
      size="md"
      class="w-full md:w-auto"
      @click="handleClose"
    />
    <ActionButton
      :label="mode === 'create' ? 'Guardar' : 'Actualizar'"
      size="md"
      :is-loading="isSaving"
      class="w-full md:w-auto"
      type="submit"
    />
  </div>
</template>
```

**A:**

```vue
<template #footer>
  <div class="flex items-center justify-center gap-3 w-full px-14">
    <ActionButton variant="primary_outline" label="Cancelar" size="md" @click="handleClose" />
    <ActionButton
      :label="mode === 'create' ? 'Guardar' : 'Actualizar'"
      size="md"
      :is-loading="isSaving"
      type="submit"
    />
  </div>
</template>
```

---

### 5. RegistroApoderadoModal.vue (Modal Apoderado)

**⚠️ COMPLEJIDAD ALTA:** Este modal tiene ~204 líneas con formulario complejo.

**Ubicación:** `app/core/presentation/registros/sociedades/pasos/apoderados/components/modals/RegistroApoderadoModal.vue`

#### Problemas identificados (similares a ClaseApoderadoModal):

| #   | Elemento    | Actual ❌                                           | Debe ser ✅            | Razón        |
| --- | ----------- | --------------------------------------------------- | ---------------------- | ------------ |
| 1   | Content gap | `gap-8`                                             | `gap-12`               | Consistencia |
| 2   | Footer      | `border-t pt-4 flex-col md:flex-row md:justify-end` | `px-14 justify-center` | Figma        |
| 3   | Botones     | `w-full md:w-auto`                                  | Sin clases responsive  | Simplicidad  |

**⚠️ NOTA:** Este modal tiene lógica compleja con forms de persona natural, pero el cambio de estilos es el mismo.

---

### 6. GerenteGeneralModal.vue (Modal Gerente)

**Ubicación:** `app/core/presentation/registros/sociedades/pasos/apoderados/components/modals/GerenteGeneralModal.vue`

**⚠️ NOTA:** No leído aún, pero esperamos el mismo patrón que RegistroApoderadoModal.

#### Problemas esperados:

| #   | Elemento    | Actual ❌                               | Debe ser ✅            | Razón        |
| --- | ----------- | --------------------------------------- | ---------------------- | ------------ |
| 1   | Content gap | Probablemente `gap-8`                   | `gap-12`               | Consistencia |
| 2   | Footer      | Probablemente con border-t y responsive | `px-14 justify-center` | Figma        |

---

### 7. OtroApoderadoModal.vue (Modal Otro Apoderado)

**Ubicación:** `app/core/presentation/registros/sociedades/pasos/apoderados/components/modals/OtroApoderadoModal.vue`

**⚠️ NOTA:** No leído aún, pero esperamos el mismo patrón.

#### Problemas esperados:

| #   | Elemento    | Actual ❌                               | Debe ser ✅            | Razón        |
| --- | ----------- | --------------------------------------- | ---------------------- | ------------ |
| 1   | Content gap | Probablemente `gap-8`                   | `gap-12`               | Consistencia |
| 2   | Footer      | Probablemente con border-t y responsive | `px-14 justify-center` | Figma        |

---

## 📦 Resumen de Cambios

### Por Tipo de Componente:

| Componente                 | # Cambios    | Complejidad                   |
| -------------------------- | ------------ | ----------------------------- |
| ApoderadosManager.vue      | 3            | 🟡 Media                      |
| ClasesApoderadoTable.vue   | 1            | 🟢 Baja                       |
| ApoderadosTable.vue        | 1            | 🟢 Baja                       |
| ClaseApoderadoModal.vue    | 2            | 🟡 Media                      |
| RegistroApoderadoModal.vue | 2            | 🔴 Alta (formulario complejo) |
| GerenteGeneralModal.vue    | 2 (estimado) | 🔴 Alta (revisar)             |
| OtroApoderadoModal.vue     | 2 (estimado) | 🔴 Alta (revisar)             |

**Total: 13 cambios estimados**

---

## 🎯 Checklist de Implementación

### Fase 1: ApoderadosManager.vue (Contenedor) ✅

- [x] **Paso 1.1:** Cambiar `<section class="flex flex-col gap-12">` a `<div class="p-14 flex flex-col gap-12">`
- [x] **Paso 1.2:** Cambiar body de CardTitle principal a "Complete todos los campos requeridos."
- [x] **Paso 1.3:** Simplificar mensaje de error a `class="text-sm text-red-500"`

### Fase 2: Tablas ✅

- [x] **Paso 2.1:** ClasesApoderadoTable - Eliminar `rounded-2xl border border-slate-200`
- [x] **Paso 2.2:** ApoderadosTable - Eliminar `rounded-2xl border border-slate-200`

### Fase 3: Modales - ClaseApoderadoModal ✅

- [x] **Paso 3.1:** Cambiar content gap de `gap-8` a `gap-12`
- [x] **Paso 3.2:** Reemplazar div de título por CardTitle
- [x] **Paso 3.3:** Actualizar footer: `flex items-center justify-center gap-3 w-full px-14`
- [x] **Paso 3.4:** Eliminar clases responsive de botones

### Fase 4: Modales - RegistroApoderadoModal ✅

- [x] **Paso 4.1:** Aplicar footer con `px-14 justify-center`
- [x] **Paso 4.2:** Eliminar clases responsive de botones

### Fase 5: Modales - GerenteGeneralModal ✅

- [x] **Paso 5.1:** Aplicar footer con `px-14 justify-center`
- [x] **Paso 5.2:** Eliminar clases responsive de botones

### Fase 6: Modales - OtroApoderadoModal ✅

- [x] **Paso 6.1:** Aplicar footer con `px-14 justify-center`
- [x] **Paso 6.2:** Eliminar clases responsive de botones

### Fase 7: Testing Completo

- [ ] Probar vista principal en navegador
- [ ] Comparar con Figma (espaciados, padding)
- [ ] Abrir y probar cada modal:
  - [ ] ClaseApoderadoModal (crear/editar)
  - [ ] RegistroApoderadoModal (crear/editar)
  - [ ] GerenteGeneralModal (crear/editar)
  - [ ] OtroApoderadoModal (crear/editar)
- [ ] Verificar tablas vacías y con datos
- [ ] Verificar modo readonly
- [ ] Tomar screenshots antes/después

---

## 🚨 Consideraciones Especiales

### 1. **SimpleCard vs sin wrapper:**

**Legacy:** Usa `<SimpleCard>` para envolver cada sección de tabla.

**Nuevo:** También usa `<SimpleCard>`.

**Acción:** ✅ Mantener SimpleCard, solo verificar que no tenga estilos hardcodeados.

---

### 2. **Gerente General es especial:**

El módulo nuevo tiene lógica especial para "Gerente General":

- Debe existir exactamente uno
- Tiene su propia sección y modal
- Es diferente a un apoderado regular

**Acción:** ⚠️ Respetar la lógica, solo cambiar estilos.

---

### 3. **4 modales diferentes:**

A diferencia de Accionistas (1 modal), Apoderados tiene 4:

1. ClaseApoderadoModal - Simple, solo nombre
2. RegistroApoderadoModal - Complejo, persona natural + clase
3. GerenteGeneralModal - Específico para gerente
4. OtroApoderadoModal - Para apoderados sin clase

**Acción:** ⚠️ Aplicar mismo patrón de footer a todos, pero verificar cada uno individualmente.

---

### 4. **3 tablas usando el mismo componente:**

`ApoderadosTable.vue` se reutiliza para:

- Gerente General
- Apoderados (con clase)
- Otros Apoderados

**Acción:** ✅ Un solo cambio afecta las 3 tablas.

---

## 🎨 Patrón de Footer Unificado

**Para TODOS los modales de Apoderados:**

```vue
<template #footer>
  <div class="flex items-center justify-center gap-3 w-full px-14">
    <ActionButton variant="primary_outline" label="Cancelar" size="md" @click="handleClose" />
    <ActionButton
      :label="mode === 'create' ? 'Guardar' : 'Actualizar'"
      size="md"
      :is-loading="isSaving"
      type="submit"
    />
  </div>
</template>
```

**Características:**

- ✅ `flex items-center justify-center` - Centrado vertical y horizontal
- ✅ `gap-3` - Espaciado 12px entre botones
- ✅ `w-full` - Ancho completo
- ✅ `px-14` - Padding horizontal 56px
- ❌ SIN `border-t`, `pt-4`, `flex-col`, `md:flex-row`, `md:justify-end`
- ❌ SIN `w-full md:w-auto` en botones

---

## 📊 Comparación Visual Esperada

### Espaciados (según Figma):

| Elemento                     | Valor           | Clase Tailwind | Componente        |
| ---------------------------- | --------------- | -------------- | ----------------- |
| Padding contenedor principal | 56px            | `p-14`         | ApoderadosManager |
| Gap entre secciones          | 48px            | `gap-12`       | ApoderadosManager |
| Gap content modal            | 48px            | `gap-12`       | Todos los modales |
| Footer modal padding         | 56px horizontal | `px-14`        | Todos los modales |
| Gap botones footer           | 12px            | `gap-3`        | Todos los modales |

---

## ✅ Criterios de Aceptación

La migración será exitosa cuando:

1. ✅ Padding del contenedor es 56px (`p-14`)
2. ✅ Gap entre secciones es 48px (`gap-12`)
3. ✅ Texto del CardTitle principal es "Complete todos los campos requeridos."
4. ✅ Mensaje de error tiene estilos simples (`text-sm text-red-500`)
5. ✅ Tablas no tienen bordes redondeados ni borde externo
6. ✅ TODOS los modales tienen footer con `px-14 justify-center gap-3`
7. ✅ Modales tienen content con `gap-12`
8. ✅ Sin clases responsive innecesarias (`w-full md:w-auto`)
9. ✅ Vista se ve idéntica a Figma/Legacy
10. ✅ Funcionalidad intacta (crear/editar/eliminar)
11. ✅ Modo readonly funciona correctamente
12. ✅ Lógica de Gerente General preservada

---

## 🎨 Comparación Antes vs Después

### ANTES (incorrecto):

- Padding contenedor: ausente ❌
- Tablas: bordes redondeados ❌
- Error: estilos complejos ❌
- Texto: "Gestiona las clases..." ❌
- Modal footer: border-t, responsive ❌
- Modal content: gap-8 ❌

### DESPUÉS (correcto = Figma):

- Padding contenedor: 56px (p-14) ✅
- Tablas: sin bordes externos ✅
- Error: simple y claro ✅
- Texto: "Complete todos..." ✅
- Modal footer: px-14, centrado ✅
- Modal content: gap-12 ✅

---

## 🚀 Estrategia de Implementación

### Orden recomendado:

1. **Primero:** ApoderadosManager (contenedor + mensaje error + texto)
2. **Segundo:** Tablas (ClasesApoderadoTable + ApoderadosTable)
3. **Tercero:** ClaseApoderadoModal (más simple, establece patrón)
4. **Cuarto:** Leer y analizar los otros 3 modales
5. **Quinto:** Aplicar patrón a RegistroApoderadoModal
6. **Sexto:** Aplicar patrón a GerenteGeneralModal
7. **Séptimo:** Aplicar patrón a OtroApoderadoModal
8. **Octavo:** Testing exhaustivo

---

## ⚠️ NOTAS IMPORTANTES

1. **Este es el módulo más complejo hasta ahora:**

   - Datos Principales: 1 componente
   - Accionistas: 3 componentes + 1 modal
   - **Apoderados: 3 componentes + 4 modales** 🔴

2. **Cada modal debe verificarse individualmente:**

   - No asumir que todos son iguales
   - Leer contenido completo antes de editar
   - Verificar que el footer actual no tenga lógica especial

3. **Gerente General tiene lógica de negocio:**

   - Solo puede haber uno
   - Tiene validaciones especiales
   - NO modificar lógica, solo estilos

4. **Testing más exhaustivo:**
   - Probar cada modal por separado
   - Verificar cada tabla (3 instancias de ApoderadosTable)
   - Verificar flujos completos: crear clase → crear apoderado → editar → eliminar

---

**¿Listo para implementar?** 🚀

**Recomendación:** Implementar en fases, probando cada fase antes de continuar.

**Tiempo estimado total:** 45-60 minutos (por complejidad alta)
