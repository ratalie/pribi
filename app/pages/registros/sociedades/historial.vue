<script setup lang="ts">
  import { computed, onMounted } from "vue";
  import { storeToRefs } from "pinia";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import { Trash2 } from "lucide-vue-next";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";

  definePageMeta({
    layout: "registros",
  });

  useHead({
    title: "Historial Sociedades - PROBO",
  });

  const historialStore = useSociedadHistorialStore();
  const { sociedades, status, errorMessage } = storeToRefs(historialStore);

  onMounted(() => {
    historialStore.cargarHistorial();
  });

  const isLoading = computed(() => status.value === "loading");

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("es-PE").format(date);
  };
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.sociedadesHistorial" />

    <Card class="border border-primary-400/40 bg-primary-900/30 text-white">
      <CardHeader>
        <CardTitle class="text-lg">Historial de registros societarios</CardTitle>
        <CardDescription class="text-primary-100">
          Consulta las sociedades creadas en el sistema. Este listado utiliza los endpoints mockeados
          con MSW, por lo que podrás validar el flujo completo antes de integrar el backend real.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          class="min-h-[340px] overflow-hidden rounded-2xl border border-primary-500/30 bg-primary-950/40"
        >
          <p v-if="errorMessage" class="px-4 py-3 text-sm text-red-300">
            {{ errorMessage }}
          </p>
          <Table class="[&_th]:text-left">
            <TableHeader class="text-primary-200">
              <TableRow class="border-primary-400/40">
                <TableHead class="w-[140px] font-medium uppercase tracking-wide text-xs">
                  ID
                </TableHead>
                <TableHead class="font-medium uppercase tracking-wide text-xs">
                  Razón social
                </TableHead>
                <TableHead class="font-medium uppercase tracking-wide text-xs">
                  Tipo societario
                </TableHead>
                <TableHead class="w-[140px] font-medium uppercase tracking-wide text-xs">
                  Estado
                </TableHead>
                <TableHead class="w-[140px] font-medium uppercase tracking-wide text-xs">
                  Creación
                </TableHead>
                <TableHead class="w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="isLoading">
                <TableRow>
                  <TableCell colspan="6" class="py-6 text-center text-primary-100">
                    Cargando sociedades...
                  </TableCell>
                </TableRow>
              </template>
              <template v-else-if="sociedades.length === 0">
                <TableRow>
                  <TableCell colspan="6" class="py-6 text-center text-primary-100">
                    Aún no registras sociedades. Utiliza el botón “Comenzar formulario guiado” para
                    crear la primera.
                  </TableCell>
                </TableRow>
              </template>
              <template v-else>
                <TableRow
                  v-for="sociedad in sociedades"
                  :key="sociedad.idSociety"
                  class="border-primary-400/30 text-primary-50"
                >
                  <TableCell class="py-4 font-medium text-primary-100">
                    {{ sociedad.idSociety }}
                  </TableCell>
                  <TableCell class="py-4">
                    {{ sociedad.razonSocial }}
                  </TableCell>
                  <TableCell class="py-4">
                    {{ sociedad.tipoSocietario }}
                  </TableCell>
                  <TableCell class="py-4 capitalize">
                    {{ sociedad.estado }}
                  </TableCell>
                  <TableCell class="py-4">
                    {{ formatDate(sociedad.createdAt) }}
                  </TableCell>
                  <TableCell class="py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      class="text-red-200 hover:text-red-100 hover:bg-red-500/20"
                      @click="historialStore.eliminarSociedad(sociedad.idSociety)"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
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

