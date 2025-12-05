<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
import { z } from "zod";

/**
 * Componente reutilizable para Presidente/Secretario de la Junta
 * 
 * Lógica:
 * - Si mode='readonly' → Input disabled con nombre
 * - Si mode='selector' → SelectInputZod con opciones
 */

interface Props {
  rol: "Presidente" | "Secretario";
  asistio: boolean;
  nombre?: string;  // Para mode='readonly'
  selectedId?: string; // Para mode='selector'
  options: { id: number; value: string; label: string }[];
  mode: "readonly" | "selector"; // ← CLAVE
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:asistio", value: boolean): void;
  (e: "update:selectedId", value: string): void;
}>();

// ========================================
// STATE
// ========================================
const localAsistio = ref(props.asistio);
const localSelectedId = ref(props.selectedId || "");

// ========================================
// COMPUTED
// ========================================
const switchLabel = computed(() => localAsistio.value ? "SI" : "NO");
const assistanceText = computed(() => localAsistio.value ? "Asistió" : "No Asistió");

// ========================================
// WATCHERS
// ========================================
watch(() => props.asistio, (newVal) => {
  localAsistio.value = newVal;
});

watch(() => props.selectedId, (newVal) => {
  localSelectedId.value = newVal || "";
});

watch(localAsistio, (newVal) => {
  emit("update:asistio", newVal);
});

watch(localSelectedId, (newVal) => {
  emit("update:selectedId", newVal);
});
</script>

<template>
  <div class="flex flex-col gap-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
    <!-- Header con Switch -->
    <div class="flex justify-between items-center">
      <div class="flex flex-col gap-1">
        <Label class="t-t2 font-secondary text-gray-800 font-bold">
          {{ rol }} de la Junta
        </Label>
        <span class="t-b2 text-gray-600 font-secondary">
          {{ assistanceText }}
        </span>
      </div>
      
      <div class="flex items-center gap-2">
        <span class="t-t2 font-secondary text-gray-600">
          {{ switchLabel }}
        </span>
        <Switch v-model:checked="localAsistio" />
      </div>
    </div>

    <!-- Body: Depende de ASISTIÓ y MODE -->
    <div class="flex flex-col gap-2">
      <!-- ========================================
           CASO 1: ASISTIÓ + READONLY
           ======================================== -->
      <template v-if="localAsistio && mode === 'readonly'">
        <Label class="t-t2 font-secondary text-gray-700">
          Nombre completo
        </Label>
        <Input
          :value="nombre"
          disabled
          class="bg-white cursor-not-allowed"
        />
        <span class="t-b3 text-gray-500 font-secondary italic">
          {{ rol === "Presidente" ? "Presidente del Directorio" : "Gerente General" }}
        </span>
      </template>

      <!-- ========================================
           CASO 2: ASISTIÓ + SELECTOR
           ======================================== -->
      <template v-else-if="localAsistio && mode === 'selector'">
        <SelectInputZod
          v-model="localSelectedId"
          :name="`${rol.toLowerCase()}_asistio_selector`"
          label="Nombre completo"
          placeholder="Seleccionar accionista presente"
          :options="options"
          :schema="z.string().min(1, 'Debe seleccionar')"
        />
        <span class="t-b3 text-gray-500 font-secondary">
          Solo accionistas o representantes presentes
        </span>
      </template>

      <!-- ========================================
           CASO 3: NO ASISTIÓ (siempre SELECTOR)
           ======================================== -->
      <template v-else-if="!localAsistio">
        <SelectInputZod
          v-model="localSelectedId"
          :name="`${rol.toLowerCase()}_reemplazo_selector`"
          label="Seleccionar reemplazo"
          placeholder="Seleccionar accionista presente"
          :options="options"
          :schema="z.string().min(1, 'Debe seleccionar un reemplazo')"
        />
        <span class="t-b3 text-orange-600 font-secondary italic">
          ⚠️ Seleccione quién ejercerá el rol de {{ rol }}
        </span>
      </template>
    </div>

  </div>
</template>

