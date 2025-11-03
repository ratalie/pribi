# 🎯 ANÁLISIS DE JERARQUÍA: Juntas y Sucursales

**Fecha:** 2 de Noviembre, 2025  
**Análisis:** Estructura de niveles para validar límites del sistema

---

## 📊 JUNTA DE ACCIONISTAS - Análisis de Niveles

### **Nivel 0 (Root - Pasos principales del flujo)**

```
1. Selección de Puntos de Agenda
2. Detalles de la Junta
3. Instalación de la Junta
4. Puntos de Acuerdo
5. Resumen
6. Descargar
```

---

### **Nivel 1 (Secciones dentro de "Puntos de Acuerdo")**

```
4. Puntos de Acuerdo (NIVEL 0)
   ├─ 4.1. Aumento de Capital (NIVEL 1 - SECTION)
   ├─ 4.2. Nombramiento (NIVEL 1 - SECTION)
   ├─ 4.3. Remociones (NIVEL 1 - SECTION)
   └─ 4.4. Gestión Social y Resultados Económicos (NIVEL 1 - SECTION)
```

---

### **Nivel 2 (Items dentro de cada sección)**

```
4.1. Aumento de Capital (NIVEL 1)
     ├─ Aporte Dinerario (NIVEL 2 - STEP)
     └─ Capitalización de Créditos (NIVEL 2 - STEP)

4.2. Nombramiento (NIVEL 1)
     ├─ Nombramiento de Apoderados (NIVEL 2 - STEP)
     ├─ Nombramiento de Gerente General (NIVEL 2 - STEP)
     ├─ Nombramiento de Directores (NIVEL 2 - STEP)
     ├─ Nombramiento de Nuevo Directorio (NIVEL 2 - STEP)
     └─ Nombramiento de Auditores Externos (NIVEL 2 - STEP)

4.3. Remociones (NIVEL 1)
     ├─ Remoción de Apoderados (NIVEL 2 - STEP)
     ├─ Remoción de Gerente General (NIVEL 2 - STEP)
     └─ Remoción de Directores (NIVEL 2 - STEP)

4.4. Gestión Social (NIVEL 1)
     ├─ Pronunciamiento de la Gestión Social (NIVEL 2 - STEP)
     ├─ Aplicación de Resultados (NIVEL 2 - STEP)
     ├─ Estados Financieros (NIVEL 2 - STEP)
     └─ Reparto de Dividendos (NIVEL 2 - STEP)
```

---

### **Nivel 3 (Sub-páginas del Sidebar Derecho)**

```
Aporte Dinerario (NIVEL 2)
├─ Aportantes (NIVEL 3 - RIGHT_SIDEBAR_ITEM / PAGE)
├─ Aportes (NIVEL 3 - RIGHT_SIDEBAR_ITEM / PAGE)
└─ Votación (NIVEL 3 - RIGHT_SIDEBAR_ITEM / PAGE)

Capitalización de Créditos (NIVEL 2)
├─ Acreedores (NIVEL 3 - RIGHT_SIDEBAR_ITEM / PAGE)
├─ Créditos (NIVEL 3 - RIGHT_SIDEBAR_ITEM / PAGE)
└─ Votación (NIVEL 3 - RIGHT_SIDEBAR_ITEM / PAGE)

Nombramiento de Apoderados (NIVEL 2)
├─ Nombramiento (NIVEL 3 - PAGE)
├─ Otorgamiento de Poderes (NIVEL 3 - PAGE con scroll anchors)
└─ Votación (NIVEL 3 - PAGE con scroll anchors)

Remoción de Apoderados (NIVEL 2)
├─ Remoción de Apoderados (NIVEL 3 - PAGE)
└─ Votación de Apoderados (NIVEL 3 - PAGE con scroll anchors)
```

---

### **Nivel 4 (Scroll anchors dentro de páginas)**

```
Otorgamiento de Poderes (NIVEL 3)
├─ #yull-timoteo (NIVEL 4 - SCROLL_ANCHOR)
├─ #jose-luis-matos (NIVEL 4 - SCROLL_ANCHOR)
└─ #franco-vidal (NIVEL 4 - SCROLL_ANCHOR)

Votación (NIVEL 3)
├─ #yull-timoteo (NIVEL 4 - SCROLL_ANCHOR)
├─ #jose-luis-matos (NIVEL 4 - SCROLL_ANCHOR)
└─ #franco-vidal (NIVEL 4 - SCROLL_ANCHOR)
```

---

## ✅ VALIDACIÓN DE LÍMITES

### **Profundidad Máxima del Sistema:**

- **TODO-001 define:** `maxDepth` sin límite explícito
- **Profundidad usada:** 4 niveles (0, 1, 2, 3, 4)
- **Resultado:** ✅ **VÁLIDO** - Nuestro sistema soporta jerarquías ilimitadas

### **Conteo de Niveles:**

```
Nivel 0: 6 items (pasos principales)
Nivel 1: 4 secciones (Aumento Capital, Nombramiento, Remociones, Gestión)
Nivel 2: ~17 items (todos los pasos específicos)
Nivel 3: ~40 páginas/sub-páginas (sidebar derecho)
Nivel 4: ~20 scroll anchors (elementos dentro de páginas)

TOTAL ESTIMADO: ~87 FlowItems en Juntas
```

---

## 📊 SUCURSALES - Análisis de Niveles

### **Estructura Simplificada (Hasta Asignación de Acciones)**

### **Nivel 0 (Pasos principales)**

```
1. Datos de la Sociedad
2. Datos Generales
3. Capital Social
4. Acciones
5. Accionistas
6. Asignación de Acciones
```

### **Sin niveles adicionales** (estructura flat)

```
TOTAL: 6 FlowItems en Sucursales
```

**Profundidad:** 0 (todos al mismo nivel)

---

## 🎯 TIPOS DE NAVEGACIÓN IDENTIFICADOS

### **1. Navegación de PÁGINA (NavigationBehavior.PUSH)**

```
Ejemplo: "Aporte Dinerario" → navega a /juntas/aporte-dinerario
```

### **2. Navegación de SCROLL (NavigationBehavior.SCROLL)**

```
Ejemplo: "Yull Timoteo" → scroll a #yull-timoteo en la misma página
```

### **3. Sidebar Derecho CONDICIONAL**

```
Cuando selecciono "Aporte Dinerario":
- Sidebar izquierdo: Muestra el árbol principal
- Sidebar derecho: Aparece con 3 items (Aportantes, Aportes, Votación)
```

### **4. Items Expandibles con Hijos de SCROLL**

```
"Otorgamiento de Poderes" (página)
  ├─ #yull-timoteo (scroll anchor)
  ├─ #jose-luis-matos (scroll anchor)
  └─ #franco-vidal (scroll anchor)
```

---

## 🔍 ANÁLISIS DE PATRONES

### **Patrón 1: Sección → Pasos → Sub-páginas (Sidebar Derecho)**

```
Puntos de Acuerdo (SECTION, Nivel 1)
└─ Aumento de Capital (SECTION, Nivel 2)
   └─ Aporte Dinerario (STEP, Nivel 3, tiene rightSidebar)
      ├─ Aportantes (STEP, Nivel 4, aparece en rightSidebar)
      ├─ Aportes (STEP, Nivel 4, aparece en rightSidebar)
      └─ Votación (STEP, Nivel 4, aparece en rightSidebar)
```

**Cómo funciona:**

- Sidebar izquierdo: Muestra hasta nivel 3
- Sidebar derecho: Muestra nivel 4 (cuando nivel 3 está activo)

---

### **Patrón 2: Página con Scroll Anchors**

```
Nombramiento de Apoderados (STEP, Nivel 2)
└─ Otorgamiento de Poderes (STEP, Nivel 3, route=/juntas/otorgamiento)
   ├─ Yull Timoteo (ANCHOR, Nivel 4, hash=#yull-timoteo)
   ├─ Jose Luis (ANCHOR, Nivel 4, hash=#jose-luis)
   └─ Franco Vidal (ANCHOR, Nivel 4, hash=#franco-vidal)
```

**Cómo funciona:**

- Click en "Otorgamiento de Poderes": Navega a la página
- Click en "Yull Timoteo": Hace scroll a la sección dentro de la página

---

### **Patrón 3: Resumen con Links a Secciones Previas**

```
Resumen (STEP, Nivel 0)
└─ Sidebar Derecho (scroll anchors a elementos de la página resumen)
   ├─ #aporte-dinerario (scroll a resumen de aporte)
   ├─ #capitalizacion (scroll a resumen de capitalización)
   ├─ #nombramiento-gerente (scroll a resumen de nombramiento)
   └─ ...
```

---

## 🎨 CONFIGURACIÓN DE FLOWITEM SEGÚN PATRÓN

### **Patrón 1: Item con Sidebar Derecho**

```typescript
{
  identity: {
    id: 'aporte-dinerario',
    type: FlowItemType.STEP,
    label: 'Aporte Dinerario'
  },
  hierarchy: {
    parentId: 'aumento-capital',
    level: 3
  },
  navigation: {
    route: '/juntas/aporte-dinerario',
    behavior: NavigationBehavior.PUSH
  },
  rightSidebar: {
    enabled: true,  // ← CLAVE: Habilita sidebar derecho
    contentType: 'navigation', // Items de navegación
    showInSidebar: true // Mostrar items hijos en sidebar derecho
  }
}

// Hijos (aparecen en rightSidebar)
{
  identity: {
    id: 'aportantes',
    type: FlowItemType.STEP,
    label: 'Aportantes'
  },
  hierarchy: {
    parentId: 'aporte-dinerario',
    level: 4
  },
  navigation: {
    route: '/juntas/aporte-dinerario/aportantes',
    behavior: NavigationBehavior.PUSH
  },
  rightSidebar: {
    enabled: false // Este no tiene sidebar derecho
  }
}
```

---

### **Patrón 2: Item con Scroll Anchors**

```typescript
{
  identity: {
    id: 'otorgamiento-poderes',
    type: FlowItemType.STEP,
    label: 'Otorgamiento de Poderes'
  },
  hierarchy: {
    parentId: 'nombramiento-apoderados',
    level: 3
  },
  navigation: {
    route: '/juntas/otorgamiento-poderes',
    behavior: NavigationBehavior.PUSH
  },
  rightSidebar: {
    enabled: true,
    contentType: 'navigation',
    showInSidebar: true
  }
}

// Hijos (scroll anchors)
{
  identity: {
    id: 'yull-timoteo',
    type: FlowItemType.ACTION, // ← Tipo ACTION para scroll
    label: 'Yull Timoteo'
  },
  hierarchy: {
    parentId: 'otorgamiento-poderes',
    level: 4
  },
  navigation: {
    hash: '#yull-timoteo', // ← SCROLL
    behavior: NavigationBehavior.SCROLL
  }
}
```

---

### **Patrón 3: Resumen con Links**

```typescript
{
  identity: {
    id: 'resumen',
    type: FlowItemType.STEP,
    label: 'Resumen'
  },
  hierarchy: {
    parentId: null,
    level: 0
  },
  navigation: {
    route: '/juntas/resumen',
    behavior: NavigationBehavior.PUSH
  },
  rightSidebar: {
    enabled: true,
    contentType: 'summary', // Tipo especial para resumen
    showInSidebar: true
  }
}

// Hijos (scroll a secciones del resumen)
{
  identity: {
    id: 'resumen-aporte',
    type: FlowItemType.ACTION,
    label: 'Aporte Dinerario'
  },
  hierarchy: {
    parentId: 'resumen',
    level: 1
  },
  navigation: {
    hash: '#aporte-dinerario',
    behavior: NavigationBehavior.SCROLL
  }
}
```

---

## ✅ CONCLUSIONES

### **1. La estructura ES VÁLIDA** ✅

- Máximo 4 niveles de profundidad
- Sistema soporta jerarquías ilimitadas
- Todos los patrones son implementables

### **2. Necesitamos 3 PATRONES de navegación:**

- **Patrón A:** Item con sidebar derecho (sub-páginas)
- **Patrón B:** Item con scroll anchors
- **Patrón C:** Resumen con links

### **3. Sidebar Derecho es CONDICIONAL:**

- Solo aparece cuando un item tiene `rightSidebar.enabled = true`
- Muestra los hijos del item activo
- Hijos pueden ser páginas o scroll anchors

### **4. Tipos de FlowItemType necesarios:**

- `SECTION` - Agrupaciones (Aumento Capital, Nombramiento)
- `STEP` - Pasos/páginas principales
- `ACTION` - Scroll anchors o acciones

### **5. NavigationBehavior necesarios:**

- `PUSH` - Navegación a página nueva
- `SCROLL` - Scroll dentro de la página actual

---

## 🚀 PRÓXIMOS PASOS

1. ✅ **Estructura validada** - 4 niveles es perfecto
2. ⏳ **Crear enums de rutas** para Juntas (87 rutas)
3. ⏳ **Crear páginas simples** para Juntas
4. ⏳ **Crear FlowItems** siguiendo los 3 patrones
5. ⏳ **Crear FlowConfig** de Juntas completo
6. ⏳ **Crear FlowConfig** de Sucursales (6 items flat)

---

**✅ TODO PERFECTO - Sistema soporta la estructura completa de Juntas y Sucursales**
