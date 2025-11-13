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

  definePageMeta({
    layout: "registros",
  });

  useHead({
    title: "Historial Sociedades - PROBO",
  });

  const mockHistory = [
    {
      id: "SOC-2025-001",
      name: "Grupo Andino SAC",
      action: "Actualización de poderes",
      date: "05/11/2025",
      status: "Completado",
    },
    {
      id: "SOC-2025-002",
      name: "Innova Legal Consultores",
      action: "Registro de constitución",
      date: "28/10/2025",
      status: "En revisión",
    },
    {
      id: "SOC-2025-003",
      name: "Pacifico Ventures",
      action: "Modificación estatutaria",
      date: "14/10/2025",
      status: "Observado",
    },
  ];
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.sociedadesHistorial" />

    <Card class="border border-primary-400/40 bg-primary-900/30 text-white">
      <CardHeader>
        <CardTitle class="text-lg">Historial de registros societarios</CardTitle>
        <CardDescription class="text-primary-100">
          Consulta los movimientos realizados por el equipo y prepara los filtros que conectarán con
          la API una vez definidos los servicios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table class="[&_th]:text-left">
          <TableHeader class="text-primary-200">
            <TableRow class="border-primary-400/40">
              <TableHead class="w-[140px] font-medium uppercase tracking-wide text-xs">
                Código
              </TableHead>
              <TableHead class="font-medium uppercase tracking-wide text-xs">
                Sociedad
              </TableHead>
              <TableHead class="font-medium uppercase tracking-wide text-xs">
                Acción
              </TableHead>
              <TableHead class="w-[140px] font-medium uppercase tracking-wide text-xs">
                Fecha
              </TableHead>
              <TableHead class="w-[140px] font-medium uppercase tracking-wide text-xs">
                Estado
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="item in mockHistory"
              :key="item.id"
              class="border-primary-400/30 text-primary-50"
            >
              <TableCell class="py-4 font-medium text-primary-100">
                {{ item.id }}
              </TableCell>
              <TableCell class="py-4">
                {{ item.name }}
              </TableCell>
              <TableCell class="py-4">
                {{ item.action }}
              </TableCell>
              <TableCell class="py-4">
                {{ item.date }}
              </TableCell>
              <TableCell class="py-4">
                {{ item.status }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>

