# 🎨 Sociedades - Capa Presentation

> Este documento describe la **capa Presentation** del módulo de Sociedades: Stores, Controllers y Componentes Vue.

---

## 🎯 ¿Qué es la Capa Presentation?

La capa Presentation maneja la interacción con el usuario (UI/UX):
- **Stores (Pinia):** Estado global (OBLIGATORIO usar Option API)
- **Controllers (Composables):** Gestión de ciclo de vida
- **Componentes Vue:** UI/UX
- **Mappers UI (opcional):** FormData ↔ DTO/Entidad

---

## 📂 Estructura

```
app/core/presentation/registros/sociedades/
├── stores/
│   ├── sociedad.store.ts           # Store principal
│   ├── accionistas.store.ts
│   ├── acciones.store.ts
│   └── ... (otros stores)
├── composables/
│   ├── useSociedadController.ts
│   └── ... (otros controllers)
├── mappers/                         # Opcional
│   └── sociedad-form.mapper.ts
└── types/
    └── sociedad-form.types.ts
```

---

## 1️⃣ Stores (Pinia - Option API OBLIGATORIO)

### ⚠️ REGLA IMPORTANTE:
**OBLIGATORIO usar Option API**, NO Composition API.

### ✅ Formato CORRECTO:

```typescript
// app/core/presentation/registros/sociedades/stores/sociedad.store.ts

import { defineStore } from "pinia";
import { CreateDatosPrincipalesUseCase } from "@hexag/registros/sociedades/pasos/datos-principales/application/use-cases/create-datos-principales.use-case";
import { DatosPrincipalesHttpRepository } from "@hexag/registros/sociedades/pasos/datos-principales/infrastructure/repositories/datos-principales.http.repository";
import type { DatosPrincipalesEntity } from "@hexag/registros/sociedades/pasos/datos-principales/domain/entities/datos-principales.entity";

export const useSociedadStore = defineStore("sociedad", {
  state: () => ({
    datos: null as DatosPrincipalesEntity | null,
    loading: false,
    error: null as string | null,
    societyId: null as string | null,
  }),

  getters: {
    hasData: (state) => state.datos !== null,
    isLoading: (state) => state.loading,
    razonSocial: (state) => state.datos?.razonSocial || "",
  },

  actions: {
    async createSociedad(data: any) {
      this.loading = true;
      this.error = null;

      try {
        // Instanciar caso de uso con repositorio
        const repository = new DatosPrincipalesHttpRepository();
        const useCase = new CreateDatosPrincipalesUseCase(repository);

        // Ejecutar caso de uso
        this.datos = await useCase.execute(data);
        this.societyId = this.datos.id;

        return this.datos;
      } catch (err: any) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async loadSociedad(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const repository = new DatosPrincipalesHttpRepository();
        this.datos = await repository.getById(id);
        this.societyId = id;
      } catch (err: any) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    reset() {
      this.datos = null;
      this.loading = false;
      this.error = null;
      this.societyId = null;
    },
  },
});
```

### ❌ Formato INCORRECTO (NO usar):

```typescript
// ❌ NO usar Composition API
export const useSociedadStore = defineStore("sociedad", () => {
  const datos = ref(null);
  const loading = ref(false);
  
  return { datos, loading };
});
```

---

## 2️⃣ Controllers (Composables)

### Propósito:
Gestionar ciclo de vida y coordinar stores.

### Ejemplo:

```typescript
// app/core/presentation/registros/sociedades/composables/useSociedadController.ts

import { onMounted, onActivated, computed } from "vue";
import { useSociedadStore } from "../stores/sociedad.store";
import { useRoute } from "vue-router";

export function useSociedadController() {
  const store = useSociedadStore();
  const route = useRoute();

  // Cargar datos al montar
  onMounted(async () => {
    const societyId = route.params.id as string;
    if (societyId) {
      await store.loadSociedad(societyId);
    }
  });

  // Refrescar al reactivar (keep-alive)
  onActivated(async () => {
    if (store.societyId) {
      await store.loadSociedad(store.societyId);
    }
  });

  return {
    // Estado
    datos: computed(() => store.datos),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    hasData: computed(() => store.hasData),
    
    // Acciones
    createSociedad: store.createSociedad,
    loadSociedad: store.loadSociedad,
    reset: store.reset,
  };
}
```

---

## 3️⃣ Uso en Componentes Vue

### Ejemplo: Página de Datos Principales

```vue
<!-- app/pages/registros/sociedades/datos-principales.vue -->

<script setup lang="ts">
import { useSociedadController } from "@/core/presentation/registros/sociedades/composables/useSociedadController";

definePageMeta({
  layout: "registros",
  flowLayout: true,
});

const { datos, loading, error, createSociedad } = useSociedadController();

const formData = reactive({
  razonSocial: "",
  nombreComercial: "",
  objetoSocial: "",
  tipoSociedad: "SA" as const,
  duracion: 50,
  capitalSocial: 10000,
});

const handleSubmit = async () => {
  try {
    await createSociedad(formData);
    
    // Navegar al siguiente paso
    navigateTo("/registros/sociedades/accionistas");
  } catch (err: any) {
    console.error("Error:", err.message);
  }
};
</script>

<template>
  <div class="p-8">
    <h1>Paso 1: Datos Principales</h1>

    <form @submit.prevent="handleSubmit">
      <div>
        <label>Razón Social:</label>
        <input v-model="formData.razonSocial" required />
      </div>

      <div>
        <label>Capital Social:</label>
        <input v-model.number="formData.capitalSocial" type="number" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Guardando..." : "Siguiente" }}
      </button>

      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>
```

---

## 4️⃣ Flow Layout Integration

### Store del Layout:

```typescript
// app/core/presentation/layout/stores/flow-layout.store.ts

import { defineStore } from "pinia";

export const useFlowLayoutStore = defineStore("flowLayout", {
  state: () => ({
    isLoading: false,
    onClickNext: () => {},
  }),

  actions: {
    setNextHandler(handler: () => void | Promise<void>) {
      this.onClickNext = handler;
    },

    setLoading(loading: boolean) {
      this.isLoading = loading;
    },
  },
});
```

### Uso en Página:

```vue
<script setup lang="ts">
import { useFlowLayoutStore } from "@/core/presentation/layout/stores/flow-layout.store";

const flowLayoutStore = useFlowLayoutStore();
const { createSociedad } = useSociedadController();

// Configurar handler del botón "Siguiente"
onMounted(() => {
  flowLayoutStore.setNextHandler(async () => {
    flowLayoutStore.setLoading(true);
    try {
      await createSociedad(formData);
      navigateTo("/registros/sociedades/accionistas");
    } catch (err) {
      console.error(err);
    } finally {
      flowLayoutStore.setLoading(false);
    }
  });
});
</script>
```

---

## 5️⃣ Mappers UI (Opcional)

### Propósito:
Convertir FormData (UI) ↔ DTO/Entidad (dominio).

### Ejemplo:

```typescript
// app/core/presentation/registros/sociedades/mappers/sociedad-form.mapper.ts

import type { SociedadFormData } from "../types/sociedad-form.types";
import type { CreateDatosPrincipalesDTO } from "@hexag/registros/sociedades/pasos/datos-principales/application/dtos/create-datos-principales.dto";

export class SociedadFormMapper {
  // FormData → DTO
  static toDTO(formData: SociedadFormData): CreateDatosPrincipalesDTO {
    return {
      razonSocial: formData.razonSocial.trim(),
      nombreComercial: formData.nombreComercial.trim(),
      objetoSocial: formData.objetoSocial.trim(),
      tipoSociedad: formData.tipoSociedad,
      duracion: formData.duracion,
      capitalSocial: formData.capitalSocial,
    };
  }

  // DTO → FormData
  static toFormData(dto: CreateDatosPrincipalesDTO): SociedadFormData {
    return {
      razonSocial: dto.razonSocial,
      nombreComercial: dto.nombreComercial,
      objetoSocial: dto.objetoSocial,
      tipoSociedad: dto.tipoSociedad,
      duracion: dto.duracion,
      capitalSocial: dto.capitalSocial,
    };
  }
}
```

---

## 📊 Stores por Paso

| Paso | Store | Responsabilidad |
|------|-------|----------------|
| 1 | `useSociedadStore` | Datos principales (create, load, update) |
| 2 | `useAccionistasStore` | Accionistas (create, list, update, delete) |
| 3 | `useAccionesStore` | Acciones (create, list, update) |
| 4 | `useAsignacionStore` | Asignación (createBulk, load) |
| 5 | `useDirectorioStore` | Directorio config + directores |
| 6 | `useApoderadosStore` | Clases + apoderados |
| 8 | `useQuorumStore` | Quorum (load, update) |

---

## 🎯 Principios de Presentation

### ✅ Hacer:

1. **Stores en Option API:**
   ```typescript
   export const useStore = defineStore("name", {
     state: () => ({ ... }),
     actions: { ... },
   });
   ```

2. **Controllers para ciclo de vida:**
   ```typescript
   export function useController() {
     onMounted(() => { ... });
     return { ... };
   }
   ```

3. **Usar Use Cases en stores:**
   ```typescript
   const useCase = new CreateUseCase(repository);
   const result = await useCase.execute(data);
   ```

---

### ❌ Evitar:

1. **NO usar Composition API en stores:**
   ```typescript
   // ❌ MAL
   export const useStore = defineStore("name", () => { ... });
   ```

2. **NO hacer HTTP directamente:**
   ```typescript
   // ❌ MAL
   const response = await $fetch('/api/...');
   ```

---

## 📚 Recursos Adicionales

- [01-vision-general.md](./01-vision-general.md) - Visión del módulo
- [03-application.md](./03-application.md) - Use Cases usados en stores
- [../../../architecture/02-hexagonal-ddd-profundo.md](../../../architecture/02-hexagonal-ddd-profundo.md) - Arquitectura completa

---

**Última actualización:** Diciembre 3, 2025

