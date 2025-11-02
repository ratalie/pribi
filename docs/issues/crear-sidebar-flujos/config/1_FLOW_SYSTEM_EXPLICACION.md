# Sistema de Navegación de Flujos - Explicación Técnica

## 1. LA NECESIDAD (Problema de Negocio)

### Contexto
En sistemas legales/corporativos existen procesos que tienen **estructura jerárquica de hasta 4 niveles**:

```
NIVEL 1: Módulo Principal (Ej: "Juntas de Accionistas")
├─ NIVEL 2: Sección (Ej: "Acuerdos")
│   ├─ NIVEL 3: Subsección (Ej: "Acuerdo de Aumento de Capital")
│   │   ├─ NIVEL 4: Item específico (Ej: "Detalle del aporte")
│   │   └─ NIVEL 4: Item específico (Ej: "Distribución de acciones")
│   └─ NIVEL 3: Subsección (Ej: "Acuerdo de Cambio de Domicilio")
└─ NIVEL 2: Sección (Ej: "Instalación de Junta")
```

### Casos Reales

**Registro Societario**: Solo necesita **1 nivel** (secuencial)
```
1. Datos de Sociedad
2. Datos de Socios
3. Datos de Representantes
... (10 pasos lineales)
```

**Juntas de Accionistas**: Necesita **4 niveles** (jerárquico)
```
1. Selección de Puntos
   ├─ 1.1 Acuerdos
   │   ├─ 1.1.1 Elección de Directorio
   │   │   ├─ 1.1.1.1 Director 1
   │   │   └─ 1.1.1.2 Director 2
   │   └─ 1.1.2 Aumento de Capital
   └─ 1.2 Otros Puntos
```

**Sucursales**: Solo necesita **1 nivel** (secuencial)
```
1. Datos de Sucursal
2. Ubicación
3. Representante
4. Resumen
```

---

## 2. LA DECISIÓN TÉCNICA

### Problema UX
- **1 sidebar**: No puede mostrar 4 niveles sin colapsar todo
- **Tabs/Accordions**: Pierde contexto de dónde estás
- **Breadcrumbs**: No muestran el árbol completo

### Solución: Double Sidebar
**Dividir los niveles en 2 sidebars**:
- **Sidebar Izquierdo (Principal)**: Niveles 1 y 2
- **Sidebar Derecho (Contextual)**: Niveles 3 y 4

#### Ventaja
```
┌─────────────┬─────────────────┬──────────────┐
│  SIDEBAR 1  │   CONTENIDO     │  SIDEBAR 2   │
│             │                 │              │
│ Nivel 1     │   Vista actual  │ Nivel 3      │
│ ├─ Nivel 2  │   del paso      │ └─ Nivel 4   │
│ └─ Nivel 2  │                 │              │
└─────────────┴─────────────────┴──────────────┘
```

**Usuario SIEMPRE ve**:
- Dónde está (nivel 1 y 2 en izquierda)
- Qué sub-items tiene (nivel 3 y 4 en derecha)
- Progreso completo del flujo

---

## 3. EL OBJETO TÉCNICO (Modelo de Datos)

### 3.1 Tipo Base: FlowItem

```typescript
interface FlowItem {
  id: string;                    // Identificador único
  label: string;                 // Texto a mostrar
  href?: string;                 // Ruta de navegación (puede ser undefined)
  path?: string;                 // Path de Nuxt (alternativa a href)
  icon?: string;                 // Icono (lucide-vue-next)
  level: 1 | 2 | 3 | 4;         // Nivel jerárquico
  order: number;                 // Orden de aparición
  
  // Navegación
  children?: FlowItem[];         // Items hijos (para jerarquía)
  parentId?: string;             // ID del padre
  
  // Estado
  isOptional?: boolean;          // ¿Es opcional?
  isLocked?: boolean;            // ¿Está bloqueado?
  
  // Sidebar Derecho
  rightSidebar?: {
    enabled: boolean;            // ¿Mostrar sidebar derecho?
    title?: string;              // Título del sidebar
    items: FlowItem[];           // Items del sidebar (niveles 3 y 4)
  };
}
```

### 3.2 Configuración del Flujo

```typescript
interface FlowConfig {
  id: string;                    // ID del flujo
  name: string;                  // Nombre del flujo
  type: 'sequential' | 'hierarchical' | 'mixed';
  
  // Navegación
  navigation: FlowItem[];        // Árbol de navegación
  
  // Comportamiento
  allowJumpAhead?: boolean;      // ¿Puede saltar pasos?
  persistState?: boolean;        // ¿Guardar progreso?
  
  // UI
  sidebarStyle?: {
    width: string;               // Ancho del sidebar
    position: 'left' | 'right';
    collapsible: boolean;
  };
  
  // Sidebar derecho
  rightSidebarStyle?: {
    width: string;
    showByDefault: boolean;
  };
}
```

---

## 4. EJEMPLOS REALES

### 4.1 Registro Societario (1 nivel - Sequential)

```javascript
const registroFlowConfig = {
  id: 'registro-sociedades',
  name: 'Registro de Sociedades',
  type: 'sequential',
  
  navigation: [
    {
      id: 'datos-sociedad',
      label: 'Datos de Sociedad',
      level: 1,
      order: 1,
      path: '/registro-societario/sociedades/crear/datos-sociedad',
      icon: 'Building'
    },
    {
      id: 'datos-socios',
      label: 'Datos de Socios',
      level: 1,
      order: 2,
      path: '/registro-societario/sociedades/crear/datos-socios',
      icon: 'Users'
    },
    // ... 8 pasos más
  ]
}
```

**Renderizado**:
```
SIDEBAR IZQUIERDO           CONTENIDO
┌──────────────────┐       ┌────────────────┐
│ 1. Datos Sociedad│ ──►   │ Formulario de  │
│ 2. Datos Socios  │       │ Datos Sociedad │
│ 3. Representantes│       │                │
│ 4. Capital       │       │ [Inputs...]    │
│ 5. Domicilio     │       │                │
│ ...              │       │ [Botón Siguiente]
└──────────────────┘       └────────────────┘
```

### 4.2 Juntas de Accionistas (4 niveles - Hierarchical)

```javascript
const juntasFlowConfig = {
  id: 'juntas-accionistas',
  name: 'Juntas de Accionistas',
  type: 'hierarchical',
  
  navigation: [
    {
      id: 'seleccion-puntos',
      label: 'Selección de Puntos',
      level: 1,
      order: 1,
      path: '/juntas/seleccion-puntos',
      icon: 'ListChecks',
      
      children: [
        {
          id: 'acuerdos',
          label: 'Acuerdos',
          level: 2,
          order: 1,
          path: '/juntas/seleccion-puntos/acuerdos',
          
          // SIDEBAR DERECHO SE ACTIVA AQUÍ
          rightSidebar: {
            enabled: true,
            title: 'Tipos de Acuerdos',
            items: [
              {
                id: 'acuerdo-directorio',
                label: 'Elección de Directorio',
                level: 3,
                order: 1,
                href: '#eleccion-directorio', // ← Puede ser anchor a div
                
                children: [
                  {
                    id: 'director-1',
                    label: 'Director 1',
                    level: 4,
                    order: 1,
                    href: '#director-1'
                  },
                  {
                    id: 'director-2',
                    label: 'Director 2',
                    level: 4,
                    order: 2,
                    href: '#director-2'
                  }
                ]
              },
              {
                id: 'acuerdo-capital',
                label: 'Aumento de Capital',
                level: 3,
                order: 2,
                href: '#aumento-capital'
              }
            ]
          }
        }
      ]
    },
    {
      id: 'detalles-junta',
      label: 'Detalles de Junta',
      level: 1,
      order: 2,
      path: '/juntas/detalles-junta',
      icon: 'Calendar'
    }
  ]
}
```

**Renderizado**:
```
SIDEBAR IZQ (Niv 1-2)       CONTENIDO              SIDEBAR DER (Niv 3-4)
┌──────────────────┐       ┌────────────────┐     ┌──────────────────┐
│ 1. Sel. Puntos   │       │ Vista Acuerdos │     │ Tipos de Acuerdos│
│   ├─ Acuerdos ✓  │ ──►   │                │     │                  │
│   └─ Otros       │       │ [Contenido]    │     │ ► Elección Dir.  │
│                  │       │                │     │   ├─ Director 1  │
│ 2. Detalles      │       │ Scroll aquí ▼  │     │   └─ Director 2  │
│ 3. Instalación   │       │                │     │                  │
│ 4. Resumen       │       │                │     │ ► Aumento Cap.   │
└──────────────────┘       └────────────────┘     └──────────────────┘
```

### 4.3 Caso Especial: Nivel 3 apunta al mismo contenido

```javascript
{
  id: 'acuerdos',
  label: 'Acuerdos',
  level: 2,
  path: '/juntas/seleccion-puntos/acuerdos',
  
  rightSidebar: {
    enabled: true,
    items: [
      {
        id: 'seccion-directorio',
        label: 'Directorio',
        level: 3,
        href: '#seccion-directorio',  // ← Mismo path, diferente anchor
        
        children: [
          {
            id: 'campo-nombre',
            label: 'Nombre del Director',
            level: 4,
            href: '#campo-nombre'       // ← Navega a div con id="campo-nombre"
          }
        ]
      },
      {
        id: 'seccion-capital',
        label: 'Capital',
        level: 3,
        href: '#seccion-capital'        // ← Mismo path, otro anchor
      }
    ]
  }
}
```

**Resultado**:
- Click en "Directorio" → Hace scroll a `<div id="seccion-directorio">`
- Click en "Capital" → Hace scroll a `<div id="seccion-capital">`
- **Ambos en la MISMA página** `/juntas/seleccion-puntos/acuerdos`

---

## 5. LÓGICA DE RENDERIZADO

### 5.1 Decisión de Qué Sidebar Usar

```typescript
function decideSidebarLayout(flowConfig: FlowConfig) {
  const maxLevel = getMaxLevel(flowConfig.navigation);
  
  if (maxLevel <= 2) {
    // Registro, Sucursales
    return {
      left: [1, 2],   // Todos los niveles en izquierda
      right: null     // No usar sidebar derecho
    };
  }
  
  if (maxLevel >= 3) {
    // Juntas
    return {
      left: [1, 2],   // Niveles 1-2 en izquierda
      right: [3, 4]   // Niveles 3-4 en derecha (condicional)
    };
  }
}
```

### 5.2 Renderizadores

```typescript
// Sequential: Para flujos lineales (Registro, Sucursales)
<SequentialRenderer 
  :items="navigation"      // Solo nivel 1
  :current-item-id="currentId"
/>

// Hierarchical: Para árboles complejos (Juntas)
<HierarchicalRenderer 
  :items="navigation"      // Niveles 1-2
  :current-item-id="currentId"
/>

// Sidebar Derecho (condicional)
<FlowRightSidebar 
  v-if="currentItem.rightSidebar?.enabled"
  :items="currentItem.rightSidebar.items"  // Niveles 3-4
/>
```

---

## 6. VENTAJAS DE ESTE DISEÑO

### Flexibilidad
```javascript
// Puedo configurar nivel 3 como nivel 2 si quiero
{
  id: 'mi-item',
  level: 2,  // ← En lugar de 3
  // Va al sidebar izquierdo automáticamente
}
```

### Reutilización
```javascript
// Mismo componente UniversalFlowLayout para todo
<UniversalFlowLayout :config="registroFlowConfig" />  // 1 nivel
<UniversalFlowLayout :config="juntasFlowConfig" />    // 4 niveles
<UniversalFlowLayout :config="sucursalesFlowConfig" /> // 1 nivel
```

### Escalabilidad
```javascript
// Agregar nuevo flujo = Solo crear config
const nuevoFlujo = {
  id: 'mi-nuevo-flujo',
  type: 'mixed',  // Puede mezclar sequential + hierarchical
  navigation: [ /* ... */ ]
}
```

---

## 7. RESUMEN EJECUTIVO

### Problema
Necesito navegar árboles de hasta 4 niveles sin perder contexto.

### Solución
2 sidebars: Izquierda (niveles 1-2), Derecha condicional (niveles 3-4).

### Implementación
1 objeto `FlowConfig` con árbol de `FlowItem[]`.

### Resultado
```
1 componente → 3 flujos diferentes → N niveles configurables
```

**El objeto lo maneja todo. El UI se adapta.**

---

## 8. PRÓXIMOS PASOS PARA TI

1. **Estudia el objeto** `FlowConfig` y `FlowItem`
2. **Mira ejemplos** en `/config/flows/`
3. **Crea tu flujo** copiando un ejemplo existente
4. **Ajusta niveles** según necesites (1, 2, 3 o 4)

**Si entiendes el objeto, entiendes el sistema completo.** 🎯
