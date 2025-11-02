# 📦 Objetos TypeScript Base - Flow System

## 🎯 Objetivo

Definir los objetos TypeScript para los 3 flujos principales:

1. **Registro Sociedades** (10+ pasos)
2. **Sucursales** (4-5 pasos)
3. **Junta de Accionistas** (8+ pasos)

---

## 🏗️ FlowItem Base (Tipo Principal)

```typescript
interface FlowItem {
  // Identidad
  id: string;
  label: string;
  description?: string;
  icon?: string;
  badge?: string;

  // Jerarquía
  level: number;
  order: number;
  parentId?: string;
  childrenIds?: string[];

  // Navegación
  path: string;
  href?: string;
  anchor?: string;

  // Comportamiento
  isOptional?: boolean;
  isLocked?: boolean;
  requiresCompletion?: boolean;
  isCompleted?: boolean;
  isActive?: boolean;

  // UI
  rightSidebar?: {
    enabled: boolean;
    component?: string;
    props?: Record<string, any>;
  };

  // Validación
  validation?: {
    required: boolean;
    customRules?: string[];
  };
}
```

---

## 📋 1. Registro Sociedades (10 items)

```typescript
const registroSociedadesFlow: FlowItem[] = [
  {
    id: "tipo-sociedad",
    label: "Tipo de Sociedad",
    description: "Selecciona el tipo de sociedad a registrar",
    icon: "building-2",
    level: 1,
    order: 1,
    path: "/registro-societario/tipo-sociedad",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "TipoSociedadHelper",
    },
  },

  {
    id: "denominacion-social",
    label: "Denominación Social",
    description: "Define el nombre de tu empresa",
    icon: "text-cursor",
    level: 1,
    order: 2,
    path: "/registro-societario/denominacion-social",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "DenominacionHelper",
    },
  },

  {
    id: "capital-social",
    label: "Capital Social",
    description: "Establece el capital social inicial",
    icon: "dollar-sign",
    level: 1,
    order: 3,
    path: "/registro-societario/capital-social",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "CapitalSocialHelper",
    },
  },

  {
    id: "socios-accionistas",
    label: "Socios/Accionistas",
    description: "Registra los socios fundadores",
    icon: "users",
    level: 1,
    order: 4,
    path: "/registro-societario/socios-accionistas",
    requiresCompletion: true,
    validation: { required: true },
    childrenIds: ["socio-1", "socio-2", "socio-3"],
  },

  {
    id: "socio-1",
    label: "Socio Principal",
    description: "Datos del socio principal",
    icon: "user",
    level: 2,
    order: 1,
    parentId: "socios-accionistas",
    path: "/registro-societario/socios-accionistas/socio-principal",
    requiresCompletion: true,
    validation: { required: true },
  },

  {
    id: "socio-2",
    label: "Socio Secundario",
    description: "Datos del socio secundario (opcional)",
    icon: "user-plus",
    level: 2,
    order: 2,
    parentId: "socios-accionistas",
    path: "/registro-societario/socios-accionistas/socio-secundario",
    isOptional: true,
  },

  {
    id: "socio-3",
    label: "Socios Adicionales",
    description: "Más socios (opcional)",
    icon: "users-plus",
    level: 2,
    order: 3,
    parentId: "socios-accionistas",
    path: "/registro-societario/socios-accionistas/adicionales",
    isOptional: true,
  },

  {
    id: "administracion",
    label: "Administración",
    description: "Define la estructura administrativa",
    icon: "crown",
    level: 1,
    order: 5,
    path: "/registro-societario/administracion",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "AdministracionHelper",
    },
  },

  {
    id: "estatutos",
    label: "Estatutos Sociales",
    description: "Redacta los estatutos de la empresa",
    icon: "file-text",
    level: 1,
    order: 6,
    path: "/registro-societario/estatutos",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "EstatutosGenerator",
    },
  },

  {
    id: "documentacion",
    label: "Documentación",
    description: "Subir documentos requeridos",
    icon: "upload",
    level: 1,
    order: 7,
    path: "/registro-societario/documentacion",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "DocumentosChecklist",
    },
  },

  {
    id: "revision-final",
    label: "Revisión Final",
    description: "Revisa toda la información antes del envío",
    icon: "check-circle",
    level: 1,
    order: 8,
    path: "/registro-societario/revision-final",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "RevisionResumen",
    },
  },

  {
    id: "pago-tasas",
    label: "Pago de Tasas",
    description: "Realiza el pago de las tasas registrales",
    icon: "credit-card",
    level: 1,
    order: 9,
    path: "/registro-societario/pago-tasas",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "CalculadoraTasas",
    },
  },

  {
    id: "envio-solicitud",
    label: "Envío de Solicitud",
    description: "Envía la solicitud al Registro Mercantil",
    icon: "send",
    level: 1,
    order: 10,
    path: "/registro-societario/envio-solicitud",
    requiresCompletion: true,
    validation: { required: true },
  },
];
```

---

## 🏢 2. Sucursales (5 items)

```typescript
const sucursalesFlow: FlowItem[] = [
  {
    id: "datos-sucursal",
    label: "Datos de la Sucursal",
    description: "Información básica de la nueva sucursal",
    icon: "map-pin",
    level: 1,
    order: 1,
    path: "/operaciones/sucursales/datos-sucursal",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "SucursalFormHelper",
    },
  },

  {
    id: "ubicacion-direccion",
    label: "Ubicación y Dirección",
    description: "Dirección completa y geolocalización",
    icon: "navigation",
    level: 1,
    order: 2,
    path: "/operaciones/sucursales/ubicacion-direccion",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "MapaUbicacion",
    },
  },

  {
    id: "representante-legal",
    label: "Representante Legal",
    description: "Designa el representante de la sucursal",
    icon: "user-check",
    level: 1,
    order: 3,
    path: "/operaciones/sucursales/representante-legal",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "RepresentanteHelper",
    },
  },

  {
    id: "actividad-economica",
    label: "Actividad Económica",
    description: "Define las actividades de la sucursal",
    icon: "briefcase",
    level: 1,
    order: 4,
    path: "/operaciones/sucursales/actividad-economica",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "ActividadEconomicaSelector",
    },
  },

  {
    id: "documentos-sucursal",
    label: "Documentos y Registro",
    description: "Documentación final y registro oficial",
    icon: "file-check",
    level: 1,
    order: 5,
    path: "/operaciones/sucursales/documentos-sucursal",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "DocumentosSucursalChecklist",
    },
  },
];
```

---

## 🤝 3. Junta de Accionistas (8 items)

```typescript
const juntaAccionistasFlow: FlowItem[] = [
  {
    id: "convocatoria",
    label: "Convocatoria",
    description: "Crear y enviar convocatoria a accionistas",
    icon: "calendar",
    level: 1,
    order: 1,
    path: "/junta-accionistas/convocatoria",
    requiresCompletion: true,
    validation: { required: true },
    childrenIds: ["datos-convocatoria", "lista-accionistas", "orden-dia"],
  },

  {
    id: "datos-convocatoria",
    label: "Datos de Convocatoria",
    description: "Fecha, hora y lugar de la junta",
    icon: "clock",
    level: 2,
    order: 1,
    parentId: "convocatoria",
    path: "/junta-accionistas/convocatoria/datos",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "ConvocatoriaCalendar",
    },
  },

  {
    id: "lista-accionistas",
    label: "Lista de Accionistas",
    description: "Gestionar lista de accionistas convocados",
    icon: "users",
    level: 2,
    order: 2,
    parentId: "convocatoria",
    path: "/junta-accionistas/convocatoria/accionistas",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "AccionistasList",
    },
  },

  {
    id: "orden-dia",
    label: "Orden del Día",
    description: "Definir temas a tratar en la junta",
    icon: "list",
    level: 2,
    order: 3,
    parentId: "convocatoria",
    path: "/junta-accionistas/convocatoria/orden-dia",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "OrdenDiaBuilder",
    },
  },

  {
    id: "documentos-preparatorios",
    label: "Documentos Preparatorios",
    description: "Preparar documentación para la junta",
    icon: "folder",
    level: 1,
    order: 2,
    path: "/junta-accionistas/documentos-preparatorios",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "DocumentosPreparatorios",
    },
  },

  {
    id: "quorum-asistencia",
    label: "Quórum y Asistencia",
    description: "Verificar quórum y registrar asistencia",
    icon: "check-square",
    level: 1,
    order: 3,
    path: "/junta-accionistas/quorum-asistencia",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "QuorumCalculator",
    },
  },

  {
    id: "desarrollo-junta",
    label: "Desarrollo de la Junta",
    description: "Gestionar el desarrollo de la reunión",
    icon: "play-circle",
    level: 1,
    order: 4,
    path: "/junta-accionistas/desarrollo-junta",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "JuntaTimer",
    },
  },

  {
    id: "votaciones",
    label: "Votaciones",
    description: "Gestionar votaciones y acuerdos",
    icon: "vote",
    level: 1,
    order: 5,
    path: "/junta-accionistas/votaciones",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "VotacionManager",
    },
  },

  {
    id: "acta-junta",
    label: "Acta de la Junta",
    description: "Redactar y firmar el acta",
    icon: "file-signature",
    level: 1,
    order: 6,
    path: "/junta-accionistas/acta-junta",
    requiresCompletion: true,
    validation: { required: true },
    rightSidebar: {
      enabled: true,
      component: "ActaGenerator",
    },
  },
];
```

---

## 🔄 FlowConfig (Configuración de Flujo)

```typescript
interface FlowConfig {
  id: string;
  name: string;
  description: string;
  type: "sequential" | "hierarchical" | "free";
  items: FlowItem[];

  // Configuración UI
  ui: {
    sidebar: {
      position: "left" | "right";
      width: string;
      collapsible: boolean;
    };
    rightSidebar: {
      enabled: boolean;
      width: string;
      collapsible: boolean;
    };
    navigation: {
      showPrevNext: boolean;
      showProgress: boolean;
      allowSkip: boolean;
    };
  };

  // Configuración de validación
  validation: {
    strictOrder: boolean;
    allowIncomplete: boolean;
    customRules?: string[];
  };
}

// Ejemplo de uso
const registroSociedadesConfig: FlowConfig = {
  id: "registro-sociedades",
  name: "Registro de Sociedades",
  description: "Proceso completo para registrar una nueva sociedad",
  type: "sequential",
  items: registroSociedadesFlow,

  ui: {
    sidebar: {
      position: "left",
      width: "300px",
      collapsible: true,
    },
    rightSidebar: {
      enabled: true,
      width: "350px",
      collapsible: true,
    },
    navigation: {
      showPrevNext: true,
      showProgress: true,
      allowSkip: false,
    },
  },

  validation: {
    strictOrder: true,
    allowIncomplete: false,
  },
};
```

---

## 📊 Resumen de Objetos

| Flujo                   | Items | Nivel Max | Tipo         | Estimado  |
| ----------------------- | ----- | --------- | ------------ | --------- |
| **Registro Sociedades** | 12    | 2         | Sequential   | 45-60 min |
| **Sucursales**          | 5     | 1         | Sequential   | 15-20 min |
| **Junta Accionistas**   | 8     | 2         | Hierarchical | 30-40 min |

---

## 🎯 Próximos Pasos

Con estos objetos definidos, podemos:

1. ✅ **Validar la estructura** con el usuario
2. ✅ **Crear los issues** específicos para implementación
3. ✅ **Documentar cada issue** en `todo-0/`
4. ✅ **Implementar el código** paso a paso

**Estado:** ✅ Objetos base definidos  
**Próximo:** Definir lista completa de issues
