<template>
  <div class="probo-user-menu">
    <!-- Modo Expandido -->
    <template v-if="!isCollapsed">
      <!-- Click directo en usuario navega al panel -->
      <div class="probo-user-card" @click="handleOpenProfile">
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
          <button class="probo-user-dropdown-btn" @click.stop>
            <MoreVertical class="w-4 h-4 text-white transition-transform duration-200" />
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
    </template>

    <!-- Modo Colapsado: Solo Avatar -->
    <template v-else>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button class="probo-user-avatar-collapsed">
            <Avatar class="probo-user-avatar">
              <AvatarImage
                :src="currentUser.avatar || '/placeholder.svg'"
                :alt="currentUser.name"
              />
              <AvatarFallback class="probo-user-avatar-fallback">
                {{ getInitials(currentUser.name) }}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          class="w-56 bg-card text-card-foreground border-border"
        >
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
    </template>
  </div>
  <!-- Configuration Modal -->
  <ConfigurationModal v-model:open="isConfigModalOpen" />
</template>

<script setup lang="ts">
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { HelpCircle, LogOut, MoreVertical, Shield } from "lucide-vue-next";
  import { useProboI18n } from "~/composables/useProboI18n";
  import { useUser } from "~/composables/useUser";
  import ConfigurationModal from "./ConfigurationModal.vue";
  defineProps<{
    isCollapsed?: boolean;
  }>();

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
    min-height: 56px; /* Altura fija para evitar cambios durante transición */
    height: 56px;
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
    min-height: 40px; /* Altura mínima fija */
    height: 40px;
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
    color: #ffffff;
    font-family: "Manrope", sans-serif;
    font-weight: 500;
  }

  .probo-user-info {
    flex: 1;
    min-width: 0;
  }

  .probo-user-name {
    font-family: "Manrope", sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.25;
    color: #ffffff;
    margin: 0;
  }

  .probo-user-role {
    font-family: "Manrope", sans-serif;
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
    color: #ffffff;
  }

  /* Modo Colapsado: Solo Avatar */
  .probo-user-avatar-collapsed {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background-color 150ms ease;
  }

  .probo-user-avatar-collapsed:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .probo-user-avatar-collapsed .probo-user-avatar {
    width: 32px;
    height: 32px;
  }
</style>
