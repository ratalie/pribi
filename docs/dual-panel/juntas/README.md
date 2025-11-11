# Guía de Modelado – Juntas de Accionistas

## 1. Principios Generales

- **Nivel 0**: Pasos macro del flujo (Selección, Detalles, Instalación, Puntos de agenda, Resumen, Descargar). Todos tienen página propia.
- **Nivel 1**: Sólo bajo “Puntos de agenda”. Resto de macros no muestran hijos en el sidebar izquierdo.
- **Nivel 2**: Para “Puntos de agenda”, las páginas hijas reales (Aporte dinerario, etc.). Otras macros saltan directo a nivel 3 en el índice derecho.
- **Nivel 3**: Secciones renderizadas en el índice derecho (páginas o apartados principales).
- **Nivel 4**: Sub-secciones secundarias (anchors o detalles dentro de una sección principal).
- **Nivel 2** (anchors/páginas) → se refleja en el índice derecho según control de la vista.
- **Categories / Headers**: `identity.isCategory = true`, sin ruta, sólo separadores visuales.
- **Right Sidebar**: Índice del paso actual. Lista la página principal y sus sub apartados (páginas o anchors) con indentación.

## 2. Layout esperado

### Sidebar izquierdo (macro → página)

- Sólo los macros Nivel 0 aparecen. Los hijos navegables (Nivel 1) solo existen bajo “Puntos de agenda”.
- Detalles, Instalación, Resumen y Descargar no tienen hijos visibles en el lado izquierdo; sus sub-secciones aparecen solo en el índice derecho.
- Tabla resumen:

  | Macro (Nivel 0)               | Hijos visibles en sidebar izquierdo    |
  | ----------------------------- | -------------------------------------- |
  | Selección de puntos de agenda | – (solo macro)                         |
  | Detalles de la junta          | –                                      |
  | Instalación de la junta       | –                                      |
  | Puntos de agenda              | Aporte dinerario, Capitalización, etc. |
  | Resumen                       | –                                      |
  | Descargar documento           | –                                      |

### Sidebar derecho (índice por página)

Para cada página de Nivel 1, se muestran:

- **Título principal** (la página actual).
- **Secciones Nivel 2**: sangría + texto sin ruta (o `hash`) para anclar.
- **Secciones especiales**: “Votación”, “Resumen” se mantienen a nivel 1 dentro del índice si tienen página propia; si no, se tratan como secciones.

## 3. Ejemplo: “Aporte dinerario” (sidebar derecho)

### Sidebar izquierdo

```
Puntos de agenda
  - Aporte dinerario
```

### Sidebar derecho (índice dentro de la página)

```
Aporte dinerario (nivel 3)
  • Aportantes (nivel 4)
  • Aportes (nivel 4)
Votación (nivel 3)
Resumen: Aporte dinerario (nivel 3)
```

## 4. Reglas para definir FlowItems

- **Páginas reales**: `navigation.route` definido, `hierarchy.level` = 0 o 1.
- **Secciones internas**: `navigation.route = parent.route`, opcional `navigation.hash` para scroll; `hierarchy.level = 2`.
- **Agrupadores**: `isCategory = true`, sin ruta.

## 5. Siguientes pasos sugeridos

1. Construir mapa completo (`docs/dual-panel/juntas/mapa-items.md`) con todos los pasos de Puntos de Agenda y Resumen siguiendo esta jerarquía.
2. Actualizar `FlowItem` correspondientes con nuevos niveles y `metadata.sections` si aplica.
3. Ajustar renderers (sidebar izquierdo/derecho) para respetar `isCategory` y `hasRoute`.
