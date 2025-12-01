# 🎨 DOCUMENTACIÓN ESTILOS - REPOSITORIO PROBO
## Guía Completa de Design System y Estilos

---

## 📋 VARIABLES CSS GLOBALES

### Archivo de Variables
`/styles/globals.css`

```css
:root {
  /* ===== COLORES PRINCIPALES ===== */
  --primary-800: #3C28A4;
  --primary-700: #3C28A4;
  --primary-600: #4F46E5;
  
  /* ===== TEXTO ===== */
  --text-primary: #1F2937;
  --text-muted: #6B7280;
  
  /* ===== BACKGROUNDS ===== */
  --bg-muted: #F9FAFB;
  
  /* ===== BORDERS ===== */
  --border-light: #E5E7EB;
  
  /* ===== FUENTES ===== */
  --font-primary: 'Gabarito', sans-serif;
  --font-secondary: 'Manrope', sans-serif;
}
```

---

## 🎨 PALETA DE COLORES COMPLETA

### Morados (Primary)
```css
#3C28A4  /* Morado principal PROBO - primary-700/800 */
#4F46E5  /* Morado más claro - primary-600 */
#6366F1  /* Indigo - para gráficos */
#8B5CF6  /* Púrpura - para gráficos */
#A78BFA  /* Púrpura claro - para gráficos */
#A855F7  /* Púrpura vibrante - carpetas personalizadas */
```

### Backgrounds de Iconos (muy claros)
```css
#EEF2FF  /* Morado muy claro - iconos primary */
#F3E8FF  /* Púrpura muy claro - iconos purple */
#DBEAFE  /* Azul muy claro - iconos info */
#FEF3C7  /* Amarillo muy claro - iconos warning */
#D1FAE5  /* Verde muy claro - iconos success */
#FEE2E2  /* Rojo muy claro - iconos error */
#F9FAFB  /* Gris muy claro - backgrounds neutros */
#F3F4F6  /* Gris claro - backgrounds secundarios */
```

### Colores de Estado
```css
#10B981  /* Verde - success, positivo */
#F59E0B  /* Amarillo - warning, atención */
#DC2626  /* Rojo - error, peligro */
#3B82F6  /* Azul - info, información */
```

### Grises
```css
#1F2937  /* Gris oscuro - texto principal */
#6B7280  /* Gris medio - texto secundario/muted */
#9CA3AF  /* Gris claro - borders de gráficos */
#E5E7EB  /* Gris muy claro - borders principales */
#F9FAFB  /* Gris casi blanco - backgrounds */
```

---

## 🔤 TIPOGRAFÍAS

### Fuentes Base
```css
/* Gabarito - Headings */
font-family: 'Gabarito', sans-serif;
font-weights: 400, 500, 600, 700

/* Manrope - Body */
font-family: 'Manrope', sans-serif;
font-weights: 400, 500, 600, 700
```

### Importación en HTML
```html
<link href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Uso Correcto

#### Títulos y Headings
```tsx
/* H1 - Páginas principales */
<h1 style={{ 
  fontFamily: 'var(--font-primary)',  // Gabarito
  fontWeight: 700,                      // Bold
  color: 'var(--text-primary)'
}}>

/* H2 - Secciones */
<h2 className="text-2xl" style={{ 
  fontFamily: 'var(--font-primary)',  // Gabarito
  fontWeight: 600,                      // Semi-bold
  color: 'var(--text-primary)'
}}>

/* H3 - Sub-secciones, Cards */
<h3 className="text-xl" style={{ 
  fontFamily: 'var(--font-primary)',  // Gabarito
  fontWeight: 600,                      // Semi-bold
  color: 'var(--text-primary)'
}}>
```

#### Body Text
```tsx
/* Párrafos normales */
<p style={{ 
  fontFamily: 'var(--font-secondary)',  // Manrope
  fontWeight: 400,                        // Regular
  color: 'var(--text-primary)'
}}>

/* Párrafos con énfasis */
<p style={{ 
  fontFamily: 'var(--font-secondary)',  // Manrope
  fontWeight: 500,                        // Medium
  color: 'var(--text-primary)'
}}>

/* Texto secundario/muted */
<p className="text-sm" style={{ 
  fontFamily: 'var(--font-secondary)',  // Manrope
  color: 'var(--text-muted)'            // Gris
}}>

/* Texto extra pequeño */
<p className="text-xs" style={{ 
  fontFamily: 'var(--font-secondary)',  // Manrope
  color: 'var(--text-muted)'
}}>
```

### ⚠️ IMPORTANTE: NO Usar Clases Tailwind para Tipografía
```tsx
/* ❌ INCORRECTO */
<h1 className="text-3xl font-bold">

/* ✅ CORRECTO */
<h1 className="text-3xl" style={{ 
  fontFamily: 'var(--font-primary)',
  fontWeight: 600,
  color: 'var(--text-primary)'
}}>
```

**Razón:** Las tipografías están pre-configuradas en globals.css y usar clases Tailwind puede sobreescribirlas.

---

## 📐 ESPACIADOS Y MEDIDAS

### Sistema de Espaciado (Tailwind)
```css
/* Padding */
p-2  = 8px
p-3  = 12px
p-4  = 16px
p-6  = 24px
p-8  = 32px

/* Margin */
m-2  = 8px
m-3  = 12px
m-4  = 16px
m-6  = 24px
m-8  = 32px

/* Gap (en grids y flex) */
gap-2  = 8px
gap-3  = 12px
gap-4  = 16px
gap-6  = 24px
gap-8  = 32px
```

### Medidas Estándar del Sistema

#### Cards
```css
/* Card grande */
padding: p-6 (24px)
border-radius: rounded-xl (12px)
border: 1px solid var(--border-light)

/* Card pequeño / Stat card */
padding: p-4 (16px)
border-radius: rounded-lg (8px)
border: 1px solid var(--border-light)

/* Mini card / Métrica */
padding: p-3 (12px)
border-radius: rounded-lg (8px)
background: #F9FAFB
```

#### Contenedores de Iconos
```css
/* Icono grande (28px) */
.icon-container {
  padding: 12px (p-3);
  border-radius: 8px (rounded-lg);
  icon-size: 28px (w-7 h-7);
}

/* Icono mediano (24px) */
.icon-container {
  padding: 8px (p-2);
  border-radius: 8px (rounded-lg);
  icon-size: 24px (w-6 h-6);
}

/* Icono pequeño (20px) */
.icon-container {
  padding: 8px (p-2);
  border-radius: 6px (rounded);
  icon-size: 20px (w-5 h-5);
}
```

#### Grids
```css
/* Dashboard - 2 columnas en desktop */
.grid {
  grid-template-columns: repeat(1, 1fr);
  lg:grid-template-columns: repeat(2, 1fr);
  gap: 24px (gap-6);
}

/* Estadísticas - 4 columnas */
.grid {
  grid-template-columns: repeat(1, 1fr);
  md:grid-template-columns: repeat(2, 1fr);
  lg:grid-template-columns: repeat(4, 1fr);
  gap: 16px (gap-4);
}

/* Carpetas personalizadas stats - 4 columnas */
.grid {
  grid-template-columns: repeat(2, 1fr);
  md:grid-template-columns: repeat(4, 1fr);
  gap: 16px (gap-4);
}
```

---

## 🎴 COMPONENTES ESTÁNDAR

### Card Básico
```tsx
<div 
  className="bg-white rounded-xl p-6 border"
  style={{ borderColor: 'var(--border-light)' }}
>
  {/* Contenido */}
</div>
```

### Card con Hover
```tsx
<div 
  className="bg-white rounded-xl p-6 border hover:shadow-lg transition-all cursor-pointer"
  style={{ borderColor: 'var(--border-light)' }}
>
  {/* Contenido */}
</div>
```

### Card con Gradiente (Carpetas Personalizadas)
```tsx
<div 
  className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border hover:shadow-lg transition-all cursor-pointer"
  style={{ borderColor: 'var(--border-light)' }}
>
  {/* Contenido */}
</div>
```

### Contenedor de Icono (Primary)
```tsx
<div 
  className="p-3 rounded-lg"
  style={{ backgroundColor: '#EEF2FF' }}
>
  <Icon 
    className="w-7 h-7" 
    style={{ color: 'var(--primary-700)' }} 
  />
</div>
```

### Contenedor de Icono (Success)
```tsx
<div 
  className="p-2 rounded-lg"
  style={{ backgroundColor: '#D1FAE5' }}
>
  <Icon 
    className="w-5 h-5" 
    style={{ color: '#10B981' }} 
  />
</div>
```

### Badge de Estado
```tsx
<div 
  className="flex items-center gap-1 text-sm"
  style={{ color: '#10B981' }}
>
  <TrendingUp className="w-4 h-4" />
  <span>+12%</span>
</div>
```

### Progress Bar
```tsx
<div className="w-full bg-gray-200 rounded-full h-2">
  <div 
    className="h-2 rounded-full transition-all" 
    style={{ 
      width: `${percentage}%`,
      backgroundColor: '#3B82F6'
    }}
  />
</div>
```

### Botón Primary
```tsx
<button
  className="px-4 py-3 rounded-xl hover:shadow-md transition-all"
  style={{ 
    backgroundColor: 'var(--primary-700)',
    color: 'white',
    fontFamily: 'var(--font-secondary)',
    fontWeight: 500
  }}
>
  Texto del Botón
</button>
```

### Botón Secondary (outline)
```tsx
<button
  className="px-4 py-3 rounded-xl border hover:bg-gray-50 transition-colors"
  style={{ 
    borderColor: 'var(--border-light)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-secondary)',
    fontWeight: 500
  }}
>
  Texto del Botón
</button>
```

### Input de Texto
```tsx
<input
  type="text"
  className="px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
  style={{ 
    borderColor: 'var(--border-light)',
    fontFamily: 'var(--font-secondary)'
  }}
  placeholder="Placeholder..."
/>
```

**Focus Ring:** `ring-color: #3C28A4` (morado PROBO)

---

## 🎯 COMBINACIONES DE COLORES POR TIPO

### Iconos por Categoría

#### Documentos / Societarios
```tsx
background: #EEF2FF  /* Morado claro */
iconColor: #3C28A4  /* Morado PROBO */
```

#### Información / Data
```tsx
background: #DBEAFE  /* Azul claro */
iconColor: #3B82F6  /* Azul */
```

#### Carpetas / Organización
```tsx
background: #F3E8FF  /* Púrpura claro */
iconColor: #A855F7  /* Púrpura */
```

#### Métricas / Estadísticas
```tsx
background: #FEF3C7  /* Amarillo claro */
iconColor: #F59E0B  /* Amarillo */
```

#### Usuarios / Actividad
```tsx
background: #D1FAE5  /* Verde claro */
iconColor: #10B981  /* Verde */
```

#### Alertas / Errores
```tsx
background: #FEE2E2  /* Rojo claro */
iconColor: #DC2626  /* Rojo */
```

---

## 📊 ESTILOS DE GRÁFICOS (Recharts)

### Colores de Barras
```tsx
<Bar 
  dataKey="documentos" 
  fill="#3C28A4"  /* Morado PROBO */
  radius={[8, 8, 0, 0]}  /* Bordes redondeados arriba */
/>
```

### Colores de Líneas
```tsx
<Line 
  type="monotone" 
  dataKey="vistas" 
  stroke="#3C28A4"  /* Morado PROBO */
  strokeWidth={2}
  dot={{ fill: '#3C28A4', r: 4 }}
/>

<Line 
  type="monotone" 
  dataKey="descargas" 
  stroke="#10B981"  /* Verde success */
  strokeWidth={2}
  dot={{ fill: '#10B981', r: 4 }}
/>
```

### Colores de Pie Chart
```typescript
const documentosPorTipo = [
  { nombre: 'Sociedades', valor: 45, color: '#3C28A4' },  // Morado PROBO
  { nombre: 'Juntas', valor: 156, color: '#6366F1' },     // Indigo
  { nombre: 'Sucursales', valor: 28, color: '#8B5CF6' },  // Púrpura
  { nombre: 'Directorio', valor: 89, color: '#A78BFA' },  // Púrpura claro
];
```

### Estilos de Grid y Axes
```tsx
<CartesianGrid 
  strokeDasharray="3 3" 
  stroke="#E5E7EB"  /* Gris claro */
/>

<XAxis 
  dataKey="mes" 
  style={{ 
    fontSize: '12px', 
    fontFamily: 'var(--font-secondary)' 
  }}
  stroke="#9CA3AF"  /* Gris medio */
/>

<YAxis 
  style={{ 
    fontSize: '12px', 
    fontFamily: 'var(--font-secondary)' 
  }}
  stroke="#9CA3AF"
/>
```

### Tooltip Style
```tsx
<Tooltip 
  contentStyle={{ 
    backgroundColor: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    fontFamily: 'var(--font-secondary)'
  }}
/>
```

---

## 🎨 SHADOWS (Sombras)

### Shadow Niveles
```css
/* Tailwind shadows */
shadow-sm   /* Sombra sutil */
shadow-md   /* Sombra media */
shadow-lg   /* Sombra grande */

/* Uso en hover */
hover:shadow-md
hover:shadow-lg
```

### Aplicación
```tsx
/* Cards interactivos */
className="hover:shadow-lg transition-all"

/* Tabs activos en sidebar */
className={currentView === tab.id && 'shadow-sm'}

/* Botones */
className="hover:shadow-md transition-all"
```

---

## 🔲 BORDERS

### Border Standard
```tsx
/* Border con color variable */
className="border"
style={{ borderColor: 'var(--border-light)' }}

/* Border bottom */
className="border-b"
style={{ borderColor: 'var(--border-light)' }}

/* Border right */
className="border-r"
style={{ borderColor: 'var(--border-light)' }}
```

### Border Radius
```css
rounded       /* 4px - pequeño */
rounded-lg    /* 8px - medio */
rounded-xl    /* 12px - grande (cards) */
rounded-full  /* círculo completo */
```

### Uso por Componente
```css
/* Cards grandes */
border-radius: rounded-xl (12px)

/* Cards pequeños / Stats */
border-radius: rounded-lg (8px)

/* Botones / Inputs */
border-radius: rounded-xl (12px)

/* Iconos containers */
border-radius: rounded-lg (8px)

/* Avatares */
border-radius: rounded-full

/* Progress bars */
border-radius: rounded-full
```

---

## 📱 RESPONSIVIDAD

### Breakpoints Tailwind
```css
sm:  640px   /* Small */
md:  768px   /* Medium */
lg:  1024px  /* Large */
xl:  1280px  /* Extra Large */
2xl: 1536px  /* 2X Large */
```

### Grids Responsivos

#### Dashboard - Carpetas del Sistema
```tsx
className="grid grid-cols-1 lg:grid-cols-2 gap-6"
/* Mobile: 1 columna */
/* Desktop (1024px+): 2 columnas */
```

#### Estadísticas Generales
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
/* Mobile: 1 columna */
/* Tablet (768px+): 2 columnas */
/* Desktop (1024px+): 4 columnas */
```

#### Carpetas Personalizadas - Stats
```tsx
className="grid grid-cols-2 md:grid-cols-4 gap-4"
/* Mobile: 2 columnas */
/* Tablet (768px+): 4 columnas */
```

### Sidebar Responsivo
```tsx
/* Desktop: siempre visible (280px fijo) */
className="w-[280px]"

/* Mobile: podría ser un drawer/overlay */
/* (implementación depende de diseño mobile) */
```

---

## 🎭 ESTADOS VISUALES

### Hover States

#### Cards
```tsx
className="hover:shadow-lg transition-all cursor-pointer"
```

#### Botones
```tsx
className="hover:bg-gray-50 transition-colors"
/* O */
className="hover:shadow-md transition-all"
```

#### Links
```tsx
className="hover:underline"
```

#### Iconos interactivos
```tsx
className="opacity-0 group-hover:opacity-100 transition-opacity"
```

### Active States (Tabs)
```tsx
/* Tab activo */
className="bg-[#EEF2FF] shadow-sm"
iconStyle={{ color: '#3C28A4' }}
textStyle={{ color: '#3C28A4', fontWeight: 600 }}

/* Tab inactivo */
className="hover:bg-gray-50"
iconStyle={{ color: '#6B7280' }}
textStyle={{ color: 'var(--text-primary)', fontWeight: 400 }}
```

### Focus States
```tsx
className="focus:outline-none focus:ring-2"
/* Ring color: #3C28A4 (morado PROBO) */
```

### Disabled States
```tsx
className="opacity-60 cursor-not-allowed"
```

---

## 📏 LAYOUT CONSTRAINTS

### Max-Width Content
```tsx
/* Contenedor principal */
className="max-w-[1600px] mx-auto px-8 py-6"
```

### Sidebar Fixed Width
```tsx
className="w-[280px]"  /* 280px fijo */
```

### Dropdown Widths
```tsx
/* Selector de sociedad */
className="w-[400px]"
```

---

## 🎨 GRADIENTES

### Gradiente Carpetas Personalizadas
```tsx
className="bg-gradient-to-br from-purple-50 to-blue-50"
```

**Colores:**
- `from-purple-50`: #F3E8FF
- `to-blue-50`: #EFF6FF

---

## ✅ CHECKLIST DE ESTILOS

Al implementar en Nuxt, verificar:

- [ ] Variables CSS configuradas en globals.css
- [ ] Fuentes Gabarito y Manrope importadas
- [ ] Todos los colores usan variables CSS
- [ ] NO se usan clases Tailwind para font-size/weight/height
- [ ] Todos los borders usan var(--border-light)
- [ ] Todos los border-radius son consistentes
- [ ] Todos los paddings siguen el sistema de espaciado
- [ ] Shadows aplicadas correctamente en hover
- [ ] Transiciones aplicadas en estados hover/focus
- [ ] Focus ring en inputs usa color morado
- [ ] Iconos tienen tamaños consistentes
- [ ] Grids son responsivos
- [ ] Colores de gráficos coinciden con la paleta

---

**Continúa en:** `DOCS_NUXT_ANIMATIONS.md` para animaciones detalladas

