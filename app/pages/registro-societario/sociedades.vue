<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Sociedades</h1>
        <p class="text-muted-foreground">
          Gestiona las sociedades registradas en el sistema
        </p>
      </div>
      <Button>
        <Building2 class="mr-2 h-4 w-4" />
        Nueva Sociedad
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Lista de Sociedades</CardTitle>
        <CardDescription>
          Encuentra y gestiona todas las sociedades registradas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="text-center py-8">
          <Building2 class="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 class="mt-4 text-lg font-semibold">Lista de sociedades</h3>
          <p class="text-sm text-muted-foreground">
            Aquí se mostrará la lista completa de sociedades registradas
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Building2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

useHead({
  title: "Sociedades - PROBO",
});
</script>
