<script setup lang="ts">
  import { computed, onMounted, watch, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { Crown, Plus, Building2, CheckCircle2, Clock, FileText } from "lucide-vue-next";
  import { Button } from "@/components/ui/button";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { useJuntaHistorialStore } from "~/core/presentation/juntas/stores/junta-historial.store";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
  import { storeToRefs } from "pinia";

  definePageMeta({
    layout: "default",
  });

  useHead({
    title: "Dashboard Junta de Accionistas - PROBO",
  });

  const route = useRoute();
  const router = useRouter();
  const sociedadStore = useSociedadHistorialStore();
  const juntaStore = useJuntaHistorialStore();
  const { sociedades } = storeToRefs(sociedadStore);
  const { juntas, juntasFinalizadas, juntasEnProgreso } = storeToRefs(juntaStore);

  // Obtener societyId de la ruta
  const societyIdParam = computed(() => {
    const id = route.params.societyId;
    if (typeof id === "string") {
      const parsed = parseInt(id, 10);
      return Number.isNaN(parsed) ? null : parsed;
    }
    return null;
  });

  const selectedSocietyId = ref<number | null>(societyIdParam.value);

  onMounted(async () => {
    if (sociedades.value.length === 0) {
      await sociedadStore.cargarHistorial();
    }

    if (selectedSocietyId.value) {
      await juntaStore.cargarHistorial(selectedSocietyId.value);
    }
  });

  watch(selectedSocietyId, async (newId) => {
    if (newId) {
      await juntaStore.cargarHistorial(newId);
      await router.push(`/operaciones/sociedades/${newId}/junta-accionistas/dashboard`);
    }
  });

  const selectedSociedad = computed(() => {
    if (!selectedSocietyId.value) return null;
    return sociedades.value.find(
      (s) => s.idSociety === selectedSocietyId.value
    );
  });

  const handleCreate = () => {
    if (selectedSocietyId.value) {
      router.push(`/operaciones/sociedades/${selectedSocietyId.value}/junta-accionistas/crear`);
    }
  };

  const stats = computed(() => [
    {
      label: "Total Juntas",
      value: juntas.value.length,
      icon: FileText,
      color: "var(--primary-700)",
    },
    {
      label: "En Proceso",
      value: juntasEnProgreso.value.length,
      icon: Clock,
      color: "#F59E0B",
    },
    {
      label: "Finalizadas",
      value: juntasFinalizadas.value.length,
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
              <Crown class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1
                class="text-3xl font-bold mb-1"
                style="
                  color: var(--text-primary);
                  font-family: var(--font-primary);
                "
              >
                Dashboard de Juntas de Accionistas
              </h1>
              <p
                class="text-base"
                style="
                  color: var(--text-muted);
                  font-family: var(--font-secondary);
                "
              >
                Gestión y seguimiento de juntas de accionistas
              </p>
            </div>
          </div>
          <Button
            v-if="selectedSocietyId"
            variant="primary"
            size="md"
            class="flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            @click="handleCreate"
          >
            <Plus class="w-4 h-4" />
            Crear Junta
          </Button>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="max-w-[1600px] mx-auto px-8 py-10">
      <!-- Selector de Sociedad -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <label
          class="text-base font-bold block mb-3"
          style="
            color: var(--text-primary);
            font-family: var(--font-primary);
          "
        >
          Selecciona la sociedad
        </label>
        <Select
          :model-value="selectedSocietyId?.toString()"
          @update:model-value="(val) => {
            selectedSocietyId = val ? parseInt(val, 10) : null;
          }"
        >
          <SelectTrigger class="w-full h-12">
            <SelectValue placeholder="Selecciona una sociedad..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="sociedad in sociedades"
              :key="sociedad.idSociety"
              :value="sociedad.idSociety?.toString() || ''"
            >
              <div class="flex items-center gap-2">
                <Building2 class="h-4 w-4" />
                <span>{{ sociedad.razonSocial || "Sociedad sin nombre" }}</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <div
          v-if="selectedSociedad"
          class="mt-4 p-4 rounded-lg bg-primary-50 border border-primary-200"
        >
          <p
            class="text-sm font-medium mb-1"
            style="
              color: var(--primary-800);
              font-family: var(--font-primary);
            "
          >
            {{ selectedSociedad.razonSocial }}
          </p>
          <p
            class="text-xs"
            style="
              color: var(--text-muted);
              font-family: var(--font-secondary);
            "
          >
            RUC: {{ selectedSociedad.ruc || "N/A" }} | Tipo: {{ selectedSociedad.tipoSocietario || "N/A" }}
          </p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-if="selectedSocietyId" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      <!-- Tabla de Juntas -->
      <div
        v-if="selectedSocietyId"
        class="bg-white rounded-xl border border-gray-200 shadow-sm"
      >
        <div class="p-6 border-b border-gray-200">
          <h3
            class="text-lg font-semibold"
            style="
              color: var(--text-primary);
              font-family: var(--font-primary);
            "
          >
            Historial de Juntas
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
                  ID
                </th>
                <th
                  class="text-left py-4 px-6 text-xs uppercase font-semibold"
                  style="
                    color: var(--text-secondary);
                    font-family: var(--font-secondary);
                  "
                >
                  Estado
                </th>
                <th
                  class="text-left py-4 px-6 text-xs uppercase font-semibold"
                  style="
                    color: var(--text-secondary);
                    font-family: var(--font-secondary);
                  "
                >
                  Paso Actual
                </th>
                <th
                  class="text-center py-4 px-6 text-xs uppercase font-semibold"
                  style="
                    color: var(--text-secondary);
                    font-family: var(--font-secondary);
                  "
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="junta in juntas"
                :key="junta.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                @click="router.push(`/operaciones/sociedades/${selectedSocietyId}/junta-accionistas/${junta.id}/resumen`)"
              >
                <td
                  class="py-4 px-6 text-sm font-medium"
                  style="
                    color: var(--text-primary);
                    font-family: var(--font-secondary);
                  "
                >
                  {{ junta.id }}
                </td>
                <td class="py-4 px-6">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-medium"
                    :style="{
                      backgroundColor:
                        junta.estado === 'FINALIZADO'
                          ? '#10B98120'
                          : junta.estado === 'EN_PROCESO'
                            ? '#F59E0B20'
                            : '#8D8A9520',
                      color:
                        junta.estado === 'FINALIZADO'
                          ? '#10B981'
                          : junta.estado === 'EN_PROCESO'
                            ? '#F59E0B'
                            : '#8D8A95',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    {{
                      junta.estado === "FINALIZADO"
                        ? "✅ Finalizado"
                        : junta.estado === "EN_PROCESO"
                          ? "⏰ En Proceso"
                          : "📝 Borrador"
                    }}
                  </span>
                </td>
                <td
                  class="py-4 px-6 text-sm"
                  style="
                    color: var(--text-secondary);
                    font-family: var(--font-secondary);
                  "
                >
                  {{ junta.actual || "N/A" }}
                </td>
                <td class="py-4 px-6 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    @click.stop="router.push(`/operaciones/sociedades/${selectedSocietyId}/junta-accionistas/${junta.id}/resumen`)"
                  >
                    Ver
                  </Button>
                </td>
              </tr>
              <tr v-if="juntas.length === 0">
                <td
                  colspan="4"
                  class="py-8 px-6 text-center text-sm"
                  style="
                    color: var(--text-muted);
                    font-family: var(--font-secondary);
                  "
                >
                  No hay juntas registradas para esta sociedad
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="!selectedSocietyId"
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center"
      >
        <Crown class="w-16 h-16 mx-auto mb-4" style="color: var(--text-muted)" />
        <h3
          class="text-xl font-semibold mb-2"
          style="
            color: var(--text-primary);
            font-family: var(--font-primary);
          "
        >
          Selecciona una sociedad
        </h3>
        <p
          class="text-sm"
          style="
            color: var(--text-muted);
            font-family: var(--font-secondary);
          "
        >
          Elige una sociedad del selector para ver su dashboard de juntas
        </p>
      </div>
    </div>
  </div>
</template>
