<script setup lang="ts">
import { useTheme } from "~/composables/useTheme";

const { currentTheme, setTheme } = useTheme();

const themes = ["light", "dark", "purple", "system"] as const;
</script>

<template>
  <div class="min-h-screen bg-background p-8">
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Título -->
      <div class="text-center space-y-2">
        <h1 class="text-4xl font-bold text-foreground">
          🎨 Tailwind 4 Variables Test
        </h1>
        <p class="text-muted-foreground">
          Verificando que todas las variables CSS funcionan correctamente
        </p>
      </div>

      <!-- Test de Temas -->
      <div class="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 class="text-2xl font-semibold text-card-foreground">
          Theme Selector
        </h2>
        <div class="flex gap-4">
          <button
            v-for="theme in themes"
            :key="theme"
            :class="
              currentTheme === theme
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
            "
            class="px-4 py-2 rounded-md transition-colors"
            @click="setTheme(theme)"
          >
            {{ theme }}
          </button>
        </div>
      </div>

      <!-- Test de Colores -->
      <div class="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 class="text-2xl font-semibold text-card-foreground">
          Color Variables
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <!-- Background -->
          <div class="space-y-2">
            <div class="h-20 bg-background border border-border rounded" />
            <p class="text-sm text-muted-foreground">background</p>
          </div>

          <!-- Foreground -->
          <div class="space-y-2">
            <div class="h-20 bg-foreground border border-border rounded" />
            <p class="text-sm text-muted-foreground">foreground</p>
          </div>

          <!-- Primary -->
          <div class="space-y-2">
            <div class="h-20 bg-primary border border-border rounded" />
            <p class="text-sm text-muted-foreground">primary</p>
          </div>

          <!-- Secondary -->
          <div class="space-y-2">
            <div class="h-20 bg-secondary border border-border rounded" />
            <p class="text-sm text-muted-foreground">secondary</p>
          </div>

          <!-- Muted -->
          <div class="space-y-2">
            <div class="h-20 bg-muted border border-border rounded" />
            <p class="text-sm text-muted-foreground">muted</p>
          </div>

          <!-- Accent -->
          <div class="space-y-2">
            <div class="h-20 bg-accent border border-border rounded" />
            <p class="text-sm text-muted-foreground">accent</p>
          </div>

          <!-- Destructive -->
          <div class="space-y-2">
            <div class="h-20 bg-destructive border border-border rounded" />
            <p class="text-sm text-muted-foreground">destructive</p>
          </div>

          <!-- Card -->
          <div class="space-y-2">
            <div class="h-20 bg-card border border-border rounded" />
            <p class="text-sm text-muted-foreground">card</p>
          </div>

          <!-- Popover -->
          <div class="space-y-2">
            <div class="h-20 bg-popover border border-border rounded" />
            <p class="text-sm text-muted-foreground">popover</p>
          </div>
        </div>
      </div>

      <!-- Test de Texto -->
      <div class="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 class="text-2xl font-semibold text-card-foreground">Text Colors</h2>
        <div class="space-y-2">
          <p class="text-foreground">Foreground text</p>
          <p class="text-primary">Primary text</p>
          <p class="text-secondary-foreground">Secondary foreground text</p>
          <p class="text-muted-foreground">Muted foreground text</p>
          <p class="text-accent-foreground">Accent foreground text</p>
          <p class="text-destructive">Destructive text</p>
        </div>
      </div>

      <!-- Test de Borders -->
      <div class="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 class="text-2xl font-semibold text-card-foreground">
          Border & Ring
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 border-2 border-border rounded-lg">
            <p class="text-sm text-muted-foreground">border-border</p>
          </div>
          <div class="p-4 border-2 border-input rounded-lg">
            <p class="text-sm text-muted-foreground">border-input</p>
          </div>
          <div class="p-4 border-2 border-ring rounded-lg">
            <p class="text-sm text-muted-foreground">border-ring</p>
          </div>
          <div class="p-4 ring-2 ring-ring rounded-lg">
            <p class="text-sm text-muted-foreground">ring-ring</p>
          </div>
        </div>
      </div>

      <!-- CSS Variables Display -->
      <div class="bg-card border border-border rounded-lg p-6 space-y-4">
        <h2 class="text-2xl font-semibold text-card-foreground">
          Current Settings
        </h2>
        <div class="p-4 bg-muted rounded-lg">
          <p class="text-sm text-muted-foreground mb-1">Current Theme:</p>
          <p class="text-lg font-semibold text-foreground">
            {{ currentTheme }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
