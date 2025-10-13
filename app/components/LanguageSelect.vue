<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="lang in availableLanguages"
        :key="lang.code"
        class="relative cursor-pointer rounded-lg border p-3 hover:bg-accent transition-colors"
        :class="{ 'ring-2 ring-primary': currentLanguage === lang.code }"
        @click="setLanguage(lang.code as Language)"
      >
        <div class="flex items-center space-x-3">
          <span class="text-2xl">{{ lang.flag }}</span>
          <div>
            <div class="font-medium text-sm">{{ lang.name }}</div>
            <div class="text-xs text-muted-foreground">
              {{ lang.code.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Current language indicator -->
    <div class="text-xs text-muted-foreground">
      Idioma actual: {{ getCurrentLanguageName() }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from "~/composables/useLanguage";
import type { Language } from "~/types/user";

// Composables
const { currentLanguage, availableLanguages, setLanguage } = useLanguage();

// Métodos
const getCurrentLanguageName = () => {
  const current = availableLanguages.find(
    (lang) => lang.code === currentLanguage.value
  );
  return current ? current.name : "Español";
};
</script>
