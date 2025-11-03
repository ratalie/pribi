---
applyTo: "**"
---

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

En el proyecto tienes un proyecto moderno de 2025, usando Nuxt 4 con TypeScript, modulos de nuxt , y tailwidn 4.

Necesito que mi app, este configurado para la primera etapa

1. Sidebar principal de navegacion
2. Modal de configuraciones de preferencias
3. Internacionalizacion i18n con 6 idiomas
4. Dark mode, Light mode, Tercer Color: Morado , y sistem mode.
5. Manejar variables para fuentes, colores, en tailwind.css ya que usamos tailwind 4

La documentaciöón puedes encontrarlo en la carpeta references, donde esta la documentacion de las librerias utilziadas en formato md.

## Arquitectura de FlowItems

**IMPORTANTE**: Los FlowItems y FlowConfigs NO van en la carpeta `modules/`. La estructura correcta es:

### FlowItems (Definiciones de datos)

Ubicación: `app/types/flows/`

- Son objetos TypeScript que definen la estructura de navegación
- Similar a routes o navigation configs
- Estructura:
  ```
  app/types/flows/
  ├── junta-accionistas/
  │   ├── nivel-0/
  │   ├── nivel-1/
  │   ├── nivel-2/
  │   ├── nivel-3/
  │   ├── nivel-4/
  │   ├── defaults.ts
  │   └── index.ts
  └── sucursales/
      ├── sucursales.items.ts
      ├── defaults.ts
      └── index.ts
  ```

### FlowConfigs (Configuraciones)

Ubicación: `app/config/flows/`

- Ensamblan los FlowItems en configuraciones completas
- Similar a otros archivos de configuración
- Estructura:
  ```
  app/config/flows/
  ├── junta-accionistas.flow.ts
  ├── sucursales.flow.ts
  └── index.ts
  ```

### Pages (Solo componentes Vue)

Ubicación: `app/pages/`

- Solo archivos `.vue`
- Sin lógica de negocio, configs, o types

**REGLA**: Ignorar la carpeta `app/modules/` - no usarla para FlowItems/FlowConfigs.
