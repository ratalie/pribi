<template>
  <section class="flex flex-col gap-5">
    <TitleH4
      title="Nombra la Junta"
      subtitle="Asigna un nombre personalizado a esta junta de accionistas"
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />

    <!-- Switch para habilitar nombre personalizado -->
    <div
      class="flex items-center justify-between p-6 bg-white rounded-lg border border-gray-200"
    >
      <div class="flex-1">
        <p class="t-t2 font-secondary font-semibold text-gray-800 mb-1">
          ¿Deseas asignar un nombre personalizado a esta junta?
        </p>
        <p class="text-sm text-gray-600" style="font-family: var(--font-secondary)">
          Este nombre aparecerá en el historial y documentos generados
        </p>
      </div>
      <SimpleSwitchYesNo v-model="juntaNombradaValue" class="ml-4" />
    </div>

    <!-- Input para nombre (solo visible si switch activo) -->
    <Transition name="fade">
      <div
        v-if="juntaNombradaValue"
        class="flex flex-col gap-2 p-6 bg-white rounded-lg border border-gray-200"
      >
        <TextInputZod
          v-model="nombreJuntaValue"
          name="nombre-junta"
          label="Nombre de la Junta"
          placeholder="Ej: Junta Extraordinaria de Aprobación de Estados Financieros"
          :maxlength="200"
          :schema="nombreSchema"
        />
        <div
          class="flex items-center justify-between text-xs"
          style="color: var(--text-muted); font-family: var(--font-secondary)"
        >
          <p>Este nombre aparecerá en el historial y documentos generados</p>
          <span>{{ nombreJuntaValue?.length || 0 }}/200</span>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
  import { computed, watch } from "vue";
  import { z } from "zod";
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import TitleH4 from "~/components/titles/TitleH4.vue";
  import Titles from "~/types/enums/Titles.enum";
  import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";

  // Schema de validación para el nombre (dinámico según juntaNombrada)
  const nombreSchema = computed(() => {
    if (juntaNombradaValue.value) {
      // Si está activado, el nombre es requerido
      return z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(200, "El nombre no puede exceder 200 caracteres");
    }
    // Si está desactivado, es opcional
    return z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(200, "El nombre no puede exceder 200 caracteres")
      .optional();
  });

  const store = useMeetingDetailsStore();

  // Computed para juntaNombrada con v-model bidireccional
  const juntaNombradaValue = computed({
    get: () => store.meetingDetails?.juntaNombrada ?? false,
    set: (value: boolean) => {
      console.log("🔄 [NombraJuntaSection] juntaNombrada cambiando a:", value);
      if (value) {
        // Activar: mantener nombre si existe, o dejar vacío
        store.patchMeetingDetails({
          juntaNombrada: true,
          nombreJunta: store.meetingDetails?.nombreJunta || "",
        });
      } else {
        // Desactivar: limpiar nombre
        store.patchMeetingDetails({
          juntaNombrada: false,
          nombreJunta: undefined,
        });
      }
      console.log("✅ [NombraJuntaSection] Store actualizado:", store.meetingDetails);
    },
  });

  // Computed para nombreJunta con v-model
  const nombreJuntaValue = computed({
    get: () => store.meetingDetails?.nombreJunta ?? "",
    set: (value: string) => {
      const trimmedValue = value.trim() || undefined;
      console.log("🔄 [NombraJuntaSection] nombreJunta cambiando a:", trimmedValue);
      store.patchMeetingDetails({
        nombreJunta: trimmedValue,
      });
      console.log("✅ [NombraJuntaSection] Store actualizado:", store.meetingDetails);
    },
  });

  // Watch para debuggear cambios en el store
  watch(
    () => store.meetingDetails?.juntaNombrada,
    (newVal) => {
      console.log("👀 [NombraJuntaSection] juntaNombrada en store cambió a:", newVal);
    },
    { immediate: true }
  );

  watch(
    () => store.meetingDetails?.nombreJunta,
    (newVal) => {
      console.log("👀 [NombraJuntaSection] nombreJunta en store cambió a:", newVal);
    },
    { immediate: true }
  );
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
</style>
