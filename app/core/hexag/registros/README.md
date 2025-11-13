# Arquitectura Hexagonal – Dominio `@registros`

Este módulo encapsula toda la lógica de negocio asociada a **Registros** (sociedades y sucursales) siguiendo arquitectura **Hexagonal (Ports & Adapters)**. El objetivo es aislar el dominio del framework (Nuxt) y permitir intercambiar fácilmente adaptadores (MSW, API real, etc.).

## Estructura General

```
app/core/hexag/registros/
├── shared/                    # Reglas y contratos comunes al dominio
│   ├── domain/
│   │   ├── entities/
│   │   ├── value-objects/
│   │   └── ports/
│   ├── application/
│   │   ├── dtos/
│   │   ├── use-cases/
│   │   └── services/
│   └── infrastructure/
│       └── adapters/          # Utilidades comunes (transformers, factories, etc.)
├── sociedades/
│   ├── pasos/
│   │   └── datos-generales/
│   │       ├── domain/
│   │       ├── application/
│   │       └── infrastructure/
│   ├── domain/                # Entidades agregadas (Sociedad, Paso, etc.)
│   ├── application/           # Casos de uso transversales (CreateSociedad, ListSociedades…)
│   └── infrastructure/        # Repositorios concretos (HTTP/MSW) y mappers
└── sucursales/                # (Pendiente) misma estructura que sociedades
```

### ¿Por qué dividir por pasos?

- Cada paso del flujo (datos generales, accionistas, etc.) expone su propio contrato (puerto) y DTOs.
- Compartimos entidad raíz `Sociedad` y value-objects comunes en `shared/domain`.
- Permite habilitar adaptadores independientes (p.ej., diferentes endpoints o microservicios por paso).

## Integración con la UI

1. La capa de presentación (`app/core/presentation/registros/...`) instancia los **casos de uso** ubicados en `application/`.
2. Los casos de uso dependen únicamente de los **puertos** definidos en `domain/ports`.
3. La infraestructura proporciona **repositorios** que implementan esos puertos:
   - `infrastructure/http/*`: fetch/axios apuntando a la API real.
   - `infrastructure/mocks/msw/*`: handlers que persisten datos en memoria durante el desarrollo.

## Mocks (MSW)

- Handlers en `app/core/hexag/registros/sociedades/infrastructure/mocks/handlers`.
- Estado en memoria (`state`) ubicado en `.../mocks/data`.
- Export público de handlers en `.../mocks/index.ts` para registrarlos en el Service Worker global.
- Cada adaptador MSW cumple el mismo puerto que la versión HTTP, permitiendo swap transparente.

## Convenciones

- **Entidades**: sin dependencias externas, solo tipos/objetos de negocio.
- **Value Objects**: encapsulan validaciones y reglas inmutables (ej. RUC, RazónSocial).
- **DTOs**: estructuras simples para mover datos entre capas (UI ↔ aplicación ↔ infraestructura).
- **Use Cases**: clases/funciones que coordinan la lógica; no realizan IO directamente.
- **Repositorios**: adaptadores concretos que implementan los puertos y realizan IO.

## Próximos pasos

Revisar el `ROADMAP.md` en esta carpeta para conocer el estado actual, backlog y prioridades del dominio `@registros`.

