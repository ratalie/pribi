# TODO-001: Estructura de Datos - VARIABLES FLOWCONFIG

**Objetivo:** Configuraciones completas de FlowConfig para los 3 flujos

---

## 📋 Índice

1. [Registro de Sociedades Config](#1-registro-de-sociedades-config)
2. [Sucursales Config](#2-sucursales-config)
3. [Juntas de Accionistas Config](#3-juntas-de-accionistas-config)

---

## 1. Registro de Sociedades Config

```typescript
// app/config/flows/registro.flow.ts

import type { FlowConfig } from "~/types/flow-system";
import {
  tipoSociedad,
  datosPrincipales,
  socios,
  administracion,
  capitalAportes,
  objetoSocial,
  duracion,
  representacion,
  documentos,
  resumen,
} from "./registro-flow-items";

export const registroSociedadesConfig: FlowConfig = {
  /**
   * Identificación del flujo
   */
  identity: {
    id: "registro-sociedades",
    name: "Registro de Sociedades",
    description: "Flujo completo para registrar una nueva sociedad en Chile",
  },

  /**
   * Estructura del flujo
   */
  structure: {
    /**
     * Tipo de navegación: Sequential
     * Los items se recorren en orden 1 → 2 → 3 → ... → 10
     */
    type: "sequential",

    /**
     * Nivel máximo permitido: 1
     * Todos los items están al mismo nivel (flat structure)
     */
    maxLevels: 1,

    /**
     * Items de navegación
     * Array de 10 FlowItems secuenciales
     */
    navigation: [
      tipoSociedad, // 1. Tipo de Sociedad
      datosPrincipales, // 2. Datos Principales
      socios, // 3. Socios
      administracion, // 4. Administración
      capitalAportes, // 5. Capital y Aportes
      objetoSocial, // 6. Objeto Social
      duracion, // 7. Duración (OPCIONAL)
      representacion, // 8. Representación
      documentos, // 9. Documentos
      resumen, // 10. Resumen y Confirmación
    ],
  },

  /**
   * Reglas de navegación
   */
  navigationRules: {
    /**
     * NO permitir saltar pasos adelante
     * Usuario debe completar paso actual antes de avanzar
     */
    allowJumpAhead: false,

    /**
     * Requiere completar pasos secuencialmente
     * No se puede saltar del paso 1 al paso 5
     */
    requireSequential: true,

    /**
     * Desbloquear siguiente paso automáticamente
     * Al completar paso N, paso N+1 se desbloquea
     */
    autoUnlock: true,
  },

  /**
   * Configuración de UI
   */
  ui: {
    /**
     * Sidebar izquierdo (navegación principal)
     */
    leftSidebar: {
      enabled: true,
      collapsible: true,
      defaultCollapsed: false, // Abierto por defecto
    },

    /**
     * Sidebar derecho (NO usado en Registro)
     */
    rightSidebar: {
      enabled: false, // ← NO se usa
      collapsible: false,
      defaultCollapsed: false,
    },

    /**
     * Header
     */
    header: {
      enabled: true,
      title: "Registro de Sociedades",
      showProgress: true, // Mostrar "Paso 3 de 10"
    },

    /**
     * Footer con botones de navegación
     */
    footer: {
      enabled: true,
      showButtons: true, // "Anterior" y "Siguiente"
    },
  },

  /**
   * Persistencia de datos
   */
  persistence: {
    enabled: true,
    key: "registro-sociedades-progress", // localStorage key
    autosave: true,
    autosaveInterval: 30000, // 30 segundos
  },

  /**
   * Event handlers (callbacks)
   */
  events: {
    /**
     * Se ejecuta cuando cambia el progreso
     * @param progress - Porcentaje de progreso (0-100)
     */
    onProgressUpdate: (progress: number) => {
      console.log(`Progreso actualizado: ${progress}%`);

      // Tracking analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "progress_update", {
          flow: "registro-sociedades",
          progress,
        });
      }
    },

    /**
     * Se ejecuta cuando se completa todo el flujo
     */
    onFlowComplete: () => {
      console.log("¡Flujo completado! Redirigiendo a resumen...");

      // Analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "flow_complete", {
          flow: "registro-sociedades",
        });
      }

      // Redireccionar (optional)
      // navigateTo('/registro-societario/resumen')
    },

    /**
     * Se ejecuta al hacer click en un item
     * @param itemId - ID del item clickeado
     */
    onItemClick: (itemId: string) => {
      console.log(`Item clickeado: ${itemId}`);

      // Tracking
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "item_click", {
          flow: "registro-sociedades",
          item_id: itemId,
        });
      }
    },

    /**
     * Se ejecuta cuando se completa un item
     * @param itemId - ID del item completado
     */
    onItemComplete: (itemId: string) => {
      console.log(`Item completado: ${itemId}`);

      // Notificación de éxito
      // toast.success(`Paso "${itemId}" completado`)

      // Analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "item_complete", {
          flow: "registro-sociedades",
          item_id: itemId,
        });
      }
    },
  },

  /**
   * Metadata custom
   */
  metadata: {
    // Versión del flujo (para migraciones)
    version: "2.0.0",

    // Fecha de última actualización
    lastUpdated: "2025-11-02",

    // Responsable del flujo
    owner: "Equipo Societario",

    // Tags para búsqueda
    tags: ["registro", "sociedades", "constitución", "legal"],

    // Estimación de tiempo total
    estimatedTime: "45-60 minutos",

    // Dificultad
    difficulty: "media",

    // Requiere autenticación
    requiresAuth: true,

    // Roles permitidos
    allowedRoles: ["user", "admin", "abogado"],

    // Integración con backend
    backendApi: {
      baseUrl: "/api/registro-societario",
      endpoints: {
        save: "/api/registro-societario/save",
        submit: "/api/registro-societario/submit",
        validate: "/api/registro-societario/validate",
      },
    },

    // Features habilitados
    features: {
      aiSuggestions: true,
      autoSave: true,
      progressTracking: true,
      stepValidation: true,
      documentGeneration: true,
    },
  },
};
```

---

## 2. Sucursales Config

```typescript
// app/config/flows/sucursales.flow.ts

import type { FlowConfig } from "~/types/flow-system";
import {
  datosSociedad,
  datosSucursal,
  representanteLegal,
  documentosSucursal,
  resumenSucursal,
} from "./sucursales-flow-items";

export const sucursalesConfig: FlowConfig = {
  /**
   * Identificación del flujo
   */
  identity: {
    id: "sucursales",
    name: "Registro de Sucursales",
    description: "Apertura de sucursales para sociedades existentes",
  },

  /**
   * Estructura del flujo
   */
  structure: {
    /**
     * Tipo: Sequential (simple)
     */
    type: "sequential",

    /**
     * Nivel máximo: 1 (flat)
     */
    maxLevels: 1,

    /**
     * 5 items secuenciales
     */
    navigation: [
      datosSociedad, // 1. Datos de la Sociedad
      datosSucursal, // 2. Datos de la Sucursal
      representanteLegal, // 3. Representante Legal
      documentosSucursal, // 4. Documentos
      resumenSucursal, // 5. Resumen
    ],
  },

  /**
   * Reglas de navegación (igual que Registro)
   */
  navigationRules: {
    allowJumpAhead: false,
    requireSequential: true,
    autoUnlock: true,
  },

  /**
   * Configuración de UI
   */
  ui: {
    leftSidebar: {
      enabled: true,
      collapsible: true,
      defaultCollapsed: false,
    },

    /**
     * Sucursales tampoco usa rightSidebar
     */
    rightSidebar: {
      enabled: false,
      collapsible: false,
      defaultCollapsed: false,
    },

    header: {
      enabled: true,
      title: "Registro de Sucursales",
      showProgress: true,
    },

    footer: {
      enabled: true,
      showButtons: true,
    },
  },

  /**
   * Persistencia
   */
  persistence: {
    enabled: true,
    key: "sucursales-progress",
    autosave: true,
    autosaveInterval: 30000,
  },

  /**
   * Event handlers
   */
  events: {
    onProgressUpdate: (progress: number) => {
      console.log(`Sucursales - Progreso: ${progress}%`);
    },

    onFlowComplete: () => {
      console.log("Sucursales - Flujo completado");

      // Redirigir a dashboard
      // navigateTo('/sucursales/dashboard')
    },

    onItemClick: (itemId: string) => {
      console.log(`Sucursales - Item: ${itemId}`);
    },

    onItemComplete: (itemId: string) => {
      console.log(`Sucursales - Item completado: ${itemId}`);
    },
  },

  /**
   * Metadata
   */
  metadata: {
    version: "1.0.0",
    lastUpdated: "2025-11-02",
    owner: "Equipo Sucursales",
    tags: ["sucursales", "sociedades", "registro"],
    estimatedTime: "20-30 minutos",
    difficulty: "fácil",
    requiresAuth: true,
    allowedRoles: ["user", "admin", "abogado"],

    backendApi: {
      baseUrl: "/api/sucursales",
      endpoints: {
        save: "/api/sucursales/save",
        submit: "/api/sucursales/submit",
        validate: "/api/sucursales/validate",
      },
    },

    features: {
      aiSuggestions: false, // No usa IA
      autoSave: true,
      progressTracking: true,
      stepValidation: true,
      documentGeneration: true,
      geolocation: true, // ← Único feature especial
      addressValidation: true,
    },
  },
};
```

---

## 3. Juntas de Accionistas Config

```typescript
// app/config/flows/juntas.flow.ts

import type { FlowConfig } from "~/types/flow-system";
import { convocatoria, preparacion, celebracion, postJunta } from "./juntas-flow-items";

export const juntasAccionistasConfig: FlowConfig = {
  /**
   * Identificación del flujo
   */
  identity: {
    id: "juntas-accionistas",
    name: "Juntas de Accionistas",
    description: "Gestión completa de juntas de accionistas (ordinarias y extraordinarias)",
  },

  /**
   * Estructura del flujo
   */
  structure: {
    /**
     * Tipo: Hierarchical
     * Cada paso tiene sub-pasos (hasta 4 niveles)
     */
    type: "hierarchical",

    /**
     * Nivel máximo: 4
     * Level 1: Convocatoria, Preparación, Celebración, Post-Junta
     * Level 2: Sub-pasos de cada uno (3-4 por nivel)
     * Level 3: Votaciones individuales
     * Level 4: Enmiendas o sub-votaciones
     */
    maxLevels: 4,

    /**
     * 4 items principales (Level 1)
     * Cada uno con children (Level 2, 3, 4)
     */
    navigation: [
      convocatoria, // Con 3 children (Level 2)
      preparacion, // Con 2 children (Level 2)
      celebracion, // Con 3 children (Level 2) + votaciones (Level 3) + enmiendas (Level 4)
      postJunta, // Con 3 children (Level 2)
    ],
  },

  /**
   * Reglas de navegación
   */
  navigationRules: {
    /**
     * SÍ permitir saltar entre sub-pasos del mismo nivel
     * Ejemplo: En Convocatoria, puedo saltar entre Datos Básicos ↔ Accionistas ↔ Citación
     */
    allowJumpAhead: true, // ← Diferente de Registro/Sucursales

    /**
     * NO requiere secuencial estricto dentro de un nivel
     * Pero SÍ requiere completar nivel N antes de nivel N+1
     */
    requireSequential: false, // ← Diferente

    /**
     * Desbloquear automáticamente sub-pasos al entrar a un paso padre
     */
    autoUnlock: true,
  },

  /**
   * Configuración de UI
   */
  ui: {
    /**
     * Sidebar izquierdo: Navegación principal (4 steps)
     */
    leftSidebar: {
      enabled: true,
      collapsible: true,
      defaultCollapsed: false,

      // CUSTOM: Mostrar solo Level 1 en leftSidebar
      // Level 2-4 se muestran en rightSidebar
    },

    /**
     * Sidebar derecho: Sub-pasos del step actual
     * ← ESTA ES LA DIFERENCIA CLAVE
     */
    rightSidebar: {
      enabled: true, // ← USADO en Juntas
      collapsible: true,
      defaultCollapsed: false,

      // CUSTOM: Mostrar solo children del item activo
      // Si estoy en "Convocatoria", rightSidebar muestra:
      // - Datos Básicos
      // - Accionistas
      // - Citación
    },

    /**
     * Header
     */
    header: {
      enabled: true,
      title: "Juntas de Accionistas",
      showProgress: true, // "Paso 2 de 4" (solo Level 1)
    },

    /**
     * Footer
     */
    footer: {
      enabled: true,
      showButtons: true, // "Anterior" y "Siguiente" entre sub-pasos
    },
  },

  /**
   * Persistencia
   */
  persistence: {
    enabled: true,
    key: "juntas-accionistas-progress",
    autosave: true,
    autosaveInterval: 15000, // Cada 15 segundos (más frecuente por complejidad)
  },

  /**
   * Event handlers
   */
  events: {
    /**
     * Progress update
     * Calcula progreso recursivamente (todos los niveles)
     */
    onProgressUpdate: (progress: number) => {
      console.log(`Juntas - Progreso: ${progress}%`);

      // Guardar en store
      const store = useJuntasStore();
      store.updateProgress(progress);

      // Analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "progress_update", {
          flow: "juntas-accionistas",
          progress,
        });
      }
    },

    /**
     * Flow complete
     */
    onFlowComplete: () => {
      console.log("Juntas - Flujo completado");

      // Mostrar modal de éxito
      // showSuccessModal()

      // Descargar acta automáticamente
      // downloadActa()

      // Redirigir
      // navigateTo('/juntas-accionistas/dashboard')

      // Analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "flow_complete", {
          flow: "juntas-accionistas",
        });
      }
    },

    /**
     * Item click
     */
    onItemClick: (itemId: string) => {
      console.log(`Juntas - Item clickeado: ${itemId}`);

      // Si es un item Level 2+, actualizar rightSidebar
      const store = useJuntasStore();
      store.setActiveItem(itemId);

      // Tracking
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "item_click", {
          flow: "juntas-accionistas",
          item_id: itemId,
        });
      }
    },

    /**
     * Item complete
     */
    onItemComplete: (itemId: string) => {
      console.log(`Juntas - Item completado: ${itemId}`);

      // Notificación
      // toast.success(`Paso completado: ${itemId}`)

      // Si es votación (Level 3), validar quórum
      if (itemId.startsWith("votacion-tema-")) {
        // validateQuorumForVotacion(itemId)
      }

      // Analytics
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "item_complete", {
          flow: "juntas-accionistas",
          item_id: itemId,
        });
      }
    },
  },

  /**
   * Metadata
   */
  metadata: {
    version: "3.0.0",
    lastUpdated: "2025-11-02",
    owner: "Equipo Juntas",
    tags: ["juntas", "accionistas", "votaciones", "actas", "corporate-governance"],
    estimatedTime: "2-4 horas",
    difficulty: "alta",
    requiresAuth: true,
    allowedRoles: ["user", "admin", "abogado", "secretario-junta"],

    /**
     * Backend API
     */
    backendApi: {
      baseUrl: "/api/juntas-accionistas",
      endpoints: {
        save: "/api/juntas-accionistas/save",
        submit: "/api/juntas-accionistas/submit",
        validate: "/api/juntas-accionistas/validate",

        // Endpoints específicos de Juntas
        sendConvocatoria: "/api/juntas-accionistas/send-convocatoria",
        validateQuorum: "/api/juntas-accionistas/validate-quorum",
        registerVote: "/api/juntas-accionistas/register-vote",
        generateActa: "/api/juntas-accionistas/generate-acta",
        protocolizarActa: "/api/juntas-accionistas/protocolizar-acta",
      },
    },

    /**
     * Features especiales de Juntas
     */
    features: {
      aiSuggestions: true,
      autoSave: true,
      progressTracking: true,
      stepValidation: true,
      documentGeneration: true,

      // Features específicos
      rightSidebar: true, // ← ÚNICO flujo con rightSidebar
      hierarchicalNavigation: true,
      multiLevelVoting: true,
      quorumValidation: true,
      realTimeVoting: true, // Votar en tiempo real durante junta
      emailNotifications: true,
      actaGeneration: true,
      protocolizacion: true,
      signatureIntegration: true, // Integración con DocuSign/similares
    },

    /**
     * Configuración de votaciones
     */
    votingConfig: {
      allowProxy: true, // Permitir representación
      requireQuorum: true,
      minQuorum: 50, // %
      votingTypes: ["mayoria-simple", "2/3", "unanimidad"],
      allowAbstention: true,
      allowBlankVote: false,
    },

    /**
     * Configuración de notificaciones
     */
    notifications: {
      enabled: true,
      channels: ["email", "sms", "app"],

      triggers: {
        convocatoriaEnviada: true,
        recordatorioJunta: true, // 24h antes
        quorumAlcanzado: true,
        votacionIniciada: true,
        actaDisponible: true,
      },
    },

    /**
     * Integración con calendario
     */
    calendar: {
      enabled: true,
      providers: ["google", "outlook", "ical"],
      autoCreateEvent: true,
      includeReminders: true,
    },
  },
};
```

---

## 🔧 Uso de las Configuraciones

### **1. Importar en Store**

```typescript
// app/stores/useFlowNavigationStore.ts

import { defineStore } from "pinia";
import { registroSociedadesConfig } from "~/config/flows/registro.flow";
import { sucursalesConfig } from "~/config/flows/sucursales.flow";
import { juntasAccionistasConfig } from "~/config/flows/juntas.flow";

export const useFlowNavigationStore = defineStore("flow-navigation", {
  state: () => ({
    currentFlowId: null as string | null,
    currentConfig: null as FlowConfig | null,
  }),

  actions: {
    loadFlow(flowId: "registro-sociedades" | "sucursales" | "juntas-accionistas") {
      switch (flowId) {
        case "registro-sociedades":
          this.currentConfig = registroSociedadesConfig;
          break;
        case "sucursales":
          this.currentConfig = sucursalesConfig;
          break;
        case "juntas-accionistas":
          this.currentConfig = juntasAccionistasConfig;
          break;
      }

      this.currentFlowId = flowId;
    },
  },
});
```

---

### **2. Usar en Layout**

```vue
<!-- app/layouts/flow-layout.vue -->
<script setup lang="ts">
  import { useFlowNavigationStore } from "~/stores/useFlowNavigationStore";

  const store = useFlowNavigationStore();
  const route = useRoute();

  // Cargar configuración según ruta
  onMounted(() => {
    if (route.path.startsWith("/registro-societario")) {
      store.loadFlow("registro-sociedades");
    } else if (route.path.startsWith("/sucursales")) {
      store.loadFlow("sucursales");
    } else if (route.path.startsWith("/juntas-accionistas")) {
      store.loadFlow("juntas-accionistas");
    }
  });

  const config = computed(() => store.currentConfig);
</script>

<template>
  <div v-if="config" class="flow-layout">
    <!-- Sidebar Izquierdo -->
    <FlowSidebar
      v-if="config.ui.leftSidebar.enabled"
      :items="config.structure.navigation"
      :collapsible="config.ui.leftSidebar.collapsible"
      :collapsed="config.ui.leftSidebar.defaultCollapsed"
    />

    <!-- Contenido Principal -->
    <main>
      <!-- Header -->
      <FlowHeader
        v-if="config.ui.header?.enabled"
        :title="config.ui.header.title"
        :show-progress="config.ui.header.showProgress"
      />

      <!-- Contenido de la página -->
      <slot />

      <!-- Footer -->
      <FlowFooter
        v-if="config.ui.footer?.enabled"
        :show-buttons="config.ui.footer.showButtons"
      />
    </main>

    <!-- Sidebar Derecho (solo Juntas) -->
    <FlowRightSidebar
      v-if="config.ui.rightSidebar.enabled"
      :items="getCurrentSubSteps()"
      :collapsible="config.ui.rightSidebar.collapsible"
      :collapsed="config.ui.rightSidebar.defaultCollapsed"
    />
  </div>
</template>
```

---

### **3. Validación con Zod**

```typescript
// Al cargar configuración desde backend o archivo
import { FlowConfigSchema } from "~/types/flow-system/schemas";

const configFromAPI = await fetch("/api/flows/registro-sociedades").then((r) => r.json());

// Validar estructura
try {
  const validConfig = FlowConfigSchema.parse(configFromAPI);
  console.log("✅ Configuración válida:", validConfig);
} catch (error) {
  console.error("❌ Configuración inválida:", error);
}
```

---

## 📊 Comparación de Configuraciones

| Feature                | Registro   | Sucursales | Juntas       |
| ---------------------- | ---------- | ---------- | ------------ |
| **Tipo**               | Sequential | Sequential | Hierarchical |
| **Max Levels**         | 1          | 1          | 4            |
| **Total Items**        | 10         | 5          | 30+          |
| **Right Sidebar**      | ❌ No      | ❌ No      | ✅ Sí        |
| **Allow Jump Ahead**   | ❌ No      | ❌ No      | ✅ Sí        |
| **Require Sequential** | ✅ Sí      | ✅ Sí      | ❌ No        |
| **Auto Unlock**        | ✅ Sí      | ✅ Sí      | ✅ Sí        |
| **Estimated Time**     | 45-60 min  | 20-30 min  | 2-4 hours    |
| **Difficulty**         | Media      | Fácil      | Alta         |
| **AI Suggestions**     | ✅ Sí      | ❌ No      | ✅ Sí        |
| **Geolocation**        | ❌ No      | ✅ Sí      | ❌ No        |
| **Real-time Voting**   | ❌ No      | ❌ No      | ✅ Sí        |
| **Protocolización**    | ❌ No      | ❌ No      | ✅ Sí        |

---

## 🎯 Resumen

### **Configuraciones Creadas:**

1. ✅ **registroSociedadesConfig** - 10 items flat, sequential, 45-60 min
2. ✅ **sucursalesConfig** - 5 items flat, sequential, 20-30 min, con geolocation
3. ✅ **juntasAccionistasConfig** - 30+ items hierarchical, 4 levels, rightSidebar, votaciones

### **Características Compartidas:**

- Persistencia con localStorage
- Event handlers (onProgressUpdate, onFlowComplete, etc.)
- Backend API endpoints
- Analytics tracking
- Autosave

### **Características Únicas:**

- **Registro:** IA suggestions, formularios complejos
- **Sucursales:** Geolocalización, validación de direcciones
- **Juntas:** Right sidebar, votaciones multi-nivel, quórum, actas

---

**Estado:** 📝 Configuraciones Completas - 3 FlowConfigs documentados  
**Última Actualización:** 2 de Noviembre, 2025  
**Siguiente Archivo:** todo-001-estructura-datos.types.md
