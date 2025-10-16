<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="lang in availableLocales"
        :key="lang.code"
        class="relative cursor-pointer rounded-lg border p-3 hover:bg-accent transition-colors"
        :class="{ 'ring-2 ring-primary': locale === lang.code }"
        @click="handleLanguageChange(lang.code)"
      >
        <div class="flex items-center space-x-3">
          <span class="text-2xl">{{ lang.flag }}</span>
          <div>
            <div class="font-medium text-sm">{{ lang.nativeName }}</div>
            <div class="text-xs text-muted-foreground">
              {{ lang.code.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Current language indicator -->
    <div class="text-xs text-muted-foreground">
      Idioma actual: {{ currentLocaleInfo.nativeName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProboI18n } from "~/composables/useProboI18n";
import type { LocaleCode } from "~/i18n/types";

// Composable de i18n
const { locale, availableLocales, currentLocaleInfo, changeLocale } =
  useProboI18n();

// Manejar cambio de idioma
const handleLanguageChange = async (newLocale: LocaleCode) => {
  const success = await changeLocale(newLocale);
  if (success) {
    console.log(`Idioma cambiado a: ${newLocale}`);
  }
};
</script>
