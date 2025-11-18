# 🏗️ Arquitectura del Proyecto

Documentación de la arquitectura general del proyecto.

## Visión General

El proyecto utiliza dos arquitecturas complementarias:

1. **Arquitectura Hexagonal** - Para la lógica de negocio (en `app/core/hexag/`)
2. **Arquitectura de 3 Capas** - Para los componentes UI (en `app/components/`)

---

## 🏛️ Arquitectura Hexagonal

La arquitectura hexagonal separa la lógica de negocio de la interfaz y las tecnologías externas. Esto permite que el código sea más fácil de mantener, testear y cambiar.

### Estructura Principal

```
app/core/
├── hexag/              # Lógica de negocio (arquitectura hexagonal)
│   ├── registros/      # Dominio de registros (sociedades, sucursales)
│   └── auth/          # Dominio de autenticación
├── presentation/       # Componentes Vue que usan la lógica de negocio
└── shared/            # Utilidades compartidas
```

### ¿Cómo funciona?

Imagina que tu aplicación tiene 3 capas que trabajan juntas:

1. **Capa Externa (Infrastructure)**: Se comunica con el mundo exterior

   Esta capa es la que "habla" con servicios externos. Es como el mensajero que va y viene:

   - **APIs HTTP**: Hace peticiones a servidores reales para obtener o guardar datos. Por ejemplo, cuando necesitas la lista de accionistas, hace una petición `GET /api/accionistas`. Los repositorios HTTP están en `infrastructure/repositories/`.

   - **Bases de datos**: Si en el futuro necesitas guardar datos localmente, aquí estaría esa conexión.

   - **Mocks para desarrollo**: Durante el desarrollo, puedes usar datos falsos (mocks) en lugar de llamar a la API real. Esto te permite trabajar sin depender del backend. Los mocks están en `infrastructure/mocks/`.

   - **Mappers**: Transforman los datos entre el formato del backend (DTO) y el formato interno (Entidad). Es como un traductor entre idiomas diferentes: cuando llegan datos del backend (formato DTO), los mappers los convierten a entidades (formato interno), y cuando envías datos al backend, los mappers convierten las entidades a DTOs.

     _Los mappers están en `infrastructure/mappers/`. Por ejemplo: `accionistas.mapper.ts` tiene funciones `toDomain()` (convierte DTO → Entidad) y `toPayload()` (convierte Entidad → DTO)._

2. **Capa de Negocio (Domain)**: Contiene las reglas de tu aplicación

   Esta es la capa más importante: define QUÉ es tu aplicación y QUÉ reglas debe seguir. Es como las leyes de tu negocio:

   - **Entidades**: Son los objetos principales de tu negocio. Por ejemplo, "Sociedad" tiene propiedades como nombre, RUC, fecha de registro. "Accionista" tiene nombre, porcentaje de acciones, etc. Son como las "cosas" que maneja tu aplicación.

     **Importante:** Las entidades NO vienen directamente del backend. El backend siempre devuelve DTOs, y tú transformas esos DTOs a Entidades usando los mappers de Infrastructure. La Entidad es tu representación interna del negocio, independiente del formato del backend.

     _Los tipos de estas entidades van en `domain/entities/`. Por ejemplo: `accionista.entity.ts` define cómo es un accionista dentro de tu aplicación._

   - **Reglas de negocio**: Son las validaciones y lógicas que deben cumplirse. Por ejemplo: "Un accionista no puede tener más del 100% de las acciones", "El RUC debe tener 11 dígitos", "Una sociedad debe tener al menos un accionista".

   - **Contratos (puertos)**: Son como "acuerdos" que definen QUÉ operaciones se pueden hacer, pero no CÓMO se hacen. Es como un enchufe eléctrico: el contrato define la forma del enchufe (qué métodos debe tener), pero puedes tener diferentes implementaciones (HTTP, Mock, base de datos) que se "conectan" a ese mismo enchufe.

     **Ejemplo real:** El contrato `AccionistasRepository` define que debe existir un método `list()` para obtener accionistas, pero no dice si se obtienen de una API HTTP o de datos falsos. Luego puedes tener:

     - `AccionistasHttpRepository` que cumple el contrato haciendo peticiones HTTP reales
     - `AccionistasMockRepository` que cumple el mismo contrato pero devuelve datos de prueba

     **Ventajas:** Puedes cambiar de API real a mock sin tocar el resto del código. Tu lógica de negocio no depende de cómo se obtienen los datos, solo de que existan esos métodos.

     _Los contratos van en `domain/ports/`. Las implementaciones van en `infrastructure/repositories/` (HTTP) o `infrastructure/mocks/` (datos falsos)._

3. **Capa de Aplicación (Application)**: Orquesta las operaciones

   Esta capa coordina todo. Es como el director de orquesta que dice "ahora haz esto, luego esto otro":

   - **Casos de uso**: Son acciones específicas que el usuario puede hacer. Por ejemplo: "Crear Sociedad" (toma los datos del formulario, valida que estén completos, y los guarda), "Listar Accionistas" (obtiene la lista y la prepara para mostrar), "Eliminar Apoderado" (verifica permisos y luego elimina).

   - **DTOs (Data Transfer Objects)**: Son los tipos que definen cómo se comunican con el backend. **El mismo DTO se usa TANTO para enviar (request) COMO para recibir (response) del backend.** Es bidireccional: `DTO ↔ Backend`.

     **Características:**

     - Formato exacto que el backend espera y devuelve
     - Solo datos, sin lógica de negocio
     - Puede tener menos campos que la Entidad (el backend no siempre envía todo)
     - Se usa SOLO para comunicarse con el backend

     _Los tipos DTO van en `application/dtos/`. Por ejemplo: `accionista.dto.ts` define el formato exacto que espera el backend._

### Ejemplo Práctico: Flujo de Accionistas

```
Vista Vue
    ↓
Controller (composable)
    ↓
Store (Pinia)
    ↓
Caso de Uso (ListAccionistasUseCase)
    ↓
Repositorio (puerto/contrato)
    ↓
Implementación (HTTP o Mock)
```

**Ventajas:**

- Puedes cambiar de API real a mock sin tocar la lógica de negocio
- La lógica de negocio no depende de Vue o Nuxt
- Fácil de testear cada parte por separado

> 💡 **¿Quieres ver un ejemplo completo con código?** Revisa el [Ejemplo Completo con Producto](./examples/producto-example.md) que muestra paso a paso cómo implementar cada capa desde cero, con ejemplos de código reales.

### Estructura de un Dominio

Cada dominio (como `registros`) se organiza así:

```
hexag/registros/
├── shared/                    # Reglas comunes a todo el dominio
├── sociedades/
│   ├── domain/               # Entidades y reglas de negocio
│   ├── application/          # Casos de uso
│   ├── infrastructure/       # Repositorios HTTP y mocks
│   └── pasos/                # Cada paso del flujo (accionistas, apoderados, etc.)
│       ├── accionistas/
│       │   ├── domain/       # Entidad Accionista, contrato del repositorio
│       │   ├── application/  # Casos de uso: List, Create, Update, Delete
│       │   └── infrastructure/ # Implementación HTTP y mocks
│       └── apoderados/       # Misma estructura
└── sucursales/               # (Pendiente) misma estructura
```

---

## 🎨 Capa de Presentación (Presentation)

La capa de presentación conecta la UI (Vue) con la lógica de negocio (arquitectura hexagonal). Aquí es donde los componentes Vue consumen los casos de uso y gestionan el estado de la interfaz.

### Estructura

```
app/core/presentation/
├── [dominio]/
│   ├── stores/              # Stores Pinia que gestionan estado
│   ├── composables/         # Controllers reactivos
│   ├── mappers/             # (Opcional) Transforma FormData ↔ DTO/Entidad
│   └── types/               # Tipos específicos de formularios UI
```

### Componentes Principales

- **Stores (Pinia)**: Gestionan el estado y llaman a los casos de uso. Instancian repositorios y casos de uso, y mantienen el estado reactivo.

- **Controllers (Composables)**: Gestionan el ciclo de vida de los componentes (onMounted, onActivated), la carga automática de datos, y exponen estados derivados (isBootstrapping, isEnsuring).

- **Mappers de UI (Opcional pero Recomendado)**: Transforman entre FormData (formato de formularios) y DTO/Entidad.

### Mappers de UI: ¿Cuándo son necesarios?

**Son OBLIGATORIOS cuando:**

- Tu formulario tiene campos formateados (ej: precio como `"$99.99"` en lugar de `99.99`)
- Necesitas convertir tipos (ej: `stock: "10"` string → `stock: 10` number)
- Usas IDs de selects (ej: `categoriaId: "cat-1"` → `categoria: "Electrónica"`)
- Tienes campos de validación UI (`isValid`, `touched`)

**Son OPCIONALES cuando:**

- Tu formulario tiene exactamente los mismos campos y tipos que el DTO/Entidad
- No hay formateo ni conversiones necesarias
- Puedes usar DTO o Entidad directamente en el formulario

**Recomendación:** Aunque sea opcional, es recomendable crear el mapper para mantener la separación de capas y prepararse para futuros cambios.

### Flujo con Mappers de UI

```
Formulario (FormData)
    ↓
Presentation Mapper.toDTO()
    ↓
DTO → Backend

Backend → DTO
    ↓
Infrastructure Mapper.toDomain()
    ↓
Entidad (en store)
    ↓
Presentation Mapper.toFormData()
    ↓
Formulario (FormData)
```

_Los mappers de UI van en `presentation/[dominio]/mappers/`. Por ejemplo: `producto-form.mapper.ts` tiene funciones `toDTO()` (FormData → DTO) y `toFormData()` (Entidad → FormData)._

---

## 🎨 Arquitectura de 3 Capas para Componentes

Los componentes UI se organizan en 3 capas para máxima reutilización:

### Estructura de Capas

```
Base Layer (Headless)     →  Lógica pura, sin estilos
    ↓
UI Layer (Wrapper)        →  Estilos + Base, reutilizable
    ↓
Custom Layer (Composite)  →  Lógica de negocio + UI específica
```

### Estructura de Carpetas

```
app/components/
├── base/                    # Lógica pura (headless components)
│   ├── inputs/
│   │   ├── text/
│   │   │   ├── BaseTextInput.vue      # Lógica: validación, formateo
│   │   │   ├── ui/
│   │   │   │   ├── TextInput.vue      # Wrapper con estilos
│   │   │   │   └── TextArea.vue       # Variante multilinea
│   │   │   └── custom/
│   │   │       └── ClientNameInput.vue # Lógica específica de negocio
│   │   └── select/
│   └── tables/
├── ui/                      # Componentes de interfaz reutilizables
└── composite/               # Componentes específicos de flujo/negocio
```

**Ventajas:**

- Reutilización: Un componente base se usa en múltiples contextos
- Mantenimiento: Cambios aislados por capa
- Consistencia: UI layer garantiza diseño uniforme

---

## 🔄 Cómo se Conectan

### Flujo Completo

1. **Vista Vue** (`app/pages/`) - Renderiza componentes
2. **Componentes de Presentación** (`app/core/presentation/`) - Usan stores y composables
3. **Stores Pinia** - Gestionan estado y llaman casos de uso
4. **Casos de Uso** (`app/core/hexag/.../application/`) - Ejecutan lógica de negocio
5. **Repositorios** (`app/core/hexag/.../infrastructure/`) - Se comunican con APIs

### Ejemplo Real: Ver Lista de Accionistas

```
1. Usuario visita página → pages/registros/sociedades/[id]/accionistas.vue
2. Página usa componente → AccionistasManager.vue
3. Componente usa controller → useAccionistasController()
4. Controller usa store → useAccionistasStore()
5. Store ejecuta caso de uso → ListAccionistasUseCase
6. Caso de uso usa repositorio → AccionistasRepository (puerto)
7. Repositorio HTTP hace petición → API real o Mock (MSW)
```

---

## 📁 Estructura Completa del Proyecto

```
app/
├── core/                    # Núcleo de la aplicación
│   ├── hexag/              # Arquitectura hexagonal
│   ├── presentation/       # Componentes Vue que usan hexag
│   └── shared/            # Utilidades compartidas
├── components/             # Componentes UI reutilizables (3 capas)
├── pages/                  # Rutas de la aplicación
├── layouts/                # Layouts de páginas
└── types/                  # Tipos TypeScript globales
```

---

## 🎯 Resumen

- **Hexagonal**: Separa lógica de negocio de tecnologías externas
- **3 Capas UI**: Organiza componentes para máxima reutilización
- **Presentación**: Conecta Vue con la lógica de negocio
- **Resultado**: Código mantenible, testeable y escalable

---

[← Volver al README principal](../../README.md)
