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
  import { ref, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import logoProboImagen from "~/assets/icons/probo-logo-imagen.svg";
  import logoProboTexto from "~/assets/icons/probo-logo-texto.svg";
  import { useProboI18n } from "~/composables/useProboI18n";
  import { useUser } from "~/composables/useUser";
  import { navigationSections } from "~/config/navigation";
  import { getIcon } from "~/utils/iconMapper";
  import UserDropdownMenu from "./UserDropdownMenu.vue";

  const props = defineProps<{
    isCollapsed: boolean;
    toggleSidebar: () => void;
  }>();

  // Composables
  const route = useRoute();
  const router = useRouter();
  const { t } = useProboI18n();
  const { canViewModule } = useUser();

  // Estado para controlar qué secciones están expandidas
  const expandedSections = ref<Record<string, boolean>>({
    Registros: true,
    Operaciones: true,
    Storage: true,
    "Espacios de Trabajo": true,
    "Chat IA": true,
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

  // Detectar si un item tiene algún subitem activo (para modo colapsado)
  const hasActiveSubItem = (item: any): boolean => {
    if (!item.submenuItems) return false;
    return item.submenuItems.some((subItem: any) => subItem.href && isActive(subItem.href));
  };

  // Función para navegar
  const navigateTo = (href: string) => {
    router.push(href);
  };

  // Estado para hover del logo
  const isLogoHovered = ref(false);

  // Resetear hover cuando el sidebar se contrae o cambia de ruta
  watch(
    () => props.isCollapsed,
    (isCollapsed) => {
      // Siempre resetear el hover cuando el sidebar se contrae
      if (isCollapsed) {
        isLogoHovered.value = false;
      }
    }
  );

  // Resetear hover cuando cambia la ruta (si está contraído)
  watch(
    () => route.path,
    () => {
      // Si está contraído, resetear el hover para asegurar que siempre empiece con el logo
      if (props.isCollapsed) {
        isLogoHovered.value = false;
      }
    }
  );

  // Auto-expandir items cuando la ruta cambia (solo si el sidebar NO está contraído)
  watch(
    () => route.path,
    (newPath) => {
      // Solo expandir items si el sidebar NO está contraído
      if (props.isCollapsed) {
        return;
      }

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
  <!-- Sidebar Container -->
  <SidebarProvider :class="cn(props.isCollapsed ? 'w-[120px]' : 'w-[280px]')">
    <!-- Sidebar base - 280px width cuando expandido, 100px cuando colapsado -->
    <Sidebar
      :class="
        cn(
          'probo-sidebar-figma h-screen flex flex-col overflow-hidden border-r transition-all duration-300 ease-in-out ',
          props.isCollapsed ? 'w-[120px]' : 'w-[280px]'
        )
      "
    >
      <!-- Header - Padding 24px -->
      <SidebarHeader class="probo-sidebar-header">
        <div class="probo-header-content flex items-center justify-between h-full">
          <!-- Logo: Separación clara entre estado COLAPSADO y EXPANDIDO -->
          <div
            class="probo-logo-container flex justify-center items-center gap-2 h-full"
            @mouseenter="
              () => {
                if (props.isCollapsed) isLogoHovered = true;
              }
            "
            @mouseleave="
              () => {
                if (props.isCollapsed) isLogoHovered = false;
              }
            "
          >
            <!-- ============================================
                 ESTADO EXPANDIDO (NO COLAPSADO)
                 ============================================ -->
            <template v-if="!props.isCollapsed">
              <!-- Item 2: Logo completo (bola + texto) -->
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

      <!-- Navigation Content -->
      <SidebarContent class="probo-sidebar-content">
        <!-- Modo Expandido -->
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
                          <CollapsibleTrigger as-child>
                            <Button variant="ghost" class="probo-subsection-item">
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
                <!-- Nivel 1: Sección (Colapsable cuando está contraído) -->
                <button
                  class="probo-collapsed-item probo-collapsed-level-1"
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

      <!-- User Profile Footer - Padding 16px -->
      <SidebarFooter class="probo-sidebar-footer">
        <UserDropdownMenu :is-collapsed="props.isCollapsed" />
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
    height: 64px; /* h-16 = 64px siempre */
    min-height: 64px;
    max-height: 64px;
    display: flex;
    align-items: center;
  }

  .probo-sidebar-figma.w-\[100px\] .probo-sidebar-header {
    padding: 24px 10px;
  }

  /* Estilos para sidebar en hover expand (fixed) */
  .probo-sidebar-figma.fixed {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .probo-header-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .probo-logo-container {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 100%;
    flex: 1;
  }

  /* Cuando está contraído, centrar el logo verticalmente */
  .probo-sidebar-figma.w-\[100px\] .probo-logo-container {
    justify-content: center;
  }

  .probo-logo-link {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 8px;
    padding: 0;
    flex-shrink: 0;
    height: 40px;
    min-height: 40px;
  }

  /* Cuando está contraído, el logo-link debe ser cuadrado (40x40) */
  .probo-sidebar-figma.w-\[100px\] .probo-logo-link {
    width: 40px;
    min-width: 40px;
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
    min-width: 40px;
    min-height: 40px;
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
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
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
   CONTENT AREA
   ============================================ */

  .probo-sidebar-figma.w-\[100px\] .probo-sidebar-content {
    padding: 0 10px;
  }

  /* ============================================
   SCROLLBAR OVERLAY - Sin flechas, solo ruedita
   ============================================ */
  .probo-sidebar-content {
    /* Firefox - Scrollbar overlay sin flechas */
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
    /* Overlay: no empuja contenido */
    scrollbar-gutter: auto;
  }

  .probo-sidebar-content:hover {
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  }

  /* Webkit (Chrome, Safari, Edge) - Scrollbar overlay SIN FLECHAS */
  .probo-sidebar-content::-webkit-scrollbar {
    width: 6px !important;
    height: 6px !important;
    background: transparent !important;
    /* Eliminar completamente cualquier espacio para flechas */
    -webkit-appearance: none;
    appearance: none;
  }

  .probo-sidebar-content::-webkit-scrollbar-track {
    background: transparent !important;
    border: none !important;
    border-radius: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    /* Sin espacio para flechas */
    -webkit-appearance: none;
    appearance: none;
  }

  .probo-sidebar-content::-webkit-scrollbar-thumb {
    background: transparent !important;
    border-radius: 3px !important;
    border: none !important;
    transition: background 200ms ease !important;
    min-height: 20px !important;
    -webkit-appearance: none;
    appearance: none;
  }

  .probo-sidebar-content:hover::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2) !important;
  }

  .probo-sidebar-content:hover::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3) !important;
  }

  /* ELIMINAR COMPLETAMENTE TODAS LAS FLECHAS - Estrategia agresiva */
  .probo-sidebar-content::-webkit-scrollbar-button {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    -webkit-appearance: none !important;
    appearance: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
  }

  /* Todas las variantes de botones de scroll */
  .probo-sidebar-content::-webkit-scrollbar-button:start:decrement,
  .probo-sidebar-content::-webkit-scrollbar-button:end:increment,
  .probo-sidebar-content::-webkit-scrollbar-button:vertical:start:decrement,
  .probo-sidebar-content::-webkit-scrollbar-button:vertical:end:increment,
  .probo-sidebar-content::-webkit-scrollbar-button:horizontal:start:decrement,
  .probo-sidebar-content::-webkit-scrollbar-button:horizontal:end:increment,
  .probo-sidebar-content::-webkit-scrollbar-button:single-button,
  .probo-sidebar-content::-webkit-scrollbar-button:double-button,
  .probo-sidebar-content::-webkit-scrollbar-button:single-button:vertical:start:decrement,
  .probo-sidebar-content::-webkit-scrollbar-button:single-button:vertical:end:increment,
  .probo-sidebar-content::-webkit-scrollbar-button:double-button:vertical:start:decrement,
  .probo-sidebar-content::-webkit-scrollbar-button:double-button:vertical:end:increment {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    -webkit-appearance: none !important;
    appearance: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }

  /* Esquina del scrollbar */
  .probo-sidebar-content::-webkit-scrollbar-corner {
    display: none !important;
    background: transparent !important;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none !important;
    appearance: none !important;
  }

  /* Track piece (partes del track) */
  .probo-sidebar-content::-webkit-scrollbar-track-piece {
    background: transparent !important;
    border: none !important;
    -webkit-appearance: none !important;
    appearance: none !important;
  }

  /* Asegurar que no haya ningún elemento residual */
  .probo-sidebar-content::-webkit-scrollbar-button:before,
  .probo-sidebar-content::-webkit-scrollbar-button:after {
    display: none !important;
    content: none !important;
  }

  /* ============================================
   SECTION WRAPPER - Separación entre secciones
   ============================================ */
  .probo-section-wrapper {
    margin-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 20px;
    padding-top: 12px;
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
    font-family: "Manrope", sans-serif;
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
    font-family: "Manrope", sans-serif;
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
    font-family: "Manrope", sans-serif;
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
    font-family: "Manrope", sans-serif;
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
    color: #ffffff !important;
    font-weight: 500 !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .probo-item-active::before {
    content: "";
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
    color: #ffffff;
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
    color: #ffffff;
    transform: scale(1.1);
  }

  .probo-item-active .probo-icon-subsection {
    color: #ffffff;
  }

  .probo-icon-leaf {
    width: 16px;
    height: 16px;
    color: rgba(255, 255, 255, 0.7);
    flex-shrink: 0;
  }

  .probo-item-active .probo-icon-leaf {
    color: #ffffff;
  }

  .probo-icon-principal {
    width: 16px;
    height: 16px;
    color: rgba(255, 255, 255, 0.7);
    flex-shrink: 0;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .probo-principal-item:hover .probo-icon-principal {
    color: #ffffff;
    transform: scale(1.1);
  }

  .probo-item-active .probo-icon-principal {
    color: #ffffff;
  }

  /* ============================================
   FOOTER (16px padding)
   ============================================ */
  .probo-sidebar-footer {
    padding: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    transition: padding 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .probo-sidebar-figma.w-\[100px\] .probo-sidebar-footer {
    padding: 16px 10px;
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
    gap: 4px;
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

  /* Hover general - Solo para nivel 2 */
  .probo-collapsed-level-2:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }

  /* Hover nivel 1 - Solo font-bold, sin background */
  .probo-collapsed-level-1:hover {
    background-color: transparent;
    color: #ffffff;
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
    font-family: "Manrope", sans-serif;
    font-size: 11px;
    font-weight: 400;
    line-height: 1.3;
    text-align: center;
    word-wrap: break-word;
    word-break: break-word;
    hyphens: auto;
    max-width: 100%;
    transition: color 150ms ease;
    /* Permitir múltiples líneas */
    white-space: normal;
    overflow: visible;
  }

  /* Nivel 1 - Secciones */
  .probo-collapsed-level-1 {
    margin-bottom: 2px;
    color: rgba(255, 255, 255, 0.65);
  }

  .probo-collapsed-level-1 .probo-collapsed-icon-img {
    width: 22px;
    height: 22px;
  }

  .probo-collapsed-level-1 .probo-collapsed-label {
    font-weight: 400;
    font-size: 12px;
    transition: font-weight 150ms ease;
  }

  /* Hover nivel 1 - Solo font-bold, sin background */
  .probo-collapsed-level-1:hover .probo-collapsed-label {
    font-weight: 600;
  }

  /* Nivel 2 - Items */
  .probo-collapsed-level-2 {
    margin-left: 0;
    margin-top: 2px;
  }

  .probo-collapsed-level-2 .probo-collapsed-icon-img {
    width: 18px;
    height: 18px;
  }

  .probo-collapsed-level-2 .probo-collapsed-label {
    font-size: 10px;
  }

  /* Estado activo en modo colapsado - SOLO para nivel 2 */
  .probo-collapsed-level-2.probo-collapsed-active {
    background-color: rgba(255, 255, 255, 0.12) !important;
    color: #ffffff !important;
  }

  .probo-collapsed-level-2.probo-collapsed-active::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 70%;
    background: linear-gradient(180deg, #8b75ff, #6347f4);
    border-radius: 2px 0 0 2px;
  }

  .probo-sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 12px;
    gap: 0 !important;
    /* Scrollbar overlay: no empuja contenido, se pone por encima */
    scrollbar-gutter: auto;
    transition: padding 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
