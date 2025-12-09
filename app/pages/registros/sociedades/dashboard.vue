<script setup lang="ts">
  import { computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { Building2, Plus, CheckCircle2, Clock, FileText } from "lucide-vue-next";
  import { Button } from "@/components/ui/button";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
  import { storeToRefs } from "pinia";
  import { SocietyRegisterStep } from "~/core/hexag/registros/sociedades/domain/enums/society-register-step.enum";

  definePageMeta({
    layout: "registros",
  });

  useHead({
    title: "Dashboard Sociedades - PROBO",
  });

  const router = useRouter();
  const historialStore = useSociedadHistorialStore();
  const { totalSociedades, sociedadesEnProgreso, sociedadesFinalizadas, sociedades } = storeToRefs(historialStore);

  onMounted(() => {
    if (!historialStore.sociedades.length) {
      historialStore.cargarHistorial();
    }
  });

  const handleCreate = () => {
    router.push("/registros/sociedades/agregar");
  };

  const stats = computed(() => [
    {
      label: "Total Sociedades",
      value: totalSociedades.value,
      icon: Building2,
      color: "var(--primary-700)",
    },
    {
      label: "En Proceso",
      value: sociedadesEnProgreso.value.length,
      icon: Clock,
      color: "#F59E0B",
    },
    {
      label: "Finalizadas",
      value: sociedadesFinalizadas.value.length,
      icon: CheckCircle2,
      color: "#10B981",
    },
  ]);
</script>

<template>
  <div class="min-h-full bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-[1600px] mx-auto px-8 py-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style="background: linear-gradient(135deg, var(--primary-700), var(--primary-500))"
            >
              <Building2 class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1
                class="text-3xl font-bold mb-1"
                style="
                  color: var(--text-primary);
                  font-family: var(--font-primary);
                "
              >
                Dashboard de Sociedades
              </h1>
              <p
                class="text-base"
                style="
                  color: var(--text-muted);
                  font-family: var(--font-secondary);
                "
              >
                Vista general de todas tus sociedades
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="md"
            class="flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            @click="handleCreate"
          >
            <Plus class="w-4 h-4" />
            Crear Sociedad
          </Button>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="max-w-[1600px] mx-auto px-8 py-10">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-6"
        >
          <div class="flex items-center justify-between mb-4">
            <p
              class="text-sm"
              style="
                color: var(--text-muted);
                font-family: var(--font-secondary);
              "
            >
              {{ stat.label }}
            </p>
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :style="{
                backgroundColor: `${stat.color}15`,
                borderRadius: 'var(--radius-medium)',
              }"
            >
              <component :is="stat.icon" class="w-5 h-5" :style="{ color: stat.color }" />
            </div>
          </div>
          <p
            class="text-3xl font-bold"
            style="
              color: var(--text-primary);
              font-family: var(--font-primary);
            "
          >
            {{ stat.value }}
          </p>
        </div>
      </div>

      <!-- Tabla de Sociedades -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <h3
            class="text-lg font-semibold"
            style="
              color: var(--text-primary);
              font-family: var(--font-primary);
            "
          >
            Sociedades Registradas
          </h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th
                  class="text-left py-4 px-6 text-xs uppercase font-semibold"
                  style="
                    color: var(--text-secondary);
                    font-family: var(--font-secondary);
                  "
                >
                  Razón Social
                </th>
                <th
                  class="text-left py-4 px-6 text-xs uppercase font-semibold"
                  style="
                    color: var(--text-secondary);
                    font-family: var(--font-secondary);
                  "
                >
                  RUC
                </th>
                <th
                  class="text-left py-4 px-6 text-xs uppercase font-semibold"
                  style="
                    color: var(--text-secondary);
                    font-family: var(--font-secondary);
                  "
                >
                  Tipo
                </th>
                <th
                  class="text-center py-4 px-6 text-xs uppercase font-semibold"
                  style="
                    color: var(--text-secondary);
                    font-family: var(--font-secondary);
                  "
                >
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="sociedad in sociedades"
                :key="sociedad.idSociety"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                @click="router.push(`/registros/sociedades/${sociedad.idSociety}/datos-sociedad`)"
              >
                <td
                  class="py-4 px-6 text-sm font-medium"
                  style="
                    color: var(--text-primary);
                    font-family: var(--font-secondary);
                  "
                >
                  {{ sociedad.razonSocial || "Sociedad sin nombre" }}
                </td>
                <td
                  class="py-4 px-6 text-sm"
                  style="
                    color: var(--text-secondary);
                    font-family: var(--font-secondary);
                  "
                >
                  {{ sociedad.ruc || "N/A" }}
                </td>
                <td
                  class="py-4 px-6 text-sm"
                  style="
                    color: var(--text-secondary);
                    font-family: var(--font-secondary);
                  "
                >
                  {{ sociedad.tipoSocietario || "N/A" }}
                </td>
                <td class="py-4 px-6 text-center">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    :style="{
                      backgroundColor:
                        sociedad.pasoActual === SocietyRegisterStep.FINALIZAR
                          ? '#10B98120'
                          : '#F59E0B20',
                      color:
                        sociedad.pasoActual === SocietyRegisterStep.FINALIZAR
                          ? '#10B981'
                          : '#F59E0B',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    {{
                      sociedad.pasoActual === SocietyRegisterStep.FINALIZAR
                        ? "✅ Finalizada"
                        : "⏰ En Proceso"
                    }}
                  </span>
                </td>
              </tr>
              <tr v-if="sociedades.length === 0">
                <td
                  colspan="4"
                  class="py-8 px-6 text-center text-sm"
                  style="
                    color: var(--text-muted);
                    font-family: var(--font-secondary);
                  "
                >
                  No hay sociedades registradas aún
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
