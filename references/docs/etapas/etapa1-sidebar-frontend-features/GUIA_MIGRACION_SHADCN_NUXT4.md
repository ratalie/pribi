# 🔧 GUÍA COMPLETA SHADCN/UI PARA MIGRACIÓN A NUXT 4

## 📋 Resumen Ejecutivo

Esta documentación proporciona toda la información necesaria para **migrar completamente** el proyecto PROBO UI de **Next.js + shadcn/ui** a **Nuxt 4 + shadcn/ui**.

**🎯 Objetivo**: Recrear exactamente la misma UI y funcionalidad en Nuxt 4 con shadcn/ui.

---

## 📦 DEPENDENCIAS PRINCIPALES NECESARIAS

### 🎨 Radix UI Dependencies (Requeridas)

```json
{
  "@radix-ui/react-accordion": "1.2.2",
  "@radix-ui/react-avatar": "1.1.2",
  "@radix-ui/react-collapsible": "1.1.2",
  "@radix-ui/react-dropdown-menu": "2.1.4",
  "@radix-ui/react-label": "2.1.1",
  "@radix-ui/react-slot": "1.1.1",
  "@radix-ui/react-switch": "1.1.2"
}
```

### 🛠️ Herramientas Adicionales

```json
{
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^2.5.5",
  "tailwindcss-animate": "^1.0.7",
  "lucide-react": "^0.454.0"
}
```

---

## 🎨 COMPONENTES SHADCN/UI UTILIZADOS

### 1. 📂 **Accordion Component**

**Archivo**: `components/ui/accordion.tsx`

**📋 Descripción**:

- Componente expandible basado en `@radix-ui/react-accordion`
- Usado para secciones colapsibles en configuración

**🔧 Dependencias**:

```bash
npm install @radix-ui/react-accordion lucide-react
```

**📖 Estructura del Componente**:

```tsx
// Componentes exportados:
- Accordion           // Root container
- AccordionItem       // Individual item wrapper
- AccordionTrigger    // Clickable trigger with chevron
- AccordionContent    // Collapsible content area

// Props principales:
type: "single" | "multiple"  // Expansion behavior
defaultValue?: string        // Default expanded item
```

**🎨 Características Visuales**:

- ✅ Chevron icon que rota al expandir
- ✅ Animaciones suaves de expansión/colapso
- ✅ Border bottom en cada item
- ✅ Estados de hover y focus

**📝 Ejemplo de Uso**:

```tsx
<Accordion type="single" defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>Configuración General</AccordionTrigger>
    <AccordionContent>Contenido de configuración...</AccordionContent>
  </AccordionItem>
</Accordion>
```

### 2. 👤 **Avatar Component**

**Archivo**: `components/ui/avatar.tsx`

**📋 Descripción**:

- Sistema de avatares con fallback automático
- Usado en perfil de usuario del sidebar

**🔧 Dependencias**:

```bash
npm install @radix-ui/react-avatar
```

**📖 Estructura del Componente**:

```tsx
// Componentes exportados:
- Avatar          // Container circular
- AvatarImage     // Imagen principal
- AvatarFallback  // Texto de respaldo (iniciales)

// Props principales:
src?: string      // URL de la imagen
alt?: string      // Texto alternativo
className?: string
```

**🎨 Características Visuales**:

- ✅ Forma circular por defecto (size-8 = 32px)
- ✅ Fallback con iniciales del nombre
- ✅ Overflow hidden para recorte circular
- ✅ Background muted para fallback

**📝 Ejemplo de Uso**:

```tsx
<Avatar>
  <AvatarImage src="/avatar.jpg" alt="Usuario" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

### 3. 🔘 **Button Component**

**Archivo**: `components/ui/button.tsx`

**📋 Descripción**:

- Botón altamente configurable con múltiples variantes
- Base fundamental usado en todo el proyecto

**🔧 Dependencias**:

```bash
npm install @radix-ui/react-slot class-variance-authority
```

**📖 Variantes Disponibles**:

```tsx
// Variant options:
- default     // Botón primario azul
- destructive // Botón rojo para acciones peligrosas
- outline     // Botón con borde
- secondary   // Botón gris secundario
- ghost       // Botón transparente
- link        // Botón como enlace

// Size options:
- default     // h-9 px-4 py-2
- sm         // h-8 px-3 (compacto)
- lg         // h-10 px-6 (grande)
- icon       // size-9 (cuadrado para íconos)
- icon-sm    // size-8
- icon-lg    // size-10
```

**🎨 Características Especiales**:

- ✅ Soporte para `asChild` (renderiza como otro elemento)
- ✅ Estados de focus, disabled, aria-invalid
- ✅ Soporte automático para iconos SVG
- ✅ Transiciones suaves

**📝 Ejemplos de Uso**:

```tsx
<Button variant="default" size="sm">
  <Save className="w-4 h-4" />
  Guardar
</Button>

<Button variant="ghost" size="icon" asChild>
  <Link href="/settings">
    <Settings className="w-4 h-4" />
  </Link>
</Button>
```

### 4. 🃏 **Card Component**

**Archivo**: `components/ui/card.tsx`

**📋 Descripción**:

- Sistema de tarjetas modular para contenido
- Usado en modal de configuración y páginas

**🔧 Dependencias**:

```bash
# Solo requiere utilidades (sin Radix)
npm install tailwind-merge clsx
```

**📖 Estructura del Componente**:

```tsx
// Componentes exportados:
-Card - // Container principal
  CardHeader - // Cabecera con título y descripción
  CardTitle - // Título principal
  CardDescription - // Texto descriptivo
  CardAction - // Botones en la esquina superior
  CardContent - // Contenido principal
  CardFooter; // Pie con acciones
```

**🎨 Características Visuales**:

- ✅ Border radius xl (rounded-xl)
- ✅ Sombra sutil (shadow-sm)
- ✅ Padding consistente (p-6)
- ✅ Grid layout automático en header
- ✅ Separadores opcionales con border-t/border-b

**📝 Ejemplo de Uso**:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Configuración</CardTitle>
    <CardDescription>Ajusta las preferencias de la aplicación</CardDescription>
    <CardAction>
      <Button size="sm">Editar</Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <p>Contenido de la tarjeta...</p>
  </CardContent>
  <CardFooter>
    <Button>Guardar Cambios</Button>
  </CardFooter>
</Card>
```

### 5. 📁 **Collapsible Component**

**Archivo**: `components/ui/collapsible.tsx`

**📋 Descripción**:

- Wrapper simple para funcionalidad de colapso
- Usado en sidebar para secciones expandibles

**🔧 Dependencias**:

```bash
npm install @radix-ui/react-collapsible
```

**📖 Estructura del Componente**:

```tsx
// Componentes exportados:
- Collapsible         // Container raíz
- CollapsibleTrigger  // Elemento que activa el colapso
- CollapsibleContent  // Contenido colapsible

// Props principales:
open?: boolean        // Estado abierto/cerrado
onOpenChange?: (open: boolean) => void
defaultOpen?: boolean // Estado inicial
```

**🎨 Características**:

- ✅ Animaciones automáticas de Radix UI
- ✅ Estados de accesibilidad integrados
- ✅ Soporte para keyboard navigation

**📝 Ejemplo de Uso**:

```tsx
<Collapsible open={expanded} onOpenChange={setExpanded}>
  <CollapsibleTrigger asChild>
    <Button variant="ghost">
      Mostrar más opciones
      <ChevronDown className="w-4 h-4" />
    </Button>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <div className="space-y-2">
      <Button variant="ghost">Opción 1</Button>
      <Button variant="ghost">Opción 2</Button>
    </div>
  </CollapsibleContent>
</Collapsible>
```

### 6. 📋 **DropdownMenu Component**

**Archivo**: `components/ui/dropdown-menu.tsx`

**📋 Descripción**:

- Sistema completo de menús desplegables
- Usado en selectores de idioma, usuario, y configuración

**🔧 Dependencias**:

```bash
npm install @radix-ui/react-dropdown-menu lucide-react
```

**📖 Componentes Completos**:

```tsx
// Estructura básica:
-DropdownMenu - // Root container
  DropdownMenuTrigger - // Botón que abre el menú
  DropdownMenuContent - // Panel desplegable
  DropdownMenuItem - // Item individual clickeable
  // Organizadores:
  DropdownMenuGroup - // Agrupador de items
  DropdownMenuLabel - // Etiqueta de sección
  DropdownMenuSeparator - // Línea divisoria
  DropdownMenuSub - // Submenú anidado
  // Especiales:
  DropdownMenuCheckboxItem - // Item con checkbox
  DropdownMenuRadioGroup - // Grupo de radio buttons
  DropdownMenuRadioItem - // Radio button individual
  DropdownMenuShortcut; // Texto de atajo de teclado
```

**🎨 Variantes de MenuItem**:

```tsx
// Variant options:
- default      // Item normal
- destructive  // Item rojo para acciones peligrosas

// Props especiales:
inset?: boolean // Aplica padding left extra
```

**🎨 Características Avanzadas**:

- ✅ Animaciones de entrada/salida
- ✅ Posicionamiento automático inteligente
- ✅ Soporte para submenús anidados
- ✅ Estados de selección (checkbox/radio)
- ✅ Iconos automáticos para estados

**📝 Ejemplo Completo**:

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">
      Opciones
      <ChevronDown className="w-4 h-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
    <DropdownMenuSeparator />

    <DropdownMenuItem>
      <User className="w-4 h-4" />
      Perfil
    </DropdownMenuItem>

    <DropdownMenuItem>
      <Settings className="w-4 h-4" />
      Configuración
    </DropdownMenuItem>

    <DropdownMenuSeparator />

    <DropdownMenuItem variant="destructive">
      <LogOut className="w-4 h-4" />
      Cerrar Sesión
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 7. 📝 **Input Component**

**Archivo**: `components/ui/input.tsx`

**📋 Descripción**:

- Campo de entrada base altamente estilizado
- Usado en formularios y configuración

**🔧 Dependencias**:

```bash
# Solo requiere utilidades CSS
npm install tailwind-merge clsx
```

**📖 Características del Input**:

```tsx
// Props soportadas:
- Todas las props nativas de <input>
- className para customización
- type para diferentes tipos de input

// Estilos incluidos:
- File input styling
- Placeholder styling
- Selection styling
- Focus states
- Invalid states
- Disabled states
```

**🎨 Estados Visuales**:

- ✅ **Normal**: Border gris con fondo transparente
- ✅ **Focus**: Ring azul con border destacado
- ✅ **Invalid**: Border y ring rojos
- ✅ **Disabled**: Opacity reducida, no clickeable
- ✅ **File**: Botón de archivo estilizado

**📝 Ejemplo de Uso**:

```tsx
<Input
  type="email"
  placeholder="correo@ejemplo.com"
  className="w-full"
/>

<Input
  type="file"
  accept=".pdf,.doc"
/>
```

### 8. 🏷️ **Label Component**

**Archivo**: `components/ui/label.tsx`

**📋 Descripción**:

- Etiquetas accesibles para formularios
- Integrado con estados de disability

**🔧 Dependencias**:

```bash
npm install @radix-ui/react-label
```

**📖 Características**:

```tsx
// Props principales:
- Todas las props de @radix-ui/react-label
- className para personalización
- htmlFor para asociación con inputs

// Estados automáticos:
- Disabled cuando el grupo está disabled
- Cursor not-allowed con peer disabled
```

**🎨 Estilos**:

- ✅ Flex layout con gap para iconos
- ✅ Font medium para mejor legibilidad
- ✅ Select-none para evitar selección accidental
- ✅ Estados de disabled integrados

**📝 Ejemplo de Uso**:

```tsx
<div className="space-y-2">
  <Label htmlFor="email">
    <Mail className="w-4 h-4" />
    Correo Electrónico
  </Label>
  <Input id="email" type="email" />
</div>
```

### 9. 🔀 **Switch Component**

**Archivo**: `components/ui/switch.tsx`

**📋 Descripción**:

- Interruptor on/off moderno
- Usado para configuraciones booleanas

**🔧 Dependencias**:

```bash
npm install @radix-ui/react-switch
```

**📖 Estructura**:

```tsx
// Componente único:
- Switch  // Root component con thumb interno

// Props principales:
checked?: boolean
onCheckedChange?: (checked: boolean) => void
disabled?: boolean
```

**🎨 Estados Visuales**:

- ✅ **Unchecked**: Fondo gris (input color)
- ✅ **Checked**: Fondo primario azul
- ✅ **Focus**: Ring de enfoque azul
- ✅ **Disabled**: Opacity reducida
- ✅ **Dark mode**: Colores adaptados automáticamente

**📝 Ejemplo de Uso**:

```tsx
<div className="flex items-center space-x-2">
  <Switch id="notifications" />
  <Label htmlFor="notifications">Recibir notificaciones</Label>
</div>
```

### 10. 📜 **CustomScrollArea Component** (PERSONALIZADO)

**Archivo**: `components/ui/custom-scroll-area.tsx`

**📋 Descripción**:

- Componente personalizado para scroll estilizado
- **NO es de shadcn/ui estándar** - creado específicamente para PROBO

**🔧 Dependencias**:

```bash
# Requiere hook personalizado
# Ver: lib/hooks/use-custom-scroll.ts
```

**📖 Props Personalizadas**:

```tsx
interface CustomScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  orientation?: "vertical" | "horizontal" | "both";
  variant?: "default" | "thin" | "hidden";
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
  onScrollEnd?: () => void;
}
```

**🎨 Variantes de Scroll**:

```tsx
// Variantes disponibles:
- default  // Scrollbar visible con estilo custom
- thin     // Scrollbar más delgada (4px)
- hidden   // Scrollbar invisible pero funcional

// Orientaciones:
- vertical    // Solo scroll vertical
- horizontal  // Solo scroll horizontal
- both        // Scroll en ambas direcciones
```

**🎨 Características Únicas**:

- ✅ **Callbacks de eventos**: onScroll, onScrollEnd
- ✅ **Detección de fin de scroll** con debounce
- ✅ **Estilos CSS personalizados** para scrollbars
- ✅ **Soporte para temas** (light/dark)
- ✅ **ForwardRef** para referencias externas

**📝 Ejemplo de Uso**:

```tsx
<CustomScrollArea
  variant="thin"
  orientation="vertical"
  className="h-96"
  onScrollEnd={() => console.log("Scroll terminado")}
>
  <div className="space-y-4">{/* Contenido largo que requiere scroll */}</div>
</CustomScrollArea>
```

**🔧 Hook Relacionado**: `use-custom-scroll.ts`

```tsx
// Funcionalidad del hook:
- Gestión de referencias de scroll
- Detección de eventos de scroll
- Timeout para detección de fin de scroll
- Cleanup automático de event listeners
```

---

## 🚀 CONFIGURACIÓN PARA NUXT 4

### 1. 📦 **Instalación Base**

```bash
# Crear proyecto Nuxt 4
npx nuxi@latest init probo-nuxt4
cd probo-nuxt4

# Instalar shadcn/ui para Nuxt
npx shadcn-nuxt@latest init

# Instalar dependencias principales
npm install @radix-ui/react-accordion @radix-ui/react-avatar @radix-ui/react-collapsible @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-slot @radix-ui/react-switch

# Instalar utilidades
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate lucide-react
```

### 2. ⚙️ **Configuración de Tailwind CSS**

```js
// tailwind.config.js
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      // Variables CSS de PROBO
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // ... resto de colores del proyecto original
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### 3. 🎨 **CSS Variables Setup**

```css
/* assets/css/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Copiar TODAS las variables CSS de app/globals.css original */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... todas las variables del tema light */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... todas las variables del tema dark */
}

.custom {
  --primary: var(--custom-primary, oklch(0.55 0.25 280));
  /* ... todas las variables del tema custom */
}

/* Scrollbar styles personalizados */
.custom-scrollbar {
  /* ... */
}
.custom-scrollbar-thin {
  /* ... */
}
.custom-scrollbar-hidden {
  /* ... */
}
```

### 4. 🔧 **Utilidades Necesarias**

```ts
// utils/cn.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 5. 📁 **Estructura de Componentes**

```
components/
├── ui/                    # Componentes shadcn/ui base
│   ├── accordion.vue     # Convertir de .tsx a .vue
│   ├── avatar.vue
│   ├── button.vue
│   ├── card.vue
│   ├── collapsible.vue
│   ├── dropdown-menu.vue
│   ├── input.vue
│   ├── label.vue
│   ├── switch.vue
│   └── custom-scroll-area.vue
│
├── probo-sidebar.vue     # Sidebar principal
├── app-layout.vue        # Layout de la aplicación
├── configuration-modal.vue
├── language-select.vue
├── theme-selector.vue
└── user-dropdown-menu.vue
```

---

## 🔄 GUÍA DE CONVERSIÓN TSX → VUE

### 📝 **Patrón de Conversión General**

**React/TSX (Original)**:

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

function Button({ className, variant, size, asChild = false, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

**Vue/Nuxt (Convertido)**:

```vue
<template>
  <component
    :is="asChild ? 'slot' : 'button'"
    :class="cn(buttonVariants({ variant, size }), className)"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  size: "default",
  asChild: false,
});

// Importar utilidades
import { cn } from "~/utils/cn";
import { buttonVariants } from "./button-variants";
</script>
```

### 🔄 **Conversiones Específicas**

#### 1. **Estados de React → Vue Composables**

**React**:

```tsx
const [isOpen, setIsOpen] = useState(false);
```

**Vue**:

```vue
<script setup>
const isOpen = ref(false);
</script>
```

#### 2. **Props + Refs**

**React**:

```tsx
const { className, ...props } = props;
const ref = useRef<HTMLDivElement>(null);
```

**Vue**:

```vue
<script setup>
interface Props {
  className?: string
}
const props = defineProps<Props>()
const elementRef = ref<HTMLDivElement>()
</script>
```

#### 3. **Context → Pinia/Composables**

**React Context**:

```tsx
const { theme, setTheme } = useTheme();
```

**Vue Composable**:

```vue
<script setup>
const { theme, setTheme } = useTheme(); // Composable personalizado
</script>
```

---

## ✅ CHECKLIST DE MIGRACIÓN

### 🔧 **Configuración Inicial**

- [ ] Instalar Nuxt 4 con shadcn/ui
- [ ] Configurar Tailwind CSS con variables
- [ ] Copiar CSS variables de temas
- [ ] Configurar utilidad `cn()`

### 📦 **Componentes UI Base**

- [ ] Convertir Button component
- [ ] Convertir Card components
- [ ] Convertir Avatar component
- [ ] Convertir Input component
- [ ] Convertir Label component
- [ ] Convertir Switch component
- [ ] Convertir Accordion component
- [ ] Convertir Collapsible component
- [ ] Convertir DropdownMenu component
- [ ] Crear CustomScrollArea personalizado

### 🏗️ **Componentes Principales**

- [ ] Migrar ProboSidebar
- [ ] Migrar AppLayout
- [ ] Migrar ConfigurationModal
- [ ] Migrar LanguageSelect
- [ ] Migrar ThemeSelector
- [ ] Migrar UserDropdownMenu

### 🎨 **Funcionalidades**

- [ ] Implementar sistema de temas (composable)
- [ ] Implementar internacionalización (nuxt/i18n)
- [ ] Implementar sistema de permisos
- [ ] Implementar navegación dinámica
- [ ] Configurar rutas y layout

### 🧪 **Testing & Polish**

- [ ] Probar responsividad
- [ ] Verificar accesibilidad
- [ ] Optimizar performance
- [ ] Probar en diferentes navegadores

---

## 🎯 COMPONENTES PERSONALIZADOS CLAVE

### 1. **ProboSidebar**

```vue
<!-- Características a mantener: -->
- Colapsible con animaciones - Navegación jerárquica - Sistema de permisos
integrado - Perfil de usuario - Estados activos de rutas
```

### 2. **ConfigurationModal**

```vue
<!-- Características a mantener: -->
- Layout de dos columnas - Navegación interna - Secciones organizadas - Scroll
personalizado
```

### 3. **LanguageSelect**

```vue
<!-- Características a mantener: -->
- 5 idiomas soportados - 2 variantes (default/compact) - Persistencia en
localStorage - Banderas y nombres nativos
```

### 4. **ThemeSelector**

```vue
<!-- Características a mantener: -->
- 3 temas (light/dark/custom) - Selector de colores personalizado - Aplicación
dinámica de CSS variables - Persistencia de configuración
```

---

## 📚 RECURSOS ADICIONALES

### 🔗 **Links Útiles**

- [shadcn/ui Nuxt Documentation](https://ui.shadcn.com/docs/installation/nuxt)
- [Nuxt 4 Documentation](https://nuxt.com/)
- [Radix UI Vue Documentation](https://www.radix-vue.com/)
- [Tailwind CSS with Nuxt](https://tailwindcss.nuxtjs.org/)

### 🛠️ **Herramientas Recomendadas**

- **Nuxt DevTools**: Para debugging y desarrollo
- **Vue DevTools**: Para inspección de componentes
- **Tailwind CSS IntelliSense**: Para autocompletado
- **TypeScript Vue Plugin**: Para mejor soporte de tipos

---

## 🎉 RESULTADO ESPERADO

Al completar esta migración tendrás:

✅ **UI idéntica** al proyecto original
✅ **Funcionalidad completa** de sidebar, temas e idiomas  
✅ **Performance optimizada** con Nuxt 4
✅ **Mantenibilidad mejorada** con Vue 3 Composition API
✅ **Base sólida** para futuras funcionalidades

---

<div align="center">

**🚀 ¡Listo para migrar PROBO UI a Nuxt 4 con shadcn/ui!**

_Todos los componentes documentados y listos para implementación_

</div>
