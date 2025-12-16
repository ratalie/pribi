# 📋 Plan de Componetización: 3 Flujos de Puntos de Agenda

## 🎯 Objetivo

Componetizar completamente los 3 flujos según **Atomic Design** (atoms, molecules, organisms) para mejorar:
- ✅ Reutilización de componentes
- ✅ Mantenibilidad del código
- ✅ Separación de responsabilidades
- ✅ Testabilidad

---

## 📦 Flujo 1: Pronunciamiento de Gestión Social

### 📊 Análisis Actual

**Componente Principal**: `CargaResultadosGestionManager.vue` (256 líneas)
- Maneja: Memoria Anual + Estados Financieros + Modal
- Lógica mezclada con presentación
- No está componetizado

### 🏗️ Estructura Objetivo

```
components/
├── organisms/
│   ├── MemoriaAnualSection.vue          ⭐ Nuevo
│   ├── EstadosFinancierosSection.vue    ⭐ Nuevo
│   └── AgregarEstadoFinancieroModal.vue ⭐ Nuevo
│
├── molecules/
│   ├── EstadoFinancieroCard.vue         ⭐ Nuevo
│   ├── FileUploadCard.vue              ⭐ Nuevo (wrapper reutilizable)
│   └── EstadoFinancieroToggle.vue      ⭐ Nuevo
│
└── atoms/
    ├── EstadoFinancieroTitle.vue        ⭐ Nuevo (opcional)
    └── EstadoFinancieroBadge.vue        ⭐ Nuevo (opcional)
```

### 📝 Plan de Componetización

#### **Paso 1: Crear Atoms (si es necesario)**
- `EstadoFinancieroTitle.vue` - Título del estado financiero
- `EstadoFinancieroBadge.vue` - Badge con contador de archivos

#### **Paso 2: Crear Molecules**

**2.1 `EstadoFinancieroCard.vue`**
- **Props:**
  - `estado: EstadoFinanciero`
  - `societyId: string`
- **Emits:**
  - `toggle: (estadoId: number | string)`
  - `delete: (estadoId: number | string)`
  - `file-uploaded: (estadoId: number | string, metadata: FileMetadata)`
  - `file-removed: (estadoId: number | string, fileId: string)`
- **Responsabilidades:**
  - Renderizar un estado financiero individual
  - Toggle enabled/disabled
  - Mostrar archivos subidos
  - Botón eliminar (si no es default)

**2.2 `FileUploadCard.vue` (Reutilizable)**
- **Props:**
  - `title: string`
  - `enabled: boolean`
  - `files: FileMetadata[]`
  - `societyId: string`
  - `clickMessage?: string`
  - `maxFiles?: number`
  - `maxSizeMB?: number`
- **Emits:**
  - `toggle: ()`
  - `file-uploaded: (metadata: FileMetadata)`
  - `file-removed: (fileId: string)`
- **Responsabilidades:**
  - Wrapper reutilizable para SimpleCardDropDown + FileUpload
  - Usado por Memoria Anual y Estados Financieros

#### **Paso 3: Crear Organisms**

**3.1 `MemoriaAnualSection.vue`**
- **Props:**
  - `societyId: string`
- **Composables:**
  - `usePronunciamientoStore()` - Acceso directo al store
- **Responsabilidades:**
  - Renderizar sección de Memoria Anual
  - Usar `FileUploadCard` para el upload
  - Manejar toggle de enabled/disabled

**3.2 `EstadosFinancierosSection.vue`**
- **Props:**
  - `societyId: string`
- **Composables:**
  - `usePronunciamientoStore()` - Acceso directo al store
- **Responsabilidades:**
  - Renderizar lista de estados financieros
  - Botón "Agregar otro estado financiero"
  - Usar `EstadoFinancieroCard` para cada estado
  - Manejar agregar/eliminar estados

**3.3 `AgregarEstadoFinancieroModal.vue`**
- **Props:**
  - `modelValue: boolean` (v-model)
- **Emits:**
  - `update:modelValue: (value: boolean)`
  - `submit: (nombre: string)`
- **Responsabilidades:**
  - Modal para agregar nuevo estado financiero
  - Input de nombre
  - Validación (nombre no vacío)

#### **Paso 4: Refactorizar `CargaResultadosGestionManager.vue`**
- **Antes:** 256 líneas con toda la lógica
- **Después:** ~50 líneas, solo orquesta organisms
- **Template:**
  ```vue
  <template>
    <div class="flex flex-col gap-10">
      <MemoriaAnualSection :society-id="societyId" />
      <EstadosFinancierosSection :society-id="societyId" />
    </div>
  </template>
  ```

---

## 📦 Flujo 2: Aplicación de Resultados

### 📊 Análisis Actual

**Componentes Principales:**
1. `AplicacionResultadosManager.vue` (330 líneas) - 4 secciones grandes
2. `utilidades-montos.vue` (478 líneas) - Estructura similar

**Problemas:**
- Componentes muy grandes
- Código duplicado entre `AplicacionResultadosManager` y `utilidades-montos`
- Secciones no reutilizables

### 🏗️ Estructura Objetivo

```
components/
├── organisms/
│   ├── ValoresPreliminaresSection.vue              ⭐ Nuevo
│   ├── CalculoUtilidadAntesReservaSection.vue     ⭐ Nuevo
│   ├── CalculoReservaLegalSection.vue             ⭐ Nuevo
│   └── ValoresUtilidadDistribuibleSection.vue      ⭐ Nuevo
│
├── molecules/
│   ├── FinancialInputGroup.vue                    ⭐ Nuevo (2 columnas)
│   ├── PorcentajeReservaLegalInput.vue            ⭐ Nuevo (input especial)
│   └── FinancialSectionCard.vue                   ⭐ Nuevo (wrapper)
│
└── atoms/
    └── FinancialLabel.vue                         ⭐ Nuevo (opcional)
```

### 📝 Plan de Componetización

#### **Paso 1: Crear Molecules**

**1.1 `FinancialInputGroup.vue` (Reutilizable)**
- **Props:**
  - `fields: Array<{ name: string, label: string, value: number, placeholder?: string, schema: ZodSchema }>`
  - `columns?: number` (default: 2)
- **Emits:**
  - `update:field: (name: string, value: number)`
- **Responsabilidades:**
  - Renderizar grupo de inputs financieros en grid
  - Reutilizable para todas las secciones

**1.2 `PorcentajeReservaLegalInput.vue`**
- **Props:**
  - `modelValue: number`
  - `label: string`
- **Emits:**
  - `update:modelValue: (value: number)`
- **Responsabilidades:**
  - Input especial con % al final
  - Validación y formato
  - Mensaje de ayuda

**1.3 `FinancialSectionCard.vue`**
- **Props:**
  - `title: string`
  - `anchorId?: string` (para scroll)
- **Slots:**
  - `default` - Contenido de la sección
- **Responsabilidades:**
  - Wrapper con título y SimpleCard
  - Manejo de anchor para scroll

#### **Paso 2: Crear Organisms**

**2.1 `ValoresPreliminaresSection.vue`**
- **Composables:**
  - `useAplicacionResultadosStore()` - Acceso directo
- **Responsabilidades:**
  - Renderizar 4 campos: Capital Social, Resultado Ejercicio, Utilidad/Pérdida Acumulada, Patrimonio Neto
  - Usar `FinancialInputGroup` o `FinancialSectionCard` + inputs individuales

**2.2 `CalculoUtilidadAntesReservaSection.vue`**
- **Composables:**
  - `useAplicacionResultadosStore()` - Acceso directo
- **Responsabilidades:**
  - Renderizar 2 campos: Diferencia Patrimonio-Capital, Utilidad Distribuible
  - Usar `FinancialSectionCard` + inputs

**2.3 `CalculoReservaLegalSection.vue`**
- **Composables:**
  - `useAplicacionResultadosStore()` - Acceso directo
- **Responsabilidades:**
  - Renderizar 5 campos: Capital Social Suscrito, Porcentaje Reserva Legal, Nueva Reserva Legal, Reserva Legal Actual, Monto Destinado
  - Usar `PorcentajeReservaLegalInput` para el porcentaje
  - Usar `FinancialSectionCard` + inputs

**2.4 `ValoresUtilidadDistribuibleSection.vue`**
- **Composables:**
  - `useAplicacionResultadosStore()` - Acceso directo
- **Responsabilidades:**
  - Renderizar 6 campos: Capital Social Final, Resultado Ejercicio Final, Utilidad No Distribuida, Utilidad/Pérdida Acumulada Final, Patrimonio Neto Final, Utilidad Distribuible Final, Utilidad a Distribuir
  - Usar `FinancialSectionCard` + inputs

#### **Paso 3: Refactorizar `AplicacionResultadosManager.vue`**
- **Antes:** 330 líneas con toda la lógica
- **Después:** ~50 líneas, solo orquesta organisms
- **Template:**
  ```vue
  <template>
    <div class="flex flex-col gap-10">
      <ValoresPreliminaresSection />
      <CalculoUtilidadAntesReservaSection />
      <CalculoReservaLegalSection />
      <ValoresUtilidadDistribuibleSection />
    </div>
  </template>
  ```

#### **Paso 4: Refactorizar `utilidades-montos.vue`**
- **Opción A:** Reutilizar los mismos organisms
- **Opción B:** Crear variantes si los campos son diferentes
- **Decisión:** Revisar si los campos son idénticos o diferentes

---

## 📦 Flujo 3: Delegación de Auditores Externos

### 📊 Análisis Actual

**Componente Principal**: `AuditoresExternosManager.vue` (124 líneas)
- Maneja: Selector de responsable + Input de nombre auditor
- Más pequeño pero también necesita componetización

### 🏗️ Estructura Objetivo

```
components/
├── organisms/
│   ├── ResponsableDesignacionSection.vue  ⭐ Nuevo
│   └── AuditorExternoSection.vue          ⭐ Nuevo
│
├── molecules/
│   └── ResponsableCard.vue                ⭐ Nuevo (radio button card)
│
└── atoms/
    └── (No necesario, muy simple)
```

### 📝 Plan de Componetización

#### **Paso 1: Crear Molecules**

**1.1 `ResponsableCard.vue`**
- **Props:**
  - `value: "JUNTA_DE_ACCIONISTAS" | "DIRECTORIO"`
  - `title: string`
  - `selected: boolean`
- **Emits:**
  - `select: (value: "JUNTA_DE_ACCIONISTAS" | "DIRECTORIO")`
- **Responsabilidades:**
  - Card clickeable con radio button visual
  - Estilos condicionales según selección
  - Checkmark cuando está seleccionado

#### **Paso 2: Crear Organisms**

**2.1 `ResponsableDesignacionSection.vue`**
- **Composables:**
  - `useAuditoresExternosStore()` - Acceso directo
- **Responsabilidades:**
  - Renderizar título "Responsables de la designación"
  - Renderizar 2 `ResponsableCard` (Junta / Directorio)
  - Manejar selección

**2.2 `AuditorExternoSection.vue`**
- **Props:**
  - `show: boolean` (v-if desde fuera)
- **Composables:**
  - `useAuditoresExternosStore()` - Acceso directo
- **Responsabilidades:**
  - Renderizar sección de Auditor Externo
  - Solo visible si responsable === "JUNTA_DE_ACCIONISTAS"
  - Input de nombre completo

#### **Paso 3: Refactorizar `AuditoresExternosManager.vue`**
- **Antes:** 124 líneas con lógica mezclada
- **Después:** ~30 líneas, solo orquesta organisms
- **Template:**
  ```vue
  <template>
    <div class="flex flex-col gap-10">
      <ResponsableDesignacionSection />
      <AuditorExternoSection 
        v-if="store.responsableDesignacion === 'JUNTA_DE_ACCIONISTAS'"
      />
    </div>
  </template>
  ```

---

## 📋 Checklist de Implementación

### Flujo 1: Pronunciamiento de Gestión Social
- [ ] Crear `FileUploadCard.vue` (molecule)
- [ ] Crear `EstadoFinancieroCard.vue` (molecule)
- [ ] Crear `MemoriaAnualSection.vue` (organism)
- [ ] Crear `EstadosFinancierosSection.vue` (organism)
- [ ] Crear `AgregarEstadoFinancieroModal.vue` (organism)
- [ ] Refactorizar `CargaResultadosGestionManager.vue`
- [ ] Actualizar imports en página `pronunciamiento.vue`
- [ ] Probar funcionalidad completa

### Flujo 2: Aplicación de Resultados
- [ ] Crear `FinancialInputGroup.vue` (molecule) - OPCIONAL
- [ ] Crear `PorcentajeReservaLegalInput.vue` (molecule)
- [ ] Crear `FinancialSectionCard.vue` (molecule)
- [ ] Crear `ValoresPreliminaresSection.vue` (organism)
- [ ] Crear `CalculoUtilidadAntesReservaSection.vue` (organism)
- [ ] Crear `CalculoReservaLegalSection.vue` (organism)
- [ ] Crear `ValoresUtilidadDistribuibleSection.vue` (organism)
- [ ] Refactorizar `AplicacionResultadosManager.vue`
- [ ] Revisar `utilidades-montos.vue` y decidir si reutilizar o crear variantes
- [ ] Actualizar imports en páginas
- [ ] Probar funcionalidad completa

### Flujo 3: Delegación de Auditores
- [ ] Crear `ResponsableCard.vue` (molecule)
- [ ] Crear `ResponsableDesignacionSection.vue` (organism)
- [ ] Crear `AuditorExternoSection.vue` (organism)
- [ ] Refactorizar `AuditoresExternosManager.vue`
- [ ] Actualizar imports en página
- [ ] Probar funcionalidad completa

---

## 🎯 Principios de Componetización

### ✅ Atoms
- Componentes más básicos e indivisibles
- No tienen lógica de negocio
- Ejemplos: Labels, Badges, Icons

### ✅ Molecules
- Combinación de atoms
- Tienen lógica de presentación básica
- Pueden tener props y emits
- Ejemplos: Input groups, Cards reutilizables, Toggles

### ✅ Organisms
- Combinación de molecules y atoms
- Tienen lógica de negocio (acceso a stores)
- Representan secciones completas de UI
- Ejemplos: Secciones de formulario, Listas complejas

### ✅ Containers (Páginas)
- Orquestan organisms
- Mínima lógica (solo composables de página)
- Ejemplos: `CargaResultadosGestionManager.vue`, `AplicacionResultadosManager.vue`

---

## 📊 Métricas de Éxito

### Antes vs Después

| Flujo | Componente Principal | Antes | Después | Reducción |
|-------|---------------------|-------|---------|----------|
| Pronunciamiento | `CargaResultadosGestionManager.vue` | 256 líneas | ~50 líneas | 80% |
| Aplicación | `AplicacionResultadosManager.vue` | 330 líneas | ~50 líneas | 85% |
| Auditores | `AuditoresExternosManager.vue` | 124 líneas | ~30 líneas | 76% |

### Beneficios
- ✅ Componentes reutilizables entre flujos
- ✅ Código más mantenible
- ✅ Fácil de testear (componentes pequeños)
- ✅ Separación clara de responsabilidades

---

## 🚀 Orden de Implementación Recomendado

1. **Flujo 3 (Auditores)** - Más simple, buen punto de partida
2. **Flujo 1 (Pronunciamiento)** - Complejidad media
3. **Flujo 2 (Aplicación)** - Más complejo, puede reutilizar patterns de los anteriores

---

**Documentación creada**: Diciembre 2024  
**Autor**: Cursor AI + Yull23



