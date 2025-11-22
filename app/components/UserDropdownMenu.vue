<template>
  <div
    class="group/dropdown flex items-center gap-3 px-2 py-2 rounded-lg transition-colors hover:bg-primary-400/80"
  >
    <!-- Click directo en usuario navega al panel -->
    <div
      class="flex items-center gap-4 flex-1 cursor-pointer"
      @click="handleOpenProfile"
    >
      <Avatar class="w-10 h-10">
        <AvatarImage
          :src="currentUser.avatar || '/placeholder.svg'"
          :alt="currentUser.name"
        />
        <AvatarFallback
          class="bg-sidebar-primary text-sidebar-primary-foreground"
        >
          {{ getInitials(currentUser.name) }}
        </AvatarFallback>
      </Avatar>

      <div class="flex-1 min-w-0">
        <p class="text-white text-sm font-medium">
          {{ currentUser.name }}
        </p>
        <p
          class="text-gray-300 text-xs group-hover/dropdown:text-gray-100 transition-colors"
        >
          {{ currentUser.title }}
        </p>
      </div>
    </div>

    <!-- Dropdown para opciones adicionales -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button
          class="p-1 rounded hover:bg-primary-500/50 transition-colors"
          @click.stop
        >
          <ChevronDown
            class="w-4 h-4 text-white transition-transform group-hover/dropdown:rotate-180 duration-200"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        class="w-56 bg-card text-card-foreground border-border"
      >
        <DropdownMenuItem @click="handleOpenProfile">
          <User class="w-4 h-4 mr-2" />
          {{ t("user.profile") }}
        </DropdownMenuItem>

        <DropdownMenuItem @click="handleOpenConfiguration">
          <Settings class="w-4 h-4 mr-2" />
          {{ t("user.settings") }}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem @click="handleOpenAdminPanel">
          <Shield class="w-4 h-4 mr-2" />
          Panel Administrativo
        </DropdownMenuItem>

        <DropdownMenuItem @click="handleOpenHelp">
          <HelpCircle class="w-4 h-4 mr-2" />
          {{ t("navigation.ayuda") }}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem class="text-destructive" @click="handleLogout">
          <LogOut class="w-4 h-4 mr-2" />
          {{ t("user.logout") }}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  <!-- Configuration Modal -->
  <ConfigurationModal v-model:open="isConfigModalOpen" />
</template>

<script setup lang="ts">
import {
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
} from "lucide-vue-next";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProboI18n } from "~/composables/useProboI18n";
import { useUser } from "~/composables/useUser";
import ConfigurationModal from "./ConfigurationModal.vue";

// Composables
const { t } = useProboI18n();
const { currentUser, logout } = useUser();

// Estado del modal
const isConfigModalOpen = ref(false);

// Métodos
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const handleOpenProfile = () => {
  // Navegar a perfil de usuario
  navigateTo("/profile");
};

const handleOpenConfiguration = () => {
  isConfigModalOpen.value = true;
};

const handleOpenAdminPanel = () => {
  // Navegar a panel administrativo
  navigateTo("/admin/panel");
};

const handleOpenHelp = () => {
  // Navegar a ayuda
  navigateTo("/features/ayuda");
};

const handleLogout = () => {
  logout();
};
</script>
