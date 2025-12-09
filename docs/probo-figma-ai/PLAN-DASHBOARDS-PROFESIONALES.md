# 📊 PLAN COMPLETO: DASHBOARDS PROFESIONALES PROBO

**Dashboard de Sociedades y Dashboard de Juntas - Implementación Profesional**

---

## 🎯 OBJETIVO

Crear dos dashboards profesionales y diferenciados:

1. **Dashboard de Sociedades**: Vista general con métricas agregadas
2. **Dashboard de Juntas**: Vista detallada por sociedad con impacto de juntas

---

## 📋 REQUERIMIENTOS DEL USUARIO

### Dashboard de Sociedades
- ✅ Cuántas juntas tiene (total)
- ✅ Cuántas sociedades tienen
- ✅ Sección de cuánto se ha ahorrado (placeholder para cálculo futuro)
- ✅ Métricas generales de estado

### Dashboard de Juntas
- ✅ Más detallado
- ✅ Ver cómo está la sociedad
- ✅ Cómo las juntas afectan a cada sociedad por:
  - Aumento de capital
  - Nombramiento
  - Remoción
  - Mayoría absoluta
  - Estados finalización
  - Aplicación de utilidades
  - etc.

---

## 🎨 OPCIONES DE IMPLEMENTACIÓN

### **Opción 1: Dashboard Simple con Stats Cards (Recomendada para empezar)**

**Dashboard de Sociedades:**
- Header con título y botón "Crear Sociedad"
- 4-6 Stats Cards principales:
  - Total Sociedades
  - Total Juntas (suma de todas las juntas de todas las sociedades)
  - Sociedades Activas
  - Sociedades En Proceso
  - Juntas Finalizadas
  - Sección "Ahorro Estimado" (placeholder con "Próximamente")
- Lista rápida de sociedades recientes
- Acciones rápidas

**Dashboard de Juntas:**
- Selector de sociedad (dropdown)
- Stats Cards específicas de la sociedad seleccionada:
  - Total Juntas de la sociedad
  - Juntas por tipo (Aumento Capital, Nombramiento, Remoción, etc.)
  - Estado de juntas (Finalizadas, En Proceso, Borrador)
- Tabla de juntas con columnas: Fecha, Tipo, Estado, Impacto
- Sección de "Impacto en la Sociedad" con cards expandibles

**Ventajas:**
- ✅ Implementación rápida (1-2 días)
- ✅ Reutiliza componentes existentes
- ✅ Fácil de mantener
- ✅ Responsive

**Desventajas:**
- ⚠️ Menos visual que otras opciones
- ⚠️ No muestra gráficos

---

### **Opción 2: Dashboard con Gráficos y Visualizaciones**

**Dashboard de Sociedades:**
- Header profesional
- Stats Cards (4-6)
- **Gráfico de líneas**: Evolución de sociedades creadas (últimos 6 meses)
- **Gráfico de barras**: Distribución de juntas por tipo
- **Gráfico de dona**: Estado de sociedades (Activas, En Proceso, Finalizadas)
- Sección "Ahorro Estimado" con card destacada
- Tabla de sociedades con más juntas

**Dashboard de Juntas:**
- Selector de sociedad
- Stats Cards con trends
- **Timeline visual**: Historial de juntas de la sociedad
- **Gráfico de impacto**: Cómo cada junta afectó el capital, directores, etc.
- **Tabla comparativa**: Antes/Después de cada junta
- Cards expandibles por tipo de junta con detalles

**Ventajas:**
- ✅ Muy visual y profesional
- ✅ Fácil de entender tendencias
- ✅ Mejor UX para análisis

**Desventajas:**
- ⚠️ Requiere librería de gráficos (Chart.js, Recharts, etc.)
- ⚠️ Más tiempo de implementación (3-4 días)
- ⚠️ Más complejo de mantener

---

### **Opción 3: Dashboard Híbrido (Stats + Tablas Detalladas)**

**Dashboard de Sociedades:**
- Header con búsqueda y filtros
- Stats Cards (6 cards)
- **Sección "Top Sociedades"**: Tabla con las 5 sociedades con más juntas
- **Sección "Juntas Recientes"**: Tabla con últimas 10 juntas de todas las sociedades
- **Sección "Ahorro Estimado"**: Card grande con placeholder
- Filtros por estado, tipo, fecha

**Dashboard de Juntas:**
- Selector de sociedad + búsqueda
- Stats Cards por tipo de junta
- **Tabla principal**: Todas las juntas de la sociedad con:
  - Fecha
  - Tipo (Aumento Capital, Nombramiento, Remoción, Mayoría Absoluta, Utilidades)
  - Estado
  - Impacto (Capital antes/después, Directores antes/después, etc.)
  - Acciones (Ver detalle, Descargar documentos)
- **Sección "Impacto Acumulado"**: Cards mostrando:
  - Capital Social: S/ X → S/ Y (+Z%)
  - Directores: X → Y
  - Apoderados: X → Y
  - Última actualización

**Ventajas:**
- ✅ Balance entre visual y funcional
- ✅ Mucha información accesible
- ✅ Fácil de escanear

**Desventajas:**
- ⚠️ Puede ser denso en mobile
- ⚠️ Requiere buen diseño responsive

---

### **Opción 4: Dashboard Avanzado con Análisis Profundo**

**Dashboard de Sociedades:**
- Header con filtros avanzados
- Stats Cards con animaciones
- **Vista de Kanban**: Sociedades por estado (drag & drop)
- **Gráfico de calor**: Actividad de juntas por mes
- **Sección "Ahorro Estimado"**: 
  - Cálculo basado en horas ahorradas
  - Comparación con método tradicional
  - Proyección anual
- **Análisis predictivo**: Sociedades que necesitan atención
- Exportar reportes

**Dashboard de Juntas:**
- Selector de sociedad con vista previa
- **Vista de Timeline interactiva**: Ver todas las juntas en línea de tiempo
- **Análisis de impacto detallado**:
  - Gráfico de evolución de capital
  - Gráfico de cambios en directores/apoderados
  - Análisis de quórums y mayorías
- **Simulador**: "¿Qué pasaría si...?" para nuevas juntas
- **Comparación**: Comparar dos juntas lado a lado
- **Reportes personalizados**: Generar PDFs con análisis

**Ventajas:**
- ✅ Muy completo y profesional
- ✅ Funcionalidades avanzadas
- ✅ Diferenciador competitivo

**Desventajas:**
- ⚠️ Implementación compleja (1-2 semanas)
- ⚠️ Requiere más datos del backend
- ⚠️ Puede ser overwhelming para usuarios simples

---

## 🏗️ ARQUITECTURA PROPUESTA (Opción 1 - Base)

### Estructura de Archivos

```
app/
├── pages/
│   ├── registros/
│   │   └── sociedades/
│   │       └── dashboard.vue          # Dashboard de Sociedades
│   └── operaciones/
│       └── sociedades/
│           └── [societyId]/
│               └── junta-accionistas/
│                   └── dashboard.vue  # Dashboard de Juntas
│
├── components/
│   └── dashboard/
│       ├── DashboardHeader.vue        # Header reutilizable
│       ├── StatCard.vue               # Card de estadística
│       ├── StatCardWithTrend.vue      # Card con trend
│       ├── AhorroCard.vue             # Card especial para ahorro
│       ├── ImpactoCard.vue            # Card de impacto (juntas)
│       └── JuntaImpactTable.vue       # Tabla de impacto
│
├── composables/
│   ├── useSociedadesDashboard.ts      # Lógica dashboard sociedades
│   └── useJuntasDashboard.ts          # Lógica dashboard juntas
│
└── types/
    └── dashboard/
        ├── sociedad-dashboard.types.ts
        └── junta-dashboard.types.ts
```

---

## 📊 MÉTRICAS Y DATOS NECESARIOS

### Dashboard de Sociedades

**Stats Cards:**
1. **Total Sociedades**: `sociedades.length`
2. **Total Juntas**: Suma de todas las juntas de todas las sociedades
   - Necesita: Iterar sobre sociedades y contar juntas
3. **Sociedades Activas**: `sociedadesFinalizadas.length`
4. **Sociedades En Proceso**: `sociedadesEnProgreso.length`
5. **Juntas Finalizadas**: Suma de juntas finalizadas de todas las sociedades
6. **Ahorro Estimado**: Placeholder (futuro)

**Datos necesarios:**
- ✅ `useSociedadHistorialStore` - Ya existe
- ⚠️ Necesita: Método para obtener total de juntas (sumar de todas las sociedades)
- ⚠️ Necesita: Método para obtener juntas finalizadas (sumar de todas las sociedades)

### Dashboard de Juntas

**Stats Cards por Tipo:**
1. **Aumento de Capital**: Contar juntas con tipo "Aumento Capital"
2. **Nombramientos**: Contar juntas con tipo "Nombramiento"
3. **Remociones**: Contar juntas con tipo "Remoción"
4. **Mayoría Absoluta**: Contar juntas con tipo "Mayoría Absoluta"
5. **Aplicación Utilidades**: Contar juntas con tipo "Utilidades"
6. **En Proceso**: Juntas no finalizadas
7. **Finalizadas**: Juntas finalizadas

**Impacto por Junta:**
- Capital antes/después
- Directores antes/después
- Apoderados antes/después
- Acciones emitidas
- Estado de aplicación

**Datos necesarios:**
- ✅ `useJuntaHistorialStore` - Ya existe
- ⚠️ Necesita: Obtener detalles completos de cada junta (snapshot)
- ⚠️ Necesita: Calcular impacto (comparar antes/después)

---

## 🎨 DISEÑO VISUAL

### Dashboard de Sociedades

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
│  🏢 Dashboard de Sociedades        [+ Crear Sociedad]       │
│     Vista general de todas tus sociedades                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STATS CARDS (Grid 3 columnas)                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ Total    │ │ Total    │ │ Activas  │                   │
│  │ Socieda  │ │ Juntas   │ │          │                   │
│  │    45    │ │   128    │ │    38    │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ En Proce│ │ Finaliza │ │ Ahorro   │                   │
│  │    5    │ │   90    │ │ Estimado │                   │
│  │         │ │          │ │ Próximam │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
│                                                              │
│  SOCIEDADES RECIENTES                                        │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Razón Social │ Juntas │ Última Junta │ Estado       │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ Inversiones..│   12   │ 15 Nov 2024  │ ✅ Activa    │ │
│  │ Tech Sol...  │    8   │ 10 Nov 2024  │ ⏰ Proceso   │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard de Juntas

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
│  👑 Dashboard de Juntas de Accionistas                      │
│     Impacto y seguimiento de acuerdos societarios            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SELECTOR DE SOCIEDAD                                        │
│  [Dropdown: Selecciona sociedad...]                         │
│                                                              │
│  STATS CARDS POR TIPO (Grid 4 columnas)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ Aumento  │ │ Nombram. │ │ Remoción │ │ Mayoría  │     │
│  │ Capital  │ │          │ │          │ │ Absoluta │     │
│  │    5     │ │    3     │ │    2     │ │    1     │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│                                                              │
│  IMPACTO EN LA SOCIEDAD                                      │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Capital Social: S/ 1,000,000 → S/ 1,500,000 (+50%)  │ │
│  │ Directores: 3 → 5 (+2)                               │ │
│  │ Apoderados: 2 → 4 (+2)                               │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                              │
│  HISTORIAL DE JUNTAS                                         │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Fecha    │ Tipo           │ Estado │ Impacto         │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ 15 Nov   │ Aumento Capital │ ✅     │ +S/ 500K       │ │
│  │ 10 Nov   │ Nombramiento   │ ✅     │ +2 Directores  │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 PLAN DE IMPLEMENTACIÓN (Opción 1)

### Fase 1: Dashboard de Sociedades (Día 1-2)

1. **Crear componentes base:**
   - [ ] `DashboardHeader.vue`
   - [ ] `StatCard.vue`
   - [ ] `AhorroCard.vue`

2. **Crear composable:**
   - [ ] `useSociedadesDashboard.ts`
   - [ ] Método para calcular total de juntas
   - [ ] Método para calcular juntas finalizadas

3. **Actualizar página:**
   - [ ] `app/pages/registros/sociedades/dashboard.vue`
   - [ ] Implementar stats cards
   - [ ] Agregar sección de ahorro
   - [ ] Agregar tabla de sociedades recientes

### Fase 2: Dashboard de Juntas (Día 3-4)

1. **Crear componentes específicos:**
   - [ ] `StatCardWithTrend.vue`
   - [ ] `ImpactoCard.vue`
   - [ ] `JuntaImpactTable.vue`

2. **Crear composable:**
   - [ ] `useJuntasDashboard.ts`
   - [ ] Método para agrupar juntas por tipo
   - [ ] Método para calcular impacto

3. **Actualizar página:**
   - [ ] `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/dashboard.vue`
   - [ ] Implementar selector de sociedad
   - [ ] Implementar stats cards por tipo
   - [ ] Implementar sección de impacto
   - [ ] Implementar tabla de historial

### Fase 3: Mejoras y Refinamiento (Día 5)

1. **Testing:**
   - [ ] Probar con datos reales
   - [ ] Verificar responsive
   - [ ] Verificar estados vacíos

2. **Ajustes visuales:**
   - [ ] Aplicar tokens CSS PROBO
   - [ ] Ajustar espaciados
   - [ ] Agregar animaciones sutiles

---

## 📝 NOTAS IMPORTANTES

### Datos que necesitamos del Backend

1. **Para Dashboard de Sociedades:**
   - Endpoint para obtener total de juntas (suma de todas las sociedades)
   - O iterar sobre todas las sociedades y sumar

2. **Para Dashboard de Juntas:**
   - Endpoint para obtener detalles completos de una junta (snapshot)
   - Datos de "antes" y "después" para calcular impacto
   - Tipo de junta (Aumento Capital, Nombramiento, etc.)

### Placeholders

- **Ahorro Estimado**: Por ahora mostrar "Próximamente" o "En desarrollo"
- **Cálculo de Impacto**: Si no hay datos de "antes", mostrar solo "después"

---

## ✅ CHECKLIST FINAL

### Dashboard de Sociedades
- [ ] Header con título y botón crear
- [ ] 6 Stats Cards (Total Sociedades, Total Juntas, Activas, En Proceso, Finalizadas, Ahorro)
- [ ] Sección de sociedades recientes
- [ ] Responsive design
- [ ] Estados vacíos
- [ ] Loading states

### Dashboard de Juntas
- [ ] Selector de sociedad
- [ ] Stats Cards por tipo de junta
- [ ] Sección de impacto acumulado
- [ ] Tabla de historial con impacto
- [ ] Responsive design
- [ ] Estados vacíos
- [ ] Loading states

---

## 🎯 RECOMENDACIÓN

**Empezar con Opción 1** porque:
1. ✅ Es rápida de implementar
2. ✅ Reutiliza componentes existentes
3. ✅ Es fácil de mantener
4. ✅ Puede evolucionar a Opción 2 o 3 después

**Luego evolucionar a Opción 2** si se necesita más visualización.

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0.0



