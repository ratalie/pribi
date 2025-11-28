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
  import { Users, Shield, Settings, Activity } from "lucide-vue-next";

  definePageMeta({
    layout: "default",
  });

  useHead({
    title: "Panel Administrativo - PROBO",
  });

  // Mock data - en producción vendría de una API
  const stats = [
    {
      title: "Usuarios totales",
      value: "12",
      description: "Usuarios activos en el sistema",
      icon: Users,
    },
    {
      title: "Roles configurados",
      value: "3",
      description: "Admin, Manager, User",
      icon: Shield,
    },
    {
      title: "Configuraciones",
      value: "8",
      description: "Ajustes del sistema",
      icon: Settings,
    },
    {
      title: "Actividad reciente",
      value: "24",
      description: "Eventos en las últimas 24h",
      icon: Activity,
    },
  ];

  const recentUsers = [
    {
      id: "1",
      name: "Juan Carlos Pérez",
      email: "juan.perez@probo.com",
      role: "Administrador",
      status: "Activo",
      lastLogin: "2025-01-15 10:30",
    },
    {
      id: "2",
      name: "María González",
      email: "maria.gonzalez@probo.com",
      role: "Manager",
      status: "Activo",
      lastLogin: "2025-01-15 09:15",
    },
    {
      id: "3",
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@probo.com",
      role: "Usuario",
      status: "Inactivo",
      lastLogin: "2025-01-14 16:45",
    },
  ];
</script>

<template>
  <div class="space-y-8 px-6 py-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-primary-800">Panel Administrativo</h1>
        <p class="text-gray-600 mt-2">
          Gestiona usuarios, permisos y configuraciones del sistema
        </p>
      </div>
    </div>

    <!-- Estadísticas -->
    <section class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <Card
        v-for="stat in stats"
        :key="stat.title"
        class="border border-primary-400/40 bg-primary-75/20"
      >
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-gray-600">{{ stat.title }}</CardTitle>
          <component :is="stat.icon" class="h-4 w-4 text-primary-600" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-primary-800">{{ stat.value }}</div>
          <p class="text-xs text-gray-500 mt-1">{{ stat.description }}</p>
        </CardContent>
      </Card>
    </section>

    <!-- Usuarios Recientes -->
    <Card class="border border-primary-400/40 bg-primary-75/20">
      <CardHeader>
        <CardTitle class="text-lg font-semibold text-primary-800">Usuarios del Sistema</CardTitle>
        <CardDescription class="text-gray-500">
          Lista de usuarios registrados y su estado actual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow class="border-primary-300/40 bg-primary-25/40">
              <TableHead class="font-medium uppercase tracking-wide text-xs text-primary-700">
                Nombre
              </TableHead>
              <TableHead class="font-medium uppercase tracking-wide text-xs text-primary-700">
                Email
              </TableHead>
              <TableHead class="font-medium uppercase tracking-wide text-xs text-primary-700">
                Rol
              </TableHead>
              <TableHead class="font-medium uppercase tracking-wide text-xs text-primary-700">
                Estado
              </TableHead>
              <TableHead class="font-medium uppercase tracking-wide text-xs text-primary-700">
                Último acceso
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="user in recentUsers"
              :key="user.id"
              class="border-primary-200/40 text-gray-700"
            >
              <TableCell class="font-medium text-primary-900">{{ user.name }}</TableCell>
              <TableCell class="text-gray-600">{{ user.email }}</TableCell>
              <TableCell>
                <span class="inline-flex items-center rounded-full border border-primary-300 bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">
                  {{ user.role }}
                </span>
              </TableCell>
              <TableCell>
                <span
                  :class="
                    user.status === 'Activo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  "
                  class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                >
                  {{ user.status }}
                </span>
              </TableCell>
              <TableCell class="text-gray-600 text-sm">{{ user.lastLogin }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- Configuraciones Rápidas -->
    <div class="grid gap-6 md:grid-cols-2">
      <Card class="border border-primary-400/40 bg-primary-75/20">
        <CardHeader>
          <CardTitle class="text-lg font-semibold text-primary-800">Gestión de Permisos</CardTitle>
          <CardDescription class="text-gray-500">
            Configura roles y permisos de acceso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="min-h-[180px] rounded-lg border border-dashed border-primary-500/60 bg-primary-50/60 p-4 text-sm text-gray-500">
            <p class="font-medium text-gray-500">Próximamente:</p>
            <p class="mt-2 text-gray-500">
              Aquí podrás gestionar los roles y permisos de los usuarios del sistema.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card class="border border-primary-400/40 bg-primary-75/20">
        <CardHeader>
          <CardTitle class="text-lg font-semibold text-primary-800">Configuración del Sistema</CardTitle>
          <CardDescription class="text-gray-500">
            Ajustes generales de la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="min-h-[180px] rounded-lg border border-dashed border-primary-500/60 bg-primary-50/60 p-4 text-sm text-gray-500">
            <p class="font-medium text-gray-500">Próximamente:</p>
            <p class="mt-2 text-gray-500">
              Aquí podrás configurar parámetros generales del sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

