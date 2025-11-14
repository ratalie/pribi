<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import DatosSociedadForm from "~/core/presentation/registros/sociedades/components/DatosSociedadForm.vue";
  import { useDatosSociedadController } from "~/core/presentation/registros/sociedades/composables/useDatosSociedadController";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = computed(() => route.params.id as string);

  const { isBootstrapping } = useDatosSociedadController({
    societyId,
    source: "internal",
  });
</script>

<template>
  <section :data-loading="isBootstrapping">
    <DatosSociedadForm :society-id="societyId" :mode="EntityModeEnum.EDITAR" />
  </section>
</template>
