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

Seguir el mismo patrón que Datos Principales, pero usando un composable (no Pinia store legacy):

1. **Páginas**

   - `app/pages/registros/sociedades/{crear|editar}/[id]/accionistas.vue` + versión `/registros/sociedades/[id]/accionistas.vue`.
   - Calculan `societyId`, renderizan `AccionistasManager` y le pasan el `mode` (`EntityModeEnum`).

2. **Composable (`useAccionistas.ts`)**

   - Vive en `app/core/presentation/registros/sociedades/pasos/accionistas`.
   - Instancia los casos de uso `List/Create/Update/Delete` del hexágono y expone `accionistas`, `isLoading`, `isSaving`, `fetchAll`, `create`, `update`, `remove`.
   - Maneja errores y resetea el estado después de cada operación.

3. **UI / Modal**

   - `AccionistasManager.vue` orquesta la tabla (`AccionistasList.vue`) y `AccionistaModal.vue`.
   - `AccionistaForm.vue` usa Zod + vee-validate; por ahora cubre Personas Naturales y Jurídicas (el resto de tipos quedará para una iteración posterior).
   - El manager convierte los valores del formulario a `AccionistaDTO` antes de llamar a los casos de uso.

4. **DTOs/Repos**

   - `app/core/hexag/registros/sociedades/pasos/accionistas/application` contiene los DTOs y use cases.
   - `AccionistasHttpRepository` implementa `list/create/update/delete` y se apoya en `AccionistasMapper`.

5. **MSW**

   - Handlers en `app/core/hexag/registros/sociedades/pasos/accionistas/infrastructure/mocks`.
   - Base path `"*/api/v2/society-profile/:id/shareholder"`.
   - Persistencia en IndexedDB (`STORE_NAME = "accionistas"`) para simular el backend mientras se trabaja offline.

## 3. Roadmap de implementación

| Orden | Tarea                                                               | Estado | Archivo(s)                                                                                          |
| ----- | ------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------- |
| 1     | Documentar DTOs/persona-type y mapper                               | ✅     | `app/core/hexag/registros/sociedades/pasos/accionistas/domain` + `infrastructure/mappers`           |
| 2     | Repositorio HTTP + use cases (`List`, `Create`, `Update`, `Delete`) | ✅     | `app/core/hexag/registros/sociedades/pasos/accionistas/application` + `infrastructure/repositories` |
| 3     | Composable `useAccionistas` (reemplaza store/controller legacy)     | ✅     | `app/core/presentation/registros/sociedades/pasos/accionistas/useAccionistas.ts`                    |
| 4     | UI (Manager + Modal + Form)                                         | ✅     | `app/core/presentation/registros/sociedades/pasos/accionistas/components/*`                         |
| 5     | MSW handlers + estado mock                                          | ✅     | `app/core/hexag/registros/sociedades/pasos/accionistas/infrastructure/mocks`                        |
| 6     | Actualizar páginas `/registros` para usar la nueva capa             | ✅     | `app/pages/registros/sociedades/.../accionistas.vue`                                                |
| 7     | Documentar pruebas manuales (crear, editar, eliminar)               | ⏳     | README de presentación                                                                              |

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
