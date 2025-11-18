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

> **Rutas simplificadas:** Las carpetas `crear/[id]` y `editar/[id]` fueron eliminadas. Cada paso (incluido Accionistas) vive únicamente en `app/pages/registros/sociedades/[id]/<paso>.vue`. El modo (crear, editar, preview) se determina pasando `EntityModeEnum` al componente principal.

Seguir el mismo patrón que Datos Principales, pero usando un composable (no Pinia store legacy):

1. **Página única**

   - Archivo: `app/pages/registros/sociedades/[id]/accionistas.vue`.
   - Calcula `societyId`, define el `EntityModeEnum` (CREATE, EDITAR, PREVISUALIZAR) y renderiza `AccionistasManager`.
   - `preview` se resuelve con la misma página, cambiando sólo el modo.

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

## 3. API y endpoints

| Método | Endpoint                                                  | Uso                                     |
| ------ | --------------------------------------------------------- | --------------------------------------- |
| GET    | `/api/v2/society-profile/{societyProfileId}/shareholders` | Listar todos los accionistas            |
| POST   | `/api/v2/society-profile/{societyProfileId}/shareholders` | Crear un accionista (colección)         |
| PUT    | `/api/v2/society-profile/{societyProfileId}/shareholders` | Actualizar un accionista existente      |
| DELETE | `/api/v2/society-profile/{societyProfileId}/shareholders` | Eliminar un accionista (id en body)\*\* |

**Nota:** El backend actual recibe el `id` del accionista a eliminar en el cuerpo (`{ "id": "<uuid>" }`). Si el contrato cambia a `/shareholders/{shareholderId}`, sólo habrá que ajustar el repositorio y los handlers MSW, no la UI.

Todos los métodos esperan header `Authorization: Bearer <token>` (inyectado por `withAuthHeaders`). Las respuestas exitosas incluyen `{ success, message, code }`; los handlers MSW replican esa forma para desarrollo offline.

### 3.1 Ejemplos por tipo de persona

**Persona Natural**

```json
{
  "id": "019a0c24-ecc6-7435-a859-1909f9b94e96",
  "persona": {
    "id": "019a0c24-ecc6-7435-a859-1909f9b94e91",
    "tipo": "NATURAL",
    "nombre": "María",
    "apellidoPaterno": "Salazar",
    "apellidoMaterno": "López",
    "tipoDocumento": "DNI",
    "numeroDocumento": "45678912",
    "paisEmision": "PE"
  }
}
```

**Persona Jurídica**

```json
{
  "id": "019a0c24-ecc6-7435-a859-1909f9b94e36",
  "persona": {
    "id": "019a0c24-ecc6-7435-a859-1909f9b91e96",
    "tipo": "JURIDICA",
    "tipoDocumento": "RUC",
    "numeroDocumento": "20600123456",
    "razonSocial": "TechVenture SAC (Actualizada)",
    "direccion": "Av. José Pardo 610, Miraflores",
    "constituida": true,
    "nombreComercial": "TechVenture",
    "distrito": "Miraflores",
    "provincia": "Lima",
    "departamento": "Lima",
    "pais": "PE"
  }
}
```

**Sucursal Extranjera**

```json
{
  "id": "011a0c24-ecc6-7435-a859-1909f9b94e96",
  "persona": {
    "id": "013a0c24-ecc6-7435-a859-1909f9b94e96",
    "tipo": "SUCURSAL",
    "ruc": "20600123457",
    "nombreSucursal": "Sucursal Norte (Actualizada)",
    "partidaRegistral": "Partida 12345",
    "oficinaRegistrada": "SUNARP Lima",
    "direccionFiscal": "Av. Grau 100, Trujillo",
    "representante": {
      "nombre": "Carlos",
      "apellidoPaterno": "Ramírez",
      "apellidoMaterno": "Gómez",
      "tipoDocumento": "DNI",
      "numeroDocumento": "56789012",
      "paisEmision": "PE"
    }
  }
}
```

**Fondo de Inversión**

```json
{
  "id": "019a0c24-ecc6-7435-a859-1909f9b94e54",
  "persona": {
    "id": "019a0c24-ecc6-7435-a859-1909f9b94e78",
    "tipo": "FONDO_INVERSION",
    "ruc": "20600999999",
    "razonSocial": "Fondo Andino de Inversión (Act.)",
    "direccion": "Av. Arequipa 1500, Lima",
    "tipoFondo": "CERRADO",
    "representante": {
      "nombre": "Lucía",
      "apellidoPaterno": "García",
      "apellidoMaterno": "Vega",
      "tipoDocumento": "DNI",
      "numeroDocumento": "78901234",
      "paisEmision": "PE"
    },
    "fiduciario": {
      "ruc": "20123456789",
      "razonSocial": "Banco Fiduciario del Perú"
    }
  }
}
```

**Fideicomiso**

```json
{
  "id": "019a0c74-ecc6-7435-a859-1909f9b94e96",
  "persona": {
    "id": "019a0c33-ecc6-7435-a859-1909f9b94e96",
    "tipo": "FIDEICOMISO",
    "tieneRuc": true,
    "ruc": "20567890123",
    "razonSocial": "Fideicomiso Inmobiliario Lima (Act.)",
    "numeroRegistroFideicomiso": "REG-2025-0001",
    "partidaRegistral": "Partida 7654321",
    "oficinaRegistrada": "SUNARP Lima",
    "direccionFiscal": "Av. Salaverry 1234, Lima",
    "representante": {
      "nombre": "Diego",
      "apellidoPaterno": "Lozano",
      "apellidoMaterno": "Paredes",
      "tipoDocumento": "DNI",
      "numeroDocumento": "74125896",
      "paisEmision": "PE"
    },
    "fiduciario": {
      "ruc": "20111111111",
      "razonSocial": "Banco Fideicomisario S.A."
    }
  }
}
```

**Sucesión Indivisa**

```json
{
  "id": "065a0c24-ecc6-7435-a859-1909f9b94e96",
  "persona": {
    "id": "032a0c24-ecc6-7435-a859-1909f9b94e96",
    "tipo": "SUCESION_INDIVISA",
    "ruc": "20987654321",
    "razonSocial": "Sucesión de Juan Pérez (Act.)",
    "distrito": "Santiago de Surco",
    "provincia": "Lima",
    "departamento": "Lima",
    "direccion": "Calle Los Cedros 456",
    "representante": {
      "nombre": "Andrea",
      "apellidoPaterno": "Pérez",
      "apellidoMaterno": "Gómez",
      "tipoDocumento": "DNI",
      "numeroDocumento": "65498721",
      "paisEmision": "PE"
    }
  }
}
```

Estos ejemplos sirven como referencia para payloads reales y como seed para MSW (`app/core/hexag/.../accionistas/infrastructure/mocks/accionistas.state.ts`). Úsalos tal cual cuando necesites pruebas manuales o para validar mapeos en el repositorio/mapper.

## 4. Roadmap de implementación

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
