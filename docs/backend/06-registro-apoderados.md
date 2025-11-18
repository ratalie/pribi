# Registro de Apoderados (v2)

## Contexto
Permite definir **clases de apoderados** (tipos) y registrar apoderados concretos vinculados a cada clase. Es un paso clave antes del régimen de poderes. Todos los endpoints requieren `Bearer <token>` y permisos `SOCIETY`.

- **Base path:** `/api/v2/society-profile/{societyProfileId}/attorney-register`
- **Flujo:** primero crea clases, luego apoderados.
- **IDs:** las clases y apoderados usan UUID generados por el frontend para mantener la experiencia offline / reintentos idempotentes.

---

## 1. Clases de apoderado (`/classes`)

### Crear clase
- **Método:** `POST /classes`
- **Body (`CrearClaseApoderadoES`):**
```json
{
  "id": "019b3a00-aaaa-bbbb-cccc-1234567890ab",
  "nombre": "Apoderado General"
}
```
- **Validaciones:**  
  - `id` es un **UUID generado por el frontend** (la aplicación define el identificador antes de enviar).  
  - `nombre` obligatorio (`min(1)`).
- **Respuesta (`201`):** confirma creación y puede devolver la estructura completa con el `id` aceptado.

### Actualizar clase
- **Método:** `PUT /classes`
- **Body (`ActualizarClaseApoderadoES`):**
```json
{
  "id": "019b3a00-aaaa-bbbb-cccc-1234567890ab",
  "nombre": "Apoderado Operativo"
}
```
- **Respuesta (`200`):** mensaje OK.

### Eliminar clase
- **Método:** `DELETE /classes/{classId}`
- **Respuesta (`200`):** eliminación lógica.

### Listar clases
- **Método:** `GET /classes`
- **Respuesta (`200`):** arreglo de `ClaseApoderadoReadDto`.
```json
{
  "success": true,
  "data": [
    {
      "id": "019b3a00-...",
      "nombre": "Apoderado General",
      "apoderados": []
    }
  ]
}
```

> La respuesta ya agrupa apoderados asociados, útil para prellenar tableros.

---

## 2. Apoderados (`/attorneys`)

### Esquema de persona (`PersonaES`)
| Tipo | Campos requeridos |
| --- | --- |
| `NATURAL` | `nombre`, `apellidoPaterno`, `apellidoMaterno`, `tipoDocumento (DNI/PASAPORTE)`, `numeroDocumento`, `paisEmision?` |
| `JURIDICA` | `tipoDocumento (default RUC)`, `numeroDocumento`, `razonSocial`, `direccion`, `constituida`, `nombreComercial?`, `distrito?`, `provincia?`, `departamento?`, `pais?` |

### Crear apoderado
- **Método:** `POST /attorneys`
- **Body (`CrearApoderadoES`):**
```json
{
  "id": "019b3c11-aaaa-bbbb-cccc-1234567890ab",
  "claseApoderadoId": "019b3a00-aaaa-bbbb-cccc-1234567890ab",
  "persona": {
    "id": "019b3c11-ffff-eeee-dddd-1234567890ab",
    "tipo": "NATURAL",
    "nombre": "Luis",
    "apellidoPaterno": "Alarcón",
    "apellidoMaterno": "Pérez",
    "tipoDocumento": "DNI",
    "numeroDocumento": "45678910"
  },
}
```

#### Validaciones clave
- `id`: UUID generado por el frontend (permite reintentos idempotentes).  
- `claseApoderadoId`: UUID existente (creado en la sección anterior).
- `persona.id`: UUID propio de la persona asociada; también lo genera el frontend y se reutiliza en actualizaciones.

### Respuesta (`201`)
```json
{
  "success": true,
  "message": "Apoderado creado correctamente.",
  "code": 201
}
```
*(el handler no retorna payload adicional)*

### Actualizar apoderado
- **Método:** `PUT /attorneys`
- **Body (`ActualizarApoderadoES`):** incluye `id` del apoderado y respeta las reglas de fechas.

### Eliminar apoderado
- **Método:** `DELETE /attorneys/{classId}/{attorneyId}`
- **Respuesta (`200`):** confirma baja lógica.

### Listar apoderados
- **Método:** `GET /attorneys`
- **Respuesta (`200`):** arreglo de `ApoderadoReadDto`.
```json
{
  "success": true,
  "data": [
    {
      "id": "019b3c11-...",
      "claseApoderadoId": "019b3a00-...",
      "persona": {
        "tipo": "NATURAL",
        "nombre": "Luis",
        "apellidoPaterno": "Alarcón",
        "tipoDocumento": "DNI",
        "numeroDocumento": "45678910"
      },
      "poderId": null
    }
  ]
}
```

> `poderId` se rellena cuando el apoderado participa en el régimen de poderes (paso 7).

---

## Errores frecuentes
| Código | Motivo | Ejemplo |
| --- | --- | --- |
| `400` | Validaciones Zod (nombre vacío, clase inexistente) | Falta de campos obligatorios |
| `401` | Token inválido/expirado | Reautenticar |
| `403` | Usuario sin permisos | Revisar rol |
| `404` | Clase/apoderado inexistente | Confirmar IDs |
| `409` | Conflictos de negocio | Duplicidad de documento |

## Checklist Frontend
- Solicitar `societyProfileId` antes de cargar el módulo.
- Mantener catálogo de clases en memoria (GET `/classes`).
- Validar formulario con las mismas reglas (nombres obligatorios, documento único).
- Mostrar en UI la relación clase → apoderados usando la respuesta agrupada.
- Conservar `attorneyId` y `classId` para actualizaciones/eliminaciones.
