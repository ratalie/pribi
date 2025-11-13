# Capital Social (v2)

## Contexto
Incluye la definición del **valor nominal** y la configuración de **acciones personalizadas**. Ambos recursos viven bajo el mismo `societyProfileId` y requieren token válido.

- **Base paths:**
  - Acciones: `/api/v2/society-profile/{societyProfileId}/acctions`
  - Valor nominal: `/api/v2/society-profile/{societyProfileId}/nominal-value`
- **Auth:** `Bearer <token>`
- **Scopes:** `ModuleAccess.SOCIETY`

---

## Valor nominal de la acción
Representa el monto base con el que se valoran las acciones.

### Crear o actualizar valor nominal
- **Métodos:** `POST` y `PUT`
- **Body (`ValorNominalDto`)**
```json
{
  "valorNominal": 1.63
}
```
- **Validaciones:** `valorNominal > 0` (número positivo).
- **Respuestas:**
  - `POST`: `201` con `data` (UUID del registro).
  - `PUT`: `200` sin `data`.

### Consultar valor nominal actual
- **Método:** `GET`
- **Respuesta (`200`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "019b0e7a-...",
      "valorNominal": 1.63,
      "moneda": "PEN",
      "creadoEn": "2025-11-13T16:20:12.000Z"
    }
  ]
}
```
> Dependiendo de la implementación puede devolver sólo el último registro activo.

### Eliminar valor nominal
- **Método:** `DELETE`
- **Uso:** deja sin valor nominal configurado; ideal para reiniciar un flujo.

---

## Definición de acciones (`acctions`)
Permite registrar tipos de acciones y versiones personalizadas.

### Esquema de creación (`CrearAccionSchema`)
| Campo | Tipo | Reglas |
| --- | --- | --- |
| `accionId` | string | UUID del catálogo base de acciones |
| `tipo` | string | `COMUN` o `CLASE` |
| `nombre` | string | Obligatorio si `tipo = CLASE` |
| `cantidadSuscrita` | number | Entero positivo |
| `redimible` | boolean | Define si es redimible |
| `conDerechoVoto` | boolean | Derecho a voto |
| `otrosDerechosEspeciales` | boolean | Flag para adjuntar archivo |
| `archivoOtrosDerechos` | string | UUID opcional (archivo en repositorio) |
| `regimenObligacionesAdicionales` | boolean | Flag de obligaciones |
| `archivoObligaciones` | string | UUID opcional |

### Crear acción
- **Método:** `POST`
- **Ruta:** `/api/v2/society-profile/{societyProfileId}/acctions`
- **Ejemplo payload**
```json
{
  "accionId": "019b1f57-cafe-4dec-8fab-1e3953c95b01",
  "tipo": "CLASE",
  "nombre": "Acción Preferente Serie A",
  "cantidadSuscrita": 1000,
  "redimible": true,
  "conDerechoVoto": false,
  "otrosDerechosEspeciales": true,
  "archivoOtrosDerechos": "019b2000-aaaa-bbbb-cccc-d11111111111",
  "regimenObligacionesAdicionales": false
}
```
- **Respuesta (`201`):** devuelve `id` UUID de la acción creada.

### Actualizar acción
- **Método:** `PUT`
- **Ruta:** `/api/v2/society-profile/{societyProfileId}/acctions`
- **Body (`ActualizarAccionShema`):** igual que creación pero con `id`.

### Listar acciones
- **Método:** `GET`
- **Query opcional:**
  - `cursor`: paginación por cursor.
  - `search`: filtro (nombre, tipo, etc.).
- **Respuesta típica**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "019b1f57-...",
        "nombre": "Acción Preferente Serie A",
        "tipo": "CLASE",
        "cantidadSuscrita": 1000,
        "redimible": true,
        "conDerechoVoto": false,
        "otrosDerechosEspeciales": true
      }
    ],
    "pagination": {
      "nextCursor": null,
      "count": 1
    }
  }
}
```

### Eliminar acciones
- **Método:** `DELETE`
- **Body:** arreglo de UUIDs a eliminar.
```json
[
  "019b1f57-cafe-4dec-8fab-1e3953c95b01",
  "019b1f57-dead-4dec-8fab-1e3953c95b02"
]
```
- **Respuesta:** mensaje confirmando eliminación individual o múltiple.

---

## Relación con otros módulos
- El `accionId` se vincula con catálogos internos (tipos de acción base).
- Las acciones creadas aquí se usan después en la asignación de acciones (ver `04-asignacion-acciones.md`).
- `archivoOtrosDerechos` y `archivoObligaciones` referencian uploads administrados por el módulo de archivos (asegúrate de contar con el `fileId`).

## Errores frecuentes
| Código | Motivo | Recomendación |
| --- | --- | --- |
| `400` | Número negativo, UUID inválido, nombre faltante | Validar formularios antes de enviar |
| `401` | Token inválido | Reautenticar |
| `403` | Falta permiso `WRITE` | Validar roles | 
| `404` | Acción o perfil inexistente | Confirmar `societyProfileId` o `id` |
| `409` | Duplicidad (p.ej. mismo nombre) | Mostrar mensaje específico |

## Checklist Frontend
- Obtener `societyProfileId` previamente.
- Mostrar combos con catálogos (`accionId`).
- Forzar nombre cuando `tipo = CLASE`.
- Normalizar números a decimal (usa `Number` y controla locale).
- Manejar paginación con cursor.
- Mostrar estados de archivos adjuntos (subidos/pendientes).
