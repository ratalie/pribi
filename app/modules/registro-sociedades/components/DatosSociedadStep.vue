<script setup lang="ts">
interface Props {
  mode: "crear" | "editar";
}

defineProps<Props>();
</script>

<template>
  <div>Datos de la sociedad: {{ mode }}</div>
</template>
