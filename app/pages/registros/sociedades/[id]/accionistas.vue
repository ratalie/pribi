<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";

  import AccionistasManager from "~/core/presentation/registros/sociedades/pasos/accionistas/AccionistasManager.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = computed(() => route.params.id as string);
</script>

<template>
  <section>
    <AccionistasManager :society-id="societyId" :mode="EntityModeEnum.EDITAR" />
  </section>
</template>



