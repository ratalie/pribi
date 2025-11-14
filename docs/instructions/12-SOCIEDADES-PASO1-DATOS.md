# Paso 1 – Datos Principales (Detalle Técnico)

## Archivos relevantes

| Capa | Archivo |
| --- | --- |
| Página editar | `app/pages/registro-societario/sociedades/editar/[id]/datos-sociedad.vue` |
| Página crear | `app/pages/registro-societario/sociedades/crear/[id]/datos-sociedad.vue` |
| Controller | `app/core/presentation/registros/sociedades/composables/useDatosSociedadController.ts` |
| Store | `app/core/presentation/registros/sociedades/stores/datos-sociedad.store.ts` |
| Form | `app/core/presentation/registros/sociedades/components/DatosSociedadForm.vue` |
| Form composable | `app/core/presentation/registros/sociedades/composables/useDatosSociedadForm.ts` |
| Repositorio HTTP | `app/core/hexag/registros/sociedades/pasos/datos-sociedad/infrastructure/repositories/datos-sociedad.http.repository.ts` |
| MSW handler | `app/core/hexag/registros/sociedades/pasos/datos-sociedad/infrastructure/mocks/handlers/datos-sociedad.handlers.ts` |

## Flujo de ejecución
1. El usuario entra a `/registro-societario/sociedades/editar/:id/datos-sociedad`.
2. La página calcula `societyId` y ejecuta `useDatosSociedadController({ societyId, source: "internal" })`.
3. El controller siempre llama `store.ensureLoaded(societyId)` en `onMounted`.
4. El store decide si necesita llamar a `getUseCase.execute`. Registra metadatos al terminar.
5. `useDatosSociedadForm` ve `store.datos` y rellena el formulario.
6. Al guardar:
   - `submit()` genera un payload normalizado (`normalizeTypeSocietyCode`, `normalizeRegistryOfficeCode`).
   - Si no hay datos previos → `store.create`.
   - Si ya existían → `store.update`.
7. El repositorio utiliza `$fetch` con `withAuthHeaders` contra `/api/v2/society-profile/{id}/society`.

## Logs de depuración
- Controller (`useDatosSociedadController`):
  ```
  [DatosController] onMounted -> ensure { societyId: "1", ... }
  [DatosController] ensure:start { societyId: "1", ... }
  [DatosController] ensure:done { societyId: "1", fetched: true, ... }
  [DatosController] store.datos empty detected, forcing ensure ...
  ```
- Store (`useDatosSociedadStore`):
  ```
  [DatosSociedadStore] load:start { idSociety: "1", source: "internal" }
  [DatosSociedadStore] load:success { ... }
  [DatosSociedadStore] create/update ... 
  ```
- Repositorio (`sociedad.http.repository.ts`) ya tenía logs en `list()`. Para datos principales se puede activar logs similares si hiciera falta.

## Consideraciones
- **Tokens**: el backend devolverá 401 si no hay `session.token`. Configurar `NUXT_PUBLIC_DEFAULT_AUTH_TOKEN` para MSW o asegurarse de iniciar sesión.
- **Persistencia**: Pinia con `persist: true` guarda los datos; aun así `ensureLoaded` se ejecuta al montar para detectar cambios recientes.
- **IDs**: `ensureId()` genera un UUID si la forma no lo tiene, para cumplir con el backend.
- **Enums**: se usan helpers (`normalizeTypeSocietyCode`, `normalizeRegistryOfficeCode`) para garantizar que backend reciba códigos (`S.A.C.`, `LIM`, etc.).
- **MSW**: `datos-sociedad.state.ts` persiste en IndexedDB (`STORE_NAME = "datosSociedad"`), lo que permite probar sin backend.

## Próximos pasos
- Replicar este patrón para los demás pasos (Quórums ya lo hace).
- Crear tests que verifiquen que `ensureLoaded` no dispare fetch redundante (mocking `lastFetchedAt`).
- Documentar un `useSocietyStepController` genérico si se vuelve necesario.

---

Última actualización: Noviembre 14, 2025

