# Roadmap – Dominio `@registros`

> Documento vivo. Actualízalo en cada iteración para mantener trazabilidad de avances y decisiones dentro de arquitectura hexagonal.

## Estado Actual (13 Nov 2025)

- Layout `registros` replica el comportamiento del layout legacy.
- Navegación principal expone Sociedades y Sucursales.
- Páginas base (dashboard, agregar, historial) creadas para sociedades y sucursales.
- Arquitectura hexagonal planificada (ver `README.md`) y carpetas iniciales creadas para:
  - Sociedades (`shared`, `domain`, `application`, `infrastructure`).
  - Pasos: `datos-sociedad`, `accionistas`, `acciones`, `asignacion-acciones`.
- MSW operativo con persistencia `IndexedDB` (mock-database) y endpoints alineados a `/api/v2/society-profile`.
- Repositorios HTTP (`SociedadHttpRepository`, `DatosSociedadHttpRepository`) consumen los endpoints v2 y adjuntan token automáticamente.
- Stores de presentación (`sociedad-historial`, `datos-sociedad`) integrados con casos de uso y UI (historial, dashboard, preview).

## Próximos Hit Steps

1. **Skeleton Hexagonal**
   - [x] Crear estructura de carpetas `shared`, `sociedades`, `sucursales` según README.
   - [ ] Definir entidades (`Sociedad`, `Paso`, value objects) transversales.
2. **Casos de Uso Sociedades**
   - [x] `CreateSociedadUseCase`
   - [x] `ListSociedadesUseCase`
   - [x] `GetDatosGeneralesUseCase` / `SaveDatosGeneralesUseCase`
   - [ ] Implementar `GetSociedadPerfilUseCase` para `/api/v2/society-profile/{id}` (steps metadata).
3. **Infraestructura MSW**
   - [x] Estado in-memory en `.../mocks/data/sociedades.state.ts`.
   - [x] Handlers `POST/GET/DELETE` alineados a `/api/v2/society-profile`.
   - [x] Estado in-memory y handlers (`GET/POST/PUT`) para `datos-sociedad` en `/api/v2/society-profile/:id/society`.
   - [x] Exportar handlers y registrarlos en workers (cliente + servidor).
4. **Repositorios HTTP**
   - [x] Implementar `SociedadHttpRepository` (Nuxt `$fetch` + withAuthHeaders).
   - [x] Añadir mappers request/response y normalizar `pasoActual`.
5. **Integración UI**
   - [x] Store `sociedadHistorial` consume casos de uso.
   - [x] `agregar.vue` dispara `CreateSociedad` y redirige al flujo con ID.
   - [x] `datos-sociedad.vue` se hidrata vía caso de uso y persiste cambios.
   - [x] Dashboard muestra métricas en vivo (total, en curso, finalizados).
6. **Testing & Docs**
   - [ ] Documentar endpoints MSW y contratos v2 en `docs/architecture/registro-sociedades.md`.
   - [ ] Agregar pruebas unitarias para casos de uso (opcional inicial).
   - [ ] Alinear documentación con estructura `SocietyMainData` y enum `SocietyRegisterStep`.

## Consideraciones

- Mantener `@registros` aislado del dominio legacy `@registro-societario`.
- Cada paso del flujo (datos generales, accionistas, etc.) puede tener su submódulo con dominio propio, reutilizando entidad raíz `Sociedad`.
- MSW debe reflejar la estructura real esperada del backend (URLs, payloads) para facilitar el swap.
- Cuando exista backend real, bastará con cambiar la implementación del puerto por el repositorio HTTP.

## Historial de Cambios

- **13/11/2025**: Se crean README y Roadmap iniciales; se define plan de estructura hexagonal y MSW.
- **13/11/2025 (tarde)**: Se actualizan repositorios, MSW y UI para consumir endpoints `/api/v2/society-profile` y exponer `pasoActual` en historial/dashboard.

