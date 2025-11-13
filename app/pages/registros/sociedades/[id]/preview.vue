<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
import DatosSociedadForm from "~/core/presentation/registros/sociedades/components/DatosSociedadForm.vue";

definePageMeta({
  layout: "registros",
  flowLayout: true,
});

const route = useRoute();
const societyId = computed(() => route.params.id as string);
</script>

<template>
  <div class="space-y-10 px-6 py-6">
    <PageTitle title-key="pages.sociedadesPreview" />

    <section id="summary-datos-sociedad">
      <DatosSociedadForm :society-id="societyId" :mode="EntityModeEnum.PREVISUALIZAR" />
    </section>

    <!-- TODO: añadir el resto de pasos (Accionistas, Acciones, etc.) -->
  </div>
</template>

