# Asignación de Acciones (v2)

## Propósito
Relaciona cada accionista con una acción previamente configurada, indicando cantidad, precio, porcentaje pagado y dividendos pendientes.

- **Base path:** `/api/v2/society-profile/{societyProfileId}/asignaciones`
- **Auth:** `Bearer <token>`
- **Dependencias:** requiere acciones (`acctions`) y accionistas creados.

## Crear asignación
- **Método:** `POST`
- **Body (`CrearAsignacionDetalleSchema`):**
```json
{
  "accionId": "019b1f57-cafe-4dec-8fab-1e3953c95b01",
  "accionistaId": "019b0d3a-1234-4567-89ab-0cd1ef234567",
  "cantidadSuscrita": 50,
  "precioPorAccion": 15.6,
  "porcentajePagadoPorAccion": 100,
  "totalDividendosPendientes": 0,
  "pagadoCompletamente": true
}
```

### Validaciones clave
| Campo | Regla |
| --- | --- |
| `accionId`, `accionistaId` | UUID válidos |
| `cantidadSuscrita` | `> 0` (número positivo) |
| `precioPorAccion` | `> 0` |
| `porcentajePagadoPorAccion` | Entre `0` y `100` |
| `totalDividendosPendientes` | `>= 0` |
| `pagadoCompletamente` | Boolean opcional (`true` por defecto) |

### Respuesta (`201`)
```json
{
  "success": true,
  "message": "Asignación de acciones creada correctamente.",
  "code": 201,
  "data": "019b2155-dead-beef-cafe-1234567890ab"
}
```

## Actualizar asignación
- **Método:** `PUT`
- **Ruta:** `/api/v2/society-profile/{societyProfileId}/asignaciones/{assignmentId}`
- **Body (`ActualizarAsignacionDetalleSchema`):** mismos campos que creación **sin** IDs.

```json
{
  "cantidadSuscrita": 125.5,
  "precioPorAccion": 15.1,
  "porcentajePagadoPorAccion": 95,
  "totalDividendosPendientes": 1,
  "pagadoCompletamente": false
}
```

- **Respuesta (`200`):** mensaje OK.

## Listar asignaciones
- **Método:** `GET`
- **Query opcionales:**
  - `cursor`: cursor para paginación.
  - `buscar`: texto libre (ej. por accionista o acción).

### Respuesta (`200`)
```json
{
  "success": true,
  "code": 200,
  "data": {
    "items": [
      {
        "id": "019b2155-...",
        "accion": {
          "id": "019b1f57-...",
          "nombre": "Acción Preferente Serie A"
        },
        "accionista": {
          "id": "019b0d3a-...",
          "tipo": "NATURAL",
          "nombre": "Ana García"
        },
        "cantidadSuscrita": 50,
        "precioPorAccion": 15.6,
        "porcentajePagadoPorAccion": 100,
        "totalDividendosPendientes": 0,
        "pagadoCompletamente": true
      }
    ],
    "pagination": {
      "nextCursor": null,
      "count": 1
    }
  }
}
```

## Eliminar asignación
- **Método:** `DELETE`
- **Ruta:** `/api/v2/society-profile/{societyProfileId}/asignaciones/{assignmentId}`
- **Respuesta (`200`):** `"Asignación de acciones eliminada correctamente."`

## Consideraciones de negocio
- **Integridad:** el backend valida que el accionista y la acción pertenezcan al mismo `societyProfileId`.
- **Dividendos:** `totalDividendosPendientes` se usa para cálculos posteriores (flujo de dividendos), por lo que debe mantenerse actualizado.
- **Pagos parciales:** si `pagadoCompletamente` es `false`, ajusta `porcentajePagadoPorAccion` (< 100) y `totalDividendosPendientes` > 0 según corresponda.

## Errores frecuentes
| Código | Motivo | Acción sugerida |
| --- | --- | --- |
| `400` | Payload inválido (números negativos, UUID mal formados) | Validar formulario lado cliente |
| `401` | Token ausente/expirado | Reautenticar |
| `403` | Usuario sin permiso | Revisar rol/permisos |
| `404` | `assignmentId`, `accionId` o `accionistaId` inexistentes | Refrescar catálogos |
| `409` | Reglas de negocio (duplicidad, cupos) | Mostrar mensaje del backend |

## Checklist Frontend
- Obtener catálogos de accionistas y acciones previamente.
- Usar selects para asegurar IDs correctos.
- Validar números (solo valores positivos, dos decimales si aplica).
- Implementar paginación con cursor cuando existan muchas asignaciones.
- Mostrar mensajes claros cuando el backend responda `409` (ej. “acción ya asignada al accionista”).

