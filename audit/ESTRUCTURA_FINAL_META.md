# 🎯 ESTRUCTURA FINAL - Registro de Sociedades (Meta)

**Fecha:** 14 de Noviembre, 2025  
**Alcance:** Solo hasta **Datos Principales** funcionando  
**Prioridad:** Alta - Base para migración progresiva

---

## 🗂️ Arquitectura Final Deseada

### 1. Hexagonal - Domain Layer (Core de Negocio)

```
app/core/hexag/registros/sociedades/
├── domain/
│   ├── entities/
│   │   └── society.entity.ts                    # Entidad principal
│   ├── enums/
│   │   └── society-register-step.enum.ts        # ✅ Ya existe
│   └── ports/
│       └── society.repository.port.ts           # ✅ Ya existe
│
├── pasos/
│   └── datos-sociedad/                          # ✅ PASO 1 - Ya implementado
│       ├── domain/
│       │   ├── entities/
│       │   │   └── datos-sociedad.entity.ts
│       │   ├── schemas/                         # 🔄 MIGRAR schemas aquí
│       │   │   ├── ruc.schema.ts
│       │   │   ├── razon-social.schema.ts
│       │   │   ├── tipo-sociedad.schema.ts
│       │   │   ├── nombre-comercial.schema.ts
│       │   │   ├── direccion.schema.ts
│       │   │   ├── distrito.schema.ts
│       │   │   ├── provincia.schema.ts
│       │   │   ├── departamento.schema.ts
│       │   │   ├── fechas.schema.ts
│       │   │   ├── oficina-registral.schema.ts
│       │   │   ├── partida-registral.schema.ts
│       │   │   ├── actividad-exterior.schema.ts
│       │   │   └── index.ts                     # ✅ Exporta todos
│       │   └── ports/
│       │       └── datos-sociedad.repository.port.ts
│       │
│       ├── application/
│       │   ├── dtos/
│       │   │   ├── create-datos-sociedad.dto.ts
│       │   │   ├── update-datos-sociedad.dto.ts
│       │   │   └── datos-sociedad-response.dto.ts
│       │   └── use-cases/
│       │       ├── get-datos-sociedad.use-case.ts
│       │       ├── create-datos-sociedad.use-case.ts
│       │       └── update-datos-sociedad.use-case.ts
│       │
│       └── infrastructure/
│           ├── repositories/
│           │   └── datos-sociedad-http.repository.ts
│           ├── mappers/
│           │   └── datos-sociedad.mapper.ts
│           └── msw/
│               ├── datos-sociedad.handlers.ts
│               └── datos-sociedad.db.ts
│
└── application/                                 # ✅ Ya existe
    ├── dtos/
    │   ├── create-society.dto.ts
    │   ├── list-societies.dto.ts
    │   └── society-response.dto.ts
    └── use-cases/
        ├── create-society.use-case.ts           # ✅ Usado en agregar.vue
        ├── list-societies.use-case.ts           # ✅ Usado en historial.vue
        └── delete-society.use-case.ts           # ✅ Usado en historial.vue
```

---

### 2. Presentation Layer (UI State Management)

```
app/core/presentation/registros/sociedades/
├── stores/
│   ├── sociedad-historial.store.ts              # ✅ Ya existe - Lista sociedades
│   └── pasos/
│       └── datos-sociedad.store.ts              # 🆕 CREAR - Maneja estado del paso 1
│
├── composables/
│   └── pasos/
│       └── useDatosSociedad.ts                  # 🆕 CREAR - Lógica de UI del paso 1
│
└── components/
    └── pasos/
        └── datos-sociedad/
            ├── DatosSociedadForm.vue            # 🔄 REFACTORIZAR - Formulario principal
            ├── DatosSociedadPreview.vue         # 🆕 CREAR - Vista previa
            └── sections/
                ├── DatosGeneralesSection.vue    # 🆕 CREAR (opcional) - RUC, Razón Social
                ├── DireccionSection.vue         # 🆕 CREAR (opcional) - Dirección
                └── FechasSection.vue            # 🆕 CREAR (opcional) - Fechas
```

---

### 3. Pages (Solo Rutas)

```
app/pages/registros/sociedades/
├── agregar.vue                                  # ✅ Ya funciona - Crea sociedad
├── historial.vue                                # ✅ Ya funciona - Lista sociedades
│
└── [id]/
    ├── datos-sociedad.vue                       # 🔄 REFACTORIZAR - Paso 1
    ├── preview.vue                              # 🆕 CREAR - Previsualización
    │
    └── (futuros pasos - no implementar aún)
        ├── accionistas.vue
        ├── acciones.vue
        ├── asignacion-acciones.vue
        ├── directorio.vue
        ├── registro-apoderados.vue
        ├── regimen-poderes.vue
        └── quorums-mayorias.vue
```

---

### 4. Configuración de Aliases

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  alias: {
    "@": "./app",
    "~": "./app",
    "@hexag": "./app/core/hexag",
    "@presentation": "./app/core/presentation",
    "@shared": "./app/core/shared",
    "@components": "./app/components",
  },
});
```

---

## 🎯 Flujo de Datos - Datos Principales

### Flujo Completo (Create/Update)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USUARIO INTERACTÚA                           │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PAGE: /registros/sociedades/[id]/datos-sociedad.vue                │
│  - Recibe id de sociedad                                             │
│  - Renderiza DatosSociedadForm.vue                                   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  COMPOSABLE: useDatosSociedad(idSociedad)                            │
│  - onMounted: Carga datos si existen                                 │
│  - handleSubmit: Guarda datos (create/update)                        │
│  - handlePrevious: Navega a paso anterior                            │
│  - handleNext: Navega a siguiente paso                               │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STORE: useDatosSociedadStore()                                      │
│  - state: { datosSociedad, status, errorMessage }                    │
│  - actions:                                                          │
│    - cargarDatos(idSociedad) → GetDatosSociedadUseCase              │
│    - guardarDatos(data) → CreateDatosSociedadUseCase                │
│    - actualizarDatos(id, data) → UpdateDatosSociedadUseCase         │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  USE CASES (Hexagonal - Application Layer)                           │
│  - GetDatosSociedadUseCase.execute(idSociedad)                       │
│  - CreateDatosSociedadUseCase.execute(dto)                           │
│  - UpdateDatosSociedadUseCase.execute(id, dto)                       │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  REPOSITORY (Hexagonal - Infrastructure Layer)                       │
│  - DatosSociedadHttpRepository                                       │
│  - Implementa: IDatosSociedadRepository (Port)                       │
│  - HTTP calls: GET/POST/PUT /api/sociedades/{id}/datos-sociedad     │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  MSW (Development)                                                   │
│  - datos-sociedad.handlers.ts                                        │
│  - datos-sociedad.db.ts (IndexedDB)                                  │
│  - Intercepta HTTP y devuelve mock data                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Checklist de Implementación

### Fase 0: Auditoría y Preparación ✅

- [x] Catalogar schemas existentes
- [x] Identificar imports relativos
- [x] Definir estructura final
- [ ] Configurar aliases en nuxt.config.ts

### Fase 1: Reorganización de Schemas

- [ ] Crear estructura de schemas en domain layer
- [ ] Migrar schemas de `modules/registro-sociedades/schemas/datosSociedad.ts`
- [ ] Dividir en archivos individuales (ruc, razon-social, etc.)
- [ ] Crear index.ts que exporte todos
- [ ] Actualizar imports en componentes existentes

### Fase 2: Presentation Layer - Datos Sociedad

- [ ] Crear `datos-sociedad.store.ts` en presentation layer
- [ ] Crear `useDatosSociedad.ts` composable
- [ ] Refactorizar `DatosSociedadForm.vue`
- [ ] Eliminar `useDatosSociedadController.ts` (complejo)
- [ ] Eliminar `useDatosSociedadForm.ts` (innecesario)

### Fase 3: Page Implementation

- [ ] Crear/refactorizar `[id]/datos-sociedad.vue`
- [ ] Implementar modo create/edit
- [ ] Conectar con composable
- [ ] Navegación entre pasos
- [ ] Validación de formulario

### Fase 4: Testing y Validación

- [ ] Probar flujo completo: agregar → datos-sociedad → guardar
- [ ] Probar flujo completo: historial → editar → datos-sociedad → actualizar
- [ ] Validar que MSW funciona
- [ ] Validar navegación entre pasos
- [ ] Validar estado persistente en store

---

## 🚀 Ejemplo de Código Final

### Store (Presentation Layer)

```typescript
// app/core/presentation/registros/sociedades/stores/pasos/datos-sociedad.store.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { DatosSociedadEntity } from "@hexag/registros/sociedades/pasos/datos-sociedad/domain/entities/datos-sociedad.entity";
import { GetDatosSociedadUseCase } from "@hexag/registros/sociedades/pasos/datos-sociedad/application/use-cases/get-datos-sociedad.use-case";
import { CreateDatosSociedadUseCase } from "@hexag/registros/sociedades/pasos/datos-sociedad/application/use-cases/create-datos-sociedad.use-case";
import { UpdateDatosSociedadUseCase } from "@hexag/registros/sociedades/pasos/datos-sociedad/application/use-cases/update-datos-sociedad.use-case";

export const useDatosSociedadStore = defineStore("datos-sociedad", () => {
  // State
  const datosSociedad = ref<DatosSociedadEntity | null>(null);
  const status = ref<"idle" | "loading" | "success" | "error">("idle");
  const errorMessage = ref<string | null>(null);

  // Use Cases
  const getDatosSociedadUseCase = new GetDatosSociedadUseCase();
  const createDatosSociedadUseCase = new CreateDatosSociedadUseCase();
  const updateDatosSociedadUseCase = new UpdateDatosSociedadUseCase();

  // Actions
  async function cargarDatos(idSociedad: string) {
    status.value = "loading";
    errorMessage.value = null;

    try {
      datosSociedad.value = await getDatosSociedadUseCase.execute(idSociedad);
      status.value = "success";
    } catch (error) {
      status.value = "error";
      errorMessage.value = "No se pudieron cargar los datos principales";
      console.error(error);
    }
  }

  async function guardarDatos(data: Partial<DatosSociedadEntity>) {
    status.value = "loading";
    errorMessage.value = null;

    try {
      const result = await createDatosSociedadUseCase.execute(data);
      datosSociedad.value = result;
      status.value = "success";
      return result;
    } catch (error) {
      status.value = "error";
      errorMessage.value = "No se pudieron guardar los datos principales";
      console.error(error);
      return null;
    }
  }

  async function actualizarDatos(idSociedad: string, data: Partial<DatosSociedadEntity>) {
    status.value = "loading";
    errorMessage.value = null;

    try {
      const result = await updateDatosSociedadUseCase.execute(idSociedad, data);
      datosSociedad.value = result;
      status.value = "success";
      return result;
    } catch (error) {
      status.value = "error";
      errorMessage.value = "No se pudieron actualizar los datos principales";
      console.error(error);
      return null;
    }
  }

  function resetear() {
    datosSociedad.value = null;
    status.value = "idle";
    errorMessage.value = null;
  }

  return {
    // State
    datosSociedad,
    status,
    errorMessage,

    // Actions
    cargarDatos,
    guardarDatos,
    actualizarDatos,
    resetear,
  };
});
```

### Composable (Presentation Layer)

```typescript
// app/core/presentation/registros/sociedades/composables/pasos/useDatosSociedad.ts

import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useDatosSociedadStore } from "@presentation/registros/sociedades/stores/pasos/datos-sociedad.store";
import { storeToRefs } from "pinia";
import type { DatosSociedadEntity } from "@hexag/registros/sociedades/pasos/datos-sociedad/domain/entities/datos-sociedad.entity";

export function useDatosSociedad(idSociedad: string) {
  const router = useRouter();
  const store = useDatosSociedadStore();
  const { datosSociedad, status, errorMessage } = storeToRefs(store);

  const isLoading = computed(() => status.value === "loading");
  const isExistingData = computed(() => !!datosSociedad.value);

  onMounted(async () => {
    // Cargar datos existentes si hay
    await store.cargarDatos(idSociedad);
  });

  async function handleSubmit(formData: Partial<DatosSociedadEntity>) {
    let result;

    if (isExistingData.value) {
      // Actualizar
      result = await store.actualizarDatos(idSociedad, formData);
    } else {
      // Crear
      result = await store.guardarDatos({ ...formData, idSociedad });
    }

    if (result) {
      // Navegar al siguiente paso
      await router.push(`/registros/sociedades/${idSociedad}/accionistas`);
    }
  }

  function handlePrevious() {
    router.push(`/registros/sociedades/historial`);
  }

  async function handleNext() {
    // Validar que existan datos guardados
    if (!datosSociedad.value) {
      alert("Debes guardar los datos principales antes de continuar");
      return;
    }

    await router.push(`/registros/sociedades/${idSociedad}/accionistas`);
  }

  return {
    // State
    datosSociedad,
    isLoading,
    errorMessage,
    isExistingData,

    // Actions
    handleSubmit,
    handlePrevious,
    handleNext,
  };
}
```

### Page (Simplificada)

```vue
<!-- app/pages/registros/sociedades/[id]/datos-sociedad.vue -->

<script setup lang="ts">
  import { useDatosSociedad } from "@presentation/registros/sociedades/composables/pasos/useDatosSociedad";
  import DatosSociedadForm from "@presentation/registros/sociedades/components/pasos/datos-sociedad/DatosSociedadForm.vue";

  definePageMeta({
    layout: "flow-with-sidebar",
  });

  const route = useRoute();
  const idSociedad = route.params.id as string;

  const {
    datosSociedad,
    isLoading,
    errorMessage,
    isExistingData,
    handleSubmit,
    handlePrevious,
    handleNext,
  } = useDatosSociedad(idSociedad);
</script>

<template>
  <div class="space-y-6 p-6">
    <PageTitle title-key="pages.datosPrincipales" />

    <p v-if="errorMessage" class="text-sm text-red-500">
      {{ errorMessage }}
    </p>

    <DatosSociedadForm
      v-if="!isLoading"
      :initial-data="datosSociedad"
      :is-editing="isExistingData"
      @submit="handleSubmit"
      @previous="handlePrevious"
      @next="handleNext"
    />

    <div v-else class="text-center text-primary-600">Cargando datos principales...</div>
  </div>
</template>
```

### Form Component (Refactorizada)

```vue
<!-- app/core/presentation/registros/sociedades/components/pasos/datos-sociedad/DatosSociedadForm.vue -->

<script setup lang="ts">
  import { ref } from "vue";
  import { useForm } from "vee-validate";
  import { toTypedSchema } from "@vee-validate/zod";
  import { datosSociedadSchema } from "@hexag/registros/sociedades/pasos/datos-sociedad/domain/schemas";
  import type { DatosSociedadEntity } from "@hexag/registros/sociedades/pasos/datos-sociedad/domain/entities/datos-sociedad.entity";
  import { Button } from "@components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
  import TextInputZod from "@components/base/inputs/TextInputZod.vue";
  import SelectInputZod from "@components/base/inputs/SelectInputZod.vue";
  import DateInputZod from "@components/base/inputs/DateInputZod.vue";

  interface Props {
    initialData?: DatosSociedadEntity | null;
    isEditing?: boolean;
  }

  interface Emits {
    (e: "submit", data: Partial<DatosSociedadEntity>): void;
    (e: "previous"): void;
    (e: "next"): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    initialData: null,
    isEditing: false,
  });

  const emit = defineEmits<Emits>();

  const isSubmitting = ref(false);

  const { handleSubmit, values, errors } = useForm({
    validationSchema: toTypedSchema(datosSociedadSchema),
    initialValues: props.initialData || {},
  });

  const onSubmit = handleSubmit(async (formValues) => {
    isSubmitting.value = true;
    emit("submit", formValues);
    isSubmitting.value = false;
  });
</script>

<template>
  <form @submit="onSubmit">
    <Card>
      <CardHeader>
        <CardTitle>Datos Principales de la Sociedad</CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- RUC -->
        <TextInputZod name="ruc" label="RUC" placeholder="20123456789" :error="errors.ruc" />

        <!-- Razón Social -->
        <TextInputZod
          name="razonSocial"
          label="Razón Social"
          placeholder="EMPRESA S.A.C."
          :error="errors.razonSocial"
        />

        <!-- Tipo Societario -->
        <SelectInputZod
          name="tipoSocietario"
          label="Tipo Societario"
          :options="[
            { value: 'SAC', label: 'Sociedad Anónima Cerrada' },
            { value: 'SA', label: 'Sociedad Anónima' },
            { value: 'SRL', label: 'Sociedad de Responsabilidad Limitada' },
          ]"
          :error="errors.tipoSocietario"
        />

        <!-- Nombre Comercial -->
        <TextInputZod
          name="nombreComercial"
          label="Nombre Comercial (opcional)"
          placeholder="Mi Empresa"
          :error="errors.nombreComercial"
        />

        <!-- ... más campos ... -->

        <!-- Botones de navegación -->
        <div class="flex items-center justify-between pt-4">
          <Button type="button" variant="outline" @click="emit('previous')">
            Volver al historial
          </Button>

          <div class="flex gap-3">
            <Button type="submit" variant="primary" :disabled="isSubmitting">
              {{ isEditing ? "Actualizar" : "Guardar" }} y continuar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </form>
</template>
```

---

## 🗑️ Archivos a ELIMINAR (Después de migrar)

### Legacy Module (Completo)

```
app/modules/registro-sociedades/
├── components/              # ❌ Eliminar todo
├── composables/             # ❌ Eliminar todo
├── schemas/                 # ❌ Eliminar todo (ya migrado)
├── stores/                  # ❌ Eliminar todo
└── types/                   # ❌ Eliminar todo
```

### Páginas Legacy (Si existen)

```
app/pages/registros/sociedades/
├── crear/[id]/             # ❌ Eliminar (duplicado)
└── editar/[id]/            # ❌ Eliminar (duplicado)
```

### Composables Complejos (Innecesarios)

```
app/core/presentation/registros/sociedades/composables/
├── useDatosSociedadController.ts    # ❌ Eliminar
└── useDatosSociedadForm.ts          # ❌ Eliminar
```

---

## 📊 Métricas de Éxito

### Funcionalidades que DEBEN funcionar:

1. ✅ **Agregar Sociedad** (`/registros/sociedades/agregar`)

   - Crear nueva sociedad
   - Redirigir a datos-sociedad

2. ✅ **Historial** (`/registros/sociedades/historial`)

   - Listar todas las sociedades
   - Ver paso actual
   - Editar sociedad
   - Eliminar sociedad

3. 🆕 **Datos Principales** (`/registros/sociedades/[id]/datos-sociedad`)
   - Crear datos principales (nuevo registro)
   - Actualizar datos principales (edición)
   - Validación de formulario
   - Navegación a siguiente paso

### Flujo Completo:

```
Usuario → Agregar Sociedad → Crear ID → Datos Principales → Guardar → Siguiente Paso
                                                                              ↓
                                                                         (Accionistas)
                                                                      [Futuro - No implementar]
```

---

## ⚠️ Reglas de Oro

1. **NO modificar nada en** `app/modules/registro-sociedades/` aún
2. **NO eliminar nada** hasta migrar completamente
3. **Usar SOLO aliases** (`@hexag`, `@presentation`, etc.)
4. **Un schema = Un archivo** (ruc.schema.ts, razon-social.schema.ts)
5. **Stores SOLO para estado UI**, use cases para lógica
6. **Composables SOLO para lógica de componentes**, no negocio
7. **Pages SOLO para rutas**, sin lógica de negocio
8. **Validar con MSW** antes de integrar backend real

---

## 🚀 Orden de Ejecución Recomendado

1. **Configurar aliases** (5 min)
2. **Migrar schemas** (30 min)
3. **Actualizar imports** (1 hora)
4. **Crear store de datos-sociedad** (30 min)
5. **Crear composable useDatosSociedad** (30 min)
6. **Refactorizar DatosSociedadForm** (1.5 horas)
7. **Crear/refactorizar page datos-sociedad.vue** (30 min)
8. **Testing completo** (1 hora)

**Total estimado:** ~6 horas

---

## 📝 Notas Finales

- Este documento es la **guía maestra** para la migración
- Cada paso debe validarse antes de continuar
- MSW debe funcionar en todo momento
- Commits frecuentes con mensajes claros
- Documentar decisiones importantes

---

**¿Listo para empezar?** 🚀

Comienza configurando los aliases en `nuxt.config.ts` y luego sigue el orden de ejecución. ¡Éxito! 💪
