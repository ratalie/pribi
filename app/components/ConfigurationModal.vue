<template>
  <Dialog v-model:open="isOpen">
    <DialogOverlay
      class="fixed inset-0 z-50 bg-black/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
    />
    <DialogContent
      class="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] max-h-[90vh] overflow-hidden border shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg p-6 gap-4 grid w-full min-w-fit bg-background text-foreground border-border"
    >
      <DialogHeader>
        <DialogTitle class="text-2xl">{{ t("config.modalTitle") }}</DialogTitle>
        <DialogDescription>
          {{ t("config.modalDesc") }}
        </DialogDescription>
      </DialogHeader>

      <div class="flex h-[600px] gap-6">
        <!-- Sidebar de navegación -->
        <div class="w-64 border-r pr-4">
          <div class="space-y-2">
            <!-- Administración -->
            <div>
              <h3
                class="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2"
              >
                {{ t("config.administration") }}
              </h3>
              <div class="space-y-1">
                <div
                  v-for="item in administrationItems"
                  :key="item.key"
                  :class="
                    cn(
                      'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer',
                      activeSection === item.key
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    )
                  "
                  @click="activeSection = item.key"
                >
                  <component
                    :is="getIcon(item.icon)"
                    class="w-4 h-4 inline mr-2"
                  />
                  {{ t(item.label) }}
                </div>
              </div>
            </div>

            <!-- Configuración Personal -->
            <div class="mt-6">
              <h3
                class="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2"
              >
                {{ t("config.personal") }}
              </h3>
              <div class="space-y-1">
                <div
                  v-for="item in personalItems"
                  :key="item.key"
                  :class="
                    cn(
                      'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer',
                      activeSection === item.key
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    )
                  "
                  @click="activeSection = item.key"
                >
                  <component
                    :is="getIcon(item.icon)"
                    class="w-4 h-4 inline mr-2"
                  />
                  {{ t(item.label) }}
                </div>
              </div>
            </div>

            <!-- Integraciones -->
            <div class="mt-6">
              <h3
                class="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2"
              >
                {{ t("config.integrations") }}
              </h3>
              <div class="space-y-1">
                <div
                  v-for="item in integrationItems"
                  :key="item.key"
                  :class="
                    cn(
                      'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer',
                      activeSection === item.key
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    )
                  "
                  @click="activeSection = item.key"
                >
                  <component
                    :is="getIcon(item.icon)"
                    class="w-4 h-4 inline mr-2"
                  />
                  {{ t(item.label) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenido principal -->
        <div class="flex-1 overflow-y-auto min-w-fit custom-scrollbar">
          <!-- Dashboard Admin -->
          <div v-if="activeSection === 'dashboard'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold">
                {{ t("config.adminDashboard") }}
              </h3>
              <p class="text-sm text-muted-foreground">
                {{ t("config.adminDashboardDesc") }}
              </p>
            </div>
            <Card>
              <CardContent class="pt-6">
                <div class="text-center py-8">
                  <LayoutDashboard
                    class="mx-auto h-12 w-12 text-muted-foreground"
                  />
                  <h4 class="mt-4 text-lg font-semibold">
                    {{ t("config.dashboardSettings") }}
                  </h4>
                  <p class="text-sm text-muted-foreground">
                    {{ t("config.dashboardSettingsDesc") }}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Facturación -->
          <div v-if="activeSection === 'billing'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold">{{ t("config.billing") }}</h3>
              <p class="text-sm text-muted-foreground">
                {{ t("config.billingDesc") }}
              </p>
            </div>
            <Card>
              <CardContent class="pt-6">
                <div class="text-center py-8">
                  <CreditCard class="mx-auto h-12 w-12 text-muted-foreground" />
                  <h4 class="mt-4 text-lg font-semibold">
                    {{ t("config.billingSettings") }}
                  </h4>
                  <p class="text-sm text-muted-foreground">
                    {{ t("config.billingSettingsDesc") }}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Usuarios -->
          <div v-if="activeSection === 'users'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold">{{ t("config.users") }}</h3>
              <p class="text-sm text-muted-foreground">
                {{ t("config.usersDesc") }}
              </p>
            </div>
            <Card>
              <CardContent class="pt-6">
                <div class="text-center py-8">
                  <Users class="mx-auto h-12 w-12 text-muted-foreground" />
                  <h4 class="mt-4 text-lg font-semibold">
                    {{ t("config.userSettings") }}
                  </h4>
                  <p class="text-sm text-muted-foreground">
                    {{ t("config.userSettingsDesc") }}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- General -->
          <div v-if="activeSection === 'general'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold">{{ t("config.general") }}</h3>
              <p class="text-sm text-muted-foreground">
                {{ t("config.generalDesc") }}
              </p>
            </div>
            <Card>
              <CardContent class="pt-6">
                <div class="text-center py-8">
                  <Settings class="mx-auto h-12 w-12 text-muted-foreground" />
                  <h4 class="mt-4 text-lg font-semibold">
                    {{ t("config.generalSettings") }}
                  </h4>
                  <p class="text-sm text-muted-foreground">
                    {{ t("config.generalSettingsDesc") }}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Preferencias -->
          <div v-if="activeSection === 'preferences'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold">
                {{ t("config.preferences") }}
              </h3>
              <p class="text-sm text-muted-foreground">
                {{ t("config.preferencesDesc") }}
              </p>
            </div>

            <!-- Tema -->
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">{{
                  t("config.appearance")
                }}</CardTitle>
                <CardDescription>{{
                  t("config.appearanceDesc")
                }}</CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeSelector />
              </CardContent>
            </Card>

            <!-- Paleta de Colores -->
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">{{
                  t("config.colorPalette")
                }}</CardTitle>
                <CardDescription>{{
                  t("config.colorPaletteDesc")
                }}</CardDescription>
              </CardHeader>
              <CardContent>
                <PaletteSelector />
              </CardContent>
            </Card>

            <!-- Idioma -->
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">{{
                  t("config.language")
                }}</CardTitle>
                <CardDescription>{{
                  t("config.languageDesc")
                }}</CardDescription>
              </CardHeader>
              <CardContent>
                <LanguageSelect />
              </CardContent>
            </Card>

            <!-- Tipografía -->
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">{{
                  t("config.typography")
                }}</CardTitle>
                <CardDescription>{{
                  t("config.typographyDesc")
                }}</CardDescription>
              </CardHeader>
              <CardContent>
                <FontSelector />
              </CardContent>
            </Card>

            <!-- Notificaciones -->
            <Card>
              <CardHeader>
                <CardTitle class="text-lg">{{
                  t("config.notifications")
                }}</CardTitle>
                <CardDescription>{{
                  t("config.notificationsDesc")
                }}</CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="flex items-center justify-between">
                  <Label for="email-notifications">{{
                    t("config.emailNotifications")
                  }}</Label>
                  <Switch id="email-notifications" />
                </div>
                <div class="flex items-center justify-between">
                  <Label for="push-notifications">{{
                    t("config.pushNotifications")
                  }}</Label>
                  <Switch id="push-notifications" />
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Perfil -->
          <div v-if="activeSection === 'profile'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold">{{ t("config.profile") }}</h3>
              <p class="text-sm text-muted-foreground">
                {{ t("config.profileDesc") }}
              </p>
            </div>
            <Card>
              <CardContent class="pt-6">
                <div class="text-center py-8">
                  <User class="mx-auto h-12 w-12 text-muted-foreground" />
                  <h4 class="mt-4 text-lg font-semibold">
                    {{ t("config.profileSettings") }}
                  </h4>
                  <p class="text-sm text-muted-foreground">
                    {{ t("config.profileSettingsDesc") }}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Gmail Integration -->
          <div v-if="activeSection === 'gmail'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold">{{ t("config.gmail") }}</h3>
              <p class="text-sm text-muted-foreground">
                {{ t("config.gmailDesc") }}
              </p>
            </div>
            <Card>
              <CardContent class="pt-6">
                <div class="text-center py-8">
                  <Mail class="mx-auto h-12 w-12 text-muted-foreground" />
                  <h4 class="mt-4 text-lg font-semibold">
                    {{ t("config.gmailIntegration") }}
                  </h4>
                  <p class="text-sm text-muted-foreground">
                    {{ t("config.gmailIntegrationDesc") }}
                  </p>
                  <Button class="mt-4">
                    {{ t("config.connectGmail") }}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Google Drive Integration -->
          <div v-if="activeSection === 'googledrive'" class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold">
                {{ t("config.googleDrive") }}
              </h3>
              <p class="text-sm text-muted-foreground">
                {{ t("config.googleDriveDesc") }}
              </p>
            </div>
            <Card>
              <CardContent class="pt-6">
                <div class="text-center py-8">
                  <HardDrive class="mx-auto h-12 w-12 text-muted-foreground" />
                  <h4 class="mt-4 text-lg font-semibold">
                    {{ t("config.googleDriveIntegration") }}
                  </h4>
                  <p class="text-sm text-muted-foreground">
                    {{ t("config.googleDriveIntegrationDesc") }}
                  </p>
                  <Button class="mt-4">
                    {{ t("config.connectGoogleDrive") }}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <!-- Botón Cancelar flotante -->
      <!-- <Button
        variant="outline"
        size="sm"
        class="absolute top-4 right-4 z-10"
        @click="isOpen = false"
      >
        {{ t("common.cancel") }}
      </Button> -->
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Settings,
  User,
  Mail,
  HardDrive,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  // DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProboI18n } from "~/composables/useProboI18n";
import { getIcon } from "~/utils/iconMapper";
import ThemeSelector from "./ThemeSelector.vue";
import PaletteSelector from "./PaletteSelector.vue";
import LanguageSelect from "./LanguageSelect.vue";
import FontSelector from "./FontSelector.vue";

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
const { t } = useProboI18n();

// Estado reactivo
const activeSection = ref("preferences");

// Computed para v-model
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

// Configuración de secciones
const administrationItems = [
  { key: "dashboard", label: "config.dashboard", icon: "LayoutDashboard" },
  { key: "billing", label: "config.billing", icon: "CreditCard" },
  { key: "users", label: "config.users", icon: "Users" },
  { key: "general", label: "config.general", icon: "Settings" },
];

const personalItems = [
  { key: "preferences", label: "config.preferences", icon: "Settings" },
  { key: "profile", label: "config.profile", icon: "User" },
];

const integrationItems = [
  { key: "gmail", label: "config.gmail", icon: "Mail" },
  { key: "googledrive", label: "config.googleDrive", icon: "HardDrive" },
];
</script>
