<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import DatosSociedadForm from "~/core/presentation/registros/sociedades/pasos/datos-sociedad/DatosSociedadForm.vue";

  definePageMeta({
    layout: "registros",
    flowLayout: true,
  });

  const route = useRoute();
  const societyId = computed(() => route.params.id as string);

</script>

<template>
  <section>
    <DatosSociedadForm :society-id="societyId" :mode="EntityModeEnum.EDITAR" />
  </section>
</template>
