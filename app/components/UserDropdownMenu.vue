<template>
  <div class="probo-user-menu">
    <!-- Click directo en usuario navega al panel -->
    <div
      class="probo-user-card"
      @click="handleOpenProfile"
    >
      <Avatar class="probo-user-avatar">
        <AvatarImage
          :src="currentUser.avatar || '/placeholder.svg'"
          :alt="currentUser.name"
        />
        <AvatarFallback class="probo-user-avatar-fallback">
          {{ getInitials(currentUser.name) }}
        </AvatarFallback>
      </Avatar>

      <div class="probo-user-info">
        <p class="probo-user-name">
          {{ currentUser.name }}
        </p>
        <p class="probo-user-role">
          {{ currentUser.title }}
        </p>
      </div>
    </div>

    <!-- Dropdown para opciones adicionales -->
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <button
          class="probo-user-dropdown-btn"
          @click.stop
        >
          <ChevronDown
            class="w-4 h-4 text-white transition-transform duration-200"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        class="w-56 bg-card text-card-foreground border-border"
      >
        <!-- Profile y Settings ocultos según especificación -->
        
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

<style scoped>
/* ============================================
   USER MENU - Estilos según Figma
   ============================================ */
.probo-user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
}

.probo-user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.probo-user-card:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.probo-user-avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.probo-user-avatar-fallback {
  background-color: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  font-family: 'Manrope', sans-serif;
  font-weight: 500;
}

.probo-user-info {
  flex: 1;
  min-width: 0;
}

.probo-user-name {
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.25;
  color: #FFFFFF;
  margin: 0;
}

.probo-user-role {
  font-family: 'Manrope', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  margin-top: 2px;
}

.probo-user-dropdown-btn {
  padding: 4px;
  border-radius: 4px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.probo-user-dropdown-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #FFFFFF;
}
</style>
