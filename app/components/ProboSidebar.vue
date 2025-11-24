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
  import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-vue-next";
  import { ref } from "vue";
  import { useRoute } from "vue-router";
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

  // Estados de expansión - Inicializar dinámicamente
  const expandedSections = ref<Record<string, boolean>>({});
  
  // Inicializar todas las secciones como expandidas
  onMounted(() => {
    navigationSections.forEach((section) => {
      expandedSections.value[section.title] = true;
    });
  });

  const expandedItems = ref<Record<string, boolean>>({
    "registros-sociedades": true,
    "registros-sucursales": false,
  });

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
    <!-- Sidebar base - 280px width cuando expandido, 32px cuando colapsado -->
    <Sidebar
      :class="
        cn(
          'probo-sidebar-figma h-screen flex flex-col overflow-hidden border-r transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-[32px]' : 'w-[280px]'
        )
      "
    >
      <!-- Header - Padding 24px -->
      <SidebarHeader class="probo-sidebar-header">
        <div class="flex items-center justify-between mb-4">
          <!-- Logo con gradiente -->
          <NuxtLink to="/" class="probo-logo-link">
            <div class="probo-logo-box">
              <img class="probo-logo-img" :src="logoProbo" alt="PROBO" />
            </div>
            <span
              :class="
                cn(
                  'probo-app-name transition-opacity duration-300',
                  isCollapsed && 'opacity-0 w-0 overflow-hidden'
                )
              "
            >
              PROBO
            </span>
          </NuxtLink>

          <Button
            variant="ghost"
            size="sm"
            class="probo-collapse-btn"
            @click="toggleSidebar"
          >
            <ChevronLeft
              :class="
                cn(
                  'w-4 h-4 transition-transform duration-300',
                  isCollapsed && 'rotate-180'
                )
              "
            />
          </Button>
        </div>
      </SidebarHeader>

      <!-- Navigation Content -->
      <SidebarContent class="probo-sidebar-content">
        <div v-for="section in navigationSections" :key="section.id" class="probo-section-wrapper">
          <template v-if="canViewModule(section.id)">
            <Collapsible
              :open="expandedSections[section.title]"
              @update:open="(value) => toggleSection(section.title, value)"
            >
              <CollapsibleTrigger as-child>
                <Button
                  variant="ghost"
                  class="probo-section-title"
                >
                  <div class="flex items-center gap-2">
                    <component
                      :is="getIcon(section.icon || '')"
                      v-if="getIcon(section.icon || '')"
                      class="probo-icon-section"
                    />
                    <span
                      :class="
                        cn(
                          'transition-opacity duration-300',
                          isCollapsed && 'opacity-0 w-0 overflow-hidden'
                        )
                      "
                    >
                      {{ t(section.translationKey) }}
                    </span>
                  </div>
                  <ChevronDown
                    :class="
                      cn(
                        'w-4 h-4 transition-transform duration-300',
                        !expandedSections[section.title] && '-rotate-90',
                        isCollapsed && 'opacity-0 w-0 overflow-hidden'
                      )
                    "
                  />
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent class="probo-section-content">
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
                            class="probo-subsection-item"
                            :class="{
                              'probo-item-active': isActive(item.href),
                            }"
                            @click="
                              isCollapsed && item.submenuItems?.[0]?.href
                                ? navigateTo(item.submenuItems[0].href)
                                : null
                            "
                          >
                            <div class="flex items-center gap-2">
                              <component
                                :is="getIcon(item.icon || '')"
                                v-if="getIcon(item.icon || '')"
                                class="probo-icon-subsection"
                              />
                              <span
                                :class="
                                  cn(
                                    'transition-opacity duration-300',
                                    isCollapsed && 'opacity-0 w-0 overflow-hidden'
                                  )
                                "
                              >
                                {{ t(item.translationKey) }}
                              </span>
                            </div>
                            <ChevronRight
                              :class="
                                cn(
                                  'w-4 h-4 transition-transform duration-300',
                                  expandedItems[item.id] && 'rotate-90',
                                  isCollapsed && 'opacity-0 w-0 overflow-hidden'
                                )
                              "
                            />
                          </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent class="probo-subsection-content">
                          <template v-for="subItem in item.submenuItems" :key="subItem.id">
                            <NuxtLink
                              v-if="canViewModule(subItem.id)"
                              :to="subItem.href || '#'"
                              class="probo-leaf-item"
                              :class="{
                                'probo-item-active': isActive(subItem.href),
                              }"
                            >
                              <!-- Iconos de nivel 3 removidos según especificación -->
                              <span
                                :class="
                                  cn(
                                    'transition-opacity duration-300',
                                    isCollapsed && 'opacity-0 w-0 overflow-hidden'
                                  )
                                "
                              >
                                {{ t(subItem.translationKey) }}
                              </span>
                            </NuxtLink>
                          </template>
                        </CollapsibleContent>
                      </Collapsible>
                    </template>

                    <!-- Regular item without submenu (Storage items, etc) -->
                    <template v-else>
                      <NuxtLink
                        :to="item.href || '#'"
                        class="probo-principal-item"
                        :class="{
                          'probo-item-active': isActive(item.href),
                        }"
                      >
                        <component
                          :is="getIcon(item.icon || '')"
                          v-if="getIcon(item.icon || '')"
                          class="probo-icon-principal"
                        />
                        <span
                          :class="
                            cn(
                              'transition-opacity duration-300',
                              isCollapsed && 'opacity-0 w-0 overflow-hidden'
                            )
                          "
                        >
                          {{ t(item.translationKey) }}
                        </span>
                      </NuxtLink>
                    </template>
                  </div>
                </template>
              </CollapsibleContent>
            </Collapsible>
          </template>
        </div>
      </SidebarContent>

      <!-- User Profile Footer - Padding 16px -->
      <SidebarFooter class="probo-sidebar-footer">
        <UserDropdownMenu />
      </SidebarFooter>
    </Sidebar>
  </SidebarProvider>
</template>

<style scoped>
/* ============================================
   VARIABLES CSS EXACTAS DEL FIGMA
   ============================================ */
.probo-sidebar-figma {
  background-color: #3c28a4;
  border-color: rgba(255, 255, 255, 0.1);
}

/* ============================================
   HEADER (24px padding)
   ============================================ */
.probo-sidebar-header {
  padding: 24px;
  transition: padding 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.probo-sidebar-figma.w-\[32px\] .probo-sidebar-header {
  padding: 24px 8px;
}

.probo-logo-link {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  padding: 4px;
}

.probo-logo-link:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

.probo-logo-link:active {
  transform: scale(0.98);
}

.probo-logo-box {
  width: 40px;
  height: 40px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6347f4, #8b75ff);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.probo-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.probo-app-name {
  font-family: 'Gabarito', sans-serif;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.5;
  color: #FFFFFF;
  white-space: nowrap;
}

.probo-collapse-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  color: rgba(255, 255, 255, 0.7);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 6px;
}

.probo-collapse-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  transform: scale(1.05);
}

.probo-collapse-btn:active {
  transform: scale(0.95);
}

/* ============================================
   CONTENT AREA
   ============================================ */
.probo-sidebar-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 12px;
  /* Scrollbar overlay para que no distorsione el contenedor */
  scrollbar-gutter: stable;
  transition: padding 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.probo-sidebar-figma.w-\[32px\] .probo-sidebar-content {
  padding: 0 8px;
}

/* Scrollbar personalizado - Overlay para no distorsionar */
.probo-sidebar-content::-webkit-scrollbar {
  width: 8px;
}

.probo-sidebar-content::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.probo-sidebar-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.probo-sidebar-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
  background-clip: padding-box;
}

/* Firefox */
.probo-sidebar-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

/* ============================================
   SECTION WRAPPER - Separación entre secciones
   ============================================ */
.probo-section-wrapper {
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 20px;
}

.probo-section-wrapper:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

/* ============================================
   SECTION TITLE - Nivel 1 (Jerarquía Visual)
   ============================================ */
.probo-section-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  gap: 8px;
  margin-left: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.75);
  background: transparent;
  border: none;
  border-radius: 8px;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.probo-section-title:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #FFFFFF;
  transform: translateX(2px);
}

.probo-section-title:active {
  transform: translateX(0);
  background-color: rgba(255, 255, 255, 0.12);
}

.probo-section-content {
  margin-top: 6px;
  margin-left: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 0;
}

/* ============================================
   SUBSECTION ITEM - Nivel 2 (Indentado desde Nivel 1)
   ============================================ */
.probo-subsection-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px 9px 28px;
  gap: 8px;
  margin-left: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.005em;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.65);
  background: transparent;
  border: none;
  border-radius: 8px;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}

/* Indicador visual de nivel 2 */
.probo-subsection-item::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  opacity: 0;
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.probo-subsection-item:hover::before {
  opacity: 1;
}

.probo-subsection-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 1);
  transform: translateX(2px);
}

.probo-subsection-item:active {
  transform: translateX(0);
  background-color: rgba(255, 255, 255, 0.12);
}

.probo-subsection-content {
  margin-left: 28px;
  margin-top: 4px;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* ============================================
   LEAF ITEM - Nivel 3 (Indentado desde Nivel 2)
   ============================================ */
.probo-leaf-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px 8px 44px;
  margin-left: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.005em;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.65);
  border-radius: 8px;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  cursor: pointer;
  position: relative;
}

/* Indicador visual de nivel 3 */
.probo-leaf-item::before {
  content: '';
  position: absolute;
  left: 32px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  opacity: 0;
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.probo-leaf-item:hover::before {
  opacity: 1;
}

.probo-leaf-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #FFFFFF;
  transform: translateX(2px);
}

.probo-leaf-item:active {
  transform: translateX(0);
  background-color: rgba(255, 255, 255, 0.12);
}

/* ============================================
   PRINCIPAL ITEM - Nivel 2 (Items sin submenu)
   ============================================ */
.probo-principal-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px 10px 28px;
  margin-left: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.005em;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  cursor: pointer;
  position: relative;
}

/* Indicador visual de nivel 2 */
.probo-principal-item::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  opacity: 0;
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.probo-principal-item:hover::before {
  opacity: 1;
}

.probo-principal-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #FFFFFF;
  transform: translateX(2px);
}

.probo-principal-item:active {
  transform: translateX(0);
  background-color: rgba(255, 255, 255, 0.12);
}

/* ============================================
   ACTIVE STATE - Profesional con sombra sutil
   ============================================ */
.probo-item-active {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: #FFFFFF !important;
  font-weight: 500 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.probo-item-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: linear-gradient(180deg, #8b75ff, #6347f4);
  border-radius: 0 2px 2px 0;
}

/* ============================================
   ICONOS - Tamaños según especificación
   ============================================ */
.probo-icon-section {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.75);
  flex-shrink: 0;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.probo-section-title:hover .probo-icon-section {
  color: #FFFFFF;
  transform: scale(1.1);
}

.probo-icon-subsection {
  width: 14px;
  height: 14px;
  color: rgba(255, 255, 255, 0.65);
  flex-shrink: 0;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.probo-subsection-item:hover .probo-icon-subsection {
  color: #FFFFFF;
  transform: scale(1.1);
}

.probo-item-active .probo-icon-subsection {
  color: #FFFFFF;
}

.probo-icon-leaf {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

.probo-item-active .probo-icon-leaf {
  color: #FFFFFF;
}

.probo-icon-principal {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.probo-principal-item:hover .probo-icon-principal {
  color: #FFFFFF;
  transform: scale(1.1);
}

.probo-item-active .probo-icon-principal {
  color: #FFFFFF;
}

/* ============================================
   FOOTER (16px padding)
   ============================================ */
.probo-sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  transition: padding 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.probo-sidebar-figma.w-\[32px\] .probo-sidebar-footer {
  padding: 16px 8px;
}
</style>
