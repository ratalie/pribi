# 🎨 PLAN DE ESTILIZACIÓN: Sidebar Probo Figma

**Objetivo:** Aplicar estilos exactos del diseño Figma al componente `ProboSidebar.vue`

---

## 📋 ESPECIFICACIONES EXACTAS

### 1. 🎨 Colores

| Token | Hex Value | Uso |
|-------|-----------|-----|
| Background Main | `#3c28a4` | Fondo principal del sidebar |
| Logo Gradient Start | `#6347f4` | Inicio del gradiente del logo |
| Logo Gradient End | `#8b75ff` | Fin del gradiente del logo |
| Text White | `#FFFFFF` | Texto principal |
| Text White 70% | `rgba(255,255,255,0.7)` | Texto de secciones |
| Text White 60% | `rgba(255,255,255,0.6)` | Texto de sub-secciones |
| Text White 30% | `rgba(255,255,255,0.3)` | Texto deshabilitado |
| Hover BG | `rgba(255, 255, 255, 0.05)` | Fondo hover |
| Active BG | `rgba(255, 255, 255, 0.15)` | Fondo activo |
| Border Color | `rgba(255, 255, 255, 0.1)` | Bordes |

### 2. 🔤 Tipografía

| Elemento | Font | Size | Weight | Line Height |
|----------|------|------|--------|-------------|
| App Name | Gabarito | 20px (1.25rem) | 600 (SemiBold) | 1.75 |
| Section Title | Manrope | 14px (0.875rem) | 400 (Regular) | 1.25 |
| Sub-Section Title | Manrope | 12px (0.75rem) | 400 (Regular) | 1 |
| Item Label | Manrope | 14px (0.875rem) | 400 (Regular) | 1.25 |
| Active Item | Manrope | 14px (0.875rem) | 500 (Medium) | 1.25 |
| User Name | Manrope | 14px (0.875rem) | 500 (Medium) | 1.25 |
| User Role | Manrope | 12px (0.75rem) | 400 (Regular) | 1 |

### 3. 📐 Spacing & Dimensions

| Componente | Propiedad | Valor |
|------------|-----------|-------|
| Sidebar | Width | 280px (Fixed) |
| Logo Box | Size | 40px x 40px |
| Logo Box | Border Radius | 16px |
| Header | Padding | 24px (All sides) |
| Section Item | Padding | 8px (Vertical) 12px (Horizontal) |
| Section Item | Gap | 8px |
| Sub-Section Item | Padding | 8px (Vertical) 12px (Horizontal) |
| Leaf Item | Padding | 6px (Vertical) 8px (Horizontal) |
| Principal Item | Padding | 10px (Vertical) 12px (Horizontal) |
| User Footer | Padding | 16px (All sides) |
| Avatar | Size | 40px x 40px |

### 4. 🎯 Iconografía

| Icono | Contexto | Tamaño | Color Default | Color Active |
|-------|----------|--------|---------------|--------------|
| Shield | Logo | 24x24 | #FFFFFF | - |
| Building2 | Section: Registros | 16x16 | rgba(255,255,255,0.7) | - |
| Building2 | Sub: Sociedades | 14x14 | rgba(255,255,255,0.6) | - |
| MapPin | Sub: Sucursales | 14x14 | rgba(255,255,255,0.6) | - |
| Crown | Section: Operaciones | 16x16 | rgba(255,255,255,0.7) | - |
| Users | Sub: Directorio | 14x14 | rgba(255,255,255,0.6) | - |
| Crown | Sub: Junta | 14x14 | rgba(255,255,255,0.6) | - |
| Archive | Section: Storage | 16x16 | rgba(255,255,255,0.7) | - |
| Database | Item: Almacén | 16x16 | rgba(255,255,255,0.7) | #FFFFFF |
| FileText | Item: Documentos | 16x16 | rgba(255,255,255,0.7) | #FFFFFF |
| FolderKanban | Section: Espacios | 20x20 | rgba(255,255,255,0.7) | #FFFFFF |
| ChevronDown | Toggle Expanded | 16x16 | Inherit | - |
| ChevronRight | Toggle Collapsed | 16x16 | Inherit | - |

### 5. ✨ Efectos Visuales

#### Logo Gradient
```css
background: linear-gradient(135deg, #6347f4, #8b75ff);
```

#### Hover States
- Background: `rgba(255, 255, 255, 0.05)`
- Text: 70% → 100% white
- Transition: `150ms cubic-bezier(0.4, 0, 0.2, 1)`

#### Active States
- Background: `rgba(255, 255, 255, 0.15)`
- Text: `#FFFFFF`
- Font Weight: `500 (Medium)`

#### Scrollbar
- Width: `8px`
- Track: `#e2e2e4`
- Thumb: `#3c28a4`
- Thumb Hover: `#21194d`

---

## 📝 PLAN DE IMPLEMENTACIÓN

### Fase 1: Variables CSS y Colores Base
- [ ] Actualizar variables CSS con colores exactos
- [ ] Configurar gradiente del logo
- [ ] Definir colores de texto con opacidades

### Fase 2: Tipografía
- [ ] Asegurar que Gabarito y Manrope estén cargadas
- [ ] Aplicar fuentes según especificación
- [ ] Ajustar tamaños y pesos de fuente

### Fase 3: Estructura y Spacing
- [ ] Ajustar ancho del sidebar a 280px
- [ ] Aplicar padding exacto en header (24px)
- [ ] Ajustar padding de items según nivel
- [ ] Configurar logo box (40x40px, border-radius 16px)

### Fase 4: Iconografía
- [ ] Verificar iconos correctos según especificación
- [ ] Ajustar tamaños de iconos (16px, 14px, 20px)
- [ ] Aplicar colores con opacidades correctas
- [ ] Configurar iconos activos (#FFFFFF)

### Fase 5: Estados Interactivos
- [ ] Implementar hover states (bg rgba(255,255,255,0.05))
- [ ] Implementar active states (bg rgba(255,255,255,0.15))
- [ ] Aplicar transiciones (150ms cubic-bezier)
- [ ] Cambiar peso de fuente en activo (500)

### Fase 6: Scrollbar Personalizado
- [ ] Estilizar scrollbar (8px width)
- [ ] Configurar track y thumb
- [ ] Aplicar hover en thumb

### Fase 7: Footer Usuario
- [ ] Ajustar padding (16px)
- [ ] Aplicar tipografía correcta
- [ ] Estilizar avatar (40x40px)

---

## 🎯 ORDEN DE EJECUCIÓN

1. **Variables CSS** → Base de colores
2. **Tipografía** → Fuentes y tamaños
3. **Estructura** → Width, padding, spacing
4. **Iconografía** → Iconos y tamaños
5. **Estados** → Hover y active
6. **Scrollbar** → Personalización
7. **Footer** → Usuario

---

## ✅ CHECKLIST FINAL

- [ ] Colores exactos aplicados
- [ ] Tipografía correcta (Gabarito + Manrope)
- [ ] Spacing según especificación
- [ ] Iconos con tamaños y colores correctos
- [ ] Hover states funcionando
- [ ] Active states funcionando
- [ ] Scrollbar personalizado
- [ ] Logo con gradiente
- [ ] Footer usuario estilizado

---

**¿Listo para implementar?**



