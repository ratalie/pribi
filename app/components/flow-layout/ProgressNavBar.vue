<script setup lang="ts">
  import CheckIcon from "./CheckIcon.vue";

  const steps: {
    title: string;
    description: string;
    status: "empty" | "current" | "completed";
  }[] = [
    {
      title: "Datos principales",
      description: "Completa todos los datos de la Sociedad",
      status: "completed",
    },
    {
      title: "Accionistas",
      description: "Agrega los accionistas de la Sociedad",
      status: "current",
    },
    {
      title: "Capital Social y Acciones",
      description: "Completa información sobre las acciones",
      status: "empty",
    },
  ];
</script>

<template>
  <div>
    <div v-for="(step, index) in steps" :key="index" class="flex items-start gap-4">
      <CheckIcon :status="step.status" />
      <div class="flex flex-col gap-1">
        <p class="font-primary font-medium text-gray-600 t-t1">{{ step.title }}</p>
        <span class="font-secondary font-medium text-gray-600 t-b2">
          {{ step.description }}
        </span>
      </div>
    </div>
  </div>
</template>
