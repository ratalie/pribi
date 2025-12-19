# 📋 Plan de Refactorización: Componetización de Aporte Dinerario y Capitalización de Créditos

## 🎯 Objetivo

Refactorizar ambos módulos para seguir la misma estructura de **Atomic Design** (atoms, molecules, organisms) que usan **Pronunciamiento de Gestión Social** y **Aplicación de Resultados**, mejorando:

- ✅ Reutilización de componentes
- ✅ Mantenibilidad del código
- ✅ Separación de responsabilidades
- ✅ Consistencia arquitectónica

---

## 📊 Análisis Actual

### ✅ Módulos de Referencia (Bien Estructurados)

#### **Pronunciamiento de Gestión Social**

```
components/
├── organisms/
│   ├── MemoriaAnualSection.vue          → Usa store directamente
│   ├── EstadosFinancierosSection.vue    → Usa store directamente
│   └── AgregarEstadoFinancieroModal.vue → Usa store directamente
├── molecules/
│   ├── EstadoFinancieroCard.vue         → Reutilizable, props + emits
│   └── FileUploadCard.vue               → Reutilizable, props + emits
```

#### **Aplicación de Resultados**

```
components/
├── organisms/
│   ├── ValoresPreliminaresSection.vue              → Usa store directamente
│   ├── CalculoUtilidadAntesReservaSection.vue     → Usa store directamente
│   ├── CalculoReservaLegalSection.vue             → Usa store directamente
│   └── ValoresUtilidadDistribuibleSection.vue      → Usa store directamente
├── molecules/
│   ├── FinancialSectionCard.vue                    → Reutilizable wrapper
│   └── PorcentajeReservaLegalInput.vue             → Input especializado
```

**Características clave:**

- ✅ Organisms usan stores directamente (no reciben props de datos)
- ✅ Molecules son reutilizables (solo props + emits)
- ✅ Las páginas solo orquestan organisms
- ✅ Separación clara de responsabilidades

---

### ⚠️ Aporte Dinerario (Actual - Necesita Refactorización)

```
components/
├── atoms/
│   ├── ErrorMessage.vue          ✅ OK
│   ├── LoadingState.vue          ✅ OK
│   └── ValorNominalBadge.vue     ✅ OK
├── molecules/
│   ├── AportanteModal.vue        ✅ OK (pero debería estar en organisms)
│   ├── AportantesHeader.vue      ✅ OK
│   ├── AportantesResumen.vue     ✅ OK
│   ├── AporteForm.vue            ✅ OK
│   ├── AporteModal.vue           ⚠️  Confusión: Modal puede ser molecule u organism
│   └── AportesTable.vue          ✅ OK (pero se usa en organism)
├── organisms/
│   ├── AportantesTable.vue       ⚠️  DUPLICACIÓN: Similar a molecules/AportesTable
│   └── AportesSection.vue        ✅ OK (wrapper, pero debería usar store directamente)
```

**Problemas identificados:**

1. ⚠️ `AportantesTable` (organisms) vs `AportesTable` (molecules) - confusión de nombres y ubicación
2. ⚠️ Organisms reciben props de datos en lugar de usar stores directamente
3. ⚠️ Las páginas importan y pasan props manualmente (debería orquestar organisms)
4. ⚠️ Modales están mezclados (algunos en molecules, otros deberían estar en organisms)

---

### ❌ Capitalización de Créditos (Sin Estructura)

```
components/  → ❌ NO EXISTE
```

**Problema:** No tiene estructura de componentes, todo está en composables y stores.

---

## 🏗️ Estructura Objetivo

### 📦 Aporte Dinerario

```
components/
├── atoms/
│   ├── ErrorMessage.vue              ✅ MANTENER
│   ├── LoadingState.vue              ✅ MANTENER
│   └── ValorNominalBadge.vue         ✅ MANTENER
│
├── molecules/
│   ├── AporteForm.vue                ✅ MANTENER (formulario reutilizable)
│   ├── AportantesHeader.vue          ✅ MANTENER
│   ├── AportantesResumen.vue         ✅ MANTENER
│   ├── AportanteRow.vue              ⭐ NUEVO (fila de tabla reutilizable)
│   ├── AporteRow.vue                 ⭐ NUEVO (fila de aporte en dropdown)
│   └── SectionCard.vue               ⭐ NUEVO (wrapper genérico, similar a FinancialSectionCard)
│
└── organisms/
    ├── AportantesSection.vue         ⭐ REFACTORIZAR (usar store directamente)
    │   ├── Usa: AportantesHeader, AportantesResumen
    │   ├── Usa: AportanteRow (molecule)
    │   └── Usa: AportanteModal (organism)
    │
    ├── AportesSection.vue            ⭐ REFACTORIZAR (usar store directamente)
    │   ├── Usa: AportesTable (molecule)
    │   ├── Usa: AporteRow (molecule)
    │   └── Usa: AporteModal (organism)
    │
    ├── AportanteModal.vue            ⭐ MOVER desde molecules
    └── AporteModal.vue               ⭐ MOVER desde molecules
```

### 📦 Capitalización de Créditos

```
components/
├── atoms/
│   ├── ErrorMessage.vue              ⭐ REUTILIZAR de aporte-dinerario
│   ├── LoadingState.vue              ⭐ REUTILIZAR de aporte-dinerario
│   └── ValorNominalBadge.vue         ⭐ REUTILIZAR de aporte-dinerario
│
├── molecules/
│   ├── AporteForm.vue                ⭐ REUTILIZAR (ya es genérico para ambos)
│   ├── AportantesHeader.vue          ⭐ REUTILIZAR (cambiar nombre genérico)
│   ├── AportantesResumen.vue         ⭐ REUTILIZAR (cambiar nombre genérico)
│   ├── AportanteRow.vue              ⭐ REUTILIZAR
│   ├── AporteRow.vue                 ⭐ REUTILIZAR
│   └── SectionCard.vue               ⭐ REUTILIZAR
│
└── organisms/
    ├── AcreedoresSection.vue         ⭐ NUEVO (idéntico a AportantesSection)
    │   ├── Usa: AportantesHeader, AportantesResumen (molecules compartidas)
    │   ├── Usa: AportanteRow (molecule compartida)
    │   └── Usa: AportanteModal (organism compartido)
    │
    ├── CapitalizacionesSection.vue   ⭐ NUEVO (idéntico a AportesSection)
    │   ├── Usa: AportesTable (molecule compartida)
    │   ├── Usa: AporteRow (molecule compartida)
    │   └── Usa: AporteModal (organism compartido)
    │
    ├── AportanteModal.vue            ⭐ REUTILIZAR (ya es genérico)
    └── AporteModal.vue               ⭐ REUTILIZAR (ya es genérico)
```

---

## 📝 Plan de Refactorización Detallado

### FASE 1: Refactorizar Aporte Dinerario

#### **Paso 1.1: Crear Molecules Reutilizables**

**1.1.1 `AportanteRow.vue` (NUEVO)**

- **Props:**
  - `aportante: Aportante`
  - `module: "CASH" | "CREDIT"`
  - `isContributor: boolean`
- **Emits:**
  - `toggle: (aportanteId: string)`
  - `edit: (aportanteId: string)`
  - `delete: (aportanteId: string)`
- **Responsabilidades:**
  - Renderizar una fila de la tabla de aportantes
  - Checkbox (deshabilitado si es NUEVO_APORTANTE)
  - Botones editar/eliminar (solo si es NUEVO_APORTANTE)
  - Extraer de `AportantesTable.vue` (organisms)

**1.1.2 `AporteRow.vue` (NUEVO)**

- **Props:**
  - `aporte: Aporte | Capitalizacion`
  - `accionistaId: string`
- **Emits:**
  - `edit: (accionistaId: string, aporteId: string)`
  - `delete: (aporteId: string)`
- **Responsabilidades:**
  - Renderizar una fila de aporte dentro del dropdown
  - Botones editar/eliminar
  - Extraer de `AportesTable.vue` (molecules)

**1.1.3 `SectionCard.vue` (NUEVO - Genérico)**

- **Props:**
  - `title: string`
  - `anchorId?: string`
- **Slots:**
  - `default` - Contenido
- **Responsabilidades:**
  - Wrapper genérico con SimpleCard
  - Similar a `FinancialSectionCard.vue` de aplicacion-resultados
  - Reutilizable para ambos módulos

#### **Paso 1.2: Refactorizar Organisms para Usar Stores Directamente**

**1.2.1 `AportantesSection.vue` (REFACTORIZAR)**

- **ANTES:**
  ```vue
  <AportantesTable
    :aportantes="aportantes"
    :is-loading="isLoading"
    :error="error"
    module="CASH"
    @toggle="toggleAportante"
    @delete="eliminarAportante"
  />
  ```
- **DESPUÉS:**
  ```vue
  <script setup>
    const { aportantes, isLoading, error, toggleAportante, eliminarAportante } =
      useAportantesPage();
    // Organism usa composable directamente, no recibe props
  </script>
  <template>
    <AportantesHeader />
    <ErrorMessage :message="error" />
    <LoadingState :is-loading="isLoading" />
    <AportantesTable
      :aportantes="aportantes"
      module="CASH"
      @toggle="toggleAportante"
      @delete="eliminarAportante"
    />
    <AportantesResumen />
    <AportanteModal />
  </template>
  ```
- **Responsabilidades:**
  - Usar `useAportantesPage()` directamente
  - Orquestar todos los componentes de la sección
  - Manejar estado del modal internamente

**1.2.2 `AportesSection.vue` (REFACTORIZAR)**

- **ANTES:** Recibe props de datos
- **DESPUÉS:** Usa `useAportesPage()` directamente
- **Responsabilidades:**
  - Usar `useAportesPage()` directamente
  - Orquestar tabla, modal, badges
  - Manejar estado del modal internamente

**1.2.3 Mover Modales a Organisms**

- `AportanteModal.vue` → `organisms/AportanteModal.vue`
- `AporteModal.vue` → `organisms/AporteModal.vue`
- **Razón:** Modales tienen lógica de negocio (usan stores), son más complejos que molecules

#### **Paso 1.3: Simplificar Páginas**

**1.3.1 `aportantes.vue` (REFACTORIZAR)**

- **ANTES:** ~68 líneas, importa múltiples componentes, pasa props
- **DESPUÉS:**
  ```vue
  <template>
    <SlotWrapper>
      <TitleH2 title="Aportantes" subtitle="..." />
      <AportantesSection />
    </SlotWrapper>
  </template>
  <script setup>
    useAportantesPage(); // Solo para inicialización si es necesaria
  </script>
  ```
- **Reducción:** ~80% de código

**1.3.2 `aportes.vue` (REFACTORIZAR)**

- **ANTES:** ~73 líneas, importa múltiples componentes, pasa props
- **DESPUÉS:**
  ```vue
  <template>
    <SlotWrapper>
      <TitleH2 title="Aportes" subtitle="..." />
      <AportesSection />
    </SlotWrapper>
  </template>
  <script setup>
    useAportesPage(); // Solo para inicialización si es necesaria
  </script>
  ```
- **Reducción:** ~80% de código

---

### FASE 2: Crear Estructura para Capitalización de Créditos

#### **Paso 2.1: Reutilizar Components de Aporte Dinerario**

**2.1.1 Crear Carpeta `components/`**

```
components/
├── atoms/        → Links simbólicos o imports directos
├── molecules/    → Links simbólicos o imports directos
└── organisms/    → Componentes específicos (wrappers)
```

**2.1.2 Crear Organisms Específicos**

**`AcreedoresSection.vue` (NUEVO)**

- **Estructura idéntica a `AportantesSection.vue`**
- **Cambios:**
  - Usa `useAcreedoresPage()` en lugar de `useAportantesPage()`
  - Pasa `module="CREDIT"` a componentes compartidos
  - Importa molecules de `../aporte-dinerario/components/molecules/`

**`CapitalizacionesSection.vue` (NUEVO)**

- **Estructura idéntica a `AportesSection.vue`**
- **Cambios:**
  - Usa `useCapitalizacionesPage()` en lugar de `useAportesPage()`
  - Importa molecules de `../aporte-dinerario/components/molecules/`
  - Usa `AporteModal` y `AporteForm` (ya son genéricos)

#### **Paso 2.2: Crear Páginas Simplificadas**

**2.2.1 `acreedores.vue` (REFACTORIZAR)**

- **ANTES:** No existe estructura de componentes
- **DESPUÉS:**
  ```vue
  <template>
    <SlotWrapper>
      <TitleH2 title="Acreedores" subtitle="..." />
      <AcreedoresSection />
    </SlotWrapper>
  </template>
  <script setup>
    useAcreedoresPage();
  </script>
  ```

**2.2.2 `creditos.vue` (REFACTORIZAR)**

- **ANTES:** Usa componentes directamente, pasa props
- **DESPUÉS:**
  ```vue
  <template>
    <SlotWrapper>
      <TitleH2 title="Capitalizaciones" subtitle="..." />
      <CapitalizacionesSection />
    </SlotWrapper>
  </template>
  <script setup>
    useCapitalizacionesPage();
  </script>
  ```

---

### FASE 3: Optimización y Compartir Components

#### **Paso 3.1: Crear Carpeta Compartida (Opcional)**

Si hay mucha duplicación, crear:

```
components/
└── shared/
    ├── atoms/
    ├── molecules/
    └── organisms/
```

Y ambos módulos importan desde `shared/`.

**Alternativa (Recomendada):** Mantener estructura actual pero con imports claros:

- Capitalización importa desde `../aporte-dinerario/components/`
- Documentar claramente qué se comparte y qué es específico

---

## 🎯 Principios de Refactorización

### ✅ Atoms

- **Características:**
  - Componentes mínimos, sin lógica de negocio
  - Sin acceso a stores
  - Props simples + emits básicos
  - Ejemplos: Badges, Labels, Icons, ErrorMessage, LoadingState

### ✅ Molecules

- **Características:**
  - Combinación de atoms
  - Props + emits (no stores)
  - Reutilizables entre módulos
  - Ejemplos: Forms, Cards, Input groups, Table rows

### ✅ Organisms

- **Características:**
  - Combinación de molecules + atoms
  - **Usan stores directamente** (no reciben props de datos)
  - Representan secciones completas
  - Ejemplos: Secciones de formulario, Tablas completas, Modales complejos

### ✅ Pages

- **Características:**
  - Solo orquestan organisms
  - Mínima lógica (solo composables de inicialización si es necesario)
  - ~10-20 líneas máximo

---

## 📊 Métricas de Éxito

### Antes vs Después

| Aspecto                         | Antes      | Después    | Mejora                     |
| ------------------------------- | ---------- | ---------- | -------------------------- |
| **Páginas (líneas)**            | ~70 líneas | ~15 líneas | 78% reducción              |
| **Organisms con props**         | ❌ Sí      | ✅ No      | Mejor separación           |
| **Reutilización entre módulos** | ❌ No      | ✅ Sí      | Mayor reutilización        |
| **Consistencia arquitectónica** | ⚠️ Media   | ✅ Alta    | Alineado con otros módulos |

---

## 🚀 Orden de Implementación Recomendado

### FASE 1: Aporte Dinerario (Base)

1. ✅ Crear molecules reutilizables (`AportanteRow`, `AporteRow`, `SectionCard`)
2. ✅ Refactorizar `AportantesSection` (usar store directamente)
3. ✅ Refactorizar `AportesSection` (usar store directamente)
4. ✅ Mover modales a organisms
5. ✅ Simplificar páginas (`aportantes.vue`, `aportes.vue`)

### FASE 2: Capitalización de Créditos (Reutilizar)

1. ✅ Crear estructura de carpetas
2. ✅ Crear `AcreedoresSection` (reutilizar molecules de aporte-dinerario)
3. ✅ Crear `CapitalizacionesSection` (reutilizar molecules de aporte-dinerario)
4. ✅ Refactorizar páginas (`acreedores.vue`, `creditos.vue`)

### FASE 3: Optimización (Opcional)

1. ⚪ Evaluar si crear carpeta `shared/`
2. ⚪ Documentar qué se comparte y qué es específico
3. ⚪ Optimizar imports si es necesario

---

## ⚠️ ¿Debo Preocuparme?

### ❌ NO, No Debes Preocuparte

**Razones:**

1. **✅ Refactorización No Rompe Funcionalidad**

   - Solo reorganiza código existente
   - No cambia la lógica de negocio
   - Los tests siguen funcionando (si existen)

2. **✅ Mejora la Mantenibilidad**

   - Código más organizado = más fácil de mantener
   - Menos duplicación = menos bugs
   - Más reutilización = menos trabajo futuro

3. **✅ Alineación con Estándares**

   - Sigue el mismo patrón que módulos exitosos
   - Facilita onboarding de nuevos desarrolladores
   - Consistencia en toda la aplicación

4. **✅ Incremental**
   - Se puede hacer paso a paso
   - Cada fase es independiente
   - Se puede probar después de cada fase

### ✅ Beneficios a Largo Plazo

- **Mantenibilidad:** Cambios futuros más fáciles
- **Escalabilidad:** Fácil agregar nuevas funcionalidades
- **Testing:** Componentes más pequeños = más fáciles de testear
- **Onboarding:** Nueva gente entiende más rápido
- **Reutilización:** Componentes compartidos = menos código duplicado

---

## 📋 Checklist de Implementación

### FASE 1: Aporte Dinerario

- [ ] Crear `molecules/AportanteRow.vue`
- [ ] Crear `molecules/AporteRow.vue`
- [ ] Crear `molecules/SectionCard.vue`
- [ ] Refactorizar `organisms/AportantesSection.vue`
- [ ] Refactorizar `organisms/AportesSection.vue`
- [ ] Mover `AportanteModal.vue` a organisms
- [ ] Mover `AporteModal.vue` a organisms
- [ ] Simplificar `pages/aportantes.vue`
- [ ] Simplificar `pages/aportes.vue`
- [ ] Probar funcionalidad completa
- [ ] Verificar que no hay regresiones

### FASE 2: Capitalización de Créditos

- [ ] Crear carpeta `components/`
- [ ] Crear `organisms/AcreedoresSection.vue`
- [ ] Crear `organisms/CapitalizacionesSection.vue`
- [ ] Refactorizar `pages/acreedores.vue`
- [ ] Refactorizar `pages/creditos.vue`
- [ ] Probar funcionalidad completa
- [ ] Verificar que comparte components correctamente

### FASE 3: Optimización (Opcional)

- [ ] Evaluar necesidad de carpeta `shared/`
- [ ] Documentar estructura final
- [ ] Actualizar README si es necesario

---

## 📚 Referencias

- `docs/juntas/gestion-social/PLAN-COMPONETIZACION-3-FLUJOS.md` - Plan original de componetización
- `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/aplicacion-resultados/` - Ejemplo de buena estructura
- `app/core/presentation/operaciones/junta-accionistas/pasos/puntos-agenda/pronunciamiento-gestion/` - Ejemplo de buena estructura

---

**Última actualización**: 2024-12-18  
**Estado**: 📋 PLAN COMPLETO - Listo para implementación  
**Prioridad**: 🟡 Media (Mejora arquitectónica, no bloqueante)
