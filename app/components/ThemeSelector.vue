<template>
  <div class="space-y-4">
    <!-- Título -->
    <div>
      <h3 class="text-sm font-medium text-foreground mb-2">
        {{ t("theme.title") }}
      </h3>
      <p class="text-xs text-muted-foreground">
        {{ t("theme.description") }}
      </p>
    </div>

    <!-- Grid de temas -->
    <div class="grid grid-cols-2 gap-3">
      <!-- Light Theme -->
      <button
        :class="[
          'relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
          currentTheme === 'light'
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-border hover:border-primary/50 hover:bg-accent/50',
        ]"
        @click="setTheme('light')"
      >
        <Sun
          class="w-8 h-8"
          :class="
            currentTheme === 'light' ? 'text-primary' : 'text-muted-foreground'
          "
        />
        <span
          class="text-sm font-medium"
          :class="currentTheme === 'light' ? 'text-primary' : 'text-foreground'"
        >
          {{ t("theme.light") }}
        </span>
        <!-- Checkmark cuando está activo -->
        <div v-if="currentTheme === 'light'" class="absolute top-2 right-2">
          <div
            class="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
          >
            <svg
              class="w-3 h-3 text-primary-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </button>

      <!-- Dark Theme -->
      <button
        :class="[
          'relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
          currentTheme === 'dark'
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-border hover:border-primary/50 hover:bg-accent/50',
        ]"
        @click="setTheme('dark')"
      >
        <Moon
          class="w-8 h-8"
          :class="
            currentTheme === 'dark' ? 'text-primary' : 'text-muted-foreground'
          "
        />
        <span
          class="text-sm font-medium"
          :class="currentTheme === 'dark' ? 'text-primary' : 'text-foreground'"
        >
          {{ t("theme.dark") }}
        </span>
        <div v-if="currentTheme === 'dark'" class="absolute top-2 right-2">
          <div
            class="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
          >
            <svg
              class="w-3 h-3 text-primary-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </button>

      <!-- Purple Theme -->
      <button
        :class="[
          'relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
          currentTheme === 'purple'
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-border hover:border-primary/50 hover:bg-accent/50',
        ]"
        @click="setTheme('purple')"
      >
        <Palette
          class="w-8 h-8"
          :class="
            currentTheme === 'purple' ? 'text-primary' : 'text-muted-foreground'
          "
        />
        <span
          class="text-sm font-medium"
          :class="
            currentTheme === 'purple' ? 'text-primary' : 'text-foreground'
          "
        >
          {{ t("theme.purple") }}
        </span>
        <div v-if="currentTheme === 'purple'" class="absolute top-2 right-2">
          <div
            class="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
          >
            <svg
              class="w-3 h-3 text-primary-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </button>

      <!-- System Theme -->
      <button
        :class="[
          'relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
          currentTheme === 'system'
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-border hover:border-primary/50 hover:bg-accent/50',
        ]"
        @click="setTheme('system')"
      >
        <Monitor
          class="w-8 h-8"
          :class="
            currentTheme === 'system' ? 'text-primary' : 'text-muted-foreground'
          "
        />
        <span
          class="text-sm font-medium"
          :class="
            currentTheme === 'system' ? 'text-primary' : 'text-foreground'
          "
        >
          {{ t("theme.system") }}
        </span>
        <div v-if="currentTheme === 'system'" class="absolute top-2 right-2">
          <div
            class="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
          >
            <svg
              class="w-3 h-3 text-primary-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </button>
    </div>

    <!-- Indicador del tema activo -->
    <div class="pt-2 border-t border-border">
      <p class="text-xs text-muted-foreground">
        <span class="font-medium text-foreground"
          >{{ t("theme.active") }}:</span
        >
        {{ effectiveTheme }}
        <span v-if="currentTheme === 'system'" class="text-muted-foreground">
          ({{ t("theme.following") }}
          {{ effectiveTheme === "dark" ? t("theme.dark") : t("theme.light") }})
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sun, Moon, Monitor, Palette } from "lucide-vue-next";
import { useTheme } from "~/composables/useTheme";
import { useProboI18n } from "~/composables/useProboI18n";

// Composables
const { currentTheme, effectiveTheme, setTheme } = useTheme();
const { t } = useProboI18n();
</script>
