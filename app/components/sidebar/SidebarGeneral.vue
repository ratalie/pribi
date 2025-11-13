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
  import type { FlowConfig, FlowItemTree } from "@/types/flow-system";
  import { ChevronDown, ChevronRight, X } from "lucide-vue-next";
  import logoProbo from "~/assets/icons/logo-probo.svg";
  import { useProboI18n } from "~/composables/useProboI18n";
  import { useUser } from "~/composables/useUser";
  import { navigationSections } from "~/config/navigation";
  import { getIcon } from "~/utils/iconMapper";
  import UserDropdownMenu from "../UserDropdownMenu.vue";
  import SidebarFlow from "./SidebarFlow.vue";

  type FlowConfigWithTree = Omit<FlowConfig, "items"> & {
    items: FlowItemTree[];
  };

  interface Props {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    flowConfig?: FlowConfigWithTree | null;
    showFlowSidebar?: boolean;
  }

  defineProps<Props>();

  // Composables
  const route = useRoute();
  const { t } = useProboI18n();
  const { canViewModule } = useUser();

  // Estados de expansión
  const expandedSections = ref<Record<string, boolean>>(
    Object.fromEntries(navigationSections.map((section) => [section.id, true]))
  );

  const expandedItems = ref<Record<string, boolean>>({});

  // Estado del sidebar de flujo
  const isCollapsedFlow = ref(false);

  // Métodos
  const toggleSection = (sectionId: string, value: boolean) => {
    expandedSections.value[sectionId] = value;
  };

  const isSectionOpen = (sectionId: string) => expandedSections.value[sectionId] ?? true;

  const toggleItem = (itemId: string, value: boolean) => {
    expandedItems.value[itemId] = value;
  };

  const toggleFlowSidebar = () => {
    isCollapsedFlow.value = !isCollapsedFlow.value;
  };

  const isActive = (href?: string): boolean => {
    if (!href) return false;
    return route.path === href || route.path.startsWith(href + "/");
  };
</script>

<template>
  <div
    class="sidebar-container fixed inset-y-0 left-0 z-50 flex pointer-events-none"
    :class="{
      'pointer-events-auto': !isCollapsed,
    }"
  >
    <!-- Sidebar Principal (navegación app) -->
    <SidebarProvider class="h-full w-[280px]">
      <Sidebar
        :class="
          cn(
            'pointer-events-auto relative flex h-full w-[280px] flex-col overflow-hidden rounded-r-2xl border border-primary-400/70 bg-primary-900/95 text-neutral-white-88 shadow-[0_24px_60px_rgba(60,40,164,0.45)] backdrop-blur-xl transition-all duration-300 ease-out',
            isCollapsed
              ? '-translate-x-full opacity-0 pointer-events-none'
              : 'translate-x-0 opacity-100'
          )
        "
      >
        <!-- Header -->
        <SidebarHeader class="px-6 pt-6 pb-8">
          <div class="mb-6 flex items-center justify-between">
            <NuxtLink
              to="/"
              class="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <img class="h-9 cursor-pointer object-contain" :src="logoProbo" alt="logo" />
            </NuxtLink>

            <Button
              variant="ghost"
              size="sm"
              class="flex h-8 w-8 items-center justify-center rounded-full p-0 text-neutral-white-88 transition-colors hover:bg-neutral-white-12 hover:text-neutral-white-100"
              @click="toggleSidebar"
            >
              <X class="h-4 w-4" />
            </Button>
          </div>
        </SidebarHeader>

        <!-- Navigation Content -->
        <SidebarContent
          class="sidebar-scroll flex-1 overflow-y-auto overflow-x-hidden px-4 pb-6"
        >
          <div v-for="(section, index) in navigationSections" :key="section.id" class="mb-6">
            <template v-if="canViewModule(section.id)">
              <Collapsible
                :open="isSectionOpen(section.id)"
                @update:open="(value) => toggleSection(section.id, value)"
              >
                <CollapsibleTrigger as-child>
                  <Button
                    variant="ghost"
                    class="font-primary flex w-full items-center justify-between px-0 py-2 text-[16px] font-semibold text-[#c6c5ca] hover:bg-transparent"
                  >
                    <span>{{ t(section.translationKey) }}</span>
                    <ChevronDown
                      :class="
                        cn(
                          'h-4 w-4 text-[#c6c5ca] transition-transform',
                          !isSectionOpen(section.id) && '-rotate-90'
                        )
                      "
                    />
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent class="mt-2 space-y-1">
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
                              class="font-secondary flex w-full items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium text-[#e2e2e4] transition-colors hover:bg-white/10 hover:text-white"
                            >
                              <div class="flex items-center gap-3">
                                <component
                                  :is="getIcon(item.icon || '')"
                                  v-if="getIcon(item.icon || '')"
                                  class="h-5 w-5"
                                />
                                <span>{{ t(item.translationKey) }}</span>
                              </div>
                              <ChevronRight
                                :class="
                                  cn(
                                    'h-4 w-4 text-[#c6c5ca] transition-transform',
                                    expandedItems[item.id] && 'rotate-90'
                                  )
                                "
                              />
                            </Button>
                          </CollapsibleTrigger>

                          <CollapsibleContent class="ml-9 mt-1 space-y-1">
                            <template v-for="subItem in item.submenuItems" :key="subItem.id">
                              <NuxtLink
                                v-if="canViewModule(subItem.id)"
                                :to="subItem.href || '#'"
                                class="font-secondary flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] text-[#e2e2e4] transition-colors hover:bg-white/10 hover:text-white"
                                :class="{
                                  'bg-white/10 text-white font-semibold': isActive(
                                    subItem.href
                                  ),
                                }"
                              >
                                <component
                                  :is="getIcon(subItem.icon || '')"
                                  v-if="getIcon(subItem.icon || '')"
                                  class="h-4 w-4"
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
                          class="font-secondary flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] text-[#e2e2e4] transition-colors hover:bg-white/10 hover:text-white"
                          :class="{
                            'bg-white/10 text-white font-semibold': isActive(item.href),
                          }"
                        >
                          <component
                            :is="getIcon(item.icon || '')"
                            v-if="getIcon(item.icon || '')"
                            class="h-5 w-5"
                          />
                          <span>{{ t(item.translationKey) }}</span>
                        </NuxtLink>
                      </template>
                    </div>
                  </template>
                </CollapsibleContent>
              </Collapsible>
            </template>

            <div
              v-if="index !== navigationSections.length - 1"
              class="mt-6 h-px w-full bg-white/10"
            />
          </div>

          <!-- Ruta a Componentes -->
          <NuxtLink
            to="/viewComponents"
            class="font-secondary flex w-full items-center justify-between rounded-lg px-3 py-3 text-[15px] text-[#e2e2e4] transition-colors hover:bg-white/10 hover:text-white"
            :class="{
              'bg-white/10 text-white font-semibold': isActive('/viewComponents'),
            }"
          >
            <div class="flex items-center gap-3">
              <component :is="getIcon('')" v-if="getIcon('')" class="h-5 w-5" />
              <span>Componentes</span>
            </div>
          </NuxtLink>

          <!-- Ruta a Sidebars -->
          <NuxtLink
            to="/indiceSidebarsPruebas"
            class="font-secondary mt-2 flex w-full items-center justify-between rounded-lg px-3 py-3 text-[15px] text-[#e2e2e4] transition-colors hover:bg-white/10 hover:text-white"
            :class="{
              'bg-white/10 text-white font-semibold': isActive('/indiceSidebarsPruebas'),
            }"
          >
            <div class="flex items-center gap-3">
              <component :is="getIcon('')" v-if="getIcon('')" class="h-5 w-5" />
              <span>Sidebars</span>
            </div>
          </NuxtLink>
        </SidebarContent>

        <!-- User Profile Footer -->
        <SidebarFooter class="border-t border-primary-400/50 px-4 py-5">
          <UserDropdownMenu />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>

    <!-- Sidebar de Flujo (opcional) -->
    <SidebarFlow
      v-if="showFlowSidebar && flowConfig"
      :config="flowConfig"
      :is-collapsed="isCollapsedFlow"
      @toggle-collapse="toggleFlowSidebar"
    />
  </div>
</template>

<style scoped>
  .sidebar-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    display: flex;
    height: 100vh;
    z-index: 50;
  }

  .sidebar-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(124, 90, 255, 0.75) rgba(60, 40, 164, 0.15);
  }

  .sidebar-scroll::-webkit-scrollbar {
    width: 6px;
  }

  .sidebar-scroll::-webkit-scrollbar-track {
    background: rgba(60, 40, 164, 0.1);
    border-radius: 999px;
  }

  .sidebar-scroll::-webkit-scrollbar-thumb {
    background: rgba(124, 90, 255, 0.8);
    border-radius: 999px;
  }

  .sidebar-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(124, 90, 255, 0.95);
  }
</style>
