# Datos Principales de la Sociedad (v2)

## Contexto
Este módulo registra y mantiene la información base de la sociedad. Desde la versión más reciente se trabaja con **UUIDs generados por el frontend** y se utilizan enums para tipo de sociedad y oficina registral.

- **Base path:** `/api/v2/society-profile/{structureId}/society`
- **Auth:** `Bearer <token>`
- **Dependencias:** haber creado previamente el perfil (`structureId`).

## Reglas generales
- Debes generar un UUID para `id` antes de invocar el `POST`. Usa `crypto.randomUUID()` o equivalente.
- Los nombres de campo en las solicitudes están en español (`razonSocial`, `tipoSociedad`, etc.). Las respuestas (`GET`) retornan los atributos en inglés (`reasonSocial`, `typeSociety`, ...).
- Al crear, el backend vincula automáticamente la sociedad con el `structureId` y bloquea duplicados por RUC.

---

## Crear datos de sociedad
- **Método:** `POST`
- **Ruta:** `/api/v2/society-profile/{structureId}/society`
- **Body (`SocietyDto`):**
| Campo | Tipo | Validaciones |
| --- | --- | --- |
| `id` | string (uuid) | Obligatorio. UUID generado por el cliente. |
| `ruc` | string | Largo exacto 11, sólo dígitos. |
| `razonSocial` | string | 1–255 caracteres. |
| `tipoSociedad` | enum `TypeSociety` | Ver tabla más abajo. |
| `nombreComercial` | string | 1–255 caracteres. |
| `direccion` | string | Obligatoria. |
| `distrito` | string | Obligatorio. |
| `provincia` | string | Obligatorio. |
| `departamento` | string | Obligatorio. |
| `fechaRegistro` | string (ISO) | Convertido a `Date`. No puede ser futura. |
| `actividadExtranjera` | string | Obligatoria (>=2 caracteres). |
| `fechaEscritura` | string (ISO) | Opcional. No puede ser posterior a `fechaRegistro`. |
| `oficinaRegistral` | enum `RegistryOffice` | Código de 3 letras (ver tabla). |
| `partidaRegistral` | string | ≥3 caracteres. |

### Ejemplo de request
```json
{
  "id": "019b3d90-aaaa-bbbb-cccc-1234567890ab",
  "ruc": "20601234567",
  "razonSocial": "Fondo Andino de Inversión",
  "tipoSociedad": "S.A.C.",
  "nombreComercial": "Fondo Andino",
  "direccion": "Av. La Paz 789",
  "distrito": "Miraflores",
  "provincia": "Lima",
  "departamento": "Lima",
  "fechaRegistro": "2025-03-10",
  "actividadExtranjera": "Sin actividades en el extranjero",
  "fechaEscritura": "2025-01-25",
  "oficinaRegistral": "LIM",
  "partidaRegistral": "123456789"
}
```

### Respuesta (`201`)
```json
{
  "success": true,
  "message": "Society creada correctamente.",
  "code": 201,
  "data": "019b3d90-aaaa-bbbb-cccc-1234567890ab"
}
```
> El `data` devuelto es el mismo UUID enviado en `id`.

---

## Actualizar datos principales
- **Método:** `PUT`
- **Ruta:** `/api/v2/society-profile/{structureId}/society`
- **Body:** idéntico al `POST` (debe incluir `id`).
- **Respuesta (`200`):**
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
- **Ruta:** `/api/v2/society-profile/{structureId}/society`
- **Respuesta (`200`):**
```json
{
  "success": true,
  "message": "Society obtenida correctamente.",
  "code": 200,
  "data": {
    "id": "019b3d90-aaaa-bbbb-cccc-1234567890ab",
    "ruc": "20601234567",
    "reasonSocial": "Fondo Andino de Inversión",
    "typeSociety": "S.A.C.",
    "commercialName": "Fondo Andino",
    "address": "Av. La Paz 789",
    "district": "Miraflores",
    "province": "Lima",
    "department": "Lima",
    "registrationDate": "2025-03-10T00:00:00.000Z",
    "foreignActivity": "Sin actividades en el extranjero",
    "publicDeedDate": "2025-01-25T00:00:00.000Z",
    "registryOffice": "LIM",
    "registrationRecord": "123456789"
  }
}
```
- Obsérvese que los nombres de campo cambian a formato inglés en la respuesta.

---

## Eliminar datos principales
- **Método:** `DELETE`
- **Ruta:** `/api/v2/society-profile/{structureId}/society`
- **Respuesta (`200`):** baja lógica de la sociedad asociada al perfil.

### Toggle de directorio (opcional)
- **Método:** `PATCH /toggle-directory`
- Útil sólo para tipos `S.A.S.` y `B.I.C.` (los demás son obligatorios o no permiten directorio).

---

## Enum `TypeSociety`
| Valor | Descripción |
| --- | --- |
| `S.A.` | Sociedad Anónima |
| `S.A.C.` | Sociedad Anónima Cerrada |
| `S.A.A.` | Sociedad Anónima Abierta |
| `S.R.L.` | Sociedad de Responsabilidad Limitada |
| `S. Civ. R.L.` | Sociedad Civil de Responsabilidad Limitada |
| `S.C.` | Sociedad Colectiva |
| `S. en C.` | Sociedad en Comandita |
| `S.A.S.` | Sociedad por Acciones Cerrada Simplificada |
| `B.I.C.` | Sociedad de Beneficio e Interés Colectivo |
| `E.I.R.L.` | Empresa Individual de Responsabilidad Limitada |

> Directorio obligatorio: `S.A.`, `S.A.C.`, `S.A.A.`. Directorio opcional: `S.A.S.`, `B.I.C.`. El resto no admite directorio.

## Enum `RegistryOffice`
| Código | Oficina Registral |
| --- | --- |
| `LIM` | Lima |
| `ABA` | Abancay |
| `AND` | Andahuaylas |
| `ARE` | Arequipa |
| `AYA` | Ayacucho |
| `BAG` | Bagua |
| `BAR` | Barranca |
| `CAJ` | Cajamarca |
| `CAL` | Callao |
| `CAM` | Camaná |
| `CAS` | Casma |
| `CAP` | Castilla (Aplao) |
| `CAÑ` | Cañete |
| `CHA` | Chachapoyas |
| `CHE` | Chepén |
| `CHI` | Chiclayo |
| `CHM` | Chimbote |
| `CHN` | Chincha |
| `CHO` | Chota |
| `CUS` | Cusco |
| `ESP` | Espinar |
| `HUA` | Huacho |
| `HUM` | Huamachuco |
| `HUV` | Huancavelica |
| `HUY` | Huancayo |
| `HUN` | Huanta |
| `HUC` | Huánuco |
| `HUR` | Huaral |
| `HZ` | Huaraz |
| `ICA` | Ica |
| `ILO` | Ilo |
| `IMO` | Islay (Mollendo) |
| `JAE` | Jaén |
| `JUI` | Juanjuí |
| `JUL` | Juliaca |
| `LMC` | La Merced |
| `MDD` | Madre de Dios |
| `MAY` | Maynas |
| `MOQ` | Moquegua |
| `MOY` | Moyobamba |
| `NAZ` | Nazca |
| `OTU` | Otuzco |
| `PAS` | Pasco |
| `PIS` | Pisco |
| `PIU` | Piura |
| `PUC` | Pucallpa |
| `PUN` | Puno |
| `QUI` | Quillabamba |
| `SPE` | San Pedro |
| `SAT` | Satipo |
| `SIC` | Sicuani |
| `SUL` | Sullana |
| `TAC` | Tacna |
| `TAR` | Tarapoto / Tarma (según SUNARP) |
| `TIN` | Tingo María |
| `TRU` | Trujillo |
| `TUM` | Tumbes |
| `YUR` | Yurimaguas |

> El enum en código contiene los mismos acrónimos. Si necesitas otro valor, consúltalo en `RegistryOffice` dentro del repositorio.

---

## Errores frecuentes
| Código | Motivo | Acción sugerida |
| --- | --- | --- |
| `400` | Validaciones Zod (UUID faltante, RUC inválido, enum incorrecto) | Mostrar mensajes devueltos por backend |
| `401` | Token ausente/expirado | Reautenticar |
| `403` | Usuario sin permiso `SOCIETY` | Revisar rol/permisos |
| `404` | La sociedad aún no existe (al hacer `GET`/`DELETE`) | Confirmar que se ejecutó el `POST`|
| `409` | RUC duplicado o fechas inconsistentes | Solicitar corrección al usuario |

## Checklist Frontend
- Generar `id` (UUID v4 o v7) antes de crear la sociedad.
- Mapear los selects de `tipoSociedad` y `oficinaRegistral` con los enums anteriores.
- Validar fechas en el cliente para evitar `409` por reglas de negocio.
- Refrescar el paso del flujo a `datos-sociedad` mediante `PUT /api/v2/society-profile/{id}` después de crear la sociedad.
- Controlar el comportamiento del botón “Tiene directorio” usando la lógica de tipo de sociedad (obligatorio/opcional).
