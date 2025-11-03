# TODO-001: Estructura de Datos - VARIABLES FLOWITEM

**Objetivo:** Ejemplos completos de FlowItem para los 3 flujos del sistema

---

## 📋 Índice

1. [Registro de Sociedades](#1-registro-de-sociedades) - 10 items, sequential, level 1
2. [Sucursales](#2-sucursales) - 5 items, sequential, level 1
3. [Juntas de Accionistas](#3-juntas-de-accionistas) - Hierarchical, 4 levels, rightSidebar

---

## 1. Registro de Sociedades

**Características:**

- ✅ 10 items secuenciales
- ✅ Todos level 1 (sin jerarquía)
- ✅ Sin rightSidebar
- ✅ Navegación lineal
- ✅ Algunos opcionales

### **Item 1: Tipo de Sociedad**

```typescript
const tipoSociedad: FlowItem = {
  identity: {
    id: "tipo-sociedad",
    label: "Tipo de Sociedad",
    description: "Selecciona el tipo de sociedad que deseas registrar",
    icon: "building-2",
    badge: {
      text: "Requerido",
      variant: "destructive",
    },
  },

  hierarchy: {
    level: 1,
    order: 1,
    // Sin parentId (es raíz)
    // Sin children (es nivel 1)
  },

  navigation: {
    path: "/registro-societario/tipo-sociedad",
    // Sin href (navegación interna)
  },

  behavior: {
    isOptional: false, // DEBE completarse
    isLocked: false, // Siempre desbloqueado (primer paso)
    requiresCompletion: true, // Bloquea siguientes pasos
  },

  // Sin rightSidebar (Registro no lo usa)

  validation: {
    required: true,
    // validator se definirá en composable
    validator: undefined,
  },

  metadata: {
    // Tipos de sociedad permitidos
    societyTypes: ["SAS", "SA", "SRL", "EIRL"],

    // Ayuda contextual
    helpUrl: "/help/tipo-sociedad",

    // Analytics
    trackingCategory: "registro-societario",
    trackingAction: "select-society-type",
  },
};
```

---

### **Item 2: Datos Principales**

```typescript
const datosPrincipales: FlowItem = {
  identity: {
    id: "datos-principales",
    label: "Datos principales",
    description: "Información básica de la sociedad",
    icon: "file-text",
    badge: {
      text: "Requerido",
      variant: "destructive",
    },
  },

  hierarchy: {
    level: 1,
    order: 2,
  },

  navigation: {
    path: "/registro-societario/datos-principales",
  },

  behavior: {
    isOptional: false,
    isLocked: true, // Se desbloquea al completar tipo-sociedad
    requiresCompletion: true,
  },

  validation: {
    required: true,
    // Validación de formulario con Zod
  },

  metadata: {
    formSchema: "datosPrincipalesSchema",
    fields: ["nombreSociedad", "rut", "giro", "domicilio", "comuna", "region"],
    estimatedTime: "10 minutos",
  },
};
```

---

### **Item 3: Socios**

```typescript
const socios: FlowItem = {
  identity: {
    id: "socios",
    label: "Socios",
    description: "Agrega los socios fundadores",
    icon: "users",
    badge: {
      text: "Requerido",
      variant: "destructive",
    },
  },

  hierarchy: {
    level: 1,
    order: 3,
  },

  navigation: {
    path: "/registro-societario/socios",
  },

  behavior: {
    isOptional: false,
    isLocked: true,
    requiresCompletion: true,
  },

  validation: {
    required: true,
    // Al menos 1 socio requerido
  },

  metadata: {
    minSocios: 1,
    maxSocios: 999,
    // Tipos de socios
    socioTypes: ["persona-natural", "persona-juridica"],

    // Campos por socio
    socioFields: ["nombre", "rut", "nacionalidad", "porcentajeParticipacion", "aporteCapital"],

    // Features
    allowMultiple: true,
    allowDragSort: true,
    allowDelete: true,
  },
};
```

---

### **Item 4: Administración**

```typescript
const administracion: FlowItem = {
  identity: {
    id: "administracion",
    label: "Administración",
    description: "Define la estructura de administración",
    icon: "briefcase",
    badge: {
      text: "Requerido",
      variant: "destructive",
    },
  },

  hierarchy: {
    level: 1,
    order: 4,
  },

  navigation: {
    path: "/registro-societario/administracion",
  },

  behavior: {
    isOptional: false,
    isLocked: true,
    requiresCompletion: true,
  },

  validation: {
    required: true,
  },

  metadata: {
    administracionTypes: [
      "gerente-general",
      "directorio",
      "administrador-unico",
      "todos-los-socios",
    ],

    formSchema: "administracionSchema",

    conditionalFields: {
      directorio: ["numeroDirectores", "nombreDirectores"],
      "gerente-general": ["nombreGerente", "rutGerente"],
      "administrador-unico": ["nombreAdministrador", "rutAdministrador"],
    },
  },
};
```

---

### **Item 5: Capital y Aportes**

```typescript
const capitalAportes: FlowItem = {
  identity: {
    id: "capital-aportes",
    label: "Capital y Aportes",
    description: "Define el capital social y los aportes",
    icon: "dollar-sign",
    badge: {
      text: "Requerido",
      variant: "destructive",
    },
  },

  hierarchy: {
    level: 1,
    order: 5,
  },

  navigation: {
    path: "/registro-societario/capital-aportes",
  },

  behavior: {
    isOptional: false,
    isLocked: true,
    requiresCompletion: true,
  },

  validation: {
    required: true,
    // Sumar aportes debe = capital social
  },

  metadata: {
    formFields: ["capitalSocial", "moneda", "numeroAcciones", "valorNominalAccion"],

    calculations: {
      // capitalSocial = sum(socios.aporteCapital)
      autoCalculateCapitalSocial: true,

      // Validar que sume 100%
      validatePercentages: true,
    },

    rules: {
      minCapitalSocial: 1,
      maxCapitalSocial: 999999999999,
    },
  },
};
```

---

### **Item 6: Objeto Social**

```typescript
const objetoSocial: FlowItem = {
  identity: {
    id: "objeto-social",
    label: "Objeto Social",
    description: "Define el objeto o giro principal",
    icon: "target",
    badge: {
      text: "Requerido",
      variant: "destructive",
    },
  },

  hierarchy: {
    level: 1,
    order: 6,
  },

  navigation: {
    path: "/registro-societario/objeto-social",
  },

  behavior: {
    isOptional: false,
    isLocked: true,
    requiresCompletion: true,
  },

  validation: {
    required: true,
    // Min 50 caracteres, max 500
  },

  metadata: {
    fieldType: "textarea",
    minLength: 50,
    maxLength: 500,

    // Suggestions IA
    aiSuggestions: true,
    aiPrompt: "Genera un objeto social basado en el giro: {giro}",

    helpText: "Describe de forma clara y completa la actividad principal de la sociedad",
  },
};
```

---

### **Item 7: Duración**

```typescript
const duracion: FlowItem = {
  identity: {
    id: "duracion",
    label: "Duración",
    description: "Plazo de duración de la sociedad",
    icon: "calendar",
    badge: {
      text: "Opcional",
      variant: "secondary",
    },
  },

  hierarchy: {
    level: 1,
    order: 7,
  },

  navigation: {
    path: "/registro-societario/duracion",
  },

  behavior: {
    isOptional: true, // ← OPCIONAL
    isLocked: true,
    requiresCompletion: false, // No bloquea siguientes
  },

  validation: {
    required: false,
  },

  metadata: {
    duracionOptions: ["indefinida", "plazo-fijo"],

    conditionalFields: {
      "plazo-fijo": ["fechaTermino", "años"],
    },

    defaultValue: "indefinida",

    helpText: "La mayoría de sociedades se constituyen con duración indefinida",
  },
};
```

---

### **Item 8: Representación**

```typescript
const representacion: FlowItem = {
  identity: {
    id: "representacion",
    label: "Representación",
    description: "Define quién representa legalmente a la sociedad",
    icon: "user-check",
    badge: {
      text: "Requerido",
      variant: "destructive",
    },
  },

  hierarchy: {
    level: 1,
    order: 8,
  },

  navigation: {
    path: "/registro-societario/representacion",
  },

  behavior: {
    isOptional: false,
    isLocked: true,
    requiresCompletion: true,
  },

  validation: {
    required: true,
  },

  metadata: {
    representacionTypes: [
      "gerente-general",
      "directorio-conjunto",
      "presidente-directorio",
      "todos-los-socios",
      "custom",
    ],

    // Si es custom, permitir texto libre
    allowCustomText: true,

    formFields: ["tipoRepresentacion", "nombreRepresentante", "rutRepresentante", "poderes"],
  },
};
```

---

### **Item 9: Documentos**

```typescript
const documentos: FlowItem = {
  identity: {
    id: "documentos",
    label: "Documentos",
    description: "Sube los documentos requeridos",
    icon: "paperclip",
    badge: {
      text: "Requerido",
      variant: "destructive",
    },
  },

  hierarchy: {
    level: 1,
    order: 9,
  },

  navigation: {
    path: "/registro-societario/documentos",
  },

  behavior: {
    isOptional: false,
    isLocked: true,
    requiresCompletion: true,
  },

  validation: {
    required: true,
    // Al menos 2 documentos requeridos
  },

  metadata: {
    documentosRequeridos: [
      {
        id: "cedula-representante",
        label: "Cédula de Identidad del Representante Legal",
        required: true,
        maxSize: 5 * 1024 * 1024, // 5MB
        acceptedFormats: ["image/jpeg", "image/png", "application/pdf"],
      },
      {
        id: "escritura-constitucion",
        label: "Escritura de Constitución (Borrador)",
        required: false,
        maxSize: 10 * 1024 * 1024, // 10MB
        acceptedFormats: ["application/pdf", "application/msword"],
      },
    ],

    allowMultiple: true,
    uploadStrategy: "single", // or 'batch'
  },
};
```

---

### **Item 10: Resumen y Confirmación**

```typescript
const resumen: FlowItem = {
  identity: {
    id: "resumen",
    label: "Resumen y Confirmación",
    description: "Revisa todos los datos antes de enviar",
    icon: "check-circle",
    badge: {
      text: "Final",
      variant: "default",
    },
  },

  hierarchy: {
    level: 1,
    order: 10,
  },

  navigation: {
    path: "/registro-societario/resumen",
  },

  behavior: {
    isOptional: false,
    isLocked: true,
    requiresCompletion: false, // Último paso, no bloquea nada
  },

  validation: {
    required: true,
    // Validar que todos los pasos anteriores estén completos
  },

  metadata: {
    showSummary: true,

    summaryGroups: [
      {
        title: "Tipo de Sociedad",
        itemId: "tipo-sociedad",
      },
      {
        title: "Datos Principales",
        itemId: "datos-principales",
      },
      {
        title: "Socios",
        itemId: "socios",
      },
      {
        title: "Administración",
        itemId: "administracion",
      },
      {
        title: "Capital y Aportes",
        itemId: "capital-aportes",
      },
      {
        title: "Objeto Social",
        itemId: "objeto-social",
      },
      {
        title: "Duración",
        itemId: "duracion",
      },
      {
        title: "Representación",
        itemId: "representacion",
      },
      {
        title: "Documentos",
        itemId: "documentos",
      },
    ],

    actions: {
      allowEdit: true, // Permitir editar cada sección
      allowSubmit: true,
      submitLabel: "Enviar a Notaría",
      submitEndpoint: "/api/registro-societario/submit",
    },
  },
};
```

---

## 2. Sucursales

**Características:**

- ✅ 5 items secuenciales
- ✅ Todos level 1 (flat)
- ✅ Sin rightSidebar
- ✅ Más simple que Registro

### **Item 1: Datos de la Sociedad**

```typescript
const datosSociedad: FlowItem = {
  identity: {
    id: "datos-sociedad",
    label: "Datos de la Sociedad",
    description: "Información de la sociedad matriz",
    icon: "building",
    badge: {
      text: "Requerido",
      variant: "destructive",
    },
  },

  hierarchy: {
    level: 1,
    order: 1,
  },

  navigation: {
    path: "/sucursales/datos-sociedad",
  },

  behavior: {
    isOptional: false,
    isLocked: false, // Primer paso, siempre desbloqueado
    requiresCompletion: true,
  },

  validation: {
    required: true,
  },

  metadata: {
    formFields: ["nombreSociedad", "rutSociedad", "tipoSociedad", "domicilioPrincipal"],

    autofillFromRut: true, // Si sociedad existe en BD

    helpText: "Los datos deben coincidir con la escritura de constitución",
  },
};
```

---

### **Item 2: Datos de la Sucursal**

```typescript
const datosSucursal: FlowItem = {
  identity: {
    id: "datos-sucursal",
    label: "Datos de la Sucursal",
    description: "Información específica de la sucursal",
    icon: "map-pin",
    badge: {
      text: "Requerido",
      variant: "destructive",
    },
  },

  hierarchy: {
    level: 1,
    order: 2,
  },

  navigation: {
    path: "/sucursales/datos-sucursal",
  },

  behavior: {
    isOptional: false,
    isLocked: true,
    requiresCompletion: true,
  },

  validation: {
    required: true,
  },

  metadata: {
    formFields: ["nombreSucursal", "direccion", "comuna", "region", "telefono", "email"],

    validateAddress: true, // Validar con API de direcciones

    geolocalization: {
      enabled: true,
      showMap: true,
    },
  },
};
```

---

### **Item 3: Representante Legal**

```typescript
const representanteLegal: FlowItem = {
  identity: {
    id: "representante-legal",
    label: "Representante Legal",
    description: "Persona que representará la sucursal",
    icon: "user",
    badge: {
      text: "Requerido",
      variant: "destructive",
    },
  },

  hierarchy: {
    level: 1,
    order: 3,
  },

  navigation: {
    path: "/sucursales/representante-legal",
  },

  behavior: {
    isOptional: false,
    isLocked: true,
    requiresCompletion: true,
  },

  validation: {
    required: true,
  },

  metadata: {
    formFields: ["nombre", "rut", "nacionalidad", "domicilio", "profesion", "cargo"],

    allowMultiple: false, // Solo 1 representante

    documentosRequeridos: ["cedula-identidad", "poder-notarial"],
  },
};
```

---

### **Item 4: Documentos**

```typescript
const documentosSucursal: FlowItem = {
  identity: {
    id: "documentos-sucursal",
    label: "Documentos",
    description: "Documentación legal requerida",
    icon: "file-text",
    badge: {
      text: "Requerido",
      variant: "destructive",
    },
  },

  hierarchy: {
    level: 1,
    order: 4,
  },

  navigation: {
    path: "/sucursales/documentos",
  },

  behavior: {
    isOptional: false,
    isLocked: true,
    requiresCompletion: true,
  },

  validation: {
    required: true,
  },

  metadata: {
    documentosRequeridos: [
      {
        id: "escritura-constitucion",
        label: "Escritura de Constitución de la Sociedad",
        required: true,
        acceptedFormats: ["application/pdf"],
      },
      {
        id: "cedula-representante",
        label: "Cédula del Representante Legal",
        required: true,
        acceptedFormats: ["image/jpeg", "image/png", "application/pdf"],
      },
      {
        id: "poder-notarial",
        label: "Poder Notarial",
        required: true,
        acceptedFormats: ["application/pdf"],
      },
    ],
  },
};
```

---

### **Item 5: Resumen**

```typescript
const resumenSucursal: FlowItem = {
  identity: {
    id: "resumen-sucursal",
    label: "Resumen",
    description: "Confirmación final",
    icon: "check-circle",
    badge: {
      text: "Final",
      variant: "default",
    },
  },

  hierarchy: {
    level: 1,
    order: 5,
  },

  navigation: {
    path: "/sucursales/resumen",
  },

  behavior: {
    isOptional: false,
    isLocked: true,
    requiresCompletion: false,
  },

  validation: {
    required: true,
  },

  metadata: {
    showSummary: true,

    summaryGroups: [
      { title: "Sociedad", itemId: "datos-sociedad" },
      { title: "Sucursal", itemId: "datos-sucursal" },
      { title: "Representante", itemId: "representante-legal" },
      { title: "Documentos", itemId: "documentos-sucursal" },
    ],

    actions: {
      submitLabel: "Enviar a Registro",
      submitEndpoint: "/api/sucursales/submit",
    },
  },
};
```

---

## 3. Juntas de Accionistas

**Características:**

- ✅ Estructura jerárquica (hasta 4 niveles)
- ✅ Con rightSidebar (sub-items)
- ✅ Más complejo que otros flujos
- ✅ Algunos items con children

### **Item 1: Convocatoria (Level 1)**

```typescript
const convocatoria: FlowItem = {
  identity: {
    id: "convocatoria",
    label: "Convocatoria",
    description: "Preparación y envío de convocatoria",
    icon: "bell",
    badge: {
      text: "Paso 1",
      variant: "default",
    },
  },

  hierarchy: {
    level: 1,
    order: 1,
    // Tiene children (sub-pasos)
  },

  navigation: {
    path: "/juntas-accionistas/convocatoria",
  },

  behavior: {
    isOptional: false,
    isLocked: false, // Primer paso
    requiresCompletion: true,
  },

  rightSidebar: {
    enabled: true,
    title: "Pasos de Convocatoria",
    items: [
      // Sub-items (Level 2) se definen abajo
    ],
  },

  validation: {
    required: true,
    // Todos los children deben completarse
  },

  metadata: {
    estimatedTime: "30 minutos",
    hasSubSteps: true,
    totalSubSteps: 3,
  },

  // ⬇️ CHILDREN (Level 2)
  children: [
    {
      identity: {
        id: "convocatoria-datos-basicos",
        label: "Datos Básicos",
        description: "Información general de la junta",
        icon: "info",
      },

      hierarchy: {
        level: 2,
        order: 1,
        parentId: "convocatoria",
      },

      navigation: {
        path: "/juntas-accionistas/convocatoria/datos-basicos",
      },

      behavior: {
        isOptional: false,
        isLocked: false,
        requiresCompletion: true,
      },

      validation: {
        required: true,
      },

      metadata: {
        formFields: [
          "tipoJunta", // ordinaria / extraordinaria
          "fechaJunta",
          "horaJunta",
          "lugar",
          "modalidad", // presencial / remota / mixta
        ],
      },
    },

    {
      identity: {
        id: "convocatoria-accionistas",
        label: "Accionistas",
        description: "Selecciona los accionistas a convocar",
        icon: "users",
      },

      hierarchy: {
        level: 2,
        order: 2,
        parentId: "convocatoria",
      },

      navigation: {
        path: "/juntas-accionistas/convocatoria/accionistas",
      },

      behavior: {
        isOptional: false,
        isLocked: true, // Se desbloquea al completar datos-basicos
        requiresCompletion: true,
      },

      validation: {
        required: true,
        // Al menos 1 accionista debe ser convocado
      },

      metadata: {
        allowSelectAll: true,
        allowSearch: true,
        showPercentage: true, // % de acciones de cada uno

        accionistaFields: ["nombre", "rut", "email", "porcentajeAcciones", "numeroAcciones"],
      },
    },

    {
      identity: {
        id: "convocatoria-citacion",
        label: "Citación",
        description: "Envía la citación a los accionistas",
        icon: "send",
      },

      hierarchy: {
        level: 2,
        order: 3,
        parentId: "convocatoria",
      },

      navigation: {
        path: "/juntas-accionistas/convocatoria/citacion",
      },

      behavior: {
        isOptional: false,
        isLocked: true,
        requiresCompletion: true,
      },

      validation: {
        required: true,
      },

      metadata: {
        citacionMethods: ["email", "certificada", "ambas"],

        emailTemplate: "citacion-junta-accionistas",

        // Validar plazo legal (15 días hábiles antes)
        validateLegalDeadline: true,
        minDaysBeforeJunta: 15,

        // Tracking de envíos
        trackDelivery: true,
        showDeliveryStatus: true,
      },
    },
  ],
};
```

---

### **Item 2: Preparación (Level 1)**

```typescript
const preparacion: FlowItem = {
  identity: {
    id: "preparacion",
    label: "Preparación",
    description: "Preparar documentos y tabla de la junta",
    icon: "file-edit",
    badge: {
      text: "Paso 2",
      variant: "default",
    },
  },

  hierarchy: {
    level: 1,
    order: 2,
  },

  navigation: {
    path: "/juntas-accionistas/preparacion",
  },

  behavior: {
    isOptional: false,
    isLocked: true, // Se desbloquea al completar Convocatoria
    requiresCompletion: true,
  },

  rightSidebar: {
    enabled: true,
    title: "Documentos de Preparación",
    items: [], // Children se mapean automáticamente
  },

  validation: {
    required: true,
  },

  metadata: {
    estimatedTime: "1 hora",
    hasSubSteps: true,
    totalSubSteps: 2,
  },

  // ⬇️ CHILDREN (Level 2)
  children: [
    {
      identity: {
        id: "preparacion-tabla",
        label: "Tabla de la Junta",
        description: "Define los temas a tratar",
        icon: "list",
      },

      hierarchy: {
        level: 2,
        order: 1,
        parentId: "preparacion",
      },

      navigation: {
        path: "/juntas-accionistas/preparacion/tabla",
      },

      behavior: {
        isOptional: false,
        isLocked: false,
        requiresCompletion: true,
      },

      validation: {
        required: true,
        // Al menos 1 tema requerido
      },

      metadata: {
        allowReorder: true, // Drag & drop
        allowAddMultiple: true,

        temaFields: [
          "orden",
          "titulo",
          "descripcion",
          "tipoVotacion", // unanimidad / mayoria-simple / 2/3
          "documentosAdjuntos",
        ],

        temasComunes: [
          "Aprobación de Estados Financieros",
          "Distribución de Dividendos",
          "Elección de Directorio",
          "Modificación de Estatutos",
        ],
      },
    },

    {
      identity: {
        id: "preparacion-documentos",
        label: "Documentos",
        description: "Adjunta documentos de soporte",
        icon: "paperclip",
      },

      hierarchy: {
        level: 2,
        order: 2,
        parentId: "preparacion",
      },

      navigation: {
        path: "/juntas-accionistas/preparacion/documentos",
      },

      behavior: {
        isOptional: true, // ← OPCIONAL
        isLocked: true,
        requiresCompletion: false,
      },

      validation: {
        required: false,
      },

      metadata: {
        documentosOpcionales: [
          "estados-financieros",
          "informes-gerencia",
          "propuestas-modificacion",
          "otros",
        ],

        maxFileSize: 20 * 1024 * 1024, // 20MB
        acceptedFormats: ["application/pdf", "application/msword"],
      },
    },
  ],
};
```

---

### **Item 3: Celebración (Level 1) - CON LEVEL 3!**

```typescript
const celebracion: FlowItem = {
  identity: {
    id: "celebracion",
    label: "Celebración",
    description: "Realizar la junta y registrar votos",
    icon: "calendar-check",
    badge: {
      text: "Paso 3",
      variant: "default",
    },
  },

  hierarchy: {
    level: 1,
    order: 3,
  },

  navigation: {
    path: "/juntas-accionistas/celebracion",
  },

  behavior: {
    isOptional: false,
    isLocked: true,
    requiresCompletion: true,
  },

  rightSidebar: {
    enabled: true,
    title: "Pasos de Celebración",
    items: [],
  },

  validation: {
    required: true,
  },

  metadata: {
    estimatedTime: "2 horas",
    hasSubSteps: true,
    totalSubSteps: 3,
  },

  // ⬇️ CHILDREN (Level 2)
  children: [
    {
      identity: {
        id: "celebracion-quorum",
        label: "Quórum",
        description: "Verificar quórum de asistencia",
        icon: "user-check",
      },

      hierarchy: {
        level: 2,
        order: 1,
        parentId: "celebracion",
      },

      navigation: {
        path: "/juntas-accionistas/celebracion/quorum",
      },

      behavior: {
        isOptional: false,
        isLocked: false,
        requiresCompletion: true,
      },

      validation: {
        required: true,
        // Quórum debe ser >= 50% + 1
      },

      metadata: {
        showPercentageCalculator: true,

        // Marcar asistentes
        accionistasConvocados: [], // Se carga desde convocatoria-accionistas

        fields: [
          "asistente", // boolean
          "representado", // boolean (puede enviar representante)
          "nombreRepresentante",
          "poderRepresentacion",
        ],

        realTimeCalculation: {
          totalAccionesConvocadas: 0,
          totalAccionesPresentes: 0,
          porcentajeQuorum: 0,
        },

        quorumRequerido: 50, // %

        alertIfNoQuorum: true,
      },
    },

    {
      identity: {
        id: "celebracion-votaciones",
        label: "Votaciones",
        description: "Registrar votaciones de cada tema",
        icon: "check-square",
      },

      hierarchy: {
        level: 2,
        order: 2,
        parentId: "celebracion",
      },

      navigation: {
        path: "/juntas-accionistas/celebracion/votaciones",
      },

      behavior: {
        isOptional: false,
        isLocked: true,
        requiresCompletion: true,
      },

      validation: {
        required: true,
      },

      metadata: {
        // Cargar temas desde preparacion-tabla
        temasTabla: [],

        hasSubSteps: true, // ← ¡Nivel 3!
        totalSubSteps: 0, // Dinámico según número de temas
      },

      // ⬇️⬇️⬇️ CHILDREN LEVEL 3 ⬇️⬇️⬇️
      children: [
        // Esto se genera dinámicamente desde preparacion-tabla
        // Ejemplo con 1 tema:
        {
          identity: {
            id: "votacion-tema-1",
            label: "Aprobación de EEFF",
            description: "Votar tema: Aprobación de Estados Financieros",
            icon: "vote",
          },

          hierarchy: {
            level: 3, // ← LEVEL 3
            order: 1,
            parentId: "celebracion-votaciones",
          },

          navigation: {
            path: "/juntas-accionistas/celebracion/votaciones/tema-1",
          },

          behavior: {
            isOptional: false,
            isLocked: false,
            requiresCompletion: true,
          },

          validation: {
            required: true,
          },

          metadata: {
            temaId: "aprobacion-eeff",
            tipoVotacion: "mayoria-simple", // o '2/3', 'unanimidad'

            votosPosibles: ["a-favor", "en-contra", "abstencion"],

            // Por cada accionista presente:
            votosRegistrados: [
              {
                accionistaId: "acc-001",
                nombre: "Juan Pérez",
                numeroAcciones: 1000,
                voto: "a-favor",
              },
              {
                accionistaId: "acc-002",
                nombre: "María González",
                numeroAcciones: 500,
                voto: "en-contra",
              },
            ],

            resultado: {
              totalAcciones: 1500,
              aFavor: 1000, // 66.67%
              enContra: 500, // 33.33%
              abstenciones: 0,
              aprobado: true, // Porque > 50%
            },
          },

          // ⬇️⬇️⬇️⬇️ CHILDREN LEVEL 4 (si fuera necesario) ⬇️⬇️⬇️⬇️
          // Ejemplo: Sub-votaciones o enmiendas
          children: [
            {
              identity: {
                id: "votacion-tema-1-enmienda",
                label: "Enmienda al tema",
                icon: "edit",
              },

              hierarchy: {
                level: 4, // ← LEVEL 4 (máximo permitido)
                order: 1,
                parentId: "votacion-tema-1",
              },

              navigation: {
                path: "/juntas-accionistas/celebracion/votaciones/tema-1/enmienda",
              },

              behavior: {
                isOptional: true,
                isLocked: false,
                requiresCompletion: false,
              },

              validation: {
                required: false,
              },

              metadata: {
                enmiendaTexto: "Modificar el punto 3.2 de los EEFF",
                propuestoPor: "María González",
              },
            },
          ],
        },
      ],
    },

    {
      identity: {
        id: "celebracion-acta",
        label: "Acta",
        description: "Generar acta de la junta",
        icon: "file-text",
      },

      hierarchy: {
        level: 2,
        order: 3,
        parentId: "celebracion",
      },

      navigation: {
        path: "/juntas-accionistas/celebracion/acta",
      },

      behavior: {
        isOptional: false,
        isLocked: true,
        requiresCompletion: true,
      },

      validation: {
        required: true,
      },

      metadata: {
        autoGenerate: true, // Generar automáticamente desde datos anteriores

        template: "acta-junta-accionistas",

        includeInActa: [
          "fecha",
          "hora",
          "lugar",
          "asistentes",
          "quorum",
          "tablaJunta",
          "votaciones",
          "acuerdos",
        ],

        allowEdit: true,
        allowDownloadPDF: true,

        signatures: {
          required: true,
          signatories: [
            "presidente",
            "secretario",
            "accionistas", // Opcional
          ],
        },
      },
    },
  ],
};
```

---

### **Item 4: Post-Junta (Level 1)**

```typescript
const postJunta: FlowItem = {
  identity: {
    id: "post-junta",
    label: "Post-Junta",
    description: "Formalización y archivo de documentos",
    icon: "archive",
    badge: {
      text: "Paso 4",
      variant: "default",
    },
  },

  hierarchy: {
    level: 1,
    order: 4,
  },

  navigation: {
    path: "/juntas-accionistas/post-junta",
  },

  behavior: {
    isOptional: false,
    isLocked: true,
    requiresCompletion: false, // Último paso
  },

  rightSidebar: {
    enabled: true,
    title: "Tareas Post-Junta",
    items: [],
  },

  validation: {
    required: true,
  },

  metadata: {
    estimatedTime: "30 minutos",
    hasSubSteps: true,
    totalSubSteps: 3,
  },

  children: [
    {
      identity: {
        id: "post-junta-protocolizacion",
        label: "Protocolización",
        description: "Enviar acta a protocolizar",
        icon: "stamp",
      },

      hierarchy: {
        level: 2,
        order: 1,
        parentId: "post-junta",
      },

      navigation: {
        path: "/juntas-accionistas/post-junta/protocolizacion",
      },

      behavior: {
        isOptional: true, // No todas las juntas requieren protocolización
        isLocked: false,
        requiresCompletion: false,
      },

      validation: {
        required: false,
      },

      metadata: {
        notarias: [], // Lista de notarías disponibles

        // Si modificó estatutos, ES OBLIGATORIO
        conditionalRequired: {
          field: "modificoEstatutos",
          value: true,
          thenRequired: true,
        },
      },
    },

    {
      identity: {
        id: "post-junta-publicacion",
        label: "Publicación",
        description: "Publicar acuerdos si es necesario",
        icon: "globe",
      },

      hierarchy: {
        level: 2,
        order: 2,
        parentId: "post-junta",
      },

      navigation: {
        path: "/juntas-accionistas/post-junta/publicacion",
      },

      behavior: {
        isOptional: true,
        isLocked: false,
        requiresCompletion: false,
      },

      validation: {
        required: false,
      },

      metadata: {
        publicacionTypes: ["diario-oficial", "diario-local", "sitio-web-svs"],
      },
    },

    {
      identity: {
        id: "post-junta-archivo",
        label: "Archivo",
        description: "Archivar documentos finales",
        icon: "folder",
      },

      hierarchy: {
        level: 2,
        order: 3,
        parentId: "post-junta",
      },

      navigation: {
        path: "/juntas-accionistas/post-junta/archivo",
      },

      behavior: {
        isOptional: false,
        isLocked: false,
        requiresCompletion: false,
      },

      validation: {
        required: true,
      },

      metadata: {
        documentosParaArchivar: [
          "acta-firmada",
          "convocatoria",
          "tabla-junta",
          "votaciones",
          "asistencia",
          "documentos-soporte",
        ],

        uploadToStorage: true,
        storageLocation: "/juntas-accionistas/{juntaId}/documentos-finales",
      },
    },
  ],
};
```

---

## 🎯 Resumen

### **Registro de Sociedades:**

- 10 items flat (level 1)
- Sequential
- Sin rightSidebar
- Metadata extensa para formularios

### **Sucursales:**

- 5 items flat (level 1)
- Sequential
- Más simple
- Sin rightSidebar

### **Juntas de Accionistas:**

- 4 items level 1
- Hasta 12+ items level 2
- Hasta 4+ items level 3
- 1 item level 4 (ejemplo)
- Hierarchical
- Con rightSidebar
- Metadata compleja

---

**Estado:** 📝 Variables Completas - 3 flujos documentados  
**Última Actualización:** 2 de Noviembre, 2025  
**Total Items:** 37+ FlowItems con todas sus propiedades
