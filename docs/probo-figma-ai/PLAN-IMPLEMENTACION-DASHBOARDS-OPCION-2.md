# 📊 PLAN DE IMPLEMENTACIÓN: DASHBOARDS CON GRÁFICOS (Opción 2)

**Dashboard de Sociedades y Dashboard de Juntas con Visualizaciones Profesionales**

---

## ✅ VERIFICACIÓN DE RECURSOS

### Componentes Disponibles ✅

1. **@unovis/vue** ✅ Instalado (v1.6.2)
2. **@unovis/ts** ✅ Instalado (v1.6.2)
3. **Componentes Chart de shadcn-vue** ✅ Instalados:
   - `ChartContainer.vue`
   - `ChartTooltipContent.vue`
   - `ChartLegendContent.vue`
   - `ChartStyle.vue`
   - `utils.ts` (componentToString)
   - `index.ts` (exports)

### Componentes Unovis Disponibles ✅

- ✅ `VisXYContainer` - Contenedor para gráficos XY
- ✅ `VisSingleContainer` - Contenedor para gráficos simples
- ✅ `VisGroupedBar` - Barras agrupadas
- ✅ `VisLine` - Líneas
- ✅ `VisDonut` - Gráfico de dona/pie
- ✅ `VisAxis` - Ejes
- ✅ `VisCrosshair` (ChartCrosshair) - Línea cruzada
- ✅ `VisTooltip` (ChartTooltip) - Tooltip

### Ejemplo de Uso Existente ✅

Ya están usando charts en `RepositoryDashboard.vue` con:
- Gráfico de barras agrupadas (Documentos por Mes)
- Gráfico de dona (Documentos por Tipo)
- Gráfico de líneas (Actividad Semanal)

**Conclusión: ✅ TODO LISTO PARA IMPLEMENTAR OPCIÓN 2**

---

## 🎯 DASHBOARD DE SOCIEDADES

### Estructura Visual

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
│  GRÁFICO 1: Evolución de Sociedades (Línea)                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [Gráfico de línea: Sociedades creadas últimos 6 meses]│ │
│  └──────────────────────────────────────────────────────┘ │
│                                                              │
│  GRÁFICO 2: Distribución de Juntas por Tipo (Dona)         │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [Gráfico de dona: Aumento Capital, Nombramiento, etc]│ │
│  └──────────────────────────────────────────────────────┘ │
│                                                              │
│  GRÁFICO 3: Estado de Sociedades (Barras Agrupadas)         │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [Gráfico de barras: Activas, En Proceso, Finalizadas]│ │
│  └──────────────────────────────────────────────────────┘ │
│                                                              │
│  TABLA: Top 5 Sociedades con Más Juntas                     │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Razón Social │ Juntas │ Última Junta │ Estado       │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ Inversiones..│   12   │ 15 Nov 2024  │ ✅ Activa    │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Gráficos a Implementar

#### 1. Gráfico de Línea: Evolución de Sociedades

**Datos necesarios:**
```typescript
interface EvolucionSociedades {
  mes: string; // "Ene 2024", "Feb 2024", etc.
  creadas: number;
  finalizadas: number;
}
```

**Componente:**
```vue
<ChartContainer :config="lineChartConfig" class="min-h-[300px] w-full">
  <VisXYContainer :data="evolucionSociedades">
    <VisAxis type="x" :x="(d) => d.mes" />
    <VisAxis type="y" />
    <VisLine
      :x="(d) => d.mes"
      :y="(d) => d.creadas"
      :color="lineChartConfig.creadas.color"
    />
    <VisLine
      :x="(d) => d.mes"
      :y="(d) => d.finalizadas"
      :color="lineChartConfig.finalizadas.color"
    />
    <ChartTooltip />
    <ChartCrosshair :template="componentToString(lineChartConfig, ChartTooltipContent)" />
  </VisXYContainer>
</ChartContainer>
```

#### 2. Gráfico de Dona: Distribución de Juntas por Tipo

**Datos necesarios:**
```typescript
interface JuntasPorTipo {
  tipo: string; // "Aumento Capital", "Nombramiento", etc.
  cantidad: number;
  porcentaje: number;
}
```

**Componente:**
```vue
<ChartContainer :config="donutChartConfig" class="w-full h-[300px]">
  <VisSingleContainer :data="juntasPorTipo">
    <VisDonut
      :value="(d) => d.cantidad"
      :arc-width="30"
      :pad-angle="2"
      :color="(d) => donutChartConfig[d.tipo]?.color || '#3C28A4'"
    />
  </VisSingleContainer>
  <ChartLegendContent />
</ChartContainer>
```

#### 3. Gráfico de Barras: Estado de Sociedades

**Datos necesarios:**
```typescript
interface EstadoSociedades {
  mes: string;
  activas: number;
  enProceso: number;
  finalizadas: number;
}
```

**Componente:**
```vue
<ChartContainer :config="barChartConfig" class="min-h-[300px] w-full">
  <VisXYContainer :data="estadoSociedades">
    <VisAxis type="x" :x="(d) => d.mes" />
    <VisAxis type="y" />
    <VisGroupedBar
      :x="(d) => d.mes"
      :y="[(d) => d.activas, (d) => d.enProceso, (d) => d.finalizadas]"
      :color="[
        barChartConfig.activas.color,
        barChartConfig.enProceso.color,
        barChartConfig.finalizadas.color
      ]"
    />
    <ChartTooltip />
    <ChartCrosshair :template="componentToString(barChartConfig, ChartTooltipContent)" />
  </VisXYContainer>
  <ChartLegendContent />
</ChartContainer>
```

---

## 🎯 DASHBOARD DE JUNTAS

### Estructura Visual

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
│  GRÁFICO 1: Timeline de Juntas (Línea con puntos)           │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [Timeline: Fechas de juntas en el tiempo]             │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                              │
│  GRÁFICO 2: Impacto en Capital Social (Línea)              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [Gráfico: Capital antes/después de cada junta]        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                              │
│  GRÁFICO 3: Cambios en Directores/Apoderados (Barras)      │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [Gráfico: Directores y Apoderados antes/después]      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                              │
│  SECCIÓN: Impacto Acumulado (Cards)                        │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Capital: S/ 1M → S/ 1.5M (+50%)                      │ │
│  │ Directores: 3 → 5 (+2)                               │ │
│  │ Apoderados: 2 → 4 (+2)                               │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                              │
│  TABLA: Historial de Juntas                                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Fecha    │ Tipo           │ Estado │ Impacto         │ │
│  ├──────────────────────────────────────────────────────┤ │
│  │ 15 Nov   │ Aumento Capital │ ✅     │ +S/ 500K       │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Gráficos a Implementar

#### 1. Timeline de Juntas (Línea con puntos)

**Datos necesarios:**
```typescript
interface TimelineJuntas {
  fecha: Date;
  tipo: string;
  estado: string;
  monto?: number; // Para aportes dinerarios
}
```

**Componente:**
```vue
<ChartContainer :config="timelineConfig" class="min-h-[300px] w-full">
  <VisXYContainer :data="timelineJuntas">
    <VisAxis type="x" :x="(d) => d.fecha" />
    <VisAxis type="y" />
    <VisLine
      :x="(d) => d.fecha"
      :y="(d) => 1" // Línea base
      :color="timelineConfig.base.color"
    />
    <!-- Puntos por tipo de junta -->
    <VisScatter
      :x="(d) => d.fecha"
      :y="(d) => 1"
      :color="(d) => timelineConfig[d.tipo]?.color"
      :size="20"
    />
    <ChartTooltip />
    <ChartCrosshair :template="componentToString(timelineConfig, ChartTooltipContent)" />
  </VisXYContainer>
</ChartContainer>
```

#### 2. Impacto en Capital Social (Línea)

**Datos necesarios:**
```typescript
interface ImpactoCapital {
  fecha: Date;
  capitalAntes: number;
  capitalDespues: number;
  junta: string; // Nombre/tipo de junta
}
```

**Componente:**
```vue
<ChartContainer :config="capitalChartConfig" class="min-h-[300px] w-full">
  <VisXYContainer :data="impactoCapital">
    <VisAxis type="x" :x="(d) => d.fecha" />
    <VisAxis type="y" :tick-format="(d) => formatMoney(d)" />
    <VisLine
      :x="(d) => d.fecha"
      :y="(d) => d.capitalAntes"
      :color="capitalChartConfig.antes.color"
    />
    <VisLine
      :x="(d) => d.fecha"
      :y="(d) => d.capitalDespues"
      :color="capitalChartConfig.despues.color"
    />
    <ChartTooltip />
    <ChartCrosshair :template="componentToString(capitalChartConfig, ChartTooltipContent)" />
  </VisXYContainer>
  <ChartLegendContent />
</ChartContainer>
```

#### 3. Cambios en Directores/Apoderados (Barras Agrupadas)

**Datos necesarios:**
```typescript
interface CambiosAutoridades {
  fecha: Date;
  directoresAntes: number;
  directoresDespues: number;
  apoderadosAntes: number;
  apoderadosDespues: number;
}
```

**Componente:**
```vue
<ChartContainer :config="autoridadesChartConfig" class="min-h-[300px] w-full">
  <VisXYContainer :data="cambiosAutoridades">
    <VisAxis type="x" :x="(d) => d.fecha" />
    <VisAxis type="y" />
    <VisGroupedBar
      :x="(d) => d.fecha"
      :y="[
        (d) => d.directoresAntes,
        (d) => d.directoresDespues,
        (d) => d.apoderadosAntes,
        (d) => d.apoderadosDespues
      ]"
      :color="[
        autoridadesChartConfig.directoresAntes.color,
        autoridadesChartConfig.directoresDespues.color,
        autoridadesChartConfig.apoderadosAntes.color,
        autoridadesChartConfig.apoderadosDespues.color
      ]"
    />
    <ChartTooltip />
    <ChartCrosshair :template="componentToString(autoridadesChartConfig, ChartTooltipContent)" />
  </VisXYContainer>
  <ChartLegendContent />
</ChartContainer>
```

---

## 📁 ESTRUCTURA DE ARCHIVOS

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
│       ├── DashboardHeader.vue         # Header reutilizable
│       ├── StatCard.vue                # Card de estadística
│       ├── StatCardWithTrend.vue      # Card con trend
│       ├── AhorroCard.vue             # Card especial para ahorro
│       ├── ImpactoCard.vue            # Card de impacto (juntas)
│       ├── charts/
│       │   ├── SociedadesLineChart.vue      # Evolución sociedades
│       │   ├── JuntasDonutChart.vue         # Distribución juntas
│       │   ├── EstadoSociedadesBarChart.vue # Estado sociedades
│       │   ├── TimelineJuntasChart.vue      # Timeline juntas
│       │   ├── ImpactoCapitalChart.vue      # Impacto capital
│       │   └── CambiosAutoridadesChart.vue # Cambios autoridades
│       └── JuntaImpactTable.vue       # Tabla de impacto
│
├── composables/
│   ├── useSociedadesDashboard.ts       # Lógica dashboard sociedades
│   └── useJuntasDashboard.ts          # Lógica dashboard juntas
│
└── types/
    └── dashboard/
        ├── sociedad-dashboard.types.ts
        └── junta-dashboard.types.ts
```

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### Fase 1: Componentes Base (Día 1)

1. **Crear componentes base:**
   - [ ] `DashboardHeader.vue`
   - [ ] `StatCard.vue`
   - [ ] `StatCardWithTrend.vue`
   - [ ] `AhorroCard.vue`

2. **Crear tipos:**
   - [ ] `sociedad-dashboard.types.ts`
   - [ ] `junta-dashboard.types.ts`

### Fase 2: Dashboard de Sociedades (Día 2-3)

1. **Crear composable:**
   - [ ] `useSociedadesDashboard.ts`
   - [ ] Método para calcular total de juntas
   - [ ] Método para obtener evolución (últimos 6 meses)
   - [ ] Método para agrupar juntas por tipo
   - [ ] Método para obtener estado de sociedades

2. **Crear componentes de gráficos:**
   - [ ] `SociedadesLineChart.vue` (Evolución)
   - [ ] `JuntasDonutChart.vue` (Distribución)
   - [ ] `EstadoSociedadesBarChart.vue` (Estado)

3. **Actualizar página:**
   - [ ] `app/pages/registros/sociedades/dashboard.vue`
   - [ ] Implementar stats cards
   - [ ] Implementar gráficos
   - [ ] Implementar tabla de top sociedades

### Fase 3: Dashboard de Juntas (Día 4-5)

1. **Crear composable:**
   - [ ] `useJuntasDashboard.ts`
   - [ ] Método para obtener timeline de juntas
   - [ ] Método para calcular impacto en capital
   - [ ] Método para calcular cambios en autoridades
   - [ ] Método para agrupar juntas por tipo

2. **Crear componentes de gráficos:**
   - [ ] `TimelineJuntasChart.vue`
   - [ ] `ImpactoCapitalChart.vue`
   - [ ] `CambiosAutoridadesChart.vue`

3. **Crear componentes específicos:**
   - [ ] `ImpactoCard.vue`
   - [ ] `JuntaImpactTable.vue`

4. **Actualizar página:**
   - [ ] `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/dashboard.vue`
   - [ ] Implementar selector de sociedad
   - [ ] Implementar stats cards por tipo
   - [ ] Implementar gráficos
   - [ ] Implementar sección de impacto
   - [ ] Implementar tabla de historial

### Fase 4: Refinamiento (Día 6)

1. **Testing:**
   - [ ] Probar con datos reales
   - [ ] Verificar responsive
   - [ ] Verificar estados vacíos
   - [ ] Verificar loading states

2. **Ajustes visuales:**
   - [ ] Aplicar tokens CSS PROBO
   - [ ] Ajustar colores de gráficos
   - [ ] Agregar animaciones sutiles
   - [ ] Mejorar tooltips

---

## 📊 CONFIGURACIÓN DE GRÁFICOS

### Colores PROBO para Gráficos

```typescript
// Dashboard de Sociedades
const lineChartConfig = {
  creadas: {
    label: 'Sociedades Creadas',
    color: 'var(--primary-700)', // #553ADE
  },
  finalizadas: {
    label: 'Sociedades Finalizadas',
    color: '#10B981', // Verde
  },
} satisfies ChartConfig;

const donutChartConfig = {
  'Aumento Capital': {
    label: 'Aumento de Capital',
    color: '#10B981', // Verde
  },
  'Nombramiento': {
    label: 'Nombramiento',
    color: 'var(--primary-700)', // #553ADE
  },
  'Remoción': {
    label: 'Remoción',
    color: '#EF4444', // Rojo
  },
  'Mayoría Absoluta': {
    label: 'Mayoría Absoluta',
    color: '#F59E0B', // Naranja
  },
  'Utilidades': {
    label: 'Aplicación Utilidades',
    color: '#6366F1', // Índigo
  },
} satisfies ChartConfig;

// Dashboard de Juntas
const capitalChartConfig = {
  antes: {
    label: 'Capital Antes',
    color: '#8D8A95', // Gris
  },
  despues: {
    label: 'Capital Después',
    color: '#10B981', // Verde
  },
} satisfies ChartConfig;
```

---

## 📝 NOTAS IMPORTANTES

### Datos que Necesitamos del Backend

1. **Para Dashboard de Sociedades:**
   - Fechas de creación de sociedades (para evolución)
   - Total de juntas por sociedad (para sumar)
   - Tipo de cada junta (para distribución)
   - Estado de sociedades por mes

2. **Para Dashboard de Juntas:**
   - Fechas de todas las juntas
   - Tipo de cada junta
   - Estado de cada junta
   - Snapshot antes/después de cada junta:
     - Capital social
     - Número de directores
     - Número de apoderados
     - Acciones emitidas

### Placeholders y Datos Mock

- **Ahorro Estimado**: Placeholder "Próximamente"
- **Datos históricos**: Si no hay datos de meses anteriores, mostrar solo datos actuales
- **Impacto**: Si no hay snapshot "antes", mostrar solo "después"

---

## ✅ CHECKLIST FINAL

### Dashboard de Sociedades
- [ ] Header con título y botón crear
- [ ] 6 Stats Cards
- [ ] Gráfico de línea (Evolución)
- [ ] Gráfico de dona (Distribución juntas)
- [ ] Gráfico de barras (Estado sociedades)
- [ ] Tabla de top sociedades
- [ ] Responsive design
- [ ] Estados vacíos
- [ ] Loading states

### Dashboard de Juntas
- [ ] Selector de sociedad
- [ ] Stats Cards por tipo
- [ ] Gráfico timeline
- [ ] Gráfico impacto capital
- [ ] Gráfico cambios autoridades
- [ ] Sección impacto acumulado
- [ ] Tabla de historial
- [ ] Responsive design
- [ ] Estados vacíos
- [ ] Loading states

---

## 🎯 PRÓXIMOS PASOS

1. **Confirmar con usuario** si este plan está bien
2. **Empezar con Fase 1** (Componentes base)
3. **Implementar Dashboard de Sociedades** primero
4. **Luego Dashboard de Juntas**
5. **Refinar y ajustar** según feedback

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0.0
**Estado:** ✅ Listo para implementar




