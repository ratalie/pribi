<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-3">
      <!-- Base Palette (Purple/Slate) -->
      <div
        class="cursor-pointer rounded-lg border p-3 hover:bg-accent transition-colors"
        :class="{ 'ring-2 ring-primary': currentPalette === 'base' }"
        @click="setPalette('base')"
      >
        <div class="flex items-center gap-2 mb-2">
          <Palette class="w-4 h-4" />
          <span class="text-sm font-medium">{{ t("palette.base") }}</span>
        </div>
        <!-- Preview de colores base -->
        <div class="flex gap-1">
          <div class="h-3 w-3 rounded-full" style="background-color: #334155" />
          <div class="h-3 w-3 rounded-full" style="background-color: #64748b" />
          <div class="h-3 w-3 rounded-full" style="background-color: #94a3b8" />
          <div class="h-3 w-3 rounded-full" style="background-color: #cbd5e1" />
        </div>
        <p class="text-xs text-muted-foreground mt-2">
          {{ t("palette.baseDesc") }}
        </p>
      </div>

      <!-- Oceanic Palette (Blue/Teal) -->
      <div
        class="cursor-pointer rounded-lg border p-3 hover:bg-accent transition-colors"
        :class="{ 'ring-2 ring-primary': currentPalette === 'oceanic' }"
        @click="setPalette('oceanic')"
      >
        <div class="flex items-center gap-2 mb-2">
          <Waves class="w-4 h-4" />
          <span class="text-sm font-medium">{{ t("palette.oceanic") }}</span>
        </div>
        <!-- Preview de colores oceanic -->
        <div class="flex gap-1">
          <div class="h-3 w-3 rounded-full" style="background-color: #0ea5e9" />
          <div class="h-3 w-3 rounded-full" style="background-color: #38bdf8" />
          <div class="h-3 w-3 rounded-full" style="background-color: #7dd3fc" />
          <div class="h-3 w-3 rounded-full" style="background-color: #bae6fd" />
        </div>
        <p class="text-xs text-muted-foreground mt-2">
          {{ t("palette.oceanicDesc") }}
        </p>
      </div>

      <!-- Forest Palette (Green/Emerald) -->
      <div
        class="cursor-pointer rounded-lg border p-3 hover:bg-accent transition-colors"
        :class="{ 'ring-2 ring-primary': currentPalette === 'forest' }"
        @click="setPalette('forest')"
      >
        <div class="flex items-center gap-2 mb-2">
          <TreeDeciduous class="w-4 h-4" />
          <span class="text-sm font-medium">{{ t("palette.forest") }}</span>
        </div>
        <!-- Preview de colores forest -->
        <div class="flex gap-1">
          <div class="h-3 w-3 rounded-full" style="background-color: #10b981" />
          <div class="h-3 w-3 rounded-full" style="background-color: #34d399" />
          <div class="h-3 w-3 rounded-full" style="background-color: #6ee7b7" />
          <div class="h-3 w-3 rounded-full" style="background-color: #a7f3d0" />
        </div>
        <p class="text-xs text-muted-foreground mt-2">
          {{ t("palette.forestDesc") }}
        </p>
      </div>

      <!-- Sunset Palette (Orange/Pink) -->
      <div
        class="cursor-pointer rounded-lg border p-3 hover:bg-accent transition-colors"
        :class="{ 'ring-2 ring-primary': currentPalette === 'sunset' }"
        @click="setPalette('sunset')"
      >
        <div class="flex items-center gap-2 mb-2">
          <Sunset class="w-4 h-4" />
          <span class="text-sm font-medium">{{ t("palette.sunset") }}</span>
        </div>
        <!-- Preview de colores sunset -->
        <div class="flex gap-1">
          <div class="h-3 w-3 rounded-full" style="background-color: #f97316" />
          <div class="h-3 w-3 rounded-full" style="background-color: #fb923c" />
          <div class="h-3 w-3 rounded-full" style="background-color: #fdba74" />
          <div class="h-3 w-3 rounded-full" style="background-color: #fed7aa" />
        </div>
        <p class="text-xs text-muted-foreground mt-2">
          {{ t("palette.sunsetDesc") }}
        </p>
      </div>
    </div>

    <!-- Indicador de paleta actual -->
    <div
      class="flex items-center gap-2 text-xs text-muted-foreground border-t pt-3"
    >
      <div class="flex items-center gap-1.5">
        <div class="h-2 w-2 rounded-full bg-primary" />
        <span
          >{{ t("palette.current") }}:
          {{ t(`palette.${currentPalette}`) }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Palette, Waves, TreeDeciduous, Sunset } from "lucide-vue-next";
import { usePalette } from "~/composables/usePalette";
import { useProboI18n } from "~/composables/useProboI18n";

// Composables
const { currentPalette, setPalette } = usePalette();
const { t } = useProboI18n();
</script>
