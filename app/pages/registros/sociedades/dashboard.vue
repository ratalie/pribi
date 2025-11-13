<script setup lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { computed, onMounted } from "vue";
  import { storeToRefs } from "pinia";

  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
  import { SocietyRegisterStep } from "~/core/hexag/registros/sociedades/domain/enums/society-register-step.enum";

  definePageMeta({
    layout: "registros",
  });

  useHead({
    title: "Dashboard Sociedades - PROBO",
  });

  const historialStore = useSociedadHistorialStore();
  const { totalSociedades, sociedadesEnProgreso, sociedadesFinalizadas, sociedadesPorPaso } =
    storeToRefs(historialStore);

  onMounted(() => {
    if (!historialStore.sociedades.length) {
      historialStore.cargarHistorial();
    }
  });

  const overviewCards = computed(() => [
    {
      title: "Perfiles creados",
      value: totalSociedades.value.toString(),
      description: "Sociedades registradas por tu equipo.",
    },
    {
      title: "Constituciones en curso",
      value: sociedadesEnProgreso.value.length.toString(),
      description: "Flujos que aún requieren completar pasos.",
    },
    {
      title: "Registros finalizados",
      value: sociedadesFinalizadas.value.length.toString(),
      description: "Perfiles que alcanzaron la etapa Finalizar.",
    },
  ]);

  const nextSteps = computed(() => {
    const pendientesDatos =
      sociedadesPorPaso.value[SocietyRegisterStep.DATOS_SOCIEDAD]?.length ?? 0;
    const pendientesAccionistas =
      sociedadesPorPaso.value[SocietyRegisterStep.ACCIONISTAS]?.length ?? 0;
    const pendientesResumen = sociedadesEnProgreso.value.filter(
      (sociedad) => sociedad.pasoActual === SocietyRegisterStep.RESUMEN
    ).length;

    return [
      pendientesDatos > 0
        ? `Tienes ${pendientesDatos} sociedades sin completar los datos principales.`
        : "No hay datos principales pendientes actualmente.",
      pendientesAccionistas > 0
        ? `Revisa los accionistas en ${pendientesAccionistas} constituciones.`
        : "Todos los registros avanzaron el paso de accionistas.",
      pendientesResumen > 0
        ? `Hay ${pendientesResumen} registros listos para revisar el resumen final.`
        : "No hay resúmenes pendientes de revisión.",
    ];
  });
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.sociedadesDashboard" />

    <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <Card
        v-for="card in overviewCards"
        :key="card.title"
        class="border border-primary-400/40 bg-primary-75/20 text-gray-500"
      >
        <CardHeader>
          <CardTitle class="text-base font-medium">{{ card.title }}</CardTitle>
          <CardDescription class="text-primary-100 text-3xl font-semibold">
            {{ card.value }}
          </CardDescription>
        </CardHeader>
        <CardContent class="text-sm text-gray-500">
          {{ card.description }}
        </CardContent>
      </Card>
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <Card class="border border-primary-400/40 bg-primary-75/20 text-gray-500">
        <CardHeader>
          <CardTitle class="text-lg">Próximos pasos sugeridos</CardTitle>
          <CardDescription class="text-gray-500">
            Acciones clave para mantener las sociedades al día.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul class="space-y-3 text-sm leading-relaxed text-gray-500">
            <li v-for="step in nextSteps" :key="step" class="flex gap-2">
              <span class="mt-1 inline-block h-2 w-2 rounded-full bg-gray-500" />
              <span>{{ step }}</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card class="border border-primary-400/40 bg-primary-75/20 text-gray-500">
        <CardHeader>
          <CardTitle class="text-lg">Notas rápidas</CardTitle>
          <CardDescription class="text-gray-500">
            Usa este espacio para acordar tareas internas del equipo legal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            class="min-h-[180px] rounded-lg border border-dashed border-primary-500/60 bg-primary-50/60 p-4 text-sm text-gray-500"
          >
            <p class="font-medium text-gray-500">Sugerencia:</p>
            <p class="mt-2 text-gray-500">
              Integra aquí un widget colaborativo (comentarios o checklist) para coordinar
              avances del área societaria.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  </div>
</template>
