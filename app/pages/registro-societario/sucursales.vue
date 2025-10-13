<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Sucursales</h1>
        <p class="text-muted-foreground">
          Administra las sucursales de las sociedades
        </p>
      </div>
      <Button>
        <MapPin class="mr-2 h-4 w-4" />
        Nueva Sucursal
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Lista de Sucursales</CardTitle>
        <CardDescription>
          Encuentra y gestiona todas las sucursales registradas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="text-center py-8">
          <MapPin class="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 class="mt-4 text-lg font-semibold">Lista de sucursales</h3>
          <p class="text-sm text-muted-foreground">
            Aquí se mostrará la lista completa de sucursales registradas
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { MapPin } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

useHead({
  title: "Sucursales - PROBO",
});
</script>
