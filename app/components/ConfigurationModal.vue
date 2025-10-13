<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{{ t("user.settings") }}</DialogTitle>
        <DialogDescription>
          Personaliza tu experiencia en PROBO
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6">
        <!-- Sección de Tema -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Apariencia</CardTitle>
            <CardDescription>
              Personaliza el tema de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSelector />
          </CardContent>
        </Card>

        <!-- Sección de Idioma -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Idioma</CardTitle>
            <CardDescription> Selecciona tu idioma preferido </CardDescription>
          </CardHeader>
          <CardContent>
            <LanguageSelect />
          </CardContent>
        </Card>

        <!-- Sección de Notificaciones -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Notificaciones</CardTitle>
            <CardDescription>
              Configura tus preferencias de notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <Label for="email-notifications">Notificaciones por email</Label>
              <Switch id="email-notifications" />
            </div>
            <div class="flex items-center justify-between">
              <Label for="push-notifications">Notificaciones push</Label>
              <Switch id="push-notifications" />
            </div>
          </CardContent>
        </Card>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="closeModal"> Cancelar </Button>
        <Button @click="saveSettings"> Guardar Cambios </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "~/composables/useLanguage";
import ThemeSelector from "./ThemeSelector.vue";
import LanguageSelect from "./LanguageSelect.vue";

// Props
interface Props {
  open: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

// Composables
const { t } = useLanguage();

// Computed para v-model
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

// Métodos
const closeModal = () => {
  isOpen.value = false;
};

const saveSettings = () => {
  // Lógica para guardar configuraciones
  console.log("Guardando configuraciones...");
  closeModal();
};
</script>
