# Visión General DualPanelSidebar

## Diagrama de Flujo (alto nivel)

1. `FlowConfig` (definición declarativa de items nivel 0-4)
2. `buildFlowItemTree()` → Genera `FlowItemTree[]` (estructura jerárquica)
3. `SidebarConfig` → Declara filtros/mode/posición por sidebar
4. `DualPanelSidebar.vue`
5. Panel seleccionado (`StepWizardPanel` | `HierarchicalPanel` | `ScrollAnchorPanel`)
6. Componentes específicos (`StepItem`, `HierarchicalItem`, `ScrollAnchor`)

## Responsabilidades actuales

- `FlowConfig` / `FlowItem`: Definen jerarquía (nivele 0-4), rutas, metadata.
- `buildFlowItemTree`: Mapea arreglo plano → árbol ordenado por `hierarchy.order`.
- `SidebarConfig`: Configura cada sidebar (posición, modo, filtros, clases).
- `DualPanelSidebar`: Orquesta el render según `mode`, convierte items en `NavigationStep[]`, gestiona estilos del `<aside>`.
- `flowConfigToSteps`: Aplana jerarquía y calcula `status` combinando ruta + store de progreso.
- `StepWizardPanel`: Itera `steps` y usa `StepItem` para la UI secuencial.
- `StepItem`: Renderiza niveles 0-4 con lógica de espaciados, conectores, badges.
- `HierarchicalPanel`: Usa `HierarchicalItem` recursivo para mostrar árbol completo.
- `ScrollAnchorPanel`: Genera anchors de nivel 4 para el sidebar derecho.

## Puntos críticos detectados

- Lógica y estilos mezclados en `StepItem` y `HierarchicalItem` (condicionales por nivel).
- `DualPanelSidebar` arma objetos de props con tipos mezclados → warnings TS.
- Estilos base en CSS tradicional; Tailwind usado parcialmente.
- Falta documentación centralizada para nuevos integrantes/equipos.
- Tooling limitado (`npm run build` detecta errores tarde, sin `typecheck` dedicado).

## Próximos pasos (referencia rápida)

1. Limpiar tipado/orquestación (`PanelPayload` discriminado).
2. Crear fábrica de items por nivel (componentes especializados + Tailwind).
3. Reorganizar capas (domain/application/presentation) y actualizar tooling.
4. Documentar guías de uso y checklists.
