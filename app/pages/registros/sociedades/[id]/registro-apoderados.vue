<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import ApoderadosManager from "~/core/presentation/registros/sociedades/pasos/apoderados/ApoderadosManager.vue";
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
    <ApoderadosManager :society-id="societyId" :mode="EntityModeEnum.EDITAR" />
  </section>
</template>


