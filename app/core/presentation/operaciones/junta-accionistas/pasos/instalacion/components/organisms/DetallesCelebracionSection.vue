<template>
  <div class="flex flex-col gap-5">
    <TitleH4
      title="Detalles de la celebración de la junta"
      :subtitle="subtitulo"
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />

    <!-- SOLO JUNTA GENERAL: Selector de convocatoria -->
    <div
      class="flex flex-col lg:flex-row gap-6 lg:gap-[45px] p-8 bg-white rounded-lg border border-gray-200"
    >
      <div v-if="tipoJunta === TipoJunta.GENERAL" class="flex flex-col gap-4 flex-1 min-w-0">
        <SelectInputZod
          name="convocatoriaInstalada"
          v-model="convocatoriaInstalada"
          label="Oportunidad de celebración de la Junta"
          placeholder="Selecciona la oportunidad de celebración de la Junta"
          :schema="z.string()"
          :options="[
            { id: 'PRIMERA', value: OrdenConvocatoria.PRIMERA, label: 'Primera Convocatoria' },
            { id: 'SEGUNDA', value: OrdenConvocatoria.SEGUNDA, label: 'Segunda Convocatoria' },
          ]"
        />
      </div>

      <div
        v-if="datosConvocatoria"
        class="flex flex-col items-start lg:items-center justify-between flex-1 min-w-0 gap-3"
      >
        <!-- Dirección -->
        <div
          class="flex flex-col sm:grid sm:grid-cols-[auto_1fr] gap-[12px] min-h-[18px] w-full"
        >
          <div class="flex gap-[10px] items-center shrink-0">
            <p class="t-t2 font-secondary text-gray-800 font-bold whitespace-nowrap">
              Dirección
            </p>
            <p class="t-t2 font-secondary text-gray-800 font-bold shrink-0">:</p>
          </div>
          <p class="t-t1 font-secondary text-gray-600 font-medium wrap-break-word">
            {{ datosConvocatoria.direccion }}
          </p>
        </div>

        <!-- Fecha -->
        <div
          class="flex flex-col sm:grid sm:grid-cols-[auto_1fr] gap-[12px] min-h-[18px] w-full"
        >
          <div class="flex gap-[10px] items-center shrink-0">
            <p class="t-t2 font-secondary text-gray-800 font-bold whitespace-nowrap">Fecha</p>
            <p class="t-t2 font-secondary text-gray-800 font-bold shrink-0">:</p>
          </div>
          <p class="t-t1 font-secondary text-gray-600 font-medium wrap-break-word">
            {{ formatDate(datosConvocatoria.fecha ?? new Date()) }}
          </p>
        </div>

        <!-- Hora -->
        <div
          class="flex flex-col sm:grid sm:grid-cols-[auto_1fr] gap-[12px] min-h-[18px] w-full"
        >
          <div class="flex gap-[10px] items-center shrink-0">
            <p class="t-t2 font-secondary text-gray-800 font-bold whitespace-nowrap">Hora</p>
            <p class="t-t2 font-secondary text-gray-800 font-bold shrink-0">:</p>
          </div>
          <p class="t-t1 font-secondary text-gray-600 font-medium wrap-break-word">
            {{ formatTime(datosConvocatoria.hora ?? new Date()) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { z } from "zod";
  import TitleH4 from "~/components/titles/TitleH4.vue";
  import { OrdenConvocatoria } from "~/core/hexag/juntas/domain/enums/orden-convocatoria.enum";
  import { TipoJunta } from "~/core/hexag/juntas/domain/enums/tipo-junta.enum";
  import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
  import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
  import Titles from "~/types/enums/Titles.enum";

  const meetingDetailsStore = useMeetingDetailsStore();
  const asistenciaStore = useAsistenciaStore();

  const tipoJunta = computed(() => meetingDetailsStore.meetingDetails?.tipoJunta);

  const convocatoriaInstalada = computed({
    get: () =>
      meetingDetailsStore.meetingDetails?.instaladaEnConvocatoria || OrdenConvocatoria.PRIMERA,
    set: (value) => {
      // Actualizar en MeetingDetails store
      meetingDetailsStore.patchMeetingDetails({
        instaladaEnConvocatoria: value,
      });

      // Recalcular quórum (porque cambian los porcentajes)
      asistenciaStore.calcularQuorum();
    },
  });

  const datosConvocatoria = computed(() => {
    if (tipoJunta.value === TipoJunta.UNIVERSAL) {
      return meetingDetailsStore.meetingDetails?.primeraConvocatoria;
    }

    // Junta General: Según selección
    if (convocatoriaInstalada.value === OrdenConvocatoria.PRIMERA) {
      return meetingDetailsStore.meetingDetails?.primeraConvocatoria;
    }

    return meetingDetailsStore.meetingDetails?.segundaConvocatoria;
  });

  const subtitulo = computed(() => {
    return tipoJunta.value === TipoJunta.UNIVERSAL
      ? "Datos de la junta registrados"
      : "Selecciona en qué convocatoria se instaló la junta";
  });

  const formatDate = (date: Date): string => {
    try {
      const d = date instanceof Date ? date : new Date(date);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const formatTime = (time: Date): string => {
    try {
      const t = time instanceof Date ? time : new Date(time);
      if (isNaN(t.getTime())) return "";
      return t.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };
</script>
