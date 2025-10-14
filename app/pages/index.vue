<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">
          {{ t("dashboard.title") }}
        </h1>
        <p class="text-muted-foreground">
          {{ t("dashboard.subtitle") }}
        </p>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">
            Sociedades Registradas
          </CardTitle>
          <Building2 class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">245</div>
          <p class="text-xs text-muted-foreground">+20% desde el mes pasado</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium">
            Documentos Generados
          </CardTitle>
          <FileText class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">1,234</div>
          <p class="text-xs text-muted-foreground">+10% desde el mes pasado</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium"> Usuarios Activos </CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">89</div>
          <p class="text-xs text-muted-foreground">+5% desde el mes pasado</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between space-y-0 pb-2"
        >
          <CardTitle class="text-sm font-medium"> Consultas IA </CardTitle>
          <MessageCircle class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">456</div>
          <p class="text-xs text-muted-foreground">+25% desde el mes pasado</p>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card class="col-span-4">
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent class="pl-2">
          <div class="space-y-8">
            <div class="flex items-center">
              <Avatar class="h-9 w-9">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div class="ml-4 space-y-1">
                <p class="text-sm font-medium leading-none">
                  Juan Díaz registró una nueva sociedad
                </p>
                <p class="text-sm text-muted-foreground">
                  Corporación XYZ S.A.
                </p>
              </div>
              <div class="ml-auto font-medium">Hace 2h</div>
            </div>
            <div class="flex items-center">
              <Avatar class="h-9 w-9">
                <AvatarFallback>MG</AvatarFallback>
              </Avatar>
              <div class="ml-4 space-y-1">
                <p class="text-sm font-medium leading-none">
                  María García generó un reporte
                </p>
                <p class="text-sm text-muted-foreground">
                  Reporte de accionistas Q3 2024
                </p>
              </div>
              <div class="ml-auto font-medium">Hace 4h</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="col-span-3">
        <CardHeader>
          <CardTitle>Accesos Rápidos</CardTitle>
          <CardDescription> Funciones más utilizadas </CardDescription>
        </CardHeader>
        <CardContent class="space-y-2">
          <Button class="w-full justify-start" variant="ghost" as-child>
            <NuxtLink to="/registro-societario/sociedades">
              <Building2 class="mr-2 h-4 w-4" />
              Nueva Sociedad
            </NuxtLink>
          </Button>
          <Button class="w-full justify-start" variant="ghost" as-child>
            <NuxtLink to="/features/chat-ia">
              <MessageCircle class="mr-2 h-4 w-4" />
              Consultar IA
            </NuxtLink>
          </Button>
          <Button class="w-full justify-start" variant="ghost" as-child>
            <NuxtLink to="/storage/documentos-generados">
              <FileText class="mr-2 h-4 w-4" />
              Ver Documentos
            </NuxtLink>
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Building2, FileText, Users, MessageCircle } from "lucide-vue-next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "~/composables/useLanguage";

// Composables
const { t } = useLanguage();

// Metadata
useHead({
  title: "Dashboard - PROBO",
});
</script>
