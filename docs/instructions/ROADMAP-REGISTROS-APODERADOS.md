# Roadmap Migración Registro de Apoderados (Registros/Core)

## 1. Objetivo
Replicar el comportamiento aprobado en `registro-societario` (clases de apoderados + apoderados + preparación para régimen de poderes) dentro de la arquitectura hexagonal (`app/core/hexag` + `app/core/presentation/registros`). El frontend es la fuente de verdad para UUIDs en colecciones.

## 2. Tareas
1. **Auditoría legacy**
   - Revisar `app/modules/registro-sociedades/components/steps/RegistroApoderadosStep.vue`.
   - Composables: `useClasesApoderado`, `useRegistroApoderados`, `useOtrosApoderados`.
   - Modales: `ClaseApoderadoModal`, `RegistroApoderadoModal`, `RegistroOtroApoderadoModal`.
2. **Dominio/application**
   - Crear entidades + DTOs en `app/core/hexag/registros/sociedades/pasos/apoderados/`.
   - Use cases: listar/crear/editar/eliminar clases y apoderados.
   - Repositorio HTTP + mapper → endpoints `/attorney-register/classes` y `/attorney-register/attorneys`.
3. **MSW**
   - Handlers para los endpoints anteriores (copiar lógica de `accionistas.state.ts` pero con clases/apoderados).
   - Estado inicial con UUIDs reales de ejemplo.
4. **Presentación**
   - Nuevo paso `app/pages/registros/sociedades/[id]/registro-apoderados.vue`.
   - Componentes presentacionales en `app/core/presentation/registros/sociedades/pasos/apoderados/`.
   - Stores Pinia (presentation) + `useApoderadosController`.
   - Portar modales del legacy (ajustando props/emits y validaciones).
5. **Rutas / navegación**
   - Agregar paso en `societyRegisterNavigation` y `useProgressNavbarRoutes`.
6. **Documentación**
   - `docs/instructions/16-SOCIEDADES-PASO6-APODERADOS.md` (resumen de arquitectura, payloads, validaciones).
   - Mantener `docs/backend/06-registro-apoderados.md` y `07-regimen-poderes.md` sincronizados.
7. **QA**
   - `npm run typecheck` + pruebas manuales en `/registros/sociedades/:id/registro-apoderados`.

## 3. Issue sugerido
**Título:** Migrar paso “Registro de Apoderados” a arquitectura hexagonal en /registros  
**Descripción resumida:**
1. Implementar dominio y repositorios nuevos (`attorney-register`).
2. Portar UI de clases/apoderados con stores y modales en core/presentation.
3. Actualizar navegación y MSW.
4. Documentar reglas de UUID (frontend genera `id`, `persona.id`).

## 4. Dependencias
- `docs/backend/06-registro-apoderados.md` (actualizado con UUIDs en POST).
- `docs/backend/07-regimen-poderes.md` (powers + grants).
- Reutilizar `Persona` del módulo de accionistas para evitar duplicados.

## 5. Estado actual
- Documentación alineada con “frontend genera UUID”.
- Paso de accionistas ya migrado siguiendo la misma política.
- Pendiente iniciar implementación para apoderados.

