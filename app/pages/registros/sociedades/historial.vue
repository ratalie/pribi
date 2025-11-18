<script setup lang="ts">
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-vue-next";
  import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
import { SocietyRegisterStep } from "~/core/hexag/registros/sociedades/domain/enums/society-register-step.enum";

  definePageMeta({
    layout: "registros",
  });

  useHead({
    title: "Historial Sociedades - PROBO",
  });

  const historialStore = useSociedadHistorialStore();
  const router = useRouter();
  const { sociedades, status, errorMessage } = storeToRefs(historialStore);

  onMounted(() => {
    historialStore.cargarHistorial();
  });

  const isLoading = computed(() => status.value === "loading");

const formatDate = (isoString: string | null | undefined) => {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(date);
};

const pasoLabels: Record<SocietyRegisterStep, string> = {
  [SocietyRegisterStep.DATOS_SOCIEDAD]: "Datos principales",
  [SocietyRegisterStep.ACCIONISTAS]: "Accionistas",
  [SocietyRegisterStep.ACCIONES]: "Acciones",
  [SocietyRegisterStep.ASIGNACION_ACCIONES]: "Asignación de acciones",
  [SocietyRegisterStep.DIRECTORIO]: "Directorio",
  [SocietyRegisterStep.REGISTRO_APODERADOS]: "Registro apoderados",
  [SocietyRegisterStep.REGIMEN_PODERES]: "Régimen de poderes",
  [SocietyRegisterStep.QUORUMS_MAYORIAS]: "Quórums y mayorías",
  [SocietyRegisterStep.ACUERDOS_SOCIETARIOS]: "Acuerdos societarios",
  [SocietyRegisterStep.RESUMEN]: "Resumen",
  [SocietyRegisterStep.FINALIZAR]: "Finalizado",
};

const formatPasoActual = (paso: SocietyRegisterStep | string | undefined) => {
  if (!paso) return "—";
  const normalized = paso as SocietyRegisterStep;
  return pasoLabels[normalized] ?? paso.replace(/-/g, " ");
};

  const goToPreview = (id: string) => {
    router.push(`/registros/sociedades/${id}/preview`);
  };

  const goToEdit = (id: string) => {
    router.push(`/registros/sociedades/${id}/datos-sociedad`);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("¿Deseas eliminar este registro de sociedad?");
    if (!confirmed) return;
    await historialStore.eliminarSociedad(id);
  };
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.sociedadesHistorial" />

    <Card class="border border-primary-400/40 bg-primary-75/20 text-gray-600">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-primary-800">
          Historial de registros societarios
        </CardTitle>
        <CardDescription class="text-gray-500">
          Consulta las sociedades creadas en el sistema. Este listado utiliza los endpoints
          mockeados con MSW, por lo que podrás validar el flujo completo antes de integrar el
          backend real.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
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
                  Razón social
                </TableHead>
                <TableHead class="w-[150px] font-medium uppercase tracking-wide text-xs text-primary-700">
                  RUC
                </TableHead>
                <TableHead class="w-[160px] font-medium uppercase tracking-wide text-xs text-primary-700">
                  Paso actual
                </TableHead>
                <TableHead class="w-[160px] font-medium uppercase tracking-wide text-xs text-primary-700">
                  Tipo societario
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
                  <TableCell colspan="6" class="py-6 text-center text-primary-600">
                    Cargando sociedades...
                  </TableCell>
                </TableRow>
              </template>
              <template v-else-if="sociedades.length === 0">
                <TableRow>
                  <TableCell colspan="6" class="py-6 text-center text-primary-600">
                    Aún no registras sociedades. Utiliza el botón “Comenzar formulario guiado”
                    para crear la primera.
                  </TableCell>
                </TableRow>
              </template>
              <template v-else>
                <TableRow
                  v-for="sociedad in sociedades"
                  :key="sociedad.idSociety"
                  class="border-primary-200/40 text-gray-700 transition-colors hover:bg-primary-50/40"
                >
                  <TableCell class="py-4 font-semibold text-primary-700">
                    {{ sociedad.idSociety }}
                  </TableCell>
                  <TableCell class="py-4">
                    <div class="flex flex-col">
                      <span class="font-medium text-primary-900">{{ sociedad.razonSocial || "Sociedad sin nombre" }}</span>
                      <span v-if="sociedad.nombreComercial" class="text-xs text-primary-600">
                        Nombre comercial: {{ sociedad.nombreComercial }}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell class="py-4">
                    {{ sociedad.ruc || "—" }}
                  </TableCell>
                  <TableCell class="py-4">
                    <span class="inline-flex items-center rounded-full bg-primary-100 px-2 py-1 text-xs font-semibold text-primary-700">
                      {{ formatPasoActual(sociedad.pasoActual) }}
                    </span>
                  </TableCell>
                  <TableCell class="py-4">
                    {{ sociedad.tipoSocietario || "—" }}
                  </TableCell>
                  <TableCell class="py-4">
                    {{ formatDate(sociedad.createdAt) }}
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
                          @click="goToPreview(sociedad.idSociety)"
                        >
                          <Eye class="h-3.5 w-3.5" />
                          Previsualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          class="cursor-pointer gap-2"
                          @click="goToEdit(sociedad.idSociety)"
                        >
                          <Pencil class="h-3.5 w-3.5" />
                          Editar datos
                        </DropdownMenuItem>
                        <DropdownMenuSeparator class="bg-primary-100" />
                        <DropdownMenuItem
                          class="cursor-pointer gap-2 text-red-500 hover:text-red-600"
                          @click="handleDelete(sociedad.idSociety)"
                        >
                          <Trash2 class="h-3.5 w-3.5" />
                          Eliminar registro
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </template>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
