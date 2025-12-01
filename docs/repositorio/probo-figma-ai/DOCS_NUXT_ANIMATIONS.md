# ✨ DOCUMENTACIÓN ANIMACIONES - REPOSITORIO PROBO
## Guía Completa de Transiciones y Animaciones

---

## 📋 TIPOS DE ANIMACIONES

El sistema usa principalmente **transiciones CSS** de Tailwind. NO se usa Motion/Framer Motion en este módulo.

---

## 🎬 TRANSICIONES PRINCIPALES

### Clase transition-all
Anima TODAS las propiedades que cambien.

```tsx
className="transition-all"
```

**Uso:** Cards, botones, contenedores interactivos

**Propiedades animadas:**
- `box-shadow` (hover shadows)
- `transform` (scales, translates)
- `background-color`
- `border-color`

**Duración por defecto:** `150ms` (Tailwind default)

### Clase transition-colors
Anima SOLO los colores.

```tsx
className="transition-colors"
```

**Uso:** Botones secundarios, items de lista

**Propiedades animadas:**
- `background-color`
- `color`
- `border-color`

**Duración por defecto:** `150ms`

### Clase transition-opacity
Anima SOLO la opacidad.

```tsx
className="transition-opacity"
```

**Uso:** Iconos que aparecen en hover

**Propiedades animadas:**
- `opacity`

### Clase transition-transform
Anima SOLO transformaciones.

```tsx
className="transition-transform"
```

**Uso:** Chevrons que rotan, elementos que se mueven

**Propiedades animadas:**
- `transform` (translate, rotate, scale)

---

## 🎯 ANIMACIONES POR COMPONENTE

### 1. SIDEBAR - Tabs de Navegación

#### Tab Hover (inactivo)
```tsx
<button
  className="transition-all hover:bg-gray-50"
>
```

**Animación:**
- `background-color`: transparent → `#F9FAFB`
- Duración: `150ms`
- Easing: ease

#### Tab Active (cambio de estado)
```tsx
<button
  className={`
    transition-all
    ${currentView === tab.id 
      ? 'bg-[#EEF2FF] shadow-sm' 
      : 'hover:bg-gray-50'
    }
  `}
>
```

**Animación al activar:**
- `background-color`: transparent → `#EEF2FF`
- `box-shadow`: none → `shadow-sm`
- `color` (texto): `var(--text-primary)` → `#3C28A4`
- `color` (icono): `#6B7280` → `#3C28A4`
- `font-weight`: `400` → `600`
- Duración: `150ms`

---

### 2. SELECTOR DE SOCIEDAD

#### Botón Hover
```tsx
<button
  className="hover:shadow-md transition-all group"
>
```

**Animación:**
- `box-shadow`: none → `shadow-md`
- Duración: `150ms`

#### Chevron Hover
```tsx
<ChevronDown 
  className="group-hover:translate-y-0.5 transition-transform" 
/>
```

**Animación:**
- `transform`: `translateY(0)` → `translateY(2px)`
- Duración: `150ms`
- Activa con: `group-hover` (cuando el padre recibe hover)

#### Dropdown Items Hover
```tsx
<DropdownMenuItem
  className="hover:bg-gray-50 transition-colors"
>
```

**Animación:**
- `background-color`: transparent → `#F9FAFB`
- Duración: `150ms`

---

### 3. CARDS DEL DASHBOARD

#### Card Hover
```tsx
<div 
  className="hover:shadow-lg transition-all cursor-pointer group"
>
```

**Animación:**
- `box-shadow`: none → `shadow-lg`
- Duración: `150ms`
- Cursor cambia a pointer

#### Flecha de Navegación (aparece en hover)
```tsx
<ArrowRight 
  className="opacity-0 group-hover:opacity-100 transition-opacity" 
/>
```

**Animación:**
- `opacity`: `0` → `1`
- Duración: `150ms`
- Activa con: `group-hover`

**Cómo funciona:**
1. Card tiene clase `group`
2. Flecha tiene `opacity-0` inicial
3. Al hacer hover en card (grupo), flecha recibe `group-hover:opacity-100`
4. La flecha aparece suavemente

---

### 4. BUSCADOR GLOBAL

#### Input Focus
```tsx
<input
  className="focus:outline-none focus:ring-2 transition-all"
  style={{ borderColor: 'var(--border-light)' }}
/>
```

**Animación:**
- `box-shadow` (ring): none → `0 0 0 2px #3C28A4`
- `border-color`: puede cambiar si se aplica
- Duración: `150ms`

**Focus ring:**
- Color: `#3C28A4` (morado PROBO)
- Width: `2px`
- Offset: `0px`

---

### 5. DOCUMENTOS SOCIETARIOS

#### Grid/List Item Hover
```tsx
<div 
  className="hover:bg-gray-50 transition-colors cursor-pointer"
>
```

**Animación:**
- `background-color`: white → `#F9FAFB`
- Duración: `150ms`

#### Preview Modal Open/Close
```tsx
/* Modal Overlay */
<div className="transition-opacity duration-300">
  {/* opacity: 0 → 1 al abrir */}
</div>

/* Modal Content */
<div className="transition-all duration-300">
  {/* scale: 0.95 → 1 al abrir */}
  {/* opacity: 0 → 1 al abrir */}
</div>
```

**Animación de apertura:**
- Overlay: `opacity` 0 → 1 (300ms)
- Content: `scale` 0.95 → 1 (300ms)
- Content: `opacity` 0 → 1 (300ms)

**Animación de cierre:**
- Inversa de la apertura

---

### 6. DOCUMENTOS GENERADOS

#### Carpeta Expandible/Colapsable

##### Chevron Rotación
```tsx
<ChevronRight 
  className={`
    transition-transform
    ${expanded ? 'rotate-90' : ''}
  `}
/>
```

**Animación:**
- `transform`: `rotate(0deg)` → `rotate(90deg)`
- Duración: `150ms`
- Easing: ease

##### Contenido Expandible
```tsx
{expanded && (
  <div className="transition-all duration-200">
    {/* Contenido */}
  </div>
)}
```

**Animación:**
- `height`: `0` → `auto` (con max-height trick)
- `opacity`: `0` → `1`
- Duración: `200ms`

**Implementación alternativa con smooth expand:**
```tsx
<div 
  className="overflow-hidden transition-all duration-200"
  style={{ 
    maxHeight: expanded ? '500px' : '0',
    opacity: expanded ? 1 : 0
  }}
>
```

---

### 7. CARPETAS PERSONALIZADAS

#### Card Hover
```tsx
<div 
  className="hover:shadow-lg transition-all cursor-pointer group"
>
```

**Animación:**
- `box-shadow`: none → `shadow-lg`
- Duración: `150ms`

#### Card con Gradiente
El gradiente NO se anima, solo el shadow.

---

### 8. CARPETA DETAIL VIEW - TABS

#### Tab Hover (inactivo)
```tsx
<button
  className="transition-colors hover:bg-gray-50"
>
```

**Animación:**
- `background-color`: transparent → `#F9FAFB`
- Duración: `150ms`

#### Tab Active (cambio)
```tsx
<button
  className={`
    transition-all
    ${activeTab === tab.id 
      ? 'border-b-2 border-[#3C28A4]' 
      : 'border-b-2 border-transparent'
    }
  `}
>
```

**Animación:**
- `border-color`: transparent → `#3C28A4`
- `color` (texto): `var(--text-muted)` → `#3C28A4`
- `font-weight`: `400` → `500`
- Duración: `150ms`

---

### 9. CHAT IA

#### Mensaje Nuevo (aparición)
```tsx
<div className="animate-in slide-in-from-bottom duration-300">
  {/* Mensaje */}
</div>
```

**Animación:**
- `transform`: `translateY(10px)` → `translateY(0)`
- `opacity`: `0` → `1`
- Duración: `300ms`

**Implementación con Tailwind Animate:**
```tsx
<div className="transition-all duration-300" style={{
  transform: 'translateY(0)',
  opacity: 1
}}>
```

#### Typing Indicator (puntos animados)
```tsx
<div className="flex gap-1">
  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
</div>
```

**Animación:**
- Cada punto hace bounce con delay escalonado
- Duración: `1s` (loop infinito)

---

### 10. BOTONES

#### Botón Primary
```tsx
<button
  className="hover:shadow-md transition-all"
  style={{ backgroundColor: 'var(--primary-700)' }}
>
```

**Animación:**
- `box-shadow`: none → `shadow-md`
- Duración: `150ms`

**Opcional - Hover scale:**
```tsx
<button
  className="hover:shadow-md hover:scale-105 transition-all"
>
```

**Animación con scale:**
- `box-shadow`: none → `shadow-md`
- `transform`: `scale(1)` → `scale(1.05)`
- Duración: `150ms`

#### Botón Secondary/Outline
```tsx
<button
  className="hover:bg-gray-50 transition-colors"
>
```

**Animación:**
- `background-color`: transparent → `#F9FAFB`
- Duración: `150ms`

#### Botón Icon
```tsx
<button
  className="hover:bg-gray-200 rounded-lg transition-colors"
>
```

**Animación:**
- `background-color`: transparent → `#E5E7EB`
- Duración: `150ms`

---

### 11. PROGRESS BAR

#### Animación de Llenado
```tsx
<div 
  className="h-2 rounded-full transition-all" 
  style={{ 
    width: `${percentage}%`,
    backgroundColor: '#3B82F6'
  }}
/>
```

**Animación:**
- `width`: `0%` → `{percentage}%`
- Duración: `150ms` (por defecto con transition-all)

**Para animación más larga:**
```tsx
className="h-2 rounded-full transition-all duration-500"
```

**Animación:**
- `width`: animación suave de 500ms

---

### 12. LISTAS - Actividad Reciente / Archivos

#### Item Hover
```tsx
<div 
  className="hover:bg-gray-50 cursor-pointer transition-colors"
>
```

**Animación:**
- `background-color`: transparent → `#F9FAFB`
- Duración: `150ms`

#### Botón de Descarga Hover
```tsx
<button 
  className="hover:bg-gray-200 rounded-lg transition-colors"
>
```

**Animación:**
- `background-color`: transparent → `#E5E7EB`
- Duración: `150ms`

---

## 🎨 DURACIONES ESTÁNDAR

### Por Tipo de Animación

```css
/* Rápida - Hover states simples */
transition-all                    /* 150ms (default) */
transition-colors                 /* 150ms */

/* Media - Expansión de elementos */
transition-all duration-200       /* 200ms */

/* Lenta - Modales y overlays */
transition-all duration-300       /* 300ms */

/* Muy lenta - Efectos especiales */
transition-all duration-500       /* 500ms */
```

### Recomendaciones
- **Hovers:** `150ms` (default)
- **Cambios de estado:** `150-200ms`
- **Expansión/colapso:** `200ms`
- **Modales:** `300ms`
- **Progress bars:** `500ms`

---

## 🔄 EASING / TIMING FUNCTIONS

Tailwind usa `ease` por defecto, que es perfecto para la mayoría de casos.

### Easing por Defecto
```css
transition-all  /* uses ease (cubic-bezier(0.4, 0, 0.2, 1)) */
```

### Otros Easings Disponibles
```css
ease-linear     /* linear */
ease-in         /* cubic-bezier(0.4, 0, 1, 1) */
ease-out        /* cubic-bezier(0, 0, 0.2, 1) */
ease-in-out     /* cubic-bezier(0.4, 0, 0.2, 1) */
```

**Para este proyecto:** Usar el default `ease` en todo.

---

## ⚡ PERFORMANCE

### GPU Acceleration
Las siguientes propiedades activan aceleración GPU:

```css
transform      /* ✅ Perfecto para animaciones */
opacity        /* ✅ Perfecto para animaciones */
```

### Evitar Animar
```css
width          /* ⚠️ Causa reflow */
height         /* ⚠️ Causa reflow */
margin         /* ⚠️ Causa reflow */
padding        /* ⚠️ Causa reflow */
```

### Alternativas Optimizadas
```css
/* En vez de animar width/height */
transform: scale()    /* ✅ Mejor performance */

/* En vez de animar margin/padding */
transform: translate() /* ✅ Mejor performance */
```

---

## 🎬 SECUENCIAS DE ANIMACIÓN

### Loading States

Si se implementa loading, usar esto:

```tsx
/* Skeleton loading */
<div className="animate-pulse bg-gray-200 rounded-lg">
```

**Animación:**
- `opacity`: pulsa entre 1 y 0.5
- Duración: `2s` (loop infinito)

### Staggered Animations

Para listas que aparecen con delay:

```tsx
{items.map((item, index) => (
  <div 
    key={item.id}
    className="transition-all duration-300"
    style={{ 
      transitionDelay: `${index * 50}ms`,
      opacity: 1,
      transform: 'translateY(0)'
    }}
  >
    {/* Contenido */}
  </div>
))}
```

**Animación:**
- Cada item aparece 50ms después del anterior
- Efecto cascada suave

---

## 📱 ANIMACIONES RESPONSIVAS

Las animaciones son las mismas en mobile y desktop.

**Excepción:** Modales pueden tener transiciones diferentes:

```tsx
/* Desktop - scale up */
<div className="hidden md:block transition-all duration-300 scale-100">

/* Mobile - slide up */
<div className="md:hidden transition-all duration-300 translate-y-0">
```

---

## ✅ CHECKLIST DE ANIMACIONES

Al implementar en Nuxt, verificar:

- [ ] Todas las transiciones usan clases de Tailwind
- [ ] Hovers tienen `transition-colors` o `transition-all`
- [ ] Cards usan `hover:shadow-lg transition-all`
- [ ] Iconos que aparecen usan `opacity-0 group-hover:opacity-100`
- [ ] Chevrons que rotan usan `transition-transform`
- [ ] Inputs tienen `focus:ring-2 transition-all`
- [ ] Modales tienen animación de 300ms
- [ ] Duraciones son consistentes (150ms para hovers)
- [ ] No se animan propiedades que causan reflow
- [ ] Progress bars tienen animación suave

---

## 🚫 LO QUE NO SE USA

En este módulo NO se usa:

- ❌ Motion / Framer Motion
- ❌ Animaciones CSS @keyframes custom
- ❌ Animaciones JavaScript manuales
- ❌ Librerías de animación externas

**Solo se usa:** Transiciones CSS de Tailwind

---

## 💡 TIPS PARA NUXT 4

### Vue Transitions
Si necesitas transiciones de Vue en modales o vistas:

```vue
<Transition
  enter-active-class="transition-all duration-300"
  leave-active-class="transition-all duration-300"
  enter-from-class="opacity-0 scale-95"
  enter-to-class="opacity-100 scale-100"
  leave-from-class="opacity-100 scale-100"
  leave-to-class="opacity-0 scale-95"
>
  <div v-if="isOpen">Modal</div>
</Transition>
```

### Directivas Vue
```vue
<div 
  v-show="expanded"
  class="transition-all duration-200"
  :style="{ 
    maxHeight: expanded ? '500px' : '0',
    opacity: expanded ? 1 : 0
  }"
>
```

---

**Continúa en:** `DOCS_NUXT_DATA.md` para estructuras de datos

