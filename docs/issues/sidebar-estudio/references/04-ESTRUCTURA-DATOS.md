# 📐 Estructura de Datos del Sistema Universal

**Fecha**: 31 de Octubre, 2025  
**Objetivo**: Definir los tipos TypeScript que conforman el sistema

---

## 🎯 Tipos Core del Sistema

### **1. FlowConfig** - Configuración Principal

```typescript
/**
 * Configuración completa de un flujo
 */
export interface FlowConfig {
  /** ID único del flujo */
  id: string;

  /** Nombre descriptivo */
  name: string;

  /** Tipo de navegación */
  type: "hierarchical" | "sequential" | "mixed";

  /** Items de navegación */
  navigation: FlowItem[];

  /** Ruta inicial del flujo */
  startPath: string;

  /** Configuración del header (opcional) */
  header?: FlowHeaderConfig;

  /** Configuración del footer (opcional) */
  footer?: FlowFooterConfig;

  /** Sidebar derecho (opcional) */
  rightSidebar?: FlowSidebarConfig;

  /** Validar al navegar? */
  validateOnNavigate?: boolean;

  /** Permitir navegación libre? */
  allowFreeNavigation?: boolean;

  /** Auto-guardar progreso? */
  autoSave?: boolean;

  /** Intervalo de auto-guardado (ms) */
  autoSaveInterval?: number;

  /** Callbacks de eventos */
  events?: FlowEvents;

  /** Metadata adicional */
  metadata?: Record<string, any>;
}
```

---

### **2. FlowItem** - Item de Navegación

```typescript
/**
 * Item individual de navegación (puede ser anidado)
 */
export interface FlowItem {
  /** ID único del item */
  id: string;

  /** Título visible */
  title: string;

  /** Descripción (opcional) */
  description?: string;

  /** Ruta de navegación */
  path?: string;

  /** Items hijos (para navegación jerárquica) */
  children?: FlowItem[];

  /** Icono */
  icon?: string;

  /** Icono cuando está activo */
  activeIcon?: string;

  /** Estado inicial */
  initialStatus?: FlowItemStatus;

  /** Función de validación */
  validate?: () => boolean | Promise<boolean>;

  /** Items requeridos antes de este */
  requires?: string[];

  /** Sidebar derecho para este item */
  rightSidebar?: {
    enabled: boolean;
    steps: FlowItem[];
  };

  /** Metadata adicional */
  metadata?: Record<string, any>;
}
```

---

### **3. FlowItemState** - Estado de un Item

```typescript
/**
 * Estado reactivo de un item de navegación
 */
export interface FlowItemState {
  /** ID del item */
  itemId: string;

  /** Estado actual */
  status: FlowItemStatus;

  /** Porcentaje de completitud (0-100) */
  completionPercentage?: number;

  /** Timestamp de última actualización */
  lastUpdated?: Date;

  /** Errores de validación */
  validationErrors?: string[];

  /** Datos guardados */
  data?: Record<string, any>;

  /** Número de visitas */
  visitCount?: number;

  /** Tiempo gastado (ms) */
  timeSpent?: number;
}

/**
 * Estados posibles de un item
 */
export type FlowItemStatus =
  | "not-started"
  | "in-progress"
  | "completed"
  | "locked"
  | "skipped"
  | "pending-review"
  | "approved"
  | "rejected"
  | "error";

/**
 * Mapeo de estado a configuración visual
 */
export interface FlowItemStatusConfig {
  status: FlowItemStatus;
  label: string;
  icon: string;
  color: string;
  backgroundColor?: string;
}
```

---

### **4. FlowHeaderConfig** - Configuración de Header

```typescript
/**
 * Configuración del header del flujo
 */
export interface FlowHeaderConfig {
  /** Habilitar header? */
  enabled: boolean;

  /** Componente a renderizar */
  component?: Component | string;

  /** Props para el componente */
  props?: Record<string, any>;

  /** Mostrar barra de progreso? */
  showProgress?: boolean;

  /** Tipo de progreso */
  progressType?: "bar" | "circular" | "steps";

  /** Altura del header */
  height?: string;

  /** Sticky? */
  sticky?: boolean;
}
```

---

### **5. FlowFooterConfig** - Configuración de Footer

```typescript
/**
 * Configuración del footer del flujo
 */
export interface FlowFooterConfig {
  /** Habilitar footer? */
  enabled: boolean;

  /** Componente a renderizar */
  component?: Component | string;

  /** Props para el componente */
  props?: Record<string, any>;

  /** Mostrar botón Anterior? */
  showPrevious?: boolean;

  /** Mostrar botón Siguiente? */
  showNext?: boolean;

  /** Botones personalizados */
  customButtons?: FlowButton[];

  /** Altura del footer */
  height?: string;

  /** Sticky? */
  sticky?: boolean;
}

/**
 * Botón personalizado
 */
export interface FlowButton {
  id: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: string;
  action: () => void | Promise<void>;
  disabled?: boolean | (() => boolean);
  hidden?: boolean | (() => boolean);
}
```

---

### **6. FlowSidebarConfig** - Configuración de Sidebar

```typescript
/**
 * Configuración de sidebar
 */
export interface FlowSidebarConfig {
  /** Posición */
  position: "left" | "right";

  /** Ancho */
  width?: string;

  /** Colapsable? */
  collapsible?: boolean;

  /** Colapsado por defecto? */
  defaultCollapsed?: boolean;

  /** Mostrar header? */
  showHeader?: boolean;

  /** Título del header */
  headerTitle?: string;

  /** Items de navegación */
  items?: FlowItem[];

  /** Tipo de renderizado */
  renderType?: "hierarchical" | "sequential" | "mixed";
}
```

---

### **7. FlowEvents** - Callbacks de Eventos

```typescript
/**
 * Eventos del flujo
 */
export interface FlowEvents {
  /** Antes de inicializar el flujo */
  onBeforeInit?: (config: FlowConfig) => void | Promise<void>;

  /** Después de inicializar el flujo */
  onAfterInit?: (config: FlowConfig) => void | Promise<void>;

  /** Antes de navegar */
  onBeforeNavigate?: (from: FlowItem, to: FlowItem) => boolean | Promise<boolean>;

  /** Después de navegar */
  onAfterNavigate?: (from: FlowItem, to: FlowItem) => void | Promise<void>;

  /** Al cambiar estado de item */
  onStatusChange?: (
    itemId: string,
    oldStatus: FlowItemStatus,
    newStatus: FlowItemStatus
  ) => void;

  /** Al completar el flujo */
  onComplete?: () => void | Promise<void>;

  /** Al resetear el flujo */
  onReset?: () => void | Promise<void>;

  /** Al guardar progreso */
  onSave?: (states: Record<string, FlowItemState>) => void | Promise<void>;

  /** Al restaurar progreso */
  onRestore?: (states: Record<string, FlowItemState>) => void | Promise<void>;

  /** Al ocurrir error */
  onError?: (error: Error, context: string) => void;
}
```

---

## 🎨 Ejemplos de Configuración

### **Ejemplo 1: Configuración para Juntas**

```typescript
import type { FlowConfig } from "~/types/flow-system";

export const juntasFlowConfig: FlowConfig = {
  id: "juntas-accionistas",
  name: "Junta de Accionistas",
  type: "hierarchical",

  startPath: "/juntas/seleccion-puntos",

  allowFreeNavigation: true,
  validateOnNavigate: false,
  autoSave: true,
  autoSaveInterval: 30000, // 30 segundos

  navigation: [
    {
      id: "seleccion-puntos",
      title: "Selección de Puntos de Agenda",
      path: "/juntas/seleccion-puntos",
      icon: "list-checks",
      initialStatus: "not-started",
    },
    {
      id: "detalles-junta",
      title: "Detalles de la Junta",
      path: "/juntas/detalles-junta",
      icon: "file-text",
      initialStatus: "not-started",
      requires: ["seleccion-puntos"],
    },
    {
      id: "instalacion-junta",
      title: "Instalación de la Junta",
      path: "/juntas/instalacion-junta",
      icon: "users",
      initialStatus: "not-started",
      requires: ["detalles-junta"],
    },
    {
      id: "puntos-acuerdo",
      title: "Puntos de Acuerdo",
      icon: "folder",
      children: [
        {
          id: "aumento-capital",
          title: "Aumento de Capital",
          icon: "trending-up",
          children: [
            {
              id: "aporte-dinerario",
              title: "Aporte Dinerario",
              path: "/juntas/puntos-acuerdo/aumento-capital/aporte-dinerario/aportantes",
              icon: "dollar-sign",
              rightSidebar: {
                enabled: true,
                steps: [
                  {
                    id: "aportantes",
                    title: "Aportantes",
                    path: "/juntas/puntos-acuerdo/aumento-capital/aporte-dinerario/aportantes",
                  },
                  {
                    id: "aportes",
                    title: "Aportes",
                    path: "/juntas/puntos-acuerdo/aumento-capital/aporte-dinerario/aportes",
                  },
                  {
                    id: "votacion",
                    title: "Votación",
                    path: "/juntas/puntos-acuerdo/aumento-capital/aporte-dinerario/votacion",
                  },
                ],
              },
            },
            {
              id: "capitalizacion-creditos",
              title: "Capitalización de Créditos",
              path: "/juntas/puntos-acuerdo/aumento-capital/capitalizacion-creditos/acreedores",
              icon: "file-badge",
              rightSidebar: {
                enabled: true,
                steps: [
                  {
                    id: "acreedores",
                    title: "Acreedores",
                    path: "/juntas/puntos-acuerdo/aumento-capital/capitalizacion-creditos/acreedores",
                  },
                  {
                    id: "creditos",
                    title: "Créditos",
                    path: "/juntas/puntos-acuerdo/aumento-capital/capitalizacion-creditos/creditos",
                  },
                  {
                    id: "votacion",
                    title: "Votación",
                    path: "/juntas/puntos-acuerdo/aumento-capital/capitalizacion-creditos/votacion",
                  },
                ],
              },
            },
          ],
        },
        {
          id: "nombramiento",
          title: "Nombramiento",
          icon: "user-plus",
          children: [
            {
              id: "nombramiento-apoderados",
              title: "Nombramiento de Apoderados",
              path: "/juntas/puntos-acuerdo/nombramiento/apoderados",
            },
            {
              id: "nombramiento-gerente",
              title: "Nombramiento de Gerente General",
              path: "/juntas/puntos-acuerdo/nombramiento/gerente-general",
            },
            {
              id: "nombramiento-directores",
              title: "Nombramiento de Directores",
              path: "/juntas/puntos-acuerdo/nombramiento/directores",
            },
          ],
        },
        {
          id: "remociones",
          title: "Remociones",
          icon: "user-minus",
          children: [
            {
              id: "remocion-apoderados",
              title: "Remoción de Apoderados",
              path: "/juntas/puntos-acuerdo/remociones/apoderados",
            },
            {
              id: "remocion-gerente",
              title: "Remoción de Gerente General",
              path: "/juntas/puntos-acuerdo/remociones/gerente-general",
            },
          ],
        },
        {
          id: "gestion-social",
          title: "Gestión Social y Resultados Económicos",
          icon: "building",
          children: [
            {
              id: "pronunciamiento",
              title: "Pronunciamiento de la Gestión Social",
              path: "/juntas/puntos-acuerdo/gestion-social/pronunciamiento",
            },
          ],
        },
      ],
    },
    {
      id: "resumen",
      title: "Resumen",
      path: "/juntas/resumen",
      icon: "file-check",
      requires: ["puntos-acuerdo"],
    },
    {
      id: "descargar",
      title: "Descargar",
      path: "/juntas/descargar",
      icon: "download",
      requires: ["resumen"],
    },
  ],

  events: {
    onAfterNavigate: async (from, to) => {
      // Guardar progreso
      await useFlowNavigationStore().saveProgress();
    },

    onComplete: async () => {
      // Enviar analytics
      console.log("Flujo de Juntas completado!");
    },
  },
};
```

---

### **Ejemplo 2: Configuración para Registro**

```typescript
import type { FlowConfig } from "~/types/flow-system";

export const registroFlowConfig: FlowConfig = {
  id: "registro-sociedades",
  name: "Registro de Sociedades",
  type: "sequential",

  startPath: "/registro-societario/sociedades/crear/datos-sociedad",

  allowFreeNavigation: false, // Navegación secuencial forzada
  validateOnNavigate: true, // Validar antes de avanzar
  autoSave: true,
  autoSaveInterval: 60000, // 1 minuto

  // Header personalizado
  header: {
    enabled: true,
    component: "HeaderProgressNavbar",
    showProgress: true,
    progressType: "bar",
    sticky: true,
    height: "80px",
  },

  // Footer personalizado
  footer: {
    enabled: true,
    component: "FlowFooter",
    showPrevious: true,
    showNext: true,
    sticky: true,
    height: "92px",
    customButtons: [
      {
        id: "save-draft",
        label: "Guardar Borrador",
        variant: "secondary",
        icon: "save",
        action: async () => {
          await saveDraft();
        },
      },
    ],
  },

  navigation: [
    {
      id: "datos-sociedad",
      title: "Datos principales",
      description: "Completa todos los datos de la Sociedad",
      path: "/registro-societario/sociedades/crear/datos-sociedad",
      initialStatus: "in-progress",
      icon: "building",
      validate: async () => {
        const form = useDatosSociedadForm();
        return form.validate();
      },
    },
    {
      id: "accionistas",
      title: "Accionistas",
      description: "Agrega los accionistas de la Sociedad",
      path: "/registro-societario/sociedades/crear/accionistas",
      initialStatus: "locked",
      icon: "users",
      requires: ["datos-sociedad"],
      validate: async () => {
        const store = useAccionistasStore();
        return store.accionistas.length > 0;
      },
    },
    {
      id: "acciones",
      title: "Capital Social y Acciones",
      description: "Completa información sobre las acciones",
      path: "/registro-societario/sociedades/crear/acciones",
      initialStatus: "locked",
      icon: "coins",
      requires: ["accionistas"],
    },
    {
      id: "asignacion-acciones",
      title: "Asignación de Acciones",
      description: "Distribuye Tipos de Acciones entre los Accionistas",
      path: "/registro-societario/sociedades/crear/asignacion-acciones",
      initialStatus: "locked",
      icon: "percent",
      requires: ["acciones"],
    },
    {
      id: "directorio",
      title: "Directorio",
      description: "Configura el directorio y designa directores",
      path: "/registro-societario/sociedades/crear/directorio",
      initialStatus: "locked",
      icon: "briefcase",
      requires: ["asignacion-acciones"],
    },
    {
      id: "registro-apoderados",
      title: "Registro de Apoderados",
      description: "Define quiénes serán los apoderados",
      path: "/registro-societario/sociedades/crear/registro-apoderados",
      initialStatus: "locked",
      icon: "user-check",
      requires: ["directorio"],
    },
    {
      id: "regimen-poderes",
      title: "Régimen General de Poderes",
      description: "Configura reglas para el ejercicio de poderes",
      path: "/registro-societario/sociedades/crear/regimen-poderes",
      initialStatus: "locked",
      icon: "shield",
      requires: ["registro-apoderados"],
    },
    {
      id: "quorums-mayorias",
      title: "Quorums y Mayorías para Adopción de Acuerdos",
      description: "Asigna porcentajes para ambos casos según corresponda",
      path: "/registro-societario/sociedades/crear/quorums-mayorias",
      initialStatus: "locked",
      icon: "percent-circle",
      requires: ["regimen-poderes"],
    },
    {
      id: "acuerdos-societarios",
      title: "Acuerdos Societarios Especiales",
      description: "Completa la información según corresponda",
      path: "/registro-societario/sociedades/crear/acuerdos-societarios",
      initialStatus: "locked",
      icon: "file-text",
      requires: ["quorums-mayorias"],
    },
    {
      id: "resumen",
      title: "Resumen",
      description: "Visualiza un resumen de los datos",
      path: "/registro-societario/sociedades/crear/resumen",
      initialStatus: "locked",
      icon: "file-check",
      requires: ["acuerdos-societarios"],
    },
  ],

  events: {
    onBeforeNavigate: async (from, to) => {
      // Validar antes de navegar
      if (from.validate) {
        const isValid = await from.validate();
        if (!isValid) {
          throw new Error("Completa todos los campos requeridos");
        }
      }
      return true;
    },

    onStatusChange: (itemId, oldStatus, newStatus) => {
      // Si se completa un paso, desbloquear el siguiente
      if (newStatus === "completed") {
        const store = useFlowNavigationStore();
        store.unlockNextItem(itemId);
      }
    },

    onComplete: async () => {
      // Enviar formulario completo
      await api.submitSociedadRegistration();
      // Navegar a confirmación
      router.push("/registro-societario/sociedades/confirmacion");
    },
  },
};
```

---

## 🔧 Utilities y Helpers

### **FlowItemHelpers**

```typescript
/**
 * Utilidades para trabajar con FlowItems
 */
export class FlowItemHelpers {
  /**
   * Encontrar item por ID (recursivo)
   */
  static findById(items: FlowItem[], id: string): FlowItem | null {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = this.findById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Encontrar item por path (recursivo)
   */
  static findByPath(items: FlowItem[], path: string): FlowItem | null {
    for (const item of items) {
      if (item.path === path) return item;

      // Buscar en rightSidebar steps
      if (item.rightSidebar?.steps) {
        const found = item.rightSidebar.steps.find((s) => s.path === path);
        if (found) return item; // Retornar el padre
      }

      if (item.children) {
        const found = this.findByPath(item.children, path);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Aplanar jerarquía a lista lineal
   */
  static flatten(items: FlowItem[]): FlowItem[] {
    const result: FlowItem[] = [];

    for (const item of items) {
      result.push(item);
      if (item.children) {
        result.push(...this.flatten(item.children));
      }
    }

    return result;
  }

  /**
   * Obtener todos los IDs de un árbol
   */
  static getAllIds(items: FlowItem[]): string[] {
    return this.flatten(items).map((item) => item.id);
  }

  /**
   * Verificar si item tiene hijos
   */
  static hasChildren(item: FlowItem): boolean {
    return !!(item.children && item.children.length > 0);
  }

  /**
   * Verificar si item está en path actual
   */
  static isInCurrentPath(item: FlowItem, currentPath: string): boolean {
    if (item.path === currentPath) return true;

    if (item.rightSidebar?.steps) {
      return item.rightSidebar.steps.some((s) => s.path === currentPath);
    }

    if (item.children) {
      return item.children.some((child) => this.isInCurrentPath(child, currentPath));
    }

    return false;
  }
}
```

---

## 📊 Validación de Tipos

```typescript
/**
 * Type guards para validación en runtime
 */
export const FlowTypeGuards = {
  isFlowConfig(obj: any): obj is FlowConfig {
    return (
      typeof obj === "object" &&
      typeof obj.id === "string" &&
      typeof obj.name === "string" &&
      ["hierarchical", "sequential", "mixed"].includes(obj.type) &&
      Array.isArray(obj.navigation)
    );
  },

  isFlowItem(obj: any): obj is FlowItem {
    return (
      typeof obj === "object" && typeof obj.id === "string" && typeof obj.title === "string"
    );
  },

  isFlowItemState(obj: any): obj is FlowItemState {
    return (
      typeof obj === "object" &&
      typeof obj.itemId === "string" &&
      typeof obj.status === "string"
    );
  },
};
```

---

## 🎓 Conclusión

Esta estructura de datos:

✅ **Es flexible**: Soporta diferentes tipos de flujos  
✅ **Es tipada**: TypeScript estricto  
✅ **Es extensible**: Fácil agregar nuevos campos  
✅ **Es reactiva**: Diseñada para trabajar con Pinia  
✅ **Es validable**: Type guards para runtime

---

**Próximo paso**: [05-PLAN-IMPLEMENTACION.md](./05-PLAN-IMPLEMENTACION.md) - Plan de implementación

**Última actualización**: 31 de Octubre, 2025
