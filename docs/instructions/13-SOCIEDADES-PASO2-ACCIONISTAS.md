# Paso 2 – Accionistas (Plan & Roadmap)

## 0. Contexto backend

- Endpoint base: `/api/v2/society-profile/{societyProfileId}/shareholders`.
- Payload general:
  ```jsonc
  {
    "id": "<uuid accionista>",
    "persona": {
      "id": "<uuid persona>",
      "tipo": "NATURAL | JURIDICA | FIDEICOMISO | FONDO_INVERSION | SUCURSAL | SUCESION_INDIVISA",
      "...campos específicos por tipo..."
    }
  }
  ```
- El backend crea/actualiza la persona según el UUID enviado y devuelve `201/200` con mensajes de confirmación.

## 1. Estado actual en frontend

- Componentes de UI: `app/modules/registro-sociedades/components/steps/AccionistasStep.vue` (form principal) + modales en `app/modules/registro-sociedades/components/accionistas/modals`.
- Store legacy: revisar `app/modules/registro-sociedades/stores/accionistas.store.ts` (usa opciones antiguas, sin controllers).
- MSW: aún no existe para accionistas (`pasos/accionistas/infrastructure/mocks` vacío).
- Rutas: en `/registro-societario/...` todavía apuntan al módulo anterior; hay que replicar la migración hecha en datos principales para `/registros/...`.

## 2. Arquitectura objetivo

Seguir el mismo patrón que Datos Principales:

1. **Página**

   - `app/pages/registros/sociedades/{crear|editar}/[id]/accionistas.vue` (nuevo) + versión `/registro-societario/...`.
   - Calcula `societyId`, invoca `useAccionistasController`, muestra `AccionistasStep` (o el nuevo `AccionistasManager` cuando esté listo).

2. **Controller** (`useAccionistasController.ts`)

   - En `app/core/presentation/registros/sociedades/composables/`.
   - Exponer `isBootstrapping`, `accionistas`, `ensure`, etc., llamando al store `useAccionistasStore`.

3. **Store** (`useAccionistasStore.ts`)

   - En `app/core/presentation/registros/sociedades/stores/`.
   - Sintaxis Pinia options + acciones `ensureLoaded`, `list`, `create`, `update`, `delete`.
   - Mantener `lastFetchedAt`, `origin`, etc.

4. **DTOs/Repos**

   - Crear `app/core/hexag/registros/sociedades/pasos/accionistas/application/dtos`.
   - Repositorio HTTP: `accionistas.http.repository.ts` con métodos `list`, `create`, `update`, `delete`.

5. **MSW**

   - `app/core/hexag/registros/sociedades/pasos/accionistas/infrastructure/mocks/handlers`.
   - Base path: `"*/api/v2/society-profile/:id/shareholders"`.
   - Persistir mock en IndexedDB (`STORE_NAME = "accionistas"`), guardando tanto `accionista` como `persona`.
   - Seeder con ejemplos de los 6 tipos de persona (usar los payloads del backend como referencia).

6. **UI / Modal**
   - El modal debe manejar las variantes de `persona.tipo`.
   - Necesitamos un mapper `AccionistaMapper` que convierta la respuesta del backend al DTO que consume el modal (por ejemplo, dividir en `datosPersonaNatural`, `datosPersonaJuridica`, etc.).

## 3. Roadmap de implementación

| Orden | Tarea                                                                                  | Archivo(s)                                                                                          |
| ----- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1     | Documentar DTOs/persona-type                                                           | `app/core/hexag/registros/sociedades/pasos/accionistas/domain`                                      |
| 2     | Crear repositorio HTTP + use cases (`List`, `Create`, `Update`, `Delete`)              | `app/core/hexag/registros/sociedades/pasos/accionistas/application` + `infrastructure/repositories` |
| 3     | Store Pinia (`useAccionistasStore`) con `ensureLoaded`                                 | `app/core/presentation/registros/sociedades/stores/accionistas.store.ts`                            |
| 4     | Controller (`useAccionistasController`)                                                | `app/core/presentation/registros/sociedades/composables`                                            |
| 5     | Refactor `AccionistasStep` para usar el store/controller (sin `load` manual)           | `app/core/presentation/.../components/` o mover desde `modules`                                     |
| 6     | Crear MSW handlers + state (datos ejemplo de los 6 tipos)                              | `app/core/hexag/registros/sociedades/pasos/accionistas/infrastructure/mocks`                        |
| 7     | Actualizar páginas `/registro-societario` y `/registros` para usar el nuevo controller | `app/pages/.../accionistas.vue`                                                                     |
| 8     | Documentar pruebas manuales (crear, editar, eliminar)                                  | README del módulo                                                                                   |

## 4. Documentación y README

Agregar un README específico en `app/core/presentation/registros/sociedades/README.md` (o nuevo archivo) con:

1. Endpoints del backend y payload esperado (usar tablas de este documento).
2. Matriz “tipo de persona → campos requeridos”.
3. Flujo del modal (Validaciones, guardado, respuesta).
4. Cómo levantar MSW para pruebas (`MSW_DISABLED=false` y ejemplos de seed).

## 5. Verificación MSW vs Backend

- Para Datos principales y Quórums, MSW ya replica el backend v2.
- Accionistas debe seguir el mismo contrato:
  - POST/PUT a `/api/v2/society-profile/{id}/shareholders`.
  - Respuestas `201/200` con `success`, `message`, `code`.
  - GET que devuelva la lista de accionistas + datos completos de `persona`.
- Antes de conectar al backend real, validar con MSW:
  1. `pnpm dev` con `MSW_DISABLED=false`.
  2. Crear accionistas de los seis tipos usando el modal.
  3. Verificar que al recargar se mantiene la data (IndexedDB).
  4. Revisar logs `[MSW][Accionistas]` para confirmación.

---

Última actualización: Noviembre 14, 2025
