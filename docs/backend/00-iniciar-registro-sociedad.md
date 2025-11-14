# Iniciar Registro de Sociedad (v2)

## Resumen
Administra el ciclo de vida del **perfil de sociedad** (`societyProfileStructure`). Incluye la creación inicial, actualización del paso actual, consulta, listado y baja lógica.

- **Base path:** `/api/v2/society-profile`
- **Auth:** `Bearer <token>` (ver `00-autenticacion.md`)
- **ID primario:** entero incremental (`structureId`).

---

## Crear perfil de sociedad
- **Método:** `POST`
- **Ruta:** `/api/v2/society-profile`
- **Body:** ninguno
- **Respuesta (`201`):**
```json
{
  "success": true,
  "message": "Sociedad creada correctamente.",
  "code": 201,
  "data": {
    "structureId": 73
  }
}
```
- El backend genera IDs UUID internos para los submódulos (sociedad, accionistas, poderes, etc.) y deja el paso actual en `initiate-register`.

### Encabezados mínimos
| Header | Valor |
| --- | --- |
| `Authorization` | `Bearer <token>` |
| `Content-Type` | `application/json` |

---

## Actualizar paso del perfil
- **Método:** `PUT`
- **Ruta:** `/api/v2/society-profile/{structureId}`
- **Body:** cadena JSON con el nuevo paso (`SocietyRegisterStep`). Ejemplo:
```json
"datos-sociedad"
```
- **Pasos soportados:**
| Valor | Descripción |
| --- | --- |
| `initiate-register` | Inicio del flujo |
| `datos-sociedad` | Captura de datos principales |
| `accionistas` | Registro de accionistas |
| `acciones` | Configuración de acciones |
| `asignacion-acciones` | Asignación de acciones |
| `directorio` | Definición de directorio |
| `registro-apoderados` | Registro de apoderados |
| `regimen-poderes` | Régimen de poderes |
| `quorums-mayorias` | Quórums y mayorías |
| `acuerdos-societarios` | Acuerdos especiales |
| `resumen` | Paso final / resumen |

- **Respuesta (`200`):** mensaje de éxito.

> El endpoint espera un **string plano**. Si envías un objeto (`{"step":"..."}`) la validación fallará.

---

## Obtener un perfil específico
- **Método:** `GET`
- **Ruta:** `/api/v2/society-profile/{structureId}`
- **Respuesta (`200`):** arreglo con la estructura y sus módulos asociados.
```json
{
  "success": true,
  "message": "Sociedad obtenida correctamente",
  "code": 200,
  "data": [
    {
      "id": 73,
      "currentStep": "datos-sociedad",
      "society": {
        "id": "019b3d90-...",
        "reasonSocial": "Fondo Andino de Inversión",
        "ruc": "20601234567",
        "hasDirectory": true,
        "registrationDate": "2025-03-10T00:00:00.000Z",
        "commercialName": "Fondo Andino",
        "typeSociety": {
          "acronimo": "S.A.C."
        }
      },
      "actions": null,
      "shareholder": null,
      "allocationShare": null,
      "directory": null,
      "powerRegime": null,
      "AttorneyRegistry": null,
      "Quorum": null,
      "specialAgreements": null
    }
  ]
}
```
> Los campos anidados irán tomando valor a medida que se completan los demás pasos.

---

## Listar perfiles disponibles
- **Método:** `GET`
- **Ruta:** `/api/v2/society-profile/list`
- **Respuesta (`200`):** lista corta para tableros.
```json
{
  "success": true,
  "message": "Lista de sociedades obtenida correctamente",
  "code": 200,
  "data": [
    {
      "id": 73,
      "razonSocial": "Fondo Andino de Inversión",
      "ruc": "20601234567",
      "directorio": true,
      "fechaRegistroSociedad": "2025-03-10T00:00:00.000Z",
      "nombreComercial": "Fondo Andino",
      "tipoSociedad": "S.A.C.",
      "pasoActual": "datos-sociedad"
    }
  ]
}
```
- Para usuarios administradores, el backend devuelve todos los perfiles del estudio; para otros, sólo los asignados.

---

## Eliminar perfil
- **Método:** `DELETE`
- **Ruta:** `/api/v2/society-profile/{structureId}`
- **Respuesta (`200`):**
```json
{
  "success": true,
  "message": "Sociedad eliminada correctamente.",
  "code": 200
}
```
- Se trata de una baja lógica; los registros hijos permanecen asociados.

---

## Errores frecuentes
| Código | Motivo | Recomendación |
| --- | --- | --- |
| `400` | Paso inválido o body mal formado | Enviar un valor del enum `SocietyRegisterStep` |
| `401` | Token ausente o inválido | Reautenticar |
| `403` | Usuario sin permisos (`ModuleAccess.SOCIETY`) | Verificar rol/permisos |
| `404` | `structureId` inexistente | Confirmar ID antes de consumir |
| `409` | Perfil ya tiene sociedad asociada al crear | Capturar mensaje y guiar al usuario |

## Checklist Frontend
- Guardar el `structureId` apenas se cree el perfil.
- Mantener un mapa UI → `SocietyRegisterStep` para actualizar el progreso.
- Mostrar la lista usando `/list`; sólo si el usuario necesita detalle profundo invocar `GET {id}`.
- Ante el `DELETE`, refrescar tableros y limpiar estados locales.
- Validar respuestas de error para informar conflictos (por ejemplo, RUC existente en el siguiente paso).
