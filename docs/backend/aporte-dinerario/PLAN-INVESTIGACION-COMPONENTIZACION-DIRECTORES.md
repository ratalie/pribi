# 📋 Plan de Investigación: Componentización de Nombramiento de Directores

## 🎯 Objetivo

Investigar el estado actual de componentización de **Nombramiento de Directores** y **Nombramiento de Nuevo Directorio** para determinar qué falta para alcanzar el mismo nivel de Atomic Design que tienen los módulos de referencia (Aplicación de Resultados, Pronunciamiento de Gestión, Aporte Dinerario).

---

## 📊 Módulos a Investigar

### 1. **Nombramiento de Directores** (`nombramiento-directores`)

- Ubicación: `app/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores`
- Páginas: `nombramiento.vue`, `presidente.vue`, `votacion.vue`, `cantidad.vue`, `resumen.vue`, `votacion-cantidad.vue`

### 2. **Nombramiento de Nuevo Directorio** (`nombramiento-directorio`)

- Ubicación: `app/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directorio` (composables)
- Páginas: `index.vue`, `directores.vue`, `presidente.vue`, `configuracion.vue`, `designacion.vue`, `votacion.vue`, `resumen.vue`, `votacion-configuracion.vue`

---

## ✅ Módulos de Referencia (Nivel Objetivo)

### **Aplicación de Resultados**

```
components/
├── molecules/
│   ├── FinancialSectionCard.vue
│   └── PorcentajeReservaLegalInput.vue
└── organisms/
    ├── CalculoReservaLegalSection.vue
    ├── CalculoUtilidadAntesReservaSection.vue
    ├── ValoresPreliminaresSection.vue
    └── ValoresUtilidadDistribuibleSection.vue

AplicacionResultadosManager.vue (solo orquesta organisms, ~44 líneas)
```

### **Pronunciamiento de Gestión**

```
components/
├── molecules/
│   ├── EstadoFinancieroCard.vue
│   └── FileUploadCard.vue
└── organisms/
    ├── AgregarEstadoFinancieroModal.vue
    ├── EstadosFinancierosSection.vue
    └── MemoriaAnualSection.vue

CargaResultadosGestionManager.vue (solo orquesta organisms, ~30 líneas)
```

### **Aporte Dinerario** (Recién Refactorizado)

```
components/
├── atoms/
│   ├── ErrorMessage.vue
│   ├── LoadingState.vue
│   └── ValorNominalBadge.vue
├── molecules/
│   ├── AportantesHeader.vue
│   ├── AportantesResumen.vue
│   ├── AporteForm.vue
│   ├── AportesTable.vue
│   └── SectionCard.vue
└── organisms/
    ├── AportanteModal.vue
    ├── AportantesSection.vue
    ├── AportantesTable.vue
    ├── AporteModal.vue
    └── AportesSection.vue

aportantes.vue (solo orquesta organism, ~20 líneas)
aportes.vue (solo orquesta organism, ~30 líneas)
```

---

## 🔍 Checklist de Investigación

### **FASE 1: Análisis de Estructura Actual**

#### **1.1 Nombramiento de Directores (`nombramiento-directores`)**

- [ ] **Ubicación de componentes:**

  - [ ] ¿Dónde están ubicados los componentes? (`app/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/components`)
  - [ ] ¿Existe carpeta `components/`?
  - [ ] ¿Existen subcarpetas `atoms/`, `molecules/`, `organisms/`?

- [ ] **Componentes existentes:**

  - [ ] `DesignarDirectorModal.vue` - ¿Dónde está? ¿Es molecule u organism?
  - [ ] `DesignarSuplenteAlternoModal.vue` - ¿Dónde está? ¿Es molecule u organism?
  - [ ] Componentes de votación (`votacion/`):
    - [ ] `MetodoVotacionDirectorio.vue`
    - [ ] `UnanimidadVotacionDirectorio.vue`
    - [ ] `MayoriaVotacionDirectorio.vue`
    - [ ] `DebugVotacionDirectores.vue`

- [ ] **Páginas:**

  - [ ] `nombramiento.vue` - ¿Cuántas líneas tiene? ¿Tiene lógica compleja o solo orquesta?
  - [ ] `presidente.vue` - ¿Cuántas líneas? ¿Estructura?
  - [ ] `votacion.vue` - ¿Cuántas líneas? ¿Estructura?
  - [ ] `cantidad.vue` - ¿Cuántas líneas? ¿Estructura?
  - [ ] `resumen.vue` - ¿Cuántas líneas? ¿Estructura?

- [ ] **Composables y Stores:**
  - [ ] ¿Existe `useNombramientoDirectoresPage.ts`? ¿Qué retorna?
  - [ ] ¿Existe store? ¿Dónde está ubicado?
  - [ ] ¿Los organisms/pages usan el composable directamente o reciben props?

#### **1.2 Nombramiento de Nuevo Directorio (`nombramiento-directorio`)**

- [ ] **Ubicación de componentes:**

  - [ ] ¿Dónde están ubicados los componentes?
  - [ ] ¿Existe carpeta `components/`?
  - [ ] ¿Existen subcarpetas `atoms/`, `molecules/`, `organisms/`?

- [ ] **Componentes existentes:**

  - [ ] ¿Hay componentes visuales o solo composables/stores?
  - [ ] ¿Existen modales, tablas, formularios?

- [ ] **Páginas:**

  - [ ] `index.vue` - ¿Cuántas líneas? ¿Estructura?
  - [ ] `directores.vue` - ¿Cuántas líneas? ¿Estructura?
  - [ ] `presidente.vue` - ¿Cuántas líneas? ¿Estructura?
  - [ ] `configuracion.vue` - ¿Cuántas líneas? ¿Estructura?
  - [ ] `designacion.vue` - ¿Cuántas líneas? ¿Estructura?
  - [ ] `votacion.vue` - ¿Cuántas líneas? ¿Estructura?
  - [ ] `resumen.vue` - ¿Cuántas líneas? ¿Estructura?

- [ ] **Composables y Stores:**
  - [ ] ¿Existe composable de página? ¿Qué retorna?
  - [ ] ¿Existe store? ¿Dónde está ubicado?
  - [ ] ¿Los pages usan el composable directamente o tienen lógica inline?

---

### **FASE 2: Análisis Comparativo**

#### **2.1 Comparación con Módulos de Referencia**

Para cada módulo (Directores y Nuevo Directorio), comparar:

- [ ] **Estructura de carpetas:**

  - [ ] ¿Tiene `components/atoms/`? ❌ Falta / ✅ Existe / ⚠️ Parcial
  - [ ] ¿Tiene `components/molecules/`? ❌ Falta / ✅ Existe / ⚠️ Parcial
  - [ ] ¿Tiene `components/organisms/`? ❌ Falta / ✅ Existe / ⚠️ Parcial

- [ ] **Separación de responsabilidades:**

  - [ ] ¿Pages solo orquestan organisms? ❌ No / ✅ Sí / ⚠️ Parcial
  - [ ] ¿Organisms usan composables/stores directamente? ❌ No / ✅ Sí / ⚠️ Parcial
  - [ ] ¿Molecules reciben props/emits? ❌ No / ✅ Sí / ⚠️ Parcial
  - [ ] ¿Atoms son componentes mínimos sin lógica? ❌ No / ✅ Sí / ⚠️ Parcial

- [ ] **Tamaño de páginas:**

  - [ ] ¿Páginas < 50 líneas? ❌ No (indicar tamaño) / ✅ Sí
  - [ ] ¿Páginas tienen lógica compleja? ❌ Sí / ✅ No

- [ ] **Reutilización:**
  - [ ] ¿Hay duplicación de código entre vistas? ❌ Sí / ✅ No
  - [ ] ¿Componentes son reutilizables? ❌ No / ✅ Sí / ⚠️ Parcial

---

### **FASE 3: Identificación de Gaps**

#### **3.1 Componentes Faltantes**

- [ ] **Atoms faltantes:**

  - [ ] `ErrorMessage.vue` (si no existe)
  - [ ] `LoadingState.vue` (si no existe)
  - [ ] Otros componentes atómicos necesarios

- [ ] **Molecules faltantes:**

  - [ ] Cards de información (Cantidad Directores, Duración, Fechas)
  - [ ] Headers de sección (con botones "Designar")
  - [ ] Filas de tabla (DirectorRow, SuplenteRow)
  - [ ] Formularios reutilizables

- [ ] **Organisms faltantes:**
  - [ ] `DirectoresTitularesSection.vue` (para la sección completa de titulares)
  - [ ] `DirectoresSuplentesAlternosSection.vue` (para la sección completa de suplentes/alternos)
  - [ ] `InformacionDirectorioSection.vue` (para las cards de información)
  - [ ] Modales ya existen pero ¿están en organisms?

#### **3.2 Refactorización Necesaria**

- [ ] **Páginas que necesitan refactorización:**

  - [ ] `nombramiento.vue` - Actualmente ~828 líneas → Objetivo: < 50 líneas
  - [ ] Otras páginas que excedan 50 líneas

- [ ] **Lógica a mover:**
  - [ ] Mapeo de datos (debería estar en composables)
  - [ ] Manejo de modales (debería estar en organisms)
  - [ ] Configuración de tablas/columnas (debería estar en molecules/organisms)
  - [ ] Validaciones (debería estar en composables)

---

## 📝 Resultado Esperado

### **Documento Final de Investigación**

El plan debe resultar en un documento que incluya:

1. **Estado Actual:**

   - Estructura de carpetas actual
   - Componentes existentes (ubicación y tipo)
   - Tamaño de páginas
   - Relación entre components, composables, stores, pages

2. **Gaps Identificados:**

   - Componentes faltantes (atoms, molecules, organisms)
   - Páginas que necesitan refactorización
   - Lógica que debe moverse a composables/organisms

3. **Comparación con Referencia:**

   - Tabla comparativa: Directores vs Aplicación Resultados
   - Tabla comparativa: Nuevo Directorio vs Pronunciamiento Gestión
   - Gaps específicos por módulo

4. **Recomendaciones:**
   - Prioridad de refactorización (¿cuál módulo primero?)
   - Orden sugerido de implementación
   - Componentes que pueden reutilizarse entre módulos

---

## 🎯 Métricas de Éxito

- ✅ Páginas < 50 líneas (solo orquestan)
- ✅ Organisms usan composables directamente (no reciben props de datos)
- ✅ Molecules reciben props/emits (son reutilizables)
- ✅ Atoms sin lógica de negocio
- ✅ Estructura de carpetas clara (atoms/molecules/organisms)
- ✅ Consistencia con módulos de referencia

---

## 📋 Checklist de Ejecución

- [ ] **Paso 1:** Explorar estructura de `nombramiento-directores`
- [ ] **Paso 2:** Explorar estructura de `nombramiento-directorio`
- [ ] **Paso 3:** Leer páginas principales y medir tamaño
- [ ] **Paso 4:** Identificar componentes existentes y su ubicación
- [ ] **Paso 5:** Comparar con módulos de referencia
- [ ] **Paso 6:** Documentar gaps
- [ ] **Paso 7:** Crear documento final con recomendaciones

---

## ⚠️ Notas

- **Nombramiento de Directores** tiene un archivo `nombramiento.vue` de ~828 líneas → **crítico refactorizar**
- Los componentes de votación ya están en subcarpeta `votacion/` → buena práctica
- Modales existen pero ubicación debe verificarse (¿molecules u organisms?)
- Hay dos módulos diferentes:
  - `nombramiento-directores`: Designación de directores individuales (puede reemplazar directores existentes)
  - `nombramiento-directorio`: Nombramiento de nuevo directorio completo (reemplaza todo el directorio)

## 🔍 Hallazgos Iniciales

### **Nombramiento de Directores** (`nombramiento-directores`)

**Estructura Actual:**

```
components/
├── DesignarDirectorModal.vue (¿molecule u organism?)
├── DesignarSuplenteAlternoModal.vue (¿molecule u organism?)
└── votacion/
    ├── MetodoVotacionDirectorio.vue
    ├── UnanimidadVotacionDirectorio.vue
    ├── MayoriaVotacionDirectorio.vue
    └── DebugVotacionDirectores.vue
```

**Problemas Identificados:**

- ❌ NO tiene carpetas `atoms/`, `molecules/`, `organisms/`
- ❌ Página `nombramiento.vue` tiene ~828 líneas (debe ser < 50)
- ⚠️ Modales están en `components/` pero no clasificados
- ✅ Componentes de votación están bien organizados en subcarpeta
- ✅ Existe composable `useNombramientoDirectoresPage()` que retorna datos
- ⚠️ Página tiene lógica compleja inline (mapeo, validaciones, manejo de modales)

### **Nombramiento de Nuevo Directorio** (`nombramiento-directorio`)

**Estructura Actual:**

- ⚠️ Solo tiene composables (`useDirectorioConfigStore.ts`)
- ❌ NO tiene carpeta `components/`
- ⚠️ Páginas parecen tener estructura básica pero falta investigar tamaño y lógica

---
