<template>
  <div class="space-y-6">
    <!-- Fuente Primaria -->
    <div class="space-y-4">
      <div>
        <h4 class="text-sm font-semibold">{{ t("config.primaryFont") }}</h4>
        <p class="text-xs text-muted-foreground">
          {{ t("config.primaryFontDesc") }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-3">
        <div
          v-for="font in primaryFonts"
          :key="font.name"
          class="relative cursor-pointer rounded-lg border p-4 hover:bg-accent transition-colors"
          :class="{ 'ring-2 ring-primary': primaryFont === font.name }"
          @click="setPrimaryFont(font.name as Font)"
        >
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <div class="font-medium text-sm">{{ font.name }}</div>
              <div
                class="text-lg font-normal"
                :style="{ fontFamily: font.value }"
              >
                {{ font.preview }}
              </div>
            </div>
            <div
              v-if="primaryFont === font.name"
              class="flex h-4 w-4 items-center justify-center rounded-full bg-primary"
            >
              <Check class="h-3 w-3 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fuente Secundaria (Código/Monospace) -->
    <div class="space-y-4">
      <div>
        <h4 class="text-sm font-semibold">{{ t("config.secondaryFont") }}</h4>
        <p class="text-xs text-muted-foreground">
          {{ t("config.secondaryFontDesc") }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-3">
        <div
          v-for="font in secondaryFonts"
          :key="font.name"
          class="relative cursor-pointer rounded-lg border p-4 hover:bg-accent transition-colors"
          :class="{ 'ring-2 ring-primary': secondaryFont === font.name }"
          @click="setSecondaryFont(font.name as Font)"
        >
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <div class="font-medium text-sm">{{ font.name }}</div>
              <div
                class="text-sm font-normal code"
                :style="{ fontFamily: font.value }"
              >
                {{ font.preview }}
              </div>
            </div>
            <div
              v-if="secondaryFont === font.name"
              class="flex h-4 w-4 items-center justify-center rounded-full bg-primary"
            >
              <Check class="h-3 w-3 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview de texto con fuentes seleccionadas -->
    <div class="space-y-4 border-t pt-4">
      <h4 class="text-sm font-semibold">{{ t("config.fontPreview") }}</h4>

      <div class="rounded-lg border p-4 space-y-3 bg-muted/50">
        <!-- Preview fuente primaria -->
        <div :style="{ fontFamily: primaryFontData.value }">
          <div class="text-xl font-semibold">
            {{ t("config.previewPrimary") }}
          </div>
          <div class="text-sm text-muted-foreground">
            {{ t("config.previewPrimaryDesc") }}
          </div>
        </div>

        <!-- Preview fuente secundaria -->
        <div
          class="text-sm rounded bg-background p-2 border code"
          :style="{ fontFamily: secondaryFontData.value }"
        >
          const greeting = "{{ t("config.previewCode") }}";
        </div>
      </div>
    </div>

    <!-- Información actual -->
    <div class="text-xs text-muted-foreground space-y-1">
      <div>{{ t("config.currentPrimary") }}: {{ primaryFont }}</div>
      <div>{{ t("config.currentSecondary") }}: {{ secondaryFont }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check } from "lucide-vue-next";
import { useFont } from "~/composables/useFont";
import { useProboI18n } from "~/composables/useProboI18n";
import type { Font } from "~/types/user";

// Composables
const {
  primaryFont,
  secondaryFont,
  primaryFontData,
  secondaryFontData,
  primaryFonts,
  secondaryFonts,
  setPrimaryFont,
  setSecondaryFont,
} = useFont();

const { t } = useProboI18n();
</script>
