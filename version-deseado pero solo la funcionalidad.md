```
<script setup lang="ts">
  import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-vue-next";
  import { ref, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import logoProboImagen from "~/assets/icons/probo-logo-imagen.svg";
  import logoProboTexto from "~/assets/icons/probo-logo-texto.svg";
  import { Button } from "~/components/ui/button";
  import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "~/components/ui/collapsible";
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider,
  } from "~/components/ui/sidebar";
  import UserDropdownMenu from "~/components/UserDropdownMenu.vue";
  import { usePermissions } from "~/composables/usePermissions";
  import { useProboI18n } from "~/composables/useProboI18n";
  import { navigationSections } from "~/config/navigation";
  import { cn } from "~/lib/utils";
  import { getIcon } from "~/utils/iconMapper";

  interface Props {
    isCollapsed: boolean;
    toggleSidebar: () => void;
  }

  const props = defineProps<Props>();
  const route = useRoute();
  const router = useRouter();
  const { t } = useProboI18n();
  const { canViewModule } = usePermissions();

  // Estado para controlar qué secciones están expandidas
  const expandedSections = ref<Record<string, boolean>>({
    Registros: true,
    Operaciones: true,
    Storage: true,
    "Espacios de Trabajo": true,
    "Chat IA": true,
  });

  // Estado para controlar qué items de nivel 2 están expandidos
  const expandedItems = ref<Record<string, boolean>>({
    "registros-sociedades": true,
    "registros-sucursales": false,
  });

  // Métodos
  const toggleSection = (section: string, value: boolean) => {
    expandedSections.value[section] = value;
  };

  const toggleItem = (itemId: string, value?: boolean) => {
    if (value !== undefined) {
      expandedItems.value[itemId] = value;
    } else {
      expandedItems.value[itemId] = !expandedItems.value[itemId];
    }
  };

  const isActive = (href?: string): boolean => {
    if (!href) return false;
    return route.path === href || route.path.startsWith(href + "/");
  };

  const isSectionActive = (sectionId: string): boolean => {
    const section = navigationSections.find((s) => s.id === sectionId);
    if (!section) return false;

    return section.items.some((item) => {
      if (item.href && isActive(item.href)) return true;
      if (item.submenuItems) {
        return item.submenuItems.some((subItem) => isActive(subItem.href));
      }
      return false;
    });
  };

  const hasActiveSubItem = (item: any): boolean => {
    if (!item.submenuItems) return false;
    return item.submenuItems.some((subItem: any) => isActive(subItem.href));
  };

  const navigateTo = (href: string) => {
    router.push(href);
  };

  // Estado para hover del logo
  const isLogoHovered = ref(false);

  // Auto-expandir items cuando la ruta cambia
  watch(
    () => route.path,
    (newPath) => {
      navigationSections.forEach((section) => {
        section.items.forEach((item) => {
          if (item.submenuItems) {
            const isActive = item.submenuItems.some(
              (subItem) => newPath === subItem.href || newPath.startsWith(subItem.href + "/")
            );
            if (isActive) {
              expandedItems.value[item.id] = true;
            }
          }
        });
      });
    },
    { immediate: true }
  );
</script>

<template>
  <SidebarProvider>
    <Sidebar
      :class="
        cn(
          'probo-sidebar-figma border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out',
          props.isCollapsed ? 'w-[100px]' : 'w-[280px]'
        )
      "
    >
      <!-- Header - Padding 24px -->
      <SidebarHeader class="probo-sidebar-header transition-all duration-300 ease-in-out h-16">
        <div class="probo-header-content flex items-center justify-between h-full">
          <!-- Logo: Separación clara entre estado COLAPSADO y EXPANDIDO -->
          <div
            class="probo-logo-container flex items-center gap-2 h-full"
            @mouseenter="isLogoHovered = true"
            @mouseleave="isLogoHovered = false"
          >
            <!-- ============================================
                 ESTADO EXPANDIDO (NO COLAPSADO)
                 ============================================ -->
            <template v-if="!props.isCollapsed">
              <!-- Item 2: Logo completo (bola + texto) como UN SOLO elemento colapsable -->
              <NuxtLink to="/" class="probo-logo-link flex items-center gap-2">
                <img class="probo-logo-img" :src="logoProboImagen" alt="PROBO" />
                <img class="probo-logo-texto" :src="logoProboTexto" alt="PROBO" />
              </NuxtLink>

              <!-- Icono 3: Botón contraer (chevron izquierda) -->
              <Button
                variant="ghost"
                size="sm"
                class="probo-collapse-btn"
                @click="toggleSidebar"
              >
                <ChevronLeft class="w-4 h-4" />
              </Button>
            </template>

            <!-- ============================================
                 ESTADO COLAPSADO
                 ============================================ -->
            <template v-else>
              <!-- Sin hover: Mostrar solo la bola del logo -->
              <NuxtLink v-if="!isLogoHovered" to="/" class="probo-logo-link flex items-center">
                <img class="probo-logo-img" :src="logoProboImagen" alt="PROBO" />
              </NuxtLink>

              <!-- Con hover: Mostrar botón expandir (chevron derecha) - REEMPLAZA la bola -->
              <Button
                v-else
                variant="ghost"
                size="sm"
                class="probo-expand-btn"
                @click="toggleSidebar"
              >
                <ChevronRight class="w-4 h-4" />
              </Button>
            </template>
          </div>
        </div>
      </SidebarHeader>

      <!-- Content -->
      <SidebarContent class="probo-sidebar-content">
        <template v-if="!props.isCollapsed">
          <div
            v-for="section in navigationSections"
            :key="section.id"
            class="probo-section-wrapper"
          >
            <template v-if="canViewModule(section.id)">
              <Collapsible
                :open="expandedSections[section.title]"
                @update:open="(value) => toggleSection(section.title, value)"
              >
                <CollapsibleTrigger as-child>
                  <Button variant="ghost" class="probo-section-title">
                    <div class="flex items-center gap-2">
                      <!-- Sin iconos en nivel 1 para ahorrar espacio -->
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
                          <div class="flex items-center">
                            <!-- Click en texto/icono: navegar al dashboard -->
                            <NuxtLink
                              :to="(item.submenuItems && item.submenuItems[0]?.href) || '#'"
                              class="probo-subsection-item flex-1"
                              :class="{
                                'probo-item-active':
                                  hasActiveSubItem(item) ||
                                  (item.submenuItems && item.submenuItems[0]
                                    ? isActive(item.submenuItems[0].href)
                                    : false),
                              }"
                            >
                              <div class="flex items-center gap-2">
                                <component
                                  :is="getIcon(item.icon || '')"
                                  v-if="getIcon(item.icon || '')"
                                  class="probo-icon-subsection"
                                />
                                <span>{{ t(item.translationKey) }}</span>
                              </div>
                            </NuxtLink>

                            <!-- Click en chevron: toggle expand/collapse -->
                            <CollapsibleTrigger as-child>
                              <Button variant="ghost" size="sm" class="p-2 h-auto" @click.stop>
                                <ChevronRight
                                  class="w-4 h-4 transition-transform duration-300 cursor-pointer"
                                  :class="cn(expandedItems[item.id] && 'rotate-90')"
                                />
                              </Button>
                            </CollapsibleTrigger>
                          </div>

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

                      <!-- Item without submenu -->
                      <template v-else>
                        <NuxtLink
                          v-if="item.href"
                          :to="item.href"
                          class="probo-subsection-item"
                          :class="{
                            'probo-item-active': isActive(item.href),
                          }"
                        >
                          <div class="flex items-center gap-2">
                            <component
                              :is="getIcon(item.icon || '')"
                              v-if="getIcon(item.icon || '')"
                              class="probo-icon-subsection"
                            />
                            <span>{{ t(item.translationKey) }}</span>
                          </div>
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
                <!-- Nivel 1: Sección (Colapsable cuando está contraído) -->
                <button
                  class="probo-collapsed-item probo-collapsed-level-1"
                  :class="{
                    'probo-collapsed-active': isSectionActive(section.id),
                  }"
                  @click="toggleSection(section.title, !expandedSections[section.title])"
                >
                  <!-- NO mostrar icono en nivel 1 cuando está contraído -->
                  <span class="probo-collapsed-label">
                    {{ t(section.translationKey) }}
                  </span>
                </button>

                <!-- Nivel 2: Items (Icono + Nombre) - Solo mostrar si la sección está expandida -->
                <template v-if="expandedSections[section.title]">
                  <template v-for="item in section.items" :key="item.id">
                    <template v-if="canViewModule(item.id)">
                      <button
                        class="probo-collapsed-item probo-collapsed-level-2"
                        :class="{
                          'probo-collapsed-active':
                            hasActiveSubItem(item) || (item.href && isActive(item.href)),
                        }"
                        @click.prevent.stop="
                          item.submenuItems &&
                          item.submenuItems.length > 0 &&
                          item.submenuItems[0]?.href
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
              </template>
            </div>
          </div>
        </template>
      </SidebarContent>

      <!-- Footer con opciones de usuario -->
      <SidebarFooter class="border-t border-white/10 p-4">
        <UserDropdownMenu :is-collapsed="props.isCollapsed" />
      </SidebarFooter>
    </Sidebar>
  </SidebarProvider>
</template>

<style scoped>
  /* ============================================
     ESTILOS GENERALES DEL SIDEBAR
     ============================================ */
  .probo-sidebar-figma {
    padding: 16px 24px;
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .probo-sidebar-figma.w-\[100px\] {
    padding: 16px 10px;
  }

  /* Scrollbar personalizado - Estilo original con color primary */
  .probo-sidebar-figma {
    scrollbar-width: thin;
    scrollbar-color: rgba(124, 90, 255, 0.75) rgba(60, 40, 164, 0.15);
  }

  .probo-sidebar-figma::-webkit-scrollbar {
    width: 6px;
  }

  .probo-sidebar-figma::-webkit-scrollbar-track {
    background: rgba(60, 40, 164, 0.1);
    border-radius: 999px;
  }

  .probo-sidebar-figma::-webkit-scrollbar-thumb {
    background: rgba(124, 90, 255, 0.8);
    border-radius: 999px;
  }

  .probo-sidebar-figma::-webkit-scrollbar-thumb:hover {
    background: rgba(124, 90, 255, 0.95);
  }

  /* ============================================
     HEADER
     ============================================ */
  .probo-sidebar-header {
    padding: 16px 24px;
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
    height: 64px; /* h-16 = 64px siempre */
    min-height: 64px;
    max-height: 64px;
  }

  .probo-sidebar-figma.w-\[100px\] .probo-sidebar-header {
    padding: 16px 10px;
  }

  .probo-header-content {
    width: 100%;
    height: 100%;
  }

  /* Estilos para sidebar en hover expand (fixed) */
  .probo-sidebar-figma.fixed {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .probo-logo-container {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 100%;
  }

  .probo-logo-link {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 8px;
    padding: 4px;
    flex-shrink: 0;
  }

  .probo-logo-link:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }

  .probo-logo-link:active {
    transform: scale(0.98);
  }

  .probo-logo-img {
    width: 40px;
    height: 40px;
    object-fit: contain;
    flex-shrink: 0;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .probo-logo-texto {
    height: 32px;
    max-width: 120px;
    object-fit: contain;
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
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

  .probo-app-name {
    font-family: "Gabarito", sans-serif;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0.02em;
    line-height: 1.5;
    color: #ffffff;
    white-space: nowrap;
  }

  .probo-collapse-btn,
  .probo-expand-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }

  .probo-collapse-btn:hover,
  .probo-expand-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  /* ============================================
     CONTENT
     ============================================ */
  .probo-sidebar-content {
    padding: 0;
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
  }

  /* ============================================
     SECCIONES (NIVEL 1) - MODO EXPANDIDO
     ============================================ */
  .probo-section-wrapper {
    margin-bottom: 8px;
  }

  .probo-section-title {
    width: 100%;
    justify-content: space-between;
    padding: 12px 16px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.01em;
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    margin-bottom: 4px;
  }

  .probo-section-title:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 1);
  }

  .probo-section-content {
    padding-left: 8px;
    padding-right: 8px;
  }

  /* ============================================
     ITEMS DE NIVEL 2 (SUBSECCIONES) - MODO EXPANDIDO
     ============================================ */
  .probo-subsection-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.85);
    border-radius: 6px;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    margin-bottom: 2px;
    text-decoration: none;
  }

  .probo-subsection-item:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 1);
  }

  .probo-subsection-item.probo-item-active {
    background-color: rgba(99, 71, 244, 0.2);
    color: rgba(255, 255, 255, 1);
    font-weight: 600;
  }

  .probo-icon-subsection {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  /* ============================================
     ITEMS DE NIVEL 3 (HOJAS) - MODO EXPANDIDO
     ============================================ */
  .probo-subsection-content {
    padding-left: 24px;
    padding-top: 4px;
    padding-bottom: 4px;
  }

  .probo-leaf-item {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.01em;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.75);
    border-radius: 6px;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    margin-bottom: 2px;
    text-decoration: none;
  }

  .probo-leaf-item:hover {
    background-color: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.9);
  }

  .probo-leaf-item.probo-item-active {
    background-color: rgba(99, 71, 244, 0.25);
    color: rgba(255, 255, 255, 1);
    font-weight: 500;
  }

  /* ============================================
     MODO COLAPSADO - ESTILO PERPLEXITY
     ============================================ */
  .probo-collapsed-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px 0;
  }

  .probo-collapsed-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .probo-collapsed-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px 8px;
    border-radius: 8px;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    background: transparent;
    border: none;
    cursor: pointer;
    width: 100%;
    gap: 6px;
  }

  .probo-collapsed-item:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }

  .probo-collapsed-level-1 {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: rgba(255, 255, 255, 0.7);
    padding: 10px 8px;
  }

  .probo-collapsed-level-1:hover {
    color: rgba(255, 255, 255, 0.9);
    background-color: rgba(255, 255, 255, 0.1);
  }

  .probo-collapsed-level-1.probo-collapsed-active {
    color: rgba(255, 255, 255, 1);
    background-color: rgba(99, 71, 244, 0.2);
  }

  .probo-collapsed-level-2 {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: rgba(255, 255, 255, 0.8);
  }

  .probo-collapsed-level-2:hover {
    color: rgba(255, 255, 255, 1);
    background-color: rgba(255, 255, 255, 0.1);
  }

  .probo-collapsed-level-2.probo-collapsed-active {
    color: rgba(255, 255, 255, 1);
    background-color: rgba(99, 71, 244, 0.25);
    font-weight: 600;
  }

  .probo-collapsed-icon-img {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .probo-collapsed-label {
    text-align: center;
    word-wrap: break-word;
    white-space: normal;
    line-height: 1.3;
    max-width: 100%;
  }

  /* Separador entre secciones en modo colapsado - Barra con color primary */
  .probo-collapsed-section:not(:first-child)::before {
    content: "";
    display: block;
    height: 1px;
    background: rgba(99, 71, 244, 0.5);
    margin: 8px 0;
    width: 100%;
  }
</style>

```