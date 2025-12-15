# 📋 Plan de Componetización: Selección de Puntos de Agenda y Detalles de la Junta

## 🎯 Objetivo

Refactorizar las vistas de **Selección de Puntos de Agenda** y **Detalles de la Junta** para tener componentes atómicos, bien estructurados, con responsabilidades separadas, siguiendo el estilo del `flow-layout-juntas`.

---

## 📊 Análisis del Estado Actual

### 1. Selección de Puntos de Agenda (`SeleccionPuntosAgenda.vue`)

**Problemas identificados:**

- ❌ Componente monolítico de **474 líneas**
- ❌ Lógica de negocio mezclada con presentación
- ❌ Estado local mezclado con lógica de stores
- ❌ Código duplicado para manejo de categorías
- ❌ Vista previa de agenda acoplada al componente principal
- ❌ Toggle de junta obligatoria sin separación de responsabilidades

**Estructura actual:**

```
SeleccionPuntosAgenda.vue (474 líneas)
├── Lógica de carga de datos
├── Manejo de estado local
├── Agrupación por categorías
├── Toggle de junta obligatoria
├── Panel izquierdo (selección)
└── Panel derecho (vista previa)
```

### 2. Detalles de la Junta

**Problemas identificados:**

**TipoJuntaSection.vue (82 líneas):**

- ✅ Relativamente bien estructurado
- ⚠️ Podría extraer lógica de negocio a composable

**ConvocatoriaJuntaSection.vue (432 líneas):**

- ❌ Componente muy largo con lógica repetida
- ❌ 6 computed properties similares (primeraModo, primeraDireccion, primeraFecha, primeraHora, segundaModo, segundaDireccion, etc.)
- ❌ Lógica de creación de convocatorias duplicada
- ❌ Validaciones mezcladas con presentación

**ConvocatoriaCard.vue (144 líneas):**

- ✅ Bien estructurado
- ⚠️ Podría extraer validaciones a composable

---

## 🎨 Estilo de Referencia: `flow-layout-juntas`

**Características del estilo:**

- ✅ Componentes atómicos y reutilizables
- ✅ Separación clara de responsabilidades
- ✅ Composables para lógica de negocio
- ✅ Props bien tipados con TypeScript
- ✅ Componentes auto-gestionados cuando es apropiado
- ✅ Estructura de carpetas organizada

**Ejemplo de estructura:**

```
flow-layout-juntas/
├── FlowLayoutJuntasHeader.vue (orquestador)
├── FlowLayoutJuntasContentWrapper.vue (orquestador + composables)
├── FlowLayoutJuntasContent.vue (presentación)
├── HeaderTitle.vue (atómico)
├── HeaderActions.vue (atómico)
└── ...
```

---

## 🚀 Opciones de Implementación

### **Opción 1: Refactorización Completa con Arquitectura Hexagonal** ⭐ (Recomendada)

**Enfoque:**

- Crear estructura completa siguiendo arquitectura hexagonal
- Separar completamente lógica de negocio de presentación
- Componentes atómicos siguiendo Atomic Design
- Composables para toda la lógica de negocio
- Stores solo para estado compartido

**Estructura propuesta para Selección de Agenda:**

```
app/components/juntas/seleccion-agenda/
├── SeleccionPuntosAgendaContainer.vue (orquestador)
├── atoms/
│   ├── PuntoAgendaCheckbox.vue
│   ├── CategoriaHeader.vue
│   ├── AgendaItemPreview.vue
│   └── JuntaObligatoriaToggle.vue
├── molecules/
│   ├── CategoriaPuntosList.vue
│   ├── AgendaPreviewList.vue
│   └── JuntaObligatoriaBanner.vue
├── organisms/
│   ├── PanelSeleccionPuntos.vue
│   └── PanelVistaPreviaAgenda.vue
└── composables/
    ├── usePuntosAgenda.ts (lógica de puntos)
    ├── useCategoriasAgenda.ts (lógica de categorías)
    ├── useJuntaObligatoria.ts (lógica de toggle)
    └── useAgendaPreview.ts (lógica de vista previa)
```

**Estructura propuesta para Detalles:**

```
app/components/juntas/detalles/
├── DetallesJuntaContainer.vue (orquestador)
├── TipoJuntaSection.vue (ya existe, mejorarlo)
├── ConvocatoriaJuntaSection.vue (refactorizar)
├── atoms/
│   ├── ConvocatoriaInfoBanner.vue
│   └── ModalidadSwitch.vue
├── molecules/
│   └── ConvocatoriaFormFields.vue
└── composables/
    ├── useTipoJunta.ts
    ├── useConvocatoria.ts (lógica reutilizable)
    └── useConvocatoriaValidation.ts
```

**Ventajas:**

- ✅ Máxima separación de responsabilidades
- ✅ Componentes altamente reutilizables
- ✅ Fácil de testear
- ✅ Escalable y mantenible
- ✅ Sigue arquitectura hexagonal del proyecto

**Desventajas:**

- ⚠️ Más tiempo de implementación (4-6 horas)
- ⚠️ Más archivos para gestionar

**Tiempo estimado:** 4-6 horas

---

### **Opción 2: Refactorización Modular Pragmática**

**Enfoque:**

- Dividir componentes grandes en módulos funcionales
- Extraer lógica repetida a composables
- Mantener estructura más simple que Opción 1
- Enfoque en resolver problemas inmediatos

**Estructura propuesta para Selección de Agenda:**

```
app/components/juntas/seleccion-agenda/
├── SeleccionPuntosAgenda.vue (refactorizado, más pequeño)
├── PanelSeleccionPuntos.vue
├── PanelVistaPreviaAgenda.vue
├── JuntaObligatoriaToggle.vue
└── composables/
    ├── usePuntosAgendaLogic.ts
    └── useAgendaPreview.ts
```

**Estructura propuesta para Detalles:**

```
app/components/juntas/detalles/
├── TipoJuntaSection.vue (mejorado)
├── ConvocatoriaJuntaSection.vue (refactorizado)
├── ConvocatoriaCard.vue (ya existe)
└── composables/
    └── useConvocatoriaLogic.ts (extraer lógica repetida)
```

**Ventajas:**

- ✅ Implementación más rápida (2-3 horas)
- ✅ Mejora significativa sin sobre-ingeniería
- ✅ Más fácil de entender para el equipo
- ✅ Resuelve problemas principales

**Desventajas:**

- ⚠️ Menos granular que Opción 1
- ⚠️ Algunos componentes aún pueden ser grandes

**Tiempo estimado:** 2-3 horas

---

### **Opción 3: Refactorización Incremental (Paso a Paso)**

**Enfoque:**

- Empezar solo con Selección de Agenda
- Refactorizar en fases pequeñas
- Mantener funcionalidad existente en cada paso
- Aplicar lo aprendido a Detalles después

**Fase 1: Extraer Vista Previa**

- Crear `PanelVistaPreviaAgenda.vue`
- Extraer lógica a `useAgendaPreview.ts`

**Fase 2: Extraer Panel de Selección**

- Crear `PanelSeleccionPuntos.vue`
- Extraer lógica a `usePuntosAgendaLogic.ts`

**Fase 3: Extraer Toggle Junta Obligatoria**

- Crear `JuntaObligatoriaToggle.vue`
- Extraer lógica a `useJuntaObligatoria.ts`

**Fase 4: Refactorizar Detalles (después)**

**Ventajas:**

- ✅ Riesgo mínimo (cambios pequeños)
- ✅ Fácil de revertir si hay problemas
- ✅ Permite aprender del proceso
- ✅ No bloquea otras tareas

**Desventajas:**

- ⚠️ Toma más tiempo total (5-7 horas)
- ⚠️ Puede dejar código intermedio

**Tiempo estimado:** 5-7 horas (distribuido)

---

### **Opción 4: Refactorización Mínima (Solo Extraer Lógica)**

**Enfoque:**

- Mantener estructura de componentes actual
- Solo extraer lógica repetida a composables
- Mejorar organización interna sin cambiar estructura

**Cambios propuestos:**

- Extraer lógica de `SeleccionPuntosAgenda.vue` a composables
- Extraer lógica repetida de `ConvocatoriaJuntaSection.vue` a `useConvocatoriaLogic.ts`
- Mejorar comentarios y organización interna

**Ventajas:**

- ✅ Implementación muy rápida (1-2 horas)
- ✅ Riesgo mínimo
- ✅ Mejora mantenibilidad sin cambios grandes

**Desventajas:**

- ⚠️ No resuelve problemas de estructura
- ⚠️ Componentes siguen siendo grandes
- ⚠️ No sigue el estilo de `flow-layout-juntas`

**Tiempo estimado:** 1-2 horas

---

## 📝 Plan Detallado (Opción 1 - Recomendada)

### **Fase 1: Selección de Puntos de Agenda**

#### 1.1 Crear Estructura de Carpetas

```
app/components/juntas/seleccion-agenda/
├── atoms/
├── molecules/
├── organisms/
└── composables/
```

#### 1.2 Crear Composables (Lógica de Negocio)

**`usePuntosAgenda.ts`**

- Gestionar lista de puntos disponibles
- Agrupar por categoría
- Manejar selección/deselección
- Validar selección mínima

**`useCategoriasAgenda.ts`**

- Gestionar estado de categorías expandidas/colapsadas
- Toggle de categorías
- Filtrar puntos por categoría

**`useJuntaObligatoria.ts`**

- Lógica del toggle de junta obligatoria
- Agregar/remover puntos obligatorios automáticamente
- Validar que junta obligatoria tenga puntos requeridos

**`useAgendaPreview.ts`**

- Generar agenda ordenada
- Agrupar por categoría para vista previa
- Calcular números de orden

#### 1.3 Crear Componentes Atómicos

**`PuntoAgendaCheckbox.vue`**

- Props: `punto`, `isSelected`, `@toggle`
- Solo renderiza checkbox + label

**`CategoriaHeader.vue`**

- Props: `categoria`, `isExpanded`, `@toggle`
- Solo renderiza header con chevron

**`AgendaItemPreview.vue`**

- Props: `punto`, `numero`
- Solo renderiza item de vista previa

**`JuntaObligatoriaToggle.vue`**

- Props: `isEnabled`, `@toggle`
- Solo renderiza toggle + tooltip

#### 1.4 Crear Componentes Moleculares

**`CategoriaPuntosList.vue`**

- Props: `categoria`, `puntos`, `selectedPuntos`, `@toggle-punto`
- Usa `CategoriaHeader` + lista de `PuntoAgendaCheckbox`

**`AgendaPreviewList.vue`**

- Props: `agendaOrdenada`, `puntosPorCategoria`
- Usa `AgendaItemPreview` agrupados por categoría

**`JuntaObligatoriaBanner.vue`**

- Props: `isEnabled`
- Solo renderiza banner informativo

#### 1.5 Crear Componentes Organismos

**`PanelSeleccionPuntos.vue`**

- Props: `puntos`, `selectedPuntos`, `categorias`, `@update-selection`
- Usa `JuntaObligatoriaToggle` + `CategoriaPuntosList`
- Gestiona layout del panel izquierdo

**`PanelVistaPreviaAgenda.vue`**

- Props: `agendaOrdenada`, `isJuntaObligatoria`
- Usa `JuntaObligatoriaBanner` + `AgendaPreviewList`
- Gestiona layout del panel derecho

#### 1.6 Crear Container (Orquestador)

**`SeleccionPuntosAgendaContainer.vue`**

- Usa todos los composables
- Gestiona comunicación entre paneles
- Pasa props a organismos
- Maneja carga de datos del backend

#### 1.7 Actualizar Página

- Reemplazar `SeleccionPuntosAgenda.vue` por `SeleccionPuntosAgendaContainer.vue`
- Mantener misma interfaz externa

---

### **Fase 2: Detalles de la Junta**

#### 2.1 Crear Composables

**`useTipoJunta.ts`**

- Lógica de selección de tipo de junta
- Validaciones de cambio de tipo
- Limpieza de datos al cambiar tipo

**`useConvocatoria.ts`**

- Lógica reutilizable para primera/segunda/detalle
- Crear/actualizar convocatorias
- Validaciones de fechas y plazos
- Formateo de fechas/horas

**`useConvocatoriaValidation.ts`**

- Validaciones de plazos (3 días, 3-10 días)
- Validaciones de campos requeridos
- Mensajes de error

#### 2.2 Refactorizar ConvocatoriaJuntaSection

**Dividir en:**

- `ConvocatoriaJuntaSection.vue` (orquestador, más pequeño)
- `ConvocatoriaUniversalCard.vue` (para junta universal)
- `ConvocatoriaGeneralCards.vue` (para junta general)
- Usar `useConvocatoria.ts` para eliminar código duplicado

#### 2.3 Mejorar TipoJuntaSection

- Extraer lógica a `useTipoJunta.ts`
- Mantener componente simple y presentacional

#### 2.4 Crear Componentes Atómicos (si es necesario)

- `ConvocatoriaInfoBanner.vue` (extraer de ConvocatoriaCard)
- `ModalidadSwitch.vue` (si se usa en otros lugares)

---

## ✅ Checklist de Implementación

### Selección de Agenda

- [ ] Crear estructura de carpetas
- [ ] Crear composables (4)
- [ ] Crear componentes atómicos (4)
- [ ] Crear componentes moleculares (3)
- [ ] Crear componentes organismos (2)
- [ ] Crear container
- [ ] Actualizar página
- [ ] Probar funcionalidad completa
- [ ] Verificar que no se rompió nada

### Detalles de la Junta

- [ ] Crear composables (3)
- [ ] Refactorizar ConvocatoriaJuntaSection
- [ ] Mejorar TipoJuntaSection
- [ ] Crear componentes atómicos (si necesario)
- [ ] Probar funcionalidad completa
- [ ] Verificar que no se rompió nada

---

## 🎯 Resultado Esperado

### Antes:

- ❌ `SeleccionPuntosAgenda.vue`: 474 líneas monolíticas
- ❌ `ConvocatoriaJuntaSection.vue`: 432 líneas con código duplicado
- ❌ Lógica mezclada con presentación
- ❌ Difícil de testear y mantener

### Después:

- ✅ Componentes atómicos reutilizables
- ✅ Lógica separada en composables
- ✅ Fácil de testear cada parte
- ✅ Sigue estilo de `flow-layout-juntas`
- ✅ Mantenible y escalable
- ✅ Responsabilidades claras

---

## 📌 Notas Importantes

1. **Mantener compatibilidad:** Los cambios no deben romper funcionalidad existente
2. **Testing:** Probar cada componente después de crearlo
3. **Tipos TypeScript:** Todos los props deben estar bien tipados
4. **Comentarios:** Documentar componentes complejos
5. **Estilo:** Seguir convenciones del proyecto (CSS variables, etc.)

---

## 🚦 Siguiente Paso

**Esperando aprobación del usuario para proceder con una de las 4 opciones.**

**Recomendación:** Opción 1 (Refactorización Completa) para máxima calidad y mantenibilidad a largo plazo.
