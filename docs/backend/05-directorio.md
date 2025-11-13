# Directorio (v2)

## Contexto

Define la composición y reglas del directorio de la sociedad. Incluye la configuración del órgano y la gestión de directores individuales. Todos los endpoints se protegen con `Bearer <token>` y requieren permisos sobre el módulo `SOCIETY`.

- **Base path:** `/api/v2/society-profile/{societyProfileId}/directorio`
- **Dependencias:** `societyProfileId` válido creado en pasos previos.

---

## 1. Configurar directorio

### Crear

- **Método:** `POST`
- **Body (`CrearDirectorioSchema`):**
  | Campo | Tipo | Descripción |
  | --- | --- | --- |
  | `cantidadDirectores` | number? | Requerido si `conteoPersonalizado = false`. Número total fijo de directores. |
  | `conteoPersonalizado` | boolean? | Indica si se usará rango (`minimoDirectores`/`maximoDirectores`). Por defecto `false`. |
  | `minimoDirectores` | number? | Obligatorio si `conteoPersonalizado = true`. |
  | `maximoDirectores` | number? | Igual que anterior, debe ser ≥ `minimoDirectores`. |
  | `inicioMandato` | string? | Fecha `dd-mm-aaaa`. |
  | `finMandato` | string? | Fecha `dd-mm-aaaa`. |
  | `quorumMinimo` | number? | Cantidad mínima para sesionar. |
  | `mayoria` | number? | Votos necesarios para aprobar. |
  | `presidenteDesignado` | boolean? | `true` por defecto. |
  | `secretarioAsignado` | boolean? | `true` por defecto. |
  | `reeleccionPermitida` | boolean? | `true` por defecto. |
  | `presidentePreside` | boolean? | `true` por defecto. |
  | `presidenteDesempata` | boolean? | `true` por defecto. |
  | `periodo` | enum? | `a_o`, `dos_a_os`, `tres_a_os`. |

> Las validaciones Zod aseguran coherencia: si se activa conteo personalizado debe enviarse el rango; si no, `cantidadDirectores`.

### Respuesta (`201`)

```json
{
  "success": true,
  "message": "Directorio creado correctamente.",
  "code": 201,
  "data": "019b3210-aaaa-bbbb-cccc-1234567890ab"
}
```

### Actualizar

- **Método:** `PUT`
- **Body (`ActualizarDirectorioSchema`):** mismos campos opcionales; respeta la relación entre mínimos/máximos.
- **Respuesta (`200`):** mensaje de éxito.

### Consultar

- **Método:** `GET`
- **Respuesta (`200`):** instancia de `DirectorioQueryResponseDto`.

```json
{
  "success": true,
  "data": {
    "id": "019b3210-...",
    "cantidadDirectores": 3,
    "conteoPersonalizado": false,
    "inicioMandato": "01-07-2024",
    "finMandato": "01-07-2025",
    "quorumMinimo": 2,
    "mayoria": 2,
    "presidenteDesignado": true,
    "secretarioAsignado": true,
    "reeleccionPermitida": true,
    "presidentePreside": true,
    "presidenteDesempata": true,
    "periodo": "ONE_YEAR",
    "presidenteId": "019b3210-..."
  }
}
```

> Las fechas llegan en formato `dd-mm-aaaa` gracias a `DateUtils.formatToSpanish`.

---

## 2. Gestión de directores (`/directores`)

### Crear director

- **Método:** `POST /directores`
- **Body (`CrearDirectorSchema`):**
  | Campo | Tipo | Regla |
  | --- | --- | --- |
  | `personaId` | uuid | Debe referenciar una persona válida (natural o jurídica) en el sistema. |
  | `rolDirector` | enum | `TITULAR`, `SUPLENTE`, `ALTERNO`. |
  | `reemplazaId` | uuid? | Obligatorio si `rolDirector = ALTERNO`. |

- **Respuesta (`201`):** devuelve `id` del director creado.

### Actualizar director

- **Método:** `PUT /directores/{directorId}`
- **Body (`ActualizarDirectorSchema`):**
  | Campo | Descripción |
  | --- | --- |
  | `accion` | `REMOVE`, `DESIGNATE`, `CONTINUE`. Define operación sobre el director. |

> El backend interpreta estas acciones para mantener historial: `REMOVE` marca baja, `DESIGNATE` asigna cargo (p.ej. presidente), `CONTINUE` mantiene el estado.

### Listar directores

- **Método:** `GET /directores`
- **Query opcional:**
  - `cursor`: paginación.
  - `buscar`: texto libre (nombres, documento, etc.).
- **Respuesta (`200`):** `PaginatedCursorResponseDto<DirectorQueryResponseDto>`

```json
{
  "success": true,
  "data": {
    "datos": [
      {
        "id": "019b33dd-...",
        "personaId": "019aad12-...",
        "rolDirector": "TITULAR",
        "reemplazaId": null,
        "accion": "CONTINUE",
        "fechaCreacion": "2025-11-13T17:02:20.000Z",
        "fechaActualizacion": "2025-11-13T17:02:20.000Z"
      }
    ],
    "paginacion": {
      "siguienteCursor": null,
      "tieneSiguientePagina": false,
      "totalElementos": 1,
      "totalPaginas": 1
    }
  }
}
```

### Eliminar director

- **Método:** `DELETE /directores/{directorId}`
- **Respuesta (`200`):** confirma eliminación lógica.

### Asignar presidente

- **Método:** `PATCH /directores/{directorId}/presidente`
- **Body:** ninguno. Marca al director como presidente dentro del directorio.

---

## Consideraciones de negocio

- `personaId` debe existir en el catálogo de personas del flujo (consultar módulo de representantes si es necesario).
- Al usar `conteoPersonalizado`, validar que front capture rangos coherentes y muestre errores devueltos por backend.
- La asignación de presidente actualiza el `presidenteId` visible en el `GET` del directorio.
- Fechas se esperan en formato español `dd-mm-aaaa`; convierte desde ISO antes de enviar.

## Errores frecuentes

| Código | Motivo                                                  | Acción sugerida                        |
| ------ | ------------------------------------------------------- | -------------------------------------- |
| `400`  | Validaciones Zod (rangos inconsistentes, enum inválido) | Mostrar mensajes devueltos por backend |
| `401`  | Token inválido                                          | Reautenticar                           |
| `403`  | Falta de permisos                                       | Validar rol del usuario                |
| `404`  | Directorio o director inexistente                       | Refrescar datos                        |
| `409`  | Conflictos (duplicidad de personas)                     | Gestionar alerta en UI                 |

## Checklist Frontend

- Mantener `societyProfileId` en estado global.
- Implementar formularios con dependencias (`ALTERNO` requiere `reemplazaId`).
- Sincronizar listados con paginación por cursor.
- Mostrar en UI el presidente actual usando `presidenteId`.
- Resaltar los flags booleanos (reelección, tiebreak) para el documento final.
