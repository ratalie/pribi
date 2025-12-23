<template>
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-[1600px] mx-auto px-8 py-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div
            class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style="background: linear-gradient(135deg, var(--primary-700), var(--primary-500))"
          >
            <Building2 class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1
              class="text-3xl font-bold mb-1"
              style="
                color: var(--text-primary);
                font-family: var(--font-primary);
              "
            >
              Dashboard de Sociedades
            </h1>
            <p
              class="text-base"
              style="
                color: var(--text-muted);
                font-family: var(--font-secondary);
              "
            >
              Vista general de todas tus sociedades
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          class="flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          @click="$emit('create')"
        >
          <Plus class="w-4 h-4" />
          Crear Sociedad
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Building2, Plus } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

defineEmits<{
  create: [];
}>();
</script>

