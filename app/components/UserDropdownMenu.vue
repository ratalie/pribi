<template>
  <div
    class="flex items-center gap-3 px-2 py-2 hover:bg-sidebar-accent rounded-lg transition-colors cursor-pointer"
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
      <p class="text-sidebar-foreground text-sm font-medium">
        {{ currentUser.name }}
      </p>
      <p class="text-muted-foreground text-xs">
        {{ currentUser.title }}
      </p>
    </div>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="w-8 h-8 p-0 hover:bg-sidebar-accent">
          <ChevronDown class="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" class="w-56">
        <DropdownMenuItem @click="handleOpenProfile">
          <User class="w-4 h-4 mr-2" />
          {{ t("user.profile") }}
        </DropdownMenuItem>

        <DropdownMenuItem @click="handleOpenConfiguration">
          <Settings class="w-4 h-4 mr-2" />
          {{ t("user.settings") }}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem @click="handleOpenHelp">
          <HelpCircle class="w-4 h-4 mr-2" />
          {{ t("nav.ayuda") }}
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
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "~/composables/useLanguage";
import { useUser } from "~/composables/useUser";
import ConfigurationModal from "./ConfigurationModal.vue";

// Composables
const { t } = useLanguage();
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
  // Navegar a perfil
  navigateTo("/profile");
};

const handleOpenConfiguration = () => {
  isConfigModalOpen.value = true;
};

const handleOpenHelp = () => {
  // Navegar a ayuda
  navigateTo("/features/ayuda");
};

const handleLogout = () => {
  logout();
};
</script>
