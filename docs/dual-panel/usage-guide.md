# Guía de Uso - DualPanelSidebar (Arquitectura Limpia)

## Capas
- **Domain (`app/types/flow-system`)**: Define `FlowItem`, jerarquías, rutas y configuraciones declarativas.
- **Application (`app/application/dual-panel/flowConfigToSteps.ts`)**: Adapta `FlowItemTree` → `NavigationStep`, expone helpers (`childrenToSteps`, `siblingsToSteps`, `levelToSteps`).
- **Presentation (`app/presentation/dual-panel/sidebar/`)**: Componentes Vue organizados por responsabilidad (`DualPanelSidebar`, paneles, items por nivel, utilidades visuales).

## Componentes principales
- `DualPanelSidebar.vue`: Orquestador. Recibe `SidebarConfig`, calcula `steps` y selecciona el panel adecuado (`wizard`, `hierarchical`, `scroll-anchor`).
- `panels/StepWizardPanel.vue`: Lista plana de pasos. Usa `StepRenderer` para elegir componente según nivel.
- `panels/HierarchicalPanel.vue`: Renderiza el árbol completo (expand/collapse) con `HierarchicalItem` recursivo.
- `panels/ScrollAnchorPanel.vue`: Sidebar derecho con anchors de nivel 4.
- `shared/StepRenderer.vue`: Fábrica que despacha a los componentes `Level0Item` → `Level4Item`.
- `shared/items/StepItemBase.vue`: Lógica común (link, descripción, control de slots) usando Tailwind.

## Cómo reutilizar en otro flujo
1. **Definir `FlowConfig`** con items (niveles 0-4) y construir el árbol (`buildFlowItemTree`).
2. **Configurar sidebars** mediante `SidebarConfig` (filtros por nivel, posición, clases). Guardarlos en tu layout.
3. **Importar el orquestador**: `import DualPanelSidebar from '~/presentation/dual-panel/sidebar/DualPanelSidebar.vue'`.
4. **Renderizar** en el layout pasando `:config`, `:current-path` (ruta activa) y opcional `:mode`, `:flow-id`.
5. **Personalizar UI** modificando los componentes por nivel (`shared/items/LevelXItem.vue`). Cada nivel usa Tailwind, por lo que puedes cambiar tipografías, colores o badges sin tocar la lógica.

## Extensiones comunes
- **Nuevo modo de panel**: crear archivo en `panels/`, exportar componente y actualizar `panelSetup` en `DualPanelSidebar` para incluirlo.
- **Estados extra**: extender `StatusIcon` o añadir badges en `LevelXItem`. El `NavigationStep.status` admite `completed | current | empty | optional | in-progress | locked | error`.
- **Filtros/contexto**: usar helpers de aplicación (`childrenToSteps`, `siblingsToSteps`, `levelToSteps`) o extender `getContextualSidebarConfig` en el layout.

## Tooling
- `npm run typecheck` → `nuxi typecheck`
- `npm run lint` / `npm run lint:fix` → ESLint (Tailwind friendly)
- `npm run build` ejecuta `typecheck + lint + nuxt build`.

> Nota: `typecheck` actualmente falla por issues previos (`JuntaRoutes` y summaries). Documentado en el CI backlog; no bloquea el refactor del sidebar.

## Checklist QA
- Navegación izquierda muestra niveles 0-2 según filtros.
- Sidebar derecho se actualiza al cambiar de nivel y respeta anchors (`hash`).
- Estados (completed/current/empty) se reflejan en iconos y badges.
- Responsivo < 768px: sidebar ocupa 100% ancho.
- Tailwind tokens (`font-primary`, `sidebar-primary`, etc.) definidos en tema.
