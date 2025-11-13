# Roadmap – Dominio `@registros`

> Documento vivo. Actualízalo en cada iteración para mantener trazabilidad de avances y decisiones dentro de arquitectura hexagonal.

## Estado Actual (13 Nov 2025)

- Layout `registros` replica el comportamiento del layout legacy.
- Navegación principal expone Sociedades y Sucursales.
- Páginas base (dashboard, agregar, historial) creadas para sociedades y sucursales.
- Arquitectura hexagonal planificada (ver `README.md`) y carpetas iniciales creadas para:
  - Sociedades (`shared`, `domain`, `application`, `infrastructure`).
  - Pasos: `datos-sociedad`, `accionistas`, `acciones`, `asignacion-acciones`.
- MSW pendiente de implementar con persistencia in-memory.

## Próximos Hit Steps

1. **Skeleton Hexagonal**
   - [ ] Crear estructura de carpetas `shared`, `sociedades`, `sucursales` según README.
   - [ ] Definir entidades (`Sociedad`, `Paso`, value objects) y puertos compartidos.
2. **Casos de Uso Sociedades**
   - [ ] `CreateSociedadUseCase`
   - [ ] `ListSociedadesUseCase`
   - [ ] `GetDatosGeneralesUseCase` / `SaveDatosGeneralesUseCase`
3. **Infraestructura MSW**
   - [x] Estado in-memory en `.../mocks/data/sociedades.state.ts`.
   - [x] Handlers `POST/GET/DELETE` descritos en el plan.
   - [x] Exportar handlers y registrarlos en workers (cliente + servidor).
4. **Repositorios HTTP**
   - [ ] Implementar `SociedadHttpRepository` (fetch/axios) que implementa el puerto.
   - [ ] Añadir mappers request/response.
5. **Integración UI**
   - [x] Store `sociedadHistorial` consume casos de uso.
   - [x] `agregar.vue` dispara `CreateSociedad` y redirige al flujo con ID.
   - [ ] `datos-sociedad.vue` se hidrata vía caso de uso y persiste cambios.
6. **Testing & Docs**
   - [ ] Documentar endpoints MSW en `docs/architecture/registro-sociedades.md`.
   - [ ] Agregar pruebas unitarias para casos de uso (opcional inicial).

## Consideraciones

- Mantener `@registros` aislado del dominio legacy `@registro-societario`.
- Cada paso del flujo (datos generales, accionistas, etc.) puede tener su submódulo con dominio propio, reutilizando entidad raíz `Sociedad`.
- MSW debe reflejar la estructura real esperada del backend (URLs, payloads) para facilitar el swap.
- Cuando exista backend real, bastará con cambiar la implementación del puerto por el repositorio HTTP.

## Historial de Cambios

- **13/11/2025**: Se crean README y Roadmap iniciales; se define plan de estructura hexagonal y MSW.

