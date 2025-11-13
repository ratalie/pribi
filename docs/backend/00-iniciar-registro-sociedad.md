# Iniciar Registro de Sociedad (v2)

## Resumen
Este endpoint crea un **perfil de sociedad** vacío y devuelve el identificador (`societyProfileId`) requerido para completar los pasos posteriores del flujo.

## Endpoint principal
- **Método:** `POST`
- **Ruta:** `/api/v2/society-profile`
- **Autenticación:** `Bearer <token>` (ver `01-autenticacion.md`)

### Encabezados mínimos
| Header | Valor |
| --- | --- |
| `Authorization` | `Bearer <token>` |
| `Content-Type` | `application/json` (no se envía body, pero mantenlo por consistencia) |

### Body
Este endpoint **no espera body**. El perfil se crea con la información mínima y queda asociado al usuario autenticado.

### Respuesta exitosa (`201`)
```json
{
  "success": true,
  "message": "Sociedad creada correctamente.",
  "code": 201,
  "data": 73
}
```
- `data` contiene el `societyProfileId` numérico. Guárdalo para los siguientes pasos.

## Consultar un perfil específico
- **Método:** `GET`
- **Ruta:** `/api/v2/society-profile/{societyProfileId}`
- **Autenticación:** `Bearer <token>`

### Parámetros de ruta
| Parámetro | Tipo | Reglas |
| --- | --- | --- |
| `societyProfileId` | number | Entero positivo existente |

### Respuesta (`200`)
El controlador devuelve un arreglo con la estructura completa del perfil. Ejemplo simplificado:
```json
{
  "success": true,
  "message": "Sociedad obtenida correctamente",
  "code": 200,
  "data": [
    {
      "id": 73,
      "status": "ACTIVE",
      "steps": [
        {
          "step": "BASIC_DATA",
          "completed": false,
          "updatedAt": "2025-11-13T15:22:11.000Z"
        }
      ]
    }
  ]
}
```
> El contenido exacto depende del progreso del flujo. Usa esta llamada para reconstruir el historial antes de reanudar el registro en frontend.

## Listar perfiles disponibles
- **Método:** `GET`
- **Ruta:** `/api/v2/society-profile/list`
- **Uso típico:** Mostrar un tablero de sociedades iniciadas por el usuario actual.

## Errores frecuentes
| Código | Motivo |
| --- | --- |
| `401` | Token ausente o inválido |
| `403` | Usuario sin permisos `ModuleAccess.SOCIETY` |
| `404` | `societyProfileId` inexistente al consultar |
| `500` | Error interno del flujo de creación |

## Flujo recomendado
1. Autenticar usuario (`01-autenticacion.md`).
2. Invocar `POST /api/v2/society-profile` y guardar el `societyProfileId` devuelto.
3. Continuar con los datos principales (`03-detalles-sociedad.md`).
