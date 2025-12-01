<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { useRouter } from "vue-router";
  import { Button } from "@/components/ui/button";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Eye, MoreVertical, Pencil, Trash2, Building2 } from "lucide-vue-next";
  import { storeToRefs } from "pinia";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
  import { useJuntaHistorialStore } from "~/core/presentation/juntas/stores/junta-historial.store";

  definePageMeta({
    layout: "default",
  });

  useHead({
    title: "Historial Juntas - PROBO",
  });

  const router = useRouter();
  const sociedadHistorialStore = useSociedadHistorialStore();
  const juntaHistorialStore = useJuntaHistorialStore();
  const { sociedades } = storeToRefs(sociedadHistorialStore);
  const { juntas, status, errorMessage } = storeToRefs(juntaHistorialStore);

  const selectedSocietyId = ref<string | null>(null);
  const isLoadingSociedades = ref(false);

  const selectedSociedad = computed(() => {
    if (!selectedSocietyId.value) return null;
    return sociedades.value.find(
      (s) => s.idSociety === selectedSocietyId.value
    );
  });

  const isLoading = computed(() => status.value === "loading");

  const formatDate = (isoString: string | null | undefined) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(date);
  };

  const formatEstado = (estado: string | undefined) => {
    if (!estado) return "—";
    const estados: Record<string, string> = {
      BORRADOR: "Borrador",
      EN_PROGRESO: "En progreso",
      FINALIZADO: "Finalizado",
    };
    return estados[estado] ?? estado;
  };

  const formatPasoActual = (paso: string | undefined) => {
    if (!paso) return "—";
    const pasos: Record<string, string> = {
      INIT: "Inicial",
      SELECCION_AGENDA: "Selección de agenda",
      DETALLES: "Detalles",
      INSTALACION: "Instalación",
      PUNTOS_ACUERDO: "Puntos de acuerdo",
      RESUMEN: "Resumen",
    };
    return pasos[paso] ?? paso.replace(/-/g, " ");
  };

  onMounted(async () => {
    isLoadingSociedades.value = true;
    try {
      await sociedadHistorialStore.cargarHistorial();
      // Si hay una sociedad seleccionada previamente, cargar sus juntas
      if (selectedSocietyId.value) {
        const societyIdNumber = parseInt(selectedSocietyId.value, 10);
        if (!Number.isNaN(societyIdNumber)) {
          await juntaHistorialStore.cargarHistorial(societyIdNumber);
        }
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      isLoadingSociedades.value = false;
    }
  });

  const handleSocietyChange = async (societyId: string | null) => {
    selectedSocietyId.value = societyId;
    if (societyId) {
      const societyIdNumber = parseInt(societyId, 10);
      if (!Number.isNaN(societyIdNumber)) {
        await juntaHistorialStore.cargarHistorial(societyIdNumber);
      }
    }
  };

  const goToEdit = (flowId: string) => {
    if (!selectedSocietyId.value) return;
    const societyIdNumber = parseInt(selectedSocietyId.value, 10);
    if (!Number.isNaN(societyIdNumber)) {
      // Guardar el societyId en el store para que esté disponible en la página de edición
      juntaHistorialStore.setSelectedSocietyId(societyIdNumber);
      // Navegar con ambos IDs
      router.push(`/operaciones/sociedades/${societyIdNumber}/junta-accionistas/${flowId}/seleccion-agenda`);
    }
  };

  const handleDelete = async (flowId: string) => {
    if (!selectedSocietyId.value) return;
    const confirmed = window.confirm("¿Deseas eliminar esta junta de accionistas?");
    if (!confirmed) return;

    const societyIdNumber = parseInt(selectedSocietyId.value, 10);
    if (!Number.isNaN(societyIdNumber)) {
      await juntaHistorialStore.eliminarJunta(societyIdNumber, flowId);
    }
  };
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.juntaHistorial" />

    <Card class="border border-primary-400/40 bg-primary-75/20 text-gray-600">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-primary-800">
          Historial de juntas de accionistas
        </CardTitle>
        <CardDescription class="text-gray-500">
          Consulta las juntas creadas en el sistema. Selecciona una sociedad para ver sus juntas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-6">
          <!-- Selector de Sociedades -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-primary-800">
              Selecciona la sociedad
            </label>
            <Select
              v-model="selectedSocietyId"
              :disabled="isLoadingSociedades"
              @update:model-value="handleSocietyChange"
            >
              <SelectTrigger class="w-full md:w-96">
                <SelectValue placeholder="Selecciona una sociedad..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="sociedad in sociedades"
                  :key="sociedad.idSociety"
                  :value="sociedad.idSociety"
                >
                  <div class="flex items-center gap-2">
                    <Building2 class="h-4 w-4" />
                    <span>{{ sociedad.razonSocial || "Sociedad sin nombre" }}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p v-if="isLoadingSociedades" class="text-xs text-gray-500">
              Cargando sociedades...
            </p>
            <p v-else-if="sociedades.length === 0" class="text-xs text-amber-600">
              No hay sociedades disponibles. Crea una sociedad primero.
            </p>
          </div>

          <!-- Tabla de Juntas -->
          <div
            v-if="selectedSocietyId"
            class="min-h-[340px] overflow-hidden rounded-2xl border border-primary-400/30 bg-white/60"
          >
            <p v-if="errorMessage" class="px-4 py-3 text-sm text-red-500">
              {{ errorMessage }}
            </p>
            <Table class="[&_th]:text-left">
              <TableHeader class="text-primary-600">
                <TableRow class="border-primary-300/40 bg-primary-25/40">
                  <TableHead class="w-[120px] font-medium uppercase tracking-wide text-xs text-primary-700">
                    ID
                  </TableHead>
                  <TableHead class="font-medium uppercase tracking-wide text-xs text-primary-700">
                    Estado
                  </TableHead>
                  <TableHead class="w-[200px] font-medium uppercase tracking-wide text-xs text-primary-700">
                    Paso actual
                  </TableHead>
                  <TableHead class="w-[140px] font-medium uppercase tracking-wide text-xs text-primary-700">
                    Creación
                  </TableHead>
                  <TableHead class="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-if="isLoading">
                  <TableRow>
                    <TableCell colspan="5" class="py-6 text-center text-primary-600">
                      Cargando juntas...
                    </TableCell>
                  </TableRow>
                </template>
                <template v-else-if="juntas.length === 0">
                  <TableRow>
                    <TableCell colspan="5" class="py-6 text-center text-primary-600">
                      No hay juntas registradas para esta sociedad. Crea una nueva junta desde el
                      módulo de creación.
                    </TableCell>
                  </TableRow>
                </template>
                <template v-else>
                  <TableRow
                    v-for="junta in juntas"
                    :key="junta.id"
                    class="border-primary-200/40 text-gray-700 transition-colors hover:bg-primary-50/40"
                  >
                    <TableCell class="py-4 font-semibold text-primary-700">
                      {{ junta.id.slice(0, 8) }}...
                    </TableCell>
                    <TableCell class="py-4">
                      <span
                        class="inline-flex items-center rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-700"
                      >
                        {{ formatEstado(junta.estado) }}
                      </span>
                    </TableCell>
                    <TableCell class="py-4">
                      <span class="text-sm text-gray-700">
                        {{ formatPasoActual(junta.actual) }}
                      </span>
                    </TableCell>
                    <TableCell class="py-4">
                      {{ formatDate(junta.createdAt) }}
                    </TableCell>
                    <TableCell class="py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                          <Button
                            variant="ghost"
                            size="sm"
                            class="h-8 w-8 p-0 text-primary-700 hover:bg-primary-200/60"
                          >
                            <MoreVertical class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          class="w-48 border border-primary-200/60 bg-white text-gray-700 shadow-lg"
                        >
                          <DropdownMenuItem
                            class="cursor-pointer gap-2"
                            @click="goToEdit(junta.id)"
                          >
                            <Pencil class="h-3.5 w-3.5" />
                            Editar junta
                          </DropdownMenuItem>
                          <DropdownMenuSeparator class="bg-primary-100" />
                          <DropdownMenuItem
                            class="cursor-pointer gap-2 text-red-500 hover:text-red-600"
                            @click="handleDelete(junta.id)"
                          >
                            <Trash2 class="h-3.5 w-3.5" />
                            Eliminar junta
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </template>
              </TableBody>
            </Table>
          </div>

          <!-- Mensaje cuando no hay sociedad seleccionada -->
          <div
            v-else
            class="flex min-h-[200px] items-center justify-center rounded-2xl border border-primary-400/30 bg-white/60"
          >
            <p class="text-center text-gray-500">
              Selecciona una sociedad para ver sus juntas de accionistas.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

