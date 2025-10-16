<template>
  <div class="space-y-4">
    <div class="grid grid-cols-3 gap-4">
      <!-- Light Theme -->
      <div
        class="relative cursor-pointer rounded-lg border p-3 hover:bg-accent transition-colors"
        :class="{ 'ring-2 ring-primary': currentTheme === 'light' }"
        @click="setTheme('light')"
      >
        <div class="flex items-center space-x-2">
          <Sun class="w-4 h-4" />
          <span class="text-sm font-medium">{{ t("theme.light") }}</span>
        </div>
        <div class="mt-2 rounded border bg-background p-1">
          <div class="h-4 w-full rounded bg-muted" />
        </div>
      </div>

      <!-- Dark Theme -->
      <div
        class="relative cursor-pointer rounded-lg border p-3 hover:bg-accent transition-colors"
        :class="{ 'ring-2 ring-primary': currentTheme === 'dark' }"
        @click="setTheme('dark')"
      >
        <div class="flex items-center space-x-2">
          <Moon class="w-4 h-4" />
          <span class="text-sm font-medium">{{ t("theme.dark") }}</span>
        </div>
        <div class="mt-2 rounded border border-muted bg-card p-1">
          <div class="h-4 w-full rounded bg-muted" />
        </div>
      </div>

      <!-- System Theme -->
      <div
        class="relative cursor-pointer rounded-lg border p-3 hover:bg-accent transition-colors"
        :class="{ 'ring-2 ring-primary': currentTheme === 'system' }"
        @click="setTheme('system')"
      >
        <div class="flex items-center space-x-2">
          <Monitor class="w-4 h-4" />
          <span class="text-sm font-medium">{{ t("theme.system") }}</span>
        </div>
        <div class="mt-2 flex rounded border">
          <div class="w-1/2 rounded-l bg-background p-1">
            <div class="h-4 w-full rounded bg-muted" />
          </div>
          <div class="w-1/2 rounded-r border-l border-muted bg-card p-1">
            <div class="h-4 w-full rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>

    <!-- Current effective theme indicator -->
    <div class="text-xs text-muted-foreground">
      {{ t("theme.current") }}: {{ effectiveTheme }}
      <span v-if="currentTheme === 'system'">
        ({{ t("theme.systemFollow") }})
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sun, Moon, Monitor } from "lucide-vue-next";
import { useTheme } from "~/composables/useTheme";
import { useProboI18n } from "~/composables/useProboI18n";

// Composables
const { currentTheme, effectiveTheme, setTheme } = useTheme();
const { t } = useProboI18n();
</script>
