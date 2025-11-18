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
    title: "Historial Sucursales - PROBO",
  });

  const mockHistory = [
    {
      id: "SUC-2025-010",
      name: "Sucursal Miraflores",
      action: "Actualización de representante",
      date: "03/11/2025",
      status: "Completado",
    },
    {
      id: "SUC-2025-011",
      name: "Sucursal Arequipa",
      action: "Registro de apertura",
      date: "22/10/2025",
      status: "En revisión",
    },
    {
      id: "SUC-2025-012",
      name: "Sucursal Cusco",
      action: "Modificación de domicilio",
      date: "09/10/2025",
      status: "Observado",
    },
  ];
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <PageTitle title-key="pages.sucursalesHistorial" />

    <Card class="border border-primary-400/40 bg-primary-900/30 text-white">
      <CardHeader>
        <CardTitle class="text-lg">Historial de registros de sucursales</CardTitle>
        <CardDescription class="text-primary-100">
          Seguimiento de movimientos realizados y pendientes en la gestión de sucursales.
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
                Sucursal
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

