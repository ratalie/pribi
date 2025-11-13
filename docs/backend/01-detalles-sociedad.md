# Datos Principales de la Sociedad (v2)

## Contexto
Una vez creado el perfil con `/api/v2/society-profile`, usa estos endpoints para **registrar, consultar y actualizar** la información principal de la sociedad.

- **Base path:** `/api/v2/society-profile/{societyProfileId}/society`
- **Autenticación:** `Bearer <token>`

## Parámetro de ruta
| Parámetro | Tipo | Regla |
| --- | --- | --- |
| `societyProfileId` | number | ID devuelto por `POST /api/v2/society-profile` |

---

## Crear datos de sociedad
- **Método:** `POST`
- **Ruta completa:** `/api/v2/society-profile/{societyProfileId}/society`

### Body (`CreateSocietyDto`)
| Campo | Tipo | Validaciones |
| --- | --- | --- |
| `ruc` | string | Largo exacto 11 (Zod `min(11)` & `max(11)`) |
| `reasonSocial` | string | Largo mínimo 1, máximo 255 |
| `typeSocietyId` | string | UUID válido |
| `commercialName` | string | Largo mínimo 1, máximo 255 |
| `address` | string | Largo mínimo 1 |
| `district` | string | Largo mínimo 1 |
| `province` | string | Largo mínimo 1 |
| `department` | string | Largo mínimo 1 |
| `registrationDate` | string (ISO) | Se convierte a `Date` (Zod `coerce.date()`) |
| `foreignActivity` | string | Puede ser vacío pero debe enviarse |
| `publicDeedDate` | string (ISO) | Opcional, convierte a `Date` |
| `registryOffice` | string | Largo mínimo 1 |
| `registrationRecord` | string | Largo mínimo 1 |

### Ejemplo de request
```json
{
  "ruc": "20601234567",
  "reasonSocial": "Fondo Andino de Inversión",
  "typeSocietyId": "019a0c24-ecd6-7772-bfa7-626c893ce920",
  "commercialName": "Fondo Andino",
  "address": "Av. La Paz 789, Miraflores",
  "district": "Miraflores",
  "province": "Lima",
  "department": "Lima",
  "registrationDate": "2025-03-10",
  "foreignActivity": "Sin actividades en el extranjero",
  "publicDeedDate": "2025-01-25",
  "registryOffice": "Lima",
  "registrationRecord": "123456789"
}
```

### Respuesta exitosa (`201`)
```json
{
  "success": true,
  "message": "Society creada correctamente.",
  "code": 201,
  "data": "019a10a2-7a42-74a0-acb4-3e34fd46a0ed"
}
```
- `data` es el `societyId` (UUID) interno.

---

## Actualizar datos principales
- **Método:** `PUT`
- **Ruta completa:** `/api/v2/society-profile/{societyProfileId}/society`

### Body (`UpdateSocietyDto`)
Es el mismo esquema que la creación, **agregando** `id`.

| Campo | Tipo | Validaciones adicionales |
| --- | --- | --- |
| `id` | string | UUID válido del registro previamente creado |
| _(resto de campos)_ | | Mismas reglas de `CreateSocietyDto` |

### Ejemplo de request
```json
{
  "id": "019a10a2-7a42-74a0-acb4-3e34fd46a0ed",
  "ruc": "20601234567",
  "reasonSocial": "Fondo Andino de Inversión",
  "typeSocietyId": "019a0c24-ecd6-7772-bfa7-626c893ce920",
  "commercialName": "Fondo Andino Actualizado",
  "address": "Av. Los Libertadores 321, San Isidro",
  "district": "San Isidro",
  "province": "Lima",
  "department": "Lima",
  "registrationDate": "2025-03-10",
  "foreignActivity": "Sin actividades en el extranjero",
  "publicDeedDate": null,
  "registryOffice": "Lima",
  "registrationRecord": "123456789"
}
```

### Respuesta (`200`)
```json
{
  "success": true,
  "message": "Society actualizada correctamente.",
  "code": 200
}
```

---

## Obtener datos actuales
- **Método:** `GET`
- **Ruta completa:** `/api/v2/society-profile/{societyProfileId}/society`

### Respuesta (`200`)
```json
{
  "success": true,
  "message": "Society obtenida correctamente.",
  "code": 200,
  "data": {
    "id": "019a10a2-7a42-74a0-acb4-3e34fd46a0ed",
    "ruc": "20601234567",
    "reasonSocial": "Fondo Andino de Inversión",
    "typeSocietyId": "019a0c24-ecd6-7772-bfa7-626c893ce920",
    "commercialName": "Fondo Andino Actualizado",
    "address": "Av. Los Libertadores 321, San Isidro",
    "district": "San Isidro",
    "province": "Lima",
    "department": "Lima",
    "registrationDate": "2025-03-10T00:00:00.000Z",
    "foreignActivity": "Sin actividades en el extranjero",
    "publicDeedDate": null,
    "registryOffice": "Lima",
    "registrationRecord": "123456789"
  }
}
```

> `registrationDate` y `publicDeedDate` llegan serializados como ISO 8601.

---

## Toggle de directorio (opcional)
- **Método:** `PATCH`
- **Ruta:** `/api/v2/society-profile/{societyProfileId}/society/toggle-directory`
- **Cuerpo:** ninguno. Cambia el flag `hasDirectory` en backend.

---

## Errores comunes
| Código | Motivo |
| --- | --- |
| `400` | Body no cumple con las validaciones Zod |
| `401` | Token ausente/expirado |
| `403` | Usuario sin permiso para el módulo |
| `404` | `societyProfileId` inexistente o sociedad no creada |
| `409` | Conflictos de negocio (por ejemplo RUC duplicado) |
| `500` | Error interno |

## Checklist para frontend
- Autenticar y almacenar `Bearer token`.
- Confirmar que `societyProfileId` válido está disponible antes de llamar a estos endpoints.
- Serializar fechas en formato ISO (`YYYY-MM-DD` es aceptado por el `coerce.date()`).
- Capturar y mostrar errores de validación devueltos por el backend.
