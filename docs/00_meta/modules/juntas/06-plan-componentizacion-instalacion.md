# 🏗️ Plan de Componentización: Instalación de Junta

> Plan profesional para refactorizar el paso de Instalación siguiendo el patrón probado en Sociedades.

---

## 🎯 Objetivo

Refactorizar `instalacion/` para que siga el **mismo patrón** que los pasos de Sociedades (Apoderados, Directorio, etc.)

---

## 📐 Patrón de Referencia (Sociedades)

### Estructura probada en `app/core/presentation/registros/sociedades/pasos/apoderados/`:

```
apoderados/
├── ApoderadosManager.vue          # Orquestador (< 200 líneas)
├── components/
│   ├── ApoderadosTable.vue
│   ├── ClasesApoderadoTable.vue
│   ├── GerenteGeneralTable.vue
│   └── modals/
│       ├── ApoderadoModal.vue
│       └── GerenteGeneralModal.vue
├── composables/
│   ├── useApoderados.ts           # Lógica de apoderados
│   ├── useClasesApoderado.ts      # Lógica de clases
│   └── useGerenteGeneral.ts       # Lógica de gerente
├── stores/
│   └── useClasesYApoderadoStore.ts # Store Option API
├── schemas/
│   └── apoderado.schema.ts
├── types/
│   └── types.ts
└── utils/
    └── mapper-apoderados.ts
```

**Características clave:**
- ✅ **Manager** = Orquestador (solo imports y onMounted)
- ✅ **Composables** = Lógica por entidad (modals, CRUD, validaciones)
- ✅ **Store** = Estado global + Use Cases
- ✅ **Components** = UI pura (tablas, modales, cards)

---

## 🎯 Plan para Instalación (Siguiendo el Patrón)

### Estructura objetivo:

```
app/core/presentation/operaciones/junta-accionistas/pasos/instalacion/
│
├── InstalacionManager.vue              # Orquestador principal (< 150 líneas)
│
├── components/
│   ├── 01-detalles/
│   │   ├── DetallesCelebracionCard.vue      # Card wrapper
│   │   ├── FechaCelebracionInput.vue
│   │   ├── LugarCelebracionInput.vue
│   │   └── TipoConvocatoriaSelect.vue
│   │
│   ├── 02-quorum/
│   │   ├── QuorumCard.vue                   # Card wrapper
│   │   ├── QuorumIndicator.vue              # Muestra % quorum
│   │   └── QuorumRequisitoInfo.vue          # Info de requisito
│   │
│   ├── 03-asistencia/
│   │   ├── AsistenciaCard.vue               # Card wrapper
│   │   ├── AsistenciaTable.vue              # Tabla de asistentes
│   │   ├── AsistenciaRow.vue                # Fila individual
│   │   ├── RepresentacionSelector.vue       # Selector de representante
│   │   └── modals/
│   │       └── RepresentanteModal.vue       # Modal selección
│   │
│   └── 04-mesa-directiva/
│       ├── MesaDirectivaCard.vue            # Card wrapper (80 líneas)
│       ├── PresidenteDesignacion.vue        # Designación presidente (120 líneas)
│       │   ├── PresidenteReadonly.vue       # Modo readonly (40 líneas)
│       │   ├── PresidenteSelector.vue       # Modo selector (40 líneas)
│       │   └── PresidenteReemplazo.vue      # Reemplazo si no asiste (40 líneas)
│       ├── SecretarioDesignacion.vue        # Designación secretario (120 líneas)
│       │   ├── SecretarioReadonly.vue       # Modo readonly (40 líneas)
│       │   ├── SecretarioSelector.vue       # Modo selector (40 líneas)
│       │   └── SecretarioReemplazo.vue      # Reemplazo si no asiste (40 líneas)
│       └── AsistenciaSwitch.vue             # Switch SI/NO reutilizable (30 líneas)
│
├── composables/
│   ├── useInstalacionController.ts          # Controller principal (lifecycle)
│   ├── useDetallesCelebracion.ts            # Lógica detalles celebración
│   ├── useAsistenciaLogic.ts                # Lógica asistencia/representación
│   ├── usePresidenteDesignacion.ts          # Lógica presidente (validaciones + modos)
│   ├── useSecretarioDesignacion.ts          # Lógica secretario (validaciones + modos)
│   └── useQuorumValidation.ts               # Validaciones de quorum
│
├── stores/
│   └── instalacion.store.ts                 # Store específico (Option API)
│       # Integra: snapshot, meeting-details, asistencia
│
├── schemas/
│   ├── detalles-celebracion.schema.ts
│   ├── asistencia.schema.ts
│   └── mesa-directiva.schema.ts
│
├── types/
│   ├── instalacion.types.ts
│   ├── mesa-directiva.types.ts
│   └── enums/
│       ├── ModoDesignacion.enum.ts          # "AUTO" | "MANUAL"
│       └── OrigenDesignacion.enum.ts        # "PRESIDENTE_DIRECTORIO" | "GERENTE" | "ASISTENTE"
│
└── utils/
    ├── presidente-secretario.utils.ts       # Helpers de validación
    └── quorum.utils.ts                      # Cálculos de quorum
```

---

## 📋 Detalle de Cada Parte

### 1️⃣ InstalacionManager.vue (< 150 líneas)

**Responsabilidad:** Solo orquestar componentes.

```vue
<script setup lang="ts">
import { onMounted } from "vue";
import { useInstalacionController } from "./composables/useInstalacionController";
import DetallesCelebracionCard from "./components/01-detalles/DetallesCelebracionCard.vue";
import QuorumCard from "./components/02-quorum/QuorumCard.vue";
import AsistenciaCard from "./components/03-asistencia/AsistenciaCard.vue";
import MesaDirectivaCard from "./components/04-mesa-directiva/MesaDirectivaCard.vue";

definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true,
});

const route = useRoute();
const societyId = computed(() => parseInt(route.params.societyId as string, 10));
const flowId = computed(() => parseInt(route.params.flowId as string, 10));

// Usar controller principal
const { loading, error, loadData, handleNext } = useInstalacionController(
  societyId,
  flowId
);

onMounted(async () => {
  await loadData();
});

// Configurar botón siguiente
useJuntasFlowNext(handleNext);
</script>

<template>
  <SlotWrapper>
    <TitleH2 
      title="Instalación de la Junta" 
      subtitle="Registra asistencia, representación y mesa directiva"
    />

    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else class="flex flex-col gap-10">
      <DetallesCelebracionCard />
      <QuorumCard />
      <AsistenciaCard />
      <MesaDirectivaCard />
    </div>
  </SlotWrapper>
</template>
```

**Líneas:** ~60 líneas (vs 254 actual)

---

### 2️⃣ Composables (Lógica Reutilizable)

#### `useInstalacionController.ts` (Controller Principal)

```typescript
// composables/useInstalacionController.ts

export function useInstalacionController(
  societyId: Ref<number>,
  flowId: Ref<number>
) {
  const instalacionStore = useInstalacionStore();
  
  const loading = computed(() => instalacionStore.loading);
  const error = computed(() => instalacionStore.error);

  /**
   * Cargar todos los datos necesarios
   */
  const loadData = async () => {
    await instalacionStore.loadInstalacionData(societyId.value, flowId.value);
  };

  /**
   * Handler del botón "Siguiente"
   */
  const handleNext = async () => {
    await instalacionStore.validateAndSave(societyId.value, flowId.value);
  };

  return {
    loading,
    error,
    loadData,
    handleNext,
  };
}
```

**Responsabilidad:** Gestionar lifecycle y botón siguiente.

---

#### `usePresidenteDesignacion.ts`

```typescript
// composables/usePresidenteDesignacion.ts

export function usePresidenteDesignacion(societyId: Ref<number>) {
  const instalacionStore = useInstalacionStore();

  // Computed: Modo de designación
  const modo = computed<"readonly" | "selector">(() => {
    return instalacionStore.getModoPresidente;
  });

  // Computed: Datos del presidente
  const presidenteData = computed(() => {
    return instalacionStore.getPresidenteData;
  });

  // Estado local: Asistió?
  const asistio = ref(true);
  const reemplazoId = ref("");

  // Handler: Cambiar asistencia
  const handleAsistenciaChange = (nuevoValor: boolean) => {
    asistio.value = nuevoValor;
    instalacionStore.setPresidenteAsistencia(nuevoValor, reemplazoId.value);
  };

  // Handler: Seleccionar reemplazo
  const handleReemplazoChange = (id: string) => {
    reemplazoId.value = id;
    instalacionStore.setPresidenteReemplazo(id);
  };

  return {
    modo,
    presidenteData,
    asistio,
    reemplazoId,
    handleAsistenciaChange,
    handleReemplazoChange,
  };
}
```

**Responsabilidad:** Lógica de presidente (modo, asistencia, reemplazo).

---

#### `useSecretarioDesignacion.ts`

```typescript
// composables/useSecretarioDesignacion.ts

export function useSecretarioDesignacion(societyId: Ref<number>) {
  const instalacionStore = useInstalacionStore();

  // Computed: Modo de designación
  const modo = computed<"readonly" | "selector">(() => {
    return instalacionStore.getModoSecretario;
  });

  // Computed: Datos del secretario
  const secretarioData = computed(() => {
    return instalacionStore.getSecretarioData;
  });

  // Estado local: Asistió?
  const asistio = ref(true);
  const reemplazoId = ref("");

  // Handler: Cambiar asistencia
  const handleAsistenciaChange = (nuevoValor: boolean) => {
    asistio.value = nuevoValor;
    instalacionStore.setSecretarioAsistencia(nuevoValor, reemplazoId.value);
  };

  // Handler: Seleccionar reemplazo
  const handleReemplazoChange = (id: string) => {
    reemplazoId.value = id;
    instalacionStore.setSecretarioReemplazo(id);
  };

  return {
    modo,
    secretarioData,
    asistio,
    reemplazoId,
    handleAsistenciaChange,
    handleReemplazoChange,
  };
}
```

**Responsabilidad:** Lógica de secretario (modo, asistencia, reemplazo).

---

### 3️⃣ Store: `instalacion.store.ts` (Option API)

```typescript
// stores/instalacion.store.ts

import { defineStore } from "pinia";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";

export const useInstalacionStore = defineStore("instalacion", {
  state: () => ({
    loading: false,
    error: null as string | null,
  }),

  getters: {
    // ===== PRESIDENTE =====
    
    getModoPresidente(): "readonly" | "selector" {
      const snapshotStore = useSnapshotStore();
      const directorio = snapshotStore.snapshot?.directory;
      
      // Si tiene presidente del directorio asignado → readonly
      if (directorio?.presidenteId) {
        return "readonly";
      }
      return "selector";
    },

    getPresidenteData(): {
      id: string | null;
      nombre: string | null;
      origen: "PRESIDENTE_DIRECTORIO" | "ASISTENTE";
    } {
      const snapshotStore = useSnapshotStore();
      const meetingDetailsStore = useMeetingDetailsStore();
      
      if (this.getModoPresidente === "readonly") {
        const presidente = snapshotStore.presidenteDirectorio;
        return {
          id: presidente?.id || null,
          nombre: presidente?.persona 
            ? `${presidente.persona.nombre} ${presidente.persona.apellidoPaterno}` 
            : "Presidente del Directorio",
          origen: "PRESIDENTE_DIRECTORIO",
        };
      }
      
      return {
        id: meetingDetailsStore.meetingDetails?.presidenteId || null,
        nombre: null,
        origen: "ASISTENTE",
      };
    },

    // ===== SECRETARIO =====
    
    getModoSecretario(): "readonly" | "selector" {
      const snapshotStore = useSnapshotStore();
      const directorio = snapshotStore.snapshot?.directory;
      const gerenteGeneral = snapshotStore.snapshot?.gerenteGeneral;
      
      // Si tiene gerente general asignado como secretario → readonly
      if (directorio?.secretarioAsignado && gerenteGeneral) {
        return "readonly";
      }
      return "selector";
    },

    getSecretarioData(): {
      id: string | null;
      nombre: string | null;
      origen: "GERENTE_GENERAL" | "ASISTENTE";
    } {
      const snapshotStore = useSnapshotStore();
      const meetingDetailsStore = useMeetingDetailsStore();
      
      if (this.getModoSecretario === "readonly") {
        const gerente = snapshotStore.snapshot?.gerenteGeneral;
        return {
          id: gerente?.id || null,
          nombre: gerente?.persona 
            ? `${gerente.persona.nombre} ${gerente.persona.apellidoPaterno}` 
            : "Gerente General",
          origen: "GERENTE_GENERAL",
        };
      }
      
      return {
        id: meetingDetailsStore.meetingDetails?.secretarioId || null,
        nombre: null,
        origen: "ASISTENTE",
      };
    },

    // ===== ASISTENTES =====
    
    getAsistentesPresentes() {
      const asistenciaStore = useAsistenciaStore();
      return asistenciaStore.asistenciasEnriquecidas
        .filter(a => a.asistio)
        .map((a, index) => ({
          id: index + 1,
          value: a.id,
          label: a.nombreCompleto,
        }));
    },
  },

  actions: {
    /**
     * Cargar todos los datos necesarios
     */
    async loadInstalacionData(societyId: number, flowId: number) {
      this.loading = true;
      this.error = null;

      try {
        const snapshotStore = useSnapshotStore();
        const meetingDetailsStore = useMeetingDetailsStore();
        const asistenciaStore = useAsistenciaStore();

        // 1. Cargar snapshot
        await snapshotStore.loadSnapshot(societyId, flowId);

        // 2. Cargar meeting details
        await meetingDetailsStore.loadMeetingDetails(societyId, flowId);

        // 3. Inicializar presidente y secretario
        await meetingDetailsStore.patchMeetingDetails({
          presidenteAsistio: true,
          secretarioAsistio: true,
          presidenteId: snapshotStore.snapshot?.directory?.presidenteId,
          secretarioId: snapshotStore.snapshot?.gerenteGeneral?.id,
        });

        // 4. Cargar asistencias
        await asistenciaStore.loadAsistencias(societyId, flowId);

        // 5. Si es Junta Universal, marcar todos como presentes
        if (meetingDetailsStore.meetingDetails?.tipoJunta === "UNIVERSAL") {
          for (const asistencia of asistenciaStore.asistencias) {
            if (!asistencia.asistio) {
              await asistenciaStore.toggleAsistencia(societyId, flowId, asistencia.id);
            }
          }
        }
      } catch (err: any) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Actualizar asistencia del presidente
     */
    setPresidenteAsistencia(asistio: boolean, reemplazoId?: string) {
      const meetingDetailsStore = useMeetingDetailsStore();
      meetingDetailsStore.patchMeetingDetails({
        presidenteAsistio: asistio,
        presidenteId: asistio ? this.getPresidenteData.id : reemplazoId,
      });
    },

    /**
     * Actualizar reemplazo del presidente
     */
    setPresidenteReemplazo(id: string) {
      const meetingDetailsStore = useMeetingDetailsStore();
      meetingDetailsStore.patchMeetingDetails({
        presidenteId: id,
        presidenteAsistio: false,
      });
    },

    /**
     * Actualizar asistencia del secretario
     */
    setSecretarioAsistencia(asistio: boolean, reemplazoId?: string) {
      const meetingDetailsStore = useMeetingDetailsStore();
      meetingDetailsStore.patchMeetingDetails({
        secretarioAsistio: asistio,
        secretarioId: asistio ? this.getSecretarioData.id : reemplazoId,
      });
    },

    /**
     * Actualizar reemplazo del secretario
     */
    setSecretarioReemplazo(id: string) {
      const meetingDetailsStore = useMeetingDetailsStore();
      meetingDetailsStore.patchMeetingDetails({
        secretarioId: id,
        secretarioAsistio: false,
      });
    },

    /**
     * Validar y guardar instalación
     */
    async validateAndSave(societyId: number, flowId: number) {
      const meetingDetailsStore = useMeetingDetailsStore();
      const asistenciaStore = useAsistenciaStore();

      // Validaciones
      const totalAsistentes = asistenciaStore.asistenciasEnriquecidas.filter(
        a => a.asistio
      ).length;

      if (totalAsistentes === 0) {
        throw new Error("Debe haber al menos un asistente");
      }

      if (!meetingDetailsStore.meetingDetails?.presidenteId) {
        throw new Error("Debe designar un presidente");
      }

      if (!meetingDetailsStore.meetingDetails?.secretarioId) {
        throw new Error("Debe designar un secretario");
      }

      if (
        meetingDetailsStore.meetingDetails.presidenteId === 
        meetingDetailsStore.meetingDetails.secretarioId
      ) {
        throw new Error("Presidente y secretario deben ser diferentes");
      }

      // Guardar
      await meetingDetailsStore.updateMeetingDetails(
        meetingDetailsStore.meetingDetails
      );
    },
  },
});
```

**Responsabilidad:** 
- Estado global de instalación
- Getters para presidente/secretario
- Actions para cargar, actualizar, validar

---

### 4️⃣ Componentes UI

#### `MesaDirectivaCard.vue` (Wrapper - 80 líneas)

```vue
<script setup lang="ts">
import { useInstalacionStore } from "../../stores/instalacion.store";
import PresidenteDesignacion from "./PresidenteDesignacion.vue";
import SecretarioDesignacion from "./SecretarioDesignacion.vue";

const instalacionStore = useInstalacionStore();
const asistentes = computed(() => instalacionStore.getAsistentesPresentes);
</script>

<template>
  <SimpleCard>
    <CardTitle 
      title="Presidente y Secretario de la Junta"
      body="Elija al Presidente y al Secretario de la junta."
    />

    <div class="grid grid-cols-2 gap-6">
      <PresidenteDesignacion :asistentes="asistentes" />
      <SecretarioDesignacion :asistentes="asistentes" />
    </div>
  </SimpleCard>
</template>
```

---

#### `PresidenteDesignacion.vue` (120 líneas)

```vue
<script setup lang="ts">
import { usePresidenteDesignacion } from "../../composables/usePresidenteDesignacion";
import PresidenteReadonly from "./PresidenteReadonly.vue";
import PresidenteSelector from "./PresidenteSelector.vue";
import PresidenteReemplazo from "./PresidenteReemplazo.vue";
import AsistenciaSwitch from "./AsistenciaSwitch.vue";

const props = defineProps<{
  asistentes: Array<{ id: number; value: string; label: string }>;
}>();

const route = useRoute();
const societyId = computed(() => parseInt(route.params.societyId as string, 10));

const {
  modo,
  presidenteData,
  asistio,
  reemplazoId,
  handleAsistenciaChange,
  handleReemplazoChange,
} = usePresidenteDesignacion(societyId);
</script>

<template>
  <div class="flex flex-col gap-4 p-6 border border-gray-200 rounded-lg bg-gray-50">
    <!-- Header con Switch -->
    <div class="flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <span class="font-bold text-gray-800">Presidente de la Junta</span>
        <span class="text-sm text-gray-600">
          {{ asistio ? "Asistió" : "No Asistió" }}
        </span>
      </div>

      <AsistenciaSwitch 
        :model-value="asistio"
        @update:model-value="handleAsistenciaChange"
      />
    </div>

    <!-- Contenido condicional -->
    <PresidenteReadonly 
      v-if="asistio && modo === 'readonly'"
      :nombre="presidenteData.nombre"
    />

    <PresidenteSelector
      v-else-if="asistio && modo === 'selector'"
      :asistentes="asistentes"
      :model-value="presidenteData.id"
      @update:model-value="handleReemplazoChange"
    />

    <PresidenteReemplazo
      v-else-if="!asistio"
      :asistentes="asistentes"
      :model-value="reemplazoId"
      @update:model-value="handleReemplazoChange"
    />
  </div>
</template>
```

---

#### `PresidenteReadonly.vue` (40 líneas)

```vue
<script setup lang="ts">
const props = defineProps<{
  nombre: string | null;
}>();
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm font-medium text-gray-700">Nombre completo</label>
    <input
      type="text"
      :value="nombre"
      disabled
      class="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-900 cursor-not-allowed"
    />
    <span class="text-xs text-gray-500 italic">Presidente del Directorio</span>
  </div>
</template>
```

---

#### `PresidenteSelector.vue` (40 líneas)

```vue
<script setup lang="ts">
import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
import { z } from "zod";

const props = defineProps<{
  asistentes: Array<{ id: number; value: string; label: string }>;
  modelValue: string | null;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<template>
  <SelectInputZod
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    name="presidente"
    label="Seleccionar Presidente"
    placeholder="Seleccionar accionista presente"
    :options="asistentes"
    :schema="z.string().min(1, 'Debe seleccionar un presidente')"
  />
</template>
```

---

#### `AsistenciaSwitch.vue` (Reutilizable - 30 líneas)

```vue
<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();
</script>

<template>
  <div class="flex items-center gap-3">
    <span class="text-sm text-gray-600">NO</span>
    <label class="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
        class="sr-only peer"
      />
      <div
        class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
      ></div>
    </label>
    <span class="text-sm text-gray-600">SI</span>
  </div>
</template>
```

---

## 📊 Comparación: Antes vs Después

### ❌ Antes:

```
instalacion/
├── index.vue (254 líneas) ❌ Demasiado
├── components/
│   └── MesaDirectivaSection.vue (581 líneas) ❌ DEMASIADO
```

**Total:** 835 líneas en 2 archivos

---

### ✅ Después (Siguiendo patrón de Sociedades):

```
instalacion/
├── InstalacionManager.vue (60 líneas) ✅
├── components/
│   └── 04-mesa-directiva/
│       ├── MesaDirectivaCard.vue (80 líneas) ✅
│       ├── PresidenteDesignacion.vue (120 líneas) ✅
│       ├── PresidenteReadonly.vue (40 líneas) ✅
│       ├── PresidenteSelector.vue (40 líneas) ✅
│       ├── PresidenteReemplazo.vue (40 líneas) ✅
│       ├── SecretarioDesignacion.vue (120 líneas) ✅
│       ├── SecretarioReadonly.vue (40 líneas) ✅
│       ├── SecretarioSelector.vue (40 líneas) ✅
│       ├── SecretarioReemplazo.vue (40 líneas) ✅
│       └── AsistenciaSwitch.vue (30 líneas) ✅
├── composables/
│   ├── useInstalacionController.ts (80 líneas) ✅
│   ├── usePresidenteDesignacion.ts (60 líneas) ✅
│   └── useSecretarioDesignacion.ts (60 líneas) ✅
└── stores/
    └── instalacion.store.ts (200 líneas) ✅
```

**Total:** ~990 líneas distribuidas en 17 archivos  
**Promedio:** ~58 líneas por archivo ✅

---

## 🎯 Beneficios del Patrón de Sociedades

### ✅ Ventajas:

1. **Componentes pequeños** (< 120 líneas cada uno)
2. **Reutilizables** (AsistenciaSwitch, Readonly, Selector)
3. **Testables** (cada composable se puede testear independientemente)
4. **Mantenibles** (responsabilidad única)
5. **Consistente** con el resto del proyecto (Apoderados, Directorio)

### ✅ Sigue principios SOLID:

- **S**ingle Responsibility: Cada componente/composable una sola responsabilidad
- **O**pen/Closed: Fácil de extender sin modificar
- **L**iskov Substitution: Componentes intercambiables
- **I**nterface Segregation: Interfaces pequeñas y específicas
- **D**ependency Inversion: Depende de abstracciones (composables)

---

## 📋 Plan de Implementación

### Orden de creación:

1. **Store** (`instalacion.store.ts`) - Base del sistema
2. **Composables** - Lógica reutilizable
   - `useInstalacionController.ts`
   - `usePresidenteDesignacion.ts`
   - `useSecretarioDesignacion.ts`
3. **Componentes atómicos** - UI pequeña
   - `AsistenciaSwitch.vue`
   - `PresidenteReadonly.vue`
   - `PresidenteSelector.vue`
   - `PresidenteReemplazo.vue`
   - (idem para Secretario)
4. **Componentes wrapper** - Orquestadores
   - `PresidenteDesignacion.vue`
   - `SecretarioDesignacion.vue`
   - `MesaDirectivaCard.vue`
5. **Manager** - Orquestador principal
   - `InstalacionManager.vue`
6. **Página** - Actualizar `index.vue` para usar Manager

---

## ✅ Este Plan:

- ✅ **Reutiliza** el patrón probado en Sociedades
- ✅ **No reinventa** la rueda
- ✅ **Consistente** con el resto del proyecto
- ✅ **Testeable** (siguiendo el patrón de tests de Sociedades)
- ✅ **Mantenible** a largo plazo

---

**¿Procedo con este plan basado en el patrón de Sociedades?**
