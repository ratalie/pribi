# Guías de Migración - Índice

Este directorio contiene guías completas para migrar proyectos de **Next.js/React** a **Nuxt/Vue**, con enfoque especial en shadcn, vee-validate, y patrones comunes.

## 📚 Guías Disponibles

### [01-NEXTJS-TO-NUXT.md](./01-NEXTJS-TO-NUXT.md)

**Migración General de Next.js a Nuxt**

Cubre:

- Equivalencias de frameworks
- Sistema de enrutamiento (App Router → Pages/Layouts)
- Server Components → Composables
- Hooks de Next.js → APIs de Nuxt
- Configuración y estructura de proyecto

**Usa esta guía cuando**: Estés comenzando una migración completa de Next.js a Nuxt.

---

### [02-REACT-TO-VUE-PATTERNS.md](./02-REACT-TO-VUE-PATTERNS.md)

**Patrones de Código: React → Vue**

Cubre:

- Componentes y sintaxis
- Estado y reactividad (useState → ref/reactive)
- Efectos y lifecycle (useEffect → watch/onMounted)
- Props, events y refs
- Composition API

**Usa esta guía cuando**: Necesites convertir componentes React específicos a Vue.

---

### [03-SHADCN-MIGRATION.md](./03-SHADCN-MIGRATION.md)

**Migración de Componentes shadcn**

Cubre:

- shadcn-ui (React) → shadcn-vue (Vue)
- Radix UI → Radix Vue
- Configuración y setup
- Migración de componentes específicos
- Estilos y variantes (CVA)

**Usa esta guía cuando**: Estés migrando componentes de shadcn-ui.

---

### [04-VEE-VALIDATE-USAGE.md](./04-VEE-VALIDATE-USAGE.md)

**Formularios con vee-validate en Vue/Nuxt**

Cubre:

- Setup de vee-validate en Nuxt
- Integración con Zod
- Patrones de formularios
- Validación y errores
- Componentes reutilizables

**Usa esta guía cuando**: Necesites implementar formularios con validación.

---

### [05-ROUTING-MIGRATION.md](./05-ROUTING-MIGRATION.md)

**Sistema de Enrutamiento**

Cubre:

- App Router → Nuxt Pages
- Route Groups → Layouts de Nuxt
- Dynamic routes
- Middleware y guards
- Navegación programática

**Usa esta guía cuando**: Estés trabajando con rutas y navegación.

---

### [06-STATE-MANAGEMENT.md](./06-STATE-MANAGEMENT.md)

**Gestión de Estado**

Cubre:

- useState → ref/reactive
- Context API → Pinia stores
- Composables para estado compartido
- Server state (React Query → TanStack Query/Nuxt)
- Patrones de estado

**Usa esta guía cuando**: Necesites manejar estado local o global.

---

### [07-COMMON-PITFALLS.md](./07-COMMON-PITFALLS.md)

**Errores Comunes y Soluciones**

Cubre:

- Problemas frecuentes en migración
- Diferencias sutiles React vs Vue
- Debug tips
- Performance gotchas
- Best practices

**Usa esta guía cuando**: Encuentres problemas o quieras evitar errores comunes.

---

## 🎯 Flujo de Trabajo Recomendado

### Para migrar un proyecto completo:

1. **Preparación**

   - [ ] Lee [01-NEXTJS-TO-NUXT.md](./01-NEXTJS-TO-NUXT.md) - Entiende equivalencias generales
   - [ ] Revisa [07-COMMON-PITFALLS.md](./07-COMMON-PITFALLS.md) - Conoce los errores comunes

2. **Estructura del Proyecto**

   - [ ] Aplica [05-ROUTING-MIGRATION.md](./05-ROUTING-MIGRATION.md) - Migra rutas y layouts
   - [ ] Configura [03-SHADCN-MIGRATION.md](./03-SHADCN-MIGRATION.md) - Setup de shadcn-vue

3. **Componentes**

   - [ ] Usa [02-REACT-TO-VUE-PATTERNS.md](./02-REACT-TO-VUE-PATTERNS.md) - Convierte componentes
   - [ ] Aplica [06-STATE-MANAGEMENT.md](./06-STATE-MANAGEMENT.md) - Migra estado

4. **Formularios (si aplica)**

   - [ ] Implementa [04-VEE-VALIDATE-USAGE.md](./04-VEE-VALIDATE-USAGE.md) - Setup de formularios

5. **Refinamiento**
   - [ ] Revisa [07-COMMON-PITFALLS.md](./07-COMMON-PITFALLS.md) - Verifica problemas
   - [ ] Testing y optimización

---

## 📖 Ejemplo: Migrar el proyecto v0-double-sidebar

Para migrar el [proyecto v0-double-sidebar](../projects-references/v0-double-sidebar/00-INDEX.md):

### 1. Analizar el proyecto original

```bash
# Revisa la documentación del proyecto
docs-global/projects-references/v0-double-sidebar/
├── 01-PROJECT-SUMMARY.md      # Overview
├── 02-ARCHITECTURE.md         # Arquitectura
├── 03-COMPONENTS.md           # Componentes
└── 04-ROUTING.md              # Rutas
```

### 2. Mapear componentes

| React Component   | Vue Component             | Guía                                             |
| ----------------- | ------------------------- | ------------------------------------------------ |
| `DocsLayout`      | `DocsLayout.vue`          | [02-REACT-TO-VUE](./02-REACT-TO-VUE-PATTERNS.md) |
| `MainSidebar`     | `MainSidebar.vue`         | [02-REACT-TO-VUE](./02-REACT-TO-VUE-PATTERNS.md) |
| `Button` (shadcn) | `Button.vue` (shadcn-vue) | [03-SHADCN](./03-SHADCN-MIGRATION.md)            |

### 3. Mapear rutas

| Next.js                           | Nuxt                    | Guía                                    |
| --------------------------------- | ----------------------- | --------------------------------------- |
| `app/(docs)/layout.tsx`           | `layouts/docs.vue`      | [05-ROUTING](./05-ROUTING-MIGRATION.md) |
| `app/(docs)/datos-junta/page.tsx` | `pages/datos-junta.vue` | [05-ROUTING](./05-ROUTING-MIGRATION.md) |

### 4. Convertir hooks y estado

| React         | Vue               | Guía                                             |
| ------------- | ----------------- | ------------------------------------------------ |
| `useState`    | `ref`             | [02-REACT-TO-VUE](./02-REACT-TO-VUE-PATTERNS.md) |
| `usePathname` | `useRoute`        | [01-NEXTJS-TO-NUXT](./01-NEXTJS-TO-NUXT.md)      |
| `useEffect`   | `watch/onMounted` | [02-REACT-TO-VUE](./02-REACT-TO-VUE-PATTERNS.md) |

---

## 🔧 Herramientas Útiles

### Instalación recomendada en Nuxt

```bash
# Nuxt modules
npm install -D @nuxtjs/tailwindcss
npm install -D @nuxtjs/color-mode

# shadcn-vue
npx shadcn-vue@latest init

# vee-validate + zod
npm install vee-validate @vee-validate/zod zod

# Pinia (si necesitas estado global)
npm install pinia @pinia/nuxt
```

### VSCode Extensions

- Volar (Vue Language Features)
- Vue VSCode Snippets
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

---

## 📝 Convenciones en las Guías

### Bloques de código

```typescript
// ❌ React/Next.js (antes)
import { useState } from "react";

// ✅ Vue/Nuxt (después)
import { ref } from "vue";
```

### Tablas de equivalencia

| React/Next.js | Vue/Nuxt | Notas              |
| ------------- | -------- | ------------------ |
| `useState`    | `ref`    | Reactividad básica |
| `useEffect`   | `watch`  | Side effects       |

### Ejemplos completos

Cada guía incluye ejemplos prácticos y completos que puedes copiar.

---

## 🚀 Próximos Pasos

1. Identifica qué proyecto quieres migrar
2. Lee su documentación en `projects-references/`
3. Consulta las guías relevantes según tus necesidades
4. Sigue el flujo de trabajo recomendado
5. Usa [07-COMMON-PITFALLS.md](./07-COMMON-PITFALLS.md) para debug

---

## 🤝 Contribuir

Al migrar proyectos, documenta:

- Nuevos patrones encontrados
- Problemas y soluciones
- Tips específicos
- Actualizaciones de dependencias

Agrega tus aprendizajes a estas guías.

---

## 🧩 Arquitectura Register Sociedades

- [Vistas iniciales (historial, agregar, preview)](./10-SOCIEDADES-VISTAS.md)
- [Patrón general por pasos](./11-SOCIEDADES-ARQUITECTURA-PASOS.md)
- [Paso 1 – Datos principales (detalle técnico)](./12-SOCIEDADES-PASO1-DATOS.md)
- [Paso 2 – Accionistas (plan y roadmap)](./13-SOCIEDADES-PASO2-ACCIONISTAS.md)
- [Política de UUID (qué pasos usan ids)](./14-SOCIEDADES-UUID-POLICY.md)

---

**Última actualización**: Noviembre 14, 2025
