<template>
  <div class="flex flex-col gap-10">
    <div class="flex flex-col gap-4">
      <p class="t-h5 text-gray-800 font-primary">Responsables de la designación</p>
      <div class="flex gap-8">
        <div
          v-for="responsable in responsables"
          :key="responsable.id"
          @click="handleSelectResponsable(responsable.value)"
          :class="[
            'relative w-full rounded-xl border-2 p-6 cursor-pointer transition-all duration-200',
            'flex items-center justify-between',
            store.responsableDesignacion === responsable.value
              ? 'border-primary-700 shadow-md bg-primary-25'
              : 'border-gray-200 hover:border-primary-300 bg-white',
          ]"
        >
          <!-- Contenido de texto -->
          <h3
            :class="[
              't-2 font-semibold font-secondary',
              store.responsableDesignacion === responsable.value
                ? 'text-primary-700'
                : 'text-gray-800',
            ]"
          >
            {{ responsable.title }}
          </h3>
          <!-- Checkmark circular -->
          <div
            :class="[
              'shrink-0 w-4 h-4 rounded-full flex items-center justify-center',
              store.responsableDesignacion === responsable.value
                ? 'bg-primary-700'
                : 'bg-white border-2 border-gray-400',
            ]"
          >
            <svg
              v-if="store.responsableDesignacion === responsable.value"
              class="w-2.5 h-2.5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de Auditor Externo (solo si se selecciona Junta de accionistas) -->
    <div
      v-if="store.responsableDesignacion === 'JUNTA_DE_ACCIONISTAS'"
      class="flex flex-col gap-4"
    >
      <p class="t-h5 text-gray-800 font-primary">Auditor Externo</p>
      <SimpleCard>
        <div class="flex flex-col gap-5 w-full">
          <label
            for="nombre-apellidos-auditor"
            class="t-t2 font-secondary text-gray-800 font-bold"
          >
            Nombre y Apellidos
          </label>
          <BaseInput
            id="nombre-apellidos-auditor"
            v-model="store.nombreCompletoAuditor"
            placeholder="Ingrese el nombre aquí"
            size="md"
          />
        </div>
      </SimpleCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from "vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import BaseInput from "~/components/base/inputs/text/BaseInput.vue";
  import { useAuditoresExternosController } from "../composables/useAuditoresExternosController";
  import { useAuditoresExternosStore } from "../stores/useAuditoresExternosStore";

  const store = useAuditoresExternosStore();
  const { cargarDatos } = useAuditoresExternosController();

  const responsables = [
    {
      id: "junta",
      value: "JUNTA_DE_ACCIONISTAS" as const,
      title: "Junta de accionistas",
    },
    {
      id: "directorio",
      value: "DIRECTORIO" as const,
      title: "Directorio",
    },
  ];

  /**
   * Manejar selección de responsable
   */
  function handleSelectResponsable(value: "JUNTA_DE_ACCIONISTAS" | "DIRECTORIO") {
    store.responsableDesignacion = value;

    // Si cambia a DIRECTORIO, limpiar nombre del auditor
    if (value === "DIRECTORIO") {
      store.nombreCompletoAuditor = "";
    }
  }

  // Cargar datos al montar el componente
  onMounted(() => {
    cargarDatos();
  });
</script>

