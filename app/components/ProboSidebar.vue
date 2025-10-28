<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible";
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider,
  } from "@/components/ui/sidebar";
  import { cn } from "@/lib/utils";
  import { ChevronDown, ChevronRight, X } from "lucide-vue-next";
  import logoProbo from "~/assets/icons/logo-probo.svg";
  import { useProboI18n } from "~/composables/useProboI18n";
  import { useUser } from "~/composables/useUser";
  import { navigationSections } from "~/config/navigation";
  import { getIcon } from "~/utils/iconMapper";
  import UserDropdownMenu from "./UserDropdownMenu.vue";

  defineProps<{
    isCollapsed: boolean;
    toggleSidebar: () => void;
  }>();

  // Composables
  const route = useRoute();
  const { t } = useProboI18n();
  const { canViewModule } = useUser();

  // Estado del sidebar

  // Estados de expansión
  const expandedSections = ref<Record<string, boolean>>({
    "Registro Societario": true,
    "Operaciones de Órgano de Control": true,
    Storage: true,
    Features: true,
  });

  const expandedItems = ref<Record<string, boolean>>({});

  // Métodos
  const toggleSection = (section: string, value: boolean) => {
    expandedSections.value[section] = value;
  };

  const toggleItem = (itemId: string, value: boolean) => {
    expandedItems.value[itemId] = value;
  };

  const isActive = (href?: string): boolean => {
    if (!href) return false;
    return route.path === href || route.path.startsWith(href + "/");
  };
</script>

<template>
  <!-- Sidebar Container -->
  <SidebarProvider class="w-auto">
    <!-- Sidebar base -->
    <Sidebar
      :class="
        cn(
          'bg-sidebar h-screen flex flex-col overflow-hidden border-r border-sidebar-border',
          isCollapsed ? 'w-0 opacity-0' : 'w-[300px] opacity-100'
        )
      "
    >
      <!-- Header -->
      <SidebarHeader class="p-6 pb-8">
        <div class="flex items-center justify-between mb-4">
          <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img class="cursor-pointer object-cover" :src="logoProbo" alt="logo" />
          </NuxtLink>

          <Button
            variant="ghost"
            size="sm"
            class="w-8 h-8 p-0 text-white hover:text-white hover:bg-primary-200 transition-colors"
            @click="toggleSidebar"
          >
            <X class="w-4 h-4" />
          </Button>
        </div>
      </SidebarHeader>

      <!-- Navigation Content -->
      <SidebarContent class="flex-1 overflow-y-auto overflow-x-hidden px-3">
        <div v-for="section in navigationSections" :key="section.id" class="mb-6">
          <!-- Skip section if user doesn't have access -->
          <template v-if="canViewModule(section.id)">
            <Collapsible
              :open="expandedSections[section.title]"
              @update:open="(value) => toggleSection(section.title, value)"
            >
              <CollapsibleTrigger as-child>
                <Button
                  variant="ghost"
                  class="w-full flex items-center justify-between px-3 py-2 text-white text-sm hover:text-white hover:bg-primary-400 h-auto font-normal"
                >
                  <span>{{ t(section.translationKey) }}</span>
                  <ChevronDown
                    :class="
                      cn(
                        'w-4 h-4 transition-transform',
                        !expandedSections[section.title] && '-rotate-90'
                      )
                    "
                  />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent class="mt-1 space-y-1">
                <template v-for="item in section.items" :key="item.id">
                  <div v-if="canViewModule(item.id)">
                    <!-- Item with submenu -->
                    <template v-if="item.hasSubmenu && item.submenuItems">
                      <Collapsible
                        :open="expandedItems[item.id]"
                        @update:open="(value) => toggleItem(item.id, value)"
                      >
                        <CollapsibleTrigger as-child>
                          <Button
                            variant="ghost"
                            class="w-full flex items-center justify-between px-3 py-2.5 text-white text-sm hover:bg-primary-200 hover:text-white rounded-lg h-auto font-normal"
                            :class="{
                              'bg-primary-400': isActive(item.href),
                            }"
                          >
                            <div class="flex items-center gap-3">
                              <component
                                :is="getIcon(item.icon || '')"
                                v-if="getIcon(item.icon || '')"
                                class="w-5 h-5"
                              />
                              <span>{{ t(item.translationKey) }}</span>
                            </div>
                            <ChevronRight
                              :class="
                                cn(
                                  'w-4 h-4 transition-transform',
                                  expandedItems[item.id] && 'rotate-90'
                                )
                              "
                            />
                          </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent class="ml-6 mt-1 space-y-1">
                          <template v-for="subItem in item.submenuItems" :key="subItem.id">
                            <NuxtLink
                              v-if="canViewModule(subItem.id)"
                              :to="subItem.href || '#'"
                              class="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg transition-colors"
                              :class="{
                                'text-white': isActive(subItem.href),
                              }"
                            >
                              <component
                                :is="getIcon(subItem.icon || '')"
                                v-if="getIcon(subItem.icon || '')"
                                class="w-4 h-4"
                              />
                              <span>{{ t(subItem.translationKey) }}</span>
                            </NuxtLink>
                          </template>
                        </CollapsibleContent>
                      </Collapsible>
                    </template>

                    <!-- Regular item without submenu -->
                    <template v-else>
                      <NuxtLink
                        :to="item.href || '#'"
                        class="flex items-center gap-3 px-3 py-2.5 text-sm text-white hover:bg-primary-200 rounded-lg transition-colors"
                        :class="{
                          'bg-primary-400': isActive(item.href),
                        }"
                      >
                        <component
                          :is="getIcon(item.icon || '')"
                          v-if="getIcon(item.icon || '')"
                          class="w-5 h-5"
                        />
                        <span>{{ t(item.translationKey) }}</span>
                      </NuxtLink>
                    </template>
                  </div>
                </template>
              </CollapsibleContent>
            </Collapsible>
          </template>
        </div>

        <!-- Ruta a Componentes -->
        <NuxtLink
          to="/viewComponents"
          class="w-full flex items-center justify-between px-3 py-2.5 text-white text-sm hover:bg-primary-200 hover:text-white rounded-lg h-auto font-normal"
          :class="{ 'bg-primary-400': isActive('/viewComponents') }"
        >
          <div class="flex items-center gap-3">
            <component :is="getIcon('')" v-if="getIcon('')" class="w-5 h-5" />
            <span>Componentes</span>
          </div>
        </NuxtLink>
      </SidebarContent>

      <!-- User Profile Footer -->
      <SidebarFooter class="p-4 border-t border-sidebar-border">
        <UserDropdownMenu />
      </SidebarFooter>
    </Sidebar>
  </SidebarProvider>
</template>
