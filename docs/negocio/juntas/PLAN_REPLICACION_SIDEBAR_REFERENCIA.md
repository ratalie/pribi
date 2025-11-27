# 🎯 Plan de Replicación: Sidebar Derecho de Referencia

## 📋 Objetivo

Replicar exactamente la funcionalidad y estilos del sidebar derecho del proyecto de referencia (`sidebar-derecho-react-vue-figma-ai`) en nuestro proyecto actual.

---

## 🔍 Análisis de Diferencias Clave

### **1. Funcionalidad de Hijos Expandibles**

#### **Referencia:**
- ✅ Control manual de expansión/colapso con `isExpanded`
- ✅ Chevron icons (ChevronDown/ChevronRight) para indicar estado
- ✅ Click en item padre expande/colapsa
- ✅ Sub-items solo visibles cuando `isExpanded === true`

#### **Actual:**
- ⚠️ Expansión automática cuando está activo
- ❌ No hay control manual
- ❌ No hay chevrons

**✅ Acción:** Agregar estado `isExpanded` y control manual

---

### **2. Estilos CSS/Tailwind Exactos**

#### **Dimensiones:**
| Elemento | Referencia | Actual | Cambio Necesario |
|----------|-----------|--------|-------------------|
| Ancho sidebar | `w-[284px]` | `w-[360px]` | ✅ Cambiar a `w-[284px]` |
| Ancho contenido | `w-[252px]` | `w-full` | ✅ Cambiar a `w-[252px]` |
| Gap items | `gap-[8px]` | `space-y-1` (4px) | ✅ Cambiar a `gap-[8px]` |
| Padding container | `p-4` (16px) | `p-6` (24px) | ✅ Cambiar a `p-4` |
| Padding items | `py-[2px]` | `py-3` (12px) | ✅ Cambiar a `py-[2px]` |
| Padding sub-items | `pl-[12px]` | `ml-6` (24px) | ✅ Cambiar a `pl-[12px]` |
| Margin sub-items | `mt-[8px]` | `mt-1` (4px) | ✅ Cambiar a `mt-[8px]` |

#### **Tipografía:**
| Elemento | Referencia | Actual | Cambio Necesario |
|----------|-----------|--------|-------------------|
| Header | `text-[16px]` `leading-[28px]` `tracking-[-0.16px]` | `text-sm` (14px) | ✅ Cambiar |
| Items | `text-[14px]` `leading-[16px]` | `text-base` (16px) | ✅ Cambiar |
| Font activo | `font-['Manrope:SemiBold']` `text-[#3c28a4]` | `font-semibold text-primary-800` | ✅ Ajustar |
| Font inactivo | `font-['Manrope:Medium']` `text-[#676472]` | `font-medium text-gray-600` | ✅ Ajustar |

#### **Colores:**
| Uso | Referencia | Actual | Cambio Necesario |
|-----|-----------|--------|-------------------|
| Texto activo | `#3c28a4` | `var(--primary-800, #3C28A4)` | ✅ Usar `#3c28a4` directamente |
| Texto inactivo | `#676472` | `text-gray-600` | ✅ Usar `#676472` directamente |
| Header texto | `#2e293d` | `text-gray-600` | ✅ Usar `#2e293d` |
| Chevron | `#676472` | N/A | ✅ Agregar |
| Indicador | `#3c28a4` `w-[2.5px]` | `w-1` (4px) `#3C28A4` | ✅ Cambiar a `w-[2.5px]` |

#### **Layout:**
| Propiedad | Referencia | Actual | Cambio Necesario |
|-----------|-----------|--------|-------------------|
| Container | `box-border content-stretch` | N/A | ✅ Agregar |
| Leading | `leading-[0]` en container | N/A | ✅ Agregar |
| Leading texto | `leading-[16px]` | `leading-normal` | ✅ Cambiar |

---

### **3. Indicador Visual**

#### **Referencia:**
```tsx
<div className="w-[2.5px]">
  <div className="w-[3px] bg-[#3c28a4]" />
</div>
```
- Barra vertical de 2.5px de ancho
- Solo visible cuando `isActive === true`
- Sin iconos adicionales

#### **Actual:**
- CheckIcon con estados (completed, current, empty)
- Barra vertical de 4px (w-1)

**✅ Acción:** Simplificar a solo barra vertical como referencia

---

### **4. Estructura de Componentes**

#### **Referencia:**
- `Sidebar.tsx` - Componente principal
- `SidebarItemComponent.tsx` - Item reutilizable (padre e hijo)
- `SidebarIndicator.tsx` - Indicador simple

#### **Actual:**
- `WizardRightSidebar.vue` - Todo en un componente

**✅ Acción:** Extraer componentes (opcional pero recomendado)

---

## 🚀 Plan de Implementación

### **Fase 1: Estilos Exactos (30 min)**
1. ✅ Cambiar ancho a `w-[284px]`
2. ✅ Ajustar gaps a `gap-[8px]`
3. ✅ Ajustar padding a `p-4` y `py-[2px]`
4. ✅ Ajustar tipografía a valores exactos
5. ✅ Cambiar colores a valores hex exactos
6. ✅ Ajustar indicador a `w-[2.5px]`

### **Fase 2: Funcionalidad Expandible (1 hora)**
1. ✅ Agregar estado `isExpanded` a `SectionItem`
2. ✅ Agregar función `toggleSection` 
3. ✅ Agregar chevrons (ChevronDown/ChevronRight)
4. ✅ Mostrar sub-items solo cuando `isExpanded === true`
5. ✅ Auto-expandir cuando hay sub-item activo

### **Fase 3: Simplificar Indicador (15 min)**
1. ✅ Remover CheckIcon
2. ✅ Crear componente `SidebarIndicator.vue` simple
3. ✅ Usar solo barra vertical

### **Fase 4: Ajustes Finales (15 min)**
1. ✅ Ajustar layout classes (`box-border`, `content-stretch`, etc.)
2. ✅ Ajustar leading y tracking
3. ✅ Verificar hover states
4. ✅ Testing visual

---

## 📝 Checklist de Implementación

- [ ] **Dimensiones**
  - [ ] Ancho sidebar: `w-[284px]`
  - [ ] Ancho contenido: `w-[252px]`
  - [ ] Gap items: `gap-[8px]`
  - [ ] Padding container: `p-4`
  - [ ] Padding items: `py-[2px]`
  - [ ] Padding sub-items: `pl-[12px]`
  - [ ] Margin sub-items: `mt-[8px]`

- [ ] **Tipografía**
  - [ ] Header: `text-[16px] leading-[28px] tracking-[-0.16px]`
  - [ ] Items: `text-[14px] leading-[16px]`
  - [ ] Font activo: `font-semibold text-[#3c28a4]`
  - [ ] Font inactivo: `font-medium text-[#676472]`

- [ ] **Colores**
  - [ ] Texto activo: `#3c28a4`
  - [ ] Texto inactivo: `#676472`
  - [ ] Header: `#2e293d`
  - [ ] Chevron: `#676472`
  - [ ] Indicador: `#3c28a4`

- [ ] **Funcionalidad**
  - [ ] Estado `isExpanded` en items
  - [ ] Función `toggleSection`
  - [ ] Chevrons (ChevronDown/ChevronRight)
  - [ ] Sub-items solo visibles cuando expandido
  - [ ] Auto-expandir cuando hay sub-item activo

- [ ] **Indicador**
  - [ ] Remover CheckIcon
  - [ ] Crear `SidebarIndicator.vue`
  - [ ] Barra vertical `w-[2.5px]`

- [ ] **Layout**
  - [ ] `box-border`
  - [ ] `content-stretch`
  - [ ] `leading-[0]` en containers
  - [ ] `leading-[16px]` en texto

---

## 🎨 Mapeo de Clases CSS

### **Container Principal**
```vue
<!-- Referencia -->
<div className="bg-white flex flex-col border-l border-gray-200 w-[284px] h-screen">

<!-- Actual (cambiar a) -->
<div class="bg-white flex flex-col border-l border-gray-200 w-[284px] h-full">
```

### **Header**
```vue
<!-- Referencia -->
<div className="box-border content-stretch flex flex-col gap-[5px] items-start px-0 py-[3px]">
  <div className="flex flex-col font-['Manrope:SemiBold',sans-serif] font-semibold justify-center leading-[0] text-[#2e293d] text-[16px] tracking-[-0.16px]">
    <p className="leading-[28px] whitespace-pre">Secciones</p>
  </div>
</div>

<!-- Actual (cambiar a) -->
<div class="box-border content-stretch flex flex-col gap-[5px] items-start px-0 py-[3px]">
  <div class="flex flex-col font-semibold justify-center leading-[0] text-[#2e293d] text-[16px] tracking-[-0.16px]">
    <p class="leading-[28px] whitespace-pre">{{ title }}</p>
  </div>
</div>
```

### **Item Principal**
```vue
<!-- Referencia -->
<div className="box-border content-stretch flex gap-[8px] items-center px-0 pr-0 py-[2px] w-[252px] cursor-pointer hover:bg-gray-50">
  <SidebarIndicator isActive={isActive} />
  <div className="basis-0 flex flex-col ${fontClass} grow justify-center leading-[0] text-[14px]">
    <p className="leading-[16px]">{item.label}</p>
  </div>
  {item.type === 'parent' && <ChevronDown/ChevronRight />}
</div>

<!-- Actual (cambiar a) -->
<div class="box-border content-stretch flex gap-[8px] items-center px-0 pr-0 py-[2px] w-[252px] cursor-pointer hover:bg-gray-50">
  <SidebarIndicator :is-active="isActive" />
  <div class="basis-0 flex flex-col grow justify-center leading-[0] text-[14px]" :class="fontClass">
    <p class="leading-[16px]">{{ section.title }}</p>
  </div>
  <ChevronDown v-if="isExpanded" />
  <ChevronRight v-else />
</div>
```

### **Sub-Item**
```vue
<!-- Referencia -->
<div className="box-border content-stretch flex gap-[8px] items-center pl-[12px] pr-0 py-[2px] w-[252px] cursor-pointer hover:bg-gray-50">
  <!-- Mismo contenido que item principal -->
</div>

<!-- Actual (cambiar a) -->
<div class="box-border content-stretch flex gap-[8px] items-center pl-[12px] pr-0 py-[2px] w-[252px] cursor-pointer hover:bg-gray-50">
  <!-- Mismo contenido -->
</div>
```

---

## ✅ Conclusión

**Sí, es totalmente posible replicar el sidebar de referencia.** Las diferencias principales son:

1. **Estilos**: Valores específicos de Tailwind que podemos replicar exactamente
2. **Funcionalidad**: Agregar control manual de expansión (ya tenemos la base)
3. **Indicador**: Simplificar a solo barra vertical

El proyecto actual ya tiene la base funcional, solo necesitamos ajustar estilos y agregar el control manual de expansión.

