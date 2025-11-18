<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import DatosSociedadForm from "~/core/presentation/registros/sociedades/pasos/datos-sociedad/DatosSociedadForm.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: false,
  });

  const route = useRoute();
  const router = useRouter();
  const societyId = computed(() => route.params.id as string);

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/registros/sociedades/historial");
  };
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">
    <header
      class="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 shadow-sm"
    >
      <div>
        <button
          class="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          type="button"
          @click="goBack"
        >
          <span
            class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700"
          >
            ←
          </span>
          Regresar
        </button>
        <h1 class="mt-4 text-xl font-semibold text-slate-900">Vista previa de sociedad</h1>
        <p class="text-sm text-slate-500">ID: {{ societyId }}</p>
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl px-6 py-10">
      <section id="preview-datos-sociedad" class="space-y-6">
        <DatosSociedadForm :society-id="societyId" :mode="EntityModeEnum.PREVISUALIZAR" />
      </section>

      <!-- TODO: añadir el resto de los pasos en modo preview -->
    </main>
  </div>
</template>
