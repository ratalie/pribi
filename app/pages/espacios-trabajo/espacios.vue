<script setup lang="ts">
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
  import { FolderKanban, Plus, Eye, Edit, Trash2 } from "lucide-vue-next";
  import { useRouter } from "vue-router";

  definePageMeta({
    layout: "default",
  });

  useHead({
    title: "Espacios de Trabajo - PROBO",
  });

  const router = useRouter();

  // Mock data - en producción vendría de una API
  const espacios = [
    {
      id: "1",
      name: "Proyecto Alpha",
      description: "Espacio para documentación del proyecto Alpha",
      members: 5,
      documents: 12,
      lastActivity: "2025-01-15 14:30",
      status: "Activo",
    },
    {
      id: "2",
      name: "Equipo Legal",
      description: "Colaboración del equipo legal",
      members: 8,
      documents: 24,
      lastActivity: "2025-01-15 10:15",
      status: "Activo",
    },
    {
      id: "3",
      name: "Reuniones Q1",
      description: "Documentos de reuniones del primer trimestre",
      members: 3,
      documents: 8,
      lastActivity: "2025-01-14 16:45",
      status: "Archivado",
    },
  ];

  const handleCreate = () => {
    router.push("/features/espacios-trabajo/crear");
  };

  const handleView = (id: string) => {
    // TODO: Navegar a vista detallada del espacio
    console.log("Ver espacio:", id);
  };

  const handleEdit = (id: string) => {
    // TODO: Navegar a edición del espacio
    console.log("Editar espacio:", id);
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("¿Deseas eliminar este espacio de trabajo?");
    if (confirmed) {
      // TODO: Eliminar espacio
      console.log("Eliminar espacio:", id);
    }
  };
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-primary-800">Espacios de Trabajo</h1>
        <p class="text-gray-600 mt-2">
          Gestiona tus espacios colaborativos y documentos compartidos
        </p>
      </div>
      <Button variant="primary" size="md" @click="handleCreate">
        <Plus class="mr-2 h-4 w-4" />
        Crear espacio
      </Button>
    </div>

    <!-- Lista de Espacios -->
    <Card class="border border-primary-400/40 bg-primary-75/20">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-primary-800">
          Mis Espacios de Trabajo
        </CardTitle>
        <CardDescription class="text-gray-500">
          Lista de todos los espacios de trabajo a los que tienes acceso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="espacios.length === 0" class="py-12 text-center">
          <FolderKanban class="mx-auto h-12 w-12 text-gray-400" />
          <p class="mt-4 text-gray-500">No tienes espacios de trabajo creados</p>
          <Button variant="primary" size="md" class="mt-4" @click="handleCreate">
            <Plus class="mr-2 h-4 w-4" />
            Crear tu primer espacio
          </Button>
        </div>

        <Table v-else>
          <TableHeader>
            <TableRow class="border-primary-300/40 bg-primary-25/40">
              <TableHead class="font-medium uppercase tracking-wide text-xs text-primary-700">
                Nombre
              </TableHead>
              <TableHead class="font-medium uppercase tracking-wide text-xs text-primary-700">
                Descripción
              </TableHead>
              <TableHead class="font-medium uppercase tracking-wide text-xs text-primary-700">
                Miembros
              </TableHead>
              <TableHead class="font-medium uppercase tracking-wide text-xs text-primary-700">
                Documentos
              </TableHead>
              <TableHead class="font-medium uppercase tracking-wide text-xs text-primary-700">
                Última actividad
              </TableHead>
              <TableHead class="font-medium uppercase tracking-wide text-xs text-primary-700">
                Estado
              </TableHead>
              <TableHead class="w-[120px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="espacio in espacios"
              :key="espacio.id"
              class="border-primary-200/40 text-gray-700"
            >
              <TableCell class="font-medium text-primary-900">{{ espacio.name }}</TableCell>
              <TableCell class="text-gray-600">{{ espacio.description }}</TableCell>
              <TableCell class="text-gray-600">{{ espacio.members }}</TableCell>
              <TableCell class="text-gray-600">{{ espacio.documents }}</TableCell>
              <TableCell class="text-gray-600 text-sm">{{ espacio.lastActivity }}</TableCell>
              <TableCell>
                <span
                  :class="
                    espacio.status === 'Activo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  "
                  class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                >
                  {{ espacio.status }}
                </span>
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-8 w-8 p-0"
                    @click="handleView(espacio.id)"
                  >
                    <Eye class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-8 w-8 p-0"
                    @click="handleEdit(espacio.id)"
                  >
                    <Edit class="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    @click="handleDelete(espacio.id)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>

