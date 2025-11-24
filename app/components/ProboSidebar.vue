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
  import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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

  // Detectar si una sección está activa (basado en ruta actual)
  const isSectionActive = (sectionId: string): boolean => {
    const section = navigationSections.find((s) => s.id === sectionId);
    if (!section) return false;

    // Verificar si algún item de la sección está activo
    for (const item of section.items) {
      if (item.href && isActive(item.href)) return true;
      if (item.submenuItems) {
        for (const subItem of item.submenuItems) {
          if (subItem.href && isActive(subItem.href)) return true;
        }
      }
    }
    return false;
  };

  // Detectar si un item de segundo nivel está activo
  const isItemActive = (itemId: string, sectionId: string): boolean => {
    const section = navigationSections.find((s) => s.id === sectionId);
    if (!section) return false;

    const item = section.items.find((i) => i.id === itemId);
    if (!item) return false;

    // Verificar si el item o sus subitems están activos
    if (item.href && isActive(item.href)) return true;
    if (item.submenuItems) {
      for (const subItem of item.submenuItems) {
        if (subItem.href && isActive(subItem.href)) return true;
      }
    }
    return false;
  };

  // Detectar si un item tiene algún subitem activo (para modo colapsado)
  const hasActiveSubItem = (item: any): boolean => {
    if (!item.submenuItems) return false;
    return item.submenuItems.some((subItem: any) => 
      subItem.href && isActive(subItem.href)
    );
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
          isCollapsed ? 'w-[80px]' : 'w-[280px]'
        )
      "
    >
      <!-- Header - Padding 24px -->
      <SidebarHeader class="probo-sidebar-header">
        <div 
          :class="cn(
            'flex items-center justify-between mb-4',
            isCollapsed ? 'flex-col gap-2' : 'flex-row'
          )"
        >
          <!-- Logo con gradiente -->
          <NuxtLink 
            to="/" 
            :class="cn(
              'probo-logo-link',
              isCollapsed && 'justify-center'
            )"
          >
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
        <!-- Modo Expandido -->
        <template v-if="!isCollapsed">
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
                      <span>{{ t(section.translationKey) }}</span>
                    </div>
                    <ChevronDown
                      :class="
                        cn(
                          'w-4 h-4 transition-transform duration-300',
                          !expandedSections[section.title] && '-rotate-90'
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
                            >
                              <div class="flex items-center gap-2">
                                <component
                                  :is="getIcon(item.icon || '')"
                                  v-if="getIcon(item.icon || '')"
                                  class="probo-icon-subsection"
                                />
                                <span>{{ t(item.translationKey) }}</span>
                              </div>
                              <ChevronRight
                                :class="
                                  cn(
                                    'w-4 h-4 transition-transform duration-300',
                                    expandedItems[item.id] && 'rotate-90'
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
                          <span>{{ t(item.translationKey) }}</span>
                        </NuxtLink>
                      </template>
                    </div>
                  </template>
                </CollapsibleContent>
              </Collapsible>
            </template>
          </div>
        </template>

        <!-- Modo Colapsado: Estilo Perplexity - Icono arriba + Nombre abajo -->
        <template v-else>
          <div class="probo-collapsed-content">
            <div
              v-for="section in navigationSections"
              :key="section.id"
              class="probo-collapsed-section"
            >
              <template v-if="canViewModule(section.id)">
                <!-- Nivel 1: Sección (Icono + Nombre) -->
                <button
                  class="probo-collapsed-item probo-collapsed-level-1"
                  :class="{
                    'probo-collapsed-active': isSectionActive(section.id),
                  }"
                >
                  <component
                    :is="getIcon(section.icon || '')"
                    v-if="getIcon(section.icon || '')"
                    class="probo-collapsed-icon-img"
                  />
                  <span class="probo-collapsed-label">
                    {{ t(section.translationKey) }}
                  </span>
                </button>

                <!-- Nivel 2: Items (Icono + Nombre) -->
                <template v-for="item in section.items" :key="item.id">
                  <template v-if="canViewModule(item.id)">
                    <button
                      class="probo-collapsed-item probo-collapsed-level-2"
                      :class="{
                        'probo-collapsed-active': hasActiveSubItem(item) || (item.href && isActive(item.href)),
                      }"
                      @click="
                        item.submenuItems?.[0]?.href
                          ? navigateTo(item.submenuItems[0].href)
                          : item.href
                          ? navigateTo(item.href)
                          : null
                      "
                    >
                      <component
                        :is="getIcon(item.icon || '')"
                        v-if="getIcon(item.icon || '')"
                        class="probo-collapsed-icon-img"
                      />
                      <span class="probo-collapsed-label">
                        {{ t(item.translationKey) }}
                      </span>
                    </button>
                  </template>
                </template>
              </template>
            </div>
          </div>
        </template>
      </SidebarContent>

      <!-- User Profile Footer - Padding 16px -->
      <SidebarFooter class="probo-sidebar-footer">
        <UserDropdownMenu :is-collapsed="isCollapsed" />
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

.probo-sidebar-figma.w-\[80px\] .probo-sidebar-header {
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

.probo-sidebar-figma.w-\[80px\] .probo-sidebar-content {
  padding: 0 8px;
}

/* Scrollbar personalizado - Sin flechas, solo barra */
.probo-sidebar-content::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.probo-sidebar-content::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.probo-sidebar-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  border: none;
}

.probo-sidebar-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Ocultar completamente botones de scroll (flechas) - Todas las variantes */
.probo-sidebar-content::-webkit-scrollbar-button {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
  border: none !important;
}

.probo-sidebar-content::-webkit-scrollbar-button:start:decrement,
.probo-sidebar-content::-webkit-scrollbar-button:end:increment {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
  border: none !important;
}

.probo-sidebar-content::-webkit-scrollbar-button:vertical:start:decrement,
.probo-sidebar-content::-webkit-scrollbar-button:vertical:end:increment,
.probo-sidebar-content::-webkit-scrollbar-button:horizontal:start:decrement,
.probo-sidebar-content::-webkit-scrollbar-button:horizontal:end:increment {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
  border: none !important;
}

/* Asegurar que no haya espacio para flechas */
.probo-sidebar-content::-webkit-scrollbar-corner {
  display: none !important;
  background: transparent !important;
}

/* Firefox - Sin flechas */
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
  border-radius: 6px;
  transition: background-color 150ms ease, color 150ms ease;
  cursor: pointer;
}

.probo-section-title:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
}

/* Estado activo para secciones - REMOVIDO: Solo nivel 3 debe estar activo */

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
  padding: 9px 12px 9px 20px;
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
  border-radius: 6px;
  transition: background-color 150ms ease, color 150ms ease;
  cursor: pointer;
}

.probo-subsection-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
}

.probo-subsection-content {
  margin-left: 20px;
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
  padding: 8px 12px 8px 32px;
  margin-left: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.005em;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.65);
  border-radius: 6px;
  transition: background-color 150ms ease, color 150ms ease;
  text-decoration: none;
  cursor: pointer;
  position: relative;
}

.probo-leaf-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
}

/* ============================================
   PRINCIPAL ITEM - Nivel 2 (Items sin submenu)
   ============================================ */
.probo-principal-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px 10px 20px;
  margin-left: 0;
  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.005em;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  transition: background-color 150ms ease, color 150ms ease;
  text-decoration: none;
  cursor: pointer;
}

.probo-principal-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
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

.probo-sidebar-figma.w-\[80px\] .probo-sidebar-footer {
  padding: 16px 8px;
}

/* ============================================
   MODO COLAPSADO - Estilo Perplexity (Icono + Nombre)
   ============================================ */
.probo-collapsed-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0;
}

.probo-collapsed-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.probo-collapsed-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

/* Item colapsado: Icono arriba + Nombre abajo */
.probo-collapsed-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 4px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 150ms ease;
  position: relative;
}

.probo-collapsed-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #FFFFFF;
}

/* Icono del item colapsado */
.probo-collapsed-icon-img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  transition: transform 150ms ease;
}

.probo-collapsed-item:hover .probo-collapsed-icon-img {
  transform: scale(1.1);
}

/* Label del item colapsado */
.probo-collapsed-label {
  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  transition: color 150ms ease;
}

/* Nivel 1 - Secciones */
.probo-collapsed-level-1 {
  margin-bottom: 4px;
}

.probo-collapsed-level-1 .probo-collapsed-icon-img {
  width: 22px;
  height: 22px;
}

.probo-collapsed-level-1 .probo-collapsed-label {
  font-weight: 500;
  font-size: 12px;
}

/* Nivel 2 - Items */
.probo-collapsed-level-2 {
  margin-left: 0;
}

.probo-collapsed-level-2 .probo-collapsed-icon-img {
  width: 18px;
  height: 18px;
}

.probo-collapsed-level-2 .probo-collapsed-label {
  font-size: 10px;
}

/* Estado activo en modo colapsado */
.probo-collapsed-active {
  background-color: rgba(255, 255, 255, 0.12) !important;
  color: #FFFFFF !important;
}

.probo-collapsed-active::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 70%;
  background: linear-gradient(180deg, #8b75ff, #6347f4);
  border-radius: 2px 0 0 2px;
}
</style>
