# 📊 DOCUMENTACIÓN VISUAL COMPLETA: DASHBOARDS SOCIEDADES Y JUNTAS
**Sistema de Visualización y Métricas - PROBO**

---

## 📑 ÍNDICE

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Arquitectura General de Dashboards](#2-arquitectura-general-de-dashboards)
3. [Dashboard de Sociedades](#3-dashboard-de-sociedades)
4. [Dashboard de Juntas](#4-dashboard-de-juntas)
5. [Componentes Compartidos](#5-componentes-compartidos)
6. [Sistema de Tokens CSS PROBO](#6-sistema-de-tokens-css-probo)
7. [Componentes shadcn/ui Utilizados](#7-componentes-shadcnui-utilizados)
8. [Clases de Tailwind CSS](#8-clases-de-tailwind-css)
9. [Interacciones del Usuario](#9-interacciones-del-usuario)
10. [Estados Visuales](#10-estados-visuales)
11. [Checklist de Migración a Nuxt 4](#11-checklist-de-migración-a-nuxt-4)

---

## 1. RESUMEN EJECUTIVO

### 🎯 Propósito
Este documento proporciona la documentación visual completa de los **dos dashboards principales de PROBO**:
- **Dashboard de Sociedades**: Vista general de sociedades con métricas clave
- **Dashboard de Juntas**: Vista especializada con 3 flujos de trabajo (Aportes Dinerarios, Remoción de Apoderados, Nombramiento de Apoderados)

### 📦 Archivos Principales Involucrados

**Componente Base Genérico:**
```
/components/GenericDashboard.tsx (223 líneas)
```

**Dashboard Especializado de Juntas:**
```
/components/JuntaDashboard.tsx (870+ líneas)
```

**Componente de Resumen Expandible:**
```
/components/JuntaResumenCard.tsx (530 líneas)
```

**Configuración en AppContent:**
```
/AppContent.tsx
```

---

## 2. ARQUITECTURA GENERAL DE DASHBOARDS

### 🏗️ Estructura de Layout - Dashboard Genérico

```
┌─────────────────────────────────────────────────────────────────────┐
│                       GenericDashboard                              │
├─────────────────────────────────────────────────────────────────────┤
│                             HEADER (Sticky)                          │
│   [🏢 Icon]  Título                           [+ Crear Sociedad]    │
│              Subtítulo                                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  STATS CARDS (4 columnas responsivas)                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ 📊 Total │ │ ✅ Activ │ │ ⏰ Proce │ │ 📄 Inact │              │
│  │   45     │ │   38     │ │   5      │ │   2      │              │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘              │
│                                                                      │
│  SEARCH & FILTERS                                                    │
│  [🔍 Buscar...                              ]  [⚙️ Filtros]         │
│                                                                      │
│  CONTENT AREA                                                        │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                                                            │    │
│  │              EMPTY STATE o LISTADO                          │    │
│  │                                                            │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 🏗️ Estructura de Layout - Dashboard de Juntas

```
┌─────────────────────────────────────────────────────────────────────┐
│                         JuntaDashboard                              │
├─────────────────────────────────────────────────────────────────────┤
│  Dashboard de Junta de Accionistas                                  │
│  Seguimiento y gestión de acuerdos societarios                      │
│                                                                      │
│  SELECTOR DE FLUJOS (3 botones)                                     │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐      │
│  │ 💰 Aportes Dine │ │ ❌ Remoción Apo │ │ ✅ Nombram. Apo │      │
│  │ Aumentos de cap │ │ Revocatoria de  │ │ Designación de  │      │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  STATS CARDS (4 métricas específicas del flujo)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ Métrica1 │ │ Métrica2 │ │ Métrica3 │ │ Métrica4 │              │
│  │  Valor   │ │  Valor   │ │  Valor   │ │  Valor   │              │
│  │  Trend   │ │  Trend   │ │  Trend   │ │  Trend   │              │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘              │
│                                                                      │
│  [SOLO APORTES] RESUMEN DETALLADO POR JUNTA (Expandible)            │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ 💰 Inversiones Probo S.A.C.          S/ 500,000   [▼]     │    │
│  │    Junta realizada el 15 Nov 2024                          │    │
│  ├────────────────────────────────────────────────────────────┤    │
│  │ [EXPANDIDO]                                                │    │
│  │ - Capital Social: S/ 1M → S/ 1.5M                          │    │
│  │ - Incremento: +5,000 acciones                              │    │
│  │ - Tabla distribución accionaria                            │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  TABLA DE HISTORIAL                                                 │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Sociedad │ Fecha │ Monto │ Acciones │ Estado │ Votación   │    │
│  ├────────────────────────────────────────────────────────────┤    │
│  │ Data...                                                    │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 📐 Dimensiones del Layout

| Elemento | Ancho | Alto | Observaciones |
|----------|-------|------|---------------|
| **Header** | `100%` | Auto (`py-4` o `py-6`) | Sticky top con border-bottom |
| **Stats Grid** | `100%` | Auto | Grid 4 columnas (responsive) |
| **Stat Card** | `1fr` | Auto (`p-6`) | Adaptable al contenido |
| **Search Bar** | `flex-1` | Auto (`py-2`) | Expansible |
| **Tabla** | `100%` | Auto | Scroll horizontal si necesario |
| **Padding Content** | `px-8 py-6` | - | Consistente en toda la app |

### 🎨 Paleta de Colores Utilizada

```css
/* Fondo General */
background: var(--bg-muted) = #F8F8F8

/* Tarjetas y Cards */
background: var(--bg-default) = #FFFFFF
border: var(--border-default) = #D9D8DC
box-shadow: var(--shadow-card) = 0 2px 8px rgba(17, 12, 34, 0.04)

/* Botón Primario (Crear) */
background: var(--primary-800) = #3C28A4
hover: var(--primary-900) = #21194D

/* Estados de Cards */
success: #10B981 (verde)
warning: #F59E0B (amarillo/naranja)
error: #EF4444 (rojo)
info: #6366F1 (índigo/morado claro)
```

---

## 3. DASHBOARD DE SOCIEDADES

### 📊 Configuración del Dashboard

**Archivo:** `/AppContent.tsx` (líneas 46-64)

```typescript
const sociedadesDashboardConfig = {
  title: 'Sociedades',
  subtitle: 'Gestión de sociedades y registros corporativos',
  icon: Building2,
  createLabel: 'Crear Sociedad',
  onCreateClick: () => {
    setModo('CREAR');
    setRegistroEnEdicion(null);
    setViewMode('landing');
    setCurrentView('sociedades-crear');
  },
  stats: [
    { 
      label: 'Total Sociedades', 
      value: 45, 
      icon: Building2, 
      color: 'var(--primary-700)' 
    },
    { 
      label: 'Activas', 
      value: 38, 
      icon: TrendingUp, 
      color: '#10B981' 
    },
    { 
      label: 'En Proceso', 
      value: 5, 
      icon: Clock, 
      color: '#F59E0B' 
    },
    { 
      label: 'Inactivas', 
      value: 2, 
      icon: FileText, 
      color: 'var(--gray-500)' 
    }
  ]
};
```

### 🎨 Anatomía Visual Completa

```
┌────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────┐   │
│  │  HEADER (bg-white, border-b, sticky, shadow-card)      │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │  ┌────┐                                                 │   │
│  │  │ 🏢 │  Sociedades                [+ Crear Sociedad]  │   │
│  │  └────┘  Gestión de sociedades y registros corp...     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  STATS CARDS GRID (grid-cols-4)                        │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───┐│   │
│  │  │Total Socieda│ │  Activas    │ │ En Proceso  │ │Ina││   │
│  │  │             │ │             │ │             │ │   ││   │
│  │  │     45      │ │     38      │ │      5      │ │ 2 ││   │
│  │  │ [🏢 icon]   │ │ [📈 icon]   │ │ [⏰ icon]   │ │[📄││   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └───┘│   │
│  │  Purple #553ADE  Green #10B981   Orange #F59E0B  Gray  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  SEARCH & FILTERS                                      │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │  [🔍 Buscar...                        ] [⚙️ Filtros]   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  EMPTY STATE / CONTENT                                 │   │
│  ├────────────────────────────────────────────────────────┤   │
│  │                                                        │   │
│  │                    🏢 (icon grande)                     │   │
│  │                                                        │   │
│  │              No hay registros aún                       │   │
│  │        Comienza creando tu primer registro             │   │
│  │                                                        │   │
│  │              [+ Crear Sociedad]                         │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

### 🧩 Código del Componente

**Archivo:** `/components/GenericDashboard.tsx`

#### Header

```tsx
<div className="flex-1 h-screen overflow-auto" style={{ backgroundColor: 'var(--bg-muted)' }}>
  {/* Header */}
  <div 
    className="bg-white border-b sticky top-0 z-30"
    style={{ 
      borderColor: 'var(--border-light)',
      boxShadow: 'var(--shadow-card)'
    }}
  >
    <div className="px-8 py-4">
      <div className="flex items-center justify-between mb-4">
        {/* Left Side - Icon + Title */}
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ 
              background: 'linear-gradient(135deg, var(--primary-700), var(--primary-500))',
              borderRadius: 'var(--radius-medium)'
            }}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 
              className="text-2xl mb-1" 
              style={{ 
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)'
              }}
            >
              {config.title}
            </h1>
            <p 
              className="text-sm" 
              style={{ 
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-secondary)'
              }}
            >
              {config.subtitle}
            </p>
          </div>
        </div>
        
        {/* Right Side - Create Button */}
        <Button 
          onClick={config.onCreateClick}
          className="flex items-center gap-2 text-white"
          style={{ 
            backgroundColor: 'var(--primary-800)',
            borderRadius: 'var(--radius-medium)',
            fontFamily: 'var(--font-secondary)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-900)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-800)'}
        >
          <Plus className="w-4 h-4" />
          {config.createLabel}
        </Button>
      </div>
    </div>
  </div>
  
  {/* ... resto del componente ... */}
</div>
```

#### Stats Cards

```tsx
<div className="px-8 py-6">
  {/* Stats Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {config.stats.map((stat, index) => (
      <StatCard key={index} {...stat} />
    ))}
  </div>
  
  {/* ... resto ... */}
</div>
```

#### Componente StatCard

```tsx
interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div 
      className="bg-white border rounded-xl p-6"
      style={{
        borderColor: 'var(--border-default)',
        boxShadow: 'var(--shadow-card)',
        borderRadius: 'var(--radius-large)'
      }}
    >
      {/* Header - Label + Icon */}
      <div className="flex items-center justify-between mb-3">
        <p 
          className="text-sm"
          style={{ 
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-secondary)'
          }}
        >
          {label}
        </p>
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: `${color}15`, // Color con 15% opacidad
            borderRadius: 'var(--radius-medium)'
          }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      
      {/* Value */}
      <p 
        className="text-3xl"
        style={{ 
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-primary)',
          fontWeight: 600
        }}
      >
        {value}
      </p>
    </div>
  );
}
```

#### Search & Filters

```tsx
<div className="flex flex-col sm:flex-row gap-4 mb-6">
  {/* Search Input */}
  <div className="relative flex-1">
    <Search 
      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
      style={{ color: 'var(--text-muted)' }}
    />
    <input
      type="text"
      placeholder="Buscar..."
      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
      style={{ 
        borderColor: 'var(--border-default)',
        backgroundColor: 'white',
        borderRadius: 'var(--radius-medium)',
        fontFamily: 'var(--font-secondary)'
      }}
    />
  </div>
  
  {/* Filters Button */}
  <Button 
    variant="outline" 
    className="flex items-center gap-2"
    style={{ fontFamily: 'var(--font-secondary)' }}
  >
    <Filter className="w-4 h-4" />
    Filtros
  </Button>
</div>
```

#### Empty State

```tsx
<div 
  className="text-center py-16 bg-white border rounded-xl"
  style={{ 
    borderColor: 'var(--border-default)',
    borderRadius: 'var(--radius-large)'
  }}
>
  {/* Icon */}
  <Icon className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
  
  {/* Title */}
  <h3 
    className="text-lg mb-2"
    style={{ 
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-primary)',
      fontWeight: 600
    }}
  >
    No hay registros aún
  </h3>
  
  {/* Description */}
  <p 
    className="text-sm mb-6"
    style={{ 
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-secondary)'
    }}
  >
    Comienza creando tu primer registro
  </p>
  
  {/* CTA Button */}
  <Button 
    onClick={config.onCreateClick}
    className="text-white"
    style={{ 
      backgroundColor: 'var(--primary-800)',
      fontFamily: 'var(--font-secondary)'
    }}
  >
    <Plus className="w-4 h-4 mr-2" />
    {config.createLabel}
  </Button>
</div>
```

---

## 4. DASHBOARD DE JUNTAS

### 📊 Características Únicas

El Dashboard de Juntas es **especializado** y tiene funcionalidades avanzadas:

1. **3 Flujos de Trabajo Seleccionables**:
   - Aportes Dinerarios
   - Remoción de Apoderados
   - Nombramiento de Apoderados

2. **Stats Cards Dinámicas** por flujo

3. **Sección de Resumen Expandible** (solo en Aportes Dinerarios)
   - `JuntaResumenCard.tsx` con colapso/expansión
   - Tabla comparativa antes/después
   - Análisis financiero detallado

4. **Tabla de Historial** con columnas específicas por flujo

### 🎨 Anatomía Visual Completa

```
┌────────────────────────────────────────────────────────────────┐
│  Dashboard de Junta de Accionistas                             │
│  Seguimiento y gestión de acuerdos societarios                 │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  SELECTOR DE FLUJOS                                      │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  ┌────────────────┐ ┌────────────────┐ ┌──────────────┐ │  │
│  │  │ 💰 [ACTIVO]    │ │ ❌             │ │ ✅           │ │  │
│  │  │ Aportes Dinera │ │ Remoción Apode │ │ Nombram. Apo │ │  │
│  │  │ Aumentos de ca │ │ Revocatoria de │ │ Designación  │ │  │
│  │  └────────────────┘ └────────────────┘ └──────────────┘ │  │
│  │  border-2 purple    border gray        border gray      │  │
│  │  bg purple 10%      bg white           bg white         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  STATS CARDS (específicas del flujo activo)             │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌───────┐│  │
│  │  │Total Aprob │ │ En Proceso │ │Completados │ │Promed ││  │
│  │  │            │ │            │ │            │ │       ││  │
│  │  │ S/ 2.4M    │ │     8      │ │     45     │ │S/53.3K││  │
│  │  │💰 Green    │ │⏰ Orange   │ │✅ Purple   │ │📈 Indi││  │
│  │  │+24% vs año │ │3 req. vot. │ │32 este año │ │Por soc││  │
│  │  └────────────┘ └────────────┘ └────────────┘ └───────┘│  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  RESUMEN DETALLADO POR JUNTA (solo Aportes)             │  │
│  │  Análisis financiero y distribución accionaria...        │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │ 💰 Inversiones Probo S.A.C.        S/ 500,000  [▼]│ │  │
│  │  │    Junta realizada el 15 Nov 2024                  │ │  │
│  │  ├────────────────────────────────────────────────────┤ │  │
│  │  │ [CONTENIDO EXPANDIDO]                              │ │  │
│  │  │                                                    │ │  │
│  │  │ Resumen Financiero (3 cards)                       │ │  │
│  │  │ - Capital Social: S/ 1M → S/ 1.5M                  │ │  │
│  │  │ - Incremento: +5,000 acciones, +S/ 400K            │ │  │
│  │  │ - Desglose: S/ 400K capital + S/ 100K prima        │ │  │
│  │  │                                                    │ │  │
│  │  │ Distribución Accionaria (tabla)                    │ │  │
│  │  │ ┌──────────────┬───────┬───┬──┬────────┬────┐    │ │  │
│  │  │ │ Accionista   │Acc Ant│ % │→ │Acc Desp│ %  │    │ │  │
│  │  │ ├──────────────┼───────┼───┼──┼────────┼────┤    │ │  │
│  │  │ │ Juan Pérez   │ 5,000 │50%│→ │ 6,500  │43% │    │ │  │
│  │  │ │ María Campo  │ 3,000 │30%│→ │ 4,500  │30% │    │ │  │
│  │  │ │ Pedro Martín │ 2,000 │20%│→ │ 4,000  │27% │    │ │  │
│  │  │ └──────────────┴───────┴───┴──┴────────┴────┘    │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  │  [Más cards de resumen expandibles...]                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  💰 Historial de Aportes Dinerarios                     │  │
│  │  Registro completo de operaciones realizadas            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │Sociedad │Fecha│Monto│Acciones│Estado│Votación    │ │  │
│  │  ├────────────────────────────────────────────────────┤ │  │
│  │  │Invers...│15/11│S/500│5,000   │✅Aprob│Unanimidad │ │  │
│  │  │Tech Sol │08/11│S/250│2,500   │⏰Proce│Pendiente  │ │  │
│  │  │Constru..│02/11│S/1.2│12,000  │✅Aprob│85%        │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### 🧩 Código del Componente Principal

**Archivo:** `/components/JuntaDashboard.tsx`

#### Header

```tsx
<div className="h-full overflow-auto">
  {/* Header */}
  <div 
    className="border-b px-8 py-6"
    style={{ borderColor: 'var(--border-default)' }}
  >
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 
          className="text-2xl mb-1"
          style={{ 
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-primary)',
            fontWeight: 700
          }}
        >
          Dashboard de Junta de Accionistas
        </h1>
        <p 
          className="text-sm"
          style={{ 
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-secondary)'
          }}
        >
          Seguimiento y gestión de acuerdos societarios
        </p>
      </div>
    </div>

    {/* Selector de Flujos */}
    <div className="flex gap-3">
      {FLUJOS_CONFIG.map((flujo) => {
        const Icono = flujo.icon;
        const activo = flujoActivo === flujo.id;
        
        return (
          <button
            key={flujo.id}
            onClick={() => setFlujoActivo(flujo.id)}
            className="flex items-center gap-3 px-6 py-3 rounded-lg border-2 transition-all"
            style={{
              borderColor: activo ? flujo.color : 'var(--border-default)',
              backgroundColor: activo ? `${flujo.color}10` : 'white',
              cursor: 'pointer'
            }}
          >
            {/* Icono */}
            <div 
              className="p-2 rounded-lg"
              style={{ 
                backgroundColor: activo ? flujo.color : 'var(--gray-100)'
              }}
            >
              <Icono 
                className="w-5 h-5" 
                style={{ color: activo ? 'white' : 'var(--text-muted)' }}
              />
            </div>
            
            {/* Texto */}
            <div className="text-left">
              <p 
                className="text-sm"
                style={{ 
                  color: activo ? flujo.color : 'var(--text-primary)',
                  fontFamily: 'var(--font-secondary)',
                  fontWeight: activo ? 600 : 500
                }}
              >
                {flujo.nombre}
              </p>
              <p 
                className="text-xs"
                style={{ 
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-secondary)'
                }}
              >
                {flujo.descripcion}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  </div>
  
  {/* ... resto del componente ... */}
</div>
```

#### Configuración de Flujos

```typescript
const FLUJOS_CONFIG: FlujoConfig[] = [
  {
    id: 'aporte-dinerario',
    nombre: 'Aportes Dinerarios',
    descripcion: 'Aumentos de capital mediante aportes en efectivo',
    icon: DollarSign,
    color: 'var(--primary-700)', // #553ADE
    stats: [
      { 
        label: 'Total Aprobados', 
        value: 'S/ 2.4M', 
        icon: DollarSign, 
        color: '#10B981',
        trend: '+24% vs. año anterior'
      },
      { 
        label: 'En Proceso', 
        value: 8, 
        icon: Clock, 
        color: '#F59E0B',
        trend: '3 requieren votación'
      },
      { 
        label: 'Completados', 
        value: 45, 
        icon: CheckCircle2, 
        color: 'var(--primary-700)',
        trend: '32 este año'
      },
      { 
        label: 'Promedio Aporte', 
        value: 'S/ 53,333', 
        icon: TrendingUp, 
        color: '#6366F1',
        trend: 'Por sociedad'
      }
    ],
    tablaColumnas: ['Sociedad', 'Fecha', 'Monto', 'Nuevas Acciones', 'Estado', 'Votación'],
    tablaData: [
      { 
        id: 1, 
        sociedad: 'Inversiones Probo S.A.C.', 
        fecha: '15 Nov 2024', 
        monto: 'S/ 500,000', 
        acciones: '5,000',
        estado: 'Aprobado',
        votacion: 'Unanimidad',
        estadoColor: '#10B981'
      },
      // ... más datos
    ]
  },
  {
    id: 'remocion-apoderados',
    nombre: 'Remoción de Apoderados',
    descripcion: 'Revocatoria de poderes y representación legal',
    icon: UserMinus,
    color: '#EF4444', // Rojo
    stats: [
      { 
        label: 'Remociones Totales', 
        value: 23, 
        icon: UserMinus, 
        color: '#EF4444',
        trend: '12 este año'
      },
      // ... más stats
    ],
    tablaColumnas: ['Apoderado', 'Sociedad', 'Fecha Solicitud', 'Tipo Poder', 'Estado', 'Motivo'],
    tablaData: [ /* ... */ ]
  },
  {
    id: 'nombramiento-apoderados',
    nombre: 'Nombramiento de Apoderados',
    descripcion: 'Designación de nuevos representantes legales',
    icon: UserPlus,
    color: '#10B981', // Verde
    stats: [
      { 
        label: 'Nombramientos', 
        value: 34, 
        icon: UserPlus, 
        color: '#10B981',
        trend: '18 este año'
      },
      // ... más stats
    ],
    tablaColumnas: ['Apoderado', 'Sociedad', 'Fecha Nombramiento', 'Tipo Poder', 'Estado', 'Vigencia'],
    tablaData: [ /* ... */ ]
  }
];
```

#### Stats Cards (con Trend)

```tsx
<div className="p-8">
  {/* Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {flujoConfig.stats.map((stat, index) => {
      const IconoStat = stat.icon;
      return (
        <div
          key={index}
          className="bg-white rounded-xl border p-6"
          style={{ 
            borderColor: 'var(--border-default)',
            borderRadius: 'var(--radius-large)'
          }}
        >
          {/* Icon */}
          <div className="flex items-start justify-between mb-4">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <IconoStat className="w-6 h-6" style={{ color: stat.color }} />
            </div>
          </div>
          
          {/* Value */}
          <p 
            className="text-3xl mb-1"
            style={{ 
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-primary)',
              fontWeight: 700
            }}
          >
            {stat.value}
          </p>
          
          {/* Label */}
          <p 
            className="text-sm mb-2"
            style={{ 
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 500
            }}
          >
            {stat.label}
          </p>
          
          {/* Trend (opcional) */}
          {stat.trend && (
            <p 
              className="text-xs"
              style={{ 
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-secondary)'
              }}
            >
              {stat.trend}
            </p>
          )}
        </div>
      );
    })}
  </div>
  
  {/* ... resto ... */}
</div>
```

### 🔥 Componente JuntaResumenCard (Expandible)

**Archivo:** `/components/JuntaResumenCard.tsx`

Este componente es **único y complejo**, solo aparece en el flujo de "Aportes Dinerarios".

#### Anatomía Visual del Card Colapsado

```
┌────────────────────────────────────────────────────────────────┐
│  ┌────┐                                                        │
│  │ 💰 │  Inversiones Probo S.A.C.             S/ 500,000  [▼] │
│  └────┘  Junta realizada el 15 Nov 2024                        │
│                                                                 │
│  Purple bg (--primary-100)  | Monto Total | Chevron Down       │
└────────────────────────────────────────────────────────────────┘
```

#### Anatomía Visual del Card Expandido

```
┌────────────────────────────────────────────────────────────────┐
│  ┌────┐                                                        │
│  │ 💰 │  Inversiones Probo S.A.C.             S/ 500,000  [▲] │
│  └────┘  Junta realizada el 15 Nov 2024                        │
├────────────────────────────────────────────────────────────────┤
│  RESUMEN FINANCIERO (3 Cards en Grid)                          │
│                                                                 │
│  ┌──────────────────┐ ┌──────────────────┐ ┌────────────────┐ │
│  │ Capital Social   │ │ Incremento       │ │ Desglose Aporte│ │
│  ├──────────────────┤ ├──────────────────┤ ├────────────────┤ │
│  │ Antes            │ │ Nuevas Acciones  │ │ Monto Capital  │ │
│  │ S/ 1,000,000     │ │ +5,000           │ │ S/ 400,000     │ │
│  │        ➜         │ │                  │ │                │ │
│  │ Después          │ │ Incremento Cap.  │ │ Prima Emisión  │ │
│  │ S/ 1,500,000     │ │ +S/ 400,000      │ │ S/ 100,000     │ │
│  │ (verde #10B981)  │ │ (verde #15803D)  │ │ ───────────    │ │
│  └──────────────────┘ └──────────────────┘ │ Total Aportado │ │
│  bg #F9FAFB          bg #F0FDF4            │ S/ 500,000     │ │
│  border gray-light   border green          └────────────────┘ │
│                                             bg #EEF2FF        │
│                                             border indigo     │
│                                                                 │
│  DISTRIBUCIÓN ACCIONARIA (Tabla)                               │
│  📊 Distribución Accionaria                                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Accionista        │ Antes Aporte │   │ Después Aporte   │ │
│  │                   │ Acc.  │  %   │ → │ Acc.   │   %     │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │ Juan Pérez        │5,000  │ 50%  │ → │6,500   │ 43.33% │ │
│  │ María Campos      │3,000  │ 30%  │ → │4,500   │ 30.00% │ │
│  │ Pedro Martínez    │2,000  │ 20%  │ → │4,000   │ 26.67% │ │
│  └──────────────────────────────────────────────────────────┘ │
│  Valores grises normales | Valores verdes (#10B981) después  │
└────────────────────────────────────────────────────────────────┘
```

#### Código del Card Header

```tsx
export function JuntaResumenCard({ resumen }: JuntaResumenCardProps) {
  const [expandido, setExpandido] = useState(false);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div
      className="bg-white rounded-xl border mb-4"
      style={{
        borderColor: 'var(--border-default)',
        borderRadius: 'var(--radius-large)'
      }}
    >
      {/* Header - Siempre visible - CLICKEABLE */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Icon con fondo purple */}
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: 'var(--primary-100)' }}
          >
            <DollarSign className="w-6 h-6" style={{ color: 'var(--primary-700)' }} />
          </div>
          
          {/* Text */}
          <div className="text-left">
            <h3
              className="text-lg mb-1"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 600
              }}
            >
              {resumen.sociedad}
            </h3>
            <p
              className="text-sm"
              style={{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-secondary)'
              }}
            >
              Junta realizada el {resumen.fecha}
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Monto Total */}
          <div className="text-right">
            <p
              className="text-2xl mb-1"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 700
              }}
            >
              {formatMoney(resumen.montoTotal)}
            </p>
            <p
              className="text-xs"
              style={{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-secondary)'
              }}
            >
              Monto Total Aportado
            </p>
          </div>
          
          {/* Chevron */}
          {expandido ? (
            <ChevronUp className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          ) : (
            <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          )}
        </div>
      </button>

      {/* ... contenido expandible ... */}
    </div>
  );
}
```

#### Código del Contenido Expandible

```tsx
{/* Contenido expandible */}
{expandido && (
  <div className="px-6 pb-6">
    <div className="border-t pt-6" style={{ borderColor: 'var(--border-default)' }}>
      {/* Resumen Financiero - 3 Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Card 1: Capital Social */}
        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: '#F9FAFB',
            borderColor: 'var(--border-light)'
          }}
        >
          <p
            className="text-xs uppercase mb-3"
            style={{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 600,
              letterSpacing: '0.05em'
            }}
          >
            Capital Social
          </p>
          <div className="flex items-center gap-3 mb-2">
            {/* Antes */}
            <div>
              <p
                className="text-sm mb-1"
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-secondary)'
                }}
              >
                Antes
              </p>
              <p
                className="text-xl"
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600
                }}
              >
                {formatMoney(resumen.capitalAntes)}
              </p>
            </div>
            
            {/* Arrow */}
            <ArrowRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            
            {/* Después */}
            <div>
              <p
                className="text-sm mb-1"
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-secondary)'
                }}
              >
                Después
              </p>
              <p
                className="text-xl"
                style={{
                  color: '#10B981', // ⭐ Verde para indicar crecimiento
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 700
                }}
              >
                {formatMoney(resumen.capitalDespues)}
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Incremento (fondo verde claro) */}
        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: '#F0FDF4',
            borderColor: '#BBF7D0'
          }}
        >
          <p
            className="text-xs uppercase mb-3"
            style={{
              color: '#15803D',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 600,
              letterSpacing: '0.05em'
            }}
          >
            Incremento
          </p>
          <div className="space-y-3">
            <div>
              <p
                className="text-sm mb-1"
                style={{
                  color: '#16A34A',
                  fontFamily: 'var(--font-secondary)'
                }}
              >
                Nuevas Acciones
              </p>
              <p
                className="text-xl"
                style={{
                  color: '#15803D',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 700
                }}
              >
                +{resumen.nuevasAcciones.toLocaleString()}
              </p>
            </div>
            <div>
              <p
                className="text-sm mb-1"
                style={{
                  color: '#16A34A',
                  fontFamily: 'var(--font-secondary)'
                }}
              >
                Incremento Capital
              </p>
              <p
                className="text-xl"
                style={{
                  color: '#15803D',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 700
                }}
              >
                +{formatMoney(resumen.incrementoCapital)}
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Desglose (fondo índigo claro) */}
        <div
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: '#EEF2FF',
            borderColor: '#C7D2FE'
          }}
        >
          <p
            className="text-xs uppercase mb-3"
            style={{
              color: '#4338CA',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 600,
              letterSpacing: '0.05em'
            }}
          >
            Desglose del Aporte
          </p>
          <div className="space-y-3">
            {/* Monto al Capital */}
            <div className="flex items-center justify-between">
              <p
                className="text-sm"
                style={{
                  color: '#4F46E5',
                  fontFamily: 'var(--font-secondary)'
                }}
              >
                Monto al Capital
              </p>
              <p
                className="text-lg"
                style={{
                  color: '#4338CA',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600
                }}
              >
                {formatMoney(resumen.incrementoCapital)}
              </p>
            </div>
            
            {/* Prima de Emisión */}
            <div className="flex items-center justify-between">
              <p
                className="text-sm"
                style={{
                  color: '#4F46E5',
                  fontFamily: 'var(--font-secondary)'
                }}
              >
                Prima de Emisión
              </p>
              <p
                className="text-lg"
                style={{
                  color: '#4338CA',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600
                }}
              >
                {formatMoney(resumen.prima)}
              </p>
            </div>
            
            {/* Total */}
            <div
              className="pt-3 border-t flex items-center justify-between"
              style={{ borderColor: '#A5B4FC' }}
            >
              <p
                className="text-sm"
                style={{
                  color: '#4338CA',
                  fontFamily: 'var(--font-secondary)',
                  fontWeight: 600
                }}
              >
                Total Aportado
              </p>
              <p
                className="text-xl"
                style={{
                  color: '#4338CA',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 700
                }}
              >
                {formatMoney(resumen.montoTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Distribución Accionaria - Tabla */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <PieChart className="w-5 h-5" style={{ color: 'var(--primary-700)' }} />
          <h4
            className="text-lg"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-primary)',
              fontWeight: 600
            }}
          >
            Distribución Accionaria
          </h4>
        </div>

        <div
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <table className="w-full">
            <thead>
              {/* Row 1: Agrupación principal */}
              <tr
                className="bg-gray-50 border-b"
                style={{ borderColor: 'var(--border-default)' }}
              >
                <th
                  className="text-left py-3 px-4 text-xs uppercase"
                  style={{
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 600,
                    letterSpacing: '0.05em'
                  }}
                >
                  Accionista
                </th>
                <th
                  className="text-center py-3 px-4 text-xs uppercase"
                  style={{
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 600,
                    letterSpacing: '0.05em'
                  }}
                  colSpan={2}
                >
                  Antes del Aporte
                </th>
                <th className="py-3 px-2"></th>
                <th
                  className="text-center py-3 px-4 text-xs uppercase"
                  style={{
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 600,
                    letterSpacing: '0.05em'
                  }}
                  colSpan={2}
                >
                  Después del Aporte
                </th>
              </tr>
              
              {/* Row 2: Subheaders */}
              <tr
                className="bg-gray-50 border-b"
                style={{ borderColor: 'var(--border-default)' }}
              >
                <th></th>
                <th
                  className="text-center py-2 px-4 text-xs"
                  style={{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 500
                  }}
                >
                  Acciones
                </th>
                <th
                  className="text-center py-2 px-4 text-xs"
                  style={{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 500
                  }}
                >
                  %
                </th>
                <th></th>
                <th
                  className="text-center py-2 px-4 text-xs"
                  style={{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 500
                  }}
                >
                  Acciones
                </th>
                <th
                  className="text-center py-2 px-4 text-xs"
                  style={{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 500
                  }}
                >
                  %
                </th>
              </tr>
            </thead>
            <tbody>
              {resumen.accionistas.map((accionista, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--border-light)' }}
                >
                  {/* Nombre */}
                  <td
                    className="py-3 px-4 text-sm"
                    style={{
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 500
                    }}
                  >
                    {accionista.nombre}
                  </td>
                  
                  {/* Acciones Antes */}
                  <td
                    className="py-3 px-4 text-center text-sm"
                    style={{
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-secondary)'
                    }}
                  >
                    {accionista.accionesAntes.toLocaleString()}
                  </td>
                  
                  {/* % Antes */}
                  <td
                    className="py-3 px-4 text-center text-sm"
                    style={{
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 600
                    }}
                  >
                    {formatPercent(accionista.porcentajeAntes)}
                  </td>
                  
                  {/* Arrow */}
                  <td className="py-3 px-2 text-center">
                    <ArrowRight
                      className="w-4 h-4 mx-auto"
                      style={{ color: 'var(--text-muted)' }}
                    />
                  </td>
                  
                  {/* Acciones Después (verde) */}
                  <td
                    className="py-3 px-4 text-center text-sm"
                    style={{
                      color: '#10B981',
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 600
                    }}
                  >
                    {accionista.accionesDespues.toLocaleString()}
                  </td>
                  
                  {/* % Después (verde) */}
                  <td
                    className="py-3 px-4 text-center text-sm"
                    style={{
                      color: '#10B981',
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 700
                    }}
                  >
                    {formatPercent(accionista.porcentajeDespues)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)}
```

#### Tabla de Historial

```tsx
{/* Tabla de Datos */}
<div 
  className="bg-white rounded-xl border"
  style={{ 
    borderColor: 'var(--border-default)',
    borderRadius: 'var(--radius-large)'
  }}
>
  {/* Header de la Tabla */}
  <div className="p-6 border-b" style={{ borderColor: 'var(--border-default)' }}>
    <div className="flex items-center gap-3 mb-2">
      <IconoActivo className="w-5 h-5" style={{ color: flujoConfig.color }} />
      <h2 
        className="text-lg"
        style={{ 
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-primary)',
          fontWeight: 600
        }}
      >
        Historial de {flujoConfig.nombre}
      </h2>
    </div>
    <p 
      className="text-sm"
      style={{ 
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-secondary)'
      }}
    >
      Registro completo de operaciones realizadas
    </p>
  </div>

  {/* Tabla */}
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b" style={{ borderColor: 'var(--border-default)' }}>
          {flujoConfig.tablaColumnas.map((columna, index) => (
            <th
              key={index}
              className="text-left py-4 px-6 text-xs uppercase"
              style={{ 
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-secondary)',
                fontWeight: 600,
                letterSpacing: '0.05em'
              }}
            >
              {columna}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {flujoConfig.tablaData.map((row) => (
          <tr 
            key={row.id}
            className="border-b hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'var(--border-light)' }}
          >
            {/* ⭐ Renderizado condicional según flujo */}
            {flujoActivo === 'aporte-dinerario' && (
              <>
                <td 
                  className="py-4 px-6 text-sm"
                  style={{ 
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 500
                  }}
                >
                  {row.sociedad}
                </td>
                <td 
                  className="py-4 px-6 text-sm"
                  style={{ 
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-secondary)'
                  }}
                >
                  {row.fecha}
                </td>
                <td 
                  className="py-4 px-6 text-sm"
                  style={{ 
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 600
                  }}
                >
                  {row.monto}
                </td>
                <td 
                  className="py-4 px-6 text-sm"
                  style={{ 
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-secondary)'
                  }}
                >
                  {row.acciones}
                </td>
                
                {/* Badge de Estado */}
                <td className="py-4 px-6">
                  <span 
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ 
                      backgroundColor: `${row.estadoColor}20`,
                      color: row.estadoColor,
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 500
                    }}
                  >
                    {row.estado}
                  </span>
                </td>
                
                <td 
                  className="py-4 px-6 text-sm"
                  style={{ 
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-secondary)'
                  }}
                >
                  {row.votacion}
                </td>
              </>
            )}

            {/* Similar para otros flujos... */}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
```

---

## 5. COMPONENTES COMPARTIDOS

### 🧩 StatCard (GenericDashboard)

Ya documentado en la sección 3.

**Características:**
- Icono con fondo de color al 15% de opacidad
- Valor grande (text-3xl)
- Label pequeño (text-sm)
- Sin trend

### 🧩 StatCard con Trend (JuntaDashboard)

**Características adicionales:**
- Valor más grande (text-3xl mb-1)
- Label con fontWeight: 500
- **Trend** extra (text-xs, color muted)

```tsx
<div className="bg-white rounded-xl border p-6">
  {/* Icon */}
  <div className="flex items-start justify-between mb-4">
    <div className="p-3 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
      <IconoStat className="w-6 h-6" style={{ color: stat.color }} />
    </div>
  </div>
  
  {/* Value */}
  <p className="text-3xl mb-1" style={{ 
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-primary)',
    fontWeight: 700
  }}>
    {stat.value}
  </p>
  
  {/* Label */}
  <p className="text-sm mb-2" style={{
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-secondary)',
    fontWeight: 500
  }}>
    {stat.label}
  </p>
  
  {/* Trend */}
  {stat.trend && (
    <p className="text-xs" style={{
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-secondary)'
    }}>
      {stat.trend}
    </p>
  )}
</div>
```

---

### 🧩 Badges de Estado

```tsx
<span 
  className="px-3 py-1 rounded-full text-xs"
  style={{ 
    backgroundColor: `${color}20`, // Color al 20% opacidad
    color: color,
    fontFamily: 'var(--font-secondary)',
    fontWeight: 500
  }}
>
  {estado}
</span>
```

**Estados comunes:**
- **Aprobado**: `#10B981` (verde)
- **En Proceso**: `#F59E0B` (naranja)
- **Rechazado**: `#EF4444` (rojo)
- **Cancelado**: `#6B7280` (gris)
- **Pendiente Firma**: `#F59E0B` (naranja)

---

## 6. SISTEMA DE TOKENS CSS PROBO

*(Igual que en la documentación anterior)*

### 🎨 Tipografías

```css
--font-primary: 'Gabarito', sans-serif;   /* Títulos */
--font-secondary: 'Manrope', sans-serif;  /* Cuerpo */
```

### 🌈 Paleta de Colores

```css
/* Primarios */
--primary-700: #553ADE;
--primary-800: #3C28A4;
--primary-900: #21194D;

/* Grises */
--gray-100: #E2E2E4;
--gray-200: #D9D8DC;
--gray-500: #8D8A95;
--gray-900: #110C22;

/* Tokens Semánticos */
--bg-muted: #F8F8F8;
--bg-default: #FFFFFF;
--border-default: #D9D8DC;
--border-light: #E2E2E4;
--text-primary: #110C22;
--text-secondary: #4F4B5C;
--text-muted: #8D8A95;

/* Radius */
--radius-large: 24px;
--radius-medium: 16px;

/* Shadows */
--shadow-card: 0 2px 8px rgba(17, 12, 34, 0.04);
```

---

## 7. COMPONENTES SHADCN/UI UTILIZADOS

| Componente | Uso en Dashboard |
|------------|------------------|
| **Button** | Botón "Crear", botón "Filtros" |
| **Card** | Stats cards, resumen cards |
| **Table** | Tabla de historial |
| **Badge** | Estados (Aprobado, En Proceso, etc.) |

---

## 8. CLASES DE TAILWIND CSS

### 📐 Layout

```css
/* Grid */
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
grid-cols-3 gap-6

/* Flex */
flex items-center justify-between gap-3
flex items-start gap-4

/* Spacing */
px-8 py-6
p-6
mb-4, mb-6, mb-8
space-y-3

/* Sizing */
w-full
w-12 h-12 (iconos)
w-5 h-5, w-6 h-6 (iconos pequeños)
```

### 🎨 Visual

```css
/* Background */
bg-white
bg-gray-50
hover:bg-gray-50

/* Border */
border border-b border-t
rounded-xl rounded-lg rounded-full

/* Text */
text-sm text-lg text-xl text-2xl text-3xl
text-xs uppercase
text-left text-center text-right

/* Font Weight */
font-medium (500)
font-semibold (600)
font-bold (700)

/* Transition */
transition-all
transition-colors
```

### 📱 Responsive

```css
md:grid-cols-2
lg:grid-cols-4
sm:flex-row
```

---

## 9. INTERACCIONES DEL USUARIO

### 🖱️ Selector de Flujos (JuntaDashboard)

```typescript
const [flujoActivo, setFlujoActivo] = useState<FlujoTipo>('aporte-dinerario');

const flujoConfig = FLUJOS_CONFIG.find(f => f.id === flujoActivo)!;

// En el botón:
<button onClick={() => setFlujoActivo(flujo.id)}>
```

**Efecto:**
1. Cambia el flujo activo
2. Actualiza las stats cards
3. Cambia las columnas de la tabla
4. Muestra/oculta resúmenes expandibles (solo Aportes)

---

### 🔽 Expandir/Colapsar Card (JuntaResumenCard)

```typescript
const [expandido, setExpandido] = useState(false);

<button onClick={() => setExpandido(!expandido)}>
```

**Efecto:**
1. Alterna el estado `expandido`
2. Muestra/oculta el contenido expandible
3. Cambia el icono (ChevronDown ↔ ChevronUp)
4. Aplica hover:bg-gray-50 en el header

---

### 🔍 Search & Filters (GenericDashboard)

```tsx
{/* Actualmente solo visual, lógica pendiente */}
<input
  type="text"
  placeholder="Buscar..."
  // onChange={(e) => handleSearch(e.target.value)}
/>

<Button variant="outline">
  <Filter className="w-4 h-4" />
  Filtros
</Button>
```

---

### ➕ Crear Nuevo

```typescript
const onCreateClick = () => {
  setModo('CREAR');
  setRegistroEnEdicion(null);
  setViewMode('landing');
  setCurrentView('sociedades-crear'); // o 'junta-crear'
};
```

**Efecto:**
1. Cambia el modo a CREAR
2. Limpia el registro en edición
3. Navega a la vista de creación (FlujoLandingView)

---

## 10. ESTADOS VISUALES

### 🎨 Estados de Botón Selector de Flujo

#### No Activo

```tsx
style={{
  borderColor: 'var(--border-default)', // gris
  backgroundColor: 'white',
  cursor: 'pointer'
}}

// Icono:
backgroundColor: 'var(--gray-100)'
color: 'var(--text-muted)'

// Texto:
color: 'var(--text-primary)'
fontWeight: 500
```

#### Activo

```tsx
style={{
  borderColor: flujo.color, // color del flujo (purple, red, green)
  backgroundColor: `${flujo.color}10`, // color al 10% opacidad
  cursor: 'pointer'
}}

// Icono:
backgroundColor: flujo.color
color: 'white'

// Texto:
color: flujo.color
fontWeight: 600
```

---

### 🎨 Estados de Stat Card

#### Normal

```tsx
border: var(--border-default)
boxShadow: var(--shadow-card)
```

#### Hover (si clickeable)

```tsx
// No hay hover por defecto en las stat cards actuales
```

---

### 🎨 Estados de JuntaResumenCard

#### Colapsado

```tsx
// Header normal
<ChevronDown />
```

#### Expandido

```tsx
// Header normal + contenido visible
<ChevronUp />
```

#### Hover Header

```tsx
hover:bg-gray-50
transition-colors
```

---

### 🎨 Estados de Fila de Tabla

#### Normal

```tsx
borderColor: 'var(--border-light)'
```

#### Hover

```tsx
className="hover:bg-gray-50 transition-colors"
```

---

### 🎨 Estados de Badge

```tsx
// Aprobado (verde)
backgroundColor: '#10B98120'
color: '#10B981'

// En Proceso (naranja)
backgroundColor: '#F59E0B20'
color: '#F59E0B'

// Rechazado (rojo)
backgroundColor: '#EF444420'
color: '#EF4444'

// Cancelado (gris)
backgroundColor: '#6B728020'
color: '#6B7280'
```

---

## 11. CHECKLIST DE MIGRACIÓN A NUXT 4

### ✅ Estructura de Archivos

#### React (Actual)

```
/components/
  GenericDashboard.tsx
  JuntaDashboard.tsx
  JuntaResumenCard.tsx
  MetricCard.tsx
/AppContent.tsx (configuración)
```

#### Nuxt 4 (Propuesto)

```
/components/
  dashboard/
    DashboardLayout.vue
    DashboardHeader.vue
    StatCard.vue
    StatCardWithTrend.vue
  sociedades/
    SociedadesDashboard.vue
  juntas/
    JuntasDashboard.vue
    JuntaResumenCard.vue
    JuntaFlowSelector.vue
  ui/
    UiButton.vue
    UiInput.vue
    UiBadge.vue
    UiTable.vue
/pages/
  sociedades/
    index.vue → <SociedadesDashboard />
  juntas/
    index.vue → <JuntasDashboard />
/composables/
  useDashboardStats.ts
  useJuntaFlows.ts
/data/
  dashboardConfigs.ts
  juntaFlows.ts
```

---

### 📋 Checklist Detallado

#### 1. GenericDashboard → DashboardLayout.vue

- [ ] Convertir componente a Vue 3
  - [ ] Props: `config` (dashboardConfig)
  - [ ] Usar `computed` para stats
  - [ ] Emits: `create`, `search`, `filter`

```vue
<script setup lang="ts">
import { computed } from 'vue';

interface DashboardConfig {
  title: string;
  subtitle: string;
  icon: Component;
  createLabel: string;
  stats: StatConfig[];
}

const props = defineProps<{
  config: DashboardConfig;
}>();

const emit = defineEmits<{
  create: [];
  search: [query: string];
  filter: [];
}>();
</script>

<template>
  <div class="flex-1 h-screen overflow-auto" style="background-color: var(--bg-muted)">
    <DashboardHeader
      :title="config.title"
      :subtitle="config.subtitle"
      :icon="config.icon"
      :create-label="config.createLabel"
      @create="emit('create')"
    />
    
    <div class="px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          v-for="(stat, index) in config.stats"
          :key="index"
          v-bind="stat"
        />
      </div>
      
      <SearchBar @search="emit('search', $event)" @filter="emit('filter')" />
      
      <slot name="content">
        <EmptyState
          :icon="config.icon"
          :create-label="config.createLabel"
          @create="emit('create')"
        />
      </slot>
    </div>
  </div>
</template>
```

---

#### 2. JuntaDashboard → JuntasDashboard.vue

- [ ] Convertir estado de flujo activo
  - [ ] `const flujoActivo = ref<FlujoTipo>('aporte-dinerario')`
  - [ ] `const flujoConfig = computed(() => FLUJOS_CONFIG.find(...))`

- [ ] Migrar selector de flujos
  - [ ] Componente separado `JuntaFlowSelector.vue`
  - [ ] Emit `flow-change`

- [ ] Migrar stats cards con trend
  - [ ] Componente `StatCardWithTrend.vue`

- [ ] Migrar sección de resúmenes
  - [ ] `v-if="flujoActivo === 'aporte-dinerario'"`
  - [ ] `v-for="resumen in RESUMENES_JUNTAS"`

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { FLUJOS_CONFIG, RESUMENES_JUNTAS } from '~/data/juntaFlows';

type FlujoTipo = 'aporte-dinerario' | 'remocion-apoderados' | 'nombramiento-apoderados';

const flujoActivo = ref<FlujoTipo>('aporte-dinerario');

const flujoConfig = computed(() => 
  FLUJOS_CONFIG.find(f => f.id === flujoActivo.value)!
);
</script>

<template>
  <div class="h-full overflow-auto">
    <div class="border-b px-8 py-6" style="border-color: var(--border-default)">
      <h1 class="text-2xl mb-1" style="color: var(--text-primary); font-family: var(--font-primary); font-weight: 700">
        Dashboard de Junta de Accionistas
      </h1>
      <p class="text-sm" style="color: var(--text-muted); font-family: var(--font-secondary)">
        Seguimiento y gestión de acuerdos societarios
      </p>
      
      <JuntaFlowSelector
        v-model="flujoActivo"
        :flows="FLUJOS_CONFIG"
      />
    </div>
    
    <div class="p-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCardWithTrend
          v-for="(stat, index) in flujoConfig.stats"
          :key="index"
          v-bind="stat"
        />
      </div>
      
      <div v-if="flujoActivo === 'aporte-dinerario'" class="mb-8">
        <h2 class="text-xl mb-2" style="color: var(--text-primary); font-family: var(--font-primary); font-weight: 600">
          Resumen Detallado por Junta
        </h2>
        <p class="text-sm mb-6" style="color: var(--text-muted); font-family: var(--font-secondary)">
          Análisis financiero y distribución accionaria antes y después de cada aporte
        </p>
        
        <div class="space-y-4">
          <JuntaResumenCard
            v-for="resumen in RESUMENES_JUNTAS"
            :key="resumen.id"
            :resumen="resumen"
          />
        </div>
      </div>
      
      <JuntaTable
        :config="flujoConfig"
        :flujo-activo="flujoActivo"
      />
    </div>
  </div>
</template>
```

---

#### 3. JuntaResumenCard → JuntaResumenCard.vue

- [ ] Migrar estado de expandido
  - [ ] `const expandido = ref(false)`

- [ ] Migrar funciones de formato
  - [ ] `formatMoney` como función helper
  - [ ] `formatPercent` como función helper

- [ ] Tabla compleja con headers dobles
  - [ ] Usar `<table>` nativo
  - [ ] `colspan` para agrupación

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { DollarSign, ChevronDown, ChevronUp, ArrowRight, PieChart } from 'lucide-vue-next';

interface ResumenJunta {
  id: number;
  sociedad: string;
  fecha: string;
  capitalAntes: number;
  capitalDespues: number;
  // ... más campos
}

const props = defineProps<{
  resumen: ResumenJunta;
}>();

const expandido = ref(false);

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatPercent = (value: number) => {
  return `${value.toFixed(2)}%`;
};
</script>

<template>
  <div class="bg-white rounded-xl border mb-4" style="border-color: var(--border-default); border-radius: var(--radius-large)">
    <button
      @click="expandido = !expandido"
      class="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
    >
      <div class="flex items-center gap-4">
        <div class="p-3 rounded-lg" style="background-color: var(--primary-100)">
          <DollarSign class="w-6 h-6" style="color: var(--primary-700)" />
        </div>
        <div class="text-left">
          <h3 class="text-lg mb-1" style="color: var(--text-primary); font-family: var(--font-primary); font-weight: 600">
            {{ resumen.sociedad }}
          </h3>
          <p class="text-sm" style="color: var(--text-muted); font-family: var(--font-secondary)">
            Junta realizada el {{ resumen.fecha }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center gap-6">
        <div class="text-right">
          <p class="text-2xl mb-1" style="color: var(--text-primary); font-family: var(--font-primary); font-weight: 700">
            {{ formatMoney(resumen.montoTotal) }}
          </p>
          <p class="text-xs" style="color: var(--text-muted); font-family: var(--font-secondary)">
            Monto Total Aportado
          </p>
        </div>
        <ChevronUp v-if="expandido" class="w-5 h-5" style="color: var(--text-secondary)" />
        <ChevronDown v-else class="w-5 h-5" style="color: var(--text-secondary)" />
      </div>
    </button>
    
    <div v-if="expandido" class="px-6 pb-6">
      <!-- Contenido expandible completo -->
    </div>
  </div>
</template>
```

---

#### 4. Composables

- [ ] Crear `useDashboardStats.ts`

```typescript
// composables/useDashboardStats.ts
export function useDashboardStats() {
  const sociedadesStats = computed(() => [
    { label: 'Total Sociedades', value: 45, icon: Building2, color: 'var(--primary-700)' },
    { label: 'Activas', value: 38, icon: TrendingUp, color: '#10B981' },
    { label: 'En Proceso', value: 5, icon: Clock, color: '#F59E0B' },
    { label: 'Inactivas', value: 2, icon: FileText, color: 'var(--gray-500)' }
  ]);
  
  return {
    sociedadesStats
  };
}
```

- [ ] Crear `useJuntaFlows.ts`

```typescript
// composables/useJuntaFlows.ts
import { ref, computed } from 'vue';

export function useJuntaFlows() {
  const flujoActivo = ref<FlujoTipo>('aporte-dinerario');
  
  const flujoConfig = computed(() => 
    FLUJOS_CONFIG.find(f => f.id === flujoActivo.value)!
  );
  
  const cambiarFlujo = (nuevoFlujo: FlujoTipo) => {
    flujoActivo.value = nuevoFlujo;
  };
  
  return {
    flujoActivo,
    flujoConfig,
    cambiarFlujo
  };
}
```

---

#### 5. Helpers de Formato

- [ ] Crear `/utils/formatters.ts`

```typescript
// utils/formatters.ts
export const formatMoney = (amount: number, currency: string = 'PEN') => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatPercent = (value: number, decimals: number = 2) => {
  return `${value.toFixed(decimals)}%`;
};

export const formatNumber = (value: number) => {
  return value.toLocaleString('es-PE');
};
```

---

#### 6. Data/Configuración

- [ ] Migrar configuraciones a archivos separados

```typescript
// data/dashboardConfigs.ts
export const sociedadesDashboardConfig = {
  title: 'Sociedades',
  subtitle: 'Gestión de sociedades y registros corporativos',
  icon: 'Building2',
  createLabel: 'Crear Sociedad',
  stats: [
    { label: 'Total Sociedades', value: 45, icon: 'Building2', color: 'var(--primary-700)' },
    { label: 'Activas', value: 38, icon: 'TrendingUp', color: '#10B981' },
    { label: 'En Proceso', value: 5, icon: 'Clock', color: '#F59E0B' },
    { label: 'Inactivas', value: 2, icon: 'FileText', color: 'var(--gray-500)' }
  ]
};
```

```typescript
// data/juntaFlows.ts
export const FLUJOS_CONFIG = [
  {
    id: 'aporte-dinerario',
    nombre: 'Aportes Dinerarios',
    descripcion: 'Aumentos de capital mediante aportes en efectivo',
    icon: 'DollarSign',
    color: 'var(--primary-700)',
    // ... stats, tablaColumnas, tablaData
  },
  // ... más flujos
];

export const RESUMENES_JUNTAS = [
  // ... data de resúmenes
];
```

---

### 🎯 Prioridades de Migración

#### Fase 1: Componentes Base (Semana 1)
1. ✅ DashboardLayout.vue
2. ✅ DashboardHeader.vue
3. ✅ StatCard.vue
4. ✅ StatCardWithTrend.vue
5. ✅ SearchBar.vue
6. ✅ EmptyState.vue

#### Fase 2: Dashboard de Sociedades (Semana 2)
7. ✅ SociedadesDashboard.vue
8. ✅ Página /pages/sociedades/index.vue
9. ✅ Helpers de formato
10. ✅ Composable useDashboardStats.ts

#### Fase 3: Dashboard de Juntas (Semana 3-4)
11. ✅ JuntasDashboard.vue
12. ✅ JuntaFlowSelector.vue
13. ✅ JuntaResumenCard.vue
14. ✅ JuntaTable.vue
15. ✅ Composable useJuntaFlows.ts
16. ✅ Data juntaFlows.ts

#### Fase 4: Testing y Refinamiento (Semana 5)
17. ✅ Tests unitarios de componentes
18. ✅ Tests de composables
19. ✅ Optimización de rendimiento
20. ✅ Responsive testing

---

## 📚 REFERENCIAS Y RECURSOS

### Documentación Oficial

- **Nuxt 4**: https://nuxt.com/docs
- **Vue 3**: https://vuejs.org/guide
- **Pinia**: https://pinia.vuejs.org
- **Tailwind CSS**: https://tailwindcss.com/docs
- **lucide-vue-next**: https://lucide.dev/guide/packages/lucide-vue-next

### Archivos Relacionados

- `/DOCS_VISUAL_CREAR_SOCIEDADES_Y_JUNTAS.md` - Wizards de creación
- `/DOCS_VISUAL_DESCARGA_DOCUMENTOS_JUNTAS.md` - Último paso de juntas
- `/DOCS_COMPLETA_REPOSITORIO_FINAL.md` - Sistema de repositorio

---

## 🎉 CONCLUSIÓN

Este documento proporciona una **documentación visual completa y exhaustiva** de los dashboards de Sociedades y Juntas en PROBO, incluyendo:

✅ **Anatomía visual detallada** de ambos dashboards
✅ **Código exacto React/TSX** de todos los componentes
✅ **Sistema de tokens CSS** PROBO
✅ **Componentes especializados** como JuntaResumenCard expandible
✅ **3 flujos de trabajo** en Dashboard de Juntas
✅ **Tablas dinámicas** con columnas por flujo
✅ **Interacciones del usuario** documentadas
✅ **Estados visuales** detallados
✅ **Checklist completo** para migración a Nuxt 4

Esta documentación permitirá **replicar perfectamente** la funcionalidad visual de los dashboards en Nuxt 4 o cualquier otro framework, manteniendo la consistencia del diseño PROBO.

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0.0
**Autor:** Sistema PROBO
