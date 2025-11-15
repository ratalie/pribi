# Accionistas (v2)

## Contexto
Una vez creada la sociedad (`/api/v2/society-profile/{id}/society`), utiliza este módulo para registrar y gestionar los **accionistas** asociados al perfil. Todos los endpoints requieren autenticación y autorización para el módulo `SOCIETY`.

- **Base path:** `/api/v2/society-profile/{societyProfileId}/shareholder`
- **Auth:** `Bearer <token>`
- **Scopes:** `ModuleAccess.SOCIETY` con acciones `WRITE`, `UPDATE`, `READ`
- **IDs controlados por el cliente:** cada accionista y cada persona envían su propio `id` (UUID v4/v7). El backend persiste esos valores tal cual, por lo que deben ser únicos.

## Tipologías soportadas
El campo `tipo` define la estructura esperada. Todas las variantes comparten un discriminador `tipo`.

| Tipo (`tipo`)        | Descripción                             | DTO utilizado                                       |
| -------------------- | ---------------------------------------- | --------------------------------------------------- |
| `NATURAL`            | Persona natural                          | `NaturalES`                                         |
| `JURIDICA`           | Persona jurídica                         | `JuridicaES`                                        |
| `SUCURSAL`           | Sucursal de sociedad extranjera          | `SucursalES`                                        |
| `FONDO_INVERSION`    | Fondo de inversión (abierto/cerrado)     | `FondoInversionES`                                  |
| `FIDEICOMISO`        | Patrimonio fideicometido                 | `FideicomisoES`                                     |
| `SUCESION_INDIVISA`  | Sucesión indivisa                        | `SucesionIndivisaES`                                |

> Cada una de estas variantes incluye un campo `id` (UUID) en el objeto `persona`. Ese `id` es responsabilidad del cliente y se utiliza para rastrear la entidad en flujos posteriores.

## Crear un accionista
- **Método:** `POST`
- **Ruta:** `/api/v2/society-profile/{societyProfileId}/shareholder`
- **Body:** depende de `tipo`. Usa las reglas del esquema `PersonaES`.

### Estructura base
```json
{
  "id": "019b0d3a-1234-4567-89ab-0cd1ef234567",
  "persona": {
    "...": "..."
  }
}
```
El campo `id` identifica al accionista dentro del perfil; `persona.id` identifica a la persona asociada. Ambos deben ser UUID únicos.

### Ejemplos por tipo

#### Persona natural
```json
{
  "id": "019b0d3a-1234-4567-89ab-0cd1ef234567",
  "persona": {
    "id": "019b0d3a-aaaa-bbbb-cccc-0cd1ef234567",
    "tipo": "NATURAL",
    "nombre": "Ana",
    "apellidoPaterno": "García",
    "apellidoMaterno": "Soto",
    "tipoDocumento": "DNI",
    "numeroDocumento": "45678912",
    "paisEmision": "PE"
  }
}
```

#### Persona jurídica
```json
{
  "id": "019b0d3a-bbbb-cccc-dddd-0cd1ef234567",
  "persona": {
    "id": "019b0d3a-bbbb-aaaa-eeee-0cd1ef234567",
    "tipo": "JURIDICA",
    "tipoDocumento": "RUC",
    "numeroDocumento": "20601234567",
    "razonSocial": "TechVenture Solutions S.A.C.",
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

#### Sucursal
```json
{
  "id": "019b0d3a-cccc-dddd-eeee-0cd1ef234567",
  "persona": {
    "id": "019b0d3a-cccc-aaaa-ffff-0cd1ef234567",
    "tipo": "SUCURSAL",
    "ruc": "20607654321",
    "nombreSucursal": "Sucursal Centro",
    "partidaRegistral": "12345678",
    "oficinaRegistrada": "Lima",
    "direccionFiscal": "Av. Arequipa 1234, Lima",
    "representante": {
      "nombre": "Carlos",
      "apellidoPaterno": "Mendoza",
      "apellidoMaterno": "Silva",
      "tipoDocumento": "DNI",
      "numeroDocumento": "48901234"
    }
  }
}
```

> Consulta el código para ver ejemplos completos de `FONDO_INVERSION`, `FIDEICOMISO`, `SUCESION_INDIVISA`. Cada uno obliga campos adicionales (fiduciario, representante, etc.).

### Validaciones clave
- IDs (`personaId`, `accionistaId`) siempre en formato UUID.
- RUCs deben contener 11 dígitos (`regex /\d{11}/`).
- Para `ALTERNO`, `reemplazaId` es obligatorio.
- Cuando `tieneRuc` es `true` en fideicomisos, envía `ruc` y `razonSocial`.

### Respuesta (`201`)
```json
{
  "success": true,
  "message": "Accionista creado correctamente.",
  "code": 201,
  "data": {
    "id": "019b0d3a-1234-4567-89ab-0cd1ef234567",
    "person": {
      "id": "019b0d3a-aaaa-bbbb-cccc-0cd1ef234567"
    }
  }
}
```

## Crear múltiples accionistas
- **Método:** `POST`
- **Ruta:** `/api/v2/society-profile/{societyProfileId}/shareholder/many`
- **Body:** arreglo de objetos con la misma estructura base (`id` + `persona.id`).
- **Uso típico:** importación masiva desde un Excel.
- **Respuesta:** `201` sin payload (`message: Accionistas creados correctamente.`).

## Actualizar un accionista
- **Método:** `PUT`
- **Ruta:** `/api/v2/society-profile/{societyProfileId}/shareholder`
- **Body (`ActualizarAccionistaDto`):**
```json
{
  "id": "019b0d3a-1234-4567-89ab-0cd1ef234567",
  "persona": {
    "id": "019b0d3a-aaaa-bbbb-cccc-0cd1ef234567",
    "tipo": "NATURAL",
    "nombre": "Ana",
    "apellidoPaterno": "García",
    "apellidoMaterno": "Soto",
    "tipoDocumento": "PASAPORTE",
    "numeroDocumento": "PA123456",
    "paisEmision": "CL"
  }
}
```
- **Respuesta (`200`):** mensaje OK.

## Listar accionistas
- **Método:** `GET`
- **Ruta:** `/api/v2/society-profile/{societyProfileId}/shareholder`
- **Query opcional:**
  - `cursor`: paginación basada en cursor.
  - `search`: filtro por nombre/documento (según implementación).
- **Respuesta (`200`):** arreglo de `ShareholderReadDto` con la estructura normalizada.

### Ejemplo (recortado)
```json
{
  "success": true,
  "data": [
    {
      "id": "019b0d3a-1234-4567-89ab-0cd1ef234567",
      "person": {
        "tipo": "NATURAL",
        "nombre": "Ana",
        "apellidoPaterno": "García",
        "tipoDocumento": "PASAPORTE",
        "numeroDocumento": "PA123456"
      }
    }
  ]
}
```

## Eliminar (desactivar) accionista
- **Método:** `DELETE`
- **Ruta:** `/api/v2/society-profile/{societyProfileId}/shareholder/{shareholderId}`
- **Respuesta (`200`):** mensaje de éxito.

> El backend realiza una **desactivación lógica**; conserva historial para auditoría.

## Errores frecuentes
| Código | Motivo | Tip | Consideraciones |
| --- | --- | --- | --- |
| `400` | Validaciones Zod | Revisar campos obligatorios según tipo | Errores llegan con detalle `field/message` |
| `401` | Token inválido | Reautenticar | |
| `403` | Falta permiso `WRITE/UPDATE` | Revisar rol | |
| `404` | Accionista inexistente | Confirmar `shareholderId` | |
| `409` | Conflictos de negocio | RUC/Documento duplicado | Manejar en UI |

## Checklist Frontend
- Resolver `societyProfileId` antes de consumir.
- Mapear selects según `tipo` para mostrar campos requeridos.
- Enviar siempre `tipo` y campos obligatorios.
- Guardar el `id` para updates/eliminaciones.
- Manejar paginación con `cursor` cuando haya más de 20 registros (configurable).
