## Arquitectura Hexagonal para Registro de Sociedades

### Visión General
El dominio de Registro de Sociedades se organizará siguiendo principios DDD + Hexagonal (Ports & Adapters). El objetivo es desacoplar la capa UI de la lógica de dominio y de las fuentes de datos externas, permitiendo escalar la funcionalidad sin arrastrar dependencias entre capas.

### Capas
- **UI (Presentación)**
  - `layouts/registros.vue`: controla navegación y visibilidad del sidebar.
  - Páginas `app/pages/registros/sociedades/**`: solo importan layout, composable de vista y componente funcional.
  - Componentes funcionales (forms/cards) viven en `app/presentation/registros/sociedades/components`.

- **Aplicación (Orquestación)**
  - Composable `useSociedadVista` expone estado listo para la UI (loading, model, errors).
  - Store Pinia `sociedadVista.store.ts` mantiene fuente única de verdad para la vista (data, status, source).
  - Los métodos del store delegan en servicios de dominio (no llaman HTTP directamente).

- **Dominio (Hexagonal)**
  - Carpeta `app/hexag/registro-sociedades/`:
    - `entities/` y `value-objects/`: modelo de dominio puro.
    - `repositories/`: interfaces (puertos) para persistencia.
    - `use-cases/`: servicios de aplicación (`CreateSociedadUseCase`, `ListSociedadesUseCase`, etc.).
    - `mappers/`: traducción entre DTOs/infraestructura y entidades.

- **Infraestructura**
  - `app/infra/http/registros/sociedades/`: implementaciones concretas de los repositorios (adapters HTTP).
  - `app/infra/mocks/msw/handlers/registros/sociedades.ts`: mocks MSW para desarrollo.
  - Mappers JSON ↔ dominio.

### Flujo de Datos
1. La página monta `useSociedadVista()`.
2. El composable llama `sociedadStore.init({ source: "internal", id })`.
3. El store invoca un `workflow`/`service` que ejecuta el caso de uso adecuado.
4. El caso de uso obtiene el repositorio desde la infraestructura (inyectado o importado) y devuelve entidades.
5. El store hidrata el estado y la UI reacciona vía `computed`.
6. Si una operación externa requiere precargar datos, puede llamar `sociedadStore.init({ source: "external", id })` sin montar la vista; el store registra el origen y evita duplicar cargas.

### Indicadores en el Store
```ts
interface SociedadVistaState {
  data: SociedadAggregate | null;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
  source: "internal" | "external" | null;
  lastUpdated: number | null;
}
```
Getters exponen `isLoading`, `hasData`, `modelForForm` (mapper UI), etc.

### API Mock (MSW)
- `POST /api/registros/sociedades` → `{ id }`
- `GET /api/registros/sociedades` → listado básico.
- `GET /api/registros/sociedades/:id` → payload completo para hidratar formularios.
Los handlers viven en `app/infra/mocks/msw/handlers/registros/sociedades.ts` y se registran en el plugin `plugins/msw.client.ts`.

### Próximos Pasos
1. Crear skeleton de carpetas/dominios (hexag + infra).
2. Implementar store/composable `sociedadVista`.
3. Conectar páginas actuales a la nueva capa de aplicación.
4. Activar mocks MSW y documentar casos de uso añadidos.

