<script setup lang="ts">
  import type { Component } from "vue";
  import { Button } from "@/components/ui/button";
  import { Plus } from "lucide-vue-next";

  interface Props {
    title: string;
    subtitle: string;
    icon: Component;
    createLabel?: string;
    showCreateButton?: boolean;
  }

  interface Emits {
    (e: "create"): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    createLabel: "Crear",
    showCreateButton: true,
  });

  const emit = defineEmits<Emits>();

  const handleCreate = () => {
    emit("create");
  };
</script>

<template>
  <div
    class="bg-white border-b sticky top-0 z-30 shadow-sm"
    style="
      border-color: var(--border-light);
      box-shadow: var(--shadow-card);
    "
  >
    <div class="px-8 py-6">
      <div class="flex items-center justify-between">
        <!-- Left Side - Icon + Title -->
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
            style="
              background: linear-gradient(135deg, var(--primary-700), var(--primary-500));
              border-radius: var(--radius-medium);
            "
          >
            <component :is="props.icon" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1
              class="text-2xl mb-1"
              style="
                color: var(--text-primary);
                font-family: var(--font-primary);
                font-weight: 600;
              "
            >
              {{ props.title }}
            </h1>
            <p
              class="text-sm"
              style="
                color: var(--text-muted);
                font-family: var(--font-secondary);
              "
            >
              {{ props.subtitle }}
            </p>
          </div>
        </div>

        <!-- Right Side - Create Button -->
        <Button
          v-if="props.showCreateButton"
          variant="primary"
          size="md"
          class="flex items-center gap-2 text-white shadow-md hover:shadow-lg transition-all"
          style="
            background-color: var(--primary-800);
            border-radius: var(--radius-medium);
            font-family: var(--font-secondary);
          "
          @click="handleCreate"
        >
          <Plus class="w-4 h-4" />
          {{ props.createLabel }}
        </Button>
      </div>
    </div>
  </div>
</template>

