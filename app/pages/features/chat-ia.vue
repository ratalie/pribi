<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Chat IA</h1>
        <p class="text-muted-foreground">
          Asistente inteligente para consultas legales
        </p>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Asistente Legal Inteligente</CardTitle>
        <CardDescription>
          Haz consultas sobre normativas y procedimientos legales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="text-center py-12">
          <MessageCircle class="mx-auto h-16 w-16 text-muted-foreground" />
          <h3 class="mt-4 text-lg font-semibold">Chat IA Legal</h3>
          <p class="text-sm text-muted-foreground mb-4">
            Aquí se implementará el sistema de chat con IA especializada en
            temas legales
          </p>
          <Button> Iniciar Conversación </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { MessageCircle } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

useHead({
  title: "Chat IA - PROBO",
});
</script>
